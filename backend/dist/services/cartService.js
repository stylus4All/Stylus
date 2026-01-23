"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = exports.CartService = void 0;
const prisma_1 = require("../prisma");
class CartService {
    async getCartByUserId(userId) {
        const items = await prisma_1.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });
        return items.map((item) => ({
            ...item,
            product: {
                ...item.product,
                availableSizes: item.product.availableSizes ? JSON.parse(item.product.availableSizes) : [],
                images: item.product.images ? JSON.parse(item.product.images) : []
            }
        }));
    }
    async addToCart(userId, productId, quantity, rentalStartDate, rentalEndDate) {
        // Check if item exists
        const existing = await prisma_1.prisma.cartItem.findUnique({
            where: {
                userId_productId: { userId, productId }
            },
            include: { product: true }
        });
        if (existing) {
            const item = await prisma_1.prisma.cartItem.update({
                where: { id: existing.id },
                data: {
                    quantity: existing.quantity + quantity,
                    rentalStartDate,
                    rentalEndDate
                },
                include: { product: true }
            });
            return {
                ...item,
                product: {
                    ...item.product,
                    availableSizes: item.product.availableSizes ? JSON.parse(item.product.availableSizes) : [],
                    images: item.product.images ? JSON.parse(item.product.images) : []
                }
            };
        }
        const item = await prisma_1.prisma.cartItem.create({
            data: {
                userId,
                productId,
                quantity,
                rentalStartDate,
                rentalEndDate
            },
            include: { product: true }
        });
        return {
            ...item,
            product: {
                ...item.product,
                availableSizes: item.product.availableSizes ? JSON.parse(item.product.availableSizes) : [],
                images: item.product.images ? JSON.parse(item.product.images) : []
            }
        };
    }
    async removeFromCart(userId, productId) {
        return prisma_1.prisma.cartItem.delete({
            where: {
                userId_productId: { userId, productId }
            }
        });
    }
    async updateCartItem(cartItemId, quantity, rentalStartDate, rentalEndDate) {
        const item = await prisma_1.prisma.cartItem.update({
            where: { id: cartItemId },
            data: {
                quantity,
                rentalStartDate,
                rentalEndDate
            },
            include: { product: true }
        });
        return {
            ...item,
            product: {
                ...item.product,
                availableSizes: item.product.availableSizes ? JSON.parse(item.product.availableSizes) : [],
                images: item.product.images ? JSON.parse(item.product.images) : []
            }
        };
    }
    async clearCart(userId) {
        return prisma_1.prisma.cartItem.deleteMany({
            where: { userId }
        });
    }
    async getCartTotal(userId) {
        const items = await prisma_1.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true }
        });
        return items.reduce((total, item) => {
            return total + (item.product.rentalPrice * item.quantity);
        }, 0);
    }
}
exports.CartService = CartService;
exports.cartService = new CartService();
