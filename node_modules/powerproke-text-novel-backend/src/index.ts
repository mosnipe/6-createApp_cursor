import express from 'express';
import cors from 'cors';
import path from 'path';
import { EventController } from './controllers/EventController';
import { TextController } from './controllers/TextController';
import { ImageController } from './controllers/ImageController';
import { EventService } from './services/EventService';
import { TextService } from './services/TextService';
import { ImageService } from './services/ImageService';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { validateEventData, validateTextData } from './middleware/validation';
import { uploadImage } from './middleware/upload';

const app = express();

// ミドルウェア
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-app.vercel.app',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静的ファイル配信（アップロードされた画像）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// サービスとコントローラーの初期化
const eventService = new EventService();
const textService = new TextService();
const imageService = new ImageService();

const eventController = new EventController(eventService);
const textController = new TextController(textService);
const imageController = new ImageController(imageService);

// ルート
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// イベント関連ルート
app.get('/api/events', (req, res, next) => eventController.getEvents(req, res, next));
app.post('/api/events', validateEventData, (req, res, next) => eventController.createEvent(req, res, next));
app.get('/api/events/:id', (req, res, next) => eventController.getEvent(req, res, next));
app.put('/api/events/:id', validateEventData, (req, res, next) => eventController.updateEvent(req, res, next));
app.delete('/api/events/:id', (req, res, next) => eventController.deleteEvent(req, res, next));

// テキスト関連ルート
app.get('/api/events/:eventId/texts', (req, res, next) => textController.getTexts(req, res, next));
app.post('/api/events/:eventId/texts', validateTextData, (req, res, next) => textController.createText(req, res, next));
app.put('/api/texts/:id', validateTextData, (req, res, next) => textController.updateText(req, res, next));
app.delete('/api/texts/:id', (req, res, next) => textController.deleteText(req, res, next));
app.put('/api/texts/reorder', (req, res, next) => textController.reorderTexts(req, res, next));

// 画像関連ルート
app.post('/api/images/upload', uploadImage.single('image'), (req, res, next) => imageController.uploadImage(req, res, next));
app.get('/api/images/:id', (req, res, next) => imageController.getImage(req, res, next));
app.delete('/api/images/:id', (req, res, next) => imageController.deleteImage(req, res, next));

// エラーハンドリング
app.use(notFoundHandler);
app.use(errorHandler);

// Vercel用のエクスポート
export default app;

// ローカル開発用
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}