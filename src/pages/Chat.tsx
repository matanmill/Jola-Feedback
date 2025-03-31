
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help with your feedback data analysis today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Here we would connect to ChatGPT API
      // For now, we'll simulate a response
      
      setTimeout(() => {
        const botMessage: Message = {
          role: 'assistant',
          content: `I'm currently in development, but I'd be happy to help analyze your feedback data when I'm fully connected to the backend. Your message was: "${userMessage.content}"`,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);
      
      // When API is connected, we'd replace the above with actual API call
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">AI Chat Assistant</h1>
      
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>Chat with AI</CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] flex items-start space-x-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {message.role === 'user' ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg p-3 bg-muted flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <div className="dot-flashing"></div>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              rows={1}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !input.trim()} 
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <style jsx>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #9880ff;
          color: #9880ff;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        
        @keyframes dot-flashing {
          0% {
            background-color: #9880ff;
          }
          50%, 100% {
            background-color: #ede9fe;
          }
        }
      `}</style>
    </div>
  );
};

export default Chat;
