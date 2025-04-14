import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { logRequest, errorResponse } from '../../middleware';

/**
 * GET /api/quotes/random
 * Returns a random quote
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/quotes/random');
  
  try {
    const quote = await storage.getRandomQuote();
    
    if (!quote) {
      logger.finish(404);
      return errorResponse('No quotes found', 404);
    }
    
    logger.finish(200, quote);
    return NextResponse.json(quote);
  } catch (err) {
    console.error('Error fetching random quote:', err);
    logger.finish(500);
    return errorResponse('Error fetching random quote', 500);
  }
}