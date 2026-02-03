/**
 * Rate Limit Database Operations
 * Tracks and enforces rate limits to prevent brute force attacks
 */

import { query, queryOne } from "./client";

export interface RateLimit {
  id: string;
  identifier: string;
  attempts: number;
  last_attempt: Date;
  blocked_until?: Date;
  created_at: Date;
}

export const rateLimitStore = {
  async getByIdentifier(identifier: string): Promise<RateLimit | null> {
    return queryOne<RateLimit>(
      `SELECT * FROM rate_limits WHERE identifier = $1`,
      [identifier]
    );
  },

  async incrementAttempts(identifier: string): Promise<RateLimit> {
    const existing = await this.getByIdentifier(identifier);

    if (existing) {
      const updated = await queryOne<RateLimit>(
        `UPDATE rate_limits
         SET attempts = attempts + 1,
             last_attempt = CURRENT_TIMESTAMP
         WHERE identifier = $1
         RETURNING *`,
        [identifier]
      );

      if (!updated) {
        throw new Error('Failed to update rate limit');
      }

      return updated;
    } else {
      const created = await queryOne<RateLimit>(
        `INSERT INTO rate_limits (identifier, attempts, last_attempt)
         VALUES ($1, 1, CURRENT_TIMESTAMP)
         RETURNING *`,
        [identifier]
      );

      if (!created) {
        throw new Error('Failed to create rate limit');
      }

      return created;
    }
  },

  async setBlocked(identifier: string, blockedUntil: Date): Promise<void> {
    await query(
      `UPDATE rate_limits
       SET blocked_until = $1
       WHERE identifier = $2`,
      [blockedUntil, identifier]
    );
  },

  async reset(identifier: string): Promise<void> {
    await query(
      `UPDATE rate_limits
       SET attempts = 0,
           blocked_until = NULL
       WHERE identifier = $1`,
      [identifier]
    );
  },

  async cleanupExpired(): Promise<void> {
    await query(
      `DELETE FROM rate_limits
       WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days'`
    );
  },
};
