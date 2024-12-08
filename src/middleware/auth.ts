import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    throw new ApiError('Unauthorized', 401);
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = user;
    next();
  } catch (err) {
    throw new ApiError('Invalid token', 401);
  }
};