import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'sitewatch_secret_key_123456_default';
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
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

  // Helper to generate a valid auto-login token for satyamsingh.000121@gmail.com
  const generateAutoLoginToken = async () => {
    return await new jose.SignJWT({
      userId: '1781701899024',
      email: 'satyamsingh.000121@gmail.com',
      role: 'Admin'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(key);
  };

  // If there is no token, automatically log them in and set the cookie
  if (!token) {
    const autoToken = await generateAutoLoginToken();
    const targetUrl = path === '/login' ? '/' : request.url;
    const response = NextResponse.redirect(new URL(targetUrl, request.url));
    response.cookies.set('token', autoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 1 day in seconds
    });
    return response;
  }

  // If token exists, verify it
  try {
    await jose.jwtVerify(token, key);
    // If user is trying to access /login, redirect to / since they are already authenticated
    if (path === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  } catch (err) {
    // If token is invalid or expired, generate a new one and redirect/refresh
    const autoToken = await generateAutoLoginToken();
    const targetUrl = path === '/login' ? '/' : request.url;
    const response = NextResponse.redirect(new URL(targetUrl, request.url));
    response.cookies.set('token', autoToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60
    });
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

export default proxy;


