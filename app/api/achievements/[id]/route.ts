import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';

/**
 * PUT /api/achievements/[id]
 * Updates a specific achievement
 * NOTE: This is a temporary implementation that skips authentication until we implement it in Next.js
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Implement proper authentication
    // For now, we'll use a fixed user ID (1) for testing
    const userId = 1;
    
    // Get achievement ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid achievement ID' }), 
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the achievement
    const achievement = await storage.updateAchievement(id, body);
    
    if (!achievement) {
      return new NextResponse(
        JSON.stringify({ message: 'Achievement not found' }), 
        { status: 404 }
      );
    }
    
    // Check if this achievement belongs to the user
    if (achievement.userId !== userId) {
      return new NextResponse(
        JSON.stringify({ message: 'Forbidden' }), 
        { status: 403 }
      );
    }
    
    return NextResponse.json(achievement);
  } catch (err) {
    console.error(`Error updating achievement ${params.id}:`, err);
    return new NextResponse(
      JSON.stringify({ message: 'Error updating achievement' }), 
      { status: 500 }
    );
  }
}