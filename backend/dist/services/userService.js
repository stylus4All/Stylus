"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const prisma_1 = require("../prisma");
class UserService {
    async getAllUsers() {
        return prisma_1.prisma.user.findMany({
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
    async getUserById(id) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
            include: {
                orders: true,
                products: true,
                transactions: true,
                wishlistItems: { include: { product: true } }
            }
        });
        if (!user)
            return null;
        return this.parseUserJSON(user);
    }
    async createUser(data) {
        return prisma_1.prisma.user.create({
            data
        });
    }
    async updateUser(id, data) {
        return prisma_1.prisma.user.update({
            where: { id },
            data
        });
    }
    async updateUserStatus(id, status, reason) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                status,
                suspensionReason: reason || null
            }
        });
    }
    async updateUserRole(id, role) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { role }
        });
    }
    async submitVerification(id, docs) {
        const user = await prisma_1.prisma.user.update({
            where: { id },
            data: {
                verificationDocs: JSON.stringify(docs),
                verificationStatus: 'Pending'
            }
        });
        return this.parseUserJSON(user);
    }
    async approveVerification(id) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: { verificationStatus: 'Verified' }
        });
    }
    async rejectVerification(id, reason) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                verificationStatus: 'Rejected',
                adminNotes: reason
            }
        });
    }
    async updateWallet(id, amount) {
        return prisma_1.prisma.user.update({
            where: { id },
            data: {
                walletBalance: {
                    increment: amount
                }
            }
        });
    }
    async deleteUser(id) {
        return prisma_1.prisma.user.delete({
            where: { id }
        });
    }
    async addSearchHistory(id, query) {
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new Error('User not found');
        const history = user.searchHistory ? JSON.parse(user.searchHistory) : [];
        const updatedHistory = [query, ...history].slice(0, 50); // Keep last 50 searches
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id },
            data: { searchHistory: JSON.stringify(updatedHistory) }
        });
        return this.parseUserJSON(updatedUser);
    }
    parseUserJSON(user) {
        return {
            ...user,
            verificationDocs: user.verificationDocs ? JSON.parse(user.verificationDocs) : {},
            searchHistory: user.searchHistory ? JSON.parse(user.searchHistory) : []
        };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
