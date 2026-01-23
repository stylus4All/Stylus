"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = exports.ProductService = void 0;
const prisma_1 = require("../prisma");
class ProductService {
    async getAllProducts(filters) {
        const andConditions = [];
        if (filters?.category && filters.category !== 'All') {
            andConditions.push({ category: filters.category });
        }
        if (filters?.searchQuery) {
            andConditions.push({
                OR: [
                    { name: { contains: filters.searchQuery, mode: 'insensitive' } },
                    { brand: { contains: filters.searchQuery, mode: 'insensitive' } },
                    { description: { contains: filters.searchQuery, mode: 'insensitive' } }
                ]
            });
        }
        if (filters?.maxPrice) {
            andConditions.push({ rentalPrice: { lte: filters.maxPrice } });
        }
        const where = andConditions.length > 0 ? { AND: andConditions } : {};
        let orderBy = { createdAt: 'desc' };
        if (filters?.sortBy === 'price_asc') {
            orderBy = { rentalPrice: 'asc' };
        }
        else if (filters?.sortBy === 'price_desc') {
            orderBy = { rentalPrice: 'desc' };
        }
        const products = await prisma_1.prisma.product.findMany({
            where,
            orderBy,
            include: {
                reviews: {
                    include: { user: { select: { name: true, id: true } } }
                },
                owner: { select: { id: true, name: true, email: true } }
            }
        });
        // Parse JSON fields
        return products.map((product) => ({
            ...product,
            availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : [],
            images: product.images ? JSON.parse(product.images) : []
        }));
    }
    async getProductById(id) {
        const product = await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                reviews: {
                    include: { user: { select: { name: true, id: true } } }
                },
                owner: { select: { id: true, name: true, email: true } }
            }
        });
        if (!product)
            return null;
        // Parse JSON fields
        return {
            ...product,
            availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : [],
            images: product.images ? JSON.parse(product.images) : []
        };
    }
    async createProduct(data) {
        const product = await prisma_1.prisma.product.create({
            data: {
                ...data,
                availableSizes: data.availableSizes ? JSON.stringify(data.availableSizes) : null,
                images: data.images ? JSON.stringify(data.images) : null
            },
            include: { reviews: true }
        });
        // Parse JSON fields
        return {
            ...product,
            availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : [],
            images: product.images ? JSON.parse(product.images) : []
        };
    }
    async updateProduct(id, data) {
        const product = await prisma_1.prisma.product.update({
            where: { id },
            data: {
                ...data,
                availableSizes: data.availableSizes ? JSON.stringify(data.availableSizes) : undefined,
                images: data.images ? JSON.stringify(data.images) : undefined
            }
        });
        // Parse JSON fields
        return {
            ...product,
            availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : [],
            images: product.images ? JSON.parse(product.images) : []
        };
    }
    async deleteProduct(id) {
        return prisma_1.prisma.product.delete({
            where: { id }
        });
    }
    async incrementRentalCount(id) {
        const product = await this.getProductById(id);
        if (!product)
            throw new Error('Product not found');
        const newCount = (product.rentalCount || 0) + 1;
        const RENTAL_THRESHOLD = 5;
        return prisma_1.prisma.product.update({
            where: { id },
            data: {
                rentalCount: newCount,
                isForSale: newCount >= RENTAL_THRESHOLD ? true : product.isForSale
            }
        });
    }
    async getProductsByOwner(ownerId) {
        const products = await prisma_1.prisma.product.findMany({
            where: { ownerId },
            include: { reviews: true }
        });
        // Parse JSON fields
        return products.map((product) => ({
            ...product,
            availableSizes: product.availableSizes ? JSON.parse(product.availableSizes) : [],
            images: product.images ? JSON.parse(product.images) : []
        }));
    }
}
exports.ProductService = ProductService;
exports.productService = new ProductService();
