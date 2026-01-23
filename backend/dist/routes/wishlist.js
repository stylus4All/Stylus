"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlistService_1 = require("../services/wishlistService");
const router = (0, express_1.Router)();
// Get wishlist by user ID
router.get('/:userId', async (req, res) => {
    try {
        const wishlist = await wishlistService_1.wishlistService.getWishlistByUserId(parseInt(req.params.userId));
        res.json(wishlist);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Add to wishlist
router.post('/:userId/add', async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        const item = await wishlistService_1.wishlistService.addToWishlist(parseInt(req.params.userId), productId);
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Check if product is in wishlist
router.get('/:userId/contains/:productId', async (req, res) => {
    try {
        const isInWishlist = await wishlistService_1.wishlistService.isInWishlist(parseInt(req.params.userId), req.params.productId);
        res.json({ inWishlist: isInWishlist });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Remove from wishlist
router.delete('/:userId/remove/:productId', async (req, res) => {
    try {
        const item = await wishlistService_1.wishlistService.removeFromWishlist(parseInt(req.params.userId), req.params.productId);
        res.json({ message: 'Item removed from wishlist', item });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
