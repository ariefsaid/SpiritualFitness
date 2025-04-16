'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { createAuthenticatedClientSupabaseClient } from '@/lib/supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Hook to use Supabase client with Clerk authentication
 * This hook will automatically update the Supabase client when the auth state changes
 */
export function useSupabase() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    async function setupSupabase() {
      setLoading(true);
      try {
        // Create a function that wraps getToken to ensure it returns a string (not null)
        const getTokenWrapper = isSignedIn 
          ? async (options?: any) => {
              const token = await getToken(options);
              return token || '';
            }
          : null;
        
        // Create a new Supabase client with the token getter function
        const client = createAuthenticatedClientSupabaseClient(getTokenWrapper);
        setSupabase(client);
      } catch (error) {
        console.error('Error setting up Supabase client:', error);
      } finally {
        setLoading(false);
      }
    }

    setupSupabase();
  }, [isLoaded, isSignedIn, getToken]);

  return { supabase, loading, isAuthenticated: isSignedIn };
}