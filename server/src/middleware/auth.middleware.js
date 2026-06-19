import { verifyToken } from '../utils/auth.js';
import { prisma } from '../lib/prisma.ts';

export async function requireAuth(req, res, next) {
  try {
    // 1. Get token from cookies or Authorization header
    const cookieHeader = req.headers.cookie || '';
    const cookies = cookieHeader ? Object.fromEntries(
      cookieHeader.split(';').map(c => {
        const parts = c.trim().split('=');
        return [parts[0], decodeURIComponent(parts.slice(1).join('='))];
      })
    ) : {};
    
    let token = cookies.token;
    
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    // Bypass check for internal system/scheduler calls using JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET || 'sitewatch_secret_key_123456_default';
    if (token === JWT_SECRET) {
      req.user = {
        id: 0,
        name: 'System Scheduler',
        email: 'system@scheduler.local',
        role: 'Admin',
        status: 'Active'
      };
      return next();
    }

    // 2. Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }

    // 3. Fetch user and check active status from database
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) }
    });

    if (!user) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    if (user.status !== 'Active') {
      return res.status(401).json({ error: 'Your account has been deactivated. Please contact an admin.' });
    }

    // 4. Attach sanitized user details to request object
    req.user = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch (err) {
    console.error('Error in requireAuth middleware:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}

export function requireRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied: You do not have permission to access this resource.' });
    }
    
    next();
  };
}
