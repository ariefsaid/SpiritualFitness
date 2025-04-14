import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse } from '@/api/middleware';

/**
 * GET /api/quotes/category/[category]
 * Returns quotes by category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  const logger = logRequest(request, `/api/quotes/category/${params.category}`);
  
  try {
    // Get the category from URL params
    const { category } = params;
    
    if (!category) {
      logger.finish(400);
      return errorResponse('Category is required', 400);
    }
    
    // Get quotes by category
    const quotes = await storage.getQuotesByCategory(category);
    
    if (!quotes || quotes.length === 0) {
      logger.finish(404);
      return errorResponse(`No quotes found in category: ${category}`, 404);
    }
    
    logger.finish(200, { count: quotes.length });
    
    // Set cache headers for better performance
    return NextResponse.json(quotes, {
      headers: {
        // Cache for 1 day
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (err) {
    console.error(`Error fetching quotes for category:`, err);
    logger.finish(500);
    return errorResponse('Error fetching quotes by category', 500);
  }
}