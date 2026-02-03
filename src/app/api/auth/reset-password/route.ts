/**
 * Reset Password API Route
 * Handles password reset with token
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resetPassword } from '@/lib/auth/password-reset';
import { sendPasswordChangedNotification } from '@/lib/email/security-notifications';
import { userStore } from '@/lib/db/users';
import { passwordSchema } from '@/lib/auth/validation';

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetSchema.parse(body);

    // Reset password
    const result = await resetPassword(token, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to reset password' },
        { status: 400 }
      );
    }

    // Send password changed notification
    // Note: We'd need to get the user's email from the token
    // For now, we'll skip the notification here and add it later if needed

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
