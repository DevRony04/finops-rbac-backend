import { prisma } from '../config/database';
import { Record as PrismaRecord, RecordType } from '@prisma/client';
import { RecordFilters } from '../types/record.types';

export interface CreateRecordInput {
  amount: number;
  type: RecordType;
  category: string;
  description?: string;
  date: string | Date;
  userId: string;
}

export interface UpdateRecordInput {
  amount?: number;
  type?: RecordType;
  category?: string;
  description?: string;
  date?: string | Date;
  userId?: string;
}

export class RecordService {
  async createRecord(data: CreateRecordInput): Promise<PrismaRecord> {
    return prisma.record.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
  }

  async getRecords(filters: RecordFilters, requesterId: string, isAdmin: boolean): Promise<PrismaRecord[]> {
    const where: {
      userId?: string;
      category?: string;
      type?: RecordType;
      date?: { gte?: Date; lte?: Date };
    } = {};

    if (!isAdmin) {
      where.userId = requesterId;
    } else if (filters.userId) { // @ts-ignore - handled in controller/validator but let's be safe
      where.userId = filters.userId;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    return prisma.record.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
  }

  async getRecordById(id: string, requesterId: string, isAdmin: boolean): Promise<PrismaRecord> {
    const record = await prisma.record.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    if (!record) {
      const error = new Error('Record not found') as any;
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (!isAdmin && record.userId !== requesterId) {
      const error = new Error('Forbidden') as any;
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return record;
  }

  async updateRecord(id: string, data: UpdateRecordInput): Promise<PrismaRecord> {
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Record not found') as any;
      error.statusCode = 404;
      throw error;
    }

    const updateData: any = { ...data };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    return prisma.record.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteRecord(id: string): Promise<void> {
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Record not found') as any;
      error.statusCode = 404;
      throw error;
    }

    await prisma.record.delete({
      where: { id },
    });
  }
}
export const recordService = new RecordService();
