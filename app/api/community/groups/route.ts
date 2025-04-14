import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../../../server/storage';
import { logRequest, errorResponse, getCurrentUser, validateBody } from '../../middleware';
import { insertCommunityGroupSchema } from '../../../../shared/schema';

/**
 * GET /api/community/groups
 * Returns all community groups
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/community/groups');
  
  try {
    const groups = await storage.getCommunityGroups();
    
    logger.finish(200, { count: groups.length });
    return NextResponse.json(groups);
  } catch (err) {
    console.error('Error fetching community groups:', err);
    logger.finish(500);
    return errorResponse('Error fetching community groups', 500);
  }
}

/**
 * POST /api/community/groups
 * Creates a new community group
 * NOTE: This is a temporary implementation that uses a fixed user ID until we implement authentication in Next.js
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/community/groups');
  
  try {
    // Validate request body
    const validation = await validateBody(request, insertCommunityGroupSchema);
    if (!validation.success) {
      logger.finish(400);
      return errorResponse('Invalid request body', 400);
    }
    
    // Create the group
    const group = await storage.createCommunityGroup(validation.data);
    
    logger.finish(201, group);
    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error('Error creating community group:', err);
    logger.finish(500);
    return errorResponse('Error creating community group', 500);
  }
}