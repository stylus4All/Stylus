import { Router, Request, Response } from 'express';
import { wishlistService } from '../services/wishlistService';

const router = Router();

// Get wishlist by user ID
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const wishlist = await wishlistService.getWishlistByUserId(parseInt(req.params.userId));
    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add to wishlist
router.post('/:userId/add', async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const item = await wishlistService.addToWishlist(
      parseInt(req.params.userId),
      productId
    );

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check if product is in wishlist
router.get('/:userId/contains/:productId', async (req: Request, res: Response) => {
  try {
    const isInWishlist = await wishlistService.isInWishlist(
      parseInt(req.params.userId),
      req.params.productId
    );

    res.json({ inWishlist: isInWishlist });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from wishlist
router.delete('/:userId/remove/:productId', async (req: Request, res: Response) => {
  try {
    const item = await wishlistService.removeFromWishlist(
      parseInt(req.params.userId),
      req.params.productId
    );
    res.json({ message: 'Item removed from wishlist', item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
