import asyncio
import base64
import json
import warnings

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket
from fastapi.responses import RedirectResponse
from google.adk.agents import LiveRequestQueue
from google.adk.agents.run_config import RunConfig, StreamingMode
from google.adk.events.event import Event
from google.adk.runners import InMemoryRunner
from google.genai import types
from google.genai.types import (
    Blob,
    Content,
    Part,
)

from .agent import root_agent

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

load_dotenv()

APP_NAME = "Claims Voice Agent"


async def start_agent_session(user_id, is_audio=False):
    """Starts an agent session"""

    # Create a Runner
    runner = InMemoryRunner(
        app_name=APP_NAME,
        agent=root_agent,
    )

    # Create a Session
    session = await runner.session_service.create_session(
        app_name=APP_NAME,
        user_id=user_id,
    )

    # Set response modality
    modality = "AUDIO" if is_audio else "TEXT"
    run_config = RunConfig(
        response_modalities=[modality],
        session_resumption=types.SessionResumptionConfig(),
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name="Charon"  # See available voices at https://ai.google.dev/gemini-api/docs/speech-generation#voices
                )
            ),
            language_code="de-DE",
        ),
        streaming_mode=StreamingMode.BIDI,
        output_audio_transcription=types.AudioTranscriptionConfig(),
        input_audio_transcription=types.AudioTranscriptionConfig(),
    )

    # Create a LiveRequestQueue for this session
    live_request_queue = LiveRequestQueue()

    # Start agent session
    live_events = runner.run_live(
        session=session,
        live_request_queue=live_request_queue,
        run_config=run_config,
    )
    return live_events, live_request_queue


async def agent_to_client_messaging(websocket, live_events):
    """Agent to client communication"""
    from starlette.websockets import WebSocketDisconnect

    try:
        async for event in live_events:
            event: Event

            # Handle user input transcription chunks (send them as they come)
            if event.content and event.content.role == "user":
                if text := event.content.parts[0].text:
                    print(f"[USER INPUT CHUNK]: {text}")
                    # Send partial user transcription chunk
                    user_message = {"mime_type": "text/plain", "data": text, "is_user_input": True}
                    await websocket.send_text(json.dumps(user_message))
                continue

            # If the turn complete or interrupted, send it
            if event.turn_complete or event.interrupted:
                message = {
                    "turn_complete": event.turn_complete,
                    "interrupted": event.interrupted,
                }
                await websocket.send_text(json.dumps(message))
                print(f"[AGENT TO CLIENT]: {message}")
                continue

            # Read the Content and its first Part
            part: Part = event.content and event.content.parts and event.content.parts[0]
            if not part:
                continue

            # If it's audio, send Base64 encoded audio data
            is_audio = part.inline_data and part.inline_data.mime_type.startswith("audio/pcm")
            if is_audio:
                audio_data = part.inline_data and part.inline_data.data
                if audio_data:
                    message = {"mime_type": "audio/pcm", "data": base64.b64encode(audio_data).decode("ascii")}
                    await websocket.send_text(json.dumps(message))
                    print(f"[AGENT TO CLIENT]: audio/pcm: {len(audio_data)} bytes.")
                    continue

            # If it's text and a partial text, send it
            if part.text and event.partial:
                message = {"mime_type": "text/plain", "data": part.text}
                await websocket.send_text(json.dumps(message))
                print(f"[AGENT TO CLIENT]: text/plain: {message}")
    except WebSocketDisconnect:
        # Normal disconnection - client closed the connection
        pass
    except Exception as e:
        # Log other exceptions but don't crash
        print(f"Error in agent_to_client_messaging: {e}")


async def client_to_agent_messaging(websocket, live_request_queue):
    """Client to agent communication"""
    from starlette.websockets import WebSocketDisconnect

    try:
        while True:
            # Decode JSON message
            message_json = await websocket.receive_text()
            message = json.loads(message_json)
            mime_type = message["mime_type"]
            data = message["data"]

            # Send the message to the agent
            if mime_type == "text/plain":
                # Send a text message
                content = Content(role="user", parts=[Part.from_text(text=data)])
                live_request_queue.send_content(content=content)
                print(f"[CLIENT TO AGENT]: {data}")
            elif mime_type == "audio/pcm":
                # Send an audio data
                decoded_data = base64.b64decode(data)
                live_request_queue.send_realtime(Blob(data=decoded_data, mime_type=mime_type))
            else:
                raise ValueError(f"Mime type not supported: {mime_type}")
    except WebSocketDisconnect:
        # Normal disconnection - client closed the connection
        pass


#
# FastAPI web app
#

app = FastAPI()


@app.get("/")
async def root():
    """Redirect to the frontend service"""
    return RedirectResponse(url="http://localhost:8080")


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, is_audio: str = "false"):
    """Client websocket endpoint"""

    # Wait for client connection
    await websocket.accept()
    print(f"Client #{user_id} connected, audio mode: {is_audio}")

    # Start agent session
    user_id_str = str(user_id)
    live_events, live_request_queue = await start_agent_session(user_id_str, is_audio == "true")

    # Start tasks
    agent_to_client_task = asyncio.create_task(agent_to_client_messaging(websocket, live_events))
    client_to_agent_task = asyncio.create_task(client_to_agent_messaging(websocket, live_request_queue))

    # Wait until the websocket is disconnected or an error occurs
    tasks = [agent_to_client_task, client_to_agent_task]
    await asyncio.wait(tasks, return_when=asyncio.FIRST_EXCEPTION)

    # Close LiveRequestQueue
    live_request_queue.close()

    # Disconnected
    print(f"Client #{user_id} disconnected")


def main():
    """Main entry point for the agent"""
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
