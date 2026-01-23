"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistService = exports.WishlistService = void 0;
const prisma_1 = require("../prisma");
class WishlistService {
    async getWishlistByUserId(userId) {
        return prisma_1.prisma.wishlistItem.findMany({
            where: { userId },
            include: { product: true }
        });
    }
    async addToWishlist(userId, productId) {
        const existing = await prisma_1.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });
        if (existing) {
            return existing;
        }
        return prisma_1.prisma.wishlistItem.create({
            data: {
                userId,
                productId
            },
            include: { product: true }
        });
    }
    async removeFromWishlist(userId, productId) {
        return prisma_1.prisma.wishlistItem.delete({
            where: {
                userId_productId: { userId, productId }
            }
        });
    }
    async isInWishlist(userId, productId) {
        const item = await prisma_1.prisma.wishlistItem.findUnique({
            where: {
                userId_productId: { userId, productId }
            }
        });
        return !!item;
    }
}
exports.WishlistService = WishlistService;
exports.wishlistService = new WishlistService();
