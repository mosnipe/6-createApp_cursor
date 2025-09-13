# システムガイド

## プログラムの全体像

### このプログラムは何をしているのか？

このプログラムは**パワプロクンポケット風のテキストノベルイベント作成アプリ**です。簡単に言うと、ゲーム内で表示されるイベント（ストーリー）を作成・編集するためのWebアプリケーションです。

#### 具体的な機能
1. **イベントの作成・編集**：ゲーム内で表示されるストーリーを作成
2. **テキストの管理**：セリフやナレーションを順序立てて配置
3. **画像の設定**：背景画像やキャラクター画像を設定
4. **プレビュー機能**：実際のゲーム画面のように確認
5. **データの保存**：作成したイベントをデータベースに保存

#### なぜこのプログラムが必要？
- **ゲーム開発者**：イベント制作の効率化
- **ストーリーライター**：テキストと画像を組み合わせた制作
- **ゲームデザイナー**：プレイヤー体験の向上

---

## システム構成

### 全体の仕組み

```
[ユーザー] → [Webブラウザ] → [フロントエンド] → [バックエンド] → [データベース]
```

#### 各要素の役割
- **ユーザー**：アプリを使ってイベントを作成・編集
- **Webブラウザ**：アプリを表示・操作する環境
- **フロントエンド**：ユーザーが見る画面（React）
- **バックエンド**：データ処理・保存（Node.js）
- **データベース**：作成したデータを保存（PostgreSQL）

### 技術スタック

#### フロントエンド（画面側）
- **React**：画面を作るライブラリ
- **TypeScript**：JavaScriptに型を追加した言語
- **Tailwind CSS**：見た目を整えるスタイル
- **Redux**：データの状態管理

#### バックエンド（処理側）
- **Node.js**：サーバー側で動くJavaScript
- **Express**：Webサーバーを作るフレームワーク
- **PostgreSQL**：データを保存するデータベース

---

## ファイル構成と役割

### プロジェクト全体の構造

```
6-createApp_cursor/
├── src/                    # フロントエンド（画面）のソースコード
├── backend/                # バックエンド（処理）のソースコード
├── docs/                   # ドキュメント
├── public/                 # 静的ファイル（画像など）
├── dist/                   # ビルド後のファイル（本番用）
├── package.json            # プロジェクトの設定ファイル
├── vercel.json             # Vercel（デプロイ）の設定
└── README.md               # プロジェクトの説明
```

### フロントエンド（src/）の詳細

#### 主要ファイル
```
src/
├── App.tsx                 # アプリのメインコンポーネント
├── main.tsx               # アプリのエントリーポイント
├── index.css              # 全体のスタイル
├── vite-env.d.ts          # TypeScriptの型定義
├── components/            # 再利用可能な画面部品
├── pages/                 # 各ページのコンポーネント
├── store/                 # データの状態管理
├── services/              # APIとの通信
├── types/                 # 型定義
└── test/                  # テストファイル
```

#### 各ファイルの役割

**App.tsx**
- アプリ全体の骨組み
- ルーティング（どのページを表示するか）を設定
- 全体のレイアウトを定義

**main.tsx**
- アプリの起動点
- Reactアプリを画面に表示する処理

**components/（画面部品）**
```
components/
├── TextEditor/            # テキスト編集機能
│   ├── index.tsx         # メインのテキストエディター
│   ├── TextInput.tsx     # テキスト入力部分
│   └── TextList.tsx      # テキスト一覧表示
├── ImageSettings/         # 画像設定機能
│   └── index.tsx         # 画像アップロード・設定
└── PreviewPanel/          # プレビュー機能
    └── index.tsx         # プレビュー表示
```

**pages/（ページ）**
```
pages/
├── HomePage.tsx           # ホーム画面
├── EventListPage.tsx      # イベント一覧画面
└── EventEditPage.tsx      # イベント編集画面
```

**store/（データ管理）**
```
store/
└── index.ts              # Reduxストアの設定
```

**services/（API通信）**
```
services/
└── api.ts                # バックエンドとの通信処理
```

**types/（型定義）**
```
types/
└── index.ts              # TypeScriptの型定義
```

### バックエンド（backend/）の詳細

#### 主要ファイル
```
backend/
├── src/
│   ├── index.ts          # サーバーの起動ファイル
│   ├── controllers/      # リクエスト処理
│   ├── services/         # ビジネスロジック
│   ├── models/           # データモデル
│   ├── routes/           # ルート定義
│   ├── middleware/       # ミドルウェア
│   ├── utils/            # ユーティリティ
│   ├── types/            # 型定義
│   └── test/             # テストファイル
├── package.json          # バックエンドの設定
└── uploads/              # アップロードされたファイル
```

