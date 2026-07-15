import { Router, Request, Response } from 'express';
import { waitlistService } from '../services/waitlistService';

const router = Router();

// Join waitlist
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, location, audience } = req.body;

    if (!name || !email) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    const result = await waitlistService.joinWaitlist({
      name,
      email,
      location,
      audience
    });

    res.status(result.created ? 201 : 200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin helper: list waitlist entries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const entries = await waitlistService.getAllEntries();
    res.json(entries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;