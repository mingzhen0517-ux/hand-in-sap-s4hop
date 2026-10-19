# hand-in-sap-s4hop

> **Languages / 语言 / 言語 / 언어**: [日本語](README.ja.md) | [English](README.en.md) | [简体中文](README.md) | [한국어](README.ko.md)

SAP S/4HANA (ABAP ADT) プロジェクト向けローカル MCP (Model Context Protocol) 統合環境です。標準化された MCP プロトコルを通じて、AI コーディングアシスタント（Codex、Claude など）を SAP コアシステムとシームレスに接続し、従来の SAP GUI (SE38/SE80) や Eclipse ADT による重厚な儀式感やコンテキストの分断を解消します。

本プロジェクトは **「Vibe Coding（バイブコーディング／フロー状態での自然言語コーディング）」** を中核体験とし、**SAP Best Practice** および **Clean Core 現代化アーキテクチャ原則** を深く統合しています。標準 MCP プロトコルによる SAP ADT への直接接続により、**「意図の理解 ➔ テーブル・コードの自動検索 ➔ 動的生成 ➔ リモートコンパイラによるリアルタイム構文診断 ➔ 制御されたデプロイと検証」** という超高速なフィードバックループを実現します。

エンタープライズ規模の SAP 開発における厳格なコンプライアンス、高い凝集性、およびスムーズなアップグレード要件を満たすため、本プロジェクトは **3 つの SAP Clean Core 宣言型専門サブエージェント（設計・開発・テスト）** をネイティブに内蔵しています。業界最先端の **「宣言型設定 + 指針ドキュメント + 補助スクリプト」** 構造を採用し、アーキテクチャ設計からクラウド対応コーディング、品質レビューまでをカバーするエンドツーエンドの協調パイプラインを提供します:
- 🏛️ **設計エージェント (Design Agent)**: 読み取り専用でシステムメタデータを探索することを基準とし、Clean Core 拡張レイヤリング（Tier 1 ABAP Cloud / Tier 2 アダプタ隔離レイヤ / Tier 3 SAP BTP 並行処理）を厳格に遵守します。CDS View Entity 仮想データモデル (VDM) およびサービスインターフェース契約を策定し、コアへの侵入的な修正を排除します。書き込み権限は `docs/design/**` に厳格に制限されます。
- 💻 **開発エージェント (Dev Agent)**: 最新のオブジェクト指向 ABAP および CDS エンティティモデリングを採用し、廃止予定の手続き型構文を徹底排除します。MCP ツールを連動させてカーネル構文診断（`sap.source.diagnose`）と即時エラー修復を行い、3 回のリトライ上限とサーキットブレーカーを適用して高精度なコードを高速生成します。書き込み権限は `src/**` に厳格に制限されます。
- 🧪 **テストエージェント (Test Agent)**: 全社的な Where-Used 影響範囲分析および Clean Core API リリースコンプライアンスの監査を実施し、Test Double 隔離に基づく最新の ABAP Unit 単体テストクラスを自動構築して、欠陥ゼロとシームレスなアップグレードを保証します。書き込み権限は `tests/**` および `docs/qa/**` に厳格に制限されます。

> **🔒 厳格なエンジニアリング防御ライン**: 3 つのサブエージェントはいずれも完全な `config.json`、`system.md`（禁止事項と境界の定義）、`prompt.md`（最小限の入力スライス）、`schema.json` & `contract.md`（無駄のない確定的な JSON 出力契約）を備えています。`npm run agents:validate` により相互排他的な書き込みスコープ（Disjoint Write Sets）を物理的に検証し、競合やコンテキスト汚染を完全に防止します。

---

## 目次

