"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productService_1 = require("../services/productService");
const router = (0, express_1.Router)();
// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { category, searchQuery, maxPrice, sortBy } = req.query;
        const products = await productService_1.productService.getAllProducts({
            category: category,
            searchQuery: searchQuery,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            sortBy: sortBy
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await productService_1.productService.getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get products by owner
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const products = await productService_1.productService.getProductsByOwner(parseInt(req.params.ownerId));
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create product
router.post('/', async (req, res) => {
    try {
        const { name, brand, category, rentalPrice, retailPrice, buyPrice, isForSale, ownerId, description, color, occasion, condition, availableSizes, images } = req.body;
        if (!name || !brand || !category || !rentalPrice || !retailPrice) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const product = await productService_1.productService.createProduct({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update product
router.patch('/:id', async (req, res) => {
    try {
        const product = await productService_1.productService.updateProduct(req.params.id, req.body);
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Increment rental count
router.patch('/:id/increment-rental', async (req, res) => {
    try {
        const product = await productService_1.productService.incrementRentalCount(req.params.id);
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const product = await productService_1.productService.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted', product });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
