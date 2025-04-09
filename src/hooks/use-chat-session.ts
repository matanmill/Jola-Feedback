import { useState, useEffect } from 'react';
import { ChatMessage, ChatResponse, ChatHistory } from '@/integrations/chat/types';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:8000';

export function useChatSession() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session ID on component mount
  useEffect(() => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      // Load existing chat history
      fetchChatHistory(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      localStorage.setItem('chatSessionId', newSessionId);
    }
  }, []);

  const fetchChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}/history`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 404) {
        // Session doesn't exist yet, start fresh
        setMessages([]);
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch chat history');
      
      const data: ChatHistory = await response.json();
      if (data.history) {
        setMessages(data.history);
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
      setMessages([]);
    }
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const data: ChatResponse = await response.json();
      console.log('Chat response:', data);
      
      // Update messages with new history if available
      if (data.history) {
        setMessages(data.history);
      } else {
        // If no history in response, add the new message and response
        setMessages(prev => [
          ...prev,
          { role: 'human', content: message },
          { role: 'ai', content: data.response }
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const endSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        // Session already ended or doesn't exist
        localStorage.removeItem('chatSessionId');
        setSessionId('');
        setMessages([]);
        return;
      }

      if (!response.ok) throw new Error('Failed to end session');
      
      localStorage.removeItem('chatSessionId');
      setSessionId('');
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error ending session:', err);
    }
  };

  return {
    sessionId,
    messages,
    isLoading,
    error,
    sendMessage,
    endSession,
  };
} 