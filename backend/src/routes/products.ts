import { Router, Request, Response } from 'express';
import { productService } from '../services/productService';

const router = Router();

// Get all products with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, searchQuery, maxPrice, sortBy } = req.query;

    const products = await productService.getAllProducts({
      category: category as string,
      searchQuery: searchQuery as string,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      sortBy: sortBy as string
    });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get products by owner
router.get('/owner/:ownerId', async (req: Request, res: Response) => {
  try {
    const products = await productService.getProductsByOwner(parseInt(req.params.ownerId));
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      brand,
      category,
      rentalPrice,
      retailPrice,
      buyPrice,
      isForSale,
      ownerId,
      description,
      color,
      occasion,
      condition,
      availableSizes,
      images
    } = req.body;

    if (!name || !brand || !category || !rentalPrice || !retailPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await productService.createProduct({
      name,
      brand,
      category,
      rentalPrice,
      retailPrice,
      buyPrice,
      isForSale,
      owner: ownerId ? { connect: { id: ownerId } } : undefined,
      description,
      color,
      occasion,
      condition,
      availableSizes,
      images
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Increment rental count
router.patch('/:id/increment-rental', async (req: Request, res: Response) => {
  try {
    const product = await productService.incrementRentalCount(req.params.id);
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const product = await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted', product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
