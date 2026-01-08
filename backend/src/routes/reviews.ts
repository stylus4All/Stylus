import { Router, Request, Response } from 'express';
import { reviewService } from '../services/reviewService';

const router = Router();

// Get product reviews
router.get('/product/:productId', async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    const averageRating = await reviewService.getAverageRating(req.params.productId);
    res.json({ reviews, averageRating });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, userId, rating, comment } = req.body;

    if (!productId || !userId || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const review = await reviewService.createReview({
      productId,
      userId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update review
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { rating, comment } = req.body;

    const review = await reviewService.updateReview(req.params.id, {
      rating,
      comment
    });

    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const review = await reviewService.deleteReview(req.params.id);
    res.json({ message: 'Review deleted', review });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
