'use server';

import {NextResponse, type NextRequest} from 'next/server';
import {verify} from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const {pathname} = request.nextUrl;

  // Allow access to auth pages, API routes, and static files
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables.');
    }
    await verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    // Clear invalid cookie
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
