import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { prisma } from './prisma';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import cartRoutes from './routes/cart';
import wishlistRoutes from './routes/wishlist';
import transactionRoutes from './routes/transactions';
import reviewRoutes from './routes/reviews';

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS for frontend origin (set FRONTEND_URL in .env for production)
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reviews', reviewRoutes);

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Stylus Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      cart: '/api/cart',
      wishlist: '/api/wishlist',
      transactions: '/api/transactions',
      reviews: '/api/reviews',
      health: '/health'
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
