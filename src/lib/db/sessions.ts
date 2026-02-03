/**
 * Session Database Operations
 * Tracks user sessions across devices for security monitoring
 */

import { query, queryOne } from "./client";
import { parseUserAgent, DeviceInfo } from "@/lib/auth/device-detection";

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  created_at: Date;
  last_active: Date;
  expires_at: Date;
  ip_address?: string;
  user_agent?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  is_current: boolean;
  revoked: boolean;
}

export interface CreateSessionData {
  userId: string;
  sessionToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export const sessionStore = {
  /**
   * Create a new session record
   */
  async create(data: CreateSessionData): Promise<Session> {
    const deviceInfo = data.userAgent
      ? parseUserAgent(data.userAgent)
      : { browser: 'Unknown', os: 'Unknown', deviceType: 'unknown' as const };

    const session = await queryOne<Session>(
      `INSERT INTO sessions (
        user_id, session_token, expires_at, ip_address, user_agent,
        device_type, browser, os
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        data.userId,
        data.sessionToken,
        data.expiresAt,
        data.ipAddress || null,
        data.userAgent || null,
        deviceInfo.deviceType,
        deviceInfo.browser,
        deviceInfo.os,
      ]
    );

    if (!session) {
      throw new Error('Failed to create session');
    }

    return session;
  },

  /**
   * Get active sessions for a user
   */
  async getActiveSessions(userId: string): Promise<Session[]> {
    return query<Session>(
      `SELECT *
       FROM sessions
       WHERE user_id = $1
         AND revoked = false
         AND expires_at > CURRENT_TIMESTAMP
       ORDER BY last_active DESC`,
      [userId]
    );
  },

  /**
   * Get session by token
   */
  async getByToken(sessionToken: string): Promise<Session | null> {
    return queryOne<Session>(
      `SELECT * FROM sessions WHERE session_token = $1`,
      [sessionToken]
    );
  },

  /**
   * Update session last active timestamp
   */
  async updateLastActive(sessionToken: string): Promise<void> {
    await query(
      `UPDATE sessions SET last_active = CURRENT_TIMESTAMP WHERE session_token = $1`,
      [sessionToken]
    );
  },

  /**
   * Revoke a session
   */
  async revoke(sessionId: string): Promise<void> {
    await query(
      `UPDATE sessions SET revoked = true WHERE id = $1`,
      [sessionId]
    );
  },

  /**
   * Revoke all sessions for a user (except optionally one)
   */
  async revokeAllForUser(userId: string, exceptSessionId?: string): Promise<number> {
    if (exceptSessionId) {
      const result = await query(
        `UPDATE sessions SET revoked = true WHERE user_id = $1 AND id != $2 RETURNING id`,
        [userId, exceptSessionId]
      );
      return result.length;
    } else {
      const result = await query(
        `UPDATE sessions SET revoked = true WHERE user_id = $1 RETURNING id`,
        [userId]
      );
      return result.length;
    }
  },

  /**
   * Clean up expired and revoked sessions
   */
  async cleanup(): Promise<number> {
    const result = await query(
      `DELETE FROM sessions
       WHERE expires_at < CURRENT_TIMESTAMP OR revoked = true
       RETURNING id`
    );
    return result.length;
  },

  /**
   * Get session count for a user
   */
  async getCount(userId: string): Promise<number> {
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count
       FROM sessions
       WHERE user_id = $1
         AND revoked = false
         AND expires_at > CURRENT_TIMESTAMP`,
      [userId]
    );
    return parseInt(result?.count || '0', 10);
  },
};
