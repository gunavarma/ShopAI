"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Bot, User, Paperclip, Mic, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm ShopWhiz, your AI shopping assistant. I can help you find products, compare prices, analyze reviews, and more. What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm searching for that right now. I'll analyze the top results and find the best options for you.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">ShopWhiz AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online & Ready</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex w-full gap-4 max-w-3xl mx-auto",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
              message.role === "assistant" 
                ? "bg-gradient-to-br from-blue-500 to-violet-600" 
                : "bg-gray-200 dark:bg-gray-700"
            )}>
              {message.role === "assistant" ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={cn(
              "flex flex-col gap-1 min-w-[120px] max-w-[80%]",
              message.role === "user" ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "p-4 rounded-2xl shadow-sm relative",
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex w-full gap-4 max-w-3xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors">
              <ImageIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about products..."
            className="w-full bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl pl-24 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none min-h-[60px] max-h-[200px] scrollbar-thin"
            rows={1}
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {input.trim() ? (
              <Button 
                onClick={handleSend}
                size="icon" 
                className="h-9 w-9 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500 transition-colors"
              >
                <Mic className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-center text-[10px] text-muted-foreground mt-2">
          ShopWhiz AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
