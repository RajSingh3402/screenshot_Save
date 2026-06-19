import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'sitewatch_secret_key_123456_default';
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Skip static resources and system files
  if (
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/screenshots') ||
    path.startsWith('/reports')
  ) {
    return NextResponse.next();
  }

  // Handle Login Page access
  if (path === '/login') {
    if (token) {
      try {
        await jose.jwtVerify(token, key);
        // User already has a valid session, redirect to Dashboard
        return NextResponse.redirect(new URL('/', request.url));
      } catch (err) {
        // Token is invalid/expired, clear it and display login page
        const response = NextResponse.next();
        response.cookies.delete('token');
        return response;
      }
    }
    return NextResponse.next();
  }

  // Protect Dashboard & all other pages
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jose.jwtVerify(token, key);
    return NextResponse.next();
  } catch (err) {
    // If JWT is invalid/expired, redirect to login and clear token
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  /*
   * Match all paths except:
   * 1. /api routes
   * 2. Static files (_next/static, _next/image, images, favicon.ico)
   * 3. Static assets folders (screenshots, reports)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|screenshots|reports).*)',
  ],
};