- [環境および接続検証結果](#環境および接続検証結果)
- [実現可能なコア機能](#実現可能なコア機能)
- [SAP Clean Core & Best Practice マルチエージェント協調体系](#sap-clean-core--best-practice-マルチエージェント協調体系)
  - [なぜ SAP で Clean Core を徹底する必要があるのか？](#なぜ-sap-で-clean-core-を徹底する必要があるのか)
  - [3 大サブエージェントの役割マトリクスと責任分担](#3-大サブエージェントの役割マトリクスと責任分担)
  - [エンドツーエンド協調フィードバックループ](#エンドツーエンド協調フィードバックループ)
- [AI 主導の Vibe Coding: 超高速開発とデプロイ・検証の一体化](#ai-主導の-vibe-coding-超高速開発とデプロイ検証の一体化)
  - [SAP ABAP における Vibe Coding とは？](#sap-abap-における-vibe-coding-とは)
  - [一体型フィードバックワークフロー (Read -> Edit -> Diagnose -> Deploy -> Verify)](#一体型フィードバックワークフロー-read---edit---diagnose---deploy---verify)
  - [実際の Vibe Coding 対話型シナリオ体験](#実際の-vibe-coding-対話型シナリオ体験)
- [実践的な活用ユースケースとワークフロー](#実践的な活用ユースケースとワークフロー)
  - [ケース 1: カスタムレポート・プログラムの調査とソースレビュー](#ケース-1-カスタムレポートプログラムの調査とソースレビュー)
  - [ケース 2: オブジェクト影響度分析 (Where-Used 被参照追跡)](#ケース-2-オブジェクト影響度分析-where-used-被参照追跡)
  - [ケース 3: ABAP リアルタイム構文診断と迅速な自動修復](#ケース-3-abap-リアルタイム構文診断と迅速な自動修復)
  - [ケース 4: データディクショナリ (DDIC) のオンデマンド探索と読み取り](#ケース-4-データディクショナリ-ddic-のオンデマンド探索と読み取り)
  - [ケース 5: 開発支援とコード自動補完 (Auto-Complete)](#ケース-5-開発支援とコード自動補完-auto-complete)
  - [ケース 6: AI 支援によるビジネスレポートの迅速な構築 (ALV / CDS View)](#ケース-6-ai-支援によるビジネスレポートの迅速な構築-alv--cds-view)
  - [ケース 7: コンプライアンス審査と監査証跡データ照会](#ケース-7-コンプライアンス審査と監査証跡データ照会)
  - [ケース 8: テーブル間動的データ抽出と軽量な統合分析](#ケース-8-テーブル間動的データ抽出と軽量な統合分析)
  - [ケース 9: 高頻度定期ジョブのオーケストレーションと自動巡回点検](#ケース-9-高頻度定期ジョブのオーケストレーションと自動巡回点検)
- [MCP アーキテクチャとツールセット](#mcp-アーキテクチャとツールセット)
  - [アダプティブプリセット (Adaptive Preset)](#アダプティブプリセット-adaptive-preset)
  - [オンデマンド動的能力探索 (On-Demand Capabilities)](#オンデマンド動的能力探索-on-demand-capabilities)
- [クイックスタート (Quick Start)](#クイックスタート-quick-start)
  - [1. 依存関係のインストール](#1-依存関係のインストール)
  - [2. 接続診断とヘルスチェック](#2-接続診断とヘルスチェック)
  - [3. プロトコルおよび機能スモークテスト](#3-プロトコルおよび機能スモークテスト)
  - [4. コード整合性チェック](#4-コード整合性チェック)
  - [5. MCP サービスの起動](#5-mcp-サービスの起動)
- [クライアント統合設定 (Codex)](#クライアント統合設定-codex)
- [セキュリティとアクセス制御](#セキュリティとアクセス制御)
- [トラブルシューティング (FAQ)](#トラブルシューティング-faq)

---

## 環境および接続検証結果

### 1. SAP S/4HANA システム情報
- **SAP Release**: `758` (SAP NetWeaver 7.58 ベース SAP S/4HANA)
- **System ID**: `S4H` (Client `100`, Logical System `S4HCLNT100`)
- **環境 (Environment)**: `development`
- **デフォルト言語**: `EN`
- **タイムゾーン**: `UTC+8`

### 2. SAP WebGUI ログイン検証
- **検証済みログイン URL (HTTPS)**:
  ```text
  https://<sap-host>:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
  ```
- **ログイン状態**: 実測検証済み（正常ログイン確認済み）。
- **HTTP 50099 ポートに関する注意**:
  HTTP ポート `50099` 経由でのアクセス時、SAP システムが認証を遮断し以下のエラーを返します:
  - `ICF_SYSTEM_LOGIN002`: Logon through HTTP is not possible; logon ticket is active for HTTPS only
  - `ICF_SYSTEM_LOGIN006`: No switch to HTTPS occurred, so it is not secure to send a password
  
  これにより、ICF サービスでの認証およびパスワード送信は HTTPS のみに厳格制限されていることが確認されています。

### 3. HTTPS 証明書について
現在サーバーは自己署名証明書を使用しているか、パブリックドメイン名にバインドされていないため、ブラウザで「信頼されていない証明書」警告が表示される場合があります。本プロジェクトの起動スクリプトは、子プロセス内限定で安全に証明書検証のバイパス処理を行っており、ホスト全体の環境に影響を与えることなく安全に通信します。

---

## SAP Clean Core & Best Practice マルチエージェント協調体系

### なぜ SAP で Clean Core を徹底する必要があるのか？
従来の SAP ECC や初期の S/4HANA アドオン開発では、標準コードへのブレークポイント設置、暗黙の機能拡張（Implicit Enhancement）の挿入、未リリースの内部汎用モジュールや未加工の透明テーブルへの直接アクセスが頻繁に行われていました。これにより、バージョンアップ時に膨大な構文衝突や業務ロジックの破損が発生し、深刻な「技術的負債」となっていました。

**SAP Clean Core ベストプラクティス**が要求する原則:
1. **コア無修正 (Zero Modification Core)**: 標準 SAP コードには一切手を加えない。
2. **現代的な階層型拡張アーキテクチャ**:
   - **Tier 1 (ABAP Cloud On-Stack)**: リリース済み公式 API (Released APIs) および Released CDS View のみを用いて、クラウドレディなオンスタック拡張を構築。
   - **Tier 2 (Custom Isolation Layer)**: どうしても避けられない未リリース機能の呼び出しは専用のアダプタ (Adapter/Wrapper) クラスで厳密にカプセル化・隔離し、リファクタリング計画を管理。
   - **Tier 3 (Side-by-Side on SAP BTP)**: 大規模な対外連携、重たいバッチ処理、イベント駆動型拡張はクラウド BTP のマイクロサービスへ分離。
3. **最新のデータおよびビジネスモデリング**: CDS View Entities、仮想データモデル (VDM)、RAP (RESTful Application Programming Model) の全面採用。

---

### 3 大サブエージェントの役割マトリクスと責任分担

`agents/` ディレクトリおよび全域の `AGENTS.md` で定義された 3 つの Clean Core 専門サブエージェントが連携して動作します:

| サブエージェント | 定義およびガイドラインパス | 中核となる役割と責任 | 主要な MCP ツールセット |
| :--- | :--- | :--- | :--- |
| **設計エージェント**<br>*(Design Agent)* | [`agents/design-agent/AGENT.md`](agents/design-agent/AGENT.md) | **アーキテクチャ設計とコンプライアンス管理**: 要件の実現可能性評価、Clean Core 拡張レイヤ分類 (Tier 1/2/3)、CDS View Entity 階層 (Basic/Composite/Consumption) およびサービス契約の策定。コア侵入的設計を防止。 | `sap.repository.search`<br>`sap.repository.inspect`<br>`sap.source.read`<br>`sap.system.inspect` |
| **開発エージェント**<br>*(Dev Agent)* | [`agents/dev-agent/AGENT.md`](agents/dev-agent/AGENT.md) | **最新 ABAP Cloud コーディング専門家**: 最新 ABAP Cloud 規約に準拠した実装 (FORM/TABLES などのレガシー構文を厳禁)、複雑なクエリの CDS エンティティへのプッシュダウン、ビジネスロジッククラスおよび RAP 振る舞いの実装、SAP コンパイラと連動したリアルタイム構文トラブルシューティング。 | `sap.source.diagnose`<br>`sap.source.read`<br>`sap.semantic.complete`<br>`sap.semantic.definition` |
| **テストエージェント**<br>*(Test Agent)* | [`agents/test-agent/AGENT.md`](agents/test-agent/AGENT.md) | **品質保証と影響度分析のエキスパート**: 全社的な Where-Used 依存関係・波及影響範囲の追跡、Clean Core API リリース適合性審査、Test Double 隔離を用いた高カバレッジな最新 ABAP Unit 単体テストの自動作成。 | `sap.repository.where_used`<br>`sap.source.diagnose`<br>`sap.source.search`<br>`sap.system.inspect` |

---

### エンドツーエンド協調フィードバックループ

3 つのエージェントが連携し、要件定義から高品質リリースに至る Clean Core 開発ループを形成します:

```text
                 ┌─────────────────────────────────────────────────────────────┐
                 │                ビジネス要件 / 変更要求の提示                │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🏛️ 設計エージェント (Design Agent)                                                      │
  │ • sap.repository.inspect / search で既存テーブルおよび標準 CDS 構造を調査               │
  │ • 拡張ティアの決定 (Tier 1 クラウド対応 / Tier 2 隔離アダプタ層)                        │
  │ • 『SAP Clean Core 技術アーキテクチャ設計書』を作成 (CDS 階層 & RAP 契約の定義)          │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 💻 開発エージェント (Dev Agent)                                                         │
  │ • 設計書に基づき、最新 OO ABAP クラスおよび CDS View Entities を作成                    │
  │ • SELECT * を排除し、@ ホスト変数、インライン宣言、式を徹底活用                         │
  │ • sap.source.diagnose をリアルタイム実行してカーネル構文チェック、0 Warning/0 Error 達成│
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🧪 テストエージェント (Test Agent)                                                      │
  │ • sap.repository.where_used で影響を受ける全プログラムとオブジェクトをスキャン         │
  │ • 最新の ABAP Unit テストスイートを作成 (Test Double で DB と外部 IF を隔離)            │
  │ • Clean Core リリース API およびコード品質監査を実施、『品質テストおよび監査レポート』出力 │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │        100% Clean Core 準拠のクラウドレディな最終成果物     │
                 └─────────────────────────────────────────────────────────────┘
```

---

## 実現可能なコア機能

AI 対話内で本プロジェクトの MCP ツールを呼び出すことで、SAP GUI や Eclipse ADT を手動操作することなく、ABAP ライフサイクル全般を完結できます:

1. **システムプロファイリングと接続認識**: SAP カーネルリリース、システム種別、クライアント、タイムゾーン、および利用可能な ADT エンドポイントを即座に取得。
2. **多次元オブジェクト検索**: `PROG`（プログラム）、`CLAS`（クラス）、`INTF`（インターフェース）、`TABL`（テーブル）、`VIEW`（ビュー）、`DDLS`（CDS ビュー）、`DEVC`（パッケージ）などのワイルドカード精密・曖昧検索。
3. **ソースコード直接読み取りと AST 構造ナビゲーション**: アクティブなソースコードの可逆取得（行範囲ページネーション対応）、クラスメソッドの実装およびインクルード階層の閲覧。
4. **リアルタイム静的構文診断**: SAP カーネル構文チェッカー（SE38/ADT の構文チェックと同等）を実行し、エラー行、列、メッセージテキストを正確に特定。
5. **影響度分析と依存関係追跡**: ネイティブ Where-Used List 照会を実行し、特定フィールド、構造体、メソッド、汎用モジュールの全社的な呼び出し箇所を追跡。
6. **ビジネスレポートの超高速構築**: リアルタイムなテーブル構造メタデータと組み合わせて、高品質な CDS View または ALV IDA レポートコードを生成し構文検証。
7. **監査とコンプライアンス証跡照会**: システム変更ログ、移送依頼 (Transport Request)、変更タイムスタンプ、主要設定テーブルの安全な確認。
8. **テーブル間動的データ抽出と関係マッピング**: 複数テーブル間の主キー・外部キー整合性を解析し、データウェアハウスや後続分析用の正規化モデルを自動生成。
9. **自動運用と定期ジョブのオーケストレーション**: 定期自動化ツール（Codex Automations / スケジューラ）と連動し、インターフェース状態やバッチ処理の健全性を常時監視。
10. **オンデマンド動的機能拡張**: 必要に応じて SAP ADT の 50 種類以上の高度な機能（DDIC メタデータ読み取り、クイックフィックス、コードフォーマット、単体テスト実行など）を動的に検索・実行。

---

## AI 主導の Vibe Coding: 超高速開発とデプロイ・検証の一体化

### SAP ABAP における Vibe Coding とは？
従来の SAP ABAP 開発は頻繁なコンテキストスイッチを伴いました。開発者は SAP GUI (SE38/SE80) や Eclipse ADT、仕様書、ブラウザを絶えず往復し、手動でテーブルを検索し、OpenSQL を組み立て、構文チェック (Ctrl+F2) を押し、有効化 (Ctrl+F3) してテストを実行していました。

本プロジェクトのローカル MCP 連携を活用することで、開発者は AI コーディングアシスタント（Codex など）内で真の **Vibe Coding**（自然言語によるフロー状態でのコーディング）を体験できます:
- **完全な自然言語対話**: 「`Z07DRAUS` の出力形式を PDF に変更して、構文エラーがないかチェックして」
- **コンテキスト切り替えゼロ**: AI が自律的にテーブル構造を検索し、既存コードを読み取り、新しいロジックを作成して、SAP リモートコンパイラでリアルタイムに構文診断と結果検証を完結。
- **数分での要件具現化**: 何時間もかかっていたテーブル調査や試行錯誤が、単一のセッション内で「修正・デプロイ・検証」のクローズドループとして完了します。

---

### 一体型フィードバックワークフロー (Read -> Edit -> Diagnose -> Deploy -> Verify)

```text
[ ユーザーが自然言語で要件を提示 ]
         │
         ▼
[ 1. 意図解析とシステム環境認識 ] ──> sap.system.inspect を呼び出し
         │
         ▼
[ 2. テーブル検索とコンテキスト取得 ] ──> sap.ddic.read / sap.source.read を実行
         │
         ▼
[ 3. コードのリアルタイム生成と修正 ] ──> ABAP 7.58 の最新構文で生成
         │
         ▼
[ 4. リモート構文コンパイル診断 ]    ──> sap.source.diagnose を実行
         │
     ┌───┴────────────────┐
   警告・エラーあり      構文完全正常 (0 Error)
     │                    │
     ▼                    ▼
[ 5. 自律修復・補正 ]   [ 6. 制御された配備と有効化 ] ──> 書き込みツール ($TMP ホワイトリスト)
                          │
                          ▼
                       [ 7. 検証済み成果物の引き渡し ] ──> ユーザーへ報告
```

---

### 実際の Vibe Coding 対話型シナリオ体験

#### シナリオ: 特定レポートにデータ絞り込み条件を追加しオンライン検証を実施

**ユーザープロンプト**:
> 「テストパッケージ内のレポート `ZA4WEEKINC` を読み込んで、データ抽出部分に会社コード `BUKRS = 1000` の絞り込み条件を追加して。修正後のコードが SAP の構文チェックを通るかも確認してほしい。」

**AI がバックグラウンドで自律実行するプロセス**:
1. **ソースコードの自動取得**:
   `sap.source.read(systemId: "S4H100", objectName: "ZA4WEEKINC", objectType: "PROG")` を呼び出し、既存データフローを即座に把握。
2. **修正箇所の特定とパッチ生成**:
   `SELECT` 文を特定し、変数の型に合わせて `WHERE bukrs = 1000` 条件を付加。
3. **リモート構文診断と検証**:
   `sap.source.diagnose` を呼び出して修正内容を検証。警告が出た場合はミリ秒単位でコードを微調整し、コンパイラが `succeeded`、`warnings: []` を返すまで自動修復。
4. **最終成果物の提示**:
   修正差分と SAP コンパイラの検証通過証明を提示（全プロセス 30 秒以内で完了）。

---

## 実践的な活用ユースケースとワークフロー

### ケース 1: カスタムレポート・プログラムの調査とソースレビュー
**ユースケース**: 本番または検証環境でアドオンレポートの挙動に問題が発生し、SAP GUI を起動せずにプログラムロジックを迅速に調査したい場合。

- **AI ツール呼び出しフロー**:
  1. `sap.repository.search` で対象プログラムを検索:
     ```json
     {
       "systemId": "S4H100",
       "pattern": "Z*",
       "objectTypes": ["PROG"],
       "limit": 5
     }
     ```
  2. `ZA4WEEKINC` などを特定後、`sap.source.read` で主要ロジックを読み取り:
     ```json
     {
       "systemId": "S4H100",
       "objectName": "ZA4WEEKINC",
       "objectType": "PROG",
       "startLine": 1,
       "lineCount": 50
     }
     ```
- **実務上の価値**: AI が対話内で直接ソースを解析し、データフローの整理や潜在的なロジック欠陥を指摘します。

---

### ケース 2: オブジェクト影響度分析 (Where-Used 被参照追跡)
**ユースケース**: グローバル構造体やメソッド、汎用モジュールのシグネチャを変更する前に、影響を受ける呼び出し元範囲を評価したい場合。

- **AI ツール呼び出しフロー**:
  `sap.repository.where_used` を実行:
  ```json
  {
    "systemId": "S4H100",
    "objectName": "ZMY_DATA_STRUCT",
    "objectType": "TABL",
    "limit": 20
  }
  ```
- **実務上の価値**: 依存するすべての Reports、Class Methods、Function Modules を数秒で返却し、AI が影響範囲一覧と回帰テスト計画を作成します。

---

### ケース 3: ABAP リアルタイム構文診断と迅速な自動修復
**ユースケース**: 作成・編集した ABAP コードが対象システムでコンパイル可能か確認し、廃止構文や型の不一致を解消したい場合。

- **AI ツール呼び出しフロー**:
  `sap.source.diagnose` を実行:
  ```json
  {
    "systemId": "S4H100",
    "fileUri": "adt://s4h100/sap/bc/adt/programs/programs/za4weekinc"
  }
  ```
- **実務上の価値**: SAP コンパイラから正確なエラー行・列番号およびメッセージを取得し、AI が文脈に合わせて修正パッチを即時提案します。

---

### ケース 4: データディクショナリ (DDIC) のオンデマンド探索と読み取り
**ユースケース**: 標準テーブル（`MARA`、`VBAK` など）やカスタムテーブルの項目定義、主キー、外部キー関係を確認したい場合。

- **AI ツール呼び出しフロー**:
  1. `sap.capability.search` でツールを検索:
     ```json
     { "query": "table" }
     ```
     `sap.ddic.read` がヒット。
  2. パラメータスキーマの確認:
     ```json
     { "name": "sap.ddic.read" }
     ```
  3. 読み取りを実行:
     ```json
     {
       "name": "sap.ddic.read",
       "schemaHash": "<hash>",
       "arguments": {
         "systemId": "S4H100",
         "objectName": "VBAK",
         "objectType": "TABL"
       }
     }
     ```
- **実務上の価値**: テーブル定義を即時取得できるため、AI がフィールド名のハルシネーションを起こさず、型安全な OpenSQL を記述できます。

---

### ケース 5: 開発支援とコード自動補完 (Auto-Complete)
**ユースケース**: 標準クラスや BAPI を呼び出す際、正確なパラメータ名と型を確認したい場合。

- **AI ツール呼び出しフロー**:
  `sap.semantic.complete` や `sap.semantic.definition` に行・列番号と URI を指定して実行。
- **実務上の価値**: `IMPORTING`、`EXPORTING`、`CHANGING` パラメータを正確に補完し、スペルミスによる手戻りを防止します。

---

### ケース 6: AI 支援によるビジネスレポートの迅速な構築 (ALV / CDS View)
**ユースケース**: 受注出荷状況分析レポートなど、緊急の集計レポート要件を短時間で実装したい場合。

- **AI ツール呼び出しフロー**:
  1. **メタデータ取得**: AI が `sap.ddic.read` で `VBAK`、`VBAP`、`VBUK` の構造を取得。
  2. **モデル生成**: リレーションシップや UI アノテーションを含む最新の CDS View Entity コードを自動生成:
     ```abap
     @AbapCatalog.sqlViewName: Z_VBAK_REP
     define view Z_I_SalesPerformance as select from vbak
       association [1..*] to vbap as _Item on vbak.vbeln = _Item.vbeln { ... }
     ```
  3. **リアルタイム検証**: `sap.source.diagnose` で構文適合性を即座にチェック。
- **実務上の価値**: 項目探しや構文修正に費やしていた時間を 1 分以内に短縮します。

---

### ケース 7: コンプライアンス審査と監査証跡データ照会
**ユースケース**: 監査部門からアドオンプログラムの変更履歴や権限チェックの実装状況の調査を求められた場合。

- **AI ツール呼び出しフロー**:
  1. **変更監査**: `sap.repository.inspect` で作成者 (`createdBy`)、更新者 (`changedBy`)、タイムスタンプ、移送依頼番号を確認。
  2. **重要コード検索**: `sap.source.search` で全 `Z*` コードを横断し、権限チェック構文を検索:
     ```json
     {
       "systemId": "S4H100",
       "searchTerm": "AUTHORITY-CHECK",
       "objectName": "Z*"
     }
     ```
  3. **監査レポート作成**: AI が監査チェックリストと権限チェック網羅率レポートを作成。
- **実務上の価値**: ブラックボックス化のリスクを排除し、コードガバナンスを自動化します。

---

### ケース 8: テーブル間動的データ抽出と軽量な統合分析
**ユースケース**: 外部システムやダッシュボード連携のために、品目マスタ（`MARA`、`MARC`、`MARD`）の関連構造と抽出定義が必要な場合。

- **AI ツール呼び出しフロー**:
  1. `sap.ddic.read` で主キー・外部キーの整合性関係を解析。
  2. 読み取り制御環境下でサンプルデータの構造を検証。
  3. 後続のデータパイプラインスクリプト（Python Pandas、Spark、OData コンシューマ）を生成。
- **実務上の価値**: SAP 固有の項目略語の誤解によるデータ連携の不具合を防止します。

---

### ケース 9: 高頻度定期ジョブのオーケストレーションと自動巡回点検
**ユースケース**: 重要インターフェースやバッチ処理、ADT 接続の健全性を定期的に自動点検したい場合。

- **AI ツール呼び出しフロー**:
  1. 自動化スケジューラ（Codex Automations など）と連動し、`sap.system.inspect` でレイテンシとハートビートを定期監視。
  2. `sap.source.diagnose` で基幹パッケージにコンパイルエラーが混入していないか巡回点検。
  3. 異常検知時に担当者へアラート通知を送信。
- **実務上の価値**: 定常的な手動点検を 24 時間体制の自動防御ネットへと転換します。

---

## MCP アーキテクチャとツールセット

本プロジェクトは `@coaspe/sap-abap-mcp@1.6.0` をベースとし、`--preset adaptive` モードを採用しています。

### アダプティブプリセット (Adaptive Preset)
デフォルトで以下の 17 個のコアツールを公開し、システム点検、リポジトリ検索、AST 構造解析、構文診断をサポートします:

| カテゴリ | MCP ツール名 | 機能説明 |
| :--- | :--- | :--- |
| **システム点検** | `sap.system.list` | 設定済み SAP システム ID および認証情報ステータスの一覧 |
| | `sap.system.inspect` | システムバージョン、クライアント、タイムゾーン、コンポーネント情報取得 |
| | `sap.system.capabilities` | システムでサポート・認可されている機能セットの確認 |
| **リポジトリ・オブジェクト** | `sap.repository.search` | 名称パターンおよびタイプによる ABAP リポジトリオブジェクト検索 |
| | `sap.repository.resolve` | オブジェクトを正規の ADT リソース URI に解決 |
| | `sap.repository.inspect` | メタデータ、ADT 階層構造、子ノードの参照 |
| | `sap.repository.where_used` | ABAP オブジェクトの被参照関係 (Where-Used) を照会 |
| **ソースコード・構文** | `sap.source.read` | 指定範囲のアクティブな ABAP/CDS ソースコードを読み取り |
| | `sap.source.diagnose` | リアルタイムな SAP 構文診断 (Syntax Check) の実行 |
| | `sap.source.search` | ABAP ソース内の文字列または正規表現検索 |
| **セマンティクス・補全** | `sap.semantic.complete` | ABAP コード自動補全の候補および詳細情報の取得 |
| | `sap.semantic.definition` | 定義および実装箇所へのジャンプ解析 |
| **動的能力呼び出し** | `sap.capability.search` | デフォルト一覧外の 50 種類以上の SAP 拡張機能ライブラリを検索 |
| | `sap.capability.describe` | 拡張機能のパラメータスキーマおよびハッシュ検証値を取得 |
| | `sap.capability.invoke_read` | 読み取り専用拡張機能の呼び出し |
| | `sap.capability.invoke_write` | 制御された書き込み機能の呼び出し |
| | `sap.capability.invoke_destructive` | 破壊的変更機能の呼び出し（権限制御あり） |

### オンデマンド動的能力探索 (On-Demand Capabilities)
頻度の低い機能（DDIC テーブル構造取得 `sap.ddic.read`、移送依頼解析など）は、`sap.capability.search` ➔ `sap.capability.describe` ➔ `sap.capability.invoke_*` の順序でオンデマンドにロードされ、プロンプトのコンテキスト浪費を防ぎます。

---

## クイックスタート (Quick Start)

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 接続診断とヘルスチェック
ローカル設定ファイルの妥当性を確認し、ADT ディスカバリエンドポイント (`/sap/bc/adt/discovery`) への疎通をテストします:
```bash
npm run mcp:doctor
```
> 出力に `ok: true`、Release (`758`)、Client (`100`) が表示されれば正常です。

### 3. プロトコルおよび機能スモークテスト
MCP ハンドシェイク、ツール公開検証、システム情報取得、オブジェクト検索を含む E2E テストを実行します:
```bash
npm run mcp:smoke
```

### 4. コード整合性チェック
スクリプトの構文検証およびスモークテストを一括実行します:
```bash
npm run check
```

### 5. MCP サービスの起動
Stdio モードで MCP サーバーを直接起動します（外部ツール連携またはデバッグ用）:
```bash
npm run mcp:start
```

---

## クライアント統合設定 (Codex)

`.codex/config.toml` にプロジェクト固有の MCP 設定が含まれており、新しい Codex タスク作成時に `sap_abap` ツールセットが自動的にロードされます:

```toml
[mcp_servers.sap_abap]
command = "/opt/homebrew/bin/node"
args = [
  "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop/scripts/sap-mcp-runner.mjs",
  "serve",
  "--profile",
  "S4H100",
  "--preset",
  "adaptive",
  "--audit-log",
  "stderr",
]
cwd = "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop"
startup_timeout_sec = 120
tool_timeout_sec = 180
```

設定テンプレートファイルは `config/codex-mcp.toml.example` に用意されています。

---

## セキュリティとアクセス制御

1. **認証情報の保護**
   - 実際のパスワードは Git 管理外の `SAP_CONNECTION.local.md` にのみ保存されます。
   - マスキング済みのサンプルテンプレートとして `SAP_CONNECTION.example.md` を提供しています。
   - 実行時設定ディレクトリ `.sap-abap-mcp/` も Git から除外されています。
2. **書き込み権限の隔離**
   - デフォルトではローカルテストパッケージ `$TMP` に対する書き込みのみが許可されます。
   - 書き込み可能パッケージを追加する場合は、`SAP_CONNECTION.local.md` の `Writable packages` を編集します。
3. **データ照会制御**
   - 任意の SAP SQL クエリ実行機能はデフォルトで無効化されています (`Allow data queries: false`)。
4. **依存関係の固定**
   - `@coaspe/sap-abap-mcp@1.6.0` および `@modelcontextprotocol/sdk@1.30.0` のバージョンを固定し、互換性破損を防いでいます。

---

## トラブルシューティング (FAQ)

### Q1: `mcp:doctor` 実行時に TLS/SSL 警告が表示されます。
警告メッセージ:
```text
Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure...
```
**原因と対応**: SAP インスタンスが自己署名証明書を使用しているため、スクリプトの子プロセス限定で HTTPS 通信を許可しています。正式な CA 証明書を導入した後は、設定で厳格検証モードに戻すことができます。

### Q2: なぜ HTTP 50099 ポートを使用できないのですか？
SAP インスタンスのセキュリティポリシーにより、ログオンチケット (Logon Ticket) の発行が HTTPS (`44300`) に限定されています。HTTP ポートはパスワード認証を拒否します。

### Q3: 設定を変更したのに Codex に反映されません。
Codex はタスク開始時に `.codex/config.toml` を読み込みます。設定を変更した場合は、タスクを新しく立ち上げるかセッションを再起動してください。
