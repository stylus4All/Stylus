import { Router, Request, Response } from 'express';
import { userService } from '../services/userService';

const router = Router();

// Get all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, phone, address, role } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const user = await userService.createUser({
      email,
      name,
      phone: phone || null,
      address: address || null,
      role: role || 'User'
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(parseInt(req.params.id), req.body);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, reason } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const user = await userService.updateUserStatus(parseInt(req.params.id), status, reason);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role
router.patch('/:id/role', async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ error: 'Role is required' });

    const user = await userService.updateUserRole(parseInt(req.params.id), role);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit verification documents
router.post('/:id/verify', async (req: Request, res: Response) => {
  try {
    const docs = req.body;
    const user = await userService.submitVerification(parseInt(req.params.id), docs);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve verification
router.post('/:id/approve-verification', async (req: Request, res: Response) => {
  try {
    const user = await userService.approveVerification(parseInt(req.params.id));
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reject verification
router.post('/:id/reject-verification', async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: 'Reason is required' });

    const user = await userService.rejectVerification(parseInt(req.params.id), reason);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update wallet
router.patch('/:id/wallet', async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    if (amount === undefined) return res.status(400).json({ error: 'Amount is required' });

    const user = await userService.updateWallet(parseInt(req.params.id), amount);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add to search history
router.post('/:id/search-history', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const user = await userService.addSearchHistory(parseInt(req.params.id), query);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'User deleted', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
