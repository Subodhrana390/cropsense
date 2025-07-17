'use server';

import {NextResponse, type NextRequest} from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables.');
    return false;
  }
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secretKey);
    return true;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const {pathname} = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardPage = pathname.startsWith('/dashboard');
  
  const isTokenValid = token ? await verifyToken(token) : false;

  if (isDashboardPage) {
    if (!isTokenValid) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  if (isAuthPage) {
    if (isTokenValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup'
  ],
};
