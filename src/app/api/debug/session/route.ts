import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  return NextResponse.json({
    hasSession: !!session,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    } : null,
    timestamp: new Date().toISOString(),
  });
}
