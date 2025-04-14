import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { logRequest, errorResponse, requireAuth, getCurrentUser } from '@/api/middleware';
import { insertUserGroupMembershipSchema } from '@/lib/schema';

/**
 * GET /api/community/memberships
 * Returns all group memberships for the authenticated user
 */
export async function GET(request: NextRequest) {
  const logger = logRequest(request, '/api/community/memberships');
  
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
    
    // Get all memberships for the user
    const memberships = await storage.getUserMemberships(user.id);
    
    // Enrich with group information
    const enrichedMemberships = await Promise.all(
      memberships.map(async (membership) => {
        const group = await storage.getCommunityGroupById(membership.groupId);
        return {
          ...membership,
          group
        };
      })
    );
    
    logger.finish(200, { count: enrichedMemberships.length });
    return NextResponse.json(enrichedMemberships);
  } catch (err) {
    console.error('Error fetching user memberships:', err);
    logger.finish(500);
    return errorResponse('Error fetching user memberships', 500);
  }
}

/**
 * POST /api/community/memberships
 * Create a new group membership (join a group)
 */
export async function POST(request: NextRequest) {
  const logger = logRequest(request, '/api/community/memberships');
  
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
      insertUserGroupMembershipSchema.parse(body);
    } catch (error) {
      logger.finish(400);
      return errorResponse('Invalid membership data', 400);
    }
    
    // Check if the group exists
    const group = await storage.getCommunityGroupById(body.groupId);
    if (!group) {
      logger.finish(404);
      return errorResponse('Community group not found', 404);
    }
    
    // Check if user is already a member
    const existingMembership = await storage.getGroupMembership(user.id, body.groupId);
    if (existingMembership) {
      logger.finish(409);
      return errorResponse('User is already a member of this group', 409);
    }
    
    // Create membership with current user ID
    const membershipData = {
      userId: user.id,
      groupId: body.groupId,
      role: 'member', // Default role for new members
      joinedAt: new Date().toISOString()
    };
    
    // Create the membership
    const membership = await storage.createGroupMembership(membershipData);
    
    logger.finish(201, membership);
    return NextResponse.json(membership, { status: 201 });
  } catch (err) {
    console.error('Error creating group membership:', err);
    logger.finish(500);
    return errorResponse('Error creating group membership', 500);
  }
}