/**
 * Audit Log Database Operations
 * Comprehensive logging of all security events for compliance and monitoring
 */

import { query, queryOne } from "./client";

export type AuditEventType =
  | 'login_success'
  | 'login_failed'
  | 'login_blocked_rate_limit'
  | 'login_blocked_account_locked'
  | 'logout'
  | 'session_created'
  | 'session_expired'
  | 'suspicious_activity'
  | 'password_changed';

export type Severity = 'info' | 'warning' | 'critical';

export interface AuditLog {
  id: string;
  created_at: Date;
  user_id?: string;
  email?: string;
  event_type: AuditEventType;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  metadata?: Record<string, any>;
  severity: Severity;
}

export interface CreateAuditLogData {
  userId?: string;
  email?: string;
  eventType: AuditEventType;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  severity?: Severity;
}

export const auditLogStore = {
  async create(data: CreateAuditLogData): Promise<void> {
    const severity = data.severity || getSeverityForEvent(data.eventType);

    await query(
      `INSERT INTO audit_logs (user_id, email, event_type, ip_address, user_agent, session_id, metadata, severity)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        data.userId || null,
        data.email || null,
        data.eventType,
        data.ipAddress || null,
        data.userAgent || null,
        data.sessionId || null,
        data.metadata ? JSON.stringify(data.metadata) : null,
        severity,
      ]
    );
  },

  async getRecentByEmail(email: string, limit: number = 50): Promise<AuditLog[]> {
    return query<AuditLog>(
      `SELECT * FROM audit_logs
       WHERE email = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [email, limit]
    );
  },

  async getCriticalEvents(limit: number = 100): Promise<AuditLog[]> {
    return query<AuditLog>(
      `SELECT * FROM audit_logs
       WHERE severity = 'critical'
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
  },

  async getEventsByType(eventType: AuditEventType, limit: number = 100): Promise<AuditLog[]> {
    return query<AuditLog>(
      `SELECT * FROM audit_logs
       WHERE event_type = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [eventType, limit]
    );
  },
};

function getSeverityForEvent(eventType: AuditEventType): Severity {
  const criticalEvents: AuditEventType[] = [
    'login_blocked_rate_limit',
    'suspicious_activity',
  ];

  const warningEvents: AuditEventType[] = [
    'login_failed',
    'login_blocked_account_locked',
  ];

  if (criticalEvents.includes(eventType)) return 'critical';
  if (warningEvents.includes(eventType)) return 'warning';
  return 'info';
}
