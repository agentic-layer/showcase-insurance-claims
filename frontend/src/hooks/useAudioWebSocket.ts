import { useCallback, useRef, useState } from 'react';

interface AudioWebSocketMessage {
  mime_type: 'text/plain' | 'audio/pcm';
  data: string;
  is_user_input?: boolean;
  turn_complete?: boolean;
  interrupted?: boolean;
}

interface UseAudioWebSocketProps {
  onMessage?: (message: AudioWebSocketMessage) => void;
  sessionId?: string;
  wsUrl?: string;
}

export const useAudioWebSocket = ({
  onMessage,
  sessionId,
  wsUrl = 'ws://localhost:8000'
}: UseAudioWebSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const websocket = useRef<WebSocket | null>(null);
  const audioPlayerNode = useRef<AudioWorkletNode | null>(null);
  const audioPlayerContext = useRef<AudioContext | null>(null);
  const audioRecorderNode = useRef<AudioWorkletNode | null>(null);
  const audioRecorderContext = useRef<AudioContext | null>(null);
  const micStream = useRef<MediaStream | null>(null);
  const audioBuffer = useRef<Uint8Array[]>([]);
  const bufferTimer = useRef<NodeJS.Timeout | null>(null);

  const startAudioPlayerWorklet = useCallback(async () => {
    const audioContext = new AudioContext({ sampleRate: 24000 });
    const workletURL = '/js/pcm-player-processor.js';
    await audioContext.audioWorklet.addModule(workletURL);
    const audioPlayerNodeInstance = new AudioWorkletNode(audioContext, 'pcm-player-processor');
    audioPlayerNodeInstance.connect(audioContext.destination);
    return [audioPlayerNodeInstance, audioContext] as const;
  }, []);

  const convertFloat32ToPCM = useCallback((inputData: Float32Array): ArrayBuffer => {
    const pcm16 = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      pcm16[i] = inputData[i] * 0x7fff;
    }
    return pcm16.buffer;
  }, []);

  const startAudioRecorderWorklet = useCallback(async (audioRecorderHandler: (pcmData: ArrayBuffer) => void) => {
    const audioRecorderContextInstance = new AudioContext({ sampleRate: 16000 });
    const workletURL = '/js/pcm-recorder-processor.js';
    await audioRecorderContextInstance.audioWorklet.addModule(workletURL);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } });
    const source = audioRecorderContextInstance.createMediaStreamSource(stream);
    const audioRecorderNodeInstance = new AudioWorkletNode(audioRecorderContextInstance, 'pcm-recorder-processor');

    source.connect(audioRecorderNodeInstance);
    audioRecorderNodeInstance.port.onmessage = (event) => {
      const pcmData = convertFloat32ToPCM(event.data);
      audioRecorderHandler(pcmData);
    };

    return [audioRecorderNodeInstance, audioRecorderContextInstance, stream] as const;
  }, [convertFloat32ToPCM]);

  const base64ToArray = useCallback((base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }, []);

  const arrayBufferToBase64 = useCallback((buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }, []);

  const sendMessage = useCallback((message: AudioWebSocketMessage) => {
    if (websocket.current && websocket.current.readyState === WebSocket.OPEN) {
      const messageJson = JSON.stringify(message);
      websocket.current.send(messageJson);
    }
  }, []);

  const audioRecorderHandler = useCallback((pcmData: ArrayBuffer) => {
    audioBuffer.current.push(new Uint8Array(pcmData));

    if (!bufferTimer.current) {
      bufferTimer.current = setInterval(() => {
        if (audioBuffer.current.length === 0) return;

        let totalLength = 0;
        for (const chunk of audioBuffer.current) {
          totalLength += chunk.length;
        }

        const combinedBuffer = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of audioBuffer.current) {
          combinedBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        sendMessage({
          mime_type: 'audio/pcm',
          data: arrayBufferToBase64(combinedBuffer.buffer)
        });

        audioBuffer.current = [];
      }, 200);
    }
  }, [sendMessage, arrayBufferToBase64]);

  const connectWebSocket = useCallback((forceAudioMode?: boolean) => {
    const targetAudioMode = forceAudioMode !== undefined ? forceAudioMode : isAudioMode;

    // If we have an existing connection but are switching modes, close it
    if (websocket.current &&
        (websocket.current.readyState === WebSocket.CONNECTING ||
         websocket.current.readyState === WebSocket.OPEN)) {

      // Check if we need to switch modes
      const currentUrl = websocket.current.url;
      const currentAudioMode = currentUrl.includes('is_audio=true');

      if (currentAudioMode === targetAudioMode) {
        console.log('WebSocket already connected with correct audio mode, skipping');
        return;
      } else {
        console.log(`Switching audio mode from ${currentAudioMode} to ${targetAudioMode}, reconnecting...`);
        websocket.current.close();
      }
    }

    // Close existing connection if it exists
    if (websocket.current && websocket.current.readyState !== WebSocket.CLOSED) {
      websocket.current.close();
    }

    const currentSessionId = sessionId || Math.random().toString().substring(10);
    // Use dynamic URL to work in both local and cluster deployments
    const audioMode = forceAudioMode !== undefined ? forceAudioMode : isAudioMode;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const directUrl = `${wsProtocol}//${window.location.host}/ws/${currentSessionId}?is_audio=${audioMode}`;

    console.log('Creating new WebSocket connection to:', directUrl);
    websocket.current = new WebSocket(directUrl);

    websocket.current.onopen = async () => {
      console.log('WebSocket connection opened.');
      setIsConnected(true);
      // Initialize audio player for TTS
      if (!audioPlayerNode.current) {
        try {
          const [playerNode, playerContext] = await startAudioPlayerWorklet();
          audioPlayerNode.current = playerNode;
          audioPlayerContext.current = playerContext;
          console.log('Audio player initialized for TTS');
        } catch (error) {
          console.error('Failed to initialize audio player:', error);
        }
      }
    };

    websocket.current.onmessage = (event) => {
      const messageFromServer: AudioWebSocketMessage = JSON.parse(event.data);
      console.log('[AGENT TO CLIENT]', messageFromServer);

      if (messageFromServer.interrupted && audioPlayerNode.current) {
        audioPlayerNode.current.port.postMessage({ command: 'endOfAudio' });
        return;
      }

      // Play audio if available (matching basic frontend)
      if (messageFromServer.mime_type === 'audio/pcm' && audioPlayerNode.current) {
        console.log('Playing TTS audio, size:', messageFromServer.data.length);
        // Resume audio context if suspended (needed for TTS)
        if (audioPlayerContext.current && audioPlayerContext.current.state === 'suspended') {
          audioPlayerContext.current.resume();
        }
        audioPlayerNode.current.port.postMessage(base64ToArray(messageFromServer.data));
      }

      if (onMessage) {
        onMessage(messageFromServer);
      }
    };

    websocket.current.onclose = (event) => {
      console.log('WebSocket connection closed.', event.code, event.reason);
      setIsConnected(false);

      // Don't auto-reconnect if it was a deliberate close (like basic frontend)
      if (event.code === 1000 || event.code === 1001 || event.code === 1005) {
        console.log('WebSocket closed normally, not reconnecting');
        return;
      }

      // Handle audio mode errors specifically
      if (event.code === 1007 && event.reason?.includes('Proactive audio is not supported')) {
        console.log('Audio mode not supported, switching to text mode');
        setIsAudioMode(false);
        setIsRecording(false);
        // eslint-disable-next-line react-hooks/immutability
        connectWebSocket(false);
        return;
      }

      // Only reconnect for unexpected errors
      setTimeout(() => {
        console.log('Reconnecting...');
        connectWebSocket();
      }, 5000);
    };

    websocket.current.onerror = (e) => {
      console.log('WebSocket error:', e);
    };
  }, [sessionId, isAudioMode, onMessage, base64ToArray, startAudioPlayerWorklet]);

  const initializeAudioPlayer = useCallback(async () => {
    if (!audioPlayerNode.current) {
      try {
        const [playerNode, playerContext] = await startAudioPlayerWorklet();
        audioPlayerNode.current = playerNode;
        audioPlayerContext.current = playerContext;
        console.log('Audio player initialized for TTS');
      } catch (error) {
        console.error('Failed to initialize audio player:', error);
      }
    }
  }, [startAudioPlayerWorklet]);

  const startAudio = useCallback(async () => {
    try {
      // Initialize audio worklets first (like basic frontend)
      await initializeAudioPlayer();

      const [recorderNode, recorderContext, stream] = await startAudioRecorderWorklet(audioRecorderHandler);
      audioRecorderNode.current = recorderNode;
      audioRecorderContext.current = recorderContext;
      micStream.current = stream;

      // Set audio mode and reconnect WebSocket (exactly like basic frontend)
      setIsAudioMode(true);
      setIsRecording(true);
      connectWebSocket(true);
    } catch (error) {
      console.error('Failed to start audio:', error);
    }
  }, [initializeAudioPlayer, startAudioRecorderWorklet, audioRecorderHandler, connectWebSocket]);

  const stopAudio = useCallback(() => {
    if (bufferTimer.current) {
      clearInterval(bufferTimer.current);
      bufferTimer.current = null;
    }

    if (micStream.current) {
      micStream.current.getTracks().forEach(track => track.stop());
      micStream.current = null;
    }

    if (audioRecorderContext.current) {
      audioRecorderContext.current.close();
      audioRecorderContext.current = null;
    }

    // Stop audio playback by sending endOfAudio command
    if (audioPlayerNode.current) {
      audioPlayerNode.current.port.postMessage({ command: 'endOfAudio' });
    }

    // Don't close audio player context - keep it for TTS
    // if (audioPlayerContext.current) {
    //   audioPlayerContext.current.close();
    //   audioPlayerContext.current = null;
    // }

    audioRecorderNode.current = null;
    // audioPlayerNode.current = null; // Keep audio player for TTS
    setIsRecording(false);
    setIsAudioMode(false);
    setIsMuted(false);

    // Reconnect with is_audio=false for text mode
    connectWebSocket(false);
  }, [connectWebSocket]);

  const sendTextMessage = useCallback((text: string) => {
    sendMessage({
      mime_type: 'text/plain',
      data: text
    });
  }, [sendMessage]);

  const toggleMute = useCallback(async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState) {
      // Mute: Stop microphone recording but keep WebSocket connection and audio player
      if (bufferTimer.current) {
        clearInterval(bufferTimer.current);
        bufferTimer.current = null;
      }

      if (micStream.current) {
        micStream.current.getTracks().forEach(track => track.stop());
        micStream.current = null;
      }

      if (audioRecorderContext.current) {
        audioRecorderContext.current.close();
        audioRecorderContext.current = null;
      }

      audioRecorderNode.current = null;
      audioBuffer.current = [];
      setIsRecording(false);
    } else {
      // Unmute: Restart microphone recording
      try {
        const [recorderNode, recorderContext, stream] = await startAudioRecorderWorklet(audioRecorderHandler);
        audioRecorderNode.current = recorderNode;
        audioRecorderContext.current = recorderContext;
        micStream.current = stream;
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to restart audio recording:', error);
        // If we can't restart recording, reset muted state
        setIsMuted(true);
      }
    }
  }, [isMuted, startAudioRecorderWorklet, audioRecorderHandler]);

  const disconnect = useCallback(() => {
    if (websocket.current) {
      websocket.current.close();
      websocket.current = null;
    }
    stopAudio();
    setIsConnected(false);
  }, [stopAudio]);

  return {
    isConnected,
    isAudioMode,
    isRecording,
    isMuted,
    startAudio,
    stopAudio,
    toggleMute,
    connectWebSocket,
    disconnect,
    sendTextMessage,
    sendMessage
  };
};
