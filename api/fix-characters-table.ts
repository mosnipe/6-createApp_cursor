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
    console.log('Starting characters table fix...');
    
    pool = createDatabaseConnection();
    
    // 接続テスト
    await pool.query('SELECT 1');

    // charactersテーブルのimage_urlカラムをNULL許可に変更
    await pool.query(`
      ALTER TABLE characters 
      ALTER COLUMN image_url DROP NOT NULL
    `);

    // 既存の空文字列をNULLに更新
    await pool.query(`
      UPDATE characters 
      SET image_url = NULL 
      WHERE image_url = ''
    `);

    await pool.end();

    console.log('Characters table fix completed successfully!');

    res.status(200).json({ 
      message: 'Characters table fix completed successfully',
      changes: ['image_url column now allows NULL', 'empty strings converted to NULL']
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
