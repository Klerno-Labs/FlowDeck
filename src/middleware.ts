import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token (Edge Runtime compatible)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // Redirect root to appropriate page
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to login if accessing protected routes without auth
  const isProtectedRoute = !pathname.startsWith('/login') &&
                           !pathname.startsWith('/api/auth');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect away from login if already authenticated
  if (pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};
