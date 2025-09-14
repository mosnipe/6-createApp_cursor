// 開発環境用のモックデータベース
class MockDatabase {
  private data: Map<string, any[]> = new Map();
  
  constructor() {
    console.log('Using mock database for development');
    this.initializeData();
  }
  
  private initializeData() {
    // サンプルデータを初期化
    this.data.set('events', [
      {
        id: '1',
        title: 'サンプルイベント',
        description: 'テスト用のイベントです',
        background_image_id: null,
        header_settings: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
    this.data.set('characters', []);
    this.data.set('texts', []);
  }
  
  async query(text: string, params?: any[]): Promise<any> {
    console.log('Mock DB Query:', text, params);
    
    // SELECT文の処理
    if (text.includes('SELECT')) {
      if (text.includes('FROM events')) {
        const events = this.data.get('events') || [];
        // キャラクター情報も含めて返す
        const eventsWithCharacters = events.map(event => ({
          ...event,
          characters: this.data.get('characters')?.filter(c => c.event_id === event.id) || [],
          texts: this.data.get('texts')?.filter(t => t.event_id === event.id) || []
        }));
        return { rows: eventsWithCharacters };
      }
      if (text.includes('FROM characters')) {
        const characters = this.data.get('characters') || [];
        return { rows: characters };
      }
      if (text.includes('FROM texts')) {
        const texts = this.data.get('texts') || [];
        return { rows: texts };
      }
    }
    
    // INSERT文の処理
    if (text.includes('INSERT INTO events')) {
      const newEvent = {
        id: 'mock-' + Date.now(),
        title: params[0],
        description: params[1],
        background_image_id: params[2],
        header_settings: params[3],
        created_at: new Date(),
        updated_at: new Date()
      };
      const events = this.data.get('events') || [];
      events.push(newEvent);
      this.data.set('events', events);
      return { rows: [newEvent] };
    }
    
    if (text.includes('INSERT INTO characters')) {
      const newCharacter = {
        id: 'char-' + Date.now(),
        event_id: params[0],
        name: params[1],
        image_url: params[2],
        position: params[3],
        created_at: new Date()
      };
      const characters = this.data.get('characters') || [];
      characters.push(newCharacter);
      this.data.set('characters', characters);
      return { rows: [newCharacter] };
    }
    
    // UPDATE文の処理
    if (text.includes('UPDATE events')) {
      const events = this.data.get('events') || [];
      const eventId = params[params.length - 1]; // 最後のパラメータがID
      const eventIndex = events.findIndex(e => e.id === eventId);
      
      if (eventIndex !== -1) {
        // パラメータに基づいてイベントを更新
        let paramIndex = 0;
        
        // SET句の各フィールドを処理
        if (text.includes('title =')) {
          events[eventIndex].title = params[paramIndex++];
        }
        if (text.includes('description =')) {
          events[eventIndex].description = params[paramIndex++];
        }
        if (text.includes('background_image_id =')) {
          events[eventIndex].background_image_id = params[paramIndex++];
        }
        if (text.includes('header_settings =')) {
          // JSON文字列をパースしてオブジェクトに変換
          const headerSettings = typeof params[paramIndex] === 'string' 
            ? JSON.parse(params[paramIndex]) 
            : params[paramIndex];
          events[eventIndex].header_settings = headerSettings;
          paramIndex++;
        }
        
        events[eventIndex].updated_at = new Date();
        
        this.data.set('events', events);
        return { rows: [events[eventIndex]] };
      }
    }
    
    // DELETE文の処理
    if (text.includes('DELETE FROM characters')) {
      const characters = this.data.get('characters') || [];
      const filteredCharacters = characters.filter(c => c.event_id !== params[0]);
      this.data.set('characters', filteredCharacters);
      return { rowCount: characters.length - filteredCharacters.length };
    }
    
    return { rows: [], rowCount: 0 };
  }
  
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    // モックではトランザクションをそのまま実行
    return await callback(this);
  }
  
  async close(): Promise<void> {
    console.log('Mock database closed');
  }
}

export const db = new MockDatabase();
