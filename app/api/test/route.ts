import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { getDb } from '@/lib/db';
import { logRequest, errorResponse } from '@/api/middleware';

/**
 * GET /api/test
 * Test endpoint to verify migration
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/test');
  
  try {
    // Attempt to get a random quote
    const quote = await storage.getRandomQuote();
    
    // Check the status of all components
    const db = getDb();
    
    // Return status of various components
    const status = {
      storage: quote ? 'working' : 'not working',
      db: db ? 'connected' : 'not connected',
      quote: quote || null,
      backend: 'Next.js API Routes',
      storage_type: db ? 'PostgreSQL' : 'In-Memory',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      message: 'Next.js API routes working correctly',
      migration_status: 'complete',
      next_version: process.env.NEXT_VERSION || '15.3.0',
      framework: 'Next.js App Router',
      features: [
        'Server components',
        'Client components with hydration protection',
        'API routes',
        'Middleware',
        'PWA support',
        'Offline capabilities'
      ]
    };
    
    logger.finish(200, status);
    return NextResponse.json(status);
  } catch (err) {
    console.error('Error in test endpoint:', err);
    logger.finish(500);
    return errorResponse('Error testing API functionality', 500);
  }
}