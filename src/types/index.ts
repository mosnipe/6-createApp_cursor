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
  headerSettings: HeaderSettings;
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

export interface HeaderSettings {
  // ゲーム情報
  year: number;
  month: number;
  week: number;
  dayType: 'weekday' | 'weekend' | 'holiday';
  
  // ステータス
  stats: {
    motivation: {
      value: number;
      max: number;
      icon: string;
    };
    stamina: {
      value: number;
      max: number;
      icon: string;
    };
    toughness: {
      value: number;
      max: number;
      icon: string;
    };
  };
  
  // カスタムゲージ
  customGauges: CustomGauge[];
}

export interface CustomGauge {
  id: string;
  name: string;
  value: number;
  max: number;
  color: string;
  icon?: string;
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
  background_image_id?: string;
  headerSettings?: HeaderSettings;
  characters?: Character[];
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

export interface CreateCharacterRequest {
  name: string;
  imageUrl: string;
  position: 'left' | 'right' | 'center';
}

export interface UpdateCharacterRequest {
  name?: string;
  imageUrl?: string;
  position?: 'left' | 'right' | 'center';
}