import { prisma } from '../config/database';
import { Record } from '@prisma/client';
import { RecordFilters } from '../types/record.types';

export class RecordService {
  async createRecord(data: any): Promise<Record> {
    return prisma.record.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });
  }

  async getRecords(filters: RecordFilters, requesterId: string, isAdmin: boolean): Promise<Record[]> {
    const where: any = {};

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

  async getRecordById(id: string, requesterId: string, isAdmin: boolean): Promise<Record> {
    const record = await prisma.record.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    if (!record) {
      const error: any = new Error('Record not found');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (!isAdmin && record.userId !== requesterId) {
      const error: any = new Error('Forbidden');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return record;
  }

  async updateRecord(id: string, data: any): Promise<Record> {
    const existing = await prisma.record.findUnique({ where: { id } });
    if (!existing) {
      const error: any = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData = { ...data };
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
      const error: any = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }

    await prisma.record.delete({
      where: { id },
    });
  }
}
export const recordService = new RecordService();
