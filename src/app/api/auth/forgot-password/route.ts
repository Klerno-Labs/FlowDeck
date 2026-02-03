/**
 * Forgot Password API Route
 * Handles password reset requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requestPasswordReset } from '@/lib/auth/password-reset';
import { sendPasswordResetEmail } from '@/lib/email/security-notifications';
import { emailSchema } from '@/lib/auth/validation';

const requestSchema = z.object({
  email: emailSchema,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    // Request password reset
    const result = await requestPasswordReset(email);

    // Send email if token was generated
    if (result.success && result.token) {
      await sendPasswordResetEmail(email, result.token);
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
