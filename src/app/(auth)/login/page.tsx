"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
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
            {/* Replace with actual FTC logo */}
            <div className="flex items-center justify-center h-full text-2xl font-bold text-gray-800">
              FTC FLOWDECK
            </div>
          </div>

          <h1 className="text-center text-xl tracking-wider text-gray-400">
            REVOLUTIONARY FILTRATION TECHNOLOGY
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-14 text-lg"
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-14 text-lg"
            />
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
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Demo credentials hint */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Demo Account:</p>
          <p className="font-mono text-xs mt-1">
            demo@ftc.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
