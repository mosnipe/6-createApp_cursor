# 開発者向けドキュメント

## プロジェクト概要
パワポケ風テキストノベルイベント作成アプリの開発者向けドキュメント

## 技術スタック

### フロントエンド
- **React 19.1.1**: UI フレームワーク
- **TypeScript 5.8.3**: 型安全性
- **Vite 7.1.2**: ビルドツール
- **Tailwind CSS 4.1.13**: スタイリング
- **Redux Toolkit 2.9.0**: 状態管理
- **React Router DOM 7.8.2**: ルーティング
- **@dnd-kit**: ドラッグ&ドロップ機能
- **Axios 1.11.0**: HTTP クライアント

### バックエンド
- **Node.js**: ランタイム
- **Express 4.18.2**: Web フレームワーク
- **TypeScript 5.3.3**: 型安全性
- **PostgreSQL**: データベース
- **Multer 1.4.5**: ファイルアップロード
- **CORS 2.8.5**: クロスオリジン対応

### テスト
- **Vitest**: フロントエンドテスト
- **Jest**: バックエンドテスト
- **Testing Library**: React コンポーネントテスト
- **Supertest**: API テスト

### デプロイ
- **Vercel**: フロントエンド + サーバーレス関数
- **Vercel Postgres**: データベース

---

## プロジェクト構造

```
project/
├── frontend/                 # React フロントエンド
│   ├── src/
│   │   ├── components/      # React コンポーネント
│   │   │   ├── TextEditor/  # テキストエディター
│   │   │   ├── ImageSettings/ # 画像設定
│   │   │   └── PreviewPanel/  # プレビューパネル
│   │   ├── pages/           # ページコンポーネント
│   │   ├── store/           # Redux ストア
│   │   ├── services/        # API サービス
│   │   ├── types/           # TypeScript 型定義
│   │   ├── hooks/           # カスタムフック
│   │   └── test/            # テストファイル
│   ├── public/              # 静的ファイル
│   └── package.json
├── backend/                 # Express バックエンド
│   ├── src/
│   │   ├── controllers/     # コントローラー
│   │   ├── services/        # ビジネスロジック
│   │   ├── models/          # データモデル
│   │   ├── routes/          # ルート定義
│   │   ├── middleware/      # ミドルウェア
│   │   ├── utils/           # ユーティリティ
│   │   ├── types/           # TypeScript 型定義
│   │   ├── scripts/         # スクリプト
│   │   └── test/            # テストファイル
│   ├── uploads/             # アップロードファイル
│   └── package.json
├── docs/                    # ドキュメント
└── package.json             # ルート設定
```

---

## 開発環境セットアップ

### 前提条件
- Node.js 20.15.0 以上
- PostgreSQL 14 以上
- Git

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd powerproke-text-novel-editor
```

### 2. 依存関係のインストール
```bash
# ルートディレクトリ
npm install

# フロントエンド
cd frontend
npm install

# バックエンド
cd ../backend
npm install
```

### 3. 環境変数の設定

#### バックエンド (.env)
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/powerproke_db
FRONTEND_URL=http://localhost:3000
PORT=3001
NODE_ENV=development
```

#### フロントエンド (.env.local)
```bash
VITE_API_URL=http://localhost:3001/api
```

### 4. データベースのセットアップ
```bash
cd backend
npm run db:migrate create
```

### 5. 開発サーバーの起動
```bash
# ルートディレクトリから
npm run dev
```

または個別に起動：

```bash
# フロントエンド
cd frontend
npm run dev

# バックエンド
cd backend
npm run dev
```

---

## 開発ガイドライン

### コーディング規約

#### TypeScript
- 厳密な型チェックを有効にする
- `any` 型の使用を避ける
- インターフェースとタイプエイリアスを適切に使用する

#### React
- 関数コンポーネントを使用する
- カスタムフックでロジックを分離する
- Props の型定義を必須とする

#### CSS
- Tailwind CSS のユーティリティクラスを使用する
- カスタムスタイルは `@layer` ディレクティブを使用する

### コミット規約
```
<type>(<scope>): <description>

<body>

<footer>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: フォーマット
- `refactor`: リファクタリング
- `test`: テスト
- `chore`: その他

**例:**
```
feat(text-editor): add drag and drop functionality

- Implement drag and drop for text reordering
- Add visual feedback during drag operation
- Update order index automatically

Closes #123
```

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `bugfix/*`: バグ修正
- `hotfix/*`: 緊急修正

---

## テスト

### フロントエンドテスト
```bash
cd frontend
npm test                    # テスト実行
npm run test:ui            # UI付きテスト
npm run test:coverage      # カバレッジ付きテスト
```

### バックエンドテスト
```bash
cd backend
npm test                   # テスト実行
npm run test:watch         # ウォッチモード
npm run test:coverage      # カバレッジ付きテスト
```

### テストカバレッジ目標
- 行カバレッジ: 80% 以上
- 関数カバレッジ: 80% 以上
- ブランチカバレッジ: 70% 以上

---

## デプロイ

### Vercel へのデプロイ

#### 1. Vercel CLI のインストール
```bash
npm install -g vercel
```

#### 2. ログイン
```bash
vercel login
```

#### 3. プロジェクトの設定
```bash
vercel
```

#### 4. 環境変数の設定
Vercel ダッシュボードで以下を設定：
- `DATABASE_URL`: PostgreSQL 接続文字列
- `FRONTEND_URL`: フロントエンド URL
- `NODE_ENV`: production

#### 5. デプロイ
```bash
vercel --prod
```

### データベースマイグレーション
```bash
cd backend
npm run db:migrate create
```

---

## パフォーマンス最適化

### フロントエンド
- React.memo でコンポーネントの再レンダリングを最適化
- useMemo, useCallback で計算とコールバックを最適化
- 画像の遅延読み込み（Lazy Loading）
- バンドルサイズの最適化

### バックエンド
- データベースクエリの最適化
- インデックスの適切な設定
- ファイルアップロードのストリーミング
- レスポンスのキャッシュ

---

## セキュリティ

### 実装済み
- 入力値のサニタイズ
- ファイルアップロードの検証
- CORS の設定
- SQL インジェクション対策

### 今後の実装予定
- 認証・認可機能
- レート制限
- HTTPS の強制
- セキュリティヘッダーの設定

---

## 監視・ログ

### ログレベル
- `error`: エラー
- `warn`: 警告
- `info`: 情報
- `debug`: デバッグ

### ログ出力
```typescript
console.error('Error:', error);
console.warn('Warning:', warning);
console.info('Info:', info);
console.debug('Debug:', debug);
```

---

## トラブルシューティング

### よくある問題

#### データベース接続エラー
```bash
# 接続文字列を確認
echo $DATABASE_URL

# PostgreSQL の起動確認
pg_ctl status
```

#### ポート競合
```bash
# 使用中のポートを確認
netstat -ano | findstr :3001

# プロセスを終了
taskkill /PID <PID> /F
```

#### 依存関係エラー
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

---

## 貢献ガイド

### プルリクエスト
1. 機能ブランチを作成
2. 変更をコミット
3. テストを実行
4. プルリクエストを作成
5. コードレビューを受ける
6. マージ

### コードレビュー
- 機能性の確認
- パフォーマンスの確認
- セキュリティの確認
- テストカバレッジの確認
- ドキュメントの更新

---

## ライセンス
MIT License

## 連絡先
- 開発チーム: dev@example.com
- イシュー: GitHub Issues
- ディスカッション: GitHub Discussions
