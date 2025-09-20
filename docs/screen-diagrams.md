# 画面構成図・画面遷移図

## 画面構成図

### 1. アプリケーション全体構成

```mermaid
graph TB
    subgraph "アプリケーション全体"
        A[NavigationHeader] --> B[Main Content Area]
        B --> C[Page Content]
        C --> D[Footer/Status]
    end
    
    subgraph "NavigationHeader"
        A1[アプリタイトル] --> A2[ナビゲーションメニュー]
        A2 --> A3[イベント一覧]
        A2 --> A4[ホーム]
    end
    
    subgraph "Main Content Area"
        B1[Container] --> B2[Page Specific Content]
    end
```

### 2. ホームページ構成

```mermaid
graph TB
    subgraph "HomePage Layout"
        A[Full Screen Background<br/>Gradient: Blue to Purple] --> B[Main Card Container]
        B --> C[Title Section]
        C --> C1[パワポケ風]
        C --> C2[テキストノベルエディター]
        B --> D[Action Buttons]
        D --> D1[新規イベント作成]
        D --> D2[既存イベント編集]
        B --> E[Description Text]
        E --> E1[パワポケのようなテキストノベルイベントを]
        E --> E2[簡単に作成・編集できます]
    end
```

### 3. イベント一覧ページ構成

```mermaid
graph TB
    subgraph "EventListPage Layout"
        A[Container] --> B[Header Section]
        B --> B1[イベント一覧 Title]
        B --> B2[新規作成 Button]
        A --> C[Error Message Area]
        A --> D[New Event Form Modal]
        D --> D1[Title Input]
        D --> D2[Description Input]
        D --> D3[Create/Cancel Buttons]
        A --> E[Event Grid]
        E --> E1[Event Card 1]
        E --> E2[Event Card 2]
        E --> E3[Event Card 3]
        E --> E4[Event Card N]
        
        subgraph "Event Card Structure"
            E1 --> EC1[Event Title]
            E1 --> EC2[Description]
            E1 --> EC3[Created Date]
            E1 --> EC4[Text Count]
            E1 --> EC5[Edit Button]
            E1 --> EC6[Delete Button]
        end
    end
```

### 4. イベント編集ページ構成

```mermaid
graph TB
    subgraph "EventEditPage Layout"
        A[Container] --> B[Header Section]
        B --> B1[Title Edit Area]
        B --> B2[Save Button]
        B --> B3[Preview Button]
        A --> C[Tab Navigation]
        C --> C1[テキスト Tab]
        C --> C2[画像 Tab]
        C --> C3[キャラクター Tab]
        C --> C4[ヘッダー Tab]
        A --> D[Tab Content Area]
        D --> D1[Text Tab Content]
        D --> D2[Image Tab Content]
        D --> D3[Character Tab Content]
        D --> D4[Header Tab Content]
        A --> E[Preview Panel]
        E --> E1[PowerProke Style Preview]
    end
```

### 5. テキストタブ詳細構成

```mermaid
graph TB
    subgraph "Text Tab Content"
        A[Text Tab Container] --> B[Text Input Card]
        B --> B1[テキスト入力 Title]
        B --> B2[Text Input Area]
        B --> B3[Submit Button]
        A --> C[Text List Card]
        C --> C1[テキスト順序 Title]
        C --> C2[Drag & Drop List]
        C2 --> C3[Text Item 1]
        C2 --> C4[Text Item 2]
        C2 --> C5[Text Item N]
        
        subgraph "Text Item Structure"
            C3 --> TI1[Drag Handle]
            C3 --> TI2[Text Content]
            C3 --> TI3[Edit Button]
            C3 --> TI4[Delete Button]
        end
    end
```

### 6. 画像タブ詳細構成

```mermaid
graph TB
    subgraph "Image Tab Content"
        A[Image Tab Container] --> B[Background Image Card]
        B --> B1[背景画像 Title]
        B --> B2[File Upload Input]
        B --> B3[Current Image Preview]
        A --> C[Image Statistics Card]
        C --> C1[画像統計 Title]
        C --> C2[Background Status]
        C --> C3[Character Count]
        C --> C4[Image Count]
    end
```

