import asyncio
import base64
import json
import logging
import os
import warnings

from agenticlayer.otel import setup_otel  # type: ignore[import-untyped]

from agent import root_agent
from agenticlayer.agent_to_a2a import to_a2a  # type: ignore[import-untyped]
from callbacks import LiveEventMonitorPlugin
from dotenv import load_dotenv
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
from starlette.responses import RedirectResponse
from starlette.routing import Route, WebSocketRoute
from starlette.websockets import WebSocket
from a2a.client import A2ACardResolver, ClientFactory
from a2a.client.client import ClientConfig
from a2a.types import TransportProtocol
import httpx

warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

load_dotenv()

APP_NAME = "Claims Voice Agent"

# Configure logging and OpenTelemetry
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

setup_otel()

# Initialize A2A Client for claims-analysis-agent
claims_analysis_agent_url = os.getenv("CLAIMS_ANALYSIS_AGENT_URL", "http://claims-analysis-agent:8000")
claims_analysis_a2a_client = None
claims_analysis_agent_card = None

async def get_claims_analysis_a2a_client():
    """Get or create the A2A client for claims-analysis-agent."""
    global claims_analysis_a2a_client, claims_analysis_agent_card

    if claims_analysis_a2a_client is None:
        async with httpx.AsyncClient(timeout=httpx.Timeout(timeout=30)) as client:
            resolver = A2ACardResolver(
                httpx_client=client,
                base_url=claims_analysis_agent_url,
            )
            claims_analysis_agent_card = await resolver.get_agent_card()

        # Create A2A client
        httpx_client = httpx.AsyncClient(timeout=httpx.Timeout(timeout=60))
        client_config = ClientConfig(
            httpx_client=httpx_client,
            streaming=False,
            polling=False,
            supported_transports=[TransportProtocol.jsonrpc],
        )
        client_factory = ClientFactory(config=client_config)
        claims_analysis_a2a_client = client_factory.create(claims_analysis_agent_card)

        logger.info(f"Initialized A2A client for claims-analysis-agent at {claims_analysis_agent_url}")

    return claims_analysis_a2a_client


async def start_agent_session(user_id, is_audio=False):
    """Starts an agent session"""

    # Create a Runner
    runner = InMemoryRunner(
        app_name=APP_NAME,
        agent=root_agent,
        plugins=[
            LiveEventMonitorPlugin(),
        ],
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

            # Handle user input transcription chunks
            if event.input_transcription and event.partial:
                transcribed_text = event.input_transcription.text
                if transcribed_text:
                    logger.debug(f"[USER INPUT TRANSCRIPTION (partial)]: {transcribed_text}")
                    user_message = {"mime_type": "text/plain", "data": transcribed_text, "is_user_input": True}
                    await websocket.send_text(json.dumps(user_message))
                continue

            # If the turn complete or interrupted, send it
            if event.turn_complete or event.interrupted:
                message = {
                    "turn_complete": event.turn_complete,
                    "interrupted": event.interrupted,
                }
                await websocket.send_text(json.dumps(message))
                logger.debug(f"[AGENT TO CLIENT]: {message}")
                continue

            # Send agent speech transcription chunks
            if event.output_transcription and event.partial:
                transcribed_text = event.output_transcription.text
                if transcribed_text:
                    message = {"mime_type": "text/plain", "data": transcribed_text}
                    await websocket.send_text(json.dumps(message))
                    logger.debug(f"[AGENT TO CLIENT]: transcribed speech (partial): {transcribed_text}")
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
                    logger.debug(f"[AGENT TO CLIENT]: audio/pcm: {len(audio_data)} bytes.")
                    continue
    except WebSocketDisconnect:
        # Normal disconnection - client closed the connection
        pass
    except Exception as e:
        # Log other exceptions but don't crash
        logger.error(f"Error in agent_to_client_messaging: {e}")


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
                logger.debug(f"[CLIENT TO AGENT]: {data}")
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
# Web app - use A2A as base and add custom routes
#


async def root_endpoint(request):
    """Redirect to the frontend service"""
    return RedirectResponse(url="http://localhost:8080")


async def websocket_endpoint(websocket: WebSocket):
    """Client websocket endpoint"""
    # Get query params
    user_id = websocket.path_params.get("user_id")
    is_audio = websocket.query_params.get("is_audio", "false")

    # Wait for client connection
    await websocket.accept()
    logger.info(f"[WS] Client #{user_id} connected (WebSocket ready, session not started yet)")

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
    logger.info(f"Client #{user_id} disconnected")


# Create A2A app and add custom routes
app = to_a2a(root_agent)
app.routes.insert(0, Route("/", root_endpoint))
app.routes.insert(1, WebSocketRoute("/ws/{user_id}", websocket_endpoint))

# Entry point for IDE to start in debug mode
# Make sure that the IDE uses the .env file
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.environ.get("UVICORN_HOST", "localhost"), port=int(os.environ.get("UVICORN_PORT", 8000)))
