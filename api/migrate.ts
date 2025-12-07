import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// データベース接続の簡易実装
const createDatabaseConnection = () => {
  // 環境変数の確認
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let pool: any = null;

  try {
    console.log('Starting database migration...');
    
    pool = createDatabaseConnection();
    
    // 接続テスト
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        position VARCHAR(50) CHECK (position IN ('left', 'right', 'center')) NOT NULL DEFAULT 'center',
        usage VARCHAR(100) NOT NULL
      )
    `);

    // インデックス作成
    await pool.query('CREATE INDEX IF NOT EXISTS idx_texts_event_id ON texts(event_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_texts_order ON texts(order_index)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_characters_event_id ON characters(event_id)');

    await pool.end();

    console.log('Database migration completed successfully!');

    res.status(200).json({ 
      message: 'Database migration completed successfully',
      tables: ['events', 'texts', 'characters', 'images']
    });

  } catch (error) {
    console.error('Migration error:', error);
    
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    res.status(500).json({ 
      error: 'Migration failed',
      details: error.message 
    });
  }
}