#### 各ファイルの役割

**index.ts**
- サーバーの起動
- ポートの設定
- ミドルウェアの設定

**controllers/（処理制御）**
```
controllers/
├── EventController.ts    # イベント関連の処理
├── TextController.ts     # テキスト関連の処理
└── ImageController.ts    # 画像関連の処理
```

**services/（ビジネスロジック）**
```
services/
├── EventService.ts       # イベントの業務処理
├── TextService.ts        # テキストの業務処理
└── ImageService.ts       # 画像の業務処理
```

**middleware/（中間処理）**
```
middleware/
├── errorHandler.ts       # エラー処理
├── upload.ts            # ファイルアップロード処理
└── validation.ts        # 入力値検証
```

---

## プログラミング言語の基本概念

### TypeScript（タイプスクリプト）

#### 基本概念
TypeScriptは、JavaScriptに**型**を追加した言語です。

#### なぜ型が必要？
```typescript
// JavaScript（型なし）
let name = "田中";        // 文字列
let age = 25;            // 数値
name = 30;               // エラーにならない（問題！）

// TypeScript（型あり）
let name: string = "田中";  // 文字列型
let age: number = 25;      // 数値型
name = 30;                 // エラーになる（安全！）
```

#### 基本的な型
```typescript
// 基本型
let text: string = "文字列";           // 文字列
let number: number = 123;             // 数値
let flag: boolean = true;              // 真偽値
let data: any = "何でもOK";            // 任意の型

// 配列
let names: string[] = ["田中", "佐藤"];  // 文字列の配列
let numbers: number[] = [1, 2, 3];     // 数値の配列

// オブジェクト
let person: {
  name: string;
  age: number;
} = {
  name: "田中",
  age: 25
};
```

#### インターフェース（型の定義）
```typescript
// イベントの型定義
interface Event {
  id: string;           // ID（文字列）
  title: string;       // タイトル（文字列）
  description: string;  // 説明（文字列）
  createdAt: Date;     // 作成日（日付）
  texts: TextItem[];   // テキスト一覧（配列）
}

// 使用例
let event: Event = {
  id: "1",
  title: "初回イベント",
  description: "最初のイベントです",
  createdAt: new Date(),
  texts: []
};
```

### React（リアクト）

#### 基本概念
Reactは、**コンポーネント**という部品を組み合わせて画面を作るライブラリです。

#### コンポーネントとは？
```typescript
// 簡単なコンポーネント
function Welcome() {
  return <h1>ようこそ！</h1>;
}

// 使用例
function App() {
  return (
    <div>
      <Welcome />
      <Welcome />
    </div>
  );
}
```

#### Props（プロパティ）
```typescript
// データを受け取るコンポーネント
function Greeting(props: { name: string }) {
  return <h1>こんにちは、{props.name}さん！</h1>;
}

// 使用例
function App() {
  return <Greeting name="田中" />;
}
```

#### State（状態）
```typescript
import { useState } from 'react';

function Counter() {
  // 状態の定義
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        増やす
      </button>
    </div>
  );
}
```

### Node.js（ノードジェイエス）

#### 基本概念
Node.jsは、**サーバー側でJavaScriptを動かす**ための環境です。

#### なぜNode.js？
- **フロントエンドとバックエンドで同じ言語**を使える
- **JavaScriptの知識**をそのまま活用できる
- **豊富なライブラリ**が利用できる

#### 基本的なサーバー
```javascript
// Expressを使った簡単なサーバー
const express = require('express');
const app = express();

// ルートの定義
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// サーバーの起動
app.listen(3000, () => {
  console.log('サーバーが起動しました');
});
```

### Express（エクスプレス）

#### 基本概念
Expressは、**Webサーバーを作る**ためのフレームワークです。

#### 基本的な使い方
```javascript
const express = require('express');
const app = express();

// ミドルウェア（中間処理）
app.use(express.json()); // JSONデータの解析

// ルートの定義
app.get('/api/events', (req, res) => {
  res.json({ events: [] });
});

app.post('/api/events', (req, res) => {
  const event = req.body;
  // データベースに保存
  res.json({ success: true });
});
```

### PostgreSQL（ポストグレスキューエル）

#### 基本概念
PostgreSQLは、**データを保存・管理**するためのデータベースです。

