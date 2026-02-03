/**
 * Security Email Notifications
 * Sends email alerts for important security events
 */

import { resend } from '@/lib/email/resend';
import SecurityAlert from '@/lib/email/templates/SecurityAlert';
import { parseUserAgent } from '@/lib/auth/device-detection';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FTC FlowDeck <onboarding@resend.dev>';

export interface SecurityNotificationData {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: Date;
  details?: string;
}

/**
 * Send notification for new login from unfamiliar device/location
 */
export async function sendNewLoginNotification(data: SecurityNotificationData): Promise<void> {
  try {
    const deviceInfo = data.userAgent ? parseUserAgent(data.userAgent) : undefined;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'New Login to Your FTC FlowDeck Account',
      react: SecurityAlert({
        type: 'new_login',
        email: data.email,
        timestamp: (data.timestamp || new Date()).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
        ipAddress: data.ipAddress,
        browser: deviceInfo?.browser,
        os: deviceInfo?.os,
      }),
    });
  } catch (error) {
    // Log but don't fail auth flow if email fails
    if (process.env.NODE_ENV === 'development') {
      console.error('[Email] Failed to send new login notification:', error);
    }
  }
}

/**
 * Send notification for suspicious activity
 */
export async function sendSuspiciousActivityNotification(
  data: SecurityNotificationData
): Promise<void> {
  try {
    const deviceInfo = data.userAgent ? parseUserAgent(data.userAgent) : undefined;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: '⚠️ Suspicious Activity Detected on Your Account',
      react: SecurityAlert({
        type: 'suspicious_activity',
        email: data.email,
        timestamp: (data.timestamp || new Date()).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
        ipAddress: data.ipAddress,
        browser: deviceInfo?.browser,
        os: deviceInfo?.os,
        details: data.details,
      }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Email] Failed to send suspicious activity notification:', error);
    }
  }
}

/**
 * Send notification when account is locked
 */
export async function sendAccountLockedNotification(data: SecurityNotificationData): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: '🔒 Your FTC FlowDeck Account Has Been Locked',
      react: SecurityAlert({
        type: 'account_locked',
        email: data.email,
        timestamp: (data.timestamp || new Date()).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
        details: data.details,
      }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Email] Failed to send account locked notification:', error);
    }
  }
}

/**
 * Send notification when password is changed
 */
export async function sendPasswordChangedNotification(
  data: SecurityNotificationData
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: '✅ Your Password Was Changed',
      react: SecurityAlert({
        type: 'password_changed',
        email: data.email,
        timestamp: (data.timestamp || new Date()).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'long',
        }),
      }),
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Email] Failed to send password changed notification:', error);
    }
  }
}
