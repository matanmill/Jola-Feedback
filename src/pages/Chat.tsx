import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, ChevronRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample suggestions for the chat
const CHAT_SUGGESTIONS = [
  "What are the common themes in our customer interviews?",
  "Summarize the key insights from recent feedback",
  "What are the main pain points mentioned in interviews?",
  "Show me positive feedback patterns from our interviews"
];

// Sample customer quotes for the sidebar
const CUSTOMER_QUOTES = [
  {
    text: "Your product has completely transformed how we handle our workflow.",
    author: "Sarah Johnson, Product Manager",
    date: "2025-03-12"
  },
  {
    text: "The support team was incredibly responsive and helpful when we needed them.",
    author: "Michael Chen, Developer",
    date: "2025-03-24"
  },
  {
    text: "I've tried many similar tools, but yours is by far the most intuitive and comprehensive.",
    author: "Alexia Rodriguez, CEO",
    date: "2025-04-01"
  }
];

interface ChatRequest {
  user_input: string;
  session_id: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your feedback assistant powered by RAG technology. I can help you analyze feedback and provide insights based on historical data. How can I help you today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call your Python backend with RAG implementation
      const response = await fetch('https://test-python-backend-1.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: input,
          session_id: "default" // You can make this dynamic if needed
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.response }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'Sorry, there was an error processing your request. Please try again.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Optional: Auto-submit the suggestion
    // handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col space-y-6">
        <Card className="flex-1 flex flex-col shadow-lg border-slate-200">
          <CardHeader className="border-b bg-white">
            <CardTitle className="text-xl text-slate-800 font-semibold">Feedback Assistant</CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 pb-0">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start",
                    "animate-fade-in"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3",
                      message.role === 'user' 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-slate-700"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted text-slate-700">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-medium text-slate-500 mb-2">Try asking something like:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {CHAT_SUGGESTIONS.map((suggestion, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start text-left hover:bg-slate-100 border-slate-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <span className="truncate">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="border-t p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex items-end w-full gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-11 flex-1 resize-none border-slate-200 focus-visible:ring-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button 
                type="submit" 
                size="icon" 
                className="h-11 w-11 rounded-full"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
      
      <div className={cn(
        "w-64 bg-white border-l border-slate-200 transition-all ease-in-out duration-300 relative",
        showQuotes ? "translate-x-0" : "translate-x-[calc(100%-32px)]"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-1 h-8 w-8 rounded-full bg-white shadow-md border border-slate-200"
          onClick={() => setShowQuotes(!showQuotes)}
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <div className="p-4 pt-16">
          <h3 className="font-medium text-slate-800 mb-3">Customer Quotes</h3>
          <div className="space-y-4">
            {CUSTOMER_QUOTES.map((quote, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                <p className="text-sm italic text-slate-700">"{quote.text}"</p>
                <p className="text-xs text-slate-500 mt-2">{quote.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
