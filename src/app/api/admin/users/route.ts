/**
 * Admin User Management API
 * GET: List all users
 * POST: Create new user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/protect-route';
import { userStore } from '@/lib/db/users';
import { canAssignRole, canManageUsers } from '@/lib/auth/authorization';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  role: z.enum(['dev', 'admin', 'sales']),
});

/**
 * GET /api/admin/users
 * List all users (admin and dev only)
 */
export async function GET() {
  const { error, session } = await requireAdmin();
  if (error) return error;

  if (!session || !canManageUsers(session.user.role as any)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 }
    );
  }

  const users = await userStore.getAll();

  // Don't send password hashes to client
  const safeUsers = users.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at,
    created_by: user.created_by,
    last_successful_login: user.last_successful_login,
  }));

  return NextResponse.json({ users: safeUsers });
}

/**
 * POST /api/admin/users
 * Create a new user (admin and dev only)
 */
export async function POST(request: NextRequest) {
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
    const validatedData = createUserSchema.parse(body);

    // Check if the current user can assign the requested role
    if (!canAssignRole(session.user.role as any, validatedData.role)) {
      return NextResponse.json(
        { error: `You do not have permission to create ${validatedData.role} users` },
        { status: 403 }
      );
    }

    // Check if user already exists
    const existingUser = await userStore.findByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create the user
    const newUser = await userStore.create({
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: validatedData.role,
      created_by: session.user.id,
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        created_at: newUser.created_at,
      },
    }, { status: 201 });

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Failed to create user:', err);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
