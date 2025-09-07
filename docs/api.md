# API仕様書

## 概要
パワポケ風テキストノベルイベント作成アプリのREST API仕様書

## ベースURL
- 開発環境: `http://localhost:3001/api`
- 本番環境: `https://your-domain.vercel.app/api`

## 認証
現在は認証機能は実装されていません。

## エラーレスポンス
すべてのエラーは以下の形式で返されます：

```json
{
  "error": "ERROR_CODE",
  "message": "エラーメッセージ"
}
```

### エラーコード
- `VALIDATION_ERROR`: バリデーションエラー
- `NOT_FOUND`: リソースが見つからない
- `FILE_UPLOAD_ERROR`: ファイルアップロードエラー
- `DATABASE_ERROR`: データベースエラー
- `INTERNAL_ERROR`: 内部サーバーエラー

## エンドポイント

### ヘルスチェック

#### GET /health
サーバーの状態を確認します。

**レスポンス:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### イベント管理

#### GET /events
イベント一覧を取得します。

**レスポンス:**
```json
[
  {
    "id": "uuid",
    "title": "イベントタイトル",
    "description": "イベント説明",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "background_image_id": "uuid",
    "text_count": 5
  }
]
```

#### POST /events
新しいイベントを作成します。

**リクエストボディ:**
```json
{
  "title": "イベントタイトル",
  "description": "イベント説明（任意）",
  "background_image_id": "uuid（任意）"
}
```

**バリデーション:**
- `title`: 必須、1-255文字
- `description`: 任意
- `background_image_id`: 任意、有効なUUID

**レスポンス:**
```json
{
  "id": "uuid",
  "title": "イベントタイトル",
  "description": "イベント説明",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "background_image_id": "uuid"
}
```

#### GET /events/:id
指定されたIDのイベント詳細を取得します。

**パラメータ:**
- `id`: イベントのUUID

**レスポンス:**
```json
{
  "id": "uuid",
  "title": "イベントタイトル",
  "description": "イベント説明",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "background_image_id": "uuid",
  "background_image_path": "/uploads/images/filename.jpg"
}
```

#### PUT /events/:id
指定されたIDのイベントを更新します。

**パラメータ:**
- `id`: イベントのUUID

**リクエストボディ:**
```json
{
  "title": "更新されたタイトル（任意）",
  "description": "更新された説明（任意）",
  "background_image_id": "uuid（任意）"
}
```

**レスポンス:**
```json
{
  "id": "uuid",
  "title": "更新されたタイトル",
  "description": "更新された説明",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "background_image_id": "uuid"
}
```

#### DELETE /events/:id
指定されたIDのイベントを削除します。

**パラメータ:**
- `id`: イベントのUUID

**レスポンス:**
- ステータスコード: 204 (No Content)

---

### テキスト管理

#### GET /events/:eventId/texts
指定されたイベントのテキスト一覧を取得します。

**パラメータ:**
- `eventId`: イベントのUUID

**レスポンス:**
```json
[
  {
    "id": "uuid",
    "event_id": "uuid",
    "content": "テキスト内容",
    "order_index": 0,
    "character_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### POST /events/:eventId/texts
指定されたイベントに新しいテキストを追加します。

**パラメータ:**
- `eventId`: イベントのUUID

**リクエストボディ:**
```json
{
  "content": "テキスト内容",
  "order": 0,
  "character_id": "uuid（任意）"
}
```

**バリデーション:**
- `content`: 必須、空文字不可
- `order`: 必須、0以上の整数
- `character_id`: 任意、有効なUUID

**レスポンス:**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "content": "テキスト内容",
  "order_index": 0,
  "character_id": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /texts/:id
指定されたIDのテキストを更新します。

**パラメータ:**
- `id`: テキストのUUID

**リクエストボディ:**
```json
{
  "content": "更新されたテキスト内容（任意）",
  "order": 1,
  "character_id": "uuid（任意）"
}
```

**レスポンス:**
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "content": "更新されたテキスト内容",
  "order_index": 1,
  "character_id": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE /texts/:id
指定されたIDのテキストを削除します。

**パラメータ:**
- `id`: テキストのUUID

**レスポンス:**
- ステータスコード: 204 (No Content)

#### PUT /texts/reorder
テキストの順序を変更します。

**リクエストボディ:**
```json
{
  "text_ids": ["uuid1", "uuid2", "uuid3"]
}
```

**レスポンス:**
```json
{
  "message": "Texts reordered successfully"
}
```

---

### 画像管理

#### POST /images/upload
画像ファイルをアップロードします。

**リクエスト:**
- Content-Type: `multipart/form-data`
- フィールド名: `image`
- ファイル形式: JPEG, PNG, GIF, WebP
- 最大サイズ: 5MB

**レスポンス:**
```json
{
  "id": "uuid",
  "url": "/api/images/uuid"
}
```

#### GET /images/:id
指定されたIDの画像ファイルを取得します。

**パラメータ:**
- `id`: 画像のUUID

**レスポンス:**
- Content-Type: 画像のMIMEタイプ
- 画像ファイルのバイナリデータ

#### DELETE /images/:id
指定されたIDの画像を削除します。

**パラメータ:**
- `id`: 画像のUUID

**レスポンス:**
- ステータスコード: 204 (No Content)

---

## 使用例

### イベント作成からテキスト追加までの流れ

1. **イベント作成**
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '{"title": "テストイベント", "description": "テスト説明"}'
```

2. **テキスト追加**
```bash
curl -X POST http://localhost:3001/api/events/{eventId}/texts \
  -H "Content-Type: application/json" \
  -d '{"content": "こんにちは！", "order": 0}'
```

3. **画像アップロード**
```bash
curl -X POST http://localhost:3001/api/images/upload \
  -F "image=@background.jpg"
```

4. **イベントに背景画像を設定**
```bash
curl -X PUT http://localhost:3001/api/events/{eventId} \
  -H "Content-Type: application/json" \
  -d '{"background_image_id": "{imageId}"}'
```

## レート制限
現在はレート制限は実装されていません。

## バージョニング
現在はAPIバージョニングは実装されていません。
