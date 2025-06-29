import { createClient } from '@supabase/supabase-js'
import { User as SupabaseUser } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Declare supabase client variable at module level
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  
  // Create a mock client to prevent app crashes during development
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    })
  };
  
  // Assign mock client to supabase variable
  supabase = mockClient;
} else {
  // Assign real client to supabase variable
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export at module level
export { supabase };

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