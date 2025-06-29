import { supabase } from '@/lib/supabase';
import { ChatHistory } from './types';

export class ChatHistoryAPI {
  static async getChatHistory(userId: string): Promise<ChatHistory[]> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  static async getChat(userId: string, chatId: string): Promise<ChatHistory | null> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .eq('id', chatId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error fetching chat:', error);
      throw error;
    }
  }

  static async createChat(chat: Omit<ChatHistory, 'id' | 'created_at' | 'updated_at'>): Promise<ChatHistory> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .insert([chat])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  static async updateChat(userId: string, chatId: string, updates: Partial<ChatHistory>): Promise<ChatHistory> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', chatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating chat:', error);
      throw error;
    }
  }

  static async deleteChat(userId: string, chatId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', userId)
        .eq('id', chatId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  static async addMessage(userId: string, chatId: string, message: any): Promise<ChatHistory> {
    try {
      // Get current chat
      const chat = await ChatHistoryAPI.getChat(userId, chatId);
      if (!chat) throw new Error('Chat not found');

      // Add message to messages array
      const updatedMessages = [...chat.messages, message];
      
      // Update chat with new message
      const updates = {
        messages: updatedMessages,
        last_message: message.content,
        message_count: updatedMessages.length,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('chat_history')
        .update(updates)
        .eq('user_id', userId)
        .eq('id', chatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  }

  static async searchChats(userId: string, query: string): Promise<ChatHistory[]> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,last_message.ilike.%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching chats:', error);
      throw error;
    }
  }

  static async updateChatTitle(userId: string, chatId: string, title: string): Promise<ChatHistory> {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .update({
          title,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', chatId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating chat title:', error);
      throw error;
    }
  }
}