import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ChatInterface, { ChatInterfaceRef } from './ChatInterface';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the useAudioWebSocket hook
const mockSendTextMessage = vi.fn();
const mockConnectWebSocket = vi.fn();
const mockStartAudio = vi.fn();
const mockStopAudio = vi.fn();
const mockToggleMute = vi.fn();

vi.mock('@/hooks/useAudioWebSocket', () => ({
  useAudioWebSocket: () => ({
    isConnected: true,
    isAudioMode: false,
    isRecording: false,
    isMuted: false,
    startAudio: mockStartAudio,
    stopAudio: mockStopAudio,
    toggleMute: mockToggleMute,
    sendTextMessage: mockSendTextMessage,
    connectWebSocket: mockConnectWebSocket
  })
}));

// Mock fetch to avoid actual HTTP calls
global.fetch = vi.fn();

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendTextMessage.mockClear();
    mockConnectWebSocket.mockClear();
    mockStartAudio.mockClear();
    mockStopAudio.mockClear();
    mockToggleMute.mockClear();
  });

  it('loads and renders correctly', () => {
    render(<ChatInterface />);

    // Check if the component renders with expected elements
    expect(screen.getByText('Chat mit Claims Agent')).toBeInTheDocument();
    expect(screen.getByText('Gespräch beginnen')).toBeInTheDocument();
  });

  it('exposes sendMessage function via ref', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Check that the ref is properly assigned and has sendMessage function
    expect(ref.current).toBeTruthy();
    expect(ref.current?.sendMessage).toBeInstanceOf(Function);
  });

  it('starts conversation when button is clicked', async () => {
    render(<ChatInterface />);

    const startButton = screen.getByText('Gespräch beginnen');

    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(mockStartAudio).toHaveBeenCalled();
  });

  it('can trigger sendMessage via ref', async () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Call sendMessage via ref wrapped in act
    await act(async () => {
      ref.current?.sendMessage('Test message from ref');
    });

    // Verify sendTextMessage was called (synchronous)
    expect(mockSendTextMessage).toHaveBeenCalledWith('Test message from ref');

    // Verify the message appears in UI
    expect(screen.getByText('Test message from ref')).toBeInTheDocument();
  });

  it('displays messages correctly', async () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    await act(async () => {
      ref.current?.sendMessage('Test message');
    });

    // Wait for the message to appear in the UI
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('sends message via websocket', async () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    await act(async () => {
      ref.current?.sendMessage('Test message');
    });

    // Verify sendTextMessage was called
    expect(mockSendTextMessage).toHaveBeenCalledWith('Test message');
  });

  it('handles message sending correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Call sendMessage wrapped in act
    act(() => {
      ref.current?.sendMessage('Test message');
    });

    // Verify message appears
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('handles empty messages correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Try to send empty message
    act(() => {
      ref.current?.sendMessage('');
    });

    // Verify sendTextMessage was not called
    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });

  it('handles whitespace-only messages correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Try to send whitespace-only message
    act(() => {
      ref.current?.sendMessage('   ');
    });

    // Verify sendTextMessage was not called
    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });

  it('displays initial button', () => {
    render(<ChatInterface />);

    // Check that the initial button is displayed
    expect(screen.getByText('Gespräch beginnen')).toBeInTheDocument();
  });

  it('formats message timestamps correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    act(() => {
      ref.current?.sendMessage('Test message');
    });

    // Check that timestamp is displayed in German format
    const timeElement = screen.getByText(/\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});
