"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
class AuthService {
    // Register a new user
    async register(data) {
        const { email, password, name, phone, address, role, location } = data;
        // Check if user already exists
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Validate password strength
        if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            throw new Error('Password must contain at least one special character');
        }
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create the user - all users start as Unverified until they submit verification details
        const user = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                address,
                role: role || 'User',
                location,
                verificationStatus: 'Unverified'
            }
        });
        // Generate JWT token
        const token = this.generateToken(user.id, user.email, user.role);
        // Return user data (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    // Login user
    async login(data) {
        const { email, password } = data;
        // Find user by email
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Check if user is suspended
        if (user.status === 'Suspended') {
            throw new Error('Account is suspended. Reason: ' + (user.suspensionReason || 'N/A'));
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Update last active
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastActive: new Date() }
        });
        // Generate JWT token
        const token = this.generateToken(user.id, user.email, user.role);
        // Return user data (excluding password) and token
        const { password: _, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    // Generate JWT token
    generateToken(userId, email, role) {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        return jsonwebtoken_1.default.sign({ userId, email, role }, jwtSecret, { expiresIn: jwtExpiresIn });
    }
    // Verify token and return user
    async verifyToken(token) {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET not configured');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            // Get user from database
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId }
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.status === 'Suspended') {
                throw new Error('Account is suspended');
            }
            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    // Change password
    async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Verify old password
        const isPasswordValid = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, saltRounds);
        // Update password
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        return { message: 'Password updated successfully' };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
