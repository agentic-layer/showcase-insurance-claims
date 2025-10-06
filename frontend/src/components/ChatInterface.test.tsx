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

// Mock fetch to avoid actual HTTP calls
global.fetch = vi.fn();

describe('ChatInterface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders correctly', () => {
    render(<ChatInterface />);

    // Check if the component renders with expected elements
    expect(screen.getByText('Chat mit Claims Agent')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Schreiben Sie Ihre Nachricht...')).toBeInTheDocument();
    expect(screen.getByText(/Hallo! Ich bin Ihr Claims Agent/)).toBeInTheDocument();
  });

  it('exposes sendMessage function via ref', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Check that the ref is properly assigned and has sendMessage function
    expect(ref.current).toBeTruthy();
    expect(ref.current?.sendMessage).toBeInstanceOf(Function);
  });

  it('allows typing in input field', () => {
    render(<ChatInterface />);

    const input = screen.getByPlaceholderText('Schreiben Sie Ihre Nachricht...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    expect(input).toHaveValue('Test message');
  });

  it('can trigger sendMessage via ref without HTTP call', async () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Mock fetch to resolve immediately without making actual calls
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }]
      })
    } as Response);

    // Call sendMessage via ref wrapped in act
    await act(async () => {
      ref.current?.sendMessage('Test message from ref');
    });

    // Wait for the message to appear in the UI
    await waitFor(() => {
      expect(screen.getByText('Test message from ref')).toBeInTheDocument();
    });

    // Verify fetch was called with correct parameters
    expect(fetch).toHaveBeenCalledWith('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('"content":"Test message from ref"')
    });
  });

  it('sends message when Enter is pressed', async () => {
    render(<ChatInterface />);

    // Mock fetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }]
      })
    } as Response);

    const input = screen.getByPlaceholderText('Schreiben Sie Ihre Nachricht...');

    // Focus on the input and set value
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Test message' } });

    await act(async () => {
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    });

    // Wait for the message to appear in the UI
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    // Verify fetch was called
    expect(fetch).toHaveBeenCalledWith('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: expect.stringContaining('"content":"Test message"')
    });
  });

  it('sends message when send button is clicked', async () => {
    render(<ChatInterface />);

    // Mock fetch
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Test response' } }]
      })
    } as Response);

    const input = screen.getByPlaceholderText('Schreiben Sie Ihre Nachricht...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });

    await act(async () => {
      fireEvent.click(sendButton);
    });

    // Wait for the message to appear in the UI
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('shows loading state during message sending', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Mock fetch to never resolve (simulate slow response)
    vi.mocked(fetch).mockImplementationOnce(() => {
      return new Promise(() => {
      });
    });

    // Call sendMessage wrapped in act
    act(() => {
      ref.current?.sendMessage('Test message');
    });

    // Verify loading indicator appears
    expect(screen.getByText('Agent denkt nach...')).toBeInTheDocument();
  });

  it('handles empty messages correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Try to send empty message
    act(() => {
      ref.current?.sendMessage('');
    });

    // Verify fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles whitespace-only messages correctly', () => {
    const ref = React.createRef<ChatInterfaceRef>();
    render(<ChatInterface ref={ref} />);

    // Try to send whitespace-only message
    act(() => {
      ref.current?.sendMessage('   ');
    });

    // Verify fetch was not called
    expect(fetch).not.toHaveBeenCalled();
  });

  it('displays initial welcome message', () => {
    render(<ChatInterface />);

    // Check that the initial message is displayed
    expect(screen.getByText(/Hallo! Ich bin Ihr Claims Agent/)).toBeInTheDocument();
  });

  it('formats message timestamps correctly', () => {
    render(<ChatInterface />);

    // Check that timestamp is displayed in German format
    const timeElement = screen.getByText(/\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});
