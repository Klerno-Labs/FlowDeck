/**
 * PostgreSQL user storage using Neon database
 */

import bcrypt from "bcryptjs";
import { query, queryOne } from "./client";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "dev" | "admin" | "sales";
  created_at: Date;
  created_by?: string;
  failed_login_attempts?: number;
  locked_until?: Date;
  last_failed_login?: Date;
  last_successful_login?: Date;
}

export const userStore = {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await queryOne<User>(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return user;
    } catch (error) {
      // Error logged by query function
      return null;
    }
  },

  async findById(id: string): Promise<User | null> {
    try {
      const user = await queryOne<User>(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      return user;
    } catch (error) {
      // Error logged by query function
      return null;
    }
  },

  async create(userData: {
    email: string;
    password: string;
    name: string;
    role?: "dev" | "admin" | "sales";
    created_by?: string;
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await queryOne<User>(
      `INSERT INTO users (email, password_hash, name, role, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userData.email,
        passwordHash,
        userData.name,
        userData.role || "sales",
        userData.created_by || null,
      ]
    );

    if (!user) {
      throw new Error("Failed to create user");
    }

    return user;
  },

  async verifyPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    return isValid ? user : null;
  },

  async getAll(): Promise<User[]> {
    try {
      const users = await query<User>("SELECT * FROM users ORDER BY created_at DESC");
      return users;
    } catch (error) {
      // Error logged by query function
      return [];
    }
  },

  /**
   * Check if account is locked
   */
  async checkAccountLockout(email: string): Promise<{
    locked: boolean;
    lockedUntil?: Date;
  }> {
    const user = await this.findByEmail(email);
    if (!user) return { locked: false };

    if (user.locked_until && user.locked_until > new Date()) {
      return { locked: true, lockedUntil: user.locked_until };
    }

    return { locked: false };
  },

  /**
   * Record a failed login attempt
   * Locks account after 10 failed attempts for 1 hour
   */
  async recordFailedLogin(email: string): Promise<void> {
    const user = await this.findByEmail(email);
    if (!user) return;

    const attempts = (user.failed_login_attempts || 0) + 1;
    const LOCKOUT_THRESHOLD = 10;
    const LOCKOUT_DURATION_MS = 60 * 60 * 1000; // 1 hour

    const lockedUntil = attempts >= LOCKOUT_THRESHOLD
      ? new Date(Date.now() + LOCKOUT_DURATION_MS)
      : null;

    await query(
      `UPDATE users
       SET failed_login_attempts = $1,
           last_failed_login = CURRENT_TIMESTAMP,
           locked_until = $2
       WHERE email = $3`,
      [attempts, lockedUntil, email]
    );
  },

  /**
   * Record a successful login (resets failed attempts)
   */
  async recordSuccessfulLogin(email: string): Promise<void> {
    await query(
      `UPDATE users
       SET failed_login_attempts = 0,
           last_successful_login = CURRENT_TIMESTAMP,
           locked_until = NULL
       WHERE email = $1`,
      [email]
    );
  },

  /**
   * Update user password
   */
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await query(
      `UPDATE users
       SET password_hash = $1
       WHERE id = $2`,
      [passwordHash, userId]
    );
  },
};
