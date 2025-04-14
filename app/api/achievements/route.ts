import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../server/storage';

/**
 * GET /api/achievements
 * Returns all achievements for the authenticated user
 * NOTE: This is a temporary implementation that returns mock data until we implement authentication in Next.js
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // For now, we'll use a fixed user ID (1) for testing
    const userId = 1;
    
    // Get achievements for the user
    const achievements = await storage.getAchievementsByUserId(userId);
    
    return NextResponse.json(achievements);
  } catch (err) {
    console.error('Error fetching achievements:', err);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching achievements' }), 
      { status: 500 }
    );
  }
}

/**
 * POST /api/achievements
 * Creates a new achievement for the authenticated user
 * NOTE: This is a temporary implementation until we implement authentication in Next.js
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Implement proper authentication
    // For now, we'll use a fixed user ID (1) for testing
    const userId = 1;
    
    // Parse request body
    const body = await request.json();
    
    // Create the achievement
    const achievement = await storage.createAchievement({
      ...body,
      userId,
    });
    
    return NextResponse.json(achievement, { status: 201 });
  } catch (err) {
    console.error('Error creating achievement:', err);
    return new NextResponse(
      JSON.stringify({ message: 'Error creating achievement' }), 
      { status: 500 }
    );
  }
}