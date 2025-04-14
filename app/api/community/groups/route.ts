import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse, requireAuth, getCurrentUser } from '@/api/middleware';
import { insertCommunityGroupSchema } from '@/lib/schema';

/**
 * GET /api/community/groups
 * Returns all community groups or filtered by type
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/community/groups');
  
  try {
    // Check authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // Get community groups
    let groups;
    if (type) {
      groups = await storage.getCommunityGroupsByType(type);
    } else {
      groups = await storage.getCommunityGroups();
    }
    
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
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/community/groups');
  
  try {
    // Check authentication
    const authError = await requireAuth(request);
    if (authError) return authError;
    
    // Get current user
    const user = await getCurrentUser(request);
    if (!user) {
      logger.finish(401);
      return errorResponse('Unauthorized', 401);
    }
    
    // Parse and validate request body
    const body = await request.json();
    try {
      insertCommunityGroupSchema.parse(body);
    } catch (error) {
      logger.finish(400);
      return errorResponse('Invalid community group data', 400);
    }
    
    // Add creator ID from authenticated user
    const groupData = {
      ...body,
      creatorId: user.id
    };
    
    // Create the community group
    const group = await storage.createCommunityGroup(groupData);
    
    // Auto-join the creator to the group
    await storage.createGroupMembership({
      userId: user.id,
      groupId: group.id,
      role: 'admin',
      joinedAt: new Date().toISOString()
    });
    
    logger.finish(201, group);
    return NextResponse.json(group, { status: 201 });
  } catch (err) {
    console.error('Error creating community group:', err);
    logger.finish(500);
    return errorResponse('Error creating community group', 500);
  }
}