### 7. キャラクタータブ詳細構成

```mermaid
graph TB
    subgraph "Character Tab Content"
        A[Character Tab Container] --> B[Character Settings Card]
        B --> B1[キャラクター設定 Title]
        B --> B2[Add Character Button]
        B --> B3[Character List]
        B3 --> B4[Character Item 1]
        B3 --> B5[Character Item 2]
        B3 --> B6[Character Item N]
        
        subgraph "Character Item Structure"
            B4 --> CI1[Image Upload]
            B4 --> CI2[Name Input]
            B4 --> CI3[Position Select]
            B4 --> CI4[Delete Button]
        end
        
        A --> C[Character Preview Card]
        C --> C1[キャラクター配置プレビュー Title]
        C --> C2[Left Position Area]
        C --> C3[Center Position Area]
        C --> C4[Right Position Area]
    end
```

### 8. ヘッダータブ詳細構成

```mermaid
graph TB
    subgraph "Header Tab Content"
        A[Header Tab Container] --> B[Game Info Card]
        B --> B1[ゲーム情報設定 Title]
        B --> B2[Year Input]
        B --> B3[Month Input]
        B --> B4[Week Input]
        B --> B5[Day Type Select]
        A --> C[Basic Stats Card]
        C --> C1[基本ステータス設定 Title]
        C --> C2[Motivation Gauge]
        C --> C3[Stamina Gauge]
        C --> C4[Toughness Gauge]
        A --> D[Custom Gauges Card]
        D --> D1[カスタムゲージ設定 Title]
        D --> D2[Add Gauge Button]
        D --> D3[Custom Gauge List]
        A --> E[Header Preview Card]
        E --> E1[ヘッダープレビュー Title]
        E --> E2[PowerProke Header Preview]
    end
```

### 9. プレビューパネル詳細構成

```mermaid
graph TB
    subgraph "Preview Panel Structure"
        A[Preview Panel Container] --> B[PowerProke Style Screen]
        B --> C[Header Bar]
        C --> C1[Game Info Display]
        C --> C2[Stats Display]
        B --> D[Main Display Area]
        D --> D1[Background Image]
        D --> D2[Character Display Areas]
        D2 --> D3[Left Characters]
        D2 --> D4[Center Characters]
        D2 --> D5[Right Characters]
        B --> E[Text Display Area]
        E --> E1[Text Content]
        E --> E2[Character Name]
    end
```

## 画面遷移図

### 1. 全体の画面遷移

```mermaid
graph TD
    A[ホームページ] --> B[イベント一覧ページ]
    B --> C[イベント編集ページ]
    B --> D[新規イベント作成]
    D --> C
    C --> B
    C --> E[プレビューモード]
    E --> C
    B --> A
    C --> A
    
    subgraph "Navigation"
        F[NavigationHeader] --> A
        F --> B
        F --> C
    end
```

### 2. イベント一覧ページの遷移

```mermaid
graph TD
    A[イベント一覧ページ] --> B[新規作成ボタンクリック]
    B --> C[新規イベント作成モーダル]
    C --> D[タイトル・説明入力]
    D --> E[作成ボタンクリック]
    E --> F[イベント作成API呼び出し]
    F --> G[イベント編集ページへ遷移]
    
    A --> H[既存イベントカードクリック]
    H --> I[イベント編集ページへ遷移]
    
    A --> J[削除ボタンクリック]
    J --> K[削除確認]
    K --> L[削除API呼び出し]
    L --> M[イベント一覧更新]
```

### 3. イベント編集ページの遷移

