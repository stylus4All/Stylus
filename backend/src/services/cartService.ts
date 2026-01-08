import { prisma } from '../prisma';

export class CartService {
  async getCartByUserId(userId: number) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    return items.map((item: typeof items[number]) => ({
      ...item,
      product: {
        ...item.product,
        availableSizes: item.product.availableSizes ? JSON.parse(item.product.availableSizes) : [],
        images: item.product.images ? JSON.parse(item.product.images) : []
      }
    }));
  }

  async addToCart(userId: number, productId: string, quantity: number, rentalStartDate?: Date, rentalEndDate?: Date) {
    // Check if item exists
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      },
      include: { product: true }
    });

    if (existing) {
      const item = await prisma.cartItem.update({
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

    const item = await prisma.cartItem.create({
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

  async removeFromCart(userId: number, productId: string) {
    return prisma.cartItem.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  }

  async updateCartItem(cartItemId: string, quantity: number, rentalStartDate?: Date, rentalEndDate?: Date) {
    const item = await prisma.cartItem.update({
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

  async clearCart(userId: number) {
    return prisma.cartItem.deleteMany({
      where: { userId }
    });
  }

  async getCartTotal(userId: number) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });

    return items.reduce((total: number, item: typeof items[number]) => {
      return total + (item.product.rentalPrice * item.quantity);
    }, 0);
  }
}

export const cartService = new CartService();
