import { prisma } from '../prisma';

export class OrderService {
  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        },
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({
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

  async getOrdersByUserId(userId: number) {
    return prisma.order.findMany({
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

  async createOrder(data: {
    userId: number;
    userName: string;
    total: number;
    items: Array<{
      productId: string;
      quantity: number;
      rentalStartDate?: Date;
      rentalEndDate?: Date;
    }>;
  }) {
    return prisma.order.create({
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

  async updateOrderStatus(id: string, status: string) {
    return prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async updateOrderItemStatus(orderId: string, itemId: string, status: string) {
    const orderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { status }
    });

    // Check if all items are completed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (order) {
      const allComplete = order.items.every((i: typeof order.items[number]) =>
        ['Accepted', 'Shipped', 'Completed', 'Returned', 'Cancelled', 'Rejected'].includes(i.status)
      );

      if (allComplete) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'Completed' }
        });
      }
    }

    return orderItem;
  }

  async deleteOrder(id: string) {
    return prisma.order.delete({
      where: { id }
    });
  }
}

export const orderService = new OrderService();
