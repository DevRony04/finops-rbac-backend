import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { prisma } from '../config/database';
import { sendError } from '../utils/response.util';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication required', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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
        return sendError(res, 401, 'User not found', 'UNAUTHORIZED');
      }

      if (!user.isActive) {
        return sendError(res, 403, 'Account is inactive', 'FORBIDDEN');
      }

      req.user = user;
      next();
    } catch (error) {
      return sendError(res, 401, 'Invalid or expired token', 'UNAUTHORIZED');
    }
  } catch (error) {
    next(error);
  }
};
