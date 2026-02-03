/**
 * Password Reset Logic
 * Handles password reset token generation, verification, and password changes
 */

import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { userStore } from '@/lib/db/users';
import { passwordResetTokenStore } from '@/lib/db/password-reset-tokens';
import { passwordHistoryStore } from '@/lib/db/password-history';

const TOKEN_EXPIRY_HOURS = 1;
const PASSWORD_HISTORY_COUNT = 5;

/**
 * Generate a secure random token for password reset
 */
export function generateResetToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Request a password reset (generate token and send email)
 */
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  try {
    // Check if user exists
    const user = await userStore.findByEmail(email);
    if (!user) {
      // Don't reveal whether the email exists (security best practice)
      return { success: true };
    }

    // Invalidate any existing tokens for this user
    await passwordResetTokenStore.invalidateAllForUser(user.id);

    // Generate new token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Store token in database
    await passwordResetTokenStore.create(user.id, token, expiresAt);

    return {
      success: true,
      token, // Return token for email sending
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to process password reset request',
    };
  }
}

/**
 * Verify a password reset token is valid
 */
export async function verifyResetToken(token: string): Promise<{
  valid: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const resetToken = await passwordResetTokenStore.findByToken(token);

    if (!resetToken) {
      return {
        valid: false,
        error: 'Invalid or expired reset token',
      };
    }

    return {
      valid: true,
      userId: resetToken.user_id,
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to verify token',
    };
  }
}

/**
 * Check if a password was used recently
 */
export async function checkPasswordHistory(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const recentPasswords = await passwordHistoryStore.getRecent(
      userId,
      PASSWORD_HISTORY_COUNT
    );

    // Check if new password matches any recent password
    for (const entry of recentPasswords) {
      const matches = await bcrypt.compare(newPassword, entry.password_hash);
      if (matches) {
        return true; // Password was used recently
      }
    }

    return false; // Password is unique
  } catch (error) {
    // On error, allow password change (fail open for usability)
    return false;
  }
}

/**
 * Reset password using a valid token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Verify token
    const verification = await verifyResetToken(token);
    if (!verification.valid || !verification.userId) {
      return {
        success: false,
        error: verification.error || 'Invalid token',
      };
    }

    // Check password history
    const passwordReused = await checkPasswordHistory(
      verification.userId,
      newPassword
    );
    if (passwordReused) {
      return {
        success: false,
        error: `Cannot reuse any of your last ${PASSWORD_HISTORY_COUNT} passwords`,
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await userStore.updatePassword(verification.userId, passwordHash);

    // Add old password to history (get current password first)
    const user = await userStore.findById(verification.userId);
    if (user && user.password_hash) {
      await passwordHistoryStore.add(verification.userId, user.password_hash);
    }

    // Mark token as used
    await passwordResetTokenStore.markAsUsed(token);

    // Invalidate all other tokens for this user
    await passwordResetTokenStore.invalidateAllForUser(verification.userId);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to reset password',
    };
  }
}

/**
 * Change password for authenticated user
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Get user
    const user = await userStore.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!passwordValid) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Check password history
    const passwordReused = await checkPasswordHistory(userId, newPassword);
    if (passwordReused) {
      return {
        success: false,
        error: `Cannot reuse any of your last ${PASSWORD_HISTORY_COUNT} passwords`,
      };
    }

    // Add current password to history before changing
    await passwordHistoryStore.add(userId, user.password_hash);

    // Hash and update new password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await userStore.updatePassword(userId, passwordHash);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to change password',
    };
  }
}
