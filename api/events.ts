import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// データベース接続の簡易実装
const createDatabaseConnection = () => {
  // 環境変数の確認
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
  
  // Prisma Accelerateを使用する場合は、通常のPostgreSQL接続を使用
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Prisma Accelerateは常にSSLが必要
    max: 1, // Vercel Functionsでは接続数を制限
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
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

  let pool: any = null;

  try {
    console.log('Starting API request:', { method, path });
    
    // データベース接続の確認
    pool = createDatabaseConnection();
    
    // 接続テスト
    console.log('Testing database connection...');
    await pool.query('SELECT 1');
    console.log('Database connection successful');

    // デバッグエンドポイント
    if (method === 'GET' && path === '/debug') {
      const debugInfo = {
        timestamp: new Date().toISOString(),
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
        },
        database: {
          connection: 'testing...'
        }
      };

      try {
        const result = await pool.query('SELECT 1 as test');
        debugInfo.database.connection = 'SUCCESS';
        debugInfo.database.testResult = result.rows[0];
      } catch (dbError: any) {
        debugInfo.database.connection = 'FAILED';
        debugInfo.database.error = dbError.message;
      }

      await pool.end();
      return res.status(200).json(debugInfo);
    }

    // イベント一覧取得
    if (method === 'GET' && path === '/events') {
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
      
      // レスポンス形式をフロントエンドに合わせる
      const events = result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        backgroundImage: row.background_image_id,
        texts: row.texts || [],
        characters: row.characters || [],
        headerSettings: {
          year: 1,
          month: 6,
          week: 3,
          dayType: 'weekday',
          stats: {
            motivation: { value: 3, max: 5, icon: '😊' },
            stamina: { value: 5, max: 5, icon: '❤️' },
            toughness: { value: 2, max: 5, icon: '💚' }
          }
        }
      }));
      
      await pool.end();
      return res.status(200).json(events);
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

      // レスポンス形式をフロントエンドに合わせる
      const event = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at,
        backgroundImage: result.rows[0].background_image_id,
        texts: [],
        characters: [],
        headerSettings: {
          year: 1,
          month: 6,
          week: 3,
          dayType: 'weekday',
          stats: {
            motivation: { value: 3, max: 5, icon: '😊' },
            stamina: { value: 5, max: 5, icon: '❤️' },
            toughness: { value: 2, max: 5, icon: '💚' }
          }
        }
      };

      await pool.end();
      return res.status(201).json(event);
    }

    // イベント取得
    if (method === 'GET' && path.startsWith('/events/')) {
      const eventId = path.split('/')[2];
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

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // レスポンス形式をフロントエンドに合わせる
      const event = {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at,
        backgroundImage: result.rows[0].background_image_id,
        texts: result.rows[0].texts || [],
        characters: result.rows[0].characters || [],
        headerSettings: {
          year: 1,
          month: 6,
          week: 3,
          dayType: 'weekday',
          stats: {
            motivation: { value: 3, max: 5, icon: '😊' },
            stamina: { value: 5, max: 5, icon: '❤️' },
            toughness: { value: 2, max: 5, icon: '💚' }
          }
        }
      };

      return res.status(200).json(event);
    }

    // イベント更新
    if (method === 'PUT' && path.startsWith('/events/')) {
      const eventId = path.split('/')[2];
      const { title, description, characters, backgroundImageId, headerSettings } = req.body;

      // イベント基本情報の更新
      const updateFields = [];
      const updateValues = [];
      let paramIndex = 1;

      if (title !== undefined) {
        updateFields.push(`title = $${paramIndex}`);
        updateValues.push(title);
        paramIndex++;
      }

      if (description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(description);
        paramIndex++;
      }

      if (backgroundImageId !== undefined) {
        updateFields.push(`background_image_id = $${paramIndex}`);
        updateValues.push(backgroundImageId);
        paramIndex++;
      }

      if (updateFields.length > 0) {
        updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
        updateValues.push(eventId);

        const updateQuery = `UPDATE events SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        await pool.query(updateQuery, updateValues);
      }

      // キャラクターの更新
      if (characters !== undefined) {
        // 既存のキャラクターを削除
        await pool.query('DELETE FROM characters WHERE event_id = $1', [eventId]);
        
        // 新しいキャラクターを追加
        for (const character of characters) {
          await pool.query(
            'INSERT INTO characters (id, event_id, name, image_url, position) VALUES ($1, $2, $3, $4, $5)',
            [character.id, eventId, character.name, character.imageUrl, character.position]
          );
        }
      }

      // イベント情報を再取得（関連データを含む）
      const eventResult = await pool.query(
        'SELECT * FROM events WHERE id = $1',
        [eventId]
      );

      if (eventResult.rows.length === 0) {
        await pool.end();
        return res.status(404).json({ error: 'Event not found' });
      }

      // テキストを取得
      const textsResult = await pool.query(
        'SELECT * FROM texts WHERE event_id = $1 ORDER BY order_index',
        [eventId]
      );

      // キャラクターを取得
      const charactersResult = await pool.query(
        'SELECT * FROM characters WHERE event_id = $1',
        [eventId]
      );

      await pool.end();

      // レスポンス形式をフロントエンドに合わせる
      const event = {
        id: eventResult.rows[0].id,
        title: eventResult.rows[0].title,
        description: eventResult.rows[0].description,
        createdAt: eventResult.rows[0].created_at,
        updatedAt: eventResult.rows[0].updated_at,
        backgroundImage: eventResult.rows[0].background_image_id,
        texts: textsResult.rows.map(text => ({
          id: text.id,
          content: text.content,
          order: text.order_index,
          characterId: text.character_id,
          imageId: text.image_id
        })),
        characters: charactersResult.rows.map(char => ({
          id: char.id,
          name: char.name,
          imageUrl: char.image_url,
          position: char.position
        })),
        headerSettings: headerSettings || {
          year: 1,
          month: 6,
          week: 3,
          dayType: 'weekday',
          stats: {
            motivation: { value: 3, max: 5, icon: '😊' },
            stamina: { value: 5, max: 5, icon: '❤️' },
            toughness: { value: 2, max: 5, icon: '💚' }
          }
        }
      };

      return res.status(200).json(event);
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
      const { content, order } = req.body;

      if (!content) {
        await pool.end();
        return res.status(400).json({ error: 'Content is required' });
      }

      const result = await pool.query(
        'INSERT INTO texts (event_id, content, order_index) VALUES ($1, $2, $3) RETURNING *',
        [eventId, content, order || 0]
      );

      // レスポンス形式をフロントエンドに合わせる
      const text = {
        id: result.rows[0].id,
        content: result.rows[0].content,
        order: result.rows[0].order_index,
        characterId: result.rows[0].character_id,
        imageId: result.rows[0].image_id
      };

      await pool.end();
      return res.status(201).json(text);
    }

    // テキスト更新
    if (method === 'PUT' && path.startsWith('/texts/')) {
      const textId = path.split('/')[2];
      const { content, order } = req.body;

      const result = await pool.query(
        'UPDATE texts SET content = $1, order_index = $2 WHERE id = $3 RETURNING *',
        [content, order, textId]
      );

      await pool.end();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Text not found' });
      }

      // レスポンス形式をフロントエンドに合わせる
      const text = {
        id: result.rows[0].id,
        content: result.rows[0].content,
        order: result.rows[0].order_index,
        characterId: result.rows[0].character_id,
        imageId: result.rows[0].image_id
      };

      return res.status(200).json(text);
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

    if (pool) await pool.end();
    // 404エラー
    return res.status(404).json({ error: 'API endpoint not found' });

  } catch (error: any) {
    console.error('API Error Details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      internalPosition: error.internalPosition,
      internalQuery: error.internalQuery,
      where: error.where,
      schema: error.schema,
      table: error.table,
      column: error.column,
      dataType: error.dataType,
      constraint: error.constraint,
      file: error.file,
      line: error.line,
      routine: error.routine
    });
    
    // データベース接続を確実に閉じる
    if (pool) {
      try {
        await pool.end();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      type: error.name,
      code: error.code
    });
  }
}