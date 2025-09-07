import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types';

export const validateEventData = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ 
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Title is required' 
    });
  }
  
  if (title.length > 255) {
    return res.status(400).json({ 
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Title must be 255 characters or less' 
    });
  }
  
  next();
};

export const validateTextData = (req: Request, res: Response, next: NextFunction) => {
  const { content, order } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ 
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Content is required' 
    });
  }
  
  if (typeof order !== 'number' || order < 0) {
    return res.status(400).json({ 
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Order must be a non-negative number' 
    });
  }
  
  next();
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
