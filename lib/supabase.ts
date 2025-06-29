import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Types for our application
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    currency: string;
    language: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    currency: string;
    language: string;
  };
}

// Helper function to transform Supabase user to our AuthUser format
export function transformSupabaseUser(user: any, profile?: Profile): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url,
    createdAt: user.created_at,
    preferences: profile?.preferences || {
      theme: 'dark',
      notifications: true,
      currency: 'INR',
      language: 'en'
    }
  };
}