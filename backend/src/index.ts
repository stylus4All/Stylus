import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { prisma } from './prisma';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.get('/users', async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  try {
    const user = await prisma.user.create({ data: { email, name } });
    res.status(201).json(user);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
