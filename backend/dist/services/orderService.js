"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = exports.OrderService = void 0;
const prisma_1 = require("../prisma");
class OrderService {
    async getAllOrders() {
        return prisma_1.prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                },
                user: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getOrderById(id) {
        return prisma_1.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                user: { select: { id: true, name: true, email: true } },
                transactions: true
            }
        });
    }
    async getOrdersByUserId(userId) {
        return prisma_1.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                },
                transactions: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createOrder(data) {
        return prisma_1.prisma.order.create({
            data: {
                userId: data.userId,
                userName: data.userName,
                total: data.total,
                status: 'Processing',
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        status: 'Pending Approval',
                        rentalStartDate: item.rentalStartDate,
                        rentalEndDate: item.rentalEndDate
                    }))
                }
            },
            include: {
                items: { include: { product: true } }
            }
        });
    }
    async updateOrderStatus(id, status) {
        return prisma_1.prisma.order.update({
            where: { id },
            data: { status }
        });
    }
    async updateOrderItemStatus(orderId, itemId, status) {
        const orderItem = await prisma_1.prisma.orderItem.update({
            where: { id: itemId },
            data: { status }
        });
        // Check if all items are completed
        const order = await prisma_1.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });
        if (order) {
            const allComplete = order.items.every((i) => ['Accepted', 'Shipped', 'Completed', 'Returned', 'Cancelled', 'Rejected'].includes(i.status));
            if (allComplete) {
                await prisma_1.prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'Completed' }
                });
            }
        }
        return orderItem;
    }
    async deleteOrder(id) {
        return prisma_1.prisma.order.delete({
            where: { id }
        });
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
