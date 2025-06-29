import { createClient } from '@supabase/supabase-js'
import { User as SupabaseUser } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    currency: string;
    language: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    currency: string;
    language: string;
  };
}

// Transform Supabase user to AuthUser
export function transformSupabaseUser(
  supabaseUser: SupabaseUser,
  profile?: Profile | null
): AuthUser {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.full_name || 
          supabaseUser.user_metadata?.full_name || 
          supabaseUser.email?.split('@')[0] || 
          'User',
    avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url,
    preferences: profile?.preferences || {
      theme: 'dark',
      notifications: true,
      currency: 'INR',
      language: 'en'
    }
  };
}