/**
 * Rate Limiting for Authentication
 * Prevents brute force attacks by limiting login attempts
 */

import { rateLimitStore } from "@/lib/db/rate-limits";
import { createHash } from "crypto";

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const LOGIN_RATE_LIMIT: RateLimitConfig = {
  maxAttempts: 5, // 5 attempts
  windowMs: 15 * 60 * 1000, // per 15 minutes
  blockDurationMs: 30 * 60 * 1000, // block for 30 minutes
};

export interface RateLimitResult {
  allowed: boolean;
  attemptsRemaining: number;
  resetAt?: Date;
  blockedUntil?: Date;
}

/**
 * Create a hashed identifier from IP and User-Agent
 * Prevents storing raw IPs for privacy
 */
export function createRateLimitIdentifier(ip: string, userAgent: string): string {
  const combined = `${ip}:${userAgent}`;
  return createHash('sha256').update(combined).digest('hex');
}

/**
 * Check if a request is rate limited
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const record = await rateLimitStore.getByIdentifier(identifier);

  // No record = first attempt, allow
  if (!record) {
    return {
      allowed: true,
      attemptsRemaining: LOGIN_RATE_LIMIT.maxAttempts - 1,
    };
  }

  // Check if currently blocked
  if (record.blocked_until && record.blocked_until > new Date()) {
    return {
      allowed: false,
      attemptsRemaining: 0,
      blockedUntil: record.blocked_until,
    };
  }

  // Check if attempts exceeded within window
  const windowStart = new Date(Date.now() - LOGIN_RATE_LIMIT.windowMs);
  const isWithinWindow = record.last_attempt > windowStart;

  if (isWithinWindow && record.attempts >= LOGIN_RATE_LIMIT.maxAttempts) {
    // Block the identifier
    const blockedUntil = new Date(Date.now() + LOGIN_RATE_LIMIT.blockDurationMs);
    await rateLimitStore.setBlocked(identifier, blockedUntil);

    return {
      allowed: false,
      attemptsRemaining: 0,
      blockedUntil,
    };
  }

  // If outside window, reset attempts
  if (!isWithinWindow) {
    await rateLimitStore.reset(identifier);
    return {
      allowed: true,
      attemptsRemaining: LOGIN_RATE_LIMIT.maxAttempts - 1,
    };
  }

  // Within window, under limit
  return {
    allowed: true,
    attemptsRemaining: LOGIN_RATE_LIMIT.maxAttempts - record.attempts - 1,
  };
}

/**
 * Record a failed login attempt
 */
export async function recordLoginAttempt(identifier: string, success: boolean): Promise<void> {
  if (success) {
    // Reset on successful login
    await rateLimitStore.reset(identifier);
  } else {
    // Increment failed attempts
    await rateLimitStore.incrementAttempts(identifier);
  }
}

/**
 * Get rate limit configuration (for client display)
 */
export function getRateLimitConfig() {
  return {
    maxAttempts: LOGIN_RATE_LIMIT.maxAttempts,
    windowMinutes: LOGIN_RATE_LIMIT.windowMs / (60 * 1000),
    blockDurationMinutes: LOGIN_RATE_LIMIT.blockDurationMs / (60 * 1000),
  };
}
