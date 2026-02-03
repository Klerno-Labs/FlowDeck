import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';

// Force Node.js runtime for middleware (required for bcryptjs/crypto)
export const runtime = 'nodejs';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Redirect root to appropriate page
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/home', req.url));
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