#### なぜPostgreSQL？
- **信頼性が高い**：データの整合性を保つ
- **機能が豊富**：複雑なクエリに対応
- **無料**：オープンソース

#### 基本的なテーブル
```sql
-- イベントテーブル
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- テキストテーブル
CREATE TABLE texts (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL
);
```

---

## データの流れ

### 1. イベント作成の流れ

```
[ユーザー] → [フロントエンド] → [バックエンド] → [データベース]
    ↓              ↓              ↓              ↓
「新規作成」    → フォーム表示  → API呼び出し  → データ保存
    ↓              ↓              ↓              ↓
「保存」        → データ送信    → データ処理    → 保存完了
```

### 2. 具体的な処理

#### フロントエンド側
```typescript
// イベント作成の処理
const createEvent = async (eventData: CreateEventRequest) => {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  return response.json();
};
```

#### バックエンド側
```typescript
// イベント作成のAPI
app.post('/api/events', async (req, res) => {
  try {
    const eventData = req.body;
    const event = await eventService.createEvent(eventData);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'イベント作成に失敗しました' });
  }
});
```

#### データベース側
```sql
-- イベントの挿入
INSERT INTO events (title, description) 
VALUES ('新しいイベント', 'イベントの説明');
```

---

## 開発環境の設定

### 必要なツール

#### 1. Node.js
- **役割**：JavaScriptをサーバー側で動かす
- **インストール**：公式サイトからダウンロード
- **確認方法**：`node --version`

#### 2. npm
- **役割**：パッケージ（ライブラリ）の管理
- **インストール**：Node.jsと一緒にインストール
- **確認方法**：`npm --version`

#### 3. Git
- **役割**：コードのバージョン管理
- **インストール**：公式サイトからダウンロード
- **確認方法**：`git --version`

### 開発の流れ

#### 1. プロジェクトのセットアップ
```bash
# リポジトリのクローン
git clone <repository-url>
cd 6-createApp_cursor

# 依存関係のインストール
npm install
```

#### 2. 開発サーバーの起動
```bash
# フロントエンドの起動
npm run dev

# バックエンドの起動（別ターミナル）
npm run dev:backend
```

#### 3. 開発の流れ
1. **コードを書く**：機能を実装
2. **テストする**：動作確認
3. **コミットする**：変更を保存
4. **プッシュする**：リモートに送信

---

## よくある質問（FAQ）

### Q: なぜTypeScriptを使うの？
**A:** 型があることで、エラーを事前に発見でき、コードの品質が向上します。

### Q: Reactのコンポーネントとは？
**A:** 画面の部品（ボタン、フォームなど）を再利用可能な形で作る仕組みです。

### Q: バックエンドとフロントエンドの違いは？
**A:** フロントエンドはユーザーが見る画面、バックエンドはデータ処理を行うサーバー側です。

### Q: データベースはなぜ必要？
**A:** 作成したデータを永続的に保存し、後で取り出せるようにするためです。

### Q: エラーが出た時はどうする？
**A:** エラーメッセージを読んで、該当するファイルを確認し、問題を修正します。

---

## トラブルシューティング

### よくあるエラーと対処法

#### 1. モジュールが見つからない
```bash
Error: Cannot find module 'react'
```
**対処法**：`npm install`を実行

#### 2. 型エラー
```typescript
Error: Type 'string' is not assignable to type 'number'
```
**対処法**：型を正しく指定する

#### 3. サーバーが起動しない
```bash
Error: Port 3000 is already in use
```
**対処法**：別のポートを使用するか、既存のプロセスを終了

#### 4. データベース接続エラー
```bash
Error: Connection refused
```
**対処法**：データベースが起動しているか確認

---

## まとめ

### このプログラムの特徴
1. **モダンな技術**：最新のWeb技術を使用
2. **型安全**：TypeScriptでエラーを防止
3. **再利用可能**：コンポーネントベースの設計
4. **スケーラブル**：機能追加が容易

### 学習のポイント
1. **基本概念**：各技術の役割を理解
2. **実践**：実際にコードを書いてみる
3. **エラー対応**：問題解決能力を身につける
4. **継続学習**：新しい技術を学び続ける

### 次のステップ
1. **コードを読む**：既存のコードを理解
2. **機能追加**：新しい機能を実装
3. **テスト**：品質を保つ
4. **ドキュメント**：知識を共有

---

*このドキュメントは、システムの全体像と各ファイルの役割を理解するためのガイドです。*
*最終更新: 2024年1月*
