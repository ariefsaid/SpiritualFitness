import { NextRequest, NextResponse } from 'next/server';
import { logRequest } from '@/api/middleware';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * Log out a user by clearing their session
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/auth/logout');
  
  // Create response
  const response = NextResponse.json({ message: 'Logged out successfully' });
  
  // Clear the session cookie
  response.cookies.delete('user_id');
  
  logger.finish(200);
  return response;
}