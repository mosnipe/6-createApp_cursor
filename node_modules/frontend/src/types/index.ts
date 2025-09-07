// 型定義
export interface Event {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  texts: TextItem[];
  characters: Character[];
  backgroundImage: string | null;
}

export interface TextItem {
  id: string;
  content: string;
  order: number;
  characterId?: string;
  imageId?: string;
}

export interface Character {
  id: string;
  name: string;
  imageUrl: string;
  position: 'left' | 'right' | 'center';
}

export interface ImageSettings {
  background: string;
  characters: Character[];
}

// API レスポンス型
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  backgroundImageId?: string;
}

export interface UpdateEventRequest {
  title?: string;
  description?: string;
  backgroundImageId?: string;
}

export interface CreateTextRequest {
  content: string;
  order: number;
  characterId?: string;
}

export interface UpdateTextRequest {
  content?: string;
  order?: number;
  characterId?: string;
}

export interface ReorderTextsRequest {
  textIds: string[];
}
