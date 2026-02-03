# Security Features

This document outlines the comprehensive security features implemented in the FTC FlowDeck authentication system.

## P0: Critical Security Features ✅

### 1. Rate Limiting
- **5 attempts per 15 minutes** per IP/User-Agent combination
- **30-minute automatic block** after limit exceeded
- Privacy-protected identifiers (SHA-256 hashed)
- Database: `rate_limits` table

### 2. Account Lockout
- **10 failed attempts** locks account for **1 hour**
- Tracks failed/successful login timestamps
- Automatic unlock after duration
- Database: Extended `users` table with lockout columns

### 3. Comprehensive Audit Logging
- All authentication events logged to database
- Severity levels: info, warning, critical
- Includes IP address, user agent, timestamps
- 90-day retention with automatic cleanup
- Database: `audit_logs` table

### 4. Input Validation & Sanitization
- Zod schemas for email/password validation
- XSS prevention (sanitizes dangerous characters)
- DoS prevention (length limits)
- SQL injection protection (parameterized queries)

### 5. Hardened Session Configuration
- **8-hour sessions** (enterprise standard)
- **1-hour automatic refresh**
- JWT age validation
- Secure cookie settings (httpOnly, secure, sameSite)

### 6. Zero Debug Logging in Production
- ALL console.log/error removed from production build
- No sensitive data exposure in logs
- Audit system handles security logging

## P1: High-Priority Security Features ✅

### 7. CSRF Protection
- **Automatically handled by NextAuth v5**
- Built-in CSRF token validation
- Token sent with every form submission
- No additional configuration needed

### 8. Security Headers
Comprehensive HTTP security headers on all responses:
- **HSTS**: 2-year max-age with subdomain inclusion
- **CSP**: Content Security Policy restricting resource loading
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-XSS-Protection**: Enabled with block mode
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts camera, mic, geolocation

### 9. Session Device Tracking
- Tracks all active sessions per user
- Records: device type, browser, OS, IP, timestamps
- View active sessions and revoke remotely
- Database: `sessions` table
- User agent parsing with ua-parser-js

### 10. Suspicious Activity Detection
- Analyzes login patterns for anomalies:
  - New IP address detection
  - New device type detection
  - Multiple failed attempts before success
  - Login at unusual times
- Risk scoring: low, medium, high
- Actions: allow, warn, block
- Logged to audit trail for review

## Security Standards Achieved

✅ **OWASP Top 10** compliant
✅ **Enterprise session management**
✅ **Comprehensive audit trail**
✅ **Multi-layer attack prevention**
✅ **Zero sensitive data exposure**
✅ **Production-ready security headers**

## Database Schema

### Tables Created
- `rate_limits` - Rate limiting tracking
- `audit_logs` - Security event logging
- `sessions` - Session device tracking
- Extended `users` - Account lockout columns

### Indexes
All tables have appropriate indexes for query performance.

### Cleanup Functions
- `cleanup_rate_limits()` - Removes records older than 30 days
- `cleanup_audit_logs()` - Removes records older than 90 days
- `cleanup_sessions()` - Removes expired/revoked sessions

## API Reference

### Rate Limiting
```typescript
import { checkRateLimit, recordLoginAttempt } from '@/lib/auth/rate-limit';

const result = await checkRateLimit(identifier);
// { allowed: boolean, attemptsRemaining: number, blockedUntil?: Date }

await recordLoginAttempt(identifier, success);
```

### Audit Logging
```typescript
import { logAuditEvent } from '@/lib/auth/audit';

await logAuditEvent({
  userId: 'user-id',
  email: 'user@example.com',
  eventType: 'login_success',
  ipAddress: '1.2.3.4',
  userAgent: 'Mozilla/5.0...',
});
```

### Session Tracking
```typescript
import { sessionStore } from '@/lib/db/sessions';

const sessions = await sessionStore.getActiveSessions(userId);
await sessionStore.revoke(sessionId);
await sessionStore.revokeAllForUser(userId, exceptSessionId);
```

### Suspicious Activity Detection
```typescript
import { detectSuspiciousActivity } from '@/lib/auth/suspicious-activity';

const result = await detectSuspiciousActivity({
  userId: 'user-id',
  email: 'user@example.com',
  ipAddress: '1.2.3.4',
  userAgent: 'Mozilla/5.0...',
  deviceType: 'desktop',
});
// { suspicious: boolean, reasons: string[], risk: 'low'|'medium'|'high', action: 'allow'|'warn'|'block' }
```

## Testing Security

### Test Rate Limiting
1. Try logging in with wrong password 5 times
2. 6th attempt should be blocked for 30 minutes
3. Check `rate_limits` table

### Test Account Lockout
1. After rate limit expires, try 5 more wrong passwords
2. Account locks for 1 hour after 10 total failed attempts
3. Check `users` table `locked_until` column

### Test Audit Logging
1. Perform various auth actions (login, logout, failed login)
2. Check `audit_logs` table for entries
3. Verify severity levels are correct

### Test Security Headers
1. Visit site in production
2. Open browser DevTools → Network tab
3. Check response headers for security headers
4. Use securityheaders.com to scan

### Test Suspicious Activity
1. Login from different IP/device than usual
2. Check `audit_logs` for suspicious_activity events
3. Verify risk scoring is working

## Monitoring

### Metrics to Track
- Failed login attempts per hour
- Account lockouts per day
- Rate limit blocks per hour
- Suspicious activity detections
- Session count per user

### Alerts to Configure
- **Critical**: >10 failed logins per minute (potential DDoS)
- **Critical**: High-risk suspicious activity
- **Warning**: Account locked
- **Warning**: >5 rate limit blocks per minute

## Future Enhancements (P2/P3)

Potential future security features:
- Two-Factor Authentication (2FA/TOTP)
- Password reset flow with email verification
- WebAuthn/Passkeys support
- IP allowlisting/blocklisting
- Automated security testing suite
- Admin security dashboard
- Email notifications for security events
- Password history (prevent reuse)
