import { Router, Request, Response } from 'express';
import { transactionService } from '../services/transactionService';

const router = Router();

// Get all transactions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get transactions by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const transactions = await transactionService.getTransactionsByUserId(
      parseInt(req.params.userId)
    );
    res.json(transactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, amount, description, paymentMethod, orderId } = req.body;

    if (!userId || !type || !amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await transactionService.createTransaction({
      userId,
      type,
      amount,
      description,
      paymentMethod,
      orderId
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update transaction status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const transaction = await transactionService.updateTransactionStatus(req.params.id, status);
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Request withdrawal
router.post('/withdrawal/request', async (req: Request, res: Response) => {
  try {
    const { userId, amount, bankDetails } = req.body;

    if (!userId || !amount || !bankDetails) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await transactionService.requestWithdrawal(
      userId,
      amount,
      bankDetails
    );

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Process withdrawal
router.post('/:id/withdrawal/process', async (req: Request, res: Response) => {
  try {
    const transaction = await transactionService.processWithdrawal(req.params.id);
    res.json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer funds
router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const { fromUserId, toUserId, amount, description } = req.body;

    if (!fromUserId || !toUserId || !amount || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transaction = await transactionService.transferFunds(
      fromUserId,
      toUserId,
      amount,
      description
    );

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