```mermaid
graph TD
    A[イベント編集ページ] --> B[テキストタブ]
    A --> C[画像タブ]
    A --> D[キャラクタータブ]
    A --> E[ヘッダータブ]
    
    B --> B1[テキスト入力]
    B1 --> B2[テキスト追加API]
    B2 --> B3[テキストリスト更新]
    
    B --> B4[テキスト編集]
    B4 --> B5[テキスト更新API]
    B5 --> B3
    
    B --> B6[テキスト削除]
    B6 --> B7[テキスト削除API]
    B7 --> B3
    
    B --> B8[ドラッグ&ドロップ]
    B8 --> B9[順序変更API]
    B9 --> B3
    
    C --> C1[画像アップロード]
    C1 --> C2[画像アップロードAPI]
    C2 --> C3[背景画像更新]
    
    D --> D1[キャラクター追加]
    D1 --> D2[キャラクター更新API]
    D2 --> D3[キャラクターリスト更新]
    
    D --> D4[キャラクター編集]
    D4 --> D2
    
    D --> D5[キャラクター削除]
    D5 --> D2
    
    E --> E1[ゲーム情報変更]
    E1 --> E2[ヘッダー設定更新API]
    E2 --> E3[ヘッダープレビュー更新]
    
    E --> E4[ステータス変更]
    E4 --> E2
    
    E --> E5[カスタムゲージ追加]
    E5 --> E2
    
    A --> F[プレビューボタンクリック]
    F --> G[プレビューモード]
    G --> H[編集モードボタンクリック]
    H --> A
```

### 4. プレビューモードの遷移

```mermaid
graph TD
    A[編集モード] --> B[プレビューボタンクリック]
    B --> C[プレビューモード]
    C --> D[パワポケ風画面表示]
    D --> E[テキスト表示]
    D --> F[キャラクター表示]
    D --> G[背景画像表示]
    D --> H[ヘッダー情報表示]
    
    C --> I[編集モードボタンクリック]
    I --> A
    
    C --> J[イベント一覧ボタンクリック]
    J --> K[イベント一覧ページ]
    
    C --> L[ホームボタンクリック]
    L --> M[ホームページ]
```

### 5. エラーハンドリングの遷移

```mermaid
graph TD
    A[API呼び出し] --> B{成功?}
    B -->|Yes| C[正常処理]
    B -->|No| D[エラー発生]
    D --> E[エラーメッセージ表示]
    E --> F[ユーザーアクション]
    F --> G[再試行]
    F --> H[キャンセル]
    G --> A
    H --> I[前の画面に戻る]
    
    subgraph "エラータイプ"
        D --> D1[ネットワークエラー]
        D --> D2[バリデーションエラー]
        D --> D3[サーバーエラー]
        D --> D4[認証エラー]
    end
```

### 6. レスポンシブ対応の遷移

```mermaid
graph TD
    A[画面サイズ変更] --> B{画面幅}
    B -->|Mobile < 768px| C[モバイルレイアウト]
    B -->|Tablet 768-1024px| D[タブレットレイアウト]
    B -->|Desktop > 1024px| E[デスクトップレイアウト]
    
    C --> C1[縦積みレイアウト]
    C --> C2[タッチ操作対応]
    C --> C3[プレビューパネル下部移動]
    
    D --> D1[2カラムレイアウト]
    D --> D2[中サイズコンポーネント]
    
    E --> E1[3カラムレイアウト]
    E --> E2[大サイズコンポーネント]
    E --> E3[ホバー効果]
```

## 状態管理図

### 1. Redux Store構成

```mermaid
graph TB
    A[Redux Store] --> B[Events Slice]
    A --> C[Current Event Slice]
    A --> D[UI Slice]
    
    B --> B1[list: Event[]]
    B --> B2[loading: boolean]
    B --> B3[error: string]
    
    C --> C1[event: Event]
    C --> C2[loading: boolean]
    C --> C3[error: string]
    
    D --> D1[sidebarOpen: boolean]
    D --> D2[previewMode: boolean]
    D --> D3[dragIndex: number | null]
    
    subgraph "Local State (useState)"
        E[activeTab: string]
        F[isEditingTitle: boolean]
        G[hasUnsavedChanges: boolean]
    end
```

### 2. データフロー

```mermaid
graph LR
    A[User Action] --> B[Component]
    B --> C[Redux Action]
    C --> D[Redux Reducer]
    D --> E[Store Update]
    E --> F[Component Re-render]
    F --> G[UI Update]
    
    H[API Call] --> I[Service Layer]
    I --> J[Backend API]
    J --> K[Response]
    K --> L[Redux Action]
    L --> D
```

---

*このドキュメントは、アプリケーションの画面構成と画面遷移を詳細に説明しています。*
*最終更新: 2024年1月*
