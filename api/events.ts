import { VercelRequest, VercelResponse } from '@vercel/node';

// データベース接続の簡易実装
const createDatabaseConnection = () => {
  const { Pool } = require('pg');
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url } = req;
  const path = url?.replace('/api', '') || '';

  try {
    const pool = createDatabaseConnection();

    // イベント一覧取得
    if (method === 'GET' && path === '/events') {
      const result = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
      await pool.end();
      return res.status(200).json(result.rows);
    }

    // イベント作成
    if (method === 'POST' && path === '/events') {
      const { title, description } = req.body;
      
      if (!title) {
        await pool.end();
        return res.status(400).json({ error: 'Title is required' });
      }

      const result = await pool.query(
        'INSERT INTO events (title, description) VALUES ($1, $2) RETURNING *',
        [title, description || '']
      );

      await pool.end();
      return res.status(201).json(result.rows[0]);
    }

    // イベント取得
    if (method === 'GET' && path.startsWith('/events/')) {
      const eventId = path.split('/')[2];
      const result = await pool.query(
        'SELECT * FROM events WHERE id = $1',
        [eventId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(200).json(result.rows[0]);
    }

    // イベント更新
    if (method === 'PUT' && path.startsWith('/events/')) {
      const eventId = path.split('/')[2];
      const { title, description } = req.body;

      const result = await pool.query(
        'UPDATE events SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
        [title, description, eventId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(200).json(result.rows[0]);
    }

    // イベント削除
    if (method === 'DELETE' && path.startsWith('/events/')) {
      const eventId = path.split('/')[2];
      
      const result = await pool.query(
        'DELETE FROM events WHERE id = $1 RETURNING *',
        [eventId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    // テキスト一覧取得
    if (method === 'GET' && path.startsWith('/events/') && path.endsWith('/texts')) {
      const eventId = path.split('/')[2];
      const result = await pool.query(
        'SELECT * FROM texts WHERE event_id = $1 ORDER BY order_index',
        [eventId]
      );

      await pool.end();
      return res.status(200).json(result.rows);
    }

    // テキスト作成
    if (method === 'POST' && path.startsWith('/events/') && path.endsWith('/texts')) {
      const eventId = path.split('/')[2];
      const { content, order_index } = req.body;

      if (!content) {
        await pool.end();
        return res.status(400).json({ error: 'Content is required' });
      }

      const result = await pool.query(
        'INSERT INTO texts (event_id, content, order_index) VALUES ($1, $2, $3) RETURNING *',
        [eventId, content, order_index || 0]
      );

      await pool.end();
      return res.status(201).json(result.rows[0]);
    }

    // テキスト更新
    if (method === 'PUT' && path.startsWith('/texts/')) {
      const textId = path.split('/')[2];
      const { content, order_index } = req.body;

      const result = await pool.query(
        'UPDATE texts SET content = $1, order_index = $2 WHERE id = $3 RETURNING *',
        [content, order_index, textId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Text not found' });
      }

      return res.status(200).json(result.rows[0]);
    }

    // テキスト削除
    if (method === 'DELETE' && path.startsWith('/texts/')) {
      const textId = path.split('/')[2];
      
      const result = await pool.query(
        'DELETE FROM texts WHERE id = $1 RETURNING *',
        [textId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Text not found' });
      }

      return res.status(200).json({ message: 'Text deleted successfully' });
    }

    // テキスト順序更新
    if (method === 'PUT' && path === '/texts/reorder') {
      const { textIds } = req.body;

      if (!Array.isArray(textIds)) {
        await pool.end();
        return res.status(400).json({ error: 'textIds must be an array' });
      }

      for (let i = 0; i < textIds.length; i++) {
        await pool.query(
          'UPDATE texts SET order_index = $1 WHERE id = $2',
          [i, textIds[i]]
        );
      }

      await pool.end();
      return res.status(200).json({ message: 'Texts reordered successfully' });
    }

    await pool.end();
    // 404エラー
    return res.status(404).json({ error: 'API endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
