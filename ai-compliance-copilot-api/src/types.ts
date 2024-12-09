import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';

// User type representing the core user information
export interface User {
  id: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  metadata?: Record<string, any>;
}

// Authentication session type
export interface AuthSession {
  user: User;
  session: Session | null;
}

// Extended request type to include user information
export interface ExtendedRequest extends Request {
  user?: User;
}

// Authentication middleware type
export type AuthMiddleware = (
  req: ExtendedRequest, 
  res: Response, 
  next: NextFunction
) => Promise<void | Response>;

// Conversation types
export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Message types
export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'ai';
  created_at: string;
}

// Error response type
export interface ErrorResponse {
  error: string;
  details?: string;
}

// Pagination options
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Generic API response type
export type ApiResponse<T> = T | ErrorResponse;
