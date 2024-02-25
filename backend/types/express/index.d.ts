import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        _id: string;
        role: string;
      };
    }
  }
}
