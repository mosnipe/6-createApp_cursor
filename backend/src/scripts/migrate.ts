import { db } from '../utils/database';

const createTables = async () => {
  try {
    console.log('Creating database tables...');
    
    // イベントテーブル
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        background_image_id UUID,
        header_settings JSONB,
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
    
    console.log('Database tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  try {
    console.log('Dropping database tables...');
    
    await db.query('DROP TABLE IF EXISTS texts CASCADE');
    await db.query('DROP TABLE IF EXISTS characters CASCADE');
    await db.query('DROP TABLE IF EXISTS images CASCADE');
    await db.query('DROP TABLE IF EXISTS events CASCADE');
    
    console.log('Database tables dropped successfully!');
    
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

// コマンドライン引数で実行
const command = process.argv[2];

if (command === 'create') {
  createTables().then(() => {
    console.log('Migration completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
} else if (command === 'drop') {
  dropTables().then(() => {
    console.log('Drop completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Drop failed:', error);
    process.exit(1);
  });
} else {
  console.log('Usage: npm run db:migrate create|drop');
  process.exit(1);
}
