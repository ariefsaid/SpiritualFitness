import { NextRequest, NextResponse } from 'next/server';

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
 * Authentication placeholder
 * This will be replaced with actual session-based auth
 */
export async function getCurrentUser() {
  // TODO: Implement proper authentication using Next.js middleware
  // For now, return a placeholder user
  return {
    id: 1,
    username: 'testuser'
  };
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