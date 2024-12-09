import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_API_URL 
  : process.env.LOCAL_API_URL;

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Configure email redirect URLs based on environment
    redirectTo: process.env.NODE_ENV === 'production' 
      ? process.env.PROD_FRONTEND_URL 
      : process.env.LOCAL_FRONTEND_URL
  }
});