import { Router, Request, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { userService } from '../services/userService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { prisma } from '../prisma';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Overview stats
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const usersCount = await prisma.user.count();
    const productsCount = await prisma.product.count();
    const ordersCount = await prisma.order.count();
    const pendingVerifications = await prisma.user.count({ where: { verificationStatus: 'Pending' } });
    const transactionsCount = await prisma.transaction.count();

    res.json({ usersCount, productsCount, ordersCount, pendingVerifications, transactionsCount });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/users/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { role, status, reason, adminNotes } = req.body;

    if (role) await userService.updateUserRole(id, role);
    if (status) await userService.updateUserStatus(id, status, reason);
    if (adminNotes !== undefined) await userService.updateUser(id, { adminNotes });

    const user = await userService.getUserById(id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Products
router.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Orders
router.get('/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status required' });
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/orders/:id', async (req: Request, res: Response) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    res.json({ message: 'Order deleted', order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
