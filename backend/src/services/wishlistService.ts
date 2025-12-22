import { prisma } from '../prisma';

export class WishlistService {
  async getWishlistByUserId(userId: number) {
    return prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true }
    });
  }

  async addToWishlist(userId: number, productId: string) {
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    if (existing) {
      return existing;
    }

    return prisma.wishlistItem.create({
      data: {
        userId,
        productId
      },
      include: { product: true }
    });
  }

  async removeFromWishlist(userId: number, productId: string) {
    return prisma.wishlistItem.delete({
      where: {
        userId_productId: { userId, productId }
      }
    });
  }

  async isInWishlist(userId: number, productId: string) {
    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId }
      }
    });

    return !!item;
  }
}

export const wishlistService = new WishlistService();
