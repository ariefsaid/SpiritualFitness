
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for server-side usage with Clerk authentication
 * This will forward the user's JWT to Supabase for RLS policy enforcement
 */
export async function createServerSupabaseClient() {
  const { getToken } = auth();
  const token = await getToken({ template: 'supabase' });
  
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

/**
 * Create a Supabase client for client-side usage
 * Note: For authenticated requests from the client, you should include the user's session token
 */
export function createClientSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey);
}

/**
 * Create a Supabase client for client-side usage with Clerk authentication
 * This is meant to be used in a client component with the useAuth hook
 */
export function createAuthenticatedClientSupabaseClient(token: string | null) {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  });
}
