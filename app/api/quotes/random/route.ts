import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse } from '@/api/middleware';

/**
 * GET /api/quotes/random
 * Returns a random inspirational quote
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/quotes/random');
  
  try {
    // Get a random quote from storage
    const quote = await storage.getRandomQuote();
    
    if (!quote) {
      logger.finish(404);
      return errorResponse('No quotes found', 404);
    }
    
    logger.finish(200, quote);
    
    // Set cache headers for better performance
    return NextResponse.json(quote, {
      headers: {
        // Cache for 1 day, revalidate every hour
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
  } catch (err) {
    console.error('Error fetching random quote:', err);
    logger.finish(500);
    return errorResponse('Error fetching random quote', 500);
  }
}