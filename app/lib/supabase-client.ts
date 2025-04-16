
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerSupabaseClient() {
  const token = await auth().getToken();
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

// Client-side Supabase client with Clerk auth
export function createClientSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}
