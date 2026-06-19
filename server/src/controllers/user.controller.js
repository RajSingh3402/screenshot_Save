import * as dbService from '../services/db.service.js';
import { hashPassword } from '../utils/auth.js';

// GET /api/users
export async function getUsers(req, res) {
  try {
    const users = await dbService.getUsers();
    // Exclude password hashes from the response for security
    const sanitizedUsers = users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
    res.json(sanitizedUsers);
  } catch (err) {
    console.error('Error in GET /api/users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /api/users
export async function createUser(req, res) {
  try {
    const { name, email, role, password, status } = req.body;

    // Validate input
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, Email, and Role are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Check if email already in use
    const duplicate = await dbService.getUserByEmail(trimmedEmail);
    if (duplicate) {
      return res.status(409).json({ error: 'Email address is already registered.' });
    }

    // Handle password generation/manual entry
    const plainPassword = password || Math.random().toString(36).slice(-10);
    const hashedPassword = await hashPassword(plainPassword);

    const newUser = await dbService.createUser({
      name,
      email: trimmedEmail,
      password: hashedPassword,
      role,
      status: status || 'Active'
    });

    const { password: _, ...userWithoutPassword } = newUser;

    // Return the user and the plain text password so the admin can view/copy it
    res.status(201).json({
      user: userWithoutPassword,
      plainPassword // Admin can copy this to give to the new user
    });
  } catch (err) {
    console.error('Error in POST /api/users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const { name, email, role, status } = req.body;

    const existingUser = await dbService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (role !== undefined) updates.role = role;
    if (status !== undefined) updates.status = status;
    
    if (email !== undefined) {
      const trimmedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }
      
      const duplicate = await dbService.getUserByEmail(trimmedEmail);
      if (duplicate && duplicate.id.toString() !== userId.toString()) {
        return res.status(409).json({ error: 'Email address is already in use.' });
      }
      updates.email = trimmedEmail;
    }

    const updatedUser = await dbService.updateUser(userId, updates);
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error in PUT /api/users/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    // Prevent deleting oneself
    if (req.user && req.user.id.toString() === userId.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own admin account.' });
    }

    const existingUser = await dbService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await dbService.deleteUser(userId);
    res.json({ message: 'User removed successfully.' });
  } catch (err) {
    console.error('Error in DELETE /api/users/:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// PUT /api/users/:id/password (Reset Password)
export async function resetPassword(req, res) {
  try {
    const userId = req.params.id;
    const { password } = req.body;

    if (!password || password.trim().length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await dbService.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const hashedPassword = await hashPassword(password);
    await dbService.updateUser(userId, { password: hashedPassword });

    res.json({ message: 'User password updated successfully.' });
  } catch (err) {
    console.error('Error in PUT /api/users/:id/password:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
