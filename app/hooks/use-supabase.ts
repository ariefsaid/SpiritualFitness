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
        // Get the JWT for Supabase from Clerk
        const token = isSignedIn ? await getToken({ template: 'supabase' }) : null;
        
        // Create a new Supabase client with the token
        const client = createAuthenticatedClientSupabaseClient(token);
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