import { db } from '../utils/database';
import { Event, CreateEventRequest, UpdateEventRequest } from '../types';
import { AppError, ErrorCode } from '../types';

export class EventService {
  async createEvent(eventData: CreateEventRequest): Promise<Event> {
    const query = `
      INSERT INTO events (title, description, background_image_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      eventData.title || '',
      eventData.description || null,
      eventData.background_image_id || null
    ]);
    
    return this.mapToEventModel(result.rows[0]);
  }
  
  async getEvents(): Promise<Event[]> {
    const query = `
      SELECT e.*, 
             COUNT(t.id) as text_count,
             i.file_path as background_image_path
      FROM events e
      LEFT JOIN texts t ON e.id = t.event_id
      LEFT JOIN images i ON e.background_image_id = i.id
      GROUP BY e.id, i.file_path
      ORDER BY e.updated_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows.map(row => this.mapToEventModel(row));
  }
  
  async getEventById(id: string): Promise<Event | null> {
    const query = `
      SELECT e.*, 
             i.file_path as background_image_path
      FROM events e
      LEFT JOIN images i ON e.background_image_id = i.id
      WHERE e.id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const event = this.mapToEventModel(result.rows[0]);
    
    // キャラクター情報を取得
    const charactersQuery = `
      SELECT id, name, image_url, position, created_at
      FROM characters
      WHERE event_id = $1
      ORDER BY created_at
    `;
    const charactersResult = await db.query(charactersQuery, [id]);
    event.characters = charactersResult.rows.map(row => ({
      id: row.id,
      name: row.name,
      imageUrl: row.image_url,
      position: row.position,
      createdAt: row.created_at
    }));
    
    return event;
  }
  
  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
    return await db.transaction(async (client) => {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      if (eventData.title !== undefined) {
        fields.push(`title = $${paramCount++}`);
        values.push(eventData.title);
      }
      
      if (eventData.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(eventData.description);
      }
      
      if (eventData.background_image_id !== undefined) {
        fields.push(`background_image_id = $${paramCount++}`);
        values.push(eventData.background_image_id);
      }
      
      if (eventData.headerSettings !== undefined) {
        fields.push(`header_settings = $${paramCount++}`);
        values.push(JSON.stringify(eventData.headerSettings));
      }
      
      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);
      
      const query = `
        UPDATE events 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Event not found', 404);
      }
      
      // キャラクターの更新
      if (eventData.characters !== undefined) {
        // 既存のキャラクターを削除
        await client.query('DELETE FROM characters WHERE event_id = $1', [id]);
        
        // 新しいキャラクターを追加
        for (const character of eventData.characters) {
          await client.query(`
            INSERT INTO characters (event_id, name, image_url, position)
            VALUES ($1, $2, $3, $4)
          `, [id, character.name, character.imageUrl, character.position]);
        }
      }
      
      return this.mapToEventModel(result.rows[0]);
    });
  }
  
  async deleteEvent(id: string): Promise<void> {
    const query = 'DELETE FROM events WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rowCount === 0) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Event not found', 404);
    }
  }
  
  private mapToEventModel(row: any): Event {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      created_at: row.created_at,
      updated_at: row.updated_at,
      background_image_id: row.background_image_id,
      backgroundImage: row.background_image_path,
      headerSettings: row.header_settings ? JSON.parse(row.header_settings) : undefined,
      characters: row.characters || [],
      texts: row.texts || []
    };
  }
}
