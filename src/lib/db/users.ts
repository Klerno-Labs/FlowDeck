/**
 * In-memory user storage for development
 * For production, connect to a database through Vercel integrations
 */

import bcrypt from "bcryptjs";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "user" | "admin";
  created_at: Date;
}

// In-memory user store
const users: User[] = [];

// Initialize with demo user
async function initDemoUser() {
  if (users.length === 0) {
    const passwordHash = await bcrypt.hash("password123", 10);
    users.push({
      id: "demo-user-id",
      email: "demo@ftc.com",
      password_hash: passwordHash,
      name: "Demo User",
      role: "admin",
      created_at: new Date(),
    });
  }
}

// Initialize on module load
initDemoUser();

export const userStore = {
  async findByEmail(email: string): Promise<User | null> {
    const user = users.find((u) => u.email === email);
    return user || null;
  },

  async create(userData: {
    email: string;
    password: string;
    name: string;
    role?: "user" | "admin";
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      password_hash: passwordHash,
      name: userData.name,
      role: userData.role || "user",
      created_at: new Date(),
    };
    users.push(user);
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

  // For debugging/admin purposes
  getAll(): User[] {
    return users;
  },
};
