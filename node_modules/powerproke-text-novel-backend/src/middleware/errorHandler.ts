import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);
  
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: ErrorCode.VALIDATION_ERROR,
      message: error.message,
    });
  }
  
  res.status(500).json({
    error: ErrorCode.INTERNAL_ERROR,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: ErrorCode.NOT_FOUND,
    message: 'Route not found',
  });
};
