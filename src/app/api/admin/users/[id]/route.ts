/**
 * Admin User Management API - Individual User Operations
 * PATCH: Update user role
 * DELETE: Delete user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/protect-route';
import { userStore } from '@/lib/db/users';
import { canAssignRole, canDeleteUser, canManageUsers } from '@/lib/auth/authorization';
import { query } from '@/lib/db/client';
import { z } from 'zod';

const updateUserSchema = z.object({
  role: z.enum(['dev', 'admin', 'sales']).optional(),
  name: z.string().min(1).optional(),
});

/**
 * PATCH /api/admin/users/[id]
 * Update user details (admin and dev only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!session || !canManageUsers(session.user.role as any)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Get the target user
    const targetUser = await userStore.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If updating role, check permissions
    if (validatedData.role) {
      // Check if user can assign this role
      if (!canAssignRole(session.user.role as any, validatedData.role)) {
        return NextResponse.json(
          { error: `You do not have permission to assign ${validatedData.role} role` },
          { status: 403 }
        );
      }

      // Dev role can only be changed by dev users
      const userRole = session.user.role as 'dev' | 'admin' | 'sales';
      if (targetUser.role === 'dev' && userRole !== 'dev') {
        return NextResponse.json(
          { error: 'Only dev users can modify dev accounts' },
          { status: 403 }
        );
      }
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (validatedData.role) {
      updates.push(`role = $${paramIndex++}`);
      values.push(validatedData.role);
    }

    if (validatedData.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(validatedData.name);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    values.push(params.id);

    await query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    const updatedUser = await userStore.findById(params.id);

    return NextResponse.json({
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        role: updatedUser!.role,
        created_at: updatedUser!.created_at,
      },
    });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Failed to update user:', err);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (admin and dev only, with role restrictions)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!session || !canManageUsers(session.user.role as any)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  try {
    // Get the target user
    const targetUser = await userStore.findById(params.id);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this user
    const isSelf = session.user.id === params.id;
    if (!canDeleteUser(session.user.role as any, targetUser.role, isSelf)) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this user' },
        { status: 403 }
      );
    }

    // Delete the user
    await query('DELETE FROM users WHERE id = $1', [params.id]);

    return NextResponse.json({
      message: 'User deleted successfully',
    });

  } catch (err) {
    console.error('Failed to delete user:', err);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
