import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import prisma from '../lib/prisma';

export const requireRole = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const userRole = await prisma.user.findUnique({
      where: { email: user.email },
      select: { role: true },
    }).then(user => user?.role);

    if (!userRole || !allowedRoles.includes(userRole as Role)) {
      res.status(403).json({ message: 'Access denied: insufficient role' });
      console.log(user)
      return;
    }

    next();
  };
};
