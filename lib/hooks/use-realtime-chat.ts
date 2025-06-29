"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ChatHistoryAPI, type ChatHistory } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { Message } from '@/types/chat';
import { toast } from 'sonner';

export interface RealtimeChatHook {
  chats: ChatHistory[];
  currentChat: ChatHistory | null;
  loading: boolean;
  error: string | null;
  createNewChat: (title?: string, initialMessage?: Message) => Promise<ChatHistory | null>;
  selectChat: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => Promise<void>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearCurrentChat: () => void;
  refetchChats: () => Promise<void>;
}

export function useRealtimeChat(): RealtimeChatHook {
  const { user, isAuthenticated } = useAuth();
  const [chats, setChats] = useState<ChatHistory[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all chats for the user
  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userChats = await ChatHistoryAPI.getChatHistory(user.id);
      setChats(userChats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch chat history';
      setError(errorMessage);
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Set up real-time subscription for chat updates
  useEffect(() => {
    if (!user || !isAuthenticated) {
      setChats([]);
      setCurrentChat(null);
      setLoading(false);
      return;
    }

    // Initial fetch
    fetchChats();

    // Set up real-time subscription
    const channel = supabase
      .channel('chat_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_history',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time chat update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setChats(prev => [payload.new as ChatHistory, ...prev]);
              break;
              
            case 'UPDATE':
              setChats(prev => prev.map(chat => 
                chat.id === payload.new.id ? payload.new as ChatHistory : chat
              ));
              
              // Update current chat if it's the one being updated
              if (currentChat?.id === payload.new.id) {
                setCurrentChat(payload.new as ChatHistory);
              }
              break;
              
            case 'DELETE':
              setChats(prev => prev.filter(chat => chat.id !== payload.old.id));
              
              // Clear current chat if it was deleted
              if (currentChat?.id === payload.old.id) {
                setCurrentChat(null);
              }
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAuthenticated, fetchChats, currentChat?.id]);

  // Create a new chat
  const createNewChat = useCallback(async (title?: string, initialMessage?: Message): Promise<ChatHistory | null> => {
    if (!user) {
      toast.error('Please sign in to save chat history');
      return null;
    }

    try {
      const chatTitle = title || (initialMessage ? generateChatTitle(initialMessage.content) : 'New Chat');
      const messages = initialMessage ? [initialMessage] : [];
      
      const newChat = await ChatHistoryAPI.createChat({
        user_id: user.id,
        title: chatTitle,
        messages,
        last_message: initialMessage?.content || '',
        message_count: messages.length
      });

      setCurrentChat(newChat);
      return newChat;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat';
      setError(errorMessage);
      toast.error('Failed to create new chat');
      console.error('Error creating chat:', err);
      return null;
    }
  }, [user]);

  // Select and load a specific chat
  const selectChat = useCallback(async (chatId: string) => {
    if (!user) return;

    try {
      const chat = await ChatHistoryAPI.getChat(user.id, chatId);
      if (chat) {
        setCurrentChat(chat);
      } else {
        toast.error('Chat not found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chat';
      setError(errorMessage);
      toast.error('Failed to load chat');
      console.error('Error selecting chat:', err);
    }
  }, [user]);

  // Add a message to the current chat
  const addMessage = useCallback(async (message: Message) => {
    if (!user || !currentChat) {
      console.warn('Cannot add message: no user or current chat');
      return;
    }

    try {
      const updatedChat = await ChatHistoryAPI.addMessage(user.id, currentChat.id, message);
      setCurrentChat(updatedChat);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save message';
      setError(errorMessage);
      console.error('Error adding message:', err);
      // Don't show toast for message errors as they happen frequently
    }
  }, [user, currentChat]);

  // Update chat title
  const updateChatTitle = useCallback(async (chatId: string, title: string) => {
    if (!user) return;

    try {
      await ChatHistoryAPI.updateChatTitle(user.id, chatId, title);
      toast.success('Chat title updated');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update title';
      setError(errorMessage);
      toast.error('Failed to update chat title');
      console.error('Error updating chat title:', err);
    }
  }, [user]);

  // Delete a chat
  const deleteChat = useCallback(async (chatId: string) => {
    if (!user) return;

    try {
      await ChatHistoryAPI.deleteChat(user.id, chatId);
      toast.success('Chat deleted');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat';
      setError(errorMessage);
      toast.error('Failed to delete chat');
      console.error('Error deleting chat:', err);
    }
  }, [user]);

  // Clear current chat (for starting fresh)
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
  }, []);

  // Refetch chats manually
  const refetchChats = useCallback(async () => {
    await fetchChats();
  }, [fetchChats]);

  return {
    chats,
    currentChat,
    loading,
    error,
    createNewChat,
    selectChat,
    addMessage,
    updateChatTitle,
    deleteChat,
    clearCurrentChat,
    refetchChats
  };
}

// Helper function to generate chat title from first message
function generateChatTitle(firstMessage: string): string {
  const words = firstMessage.split(' ').slice(0, 6);
  let title = words.join(' ');
  if (title.length > 50) {
    title = title.substring(0, 47) + '...';
  }
  return title || 'New Chat';
}