# パワポケ風テキストノベルイベント作成アプリ

## プロジェクト概要
パワポケのようなテキストノベルイベントを作成・編集するWebアプリケーション

## 技術スタック
- **フロントエンド**: React 19.1.1 + TypeScript 5.8.3 + Vite 7.1.2 + Tailwind CSS 3.4.0
- **状態管理**: Redux Toolkit 2.9.0
- **ルーティング**: React Router DOM 7.8.2
- **ドラッグ&ドロップ**: @dnd-kit
- **バックエンド**: Node.js + Express 4.18.2 + TypeScript 5.3.3
- **データベース**: PostgreSQL (Vercel Postgres)
- **ファイルアップロード**: Multer 1.4.5
- **テスト**: Vitest (フロントエンド) + Jest (バックエンド)
- **デプロイ**: Vercel

## ディレクトリ構造
```
├── src/                    # React フロントエンド
│   ├── components/         # React コンポーネント
│   │   ├── TextEditor/     # テキストエディター
│   │   ├── ImageSettings/  # 画像設定
│   │   ├── CharacterSettings/ # キャラクター設定
│   │   ├── HeaderSettings/ # ヘッダー設定
│   │   └── PreviewPanel/  # プレビューパネル
│   ├── pages/              # ページコンポーネント
│   ├── store/              # Redux ストア
│   ├── services/           # API サービス
│   ├── types/              # TypeScript 型定義
│   └── test/               # テストファイル
├── backend/                # Express バックエンド
│   ├── src/
│   │   ├── controllers/    # コントローラー
│   │   ├── services/       # ビジネスロジック
│   │   ├── middleware/    # ミドルウェア
│   │   ├── utils/          # ユーティリティ
│   │   └── test/           # テストファイル
│   └── uploads/            # アップロードファイル
├── docs/                   # ドキュメント
├── local-api/              # ローカル開発用API
└── package.json            # ルート設定
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
FRONTEND_URL=https://6-create-app-cursor-frontend-duq-git-main-mosnipes-projects.vercel.app
PORT=3001

# .env.local
VITE_API_URL=https://6-create-app-cursor-frontend-duq-git-main-mosnipes-projects.vercel.app/api
```

### 3. データベースセットアップ
```bash
cd backend
npm run db:migrate
```

### 4. 開発サーバー起動
```bash
# フロントエンドのみ
npm run dev

# バックエンドのみ
npm run dev:backend

# 両方同時起動（推奨）
npm run dev:local
```

## 機能
- イベントの新規作成・編集・保存・削除
- テキストの順序管理（ドラッグ&ドロップ）
- 画像アップロード・設定（背景画像、キャラクター画像）
- キャラクター設定（名前、画像、位置）
- ヘッダー設定（ゲーム情報、ステータス、カスタムゲージ）
- リアルタイムプレビュー（パワポケ風画面表示）
- レスポンシブデザイン対応

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