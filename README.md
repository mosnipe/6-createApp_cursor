# パワポケ風テキストノベルイベント作成アプリ

## プロジェクト概要
パワポケのようなテキストノベルイベントを作成・編集するWebアプリケーション

## 技術スタック
- **フロントエンド**: React + TypeScript + Tailwind CSS
- **バックエンド**: Node.js + Express + TypeScript
- **データベース**: PostgreSQL (Vercel Postgres)
- **デプロイ**: Vercel

## ディレクトリ構造
```
├── src/              # React フロントエンド
├── backend/          # Express バックエンド
├── docs/             # ドキュメント
└── package.json      # ルート設定
```

## 開発環境セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数設定
```bash
# backend/.env
DATABASE_URL=your_postgres_connection_string
FRONTEND_URL=https://6-create-app-cursor-frontend-47rk.vercel.app
PORT=3001

# .env.local
VITE_API_URL=https://6-create-app-cursor-frontend-47rk.vercel.app/api
```

### 3. データベースセットアップ
```bash
cd backend
npm run db:migrate
```

### 4. 開発サーバー起動
```bash
npm run dev
```

## 機能
- イベントの新規作成・編集・保存
- テキストの順序管理（ドラッグ&ドロップ）
- 画像アップロード・設定
- リアルタイムプレビュー
- パワポケ風画面表示

## API仕様
詳細は `docs/api.md` を参照

## ドキュメント
- [API仕様書](docs/api.md)
- [ユーザーマニュアル](docs/user-manual.md)
- [開発者向けドキュメント](docs/developer-guide.md)

## テスト
```bash
# フロントエンドテスト
npm test

# バックエンドテスト
npm run test:backend
```

## デプロイ

### Vercel へのデプロイ

1. **GitHubリポジトリをVercelにインポート**
   - Vercelダッシュボードで「New Project」
   - GitHubリポジトリを選択
   - フレームワーク: Vite
   - Root Directory: `/` (ルート)

2. **環境変数の設定**
   ```
   DATABASE_URL=your_postgres_connection_string
   FRONTEND_URL=https://6-create-app-cursor-frontend-duq-git-main-mosnipes-projects.vercel.app
   NODE_ENV=production
   ```

3. **データベースのセットアップ**
   - Vercel Postgresを追加
   - 接続文字列を環境変数に設定

4. **デプロイ**
   - 「Deploy」ボタンをクリック
   - ビルドが完了するまで待機

## ライセンス
MIT