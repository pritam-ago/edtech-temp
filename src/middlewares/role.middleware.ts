import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const requireRole = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userRole = user.DynamicUser?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({ message: 'Access denied: insufficient role' });
      return;
    }

    next();
  };
};
