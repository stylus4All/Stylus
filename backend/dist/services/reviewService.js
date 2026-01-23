"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = void 0;
const prisma_1 = require("../prisma");
class ReviewService {
    async getProductReviews(productId) {
        return prisma_1.prisma.review.findMany({
            where: { productId },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { date: 'desc' }
        });
    }
    async createReview(data) {
        return prisma_1.prisma.review.create({
            data: {
                productId: data.productId,
                userId: data.userId,
                rating: Math.min(Math.max(data.rating, 1), 5),
                comment: data.comment
            },
            include: { user: { select: { id: true, name: true } } }
        });
    }
    async updateReview(id, data) {
        return prisma_1.prisma.review.update({
            where: { id },
            data: {
                rating: data.rating ? Math.min(Math.max(data.rating, 1), 5) : undefined,
                comment: data.comment
            }
        });
    }
    async deleteReview(id) {
        return prisma_1.prisma.review.delete({
            where: { id }
        });
    }
    async getAverageRating(productId) {
        const reviews = await prisma_1.prisma.review.findMany({
            where: { productId }
        });
        if (reviews.length === 0)
            return 0;
        const sum = reviews.reduce((total, review) => total + review.rating, 0);
        return sum / reviews.length;
    }
}
exports.ReviewService = ReviewService;
exports.reviewService = new ReviewService();
