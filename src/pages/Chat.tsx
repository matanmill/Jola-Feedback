import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface UserQuote {
  id: string;
  content: string;
  source: string;
  sentiment: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedQuotes, setSelectedQuotes] = useState<UserQuote[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput('');
      // Here you would typically send the message to your backend
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isSidebarOpen ? "w-[calc(100%-24rem)]" : "w-full"
      )}>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                    <p className="text-muted-foreground max-w-md">
                      Ask me anything about your feedback data, insights, or action items.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-4",
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <Card className={cn(
                        "max-w-[80%] p-4 shadow-sm",
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <p className="text-base leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </Card>
                      {message.role === 'user' && (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          <div className="p-6 border-t bg-background">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 h-12 text-base"
                />
                <Button onClick={handleSendMessage} size="icon" className="h-12 w-12">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        "w-96 border-l bg-muted/50 transition-all duration-300",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b bg-background flex items-center justify-between">
            <h2 className="text-xl font-semibold">User Quotes</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-4">
              {selectedQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No quotes selected</h3>
                  <p className="text-muted-foreground max-w-xs">
                    Select quotes from the chat to see them here
                  </p>
                </div>
              ) : (
                selectedQuotes.map((quote) => (
                  <Card key={quote.id} className="p-6 shadow-sm">
                    <p className="text-base leading-relaxed mb-4">{quote.content}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{quote.source}</span>
                      <span className={cn(
                        "text-sm px-3 py-1 rounded-full font-medium",
                        quote.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        quote.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      )}>
                        {quote.sentiment}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-20 h-8 w-8"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default Chat;
