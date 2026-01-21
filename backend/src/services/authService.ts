import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  role?: 'User' | 'Partner' | 'Admin';
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  // Register a new user
  async register(data: RegisterData) {
    const { email, password, name, phone, address, role, location } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
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
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user - all users start as Unverified until they submit verification details
    const user = await prisma.user.create({
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
  async login(data: LoginData) {
    const { email, password } = data;

    // Find user by email
    const user = await prisma.user.findUnique({
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last active
    await prisma.user.update({
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
  private generateToken(userId: number, email: string, role: string): string {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
      { userId, email, role },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );
  }

  // Verify token and return user
  async verifyToken(token: string) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: number;
        email: string;
        role: string;
      };

      // Get user from database
      const user = await prisma.user.findUnique({
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
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Change password
  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return { message: 'Password updated successfully' };
  }
}

export const authService = new AuthService();
