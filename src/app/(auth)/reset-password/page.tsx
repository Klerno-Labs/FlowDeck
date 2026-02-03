"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 px-8">
        {/* FTC Logo */}
        <div className="flex flex-col items-center">
          <div className="mb-8 h-20 w-48 relative">
            <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-800">
              FTC FLOWDECK
            </div>
          </div>

          <h1 className="text-center text-xl tracking-wider text-gray-400">
            REVOLUTIONARY FILTRATION TECHNOLOGY
          </h1>
        </div>

        {/* Reset Password Form */}
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>

          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
              <p className="font-medium">Password reset successfully!</p>
              <p className="mt-1">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-14 text-lg"
                  minLength={8}
                />

                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="h-14 text-lg"
                  minLength={8}
                />
              </div>

              <div className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-14 text-lg"
                disabled={isLoading || !token}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
