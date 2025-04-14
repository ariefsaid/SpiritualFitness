import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse, getCurrentUser } from '@/api/middleware';

/**
 * GET /api/auth/me
 * Get the current authenticated user
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/auth/me');
  
  try {
    // Get current user from middleware
    const user = await getCurrentUser();
    
    if (!user) {
      logger.finish(401);
      return errorResponse('Unauthorized', 401);
    }
    
    // Return user data (excluding password)
    const userResponse = {
      id: user.id,
      username: user.username
    };
    
    logger.finish(200, userResponse);
    return NextResponse.json(userResponse);
  } catch (err) {
    console.error('Error fetching current user:', err);
    logger.finish(500);
    return errorResponse('Error fetching current user', 500);
  }
}