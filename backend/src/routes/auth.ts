import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, address, role, location } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    // Validate role if provided
    if (role && !['User', 'Partner', 'Admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be User, Partner, or Admin' });
      return;
    }

    const result = await authService.register({
      email,
      password,
      name,
      phone,
      address,
      role,
      location
    });

    res.status(201).json(result);
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await authService.login({ email, password });

    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      res.status(401).json({ error: error.message });
    } else if (error.message.includes('suspended')) {
      res.status(403).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get current user (verify token)
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const user = await authService.verifyToken(token);

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const { oldPassword, newPassword } = req.body;

    // Validate required fields
    if (!oldPassword || !newPassword) {
      res.status(400).json({ error: 'Old password and new password are required' });
      return;
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long' });
      return;
    }

    const result = await authService.changePassword(req.user.userId, oldPassword, newPassword);

    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'Current password is incorrect') {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Logout (client-side only - remove token from storage)
router.post('/logout', authenticateToken, async (_req: AuthRequest, res: Response) => {
  // With JWT, logout is handled client-side by removing the token
  // This endpoint is for logging purposes or future blacklist implementation
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
