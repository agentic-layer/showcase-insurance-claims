import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Loader2, Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAudioWebSocket } from '@/hooks/useAudioWebSocket';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatInterfaceRef {
  sendMessage: (message: string) => void;
}

const ChatInterface = forwardRef<ChatInterfaceRef>((props, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentMessageIdRef = useRef<string | null>(null);
  const currentUserMessageIdRef = useRef<string | null>(null);
  const [conversationState, setConversationState] = useState<'initial' | 'active' | 'ended'>('initial');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    isConnected,
    isAudioMode,
    isRecording,
    isMuted,
    startAudio,
    stopAudio,
    toggleMute,
    sendTextMessage,
    connectWebSocket
  } = useAudioWebSocket({
    onMessage: (message) => {
      if (message.mime_type === 'text/plain') {
        if (message.is_user_input) {
          // Handle user input transcription chunks (similar to assistant response)
          setMessages(prev => {
            // Check if we already have a current user message being built
            const lastMessage = prev[prev.length - 1];
            const isLastMessageUser = lastMessage && lastMessage.role === 'user';

            if (isLastMessageUser && currentUserMessageIdRef.current === lastMessage.id) {
              // Append to existing user message
              return prev.map(msg =>
                msg.id === currentUserMessageIdRef.current
                  ? { ...msg, content: msg.content + message.data }
                  : msg
              );
            } else if (isLastMessageUser && !currentUserMessageIdRef.current) {
              // We have a user message but no currentUserMessageIdRef (probably after turn_complete)
              // Set the ref to the last message's ID and append
              currentUserMessageIdRef.current = lastMessage.id;
              return prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: msg.content + message.data }
                  : msg
              );
            } else {
              // Create new user message
              const newUserMessageId = Math.random().toString(36).substring(7);
              currentUserMessageIdRef.current = newUserMessageId;
              const userMessage: Message = {
                id: newUserMessageId,
                role: 'user',
                content: message.data,
                timestamp: new Date()
              };
              return [...prev, userMessage];
            }
          });
        } else {
          // Handle assistant response
          setMessages(prev => {
            // Check if we already have a current assistant message being built
            const lastMessage = prev[prev.length - 1];
            const isLastMessageAssistant = lastMessage && lastMessage.role === 'assistant';

            if (isLastMessageAssistant && currentMessageIdRef.current === lastMessage.id) {
              // Append to existing message
              return prev.map(msg =>
                msg.id === currentMessageIdRef.current
                  ? { ...msg, content: msg.content + message.data }
                  : msg
              );
            } else if (isLastMessageAssistant && !currentMessageIdRef.current) {
              // We have an assistant message but no currentMessageIdRef (probably after turn_complete)
              // Set the ref to the last message's ID and append
              currentMessageIdRef.current = lastMessage.id;
              return prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: msg.content + message.data }
                  : msg
              );
            } else {
              // Create new assistant message
              const newMessageId = Math.random().toString(36).substring(7);
              currentMessageIdRef.current = newMessageId;
              const assistantMessage: Message = {
                id: newMessageId,
                role: 'assistant',
                content: message.data,
                timestamp: new Date()
              };
              return [...prev, assistantMessage];
            }
          });
        }
      }

      if (message.turn_complete) {
        // Reset message IDs when turn is complete
        currentMessageIdRef.current = null;
        currentUserMessageIdRef.current = null;
        console.log('Turn complete received');
      }
    }
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  // No automatic WebSocket connection - only connect when user starts conversation

  // Function to start a new conversation
  const handleStartConversation = () => {
    // Reset chat messages
    setMessages([]);
    currentMessageIdRef.current = null;
    currentUserMessageIdRef.current = null;
    setConversationState('active');
    // Start audio mode
    startAudio();
  };

  // Function to end conversation
  const handleEndConversation = () => {
    setConversationState('ended');
    stopAudio();
  };

  // Function to start new conversation (after one ended)
  const handleNewConversation = () => {
    // Reset everything
    setMessages([]);
    currentMessageIdRef.current = null;
    currentUserMessageIdRef.current = null;
    setConversationState('active');
    // Start audio mode
    startAudio();
  };

  const sendMessage = async (messageText: string) => {
    const messageToSend = messageText.trim();
    if (!messageToSend || isLoading) return;

    // Always use WebSocket for communication with claims-voice-agent
    if (sendTextMessage) {
      // Reset current message ID for new conversation turn
      currentMessageIdRef.current = null;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageToSend,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      sendTextMessage(messageToSend);
      return;
    }

    // Fallback: If WebSocket is not available, show error
    toast({
      title: "Verbindungsfehler",
      description: "Keine Verbindung zum Agent verfügbar. Bitte versuchen Sie es später erneut.",
      variant: "destructive"
    });
  };

  useImperativeHandle(ref, () => ({
    sendMessage
  }));


  return (
    <Card className="bg-card border-accent/30 h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-center">
          <Bot className="w-5 h-5 text-accent mr-2" />
          Chat mit Claims Agent
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 px-6 h-0" ref={scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] min-w-0 ${
                      message.role === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`p-3 rounded-lg break-words ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto max-w-full'
                          : 'bg-muted text-muted-foreground max-w-full'
                      }`}>
                        <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                        <p className={`text-xs mt-1 opacity-70 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
                        }`}>
                          {message.timestamp.toLocaleTimeString('de-DE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-accent text-accent-foreground">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex-1 max-w-[80%] min-w-0">
                      <div className="p-3 rounded-lg bg-muted text-muted-foreground max-w-full">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Agent denkt nach...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border">
              {conversationState === 'initial' && (
                <Button
                  onClick={handleStartConversation}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Gespräch beginnen
                </Button>
              )}

              {conversationState === 'active' && (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleEndConversation}
                      variant="destructive"
                      className="flex-1 h-12 text-lg"
                      size="lg"
                    >
                      <MicOff className="w-5 h-5 mr-2" />
                      Gespräch beenden
                    </Button>

                    {isAudioMode && (
                      <Button
                        onClick={toggleMute}
                        variant={isMuted ? "secondary" : "outline"}
                        className="h-12 px-4"
                        size="lg"
                        title={isMuted ? "Mikrofon aktivieren" : "Mikrofon stumm schalten"}
                      >
                        {isMuted ? (
                          <MicOff className="w-5 h-5" />
                        ) : (
                          <Mic className="w-5 h-5" />
                        )}
                      </Button>
                    )}
                  </div>

                  {isAudioMode && (
                    <div className="flex items-center justify-center">
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          !isConnected ? 'bg-gray-400' :
                          isMuted ? 'bg-orange-500' :
                          isRecording ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                        }`}></div>
                        <span>
                          {!isConnected ? 'Verbinde...' :
                           isMuted ? 'Mikrofon stumm - Agent hört nicht zu' :
                           isRecording ? 'Hört zu und spricht zurück...' :
                           'Verbunden - bereit zum Sprechen'
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {conversationState === 'ended' && (
                <Button
                  onClick={handleNewConversation}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Neues Gespräch beginnen
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
  );
});

ChatInterface.displayName = 'ChatInterface';

export default ChatInterface;
