"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartService_1 = require("../services/cartService");
const router = (0, express_1.Router)();
// Get cart by user ID
router.get('/:userId', async (req, res) => {
    try {
        const cart = await cartService_1.cartService.getCartByUserId(parseInt(req.params.userId));
        const total = await cartService_1.cartService.getCartTotal(parseInt(req.params.userId));
        res.json({ items: cart, total });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Add to cart
router.post('/:userId/add', async (req, res) => {
    try {
        const { productId, quantity, rentalStartDate, rentalEndDate } = req.body;
        if (!productId || !quantity) {
            return res.status(400).json({ error: 'Product ID and quantity are required' });
        }
        const item = await cartService_1.cartService.addToCart(parseInt(req.params.userId), productId, quantity, rentalStartDate ? new Date(rentalStartDate) : undefined, rentalEndDate ? new Date(rentalEndDate) : undefined);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update cart item
router.patch('/:userId/item/:cartItemId', async (req, res) => {
    try {
        const { quantity, rentalStartDate, rentalEndDate } = req.body;
        if (!quantity) {
            return res.status(400).json({ error: 'Quantity is required' });
        }
        const item = await cartService_1.cartService.updateCartItem(req.params.cartItemId, quantity, rentalStartDate ? new Date(rentalStartDate) : undefined, rentalEndDate ? new Date(rentalEndDate) : undefined);
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Remove from cart
router.delete('/:userId/remove/:productId', async (req, res) => {
    try {
        const item = await cartService_1.cartService.removeFromCart(parseInt(req.params.userId), req.params.productId);
        res.json({ message: 'Item removed from cart', item });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Clear cart
router.delete('/:userId/clear', async (req, res) => {
    try {
        await cartService_1.cartService.clearCart(parseInt(req.params.userId));
        res.json({ message: 'Cart cleared' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
