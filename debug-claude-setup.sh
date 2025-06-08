#!/bin/bash

# Claude AI設定診断スクリプト
# このスクリプトはClaude AIの設定問題を診断し、可能な限り修正します

# 色付き出力用の定義
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Claude AI設定診断ツール${NC}"
echo "=================================="
echo ""

# 診断結果を保存する変数
ISSUES_FOUND=0
ISSUES_FIXED=0

# ログファイル
LOG_FILE="claude-debug.log"
echo "診断開始: $(date)" > "$LOG_FILE"

# 1. Node.jsのバージョンチェック
echo -e "${BLUE}1. Node.jsバージョンチェック...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "  Node.js バージョン: $NODE_VERSION" | tee -a "$LOG_FILE"
    
    # バージョン番号を取得（v18.0.0 -> 18）
    MAJOR_VERSION=$(echo "$NODE_VERSION" | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "  ${RED}❌ Node.js 18以上が必要です${NC}" | tee -a "$LOG_FILE"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        echo -e "  ${YELLOW}解決方法: Node.jsをアップグレードしてください${NC}"
    else
        echo -e "  ${GREEN}✓ Node.jsバージョンOK${NC}" | tee -a "$LOG_FILE"
    fi
else
    echo -e "  ${RED}❌ Node.jsがインストールされていません${NC}" | tee -a "$LOG_FILE"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    echo -e "  ${YELLOW}解決方法: https://nodejs.org からNode.js 18以上をインストールしてください${NC}"
fi
echo ""

# 2. Claude CLIのインストール確認
echo -e "${BLUE}2. Claude CLIインストール確認...${NC}"
if command -v claude &> /dev/null; then
    echo -e "  ${GREEN}✓ Claude CLIがインストールされています${NC}" | tee -a "$LOG_FILE"
    CLAUDE_PATH=$(which claude)
    echo "  パス: $CLAUDE_PATH" | tee -a "$LOG_FILE"
else
    echo -e "  ${RED}❌ Claude CLIがインストールされていません${NC}" | tee -a "$LOG_FILE"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    
    echo -e "  ${YELLOW}Claude CLIをインストールしますか？ (Y/n)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Nn]$ ]]; then
        echo "  インストール中..."
        if npm install -g @anthropic-ai/claude-code >> "$LOG_FILE" 2>&1; then
            echo -e "  ${GREEN}✓ Claude CLIをインストールしました${NC}"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
        else
            echo -e "  ${RED}❌ インストールに失敗しました${NC}"
            echo "  詳細はログファイルを確認してください: $LOG_FILE"
        fi
    fi
fi
echo ""

# 3. 環境変数ANTHROPIC_API_KEYの確認
echo -e "${BLUE}3. APIキー設定確認...${NC}"
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo -e "  ${RED}❌ ANTHROPIC_API_KEYが設定されていません${NC}" | tee -a "$LOG_FILE"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    
    echo -e "  ${YELLOW}解決方法:${NC}"
    echo "  1. Anthropic APIキーを https://console.anthropic.com で取得"
    echo "  2. 以下のコマンドで設定:"
    echo "     export ANTHROPIC_API_KEY='your-api-key'"
    echo "  3. 永続化するには ~/.zshrc または ~/.bashrc に追加"
else
    echo -e "  ${GREEN}✓ ANTHROPIC_API_KEYが設定されています${NC}" | tee -a "$LOG_FILE"
    # APIキーの一部をマスクして表示
    MASKED_KEY="${ANTHROPIC_API_KEY:0:10}...${ANTHROPIC_API_KEY: -4}"
    echo "  APIキー: $MASKED_KEY" | tee -a "$LOG_FILE"
fi
echo ""

# 4. pre-commitフックの確認
echo -e "${BLUE}4. pre-commitフック確認...${NC}"
HOOK_PATH=".git/hooks/pre-commit"
if [ -f "$HOOK_PATH" ]; then
    echo -e "  ${GREEN}✓ pre-commitフックが存在します${NC}" | tee -a "$LOG_FILE"
    
    # 実行権限の確認
    if [ -x "$HOOK_PATH" ]; then
        echo -e "  ${GREEN}✓ 実行権限があります${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "  ${RED}❌ 実行権限がありません${NC}" | tee -a "$LOG_FILE"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        
        echo -e "  ${YELLOW}実行権限を付与しますか？ (Y/n)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Nn]$ ]]; then
            chmod +x "$HOOK_PATH"
            echo -e "  ${GREEN}✓ 実行権限を付与しました${NC}"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
        fi
    fi
    
    # Claude関連の記述があるか確認
    if grep -q "claude" "$HOOK_PATH"; then
        echo -e "  ${GREEN}✓ Claude AIレビューが設定されています${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "  ${YELLOW}⚠️  Claude AIレビューの記述が見つかりません${NC}" | tee -a "$LOG_FILE"
    fi
else
    echo -e "  ${RED}❌ pre-commitフックが存在しません${NC}" | tee -a "$LOG_FILE"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
    echo -e "  ${YELLOW}解決方法: プロジェクトルートで以下を実行してください:${NC}"
    echo "  ./setup-claude-hooks.sh"
fi
echo ""

# 5. gitignoreの確認
echo -e "${BLUE}5. .gitignore確認...${NC}"
if [ -f ".gitignore" ]; then
    MISSING_PATTERNS=""
    
    if ! grep -q "claude-tmp" ".gitignore"; then
        MISSING_PATTERNS="*.claude-tmp"
    fi
    
    if ! grep -q "claude-debug.log" ".gitignore"; then
        if [ -n "$MISSING_PATTERNS" ]; then
            MISSING_PATTERNS="$MISSING_PATTERNS, claude-debug.log"
        else
            MISSING_PATTERNS="claude-debug.log"
        fi
    fi
    
    if [ -n "$MISSING_PATTERNS" ]; then
        echo -e "  ${YELLOW}⚠️  以下のパターンが.gitignoreにありません: $MISSING_PATTERNS${NC}" | tee -a "$LOG_FILE"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
        
        echo -e "  ${YELLOW}.gitignoreに追加しますか？ (Y/n)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Nn]$ ]]; then
            echo "" >> .gitignore
            echo "# Claude AI temporary files" >> .gitignore
            echo "*.claude-tmp" >> .gitignore
            echo "claude-debug.log" >> .gitignore
            echo -e "  ${GREEN}✓ .gitignoreを更新しました${NC}"
            ISSUES_FIXED=$((ISSUES_FIXED + 1))
        fi
    else
        echo -e "  ${GREEN}✓ .gitignoreが適切に設定されています${NC}" | tee -a "$LOG_FILE"
    fi
else
    echo -e "  ${YELLOW}⚠️  .gitignoreファイルが存在しません${NC}" | tee -a "$LOG_FILE"
fi
echo ""

# 6. VSCode設定の確認
echo -e "${BLUE}6. VSCode設定確認...${NC}"
if [ -f ".vscode/tasks.json" ]; then
    echo -e "  ${GREEN}✓ VSCodeタスクが設定されています${NC}" | tee -a "$LOG_FILE"
else
    echo -e "  ${YELLOW}⚠️  VSCodeタスクが設定されていません${NC}" | tee -a "$LOG_FILE"
    echo "  VSCodeでClaude AIを使用する場合は、.vscode/tasks.jsonを設定してください"
fi
echo ""

# 7. シェルエイリアスの確認
echo -e "${BLUE}7. シェルエイリアス確認...${NC}"
SHELL_RC=""
if [ -n "$ZSH_VERSION" ]; then
    SHELL_RC="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_RC="$HOME/.bashrc"
fi

if [ -n "$SHELL_RC" ] && [ -f "$SHELL_RC" ]; then
    if grep -q "Claude AI エイリアス" "$SHELL_RC"; then
        echo -e "  ${GREEN}✓ Claude AIエイリアスが設定されています${NC}" | tee -a "$LOG_FILE"
    else
        echo -e "  ${YELLOW}⚠️  Claude AIエイリアスが設定されていません${NC}" | tee -a "$LOG_FILE"
        echo "  エイリアスを設定するには: ./setup-claude-aliases.sh"
    fi
else
    echo -e "  ${YELLOW}⚠️  シェル設定ファイルが見つかりません${NC}" | tee -a "$LOG_FILE"
fi
echo ""

# 診断結果のサマリー
echo -e "${BLUE}=================================="
echo -e "診断結果サマリー${NC}"
echo -e "=================================="

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ すべての設定が正常です！${NC}"
else
    echo -e "${YELLOW}⚠️  $ISSUES_FOUND 個の問題が見つかりました${NC}"
    
    if [ $ISSUES_FIXED -gt 0 ]; then
        echo -e "${GREEN}✓ $ISSUES_FIXED 個の問題を修正しました${NC}"
    fi
    
    REMAINING=$((ISSUES_FOUND - ISSUES_FIXED))
    if [ $REMAINING -gt 0 ]; then
        echo -e "${RED}❌ $REMAINING 個の問題が未解決です${NC}"
        echo ""
        echo -e "${YELLOW}未解決の問題については、上記の解決方法を参照してください${NC}"
    fi
fi

echo ""
echo -e "${BLUE}詳細なログは以下に保存されています: $LOG_FILE${NC}"
echo ""

# テスト実行
echo -e "${BLUE}Claude CLIのテストを実行しますか？ (y/N)${NC}"
read -r response
if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}テスト実行中...${NC}"
    if claude --print "Hello, Claude! システムが正常に動作していることを確認してください。" >> "$LOG_FILE" 2>&1; then
        echo -e "${GREEN}✅ Claude CLIが正常に動作しています！${NC}"
    else
        echo -e "${RED}❌ Claude CLIの実行に失敗しました${NC}"
        echo "詳細はログファイルを確認してください: $LOG_FILE"
    fi
fi

echo ""
echo -e "${GREEN}診断完了: $(date)${NC}" | tee -a "$LOG_FILE" 