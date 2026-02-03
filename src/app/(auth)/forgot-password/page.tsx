"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || 'Failed to process request');
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

        {/* Forgot Password Form */}
        <div className="mt-12 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {success ? (
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-600">
              <p className="font-medium">Check your email</p>
              <p className="mt-1">
                If an account exists with this email, a password reset link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-14 text-lg"
              />

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
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
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
