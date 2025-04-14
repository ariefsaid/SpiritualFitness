import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { insertUserSchema } from '@/lib/schema';
import { logRequest, errorResponse, validateBody } from '@/api/middleware';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/auth/register');
  
  try {
    // Validate request body
    const validation = await validateBody(request, insertUserSchema);
    if (!validation.success) {
      logger.finish(400);
      return errorResponse('Invalid request data', 400);
    }
    
    const userData = validation.data;
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      logger.finish(400);
      return errorResponse('Username already exists', 400);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Create user
    const user = await storage.createUser({
      ...userData,
      password: hashedPassword,
    });
    
    // Return user data (excluding password)
    const userResponse = {
      id: user.id,
      username: user.username,
    };
    
    // Create response with user data
    const response = NextResponse.json(userResponse, { status: 201 });
    
    // Set session cookie in response
    response.cookies.set('user_id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 1 week
      path: '/',
    });
    
    logger.finish(201, userResponse);
    return response;
  } catch (err) {
    console.error('Error registering user:', err);
    logger.finish(500);
    return errorResponse('Error registering user', 500);
  }
}