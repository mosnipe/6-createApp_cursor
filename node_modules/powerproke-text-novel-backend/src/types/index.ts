// 型定義
export interface Event {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  background_image_id?: string;
}

export interface Text {
  id: string;
  event_id: string;
  content: string;
  order_index: number;
  character_id?: string;
  created_at: Date;
}

export interface Character {
  id: string;
  event_id: string;
  name: string;
  image_url: string;
  position: 'left' | 'right' | 'center';
  created_at: Date;
}

export interface Image {
  id: string;
  filename?: string;
  original_url?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  created_at: Date;
}

// API リクエスト型
export interface CreateEventRequest {
  title: string;
  description?: string;
  background_image_id?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  background_image_id?: string;
}

export interface CreateTextRequest {
  content: string;
  order: number;
  character_id?: string;
}

export interface UpdateTextRequest {
  content?: string;
  order?: number;
  character_id?: string;
}

export interface ReorderTextsRequest {
  text_ids: string[];
}

// API レスポンス型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// エラー型
export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}
