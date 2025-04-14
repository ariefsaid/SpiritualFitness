import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse } from '@/api/middleware';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/login
 * Log in a user
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/auth/login');
  
  try {
    const body = await request.json();
    
    // Validate login data
    try {
      loginSchema.parse(body);
    } catch (error) {
      logger.finish(400);
      return errorResponse('Invalid login credentials', 400);
    }
    
    const { username, password } = body;
    
    // Find user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      logger.finish(401);
      return errorResponse('Invalid username or password', 401);
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.finish(401);
      return errorResponse('Invalid username or password', 401);
    }
    
    // Return user data (excluding password)
    const userResponse = {
      id: user.id,
      username: user.username,
    };
    
    // Create response with user data
    const response = NextResponse.json(userResponse);
    
    // Set session cookie in response
    response.cookies.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: '/',
    });
    
    logger.finish(200, userResponse);
    return response;
  } catch (err) {
    console.error('Error logging in:', err);
    logger.finish(500);
    return errorResponse('Error logging in', 500);
  }
}