import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // Debug logging
  if (pathname === '/home' || pathname === '/login') {
    console.error('[MIDDLEWARE]', {
      pathname,
      hasToken: !!token,
      tokenEmail: token?.email || 'none',
      cookies: request.cookies.getAll().map(c => c.name),
    });
  }

  // Public routes that don't require authentication
  const isPublicRoute = pathname.startsWith('/login') ||
                        pathname.startsWith('/api/auth');

  // Redirect root
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(isLoggedIn ? '/home' : '/login', request.url)
    );
  }

  // Protect all routes except public ones
  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
