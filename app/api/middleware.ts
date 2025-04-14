import { NextRequest, NextResponse } from 'next/server';
// Using a different approach for cookies to fix type issues
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
 * Get the current user from request cookies
 * @param request Optional NextRequest to get cookies from
 */
export async function getCurrentUser(request?: NextRequest) {
  try {
    let userId: string | undefined;
    
    // Get userId from request cookies if provided, otherwise from server cookies
    if (request) {
      // Get from request cookies
      userId = request.cookies.get('user_id')?.value;
    } else {
      // Try to get from server component cookies
      try {
        const cookieStore = cookies();
        // Type assertion to handle TypeScript issues
        userId = (cookieStore as any).get?.('user_id')?.value;
      } catch (e) {
        console.error('Error accessing cookies in server component:', e);
      }
    }
    
    if (!userId) {
      return null;
    }
    
    const user = await storage.getUser(parseInt(userId));
    return user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
  const user = await getCurrentUser(request);
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