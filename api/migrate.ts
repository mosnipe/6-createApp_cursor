import { db } from '../backend/src/utils/database';

export default async function handler(req: any, res: any) {
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

  try {
    console.log('Starting database migration...');

    // イベントテーブル
    await db.query(`
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
    await db.query(`
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
    await db.query(`
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
    await db.query(`
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
    await db.query('CREATE INDEX IF NOT EXISTS idx_texts_event_id ON texts(event_id)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_texts_order ON texts(order_index)');
    await db.query('CREATE INDEX IF NOT EXISTS idx_characters_event_id ON characters(event_id)');

    console.log('Database migration completed successfully!');

    res.status(200).json({ 
      message: 'Database migration completed successfully',
      tables: ['events', 'texts', 'characters', 'images']
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ 
      error: 'Migration failed',
      details: error.message 
    });
  }
}
