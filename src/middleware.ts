'use server';

import {NextResponse, type NextRequest} from 'next/server';
import {jwtVerify} from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in environment variables.');
    return null;
  }
  try {
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const {payload} = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Ignore requests for static files, images, and internal Next.js assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    /\.(jpe?g|png|gif|svg|ico|webp)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isHomePage = pathname === '/';

  const payload = token ? await verifyToken(token) : null;
  
  // If user is logged in, redirect from auth pages or home page to dashboard
  if (payload) {
    if (isAuthPage || isHomePage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // If user is not logged in, redirect from dashboard to login
  if (!payload) {
    if (isDashboardPage) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
