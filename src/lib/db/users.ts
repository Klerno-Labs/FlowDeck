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
  role: "user" | "admin";
  created_at: Date;
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
      console.error("Error finding user by email:", error);
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
      console.error("Error finding user by id:", error);
      return null;
    }
  },

  async create(userData: {
    email: string;
    password: string;
    name: string;
    role?: "user" | "admin";
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await queryOne<User>(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        userData.email,
        passwordHash,
        userData.name,
        userData.role || "user",
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
      console.error("Error getting all users:", error);
      return [];
    }
  },
};
