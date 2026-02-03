/**
 * Audit Logging Utility
 * Comprehensive logging of all security events
 */

import { auditLogStore, AuditEventType, CreateAuditLogData } from "@/lib/db/audit-logs";

/**
 * Log an audit event
 * In development: Also logs to console
 * In production: Only stores in database (console logs stripped by Next.js)
 */
export async function logAuditEvent(data: CreateAuditLogData): Promise<void> {
  try {
    await auditLogStore.create(data);

    // Development logging only (stripped in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUDIT]', {
        eventType: data.eventType,
        email: data.email,
        severity: data.severity,
        ...data.metadata,
      });
    }
  } catch (error) {
    // Don't let audit logging failures break auth flow
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[AUDIT ERROR]', error);
    }
  }
}

/**
 * Helper functions for common audit events
 */

export async function logLoginSuccess(data: {
  userId: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}): Promise<void> {
  await logAuditEvent({
    ...data,
    eventType: 'login_success',
  });
}

export async function logLoginFailed(data: {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}): Promise<void> {
  await logAuditEvent({
    ...data,
    eventType: 'login_failed',
    metadata: { reason: data.reason },
  });
}

export async function logLoginBlocked(data: {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  reason: 'rate_limit' | 'account_locked';
  blockedUntil?: Date;
}): Promise<void> {
  await logAuditEvent({
    ...data,
    eventType: data.reason === 'rate_limit'
      ? 'login_blocked_rate_limit'
      : 'login_blocked_account_locked',
    metadata: { blockedUntil: data.blockedUntil },
  });
}

export async function logSuspiciousActivity(data: {
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  details: string;
}): Promise<void> {
  await logAuditEvent({
    ...data,
    eventType: 'suspicious_activity',
    metadata: { details: data.details },
  });
}
