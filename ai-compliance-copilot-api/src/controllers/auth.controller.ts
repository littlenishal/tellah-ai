import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { ExtendedUser } from '../types/index';

export const authController = {
  // Sign up a new user
  async signUp(req: Request & { user?: ExtendedUser }, res: Response) {
    try {
      const { email, password, ...metadata } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Optional: add additional user metadata
          data: metadata
        }
      });

      if (error) {
        return res.status(400).json({ 
          error: 'Sign up failed', 
          details: error.message 
        });
      }

      // Ensure we have a user ID
      if (!data.user) {
        return res.status(500).json({ 
          error: 'User creation failed', 
          details: 'No user ID generated' 
        });
      }

      // Create a corresponding user record in the users table
      const { error: userTableError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          role: 'user', // Default role
          metadata: {
            ...metadata,
            created_at: new Date().toISOString()
          }
        });

      if (userTableError) {
        console.error('User table insertion error:', userTableError);
        // Optionally, you might want to delete the auth user if this fails
        return res.status(500).json({ 
          error: 'User profile creation failed', 
          details: userTableError.message 
        });
      }

      // Return user details (excluding sensitive information)
      res.status(201).json({ 
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        message: 'User created successfully' 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Sign in a user
  async signIn(req: Request & { user?: ExtendedUser }, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ 
          error: 'Authentication failed', 
          details: error.message 
        });
      }

      // Return access token and user details
      res.status(200).json({ 
        accessToken: data.session?.access_token,
        user: {
          id: data.user?.id,
          email: data.user?.email,
        }
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Sign out a user
  async signOut(req: Request & { user?: ExtendedUser }, res: Response) {
    try {
      // Get the access token from the request
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({ error: 'No token provided' });
      }

      // Sign out the user
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(400).json({ 
          error: 'Logout failed', 
          details: error.message 
        });
      }

      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Signout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get current user profile
  async getCurrentUser(req: Request & { user?: ExtendedUser }, res: Response) {
    try {
      // The user should already be authenticated by the middleware
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      res.status(200).json({ 
        user: {
          id: req.user.id,
          email: req.user.email,
          // Add any other non-sensitive user details
        }
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
