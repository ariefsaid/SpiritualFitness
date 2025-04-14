import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storage } from '@/lib/storage';

/**
 * Log API requests 
 */
export function logRequest(req: NextRequest, path: string) {
  const start = Date.now();
  
  // Return a function to log completion
  return {
    finish: (status: number, responseBody?: any) => {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${path} ${status} in ${duration}ms`;
      
      if (responseBody) {
        const bodyStr = JSON.stringify(responseBody).substring(0, 50);
        logLine += ` :: ${bodyStr}${bodyStr.length >= 50 ? '...' : ''}`;
      }
      
      console.log(`[next-api] ${logLine}`);
    }
  };
}

/**
 * Helper for error responses
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { message },
    { status }
  );
}

/**
 * Get the current user from cookies
 */
export async function getCurrentUser() {
  try {
    // Get the cookies from the request in a server component
    const cookieStore = cookies();
    const userId = cookieStore.get('user_id')?.value;
    
    if (!userId) {
      return null;
    }
    
    return await storage.getUser(parseInt(userId));
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Middleware to ensure authentication
 */
export async function requireAuth(request: NextRequest) {
  const isAuthed = await isAuthenticated(request);
  
  if (!isAuthed) {
    return errorResponse('Unauthorized', 401);
  }
  
  return null;
}

/**
 * Validate request body against schema
 */
export async function validateBody(request: NextRequest, schema: any) {
  try {
    const body = await request.json();
    return { 
      success: true, 
      data: schema.parse(body) 
    };
  } catch (error) {
    return { 
      success: false, 
      error 
    };
  }
}