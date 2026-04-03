import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { ROLE_HIERARCHY } from '../constants/roles';

export const requireRole = (minRequiredRole: keyof typeof ROLE_HIERARCHY) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return sendError(res, 401, 'Authentication required', 'UNAUTHORIZED');
    }

    const userRoleValue = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY];
    const requiredRoleValue = ROLE_HIERARCHY[minRequiredRole];

    if (userRoleValue < requiredRoleValue) {
      return sendError(
        res,
        403,
        `Forbidden. Require at least ${minRequiredRole} role.`,
        'FORBIDDEN'
      );
    }

    next();
  };
};
