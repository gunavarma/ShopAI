import { createClient } from '@supabase/supabase-js'
import { User as SupabaseUser } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Declare supabase client variable at module level
let supabase: any;

// Validate Supabase URL format
const isValidSupabaseUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('supabase.co') || urlObj.hostname.includes('supabase.in');
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidSupabaseUrl(supabaseUrl)) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  if (supabaseUrl && !isValidSupabaseUrl(supabaseUrl)) {
    console.error('Invalid Supabase URL format. Expected format: https://your-project.supabase.co');
  }
  
  // Create a mock client to prevent app crashes during development
  const mockClient = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
        } 
      }),
      signUp: () => Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
        } 
      }),
      signOut: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ 
        data: null, 
        error: { 
          message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
        } 
      })
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: { 
              message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
            } 
          })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ 
            data: null, 
            error: { 
              message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
            } 
          })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Supabase not configured properly. Please check your environment variables and ensure your Supabase project is active.' 
          } 
        })
      })
    })
  };
  
  // Assign mock client to supabase variable
  supabase = mockClient;
} else {
  try {
    // Assign real client to supabase variable with additional options for better error handling
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'X-Client-Info': 'shopwhiz-app'
        }
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    // Fall back to mock client if creation fails
    supabase = {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Failed to initialize Supabase client. Please check your configuration.' 
          } 
        }),
        signUp: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Failed to initialize Supabase client. Please check your configuration.' 
          } 
        }),
        signOut: () => Promise.resolve({ error: null }),
        updateUser: () => Promise.resolve({ 
          data: null, 
          error: { 
            message: 'Failed to initialize Supabase client. Please check your configuration.' 
          } 
        })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: { 
                message: 'Failed to initialize Supabase client. Please check your configuration.' 
              } 
            })
          })
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ 
              data: null, 
              error: { 
                message: 'Failed to initialize Supabase client. Please check your configuration.' 
              } 
            })
          })
        }),
        update: () => ({
          eq: () => Promise.resolve({ 
            data: null, 
            error: { 
              message: 'Failed to initialize Supabase client. Please check your configuration.' 
            } 
          })
        })
      })
    };
  }
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
  createdAt: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    currency: string;
    language: string;
    interests?: string[];
    personal?: {
      phone: string;
      city: string;
      pincode: string;
      birthdate: string;
      gender: string;
    };
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
    createdAt: profile?.created_at || supabaseUser.created_at || new Date().toISOString(),
    preferences: profile?.preferences || supabaseUser.user_metadata?.preferences || {
      theme: 'dark',
      notifications: true,
      currency: 'INR',
      language: 'en'
    }
  };
}