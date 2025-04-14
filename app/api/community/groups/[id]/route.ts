import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse, requireAuth, getCurrentUser } from '@/api/middleware';

/**
 * GET /api/community/groups/[id]
 * Returns a specific community group by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/groups/${params.id}`);
  
  try {
    // Check authentication
    const authError = await requireAuth(request);
    if (authError) return authError;
    
    // Get group ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid group ID', 400);
    }
    
    // Get community group
    const group = await storage.getCommunityGroupById(id);
    
    if (!group) {
      logger.finish(404);
      return errorResponse('Community group not found', 404);
    }
    
    // Get group members
    const members = await storage.getGroupMembers(id);
    
    // Return group with members
    const response = {
      ...group,
      members: members || []
    };
    
    logger.finish(200, response);
    return NextResponse.json(response);
  } catch (err) {
    console.error(`Error fetching community group ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error fetching community group', 500);
  }
}

/**
 * PUT /api/community/groups/[id]
 * Updates a specific community group
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/groups/${params.id}`);
  
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
    
    // Get group ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid group ID', 400);
    }
    
    // Get community group
    const group = await storage.getCommunityGroupById(id);
    
    if (!group) {
      logger.finish(404);
      return errorResponse('Community group not found', 404);
    }
    
    // Check if user is admin of this group
    const membership = await storage.getGroupMembership(user.id, id);
    
    if (!membership || membership.role !== 'admin') {
      logger.finish(403);
      return errorResponse('You do not have permission to update this group', 403);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the group
    const updatedGroup = await storage.updateCommunityGroup(id, body);
    
    logger.finish(200, updatedGroup);
    return NextResponse.json(updatedGroup);
  } catch (err) {
    console.error(`Error updating community group ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error updating community group', 500);
  }
}

/**
 * DELETE /api/community/groups/[id]
 * Deletes a specific community group
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/groups/${params.id}`);
  
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
    
    // Get group ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid group ID', 400);
    }
    
    // Get community group
    const group = await storage.getCommunityGroupById(id);
    
    if (!group) {
      logger.finish(404);
      return errorResponse('Community group not found', 404);
    }
    
    // Check if user is admin of this group or the creator
    const membership = await storage.getGroupMembership(user.id, id);
    const isCreator = group.creatorId === user.id;
    
    if ((!membership || membership.role !== 'admin') && !isCreator) {
      logger.finish(403);
      return errorResponse('You do not have permission to delete this group', 403);
    }
    
    // Delete the group
    await storage.deleteCommunityGroup(id);
    
    logger.finish(204);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(`Error deleting community group ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error deleting community group', 500);
  }
}