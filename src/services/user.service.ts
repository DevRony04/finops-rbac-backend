import { prisma } from '../config/database';
import { hashPassword } from '../utils/password.util';
import { UserResponse } from '../types/user.types';

export class UserService {
  async getAllUsers(): Promise<UserResponse[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return user;
  }

  async createUser(data: any): Promise<UserResponse> {
    const hashedPassword = await hashPassword(data.password);

    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
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
  }

  async updateUser(id: string, data: any): Promise<UserResponse> {
    const userExists = await prisma.user.findUnique({ where: { id } });
    
    if (!userExists) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return prisma.user.update({
      where: { id },
      data,
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
  }

  async deleteUser(id: string): Promise<void> {
     const userExists = await prisma.user.findUnique({ where: { id } });
    
    if (!userExists) {
      const error: any = new Error('User not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // In a real application, you might want to soft delete or handle related records
    // Here we'll delete the user and their records through cascading if set, 
    // but we didn't set onDelete: Cascade so we must delete records first
    await prisma.$transaction([
      prisma.record.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } })
    ]);
  }
}
export const userService = new UserService();
