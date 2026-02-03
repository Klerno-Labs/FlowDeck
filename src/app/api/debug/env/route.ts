import { NextResponse } from 'next/server';

export async function GET() {
  // Temporarily allow access for debugging
  // if (process.env.NODE_ENV === 'production' && process.env.DEBUG_SECRET !== 'allow') {
  //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // }

  return NextResponse.json({
    // Sanity variables
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'MISSING',
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || 'MISSING',
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN ? 'SET' : 'MISSING',

    // App variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',

    // Database
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',

    // Resend
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'MISSING',

    // Cron
    CRON_SECRET: process.env.CRON_SECRET ? 'SET' : 'MISSING',

    // Environment
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL || 'NOT_VERCEL',
    VERCEL_ENV: process.env.VERCEL_ENV || 'NOT_VERCEL',
  });
}
