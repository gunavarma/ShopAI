"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, AuthUser, Profile, transformSupabaseUser } from '@/lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Try to get user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const authUser = transformSupabaseUser(supabaseUser, profile);
      setUser(authUser);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to basic user info
      const authUser = transformSupabaseUser(supabaseUser);
      setUser(authUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              full_name: name,
              preferences: {
                theme: 'dark',
                notifications: true,
                currency: 'INR',
                language: 'en'
              }
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }

      // Update Supabase user metadata if name or avatar changed
      const metadataUpdates: any = {};
      if (updates.name) metadataUpdates.full_name = updates.name;
      if (updates.avatar) metadataUpdates.avatar_url = updates.avatar;

      if (Object.keys(metadataUpdates).length > 0) {
        const { error: authError } = await supabase.auth.updateUser({
          data: metadataUpdates
        });

        if (authError) {
          return { success: false, error: authError.message };
        }
      }

      // Update profile table
      const profileUpdates: any = {};
      if (updates.name) profileUpdates.full_name = updates.name;
      if (updates.avatar) profileUpdates.avatar_url = updates.avatar;
      if (updates.preferences) profileUpdates.preferences = updates.preferences;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            ...profileUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          return { success: false, error: profileError.message };
        }
      }

      // Update local user state
      setUser(prev => prev ? { ...prev, ...updates } : null);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}