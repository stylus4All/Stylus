import { prisma } from '../prisma';

export class TransactionService {
  async getAllTransactions() {
    return prisma.transaction.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, total: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTransactionsByUserId(userId: number) {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        order: { select: { id: true, total: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTransaction(data: {
    userId: number;
    type: string;
    amount: number;
    description: string;
    paymentMethod?: string;
    orderId?: string;
  }) {
    return prisma.transaction.create({
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

  async updateTransactionStatus(id: string, status: string) {
    return prisma.transaction.update({
      where: { id },
      data: { status }
    });
  }

  async requestWithdrawal(userId: number, amount: number, bankDetails: string) {
    return prisma.transaction.create({
      data: {
        userId,
        type: 'Withdrawal',
        amount,
        description: `Withdrawal request: ${bankDetails}`,
        status: 'Pending'
      }
    });
  }

  async processWithdrawal(transactionId: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!transaction) throw new Error('Transaction not found');

    // Update user wallet
    await prisma.user.update({
      where: { id: transaction.userId },
      data: {
        walletBalance: {
          decrement: transaction.amount
        }
      }
    });

    return prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'Completed' }
    });
  }

  async transferFunds(fromUserId: number, toUserId: number, amount: number, description: string) {
    // Debit from sender
    const debitTransaction = await prisma.transaction.create({
      data: {
        userId: fromUserId,
        type: 'Debit',
        amount,
        description: `Transfer to user ${toUserId}: ${description}`,
        status: 'Completed'
      }
    });

    // Update sender's wallet
    await prisma.user.update({
      where: { id: fromUserId },
      data: {
        walletBalance: {
          decrement: amount
        }
      }
    });

    // Credit to receiver
    await prisma.transaction.create({
      data: {
        userId: toUserId,
        type: 'Credit',
        amount,
        description: `Transfer from user ${fromUserId}: ${description}`,
        status: 'Completed'
      }
    });

    // Update receiver's wallet
    await prisma.user.update({
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

export const transactionService = new TransactionService();
