import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { logRequest, errorResponse } from '@/api/middleware';

/**
 * GET /api/auth-test
 * Test endpoint to verify Clerk-Supabase integration
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/auth-test');
  
  try {
    // Get auth state from Clerk
    const { userId } = await auth();
    const user = await currentUser();
    
    // Attempt to initialize Supabase client with Clerk token
    const supabase = await createServerSupabaseClient();
    
    // Return auth status
    const status = {
      auth: {
        isAuthenticated: !!userId,
        userId: userId || null,
        userEmail: user?.emailAddresses[0]?.emailAddress || null,
      },
      supabase: {
        clientInitialized: !!supabase,
        tokenForwarded: !!userId,
      },
      environment: {
        clerk_keys_available: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
        supabase_keys_available: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
        database_url_available: !!process.env.DATABASE_URL,
      },
      timestamp: new Date().toISOString(),
    };
    
    logger.finish(200, status);
    return NextResponse.json(status);
  } catch (err) {
    console.error('Error in auth-test endpoint:', err);
    logger.finish(500);
    return errorResponse('Error testing authentication integration', 500);
  }
}