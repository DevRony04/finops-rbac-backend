import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[Error]:', err);

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return sendError(res, 400, 'Unique constraint failed', 'DUPLICATE_ENTRY', err.meta);
    }
    if (err.code === 'P2025') {
      return sendError(res, 404, 'Record not found', 'NOT_FOUND');
    }
    return sendError(res, 400, 'Database error', 'DB_ERROR', { code: err.code });
  }

  // Generic Error
  const statusCode = (err as any).statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = (err as any).code || 'INTERNAL_ERROR';

  return sendError(res, statusCode, message, code);
};
