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
      eventData.title,
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
    
    return this.mapToEventModel(result.rows[0]);
  }
  
  async updateEvent(id: string, eventData: UpdateEventRequest): Promise<Event> {
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
    
    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);
    
    const query = `
      UPDATE events 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Event not found', 404);
    }
    
    return this.mapToEventModel(result.rows[0]);
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
    };
  }
}
