/**
 * Suspicious Activity Detection
 * Analyzes login patterns to detect potential security threats
 */

import { auditLogStore } from "@/lib/db/audit-logs";
import { logSuspiciousActivity } from "@/lib/auth/audit";
import {
  sendNewLoginNotification,
  sendSuspiciousActivityNotification,
} from "@/lib/email/security-notifications";

export interface LoginContext {
  userId: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  deviceType?: string;
}

export interface SuspiciousActivityResult {
  suspicious: boolean;
  reasons: string[];
  risk: 'low' | 'medium' | 'high';
  action: 'allow' | 'warn' | 'block';
}

/**
 * Analyze a login attempt for suspicious activity
 */
export async function detectSuspiciousActivity(
  context: LoginContext
): Promise<SuspiciousActivityResult> {
  const reasons: string[] = [];

  try {
    // Get recent login history (last 30 days)
    const recentLogins = await auditLogStore.getRecentByEmail(context.email, 100);
    const successfulLogins = recentLogins.filter(log => log.event_type === 'login_success');

    // Check 1: Login from new IP address
    if (successfulLogins.length > 0) {
      const knownIPs = new Set(successfulLogins.map(log => log.ip_address).filter(Boolean));
      if (!knownIPs.has(context.ipAddress)) {
        reasons.push('Login from new IP address');
      }
    }

    // Check 2: Login from new device type
    if (successfulLogins.length > 0 && context.deviceType) {
      const deviceTypes = successfulLogins.map(log => {
        // Extract device type from user agent if stored
        return log.user_agent || '';
      });

      // Simplified device type check
      const hasUsedSimilarDevice = deviceTypes.some(ua =>
        ua.toLowerCase().includes(context.deviceType?.toLowerCase() || '')
      );

      if (!hasUsedSimilarDevice) {
        reasons.push('Login from new device type');
      }
    }

    // Check 3: Multiple failed attempts before success
    const recentFailedAttempts = recentLogins
      .filter(log => log.event_type === 'login_failed')
      .filter(log => {
        // Failed attempts in last 1 hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(log.created_at) > oneHourAgo;
      });

    if (recentFailedAttempts.length >= 3) {
      reasons.push(`${recentFailedAttempts.length} failed attempts in last hour`);
    }

    // Check 4: Login outside normal hours
    const loginHour = new Date().getHours();
    const successfulLoginHours = successfulLogins.map(log => new Date(log.created_at).getHours());

    if (successfulLoginHours.length >= 10) {
      // If we have enough data, check if this hour is unusual
      const hourCounts = successfulLoginHours.reduce((acc, hour) => {
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const currentHourCount = hourCounts[loginHour] || 0;
      const avgCount = Object.values(hourCounts).reduce((a, b) => a + b, 0) / 24;

      if (currentHourCount === 0 && avgCount > 0) {
        reasons.push('Login at unusual time');
      }
    }

    // Calculate risk level and action
    const risk = calculateRisk(reasons.length);
    const action = determineAction(risk, reasons.length);

    // Log if suspicious
    if (reasons.length > 0) {
      await logSuspiciousActivity({
        userId: context.userId,
        email: context.email,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        details: reasons.join('; '),
      });

      // Send email notifications based on risk level
      if (risk === 'high') {
        // High risk - send suspicious activity alert
        await sendSuspiciousActivityNotification({
          email: context.email,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          details: reasons.join(', '),
        });
      } else if (risk === 'medium' || reasons.includes('Login from new IP address')) {
        // Medium risk or new IP - send new login notification
        await sendNewLoginNotification({
          email: context.email,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
        });
      }
    }

    return {
      suspicious: reasons.length > 0,
      reasons,
      risk,
      action,
    };
  } catch (error) {
    // Don't block login on detection errors
    return {
      suspicious: false,
      reasons: [],
      risk: 'low',
      action: 'allow',
    };
  }
}

/**
 * Calculate risk level based on number of suspicious indicators
 */
function calculateRisk(indicatorCount: number): 'low' | 'medium' | 'high' {
  if (indicatorCount === 0) return 'low';
  if (indicatorCount === 1) return 'low';
  if (indicatorCount === 2) return 'medium';
  return 'high';
}

/**
 * Determine what action to take based on risk level
 */
function determineAction(risk: 'low' | 'medium' | 'high', indicatorCount: number): 'allow' | 'warn' | 'block' {
  if (risk === 'high' && indicatorCount >= 4) {
    // Very suspicious - consider blocking or requiring 2FA
    return 'warn'; // For now, warn instead of block
  } else if (risk === 'medium' || risk === 'high') {
    // Suspicious - allow but send notification
    return 'warn';
  }
  return 'allow';
}

/**
 * Check if an IP address is from a known proxy/VPN
 * (Placeholder - would integrate with threat intelligence API in production)
 */
export async function checkIPReputation(ipAddress: string): Promise<{
  isProxy: boolean;
  isTor: boolean;
  isVPN: boolean;
  riskScore: number;
}> {
  // Placeholder implementation
  // In production, integrate with services like:
  // - IPQualityScore
  // - MaxMind GeoIP2
  // - AbuseIPDB
  // - Cloudflare Radar

  return {
    isProxy: false,
    isTor: false,
    isVPN: false,
    riskScore: 0,
  };
}
