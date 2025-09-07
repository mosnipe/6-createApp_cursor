import multer from 'multer';
import path from 'path';
import { AppError, ErrorCode } from '../types';

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new AppError(ErrorCode.FILE_UPLOAD_ERROR, 'Only image files are allowed', 400));
    }
  },
});

export const validateImageFile = (file: Express.Multer.File): boolean => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedMimeTypes.includes(file.mimetype) && file.size <= maxSize;
};
