/**
 * Password Reset Tokens Database Operations
 * Manages password reset tokens in the database
 */

import { query } from '@/lib/db/client';

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
  used_at: Date | null;
}

export const passwordResetTokenStore = {
  /**
   * Create a new password reset token
   */
  async create(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const result = await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, token, expiresAt]
    );
    return result.rows[0];
  },

  /**
   * Find a token by its value
   */
  async findByToken(token: string): Promise<PasswordResetToken | null> {
    const result = await query(
      `SELECT * FROM password_reset_tokens
       WHERE token = $1
       AND used = false
       AND expires_at > CURRENT_TIMESTAMP`,
      [token]
    );
    return result.rows[0] || null;
  },

  /**
   * Mark a token as used
   */
  async markAsUsed(token: string): Promise<void> {
    await query(
      `UPDATE password_reset_tokens
       SET used = true, used_at = CURRENT_TIMESTAMP
       WHERE token = $1`,
      [token]
    );
  },

  /**
   * Invalidate all tokens for a user
   */
  async invalidateAllForUser(userId: string): Promise<void> {
    await query(
      `UPDATE password_reset_tokens
       SET used = true, used_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND used = false`,
      [userId]
    );
  },

  /**
   * Delete expired tokens (cleanup)
   */
  async deleteExpired(): Promise<number> {
    const result = await query(
      `DELETE FROM password_reset_tokens
       WHERE expires_at < CURRENT_TIMESTAMP OR used = true
       RETURNING id`
    );
    return result.rowCount || 0;
  },
};
