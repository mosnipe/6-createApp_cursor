import request from 'supertest';
import app from '../index';
import { db } from '../utils/database';

describe('API Tests', () => {
  beforeEach(async () => {
    // テスト前にデータベースをクリーンアップ
    await db.query('DELETE FROM texts');
    await db.query('DELETE FROM characters');
    await db.query('DELETE FROM images');
    await db.query('DELETE FROM events');
  });

  afterAll(async () => {
    await db.close();
  });

  describe('Health Check', () => {
    test('GET /api/health should return OK', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Events API', () => {
    test('POST /api/events should create a new event', async () => {
      const eventData = {
        title: 'テストイベント',
        description: 'テスト説明'
      };

      const response = await request(app)
        .post('/api/events')
        .send(eventData)
        .expect(201);

      expect(response.body.title).toBe(eventData.title);
      expect(response.body.description).toBe(eventData.description);
      expect(response.body.id).toBeDefined();
    });

    test('GET /api/events should return empty array initially', async () => {
      const response = await request(app)
        .get('/api/events')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    test('GET /api/events/:id should return 404 for non-existent event', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      await request(app)
        .get(`/api/events/${fakeId}`)
        .expect(404);
    });

    test('PUT /api/events/:id should update an event', async () => {
      // まずイベントを作成
      const createResponse = await request(app)
        .post('/api/events')
        .send({ title: '元のタイトル' })
        .expect(201);

      const eventId = createResponse.body.id;

      // イベントを更新
      const updateData = { title: '更新されたタイトル' };
      const response = await request(app)
        .put(`/api/events/${eventId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
    });

    test('DELETE /api/events/:id should delete an event', async () => {
      // まずイベントを作成
      const createResponse = await request(app)
        .post('/api/events')
        .send({ title: '削除対象イベント' })
        .expect(201);

      const eventId = createResponse.body.id;

      // イベントを削除
      await request(app)
        .delete(`/api/events/${eventId}`)
        .expect(204);

      // 削除されたことを確認
      await request(app)
        .get(`/api/events/${eventId}`)
        .expect(404);
    });
  });

  describe('Texts API', () => {
    let eventId: string;

    beforeEach(async () => {
      // テスト用のイベントを作成
      const createResponse = await request(app)
        .post('/api/events')
        .send({ title: 'テストイベント' })
        .expect(201);

      eventId = createResponse.body.id;
    });

    test('POST /api/events/:eventId/texts should create a new text', async () => {
      const textData = {
        content: 'テストテキスト',
        order: 0
      };

      const response = await request(app)
        .post(`/api/events/${eventId}/texts`)
        .send(textData)
        .expect(201);

      expect(response.body.content).toBe(textData.content);
      expect(response.body.order_index).toBe(textData.order);
      expect(response.body.event_id).toBe(eventId);
    });

    test('GET /api/events/:eventId/texts should return texts for an event', async () => {
      // テキストを作成
      await request(app)
        .post(`/api/events/${eventId}/texts`)
        .send({ content: 'テストテキスト1', order: 0 })
        .expect(201);

      await request(app)
        .post(`/api/events/${eventId}/texts`)
        .send({ content: 'テストテキスト2', order: 1 })
        .expect(201);

      // テキスト一覧を取得
      const response = await request(app)
        .get(`/api/events/${eventId}/texts`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].content).toBe('テストテキスト1');
      expect(response.body[1].content).toBe('テストテキスト2');
    });

    test('PUT /api/texts/:id should update a text', async () => {
      // テキストを作成
      const createResponse = await request(app)
        .post(`/api/events/${eventId}/texts`)
        .send({ content: '元のテキスト', order: 0 })
        .expect(201);

      const textId = createResponse.body.id;

      // テキストを更新
      const updateData = { content: '更新されたテキスト' };
      const response = await request(app)
        .put(`/api/texts/${textId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.content).toBe(updateData.content);
    });

    test('DELETE /api/texts/:id should delete a text', async () => {
      // テキストを作成
      const createResponse = await request(app)
        .post(`/api/events/${eventId}/texts`)
        .send({ content: '削除対象テキスト', order: 0 })
        .expect(201);

      const textId = createResponse.body.id;

      // テキストを削除
      await request(app)
        .delete(`/api/texts/${textId}`)
        .expect(204);

      // 削除されたことを確認
      const response = await request(app)
        .get(`/api/events/${eventId}/texts`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('Validation', () => {
    test('POST /api/events should return 400 for missing title', async () => {
      await request(app)
        .post('/api/events')
        .send({ description: '説明のみ' })
        .expect(400);
    });

    test('POST /api/events should return 400 for empty title', async () => {
      await request(app)
        .post('/api/events')
        .send({ title: '' })
        .expect(400);
    });

    test('POST /api/events should return 400 for title too long', async () => {
      const longTitle = 'a'.repeat(256);
      
      await request(app)
        .post('/api/events')
        .send({ title: longTitle })
        .expect(400);
    });
  });
});
