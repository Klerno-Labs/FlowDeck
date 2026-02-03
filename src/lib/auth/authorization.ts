/**
 * Role-based Authorization Utilities
 * Implements 3-tier permission system: dev > admin > sales
 */

export type UserRole = 'dev' | 'admin' | 'sales';

/**
 * Role hierarchy levels (higher number = more permissions)
 */
const ROLE_LEVELS: Record<UserRole, number> = {
  dev: 3,      // Super admin - full access
  admin: 2,    // Can manage users and assign roles
  sales: 1,    // Can edit content but not manage users
};

/**
 * Check if user has permission to access a resource
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole];
}

/**
 * Check if user is dev (super admin)
 */
export function isDev(userRole: UserRole): boolean {
  return userRole === 'dev';
}

/**
 * Check if user is admin or higher
 */
export function isAdmin(userRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS.admin;
}

/**
 * Check if user can manage other users
 * Only dev and admin can manage users
 */
export function canManageUsers(userRole: UserRole): boolean {
  return isAdmin(userRole);
}

/**
 * Check if user can assign a specific role to others
 * - Dev can assign any role
 * - Admin can assign admin and sales roles (but not dev)
 * - Sales cannot assign any roles
 */
export function canAssignRole(userRole: UserRole, targetRole: UserRole): boolean {
  if (isDev(userRole)) {
    return true; // Dev can assign any role
  }

  if (userRole === 'admin') {
    return targetRole !== 'dev'; // Admin cannot create dev users
  }

  return false; // Sales cannot assign roles
}

/**
 * Check if user can delete another user
 * - Dev can delete anyone except themselves
 * - Admin can delete sales users only
 * - Sales cannot delete users
 */
export function canDeleteUser(
  userRole: UserRole,
  targetRole: UserRole,
  isSelf: boolean = false
): boolean {
  if (isSelf) {
    return false; // Cannot delete yourself
  }

  if (isDev(userRole)) {
    return true; // Dev can delete anyone
  }

  if (userRole === 'admin') {
    return targetRole === 'sales'; // Admin can only delete sales users
  }

  return false; // Sales cannot delete users
}

/**
 * Check if user can edit content
 * All roles can edit content
 */
export function canEditContent(userRole: UserRole): boolean {
  return true; // All roles have content editing access
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    dev: 'Developer',
    admin: 'Administrator',
    sales: 'Sales Team',
  };
  return names[role];
}

/**
 * Get roles that a user can assign to others
 */
export function getAssignableRoles(userRole: UserRole): UserRole[] {
  if (isDev(userRole)) {
    return ['dev', 'admin', 'sales'];
  }

  if (userRole === 'admin') {
    return ['admin', 'sales'];
  }

  return []; // Sales cannot assign roles
}
