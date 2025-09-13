import axios from 'axios';
import { Event, TextItem, Character, CreateEventRequest, UpdateEventRequest, CreateTextRequest, UpdateTextRequest, ReorderTextsRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://6-create-app-cursor-frontend.vercel.app/api' : 'http://localhost:3001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// イベント関連API
export const eventService = {
  // イベント一覧取得
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  // イベント詳細取得
  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // イベント作成
  createEvent: async (eventData: CreateEventRequest): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // イベント更新
  updateEvent: async (id: string, eventData: UpdateEventRequest): Promise<Event> => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // イベント削除
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

// テキスト関連API
export const textService = {
  // テキスト一覧取得
  getTexts: async (eventId: string): Promise<TextItem[]> => {
    const response = await api.get(`/events/${eventId}/texts`);
    return response.data;
  },

  // テキスト作成
  createText: async (eventId: string, textData: CreateTextRequest): Promise<TextItem> => {
    const response = await api.post(`/events/${eventId}/texts`, textData);
    return response.data;
  },

  // テキスト更新
  updateText: async (id: string, textData: UpdateTextRequest): Promise<TextItem> => {
    const response = await api.put(`/texts/${id}`, textData);
    return response.data;
  },

  // テキスト削除
  deleteText: async (id: string): Promise<void> => {
    await api.delete(`/texts/${id}`);
  },

  // テキスト順序変更
  reorderTexts: async (reorderData: ReorderTextsRequest): Promise<void> => {
    await api.put('/texts/reorder', reorderData);
  },
};

// 画像関連API
export const imageService = {
  // 画像アップロード
  uploadImage: async (file: File): Promise<{ id: string; url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 画像取得
  getImage: async (id: string): Promise<string> => {
    const response = await api.get(`/images/${id}`, {
      responseType: 'blob',
    });
    return URL.createObjectURL(response.data);
  },

  // 画像削除
  deleteImage: async (id: string): Promise<void> => {
    await api.delete(`/images/${id}`);
  },
};

export default api;
