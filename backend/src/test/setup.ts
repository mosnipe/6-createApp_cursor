// テスト用のセットアップ
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/powerproke_test';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.PORT = '3001';
