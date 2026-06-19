import express from 'express';
import { prisma } from '../lib/prisma.ts';
import { comparePassword, signToken } from '../utils/auth.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Verify active status
    if (user.status !== 'Active') {
      return res.status(401).json({ error: 'Your account is deactivated. Please contact an admin.' });
    }

    // Generate JWT token
    const token = signToken({
      userId: user.id.toString(),
      email: user.email,
      role: user.role
    });

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

    // Send user details back
    return res.json({
      success: true,
      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (err) {
    console.error('Login API error:', err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return res.json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout API error:', err);
    return res.status(500).json({ error: 'Internal server error during logout.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
