import { z } from 'zod';
import { RecordType } from '@prisma/client';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.nativeEnum(RecordType),
    category: z.string().min(1, 'Category is required'),
    date: z.string().datetime({ message: 'Invalid datetime format (ISO 8601 required)' }),
    description: z.string().optional(),
    userId: z.string().uuid('Invalid user ID format'),
  }),
});

export const updateRecordSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid record ID'),
  }),
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    type: z.nativeEnum(RecordType).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    description: z.string().optional(),
  }),
});

export const getRecordsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    category: z.string().optional(),
    type: z.nativeEnum(RecordType).optional(),
    userId: z.string().uuid().optional(),
  }).refine((data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  }, {
    message: "startDate must be less than or equal to endDate",
    path: ["startDate"],
  }),
});
