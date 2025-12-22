import { Router, Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';

const router = Router();

// Get all orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrdersByUserId(parseInt(req.params.userId));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create order from cart
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, userName, items } = req.body;

    if (!userId || !userName || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculate total
    let total = 0;
    for (const item of items) {
      const cartItems = await cartService.getCartByUserId(userId);
      const cartItem = cartItems.find((c: any) => c.productId === item.productId);
      if (cartItem) {
        total += cartItem.product.rentalPrice * (item.quantity || 1);
      }
    }

    const order = await orderService.createOrder({
      userId,
      userName,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity || 1,
        rentalStartDate: item.rentalStartDate,
        rentalEndDate: item.rentalEndDate
      })),
      total
    });

    // Clear cart after order
    await cartService.clearCart(userId);

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update order item status
router.patch('/:orderId/item/:itemId/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const item = await orderService.updateOrderItemStatus(
      req.params.orderId,
      req.params.itemId,
      status
    );
    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted', order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
