import { supabase } from '@/lib/supabase';
import { DatabaseProfile } from './types';

export class ProfilesAPI {
  static async getProfile(userId: string): Promise<DatabaseProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  static async createProfile(profile: Omit<DatabaseProfile, 'created_at' | 'updated_at'>): Promise<DatabaseProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  static async updateProfile(userId: string, updates: Partial<DatabaseProfile>): Promise<DatabaseProfile> {
    try {
      // Ensure updates object is valid
      const validUpdates: Partial<DatabaseProfile> = {};
      if (updates.full_name) validUpdates.full_name = updates.full_name;
      if (updates.avatar_url) validUpdates.avatar_url = updates.avatar_url;
      if (updates.preferences) validUpdates.preferences = updates.preferences;
      
      // Add updated_at timestamp
      validUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('profiles')
        .update(validUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static async deleteProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  static async updatePreferences(userId: string, preferences: any): Promise<DatabaseProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }
}