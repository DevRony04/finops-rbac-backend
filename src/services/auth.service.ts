import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { UserResponse } from '../types/user.types';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterInput): Promise<{ user: UserResponse; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      const error = new Error('Email already in use') as any;
      error.statusCode = 400;
      error.code = 'EMAIL_IN_USE';
      throw error;
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    return { user, token };
  }

  async login(data: LoginInput): Promise<{ user: UserResponse; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.isActive) {
      const error = new Error('Invalid credentials') as any;
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      const error = new Error('Invalid credentials') as any;
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const token = generateToken({ userId: user.id, role: user.role });

    return { user: userResponse, token };
  }
}
export const authService = new AuthService();
