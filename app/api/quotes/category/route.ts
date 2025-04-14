import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../lib/storage';
import { logRequest, errorResponse } from '../../middleware';

/**
 * GET /api/quotes/category?category=value
 * Returns quotes filtered by category
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/quotes/category');
  
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      logger.finish(400);
      return errorResponse('Category parameter is required', 400);
    }
    
    const quotes = await storage.getQuotesByCategory(category);
    
    if (!quotes || quotes.length === 0) {
      logger.finish(404);
      return errorResponse(`No quotes found for category: ${category}`, 404);
    }
    
    logger.finish(200, { count: quotes.length });
    return NextResponse.json(quotes);
  } catch (err) {
    console.error('Error fetching quotes by category:', err);
    logger.finish(500);
    return errorResponse('Error fetching quotes by category', 500);
  }
}