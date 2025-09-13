import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL ? 'SET' : 'NOT SET',
      },
      database: {
        connection: 'testing...'
      }
    };

    // データベース接続テスト
    if (process.env.DATABASE_URL) {
      try {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        });
        
        const result = await pool.query('SELECT 1 as test');
        await pool.end();
        
        debugInfo.database.connection = 'SUCCESS';
        debugInfo.database.testResult = result.rows[0];
      } catch (dbError: any) {
        debugInfo.database.connection = 'FAILED';
        debugInfo.database.error = dbError.message;
      }
    } else {
      debugInfo.database.connection = 'NO DATABASE_URL';
    }

    res.status(200).json(debugInfo);

  } catch (error: any) {
    res.status(500).json({
      error: 'Debug endpoint failed',
      details: error.message,
      stack: error.stack
    });
  }
}
