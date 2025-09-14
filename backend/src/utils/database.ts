import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 開発環境ではモックデータベースを使用
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.DATABASE_URL;

if (isDevelopment) {
  console.log('Using mock database for development');
  // モックデータベースを動的にインポート
  const { db: mockDb } = require('./mockDatabase');
  module.exports = { db: mockDb };
} else {
  // 本番環境ではPostgreSQLを使用
  class Database {
    private pool: Pool;
    
    constructor() {
      const databaseUrl = process.env.DATABASE_URL;
      
      console.log('Connecting to PostgreSQL database');
      
      this.pool = new Pool({
        connectionString: databaseUrl,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }
    
    async query(text: string, params?: any[]): Promise<any> {
      const client = await this.pool.connect();
      try {
        const result = await client.query(text, params);
        return result;
      } finally {
        client.release();
      }
    }
    
    async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
      const client = await this.pool.connect();
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }

    async close(): Promise<void> {
      await this.pool.end();
    }
  }

  export const db = new Database();
}
