import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'sitewatch_secret_key_123456_default';
const key = new TextEncoder().encode(JWT_SECRET);

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, key);
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      role: String(payload.role),
    };
  } catch (err) {
    return null;
  }
}

/**
 * Checks request context for token, verifies it, fetches user from database,
 * and ensures they are active. Optional role array checks if their role matches.
 */
export async function verifyAuth(
  request: NextRequest,
  allowedRoles?: string[]
): Promise<AuthenticatedUser | null> {
  try {
    // 1. Retrieve token from Cookies
    let token = request.cookies.get('token')?.value;

    // Fallback to Next.js cookies helper
    if (!token) {
      try {
        const cookieStore = await cookies();
        token = cookieStore.get('token')?.value;
      } catch (err) {
        // Fallback silently if called during static rendering/generation
      }
    }

    // 2. Fallback to Authorization Header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    // Bypass check for internal system/scheduler calls using the JWT_SECRET
    if (token === JWT_SECRET) {
      return {
        id: 0,
        name: 'System Scheduler',
        email: 'system@scheduler.local',
        role: 'Admin',
        status: 'Active',
      };
    }

    // 3. Verify JWT token
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // 4. Look up user details in MySQL database via Prisma
    let user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
    });

    if (!user && decoded.email === 'satyamsingh.000121@gmail.com') {
      try {
        user = await prisma.user.create({
          data: {
            id: BigInt(decoded.userId),
            name: 'Satyam Singh',
            email: decoded.email,
            password: '', // Auto-logged in user has no password
            role: 'Admin',
            status: 'Active',
          },
        });
        console.log(`Auto-created default admin user ${decoded.email} in client database.`);
      } catch (createErr) {
        console.error('Failed to auto-create default admin user in client database:', createErr);
      }
    }

    if (!user) {
      return null;
    }

    // 5. Ensure account is active
    if (user.status !== 'Active') {
      return null;
    }

    const authenticatedUser: AuthenticatedUser = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    // 6. Check role permissions if specified
    if (allowedRoles && !allowedRoles.includes(authenticatedUser.role)) {
      return null;
    }

    return authenticatedUser;
  } catch (err) {
    console.error('Error verifying auth in verifyAuth:', err);
    return null;
  }
}
