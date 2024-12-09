import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

export type ExtendedUser = User & Partial<SupabaseUser>;

declare global {
  namespace Express {
    interface Request {
      user?: ExtendedUser;
    }
  }
}

export {}; // Ensure this is a module