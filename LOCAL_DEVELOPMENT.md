# ローカル開発環境セットアップガイド

## 🚀 クイックスタート

### 1. ローカルAPIサーバーのセットアップ

```bash
# local-apiディレクトリに移動
cd local-api

# 依存関係をインストール
npm install

# 環境変数ファイルを作成
cp env.example .env

# ローカルAPIサーバーを起動
npm start
```

### 2. フロントエンドのセットアップ

```bash
# プロジェクトルートに戻る
cd ..

# 環境変数ファイルを作成（ローカル開発用）
cp env.local.example .env.local

# フロントエンドを起動
npm run dev
```

## 🔧 詳細手順

### ステップ1: ローカルAPIサーバー

1. **`local-api`ディレクトリに移動**
   ```bash
   cd local-api
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **環境変数を設定**
   ```bash
   # env.exampleをコピーして.envを作成
   cp env.example .env
   
   # .envファイルを編集してDATABASE_URLを設定
   # （Vercelの環境変数と同じ値を使用）
   ```

4. **APIサーバーを起動**
   ```bash
   npm start
   ```
   
   **成功時の表示:**
   ```
   🚀 Local API server running on http://localhost:3001
   📊 Health check: http://localhost:3001/api/health
   📝 Events API: http://localhost:3001/api/events
   ```

### ステップ2: フロントエンド

1. **プロジェクトルートに戻る**
   ```bash
   cd ..
   ```

2. **ローカル開発用環境変数を設定**
   ```bash
   # env.local.exampleをコピーして.env.localを作成
   cp env.local.example .env.local
   ```

3. **フロントエンドを起動**
   ```bash
   npm run dev
   ```

## 🎯 使用方法

### 同時起動（推奨）

```bash
# プロジェクトルートで実行
npm run dev:local
```

このコマンドで、APIサーバーとフロントエンドが同時に起動します。

### 個別起動

**ターミナル1（APIサーバー）:**
```bash
npm run dev:api
```

**ターミナル2（フロントエンド）:**
```bash
npm run dev
```

## 🔍 動作確認

### 1. APIサーバーの確認
```bash
# ヘルスチェック
curl http://localhost:3001/api/health

# イベント一覧取得
curl http://localhost:3001/api/events
```

### 2. フロントエンドの確認
- ブラウザで `http://localhost:3000` を開く
- イベント一覧が表示されることを確認

### 3. テーブル作成（初回のみ）
```bash
# データベーステーブルを作成
curl -X POST http://localhost:3001/api/migrate
```

## 🛠️ トラブルシューティング

### よくある問題

1. **ポートが使用中**
   ```bash
   # ポート3001が使用中の場合
   lsof -ti:3001 | xargs kill -9
   ```

2. **環境変数が設定されていない**
   ```bash
   # .envファイルが存在するか確認
   ls -la local-api/.env
   
   # DATABASE_URLが設定されているか確認
   cat local-api/.env
   ```

3. **データベース接続エラー**
   - `.env`ファイルの`DATABASE_URL`が正しいか確認
   - インターネット接続を確認

## 📁 ファイル構成

```
project-root/
├── local-api/           # ローカルAPIサーバー
│   ├── server.js       # Expressサーバー
│   ├── package.json    # API依存関係
│   └── env.example     # 環境変数テンプレート
├── src/                # フロントエンド
├── .env.local          # ローカル開発用環境変数
└── package.json        # メインプロジェクト設定
```

## 🎉 メリット

- ✅ **高速な開発サイクル**: Vercelデプロイ不要
- ✅ **リアルタイムデバッグ**: コンソールログで即座に確認
- ✅ **オフライン開発**: インターネット接続不要（APIサーバー起動後）
- ✅ **データベース直接操作**: SQLクエリのテストが容易
- ✅ **環境変数の簡単管理**: `.env`ファイルで一元管理
