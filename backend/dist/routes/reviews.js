"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviewService_1 = require("../services/reviewService");
const router = (0, express_1.Router)();
// Get product reviews
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await reviewService_1.reviewService.getProductReviews(req.params.productId);
        const averageRating = await reviewService_1.reviewService.getAverageRating(req.params.productId);
        res.json({ reviews, averageRating });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create review
router.post('/', async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;
        if (!productId || !userId || rating === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const review = await reviewService_1.reviewService.createReview({
            productId,
            userId,
            rating,
            comment
        });
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update review
router.patch('/:id', async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await reviewService_1.reviewService.updateReview(req.params.id, {
            rating,
            comment
        });
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete review
router.delete('/:id', async (req, res) => {
    try {
        const review = await reviewService_1.reviewService.deleteReview(req.params.id);
        res.json({ message: 'Review deleted', review });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
