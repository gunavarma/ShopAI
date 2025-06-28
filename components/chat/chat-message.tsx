"use client";

import { motion } from 'framer-motion';
import { Bot, User, HelpCircle, Tag } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SuggestedActions } from './suggested-actions';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  onSuggestedAction?: (action: string) => void;
}

export function ChatMessage({ message, onSuggestedAction }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
        >
          <Avatar className="w-9 h-9 border-2 border-primary/30">
            <AvatarFallback className="bg-gradient-to-r from-primary to-purple-400">
              <Bot className="w-4 h-4 text-white" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
      
      <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: isUser ? 0 : 0.2
          }}
          className={`
            px-4 py-3 rounded-2xl
            ${isUser 
              ? 'bg-primary text-primary-foreground ml-12' 
              : 'glass-card border'
            }
            ${message.isTyping ? 'animate-pulse' : ''}
          `}
        >
          {message.isTyping ? (
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              </motion.div>
              <span className="text-sm text-muted-foreground ml-2">AI is analyzing products...</span>
            </div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm leading-relaxed whitespace-pre-wrap"
            >
              {message.content}
            </motion.p>
          )}
        </motion.div>

        {/* Clarifying Questions Section */}
        {!isUser && message.clarifyingQuestions && message.clarifyingQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-lg p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Help me understand better:
              </span>
            </div>
            <div className="space-y-2">
              {message.clarifyingQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => onSuggestedAction?.(question)}
                  className="block w-full text-left text-sm p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-700 dark:text-blue-300"
                >
                  • {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Brand Suggestions Section */}
        {!isUser && message.brandSuggestions && message.brandSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-lg p-4 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Popular brands to consider:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.brandSuggestions.map((brand, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  onClick={() => onSuggestedAction?.(brand)}
                  className="px-3 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {brand}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <SuggestedActions
              actions={message.suggestedActions}
              onActionClick={onSuggestedAction}
            />
          </motion.div>
        )}
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20 
          }}
        >
          <Avatar className="w-9 h-9 border-2 border-muted">
            <AvatarFallback className="bg-muted">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </div>
  );
}