'use server';

import {NextResponse, type NextRequest} from 'next/server';
import {verify} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const {pathname} = request.nextUrl;

  // Public pages that do not require authentication
  const publicPaths = ['/login', '/signup'];

  // If the path is public, let the request through
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // For all other paths, require a token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables.');
    }
    // Verify the token
    verify(token, JWT_SECRET);
    // If token is valid, proceed
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    // If token is invalid, redirect to login and clear the bad token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
