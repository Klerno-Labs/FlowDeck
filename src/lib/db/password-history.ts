/**
 * Password History Database Operations
 * Manages password history to prevent password reuse
 */

import { query } from '@/lib/db/client';

export interface PasswordHistoryEntry {
  id: string;
  user_id: string;
  password_hash: string;
  created_at: Date;
}

export const passwordHistoryStore = {
  /**
   * Add a password to history
   */
  async add(userId: string, passwordHash: string): Promise<void> {
    await query(
      `INSERT INTO password_history (user_id, password_hash)
       VALUES ($1, $2)`,
      [userId, passwordHash]
    );
  },

  /**
   * Get recent password hashes for a user
   */
  async getRecent(userId: string, limit: number = 5): Promise<PasswordHistoryEntry[]> {
    const result = await query(
      `SELECT * FROM password_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  /**
   * Delete old password history (keep last N per user)
   */
  async cleanupOld(keepCount: number = 5): Promise<number> {
    const result = await query(
      `DELETE FROM password_history
       WHERE id IN (
         SELECT id FROM (
           SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
           FROM password_history
         ) sub
         WHERE rn > $1
       )
       RETURNING id`,
      [keepCount]
    );
    return result.rowCount || 0;
  },
};
