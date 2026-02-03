/**
 * API Route Protection Utilities
 * Middleware for protecting API routes with role-based access control
 */

import { NextResponse } from 'next/server';
import { auth } from './auth';
import { hasPermission, UserRole } from './authorization';

/**
 * Protect an API route and ensure user is authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Protect an API route and require a specific role
 */
export async function requireRole(requiredRole: UserRole) {
  const { error, session } = await requireAuth();

  if (error) {
    return { error, session: null };
  }

  if (!session) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      session: null,
    };
  }

  const userRole = session.user.role as UserRole;

  if (!hasPermission(userRole, requiredRole)) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      ),
      session: null,
    };
  }

  return { error: null, session };
}

/**
 * Protect admin routes (admin and dev only)
 */
export async function requireAdmin() {
  return requireRole('admin');
}

/**
 * Protect dev routes (dev only)
 */
export async function requireDev() {
  return requireRole('dev');
}
