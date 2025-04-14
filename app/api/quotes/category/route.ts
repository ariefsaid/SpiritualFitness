import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';

/**
 * GET /api/quotes/category?category=value
 * Returns quotes filtered by category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: 'Category parameter is required' }), 
        { status: 400 }
      );
    }
    
    const quotes = await storage.getQuotesByCategory(category);
    
    if (!quotes || quotes.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: `No quotes found for category: ${category}` }), 
        { status: 404 }
      );
    }
    
    return NextResponse.json(quotes);
  } catch (err) {
    console.error('Error fetching quotes by category:', err);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching quotes by category' }), 
      { status: 500 }
    );
  }
}