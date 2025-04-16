
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Create a Supabase client for server-side usage with Clerk authentication
 * This will forward the user's JWT to Supabase for RLS policy enforcement
 */
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: async (url, options = {}) => {
        try {
          const authObject = await auth();
          const token = await authObject.getToken({ template: 'supabase' });
          
          // Add authorization header if token exists
          if (token) {
            options.headers = {
              ...options.headers,
              Authorization: `Bearer ${token}`
            };
          }
        } catch (error) {
          console.error('Error getting server token:', error);
        }
        
        return fetch(url, options);
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
export function createAuthenticatedClientSupabaseClient(
  getTokenOrNull: ((options?: any) => Promise<string>) | null
) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    },
    global: {
      fetch: async (url, options = {}) => {
        try {
          if (getTokenOrNull) {
            const token = await getTokenOrNull({ template: 'supabase' });
            
            // Add authorization header if token exists
            if (token) {
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`
              };
            }
          }
        } catch (error) {
          console.error('Error getting client token:', error);
        }
        
        return fetch(url, options);
      }
    }
  });
}
