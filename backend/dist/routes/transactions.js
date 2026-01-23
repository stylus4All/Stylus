"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionService_1 = require("../services/transactionService");
const router = (0, express_1.Router)();
// Get all transactions
router.get('/', async (_req, res) => {
    try {
        const transactions = await transactionService_1.transactionService.getAllTransactions();
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get transactions by user ID
router.get('/user/:userId', async (req, res) => {
    try {
        const transactions = await transactionService_1.transactionService.getTransactionsByUserId(parseInt(req.params.userId));
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Create transaction
router.post('/', async (req, res) => {
    try {
        const { userId, type, amount, description, paymentMethod, orderId } = req.body;
        if (!userId || !type || !amount || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const transaction = await transactionService_1.transactionService.createTransaction({
            userId,
            type,
            amount,
            description,
            paymentMethod,
            orderId
        });
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update transaction status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ error: 'Status is required' });
        const transaction = await transactionService_1.transactionService.updateTransactionStatus(req.params.id, status);
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Request withdrawal
router.post('/withdrawal/request', async (req, res) => {
    try {
        const { userId, amount, bankDetails } = req.body;
        if (!userId || !amount || !bankDetails) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const transaction = await transactionService_1.transactionService.requestWithdrawal(userId, amount, bankDetails);
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Process withdrawal
router.post('/:id/withdrawal/process', async (req, res) => {
    try {
        const transaction = await transactionService_1.transactionService.processWithdrawal(req.params.id);
        res.json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Transfer funds
router.post('/transfer', async (req, res) => {
    try {
        const { fromUserId, toUserId, amount, description } = req.body;
        if (!fromUserId || !toUserId || !amount || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const transaction = await transactionService_1.transactionService.transferFunds(fromUserId, toUserId, amount, description);
        res.status(201).json(transaction);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
