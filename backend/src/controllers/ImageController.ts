import { ImageService } from '../services/ImageService';
import { AppError, ErrorCode } from '../types';

export class ImageController {
  constructor(private imageService: ImageService) {}
  
  async uploadImage(req: any, res: any, next: any) {
    try {
      if (!req.file) {
        throw new AppError(ErrorCode.FILE_UPLOAD_ERROR, 'No file uploaded', 400);
      }
      
      const image = await this.imageService.uploadImage(req.file);
      res.status(201).json(image);
    } catch (error) {
      next(error);
    }
  }
  
  async getImage(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      const imagePath = await this.imageService.getImagePath(id);
      
      if (!imagePath) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Image not found', 404);
      }
      
      res.sendFile(imagePath);
    } catch (error) {
      next(error);
    }
  }
  
  async deleteImage(req: any, res: any, next: any) {
    try {
      const { id } = req.params;
      await this.imageService.deleteImage(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
