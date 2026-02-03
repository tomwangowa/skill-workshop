# 新手使用/建立 Skill 的 TOP 5 常見錯誤

## 1. ❌ Frontmatter 配置錯誤

### 常見問題

- YAML 語法錯誤（空格/Tab 混用、缺少冒號）
- 欄位名稱拼錯（descrption → description）
- Skill 名稱使用大寫或空格

### ❌ 錯誤範例

```yaml
---
name: Fix Issue  # ❌ 不能有大寫和空格
descrption: Fix bugs  # ❌ 拼錯了
allowed-tools: bash  # ❌ 工具名稱大小寫錯誤
---
```

### ✅ 正確範例

```yaml
---
name: fix-issue
description: Fix bugs and create PR
allowed-tools: Read, Grep, Bash(gh *)
---
```

### 🎯 記住

- **Skill 名稱**：只能用小寫字母、數字、連字號（最多 64 字元）
- **YAML 縮排**：使用 2 個空格，不要用 Tab
- 使用 `---` 標記區分 frontmatter 和內容

---

## 2. ❌ allowed-tools 語法錯誤

### 常見問題

- 工具名稱大小寫錯誤
- Bash 權限語法錯誤（缺少空格）
- 忘記列出必要的工具

### ❌ 錯誤範例

```yaml
allowed-tools: bash, read, grep  # ❌ 小寫
allowed-tools: Bash(npm*)        # ❌ 缺少空格
allowed-tools: "Read", "Edit"    # ❌ 不需要引號
```

### ✅ 正確範例

```yaml
allowed-tools: Read, Grep, Bash(npm *)
allowed-tools: Bash(git commit *)
allowed-tools: Edit(/src/**)
```

### 🎯 重點

- **工具名稱**：Read, Edit, Write, Bash, Grep, Glob（首字大寫）
- **Bash 權限**：`Bash(命令 *)` - 命令和星號之間要有空格
- 只授予必要的工具，避免過度授權

---

## 3. ❌ Description 太籠統或太具體

### 問題 A：太籠統 → Skill 觸發太頻繁

#### ❌ 錯誤範例

```yaml
---
name: code-suggestions
description: Improve code  # ❌ 任何程式碼討論都會觸發
---
```

#### ✅ 正確範例

```yaml
---
name: code-suggestions
description: Suggest code improvements following SOLID principles. Use when user asks "how can I improve this code" or "refactor this section"
---
```

### 問題 B：太具體 → Claude 找不到 Skill

#### ❌ 錯誤範例

```yaml
description: xyz  # ❌ 太短，沒有關鍵字
```

#### ✅ 正確範例

```yaml
description: Deploy application to AWS production environment. Use when ready to push changes to production after tests pass.
```

### 🎯 最佳實踐

- 包含關鍵字（deploy, test, commit, review 等）
- 說明使用時機（"Use when...", "Use after..."）
- 提供範例語句（"like 'create a GET /api/users endpoint'"）

---

## 4. ❌ 錯誤使用 disable-model-invocation 和 user-invocable

### 常見混淆

| 設定 | 你可以呼叫 | Claude 可以自動呼叫 | 用途 |
|------|-----------|---------------------|------|
| （預設） | ✅ | ✅ | 一般知識＆指令 |
| `disable-model-invocation: true` | ✅ | ❌ | 有副作用的操作（部署、提交） |
| `user-invocable: false` | ❌ | ✅ | 背景知識（不需手動執行） |

### ❌ 致命錯誤

```yaml
---
name: dead-skill
disable-model-invocation: true  # ❌ Claude 不能用
user-invocable: false            # ❌ 你也不能用
---
# 沒人能用這個 Skill！
```

### ✅ 正確使用

#### 有副作用的操作

```yaml
---
name: deploy-production
disable-model-invocation: true  # ✅ 只能手動 /deploy-production
---
```

#### 背景知識

```yaml
---
name: api-conventions
user-invocable: false  # ✅ Claude 自動應用，不需手動呼叫
---
```

---

## 5. ❌ 檔案結構和位置錯誤

### 問題 A：Skill 位置錯誤 → 無法被發現

#### ❌ 錯誤位置

```
❌ ~/.claude/SKILL.md                    # 不在目錄中
❌ .claude/skills/SKILL.md               # 缺少子目錄
❌ .claude/commands/my-skill/SKILL.md    # 錯誤的父目錄名稱
```

#### ✅ 正確位置

```
✅ ~/.claude/skills/my-skill/SKILL.md          # 個人 Skill
✅ ./.claude/skills/project-skill/SKILL.md     # 專案 Skill
✅ plugin/skills/plugin-skill/SKILL.md         # 插件 Skill
```

### 問題 B：所有內容塞在 SKILL.md → Context 爆炸

#### ❌ 錯誤做法

```
my-skill/
└── SKILL.md (1000+ 行，包含所有文檔)
```

#### ✅ 正確做法

```
my-skill/
├── SKILL.md (50 行概述)
├── reference.md (詳細文檔)
├── examples.md (使用範例)
└── scripts/
    └── validate.py
```

#### SKILL.md 內容範例

```yaml
---
name: api-docs
---
參考完整的 [API 文檔](reference.md) 和 [使用範例](examples.md)。

## 快速參考
[簡短概述]
```

### 🎯 最佳實踐

- SKILL.md 保持在 500 行以內
- 詳細文檔放在支援檔案
- 在 SKILL.md 中引用支援檔案，讓 Claude 知道它們的存在
- Claude 會按需載入支援檔案

---

## 🔍 驗證 Skill 的方法

### 1. 檢查 Skill 是否被載入

```bash
/context
```

查看輸出中是否有：
- Skill description 出現
- 沒有在 "excluded skills" 列表中

### 2. 測試 Skill 觸發

- **直接呼叫**：`/skill-name`
- **間接觸發**：說出 description 中的關鍵字

### 3. 檢查工具權限

- 執行 Skill 後看是否有權限提示
- 如果頻繁要求權限 → 補充 `allowed-tools`

---

## 📋 快速檢查清單

建立 Skill 前檢查：

- [ ] **Skill 名稱**：小寫、連字號、不超過 64 字元
- [ ] **description** 包含關鍵字和使用時機
- [ ] **allowed-tools** 列出所需工具，語法正確
- [ ] 只用一個調用控制（`disable-model-invocation` 或 `user-invocable`）
- [ ] **檔案位置**：`.claude/skills/<skill-name>/SKILL.md`
- [ ] **SKILL.md** 保持簡潔（< 500 行）
- [ ] 使用 `/context` 驗證 Skill 已載入

---

## 需要更多協助？

需要我針對某個特定錯誤提供更詳細的說明或範例嗎？🎯
