import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).send('Access Denied: No Token Provided!');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && '_id' in decoded && 'role' in decoded) {
      req.user = {
        _id: decoded['_id'] as string,
        role: decoded['role'] as string,
      };
      next();
    } else {
      res.status(400).send('Invalid Token');
    }
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  authenticate(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res
        .status(403)
        .send('Access denied. You do not have the correct privileges.');
    }
  });
};
