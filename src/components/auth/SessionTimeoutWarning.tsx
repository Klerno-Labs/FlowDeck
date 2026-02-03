"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface SessionTimeoutWarningProps {
  warningMinutes?: number; // Show warning N minutes before timeout
  sessionMaxAgeMinutes?: number; // Total session duration
}

export function SessionTimeoutWarning({
  warningMinutes = 5,
  sessionMaxAgeMinutes = 480, // 8 hours default
}: SessionTimeoutWarningProps) {
  const { data: session, update } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!session?.user) return;

    const checkSessionTimeout = () => {
      // Get session creation time from token
      const sessionCreatedAt = (session as any)?.user?.createdAt || Date.now();
      const sessionAge = Date.now() - sessionCreatedAt;
      const sessionMaxAge = sessionMaxAgeMinutes * 60 * 1000;
      const warningThreshold = warningMinutes * 60 * 1000;
      const remaining = sessionMaxAge - sessionAge;

      setTimeRemaining(remaining);

      // Show warning if within warning threshold
      if (remaining > 0 && remaining <= warningThreshold) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }

      // Session expired
      if (remaining <= 0) {
        window.location.href = '/login?expired=true';
      }
    };

    // Check immediately
    checkSessionTimeout();

    // Check every 30 seconds
    const interval = setInterval(checkSessionTimeout, 30000);

    return () => clearInterval(interval);
  }, [session, warningMinutes, sessionMaxAgeMinutes]);

  const handleExtendSession = async () => {
    try {
      // Trigger session update/refresh
      await update();
      setShowWarning(false);
    } catch (error) {
      // Error extending session
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/signout';
  };

  if (!showWarning) return null;

  const minutesRemaining = Math.ceil(timeRemaining / 60000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Session Expiring Soon
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your session will expire in approximately{' '}
              <span className="font-semibold text-gray-900">
                {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
              </span>
              . Would you like to continue working?
            </p>

            <div className="flex gap-3">
              <Button
                onClick={handleExtendSession}
                variant="primary"
                size="sm"
                className="flex-1"
              >
                Stay Signed In
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
