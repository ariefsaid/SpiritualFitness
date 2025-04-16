import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { logRequest, errorResponse } from '@/api/middleware';

/**
 * GET /api/user-profile
 * Get the current user's profile from Supabase
 * Protected by Clerk authentication
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/user-profile');
  
  try {
    // Get auth state from Clerk
    const { userId } = await auth();
    
    // If not authenticated, return error
    if (!userId) {
      logger.finish(401);
      return errorResponse('Unauthorized. Please sign in to access this resource.', 401);
    }
    
    // Get user details from Clerk
    const user = await currentUser();
    if (!user) {
      logger.finish(404);
      return errorResponse('User not found', 404);
    }
    
    // Initialize Supabase client with Clerk token
    const supabase = createServerSupabaseClient();
    
    // Check if the user already has a profile in Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching user profile:', error);
      logger.finish(500);
      return errorResponse(`Error fetching user profile: ${error.message}`, 500);
    }
    
    if (profile) {
      // Return existing profile
      logger.finish(200, profile);
      return NextResponse.json({ profile, exists: true });
    } else {
      // Return user info from Clerk (profile doesn't exist yet)
      const userInfo = {
        clerk_id: userId,
        email: user.emailAddresses[0]?.emailAddress,
        first_name: user.firstName,
        last_name: user.lastName,
        avatar_url: user.imageUrl,
      };
      
      logger.finish(200, { userInfo, exists: false });
      return NextResponse.json({ profile: userInfo, exists: false });
    }
  } catch (err) {
    console.error('Error in user-profile endpoint:', err);
    logger.finish(500);
    return errorResponse('Error accessing user profile data', 500);
  }
}