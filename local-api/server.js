const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース接続
const createDatabaseConnection = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
};

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// イベント一覧取得
app.get('/api/events', async (req, res) => {
  let pool = null;
  try {
    pool = createDatabaseConnection();
    await pool.query('SELECT 1'); // 接続テスト

    const result = await pool.query(`
      SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'content', t.content,
              'order', t.order_index,
              'characterId', t.character_id,
              'imageId', t.image_id
            ) ORDER BY t.order_index
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'::json
        ) as texts,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'imageUrl', c.image_url,
              'position', c.position
            ) ORDER BY c.created_at
          ) FILTER (WHERE c.id IS NOT NULL), 
          '[]'::json
        ) as characters
      FROM events e
      LEFT JOIN texts t ON e.id = t.event_id
      LEFT JOIN characters c ON e.id = c.event_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);
    
    const events = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      backgroundImage: row.background_image_id,
      texts: row.texts || [],
      characters: row.characters || []
    }));
    
    res.json(events);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    if (pool) await pool.end();
  }
});

// イベント作成
app.post('/api/events', async (req, res) => {
  let pool = null;
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    pool = createDatabaseConnection();
    await pool.query('SELECT 1');

    const result = await pool.query(
      'INSERT INTO events (title, description) VALUES ($1, $2) RETURNING *',
      [title, description || '']
    );

    const event = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
      backgroundImage: result.rows[0].background_image_id,
      texts: [],
      characters: []
    };

    res.status(201).json(event);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    if (pool) await pool.end();
  }
});

// イベント詳細取得
app.get('/api/events/:id', async (req, res) => {
  let pool = null;
  try {
    const eventId = req.params.id;
    pool = createDatabaseConnection();
    await pool.query('SELECT 1');

    const result = await pool.query(`
      SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', t.id,
              'content', t.content,
              'order', t.order_index,
              'characterId', t.character_id,
              'imageId', t.image_id
            ) ORDER BY t.order_index
          ) FILTER (WHERE t.id IS NOT NULL), 
          '[]'::json
        ) as texts,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'imageUrl', c.image_url,
              'position', c.position
            ) ORDER BY c.created_at
          ) FILTER (WHERE c.id IS NOT NULL), 
          '[]'::json
        ) as characters
      FROM events e
      LEFT JOIN texts t ON e.id = t.event_id
      LEFT JOIN characters c ON e.id = c.event_id
      WHERE e.id = $1
      GROUP BY e.id
    `, [eventId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = {
      id: result.rows[0].id,
      title: result.rows[0].title,
      description: result.rows[0].description,
      createdAt: result.rows[0].created_at,
      updatedAt: result.rows[0].updated_at,
      backgroundImage: result.rows[0].background_image_id,
      texts: result.rows[0].texts || [],
      characters: result.rows[0].characters || []
    };

    res.json(event);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  } finally {
    if (pool) await pool.end();
  }
});

// テーブル作成（マイグレーション）
app.post('/api/migrate', async (req, res) => {
  let pool = null;
  try {
    pool = createDatabaseConnection();
    await pool.query('SELECT 1');

    // イベントテーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        background_image_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // テキストテーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS texts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        order_index INTEGER NOT NULL,
        character_id UUID,
        image_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // キャラクターテーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        position VARCHAR(10) CHECK (position IN ('left', 'right', 'center')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 画像テーブル
    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        filename VARCHAR(255),
        original_url VARCHAR(500),
        file_path VARCHAR(500),
        file_size INTEGER,
        mime_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // インデックス作成
    await pool.query('CREATE INDEX IF NOT EXISTS idx_texts_event_id ON texts(event_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_texts_order ON texts(order_index)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_characters_event_id ON characters(event_id)');

    res.json({ 
      message: 'Database migration completed successfully',
      tables: ['events', 'texts', 'characters', 'images']
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed',
      details: error.message
    });
  } finally {
    if (pool) await pool.end();
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📝 Events API: http://localhost:${PORT}/api/events`);
});
