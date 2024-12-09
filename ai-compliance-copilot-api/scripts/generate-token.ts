import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function generateToken() {
  // Ensure environment variables are loaded
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL and Anon Key must be provided');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Sign in with your credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nishal@nsquaredlabs.com',
      password: 'KJD-hce!frm!zub7hpz'
    });

    if (error) {
      console.error('Authentication Error:', error);
      process.exit(1);
    }

    if (!data.session) {
      console.error('No session found');
      process.exit(1);
    }

    // Log out detailed user and session information
    console.log('User ID:', data.user?.id);
    console.log('User Email:', data.user?.email);
    console.log('Access Token:', data.session.access_token);
    console.log('Refresh Token:', data.session.refresh_token);
  } catch (error) {
    console.error('Unexpected Error:', error);
    process.exit(1);
  }
}

generateToken();
