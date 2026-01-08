import { prisma } from '../prisma';

export class ReviewService {
  async getProductReviews(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' }
    });
  }

  async createReview(data: {
    productId: string;
    userId: number;
    rating: number;
    comment?: string;
  }) {
    return prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: Math.min(Math.max(data.rating, 1), 5),
        comment: data.comment
      },
      include: { user: { select: { id: true, name: true } } }
    });
  }

  async updateReview(id: string, data: { rating?: number; comment?: string }) {
    return prisma.review.update({
      where: { id },
      data: {
        rating: data.rating ? Math.min(Math.max(data.rating, 1), 5) : undefined,
        comment: data.comment
      }
    });
  }

  async deleteReview(id: string) {
    return prisma.review.delete({
      where: { id }
    });
  }

  async getAverageRating(productId: string) {
    const reviews = await prisma.review.findMany({
      where: { productId }
    });

    if (reviews.length === 0) return 0;

    const sum = reviews.reduce((total: number, review: any) => total + review.rating, 0);
    return sum / reviews.length;
  }
}

export const reviewService = new ReviewService();
