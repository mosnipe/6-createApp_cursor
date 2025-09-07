import { db } from '../utils/database';
import { Image } from '../types';
import { AppError, ErrorCode } from '../types';
import path from 'path';
import fs from 'fs';

export class ImageService {
  async uploadImage(file: Express.Multer.File): Promise<{ id: string; url: string }> {
    const query = `
      INSERT INTO images (filename, file_path, file_size, mime_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    
    const result = await db.query(query, [
      file.filename,
      file.path,
      file.size,
      file.mimetype
    ]);
    
    const imageId = result.rows[0].id;
    const imageUrl = `/api/images/${imageId}`;
    
    return { id: imageId, url: imageUrl };
  }
  
  async getImagePath(id: string): Promise<string | null> {
    const query = 'SELECT file_path FROM images WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const filePath = result.rows[0].file_path;
    
    // ファイルが存在するかチェック
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return filePath;
  }
  
  async getImage(id: string): Promise<Image | null> {
    const query = 'SELECT * FROM images WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return this.mapToImageModel(result.rows[0]);
  }
  
  async deleteImage(id: string): Promise<void> {
    // まず画像情報を取得
    const image = await this.getImage(id);
    if (!image) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Image not found', 404);
    }
    
    // データベースから削除
    const query = 'DELETE FROM images WHERE id = $1';
    await db.query(query, [id]);
    
    // ファイルも削除
    if (image.file_path && fs.existsSync(image.file_path)) {
      fs.unlinkSync(image.file_path);
    }
  }
  
  private mapToImageModel(row: any): Image {
    return {
      id: row.id,
      filename: row.filename,
      original_url: row.original_url,
      file_path: row.file_path,
      file_size: row.file_size,
      mime_type: row.mime_type,
      created_at: row.created_at,
    };
  }
}
