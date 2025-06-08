#!/bin/bash

# Claude AIエイリアスセットアップスクリプト
# このスクリプトは便利なClaude CLIエイリアスを設定します

# 色付き出力用の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🤖 Claude AIエイリアスセットアップ${NC}"
echo ""

# シェルの検出
SHELL_RC=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
    echo -e "${GREEN}✓ Zsh検出${NC}"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
    echo -e "${GREEN}✓ Bash検出${NC}"
else
    echo -e "${YELLOW}⚠️  サポートされていないシェルです。手動で設定してください。${NC}"
    exit 1
fi

# エイリアスの定義
ALIASES='
# ========== Claude AI エイリアス ==========
# Claude対話モード
alias cl="claude"

# 現在のファイルをレビュー（引数でファイルパスを指定）
alias crf="claude --print \"このコードをレビューしてください。バグ、パフォーマンス問題、可読性の観点から改善点を指摘してください: \$(cat \$1)\""

# git diffをレビュー
alias crd="claude --print \"以下の変更をレビューしてください。バグや問題がないか確認し、改善案があれば提示してください: \$(git diff)\""

# ステージング済みの変更をレビュー
alias crds="claude --print \"以下のステージング済み変更をレビューしてください: \$(git diff --cached)\""

# 特定のコミットをレビュー（引数でコミットハッシュを指定）
alias crc="claude --print \"以下のコミットをレビューしてください: \$(git show \$1)\""

# Reactコンポーネント生成（引数でコンポーネント名を指定）
alias cgc="claude --print \"React/TypeScriptコンポーネントを生成してください。コンポーネント名: \$1。WCAG2.2準拠のアクセシブルな実装にしてください。\""

# テスト生成（引数でファイルパスを指定）
alias cgt="claude --print \"このコードのJest/React Testing Libraryテストを生成してください: \$(cat \$1)\""

# コードリファクタリング提案（引数でファイルパスを指定）
alias crr="claude --print \"このコードのリファクタリング案を提示してください。可読性、保守性、パフォーマンスの観点から改善してください: \$(cat \$1)\""

# プロジェクト全体の分析
alias cpa="claude --print \"このプロジェクトの構造を分析してください: \$(find . -type f -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" -o -name \"*.jsx\" | head -50)\""

# エラー解決支援（引数でエラーメッセージを指定）
alias cfe="claude --print \"このエラーの解決方法を教えてください: \$*\""

# コードドキュメント生成（引数でファイルパスを指定）
alias cgd="claude --print \"このコードのJSDocドキュメントを生成してください: \$(cat \$1)\""

# パフォーマンス分析（引数でファイルパスを指定）
alias cperf="claude --print \"このコードのパフォーマンスを分析し、最適化案を提示してください: \$(cat \$1)\""

# セキュリティレビュー（引数でファイルパスを指定）
alias csec="claude --print \"このコードのセキュリティ問題をチェックしてください: \$(cat \$1)\""

# APIキーのチェック
alias cck="if [ -z \"\$ANTHROPIC_API_KEY\" ]; then echo \"❌ ANTHROPIC_API_KEYが設定されていません\"; else echo \"✅ ANTHROPIC_API_KEYが設定されています\"; fi"
# ========== Claude AI エイリアス終了 ==========
'

# 既存のエイリアスをバックアップ
if grep -q "Claude AI エイリアス" "$SHELL_RC" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  既存のClaude AIエイリアスが検出されました。${NC}"
    echo -n "上書きしますか？ (y/N): "
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}キャンセルしました。${NC}"
        exit 0
    fi
    # 既存のエイリアスを削除
    sed -i.bak '/# ========== Claude AI エイリアス ==========/,/# ========== Claude AI エイリアス終了 ==========/d' "$SHELL_RC"
fi

# エイリアスを追加
echo "$ALIASES" >> "$SHELL_RC"

echo -e "${GREEN}✅ エイリアスが追加されました！${NC}"
echo ""
echo -e "${BLUE}使用可能なエイリアス:${NC}"
echo "  cl        - Claude対話モード"
echo "  crf <file> - ファイルをレビュー"
echo "  crd       - git diffをレビュー"
echo "  crds      - ステージング済み変更をレビュー"
echo "  crc <hash> - 特定のコミットをレビュー"
echo "  cgc <name> - Reactコンポーネント生成"
echo "  cgt <file> - テスト生成"
echo "  crr <file> - リファクタリング提案"
echo "  cpa       - プロジェクト分析"
echo "  cfe <msg> - エラー解決支援"
echo "  cgd <file> - ドキュメント生成"
echo "  cperf <file> - パフォーマンス分析"
echo "  csec <file> - セキュリティレビュー"
echo "  cck       - APIキーチェック"
echo ""
echo -e "${YELLOW}📝 エイリアスを有効にするには、以下のコマンドを実行してください:${NC}"
echo "  source $SHELL_RC"
echo ""
echo -e "${BLUE}または、新しいターミナルセッションを開始してください。${NC}" 