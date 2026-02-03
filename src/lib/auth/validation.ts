/**
 * Input Validation and Sanitization
 * Prevents injection attacks and ensures data integrity
 */

import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(3, 'Email too short')
  .max(254, 'Email too long') // RFC 5321
  .toLowerCase()
  .trim();

// Password validation schema (for login)
export const passwordSchema = z
  .string()
  .min(1, 'Password required')
  .max(128, 'Password too long'); // Prevent DoS

// Password strength schema (for registration/change)
export const passwordStrengthSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password too long')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain special character');

// Login credentials validation
export const loginCredentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Sanitize input to prevent injection attacks
 * Note: We use parameterized queries for SQL injection prevention,
 * but this adds an extra layer of defense
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets for XSS prevention
    .slice(0, 255); // Limit length
}

/**
 * Validate and sanitize login credentials
 */
export function validateCredentials(credentials: unknown): {
  email: string;
  password: string;
} {
  const result = loginCredentialsSchema.safeParse(credentials);

  if (!result.success) {
    throw new Error('Invalid credentials format');
  }

  return {
    email: sanitizeInput(result.data.email),
    password: result.data.password, // Don't sanitize password (allow special chars)
  };
}

/**
 * Check password strength for new passwords
 */
export function checkPasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const result = passwordStrengthSchema.safeParse(password);

  if (result.success) {
    return { valid: true, errors: [] };
  }

  return {
    valid: false,
    errors: result.error.errors.map(e => e.message),
  };
}
