"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderService_1 = require("../services/orderService");
const cartService_1 = require("../services/cartService");
const router = (0, express_1.Router)();
// Get all orders
router.get('/', async (_req, res) => {
    try {
        const orders = await orderService_1.orderService.getAllOrders();
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get order by ID
router.get('/:id', async (req, res) => {
    try {
        const order = await orderService_1.orderService.getOrderById(req.params.id);
        if (!order)
            return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await orderService_1.orderService.getOrdersByUserId(parseInt(req.params.userId));
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create order from cart
router.post('/', async (req, res) => {
    try {
        const { userId, userName, items } = req.body;
        if (!userId || !userName || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Calculate total
        let total = 0;
        for (const item of items) {
            const cartItems = await cartService_1.cartService.getCartByUserId(userId);
            const cartItem = cartItems.find((c) => c.productId === item.productId);
            if (cartItem) {
                total += cartItem.product.rentalPrice * (item.quantity || 1);
            }
        }
        const order = await orderService_1.orderService.createOrder({
            userId,
            userName,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity || 1,
                rentalStartDate: item.rentalStartDate,
                rentalEndDate: item.rentalEndDate
            })),
            total
        });
        // Clear cart after order
        await cartService_1.cartService.clearCart(userId);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ error: 'Status is required' });
        const order = await orderService_1.orderService.updateOrderStatus(req.params.id, status);
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update order item status
router.patch('/:orderId/item/:itemId/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ error: 'Status is required' });
        const item = await orderService_1.orderService.updateOrderItemStatus(req.params.orderId, req.params.itemId, status);
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Delete order
router.delete('/:id', async (req, res) => {
    try {
        const order = await orderService_1.orderService.deleteOrder(req.params.id);
        res.json({ message: 'Order deleted', order });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
