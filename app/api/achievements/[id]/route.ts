import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../lib/storage';
import { logRequest, errorResponse } from '../../middleware';

/**
 * PUT /api/achievements/[id]
 * Updates a specific achievement
 * NOTE: This is a temporary implementation that skips authentication until we implement it in Next.js
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/achievements/${params.id}`);
  
  try {
    // TODO: Implement proper authentication
    // For now, we'll use a fixed user ID (1) for testing
    const userId = 1;
    
    // Get achievement ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid achievement ID', 400);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the achievement
    const achievement = await storage.updateAchievement(id, body);
    
    if (!achievement) {
      logger.finish(404);
      return errorResponse('Achievement not found', 404);
    }
    
    // Check if this achievement belongs to the user
    if (achievement.userId !== userId) {
      logger.finish(403);
      return errorResponse('Forbidden', 403);
    }
    
    logger.finish(200, achievement);
    return NextResponse.json(achievement);
  } catch (err) {
    console.error(`Error updating achievement ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error updating achievement', 500);
  }
}