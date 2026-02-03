import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userStore } from "@/lib/db/users";
import { validateCredentials } from "@/lib/auth/validation";
import {
  checkRateLimit,
  recordLoginAttempt,
  createRateLimitIdentifier,
} from "@/lib/auth/rate-limit";
import {
  logLoginSuccess,
  logLoginFailed,
  logLoginBlocked,
} from "@/lib/auth/audit";
import { headers } from "next/headers";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Get request context for rate limiting and audit logging
        const headersList = headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';
        const rateLimitIdentifier = createRateLimitIdentifier(ip, userAgent);

        try {
          // Step 1: Validate input format
          const validatedCredentials = validateCredentials(credentials);

          // Step 2: Check rate limiting (IP-based)
          const rateLimitResult = await checkRateLimit(rateLimitIdentifier);
          if (!rateLimitResult.allowed) {
            await logLoginBlocked({
              email: validatedCredentials.email,
              ipAddress: ip,
              userAgent,
              reason: 'rate_limit',
              blockedUntil: rateLimitResult.blockedUntil,
            });
            return null;
          }

          // Step 3: Check account lockout
          const lockoutStatus = await userStore.checkAccountLockout(validatedCredentials.email);
          if (lockoutStatus.locked) {
            await logLoginBlocked({
              email: validatedCredentials.email,
              ipAddress: ip,
              userAgent,
              reason: 'account_locked',
              blockedUntil: lockoutStatus.lockedUntil,
            });
            return null;
          }

          // Step 4: Verify password
          const user = await userStore.verifyPassword(
            validatedCredentials.email,
            validatedCredentials.password
          );

          if (!user) {
            // Record failed attempt for both rate limiting and account lockout
            await recordLoginAttempt(rateLimitIdentifier, false);
            await userStore.recordFailedLogin(validatedCredentials.email);

            await logLoginFailed({
              email: validatedCredentials.email,
              ipAddress: ip,
              userAgent,
              reason: 'invalid_credentials',
            });

            return null;
          }

          // Step 5: Success - reset counters and log
          await recordLoginAttempt(rateLimitIdentifier, true);
          await userStore.recordSuccessfulLogin(validatedCredentials.email);

          await logLoginSuccess({
            userId: user.id,
            email: user.email,
            ipAddress: ip,
            userAgent,
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          // Log validation or system errors
          await logLoginFailed({
            email: (credentials?.email as string) || 'unknown',
            ipAddress: ip,
            userAgent,
            reason: 'system_error',
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.createdAt = Date.now();
      }

      // Session rotation - validate token isn't too old
      if (trigger === 'update') {
        if (!token.createdAt) {
          throw new Error('Invalid session');
        }

        const MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours
        const sessionAge = Date.now() - (token.createdAt as number);
        if (sessionAge > MAX_AGE_MS) {
          throw new Error('Session expired');
        }
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name ?? '';
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours (enterprise standard)
    updateAge: 60 * 60, // Refresh token every 1 hour
  },
  trustHost: true, // REQUIRED for Vercel/production
};
