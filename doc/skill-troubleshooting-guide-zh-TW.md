# Skill 問題排除指南

全面的 Claude Code Skills 問題診斷與解決方案。

## 目錄

- [Skill 無法被載入](#skill-無法被載入)
- [Skill 無法被觸發](#skill-無法被觸發)
- [Frontmatter 配置問題](#frontmatter-配置問題)
- [工具權限問題](#工具權限問題)
- [Skill 執行錯誤](#skill-執行錯誤)
- [檔案結構問題](#檔案結構問題)
- [診斷工具與技巧](#診斷工具與技巧)

---

## Skill 無法被載入

### 問題：執行 `/context` 時看不到我的 Skill

#### 診斷步驟

**步驟 1：確認 Skill 位置**

```bash
# 檢查個人 skills 目錄
ls -la ~/.claude/skills/

# 檢查專案 skills 目錄
ls -la ./.claude/skills/
```

**預期結果：**
```
~/.claude/skills/
├── my-skill/
│   └── SKILL.md
└── another-skill/
    └── SKILL.md
```

**步驟 2：驗證 SKILL.md 存在**

```bash
find ~/.claude/skills/ -name "SKILL.md"
```

**步驟 3：檢查檔案內容格式**

```bash
head -20 ~/.claude/skills/my-skill/SKILL.md
```

#### 常見原因與解決方案

| 問題 | 原因 | 解決方案 |
|------|------|----------|
| Skill 不在列表中 | 位置錯誤 | 移動到 `~/.claude/skills/[skill-name]/SKILL.md` |
| 在 "Excluded skills" | 超過字元預算 | 縮短 SKILL.md，將詳細文檔移到其他檔案 |
| YAML 解析失敗 | Frontmatter 語法錯誤 | 檢查 YAML 語法（見下方） |
| Skill 目錄名稱錯誤 | 使用了大寫或空格 | 重新命名為 `lowercase-with-hyphens` |

#### 解決方案：正確的目錄結構

```bash
# ❌ 錯誤
~/.claude/SKILL.md                      # 缺少 skills/ 和子目錄
~/.claude/skills/SKILL.md               # 缺少 skill 名稱子目錄
~/.claude/skills/My Skill/SKILL.md      # 目錄名有空格和大寫

# ✅ 正確
~/.claude/skills/my-skill/SKILL.md      # 個人 skill
./.claude/skills/project-skill/SKILL.md # 專案 skill
```

---

## Skill 無法被觸發

### 問題：Skill 已載入但 Claude 不會自動使用

#### 診斷步驟

**步驟 1：檢查 Skill 是否被載入**

```bash
/context
```

確認：
- ✅ Skill description 出現在輸出中
- ✅ 不在 "Excluded skills" 列表

**步驟 2：檢查調用設定**

```bash
cat ~/.claude/skills/my-skill/SKILL.md | head -15
```

檢查 frontmatter：
```yaml
---
name: my-skill
disable-model-invocation: true  # ⚠️ 如果是 true，只能手動 /my-skill 呼叫
user-invocable: false           # ⚠️ 如果是 false，你不能手動呼叫
---
```

**步驟 3：測試直接呼叫**

```bash
/my-skill
```

如果直接呼叫有效但自動觸發無效 → Description 問題

#### 常見原因與解決方案

**原因 1：Description 太籠統**

```yaml
# ❌ 問題：任何討論都可能觸發
description: Help with code

# ✅ 解決：明確使用場景
description: Refactor code following SOLID principles. Use when user explicitly asks to "refactor" or "improve code structure"
```

**原因 2：Description 太簡短，缺少關鍵字**

```yaml
# ❌ 問題：Claude 不知道何時用
description: Deploy app

# ✅ 解決：包含關鍵字和場景
description: Deploy application to production. Use when tests pass and ready to release. Keywords: deploy, push to prod, go live, release
```

**原因 3：設定了 `disable-model-invocation: true`**

```yaml
# 這個設定表示「只能手動呼叫」
---
name: deploy-prod
disable-model-invocation: true  # Claude 不會自動使用
---

# 解決方案：移除這行（如果你想要自動觸發）
---
name: deploy-prod
description: Deploy to production. Use when ready to release
---
```

**原因 4：與其他 Skill 的關鍵字衝突**

```yaml
# ❌ 問題：兩個 skill 都用 "review"
skill-a: description: Review code
skill-b: description: Review docs

# ✅ 解決：使用更具體的關鍵字
skill-a: description: Review source code for bugs. Keywords: code review, PR review, code quality
skill-b: description: Review documentation clarity. Keywords: docs review, documentation check, readme review
```

#### 改善 Description 的清單

- [ ] 包含 3-5 個核心關鍵字
- [ ] 描述使用時機（"Use when..."）
- [ ] 提供範例用戶語句（"like '...'", "when user says '...'"）
- [ ] 包含同義詞
- [ ] 使用動作動詞（create, fix, deploy, review）
- [ ] 長度適中（100-300 字元）

---

## Frontmatter 配置問題

### 問題：YAML 解析錯誤或 Skill 行為異常

#### 診斷：驗證 YAML 語法

```bash
# 使用 Python 驗證 YAML
python3 -c "
import yaml
with open('~/.claude/skills/my-skill/SKILL.md'.replace('~', '$HOME')) as f:
    content = f.read()
    frontmatter = content.split('---')[1]
    yaml.safe_load(frontmatter)
print('YAML is valid!')
"
```

#### 常見錯誤 1：欄位名稱拼錯

```yaml
# ❌ 錯誤
---
name: my-skill
descrption: Fix bugs        # ❌ 拼錯了（description）
alowed-tools: Read, Edit    # ❌ 拼錯了（allowed-tools）
---

# ✅ 正確
---
name: my-skill
description: Fix bugs and create PR
allowed-tools: Read, Edit, Bash(git *)
---
```

#### 常見錯誤 2：縮排錯誤

```yaml
# ❌ 錯誤：Tab 和空格混用
---
name: my-skill
description: |
	Line 1          # ❌ 使用 Tab
  Line 2            # ❌ 使用空格
---

# ✅ 正確：統一使用 2 個空格
---
name: my-skill
description: |
  Line 1
  Line 2
  Line 3
---
```

#### 常見錯誤 3：Skill 名稱格式錯誤

```yaml
# ❌ 錯誤
name: My Skill           # ❌ 有空格和大寫
name: my_skill           # ❌ 使用底線
name: mySkill            # ❌ 駝峰式命名
name: my-very-long-skill-name-that-exceeds-the-maximum-allowed-length  # ❌ 超過 64 字元

# ✅ 正確
name: my-skill           # ✅ 小寫 + 連字號
name: api-helper         # ✅ 簡短有意義
name: fix-ts-errors      # ✅ 清楚描述功能
```

#### 常見錯誤 4：allowed-tools 語法錯誤

```yaml
# ❌ 錯誤
allowed-tools: bash, read, grep        # ❌ 小寫
allowed-tools: Bash(npm*)              # ❌ 缺少空格
allowed-tools: "Read", "Edit"          # ❌ 不需要引號
allowed-tools: [Read, Edit]            # ❌ 不需要陣列語法

# ✅ 正確
allowed-tools: Read, Edit, Bash(npm *)
allowed-tools: Bash(git commit *), Bash(git push *)
allowed-tools: Edit(/src/**), Read
```

---

## 工具權限問題

### 問題：執行 Skill 時頻繁要求權限

#### 診斷

執行 Skill 時觀察：
- 是否出現「Allow Claude to run...」提示？
- 哪些工具需要權限？

#### 解決方案：補充 allowed-tools

```yaml
# 範例：修復前
---
name: commit-helper
description: Create git commits
# ❌ 沒有 allowed-tools，每次都要求權限
---

# 範例：修復後
---
name: commit-helper
description: Create git commits
allowed-tools: Bash(git status), Bash(git add *), Bash(git commit *), Bash(git log *)
---
```

#### 常用工具權限參考

```yaml
# 讀取檔案
allowed-tools: Read, Glob, Grep

# 修改檔案
allowed-tools: Edit, Write

# Git 操作
allowed-tools: Bash(git status), Bash(git diff *), Bash(git log *)

# 提交和推送
allowed-tools: Bash(git add *), Bash(git commit *), Bash(git push *)

# npm 操作
allowed-tools: Bash(npm install *), Bash(npm run *), Bash(npm test)

# 限制檔案路徑
allowed-tools: Edit(/src/**), Write(/dist/**)
```

---

## Skill 執行錯誤

### 問題：Skill 執行時發生錯誤

#### 錯誤 1：找不到相依檔案

```
Error: Cannot find module './reference.md'
```

**診斷：**

```bash
# 檢查檔案是否存在
ls ~/.claude/skills/my-skill/
```

**解決方案：**

```yaml
# SKILL.md 中使用正確的相對路徑
Refer to the [API Reference](reference.md) for details.

# 確保檔案存在於同一目錄
my-skill/
├── SKILL.md
├── reference.md
└── examples.md
```

#### 錯誤 2：腳本執行權限錯誤

```
bash: permission denied: ./script.sh
```

**解決方案：**

```bash
# 賦予執行權限
chmod +x ~/.claude/skills/my-skill/scripts/*.sh

# 或批次處理所有 skill 腳本
find ~/.claude/skills/ -name "*.sh" -exec chmod +x {} \;
```

#### 錯誤 3：環境變數未設定

```
Error: API_KEY environment variable is not set
```

**解決方案：**

```bash
# 臨時設定
export API_KEY="your-key-here"

# 永久設定（zsh）
echo 'export API_KEY="your-key-here"' >> ~/.zshrc
source ~/.zshrc

# 永久設定（bash）
echo 'export API_KEY="your-key-here"' >> ~/.bashrc
source ~/.bashrc

# 驗證
echo $API_KEY
```

---

## 檔案結構問題

### 問題：Skill 太大，超過字元預算

#### 診斷

執行 `/context` 時看到：

```
Excluded skills (exceeded character budget):
- my-huge-skill
```

#### 解決方案：拆分檔案

**❌ 問題結構（單一大檔案）：**

```
my-skill/
└── SKILL.md (2000+ 行)
```

**✅ 正確結構（模組化）：**

```
my-skill/
├── SKILL.md (100 行 - 核心指示)
├── reference.md (詳細 API 文檔)
├── examples.md (使用範例)
├── best-practices.md (最佳實踐)
└── scripts/
    └── helper.sh
```

**SKILL.md 範例：**

```yaml
---
name: api-helper
description: Help with API development. Keywords: API, endpoint, REST, create endpoint
---

# API Helper Skill

Quick reference for building APIs. See [detailed reference](reference.md) and [examples](examples.md).

## Core Instructions

[簡短核心指示，< 500 行]

## Additional Resources

- [API Reference](reference.md) - Complete API documentation
- [Examples](examples.md) - Usage examples and patterns
- [Best Practices](best-practices.md) - Guidelines and conventions
```

---

## 診斷工具與技巧

### 工具 1：使用 `/context` 檢查 Skill 狀態

```bash
/context
```

**檢查項目：**
- ✅ Skill 出現在 "Available skills"
- ❌ Skill 在 "Excluded skills"
- ✅ Description 正確顯示
- ✅ 沒有語法錯誤警告

### 工具 2：驗證 YAML Frontmatter

**方法 A：使用 Python**

```bash
python3 << 'EOF'
import yaml
import os

skill_path = os.path.expanduser("~/.claude/skills/my-skill/SKILL.md")
with open(skill_path) as f:
    content = f.read()

# 提取 frontmatter
parts = content.split('---')
if len(parts) >= 3:
    frontmatter = parts[1]
    try:
        config = yaml.safe_load(frontmatter)
        print("✅ YAML is valid!")
        print("\nParsed config:")
        for key, value in config.items():
            print(f"  {key}: {value}")
    except yaml.YAMLError as e:
        print(f"❌ YAML Error: {e}")
else:
    print("❌ Invalid frontmatter structure")
EOF
```

**方法 B：使用線上驗證器**

複製 frontmatter 到 https://www.yamllint.com/ 檢查語法。

### 工具 3：測試 Skill 觸發

**建立測試腳本：**

```bash
# test-skill-trigger.sh
echo "Testing skill triggers..."
echo ""
echo "Test 1: Direct invocation"
echo "Command: /my-skill"
echo ""
echo "Test 2: Keyword trigger"
echo "Say: 'help me with [keyword from description]'"
echo ""
echo "Test 3: Scenario trigger"
echo "Say: '[scenario phrase from description]'"
```

### 工具 4：檢查 Skill 檔案大小

```bash
# 檢查 SKILL.md 行數
wc -l ~/.claude/skills/*/SKILL.md

# 檢查字元數
wc -c ~/.claude/skills/*/SKILL.md

# 建議：SKILL.md 保持在 500 行以內
```

### 工具 5：比對正常運作的 Skill

```bash
# 查看系統內建 skill 的結構
ls -la ~/.claude/skills/sp-*/

# 比對 frontmatter 格式
head -20 ~/.claude/skills/sp-systematic-debugging/SKILL.md
```

---

## 快速診斷流程圖

```
Skill 有問題？
    │
    ├─→ 看不到 Skill？
    │   ├─→ 執行 /context
    │   ├─→ 檢查檔案位置（~/.claude/skills/[name]/SKILL.md）
    │   └─→ 驗證 YAML 語法
    │
    ├─→ Skill 不會被觸發？
    │   ├─→ 檢查 disable-model-invocation 設定
    │   ├─→ 改善 description（加關鍵字和場景）
    │   └─→ 測試直接呼叫 /skill-name
    │
    ├─→ 頻繁要求權限？
    │   └─→ 補充 allowed-tools
    │
    └─→ 執行時出錯？
        ├─→ 檢查腳本權限（chmod +x）
        ├─→ 驗證環境變數
        └─→ 檢查相依檔案路徑
```

---

## 常見錯誤速查表

| 症狀 | 可能原因 | 快速檢查 | 解決方案 |
|------|----------|----------|----------|
| `/context` 看不到 Skill | 位置錯誤 | `ls ~/.claude/skills/` | 移到正確位置 |
| Skill 在 "Excluded" 列表 | 檔案太大 | `wc -l SKILL.md` | 拆分成多個檔案 |
| YAML 錯誤 | 語法問題 | 用 Python/線上工具驗證 | 修正語法錯誤 |
| Claude 不會自動用 | `disable-model-invocation: true` | 檢查 frontmatter | 移除或改為 false |
| 無法手動呼叫 `/skill` | `user-invocable: false` | 檢查 frontmatter | 移除或改為 true |
| 觸發不到 | Description 太籠統/太簡短 | 檢視 description 內容 | 加入關鍵字和場景 |
| 頻繁要權限 | 缺少 allowed-tools | 觀察要求的工具 | 補充到 allowed-tools |
| 腳本執行失敗 | 權限不足 | `ls -la script.sh` | `chmod +x script.sh` |

---

## 完整檢查清單

### 建立新 Skill 時檢查

#### Frontmatter 配置
- [ ] `name` 使用小寫 + 連字號（max 64 字元）
- [ ] `description` 包含關鍵字和使用場景
- [ ] `allowed-tools` 語法正確（首字大寫，Bash 權限有空格）
- [ ] 只使用一個調用控制（`disable-model-invocation` 或 `user-invocable`，不要兩個都用）
- [ ] YAML 語法正確（2 空格縮排，正確的冒號和引號）

#### 檔案結構
- [ ] 位置正確：`.claude/skills/[skill-name]/SKILL.md`
- [ ] SKILL.md < 500 行
- [ ] 詳細文檔放在支援檔案（reference.md, examples.md）
- [ ] 在 SKILL.md 中引用支援檔案

#### 觸發機制
- [ ] Description 包含 3-5 個關鍵字
- [ ] 列出 2-3 個使用場景
- [ ] 包含範例用戶語句
- [ ] 關鍵字不與其他 skill 衝突

#### 驗證測試
- [ ] 執行 `/context` 確認 Skill 被載入
- [ ] 測試直接呼叫 `/skill-name`
- [ ] 測試關鍵字觸發
- [ ] 確認工具權限足夠

---

## 進階診斷技巧

### 技巧 1：啟用詳細輸出（Verbose Mode）

如果 Skill 使用 Bash 腳本：

```bash
# 在腳本頂部加入
set -x  # 顯示執行的每一行
set -v  # 顯示讀取的每一行
```

### 技巧 2：記錄 Skill 執行

在 SKILL.md 中加入：

```markdown
## Debug Mode

When debugging, Claude should:
1. Log which step is being executed
2. Show intermediate results
3. Explain any unexpected behavior
```

### 技巧 3：建立測試 Skill

建立一個簡單的測試 skill 來驗證環境：

```yaml
---
name: test-skill
description: Test skill to verify setup. Use when testing skill configuration
allowed-tools: Bash(echo *)
---

# Test Skill

This is a minimal skill for testing.

## Instructions

When invoked:
1. Echo "Skill is working!"
2. Show current directory
3. List available tools
```

---

## 特殊情況處理

### 情況 1：Skill 只在特定專案中有效

```yaml
---
name: project-specific-skill
description: Handle project-specific tasks. Only use in the XYZ project
---

# Project-Specific Skill

⚠️ **Compatibility Check**
Before executing, verify you're in the correct project:
- Check for marker file: `PROJECT_ID.txt`
- Verify git remote: `git remote -v` should show `xyz-repo`

If not in correct project, inform user and exit.
```

### 情況 2：Skill 需要前置條件

```yaml
---
name: deploy-production
description: Deploy to production after tests pass
disable-model-invocation: true  # 需要明確呼叫
---

# Production Deployment

## Prerequisites Check

Before deploying, verify:
1. ✅ All tests passing: `npm test`
2. ✅ Build successful: `npm run build`
3. ✅ On main branch: `git branch --show-current`
4. ✅ No uncommitted changes: `git status`

If any check fails, STOP and inform user.
```

### 情況 3：Skill 間的相依性

```markdown
## Dependencies

This skill requires:
- `code-review` skill for pre-deployment review
- `run-tests` skill for verification

If user hasn't run these first, suggest running them before deployment.
```

---

## 逐步除錯指南

### 當 Skill 完全不運作時

1. **基礎檢查**
   ```bash
   # Skill 檔案存在？
   ls -la ~/.claude/skills/my-skill/SKILL.md

   # 內容正確？
   head -30 ~/.claude/skills/my-skill/SKILL.md
   ```

2. **YAML 驗證**
   ```bash
   # 複製 frontmatter，用線上工具驗證
   # https://www.yamllint.com/
   ```

3. **位置驗證**
   ```bash
   # 確認在正確位置
   pwd
   # 應該顯示：~/.claude/skills/my-skill/
   ```

4. **重啟 Claude Code**
   - 退出當前 session
   - 重新啟動 Claude Code

5. **檢查載入狀態**
   ```bash
   /context
   # 搜尋你的 skill 名稱
   ```

6. **測試直接呼叫**
   ```bash
   /my-skill
   # 如果這有效，問題在於觸發機制（description）
   # 如果這無效，問題在於 skill 本身或配置
   ```

---

## 預防性最佳實踐

### 1. 使用 Skill 範本

建立新 skill 時，從範本開始：

```yaml
---
name: skill-template
description: |
  [One-line summary of what this skill does]

  **Use when:**
  - [Scenario 1]
  - [Scenario 2]

  **Keywords:** [keyword1, keyword2, keyword3]

allowed-tools: Read, Edit
---

# Skill Name

## Purpose
[What this skill does]

## When to Use
[Specific scenarios]

## Instructions
[Step-by-step what Claude should do]

## Examples
[Usage examples]
```

### 2. 建立前先驗證

在建立 skill 之前：

- [ ] 搜尋是否已有類似的 skill（避免重複）
- [ ] 確認關鍵字不與現有 skill 衝突
- [ ] 規劃檔案結構（主檔 + 支援檔案）
- [ ] 列出需要的工具權限

### 3. 建立後立即測試

```bash
# 1. 檢查載入
/context

# 2. 直接呼叫
/my-skill

# 3. 測試關鍵字觸發
# 說出 description 中的關鍵字

# 4. 檢查權限
# 觀察是否有權限提示
```

### 4. 版本控制你的 Skills

```bash
cd ~/.claude/skills/
git init  # 如果還沒有
git add my-skill/
git commit -m "Add my-skill: [description]"

# 這樣可以追蹤變更，必要時回退
```

---

## 取得協助

### 除錯資訊收集

當需要尋求協助時，提供以下資訊：

```bash
# 1. 系統資訊
uname -a
echo "Claude Code version: [your version]"

# 2. Skill 配置
cat ~/.claude/skills/my-skill/SKILL.md | head -30

# 3. 目錄結構
tree ~/.claude/skills/my-skill/
# 或
find ~/.claude/skills/my-skill/ -type f

# 4. /context 輸出
/context | grep -A5 "my-skill"

# 5. 錯誤訊息
[完整的錯誤訊息]
```

### 有用的參考資源

- [Skill 常見錯誤](skill-common-mistakes-zh-TW.md) - TOP 5 新手錯誤
- [Skill 觸發指南](skill-invocation-guide-zh-TW.md) - 如何讓 Claude 正確觸發你的 skill
- [SETUP.md](~/.claude/skills/SETUP.md) - Skills 安裝說明
- [README.md](~/.claude/skills/README.md) - Skills 使用文檔

---

## 總結：最常見的 3 個問題

### 1️⃣ Skill 無法載入
- **檢查**：檔案位置、YAML 語法、檔案大小
- **解決**：確保在 `.claude/skills/[name]/SKILL.md`，驗證 YAML，拆分大檔案

### 2️⃣ Skill 無法觸發
- **檢查**：Description 內容、調用設定
- **解決**：在 description 加入關鍵字、場景、範例語句

### 3️⃣ 權限問題
- **檢查**：執行時的權限提示
- **解決**：在 frontmatter 補充 `allowed-tools`

---

遇到問題？按照上面的診斷步驟逐一檢查，大部分問題都能快速解決！🎯
