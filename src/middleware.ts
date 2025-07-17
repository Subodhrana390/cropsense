'use server';

import {NextResponse, type NextRequest} from 'next/server';
import {verify} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // If trying to access auth page while logged in, redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected page while not logged in, redirect to login
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not set in environment variables.');
      }
      verify(token, JWT_SECRET);
    } catch (error) {
      console.error('JWT Verification Error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|$).*)',
  ],
};
