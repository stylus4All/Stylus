import { prisma } from '../prisma';

export class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        tier: true,
        status: true,
        verificationStatus: true,
        walletBalance: true,
        suspensionReason: true,
        adminNotes: true,
        joined: true,
        lastActive: true,
        avgSpend: true,
        rentalHistoryCount: true,
        _count: {
          select: { orders: true, products: true }
        }
      }
    });
  }

  async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: true,
        products: true,
        transactions: true,
        wishlistItems: { include: { product: true } }
      }
    });

    if (!user) return null;
    return this.parseUserJSON(user);
  }

  async createUser(data: any) {
    return prisma.user.create({
      data
    });
  }

  async updateUser(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  async updateUserStatus(id: number, status: string, reason?: string) {
    return prisma.user.update({
      where: { id },
      data: {
        status,
        suspensionReason: reason || null
      }
    });
  }

  async updateUserRole(id: number, role: string) {
    return prisma.user.update({
      where: { id },
      data: { role }
    });
  }

  async submitVerification(id: number, docs: any) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        verificationDocs: JSON.stringify(docs),
        verificationStatus: 'Pending'
      }
    });

    return this.parseUserJSON(user);
  }

  async approveVerification(id: number) {
    return prisma.user.update({
      where: { id },
      data: { verificationStatus: 'Verified' }
    });
  }

  async rejectVerification(id: number, reason: string) {
    return prisma.user.update({
      where: { id },
      data: {
        verificationStatus: 'Rejected',
        adminNotes: reason
      }
    });
  }

  async updateWallet(id: number, amount: number) {
    return prisma.user.update({
      where: { id },
      data: {
        walletBalance: {
          increment: amount
        }
      }
    });
  }

  async deleteUser(id: number) {
    return prisma.user.delete({
      where: { id }
    });
  }

  async addSearchHistory(id: number, query: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');

    const history = user.searchHistory ? JSON.parse(user.searchHistory) : [];
    const updatedHistory = [query, ...history].slice(0, 50); // Keep last 50 searches

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { searchHistory: JSON.stringify(updatedHistory) }
    });

    return this.parseUserJSON(updatedUser);
  }

  private parseUserJSON(user: any) {
    return {
      ...user,
      verificationDocs: user.verificationDocs ? JSON.parse(user.verificationDocs) : {},
      searchHistory: user.searchHistory ? JSON.parse(user.searchHistory) : []
    };
  }
}

export const userService = new UserService();
