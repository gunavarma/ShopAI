"use client";

import { useState } from "react";
import { AIChatInput } from "./ai-chat-input";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Zap } from "lucide-react";

export function AIChatInputDemo() {
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    options?: { think: boolean; deepSearch: boolean };
    timestamp: number;
  }>>([]);

  const handleSubmit = (message: string, options?: { think: boolean; deepSearch: boolean }) => {
    const newMessage = {
      id: Date.now().toString(),
      content: message,
      options,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">AI Chat Input Demo</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the next-generation chat input with beautiful animations, smart placeholders, 
            and advanced AI features like deep thinking and comprehensive search.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-card rounded-lg p-6 text-center">
            <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Smart Placeholders</h3>
            <p className="text-sm text-muted-foreground">
              Dynamic, animated placeholders that cycle through shopping suggestions
            </p>
          </div>
          
          <div className="glass-card rounded-lg p-6 text-center">
            <Sparkles className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">AI Deep Thinking</h3>
            <p className="text-sm text-muted-foreground">
              Enable advanced AI analysis for more detailed and thoughtful responses
            </p>
          </div>
          
          <div className="glass-card rounded-lg p-6 text-center">
            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Deep Search</h3>
            <p className="text-sm text-muted-foreground">
              Search across multiple sources for comprehensive product information
            </p>
          </div>
        </motion.div>

        {/* Demo Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-8"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Try the AI Chat Input</h2>
          
          <AIChatInput
            onSubmit={handleSubmit}
            className="mb-6"
          />
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Click the input to activate • Try the Think and Deep Search toggles • Type your message
            </p>
            {messages.length > 0 && (
              <button
                onClick={clearMessages}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear Messages
              </button>
            )}
          </div>
        </motion.div>

        {/* Messages Display */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Submitted Messages
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-border/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{message.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {message.options && (
                    <div className="flex gap-2 mt-2">
                      {message.options.think && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                          <Sparkles className="w-3 h-3" />
                          Think Mode
                        </span>
                      )}
                      {message.options.deepSearch && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs">
                          <Zap className="w-3 h-3" />
                          Deep Search
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Usage Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Usage Examples</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Basic Integration</h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`import { AIChatInput } from '@/components/ui/ai-chat-input'

<AIChatInput
  onSubmit={(message, options) => {
    console.log('Message:', message)
    console.log('Options:', options)
  }}
/>`}
              </pre>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">With Custom Placeholder</h4>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
{`<AIChatInput
  placeholder="Ask me anything about products..."
  onSubmit={handleSubmit}
  disabled={isLoading}
/>`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}