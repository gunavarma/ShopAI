"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types/chat";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  return (
    <aside className="col-span-3">
      <div className="sticky top-28 h-[calc(100vh-8.5rem)] flex flex-col glassmorphism rounded-xl shadow-lg">
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                smart_toy
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#151118]">
              AI-Powered Shopping
            </h3>
          </div>
        </div>
        
        <div className="flex-grow p-4 overflow-y-auto space-y-6 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[85%] ${
                    message.role === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-white/70 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.isTyping && (
                     <span className="inline-flex gap-1 items-center mt-1">
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                     </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-white/20">
          <form onSubmit={handleSubmit} className="flex items-center rounded-lg bg-white/70 h-12 shadow-inner-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-opacity-50">
            <input
              className="form-input flex-1 w-full h-full bg-transparent border-none focus:ring-0 placeholder:text-gray-500 px-4 text-sm"
              placeholder="Ask Shopwhiz anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              className="p-3 text-gray-600 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">mic</span>
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
