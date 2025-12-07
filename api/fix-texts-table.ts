import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// データベース接続の簡易実装
const createDatabaseConnection = () => {
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
    console.log('Starting texts table fix...');
    
    pool = createDatabaseConnection();
    
    // 接続テスト
    await pool.query('SELECT 1');

    // textsテーブルにimage_idカラムを追加
    await pool.query(`
      ALTER TABLE texts 
      ADD COLUMN IF NOT EXISTS image_id UUID
    `);

    // インデックス作成（必要に応じて）
    await pool.query('CREATE INDEX IF NOT EXISTS idx_texts_image_id ON texts(image_id)');

    // 左、右、中央画像のリンクカラムを追加
    await pool.query(`
      ALTER TABLE texts
      ADD COLUMN IF NOT EXISTS character_image_left_id UUID REFERENCES images(id),
      ADD COLUMN IF NOT EXISTS character_image_right_id UUID REFERENCES images(id),
      ADD COLUMN IF NOT EXISTS event_image_center_id UUID REFERENCES images(id);
    `);

    await pool.end();

    console.log('Texts table fix completed successfully!');

    res.status(200).json({ 
      message: 'Texts table fix completed successfully',
      addedColumn: 'image_id'
    });

  } catch (error) {
    console.error('Fix error:', error);
    
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    res.status(500).json({ 
      error: 'Fix failed',
      details: error.message 
    });
  }
}
