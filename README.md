This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Claude AI Integration

このプロジェクトにはClaude AIが統合されており、コミット時の自動コードレビューやVSCodeタスクによるAI支援機能が利用できます。

### セットアップ

#### 1. Claude CLIのインストール

```bash
npm install -g @anthropic-ai/claude-code
```

#### 2. APIキーの設定

[Anthropic Console](https://console.anthropic.com)でAPIキーを取得し、環境変数に設定します：

```bash
export ANTHROPIC_API_KEY='your-api-key'
```

永続化するには、`~/.zshrc`または`~/.bashrc`に追加してください。

#### 3. Pre-commitフックの有効化

pre-commitフックは既に設定されています。コミット時に自動的にTypeScript/JavaScriptファイルのレビューが実行されます。

#### 4. シェルエイリアスの設定（オプション）

便利なClaude CLIエイリアスを設定するには：

```bash
./setup-claude-aliases.sh
source ~/.zshrc  # または source ~/.bashrc
```

### 機能

#### 自動コードレビュー

`git commit`実行時に、ステージングされたTypeScript/JavaScriptファイルが自動的にレビューされます。レビュー内容：

- バグの有無
- 既存コンポーネントの再利用チェック
- コードの可読性
- テストの必要性
- WCAG2.2準拠（UI変更時）

#### VSCodeタスク

VSCodeのコマンドパレット（Cmd/Ctrl + Shift + P）から「Run Task」を選択して、以下のタスクを実行できます：

- **Claude: 現在のファイルをレビュー** - 開いているファイルのコードレビュー
- **Claude: Git Diffをレビュー** - 未コミットの変更をレビュー
- **Claude: ステージング済み変更をレビュー** - コミット前の最終チェック
- **Claude: 現在のファイルのテストを生成** - Jestテストの自動生成
- **Claude: Reactコンポーネントを生成** - アクセシブルなコンポーネントの生成
- **Claude: エラーを解決** - エラーメッセージから解決策を提案
- **Claude: 現在のファイルをリファクタリング** - コードの改善提案
- **Claude: セキュリティレビュー** - セキュリティ問題のチェック
- **Claude: パフォーマンス分析** - パフォーマンス最適化の提案
- **Claude: JSDocコメントを生成** - ドキュメントの自動生成

#### シェルエイリアス（設定後）

- `cl` - Claude対話モード
- `crf <file>` - ファイルをレビュー
- `crd` - git diffをレビュー
- `crds` - ステージング済み変更をレビュー
- `crc <hash>` - 特定のコミットをレビュー
- `cgc <name>` - Reactコンポーネント生成
- `cgt <file>` - テスト生成
- `crr <file>` - リファクタリング提案
- `cpa` - プロジェクト分析
- `cfe <msg>` - エラー解決支援
- `cgd <file>` - ドキュメント生成
- `cperf <file>` - パフォーマンス分析
- `csec <file>` - セキュリティレビュー
- `cck` - APIキーチェック

### トラブルシューティング

問題が発生した場合は、診断スクリプトを実行してください：

```bash
./debug-claude-setup.sh
```

このスクリプトは以下をチェックし、可能な限り自動修正します：

- Node.jsバージョン
- Claude CLIのインストール状態
- APIキーの設定
- Pre-commitフックの設定
- 実行権限
- .gitignoreの設定
- VSCodeタスクの設定
- シェルエイリアスの設定

### 注意事項

- コードレビューをスキップしたい場合は、`git commit --no-verify`を使用してください
- `export CLAUDE_DEBUG=true`を設定すると、pre-commitフックのデバッグモードが有効になります
- レビューで推奨事項のみが指摘された場合、自動的に`todo.md`に追記されます
