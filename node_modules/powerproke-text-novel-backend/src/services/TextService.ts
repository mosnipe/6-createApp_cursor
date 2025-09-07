import { db } from '../utils/database';
import { Text, CreateTextRequest, UpdateTextRequest } from '../types';
import { AppError, ErrorCode } from '../types';

export class TextService {
  async createText(eventId: string, textData: CreateTextRequest): Promise<Text> {
    const query = `
      INSERT INTO texts (event_id, content, order_index, character_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      eventId,
      textData.content,
      textData.order,
      textData.character_id || null
    ]);
    
    return this.mapToTextModel(result.rows[0]);
  }
  
  async getTextsByEventId(eventId: string): Promise<Text[]> {
    const query = `
      SELECT * FROM texts 
      WHERE event_id = $1 
      ORDER BY order_index ASC
    `;
    
    const result = await db.query(query, [eventId]);
    return result.rows.map(row => this.mapToTextModel(row));
  }
  
  async updateText(id: string, textData: UpdateTextRequest): Promise<Text> {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    if (textData.content !== undefined) {
      fields.push(`content = $${paramCount++}`);
      values.push(textData.content);
    }
    
    if (textData.order !== undefined) {
      fields.push(`order_index = $${paramCount++}`);
      values.push(textData.order);
    }
    
    if (textData.character_id !== undefined) {
      fields.push(`character_id = $${paramCount++}`);
      values.push(textData.character_id);
    }
    
    values.push(id);
    
    const query = `
      UPDATE texts 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Text not found', 404);
    }
    
    return this.mapToTextModel(result.rows[0]);
  }
  
  async deleteText(id: string): Promise<void> {
    const query = 'DELETE FROM texts WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rowCount === 0) {
      throw new AppError(ErrorCode.NOT_FOUND, 'Text not found', 404);
    }
  }
  
  async reorderTexts(textIds: string[]): Promise<void> {
    await db.transaction(async (client) => {
      for (let i = 0; i < textIds.length; i++) {
        await client.query(
          'UPDATE texts SET order_index = $1 WHERE id = $2',
          [i, textIds[i]]
        );
      }
    });
  }
  
  private mapToTextModel(row: any): Text {
    return {
      id: row.id,
      event_id: row.event_id,
      content: row.content,
      order_index: row.order_index,
      character_id: row.character_id,
      created_at: row.created_at,
    };
  }
}
