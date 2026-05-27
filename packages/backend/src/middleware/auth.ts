import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '@synapse/shared';

export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  sessionId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided', 401, 'UNAUTHORIZED');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'default-secret'
    ) as any;

    req.userId = decoded.userId;
    req.email = decoded.email;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN',
          statusCode: 401
        }
      });
    }
    next(error);
  }
};

export const rbacMiddleware = (allowedRoles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // TODO: Implement RBAC check based on session and user role
      // For now, just check if user is authenticated
      if (!req.userId) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
