"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = exports.TransactionService = void 0;
const prisma_1 = require("../prisma");
class TransactionService {
    async getAllTransactions() {
        return prisma_1.prisma.transaction.findMany({
            include: {
                user: { select: { id: true, name: true, email: true } },
                order: { select: { id: true, total: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getTransactionsByUserId(userId) {
        return prisma_1.prisma.transaction.findMany({
            where: { userId },
            include: {
                order: { select: { id: true, total: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createTransaction(data) {
        return prisma_1.prisma.transaction.create({
            data: {
                userId: data.userId,
                type: data.type,
                amount: data.amount,
                description: data.description,
                paymentMethod: data.paymentMethod,
                orderId: data.orderId,
                status: 'Completed'
            }
        });
    }
    async updateTransactionStatus(id, status) {
        return prisma_1.prisma.transaction.update({
            where: { id },
            data: { status }
        });
    }
    async requestWithdrawal(userId, amount, bankDetails) {
        return prisma_1.prisma.transaction.create({
            data: {
                userId,
                type: 'Withdrawal',
                amount,
                description: `Withdrawal request: ${bankDetails}`,
                status: 'Pending'
            }
        });
    }
    async processWithdrawal(transactionId) {
        const transaction = await prisma_1.prisma.transaction.findUnique({
            where: { id: transactionId }
        });
        if (!transaction)
            throw new Error('Transaction not found');
        // Update user wallet
        await prisma_1.prisma.user.update({
            where: { id: transaction.userId },
            data: {
                walletBalance: {
                    decrement: transaction.amount
                }
            }
        });
        return prisma_1.prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'Completed' }
        });
    }
    async transferFunds(fromUserId, toUserId, amount, description) {
        // Debit from sender
        const debitTransaction = await prisma_1.prisma.transaction.create({
            data: {
                userId: fromUserId,
                type: 'Debit',
                amount,
                description: `Transfer to user ${toUserId}: ${description}`,
                status: 'Completed'
            }
        });
        // Update sender's wallet
        await prisma_1.prisma.user.update({
            where: { id: fromUserId },
            data: {
                walletBalance: {
                    decrement: amount
                }
            }
        });
        // Credit to receiver
        await prisma_1.prisma.transaction.create({
            data: {
                userId: toUserId,
                type: 'Credit',
                amount,
                description: `Transfer from user ${fromUserId}: ${description}`,
                status: 'Completed'
            }
        });
        // Update receiver's wallet
        await prisma_1.prisma.user.update({
            where: { id: toUserId },
            data: {
                walletBalance: {
                    increment: amount
                }
            }
        });
        return debitTransaction;
    }
}
exports.TransactionService = TransactionService;
exports.transactionService = new TransactionService();
