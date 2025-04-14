import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse, requireAuth, getCurrentUser } from '@/api/middleware';

/**
 * GET /api/community/memberships/[id]
 * Returns a specific membership
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/memberships/${params.id}`);
  
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
    
    // Get membership ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid membership ID', 400);
    }
    
    // Get membership
    const membership = await storage.getMembershipById(id);
    
    if (!membership) {
      logger.finish(404);
      return errorResponse('Membership not found', 404);
    }
    
    // Check if user has access to this membership
    if (membership.userId !== user.id) {
      // Check if user is admin of the group
      const userMembership = await storage.getGroupMembership(user.id, membership.groupId);
      if (!userMembership || userMembership.role !== 'admin') {
        logger.finish(403);
        return errorResponse('You do not have permission to view this membership', 403);
      }
    }
    
    // Get group information
    const group = await storage.getCommunityGroupById(membership.groupId);
    
    // Return membership with group
    const response = {
      ...membership,
      group
    };
    
    logger.finish(200, response);
    return NextResponse.json(response);
  } catch (err) {
    console.error(`Error fetching membership ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error fetching membership', 500);
  }
}

/**
 * PUT /api/community/memberships/[id]
 * Updates a specific membership (change role)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/memberships/${params.id}`);
  
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
    
    // Get membership ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid membership ID', 400);
    }
    
    // Get membership
    const membership = await storage.getMembershipById(id);
    
    if (!membership) {
      logger.finish(404);
      return errorResponse('Membership not found', 404);
    }
    
    // Check if user is admin of the group
    const userMembership = await storage.getGroupMembership(user.id, membership.groupId);
    if (!userMembership || userMembership.role !== 'admin') {
      logger.finish(403);
      return errorResponse('You do not have permission to update this membership', 403);
    }
    
    // Parse request body
    const body = await request.json();
    
    // Update the membership
    const updatedMembership = await storage.updateMembership(id, body);
    
    logger.finish(200, updatedMembership);
    return NextResponse.json(updatedMembership);
  } catch (err) {
    console.error(`Error updating membership ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error updating membership', 500);
  }
}

/**
 * DELETE /api/community/memberships/[id]
 * Deletes a membership (leave or remove from group)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const logger = logRequest(request, `/api/community/memberships/${params.id}`);
  
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
    
    // Get membership ID from URL params
    const id = parseInt(params.id);
    if (isNaN(id)) {
      logger.finish(400);
      return errorResponse('Invalid membership ID', 400);
    }
    
    // Get membership
    const membership = await storage.getMembershipById(id);
    
    if (!membership) {
      logger.finish(404);
      return errorResponse('Membership not found', 404);
    }
    
    // Check if user can delete this membership
    // User can delete if:
    // 1. It's their own membership (leaving a group)
    // 2. They are an admin of the group (removing someone)
    if (membership.userId !== user.id) {
      const userMembership = await storage.getGroupMembership(user.id, membership.groupId);
      if (!userMembership || userMembership.role !== 'admin') {
        logger.finish(403);
        return errorResponse('You do not have permission to delete this membership', 403);
      }
    }
    
    // Cannot delete the last admin of a group
    if (membership.role === 'admin') {
      const groupAdmins = await storage.getGroupAdmins(membership.groupId);
      if (groupAdmins.length <= 1) {
        logger.finish(400);
        return errorResponse('Cannot delete the last admin of a group. Assign another admin first or delete the group.', 400);
      }
    }
    
    // Delete the membership
    await storage.deleteMembership(id);
    
    logger.finish(204);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(`Error deleting membership ${params.id}:`, err);
    logger.finish(500);
    return errorResponse('Error deleting membership', 500);
  }
}