import { Router, Request, Response } from 'express';
import { cartService } from '../services/cartService';

const router = Router();

// Get cart by user ID
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const cart = await cartService.getCartByUserId(parseInt(req.params.userId));
    const total = await cartService.getCartTotal(parseInt(req.params.userId));
    res.json({ items: cart, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add to cart
router.post('/:userId/add', async (req: Request, res: Response) => {
  try {
    const { productId, quantity, rentalStartDate, rentalEndDate } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }

    const item = await cartService.addToCart(
      parseInt(req.params.userId),
      productId,
      quantity,
      rentalStartDate ? new Date(rentalStartDate) : undefined,
      rentalEndDate ? new Date(rentalEndDate) : undefined
    );

    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
router.patch('/:userId/item/:cartItemId', async (req: Request, res: Response) => {
  try {
    const { quantity, rentalStartDate, rentalEndDate } = req.body;

    if (!quantity) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const item = await cartService.updateCartItem(
      req.params.cartItemId,
      quantity,
      rentalStartDate ? new Date(rentalStartDate) : undefined,
      rentalEndDate ? new Date(rentalEndDate) : undefined
    );

    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from cart
router.delete('/:userId/remove/:productId', async (req: Request, res: Response) => {
  try {
    const item = await cartService.removeFromCart(
      parseInt(req.params.userId),
      req.params.productId
    );
    res.json({ message: 'Item removed from cart', item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cart
router.delete('/:userId/clear', async (req: Request, res: Response) => {
  try {
    await cartService.clearCart(parseInt(req.params.userId));
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
