import { NextRequest } from 'next/server';

export interface User {
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

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

// In-memory storage for demo (in production, use a database)
const users: Map<string, User & { password: string }> = new Map();
const sessions: Map<string, AuthSession> = new Map();

export class AuthService {
  static async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = Array.from(users.values()).find(u => u.email === email);
      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Validate input
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' };
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
      }

      // Create user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const user: User = {
        id: userId,
        email,
        name,
        createdAt: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          notifications: true,
          currency: 'INR',
          language: 'en'
        }
      };

      // Hash password (in production, use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');
      
      users.set(userId, { ...user, password: hashedPassword });

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    try {
      // Find user
      const user = Array.from(users.values()).find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password (in production, use bcrypt)
      const hashedPassword = Buffer.from(password).toString('base64');
      if (user.password !== hashedPassword) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const token = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

      const session: AuthSession = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          createdAt: user.createdAt,
          preferences: user.preferences
        },
        token,
        expiresAt
      };

      sessions.set(token, session);

      return { success: true, session };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  static async verifySession(token: string): Promise<{ valid: boolean; session?: AuthSession }> {
    try {
      const session = sessions.get(token);
      if (!session) {
        return { valid: false };
      }

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        sessions.delete(token);
        return { valid: false };
      }

      return { valid: true, session };
    } catch (error) {
      console.error('Session verification error:', error);
      return { valid: false };
    }
  }

  static async logout(token: string): Promise<{ success: boolean }> {
    try {
      sessions.delete(token);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  }

  static async updateProfile(token: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const sessionResult = await this.verifySession(token);
      if (!sessionResult.valid || !sessionResult.session) {
        return { success: false, error: 'Invalid session' };
      }

      const userId = sessionResult.session.user.id;
      const user = users.get(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Update user
      const updatedUser = { ...user, ...updates };
      users.set(userId, updatedUser);

      // Update session
      const updatedSession = {
        ...sessionResult.session,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          avatar: updatedUser.avatar,
          createdAt: updatedUser.createdAt,
          preferences: updatedUser.preferences
        }
      };
      sessions.set(token, updatedSession);

      return { success: true, user: updatedSession.user };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }

  static extractTokenFromRequest(request: NextRequest): string | null {
    // Try Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try cookie
    const cookieToken = request.cookies.get('auth-token')?.value;
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }
}