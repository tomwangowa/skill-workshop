---
name: basic-concept
description: Interactive guide to Skill fundamentals including directory structure, SKILL.md anatomy, and best practices. Use when users ask "What is a Skill?", "How do Skills work?", "Skill basics", "Skill structure", "How to create a Skill", or want to learn about the Skill system fundamentals.
---

**IMPORTANT: Output ONLY the content below. Do NOT add summaries, explanations, or additional commentary. Present the material exactly as written.**

---

# 🎓 Skill 基本概念

## 🤔 什麼是 Skill？

**生活比喻：**

把 Claude 想像成一位廚師 👨‍🍳：
- **沒有 Skill**：每次做菜都要你在旁邊指導「先切洋蔥、再熱油、然後...」
- **有了 Skill**：給他一本食譜 📖，他看到「番茄炒蛋」就知道怎麼做！

**實際差異：**
```
你說：「幫我旋轉 PDF」

沒有 Skill → Claude：「我來寫個程式碼...」（每次從零開始）
有了 Skill → Claude：「好的！」（直接執行）
```

---

## 📦 Skill 長什麼樣？

一個 Skill 就是一個資料夾，裡面最重要的是 **SKILL.md**：

```
my-first-skill/
└── SKILL.md  ← 這個檔案是必備的！
```

進階一點可以加上工具和資料：

```
my-skill/
├── SKILL.md        ← 必備：使用說明
├── scripts/        ← 選配：程式碼工具
├── references/     ← 選配：參考資料
└── assets/         ← 選配：範本、圖片等
```

---

## 📝 SKILL.md 怎麼寫？

分成兩部分：**檔頭** 和 **本文**

### 1️⃣ 檔頭（Frontmatter）

用 `---` 包起來的 YAML 格式：

```yaml
---
name: pdf-helper
description: PDF 工具。當用戶要 (1) 旋轉 PDF
             (2) 合併 PDF 時使用
---
```

**重點：**
- `name`：Skill 名稱
- `description`：⭐ **最重要！** 告訴 Claude「什麼時候」要用這個 Skill

### 2️⃣ 本文（Body）

檔頭下方用 Markdown 寫使用說明：

```markdown
# PDF Helper

使用 scripts/rotate.py 可以旋轉 PDF：
\```bash
python3 scripts/rotate.py input.pdf 90 output.pdf
\```

詳細說明請看 references/guide.md
```

**訣竅：** 簡短、直接、有範例就好！

---

## 🗂️ 三個資料夾的用途

想像你在準備一個工具箱 🧰：

| 資料夾 | 比喻 | 放什麼 | 範例 |
|--------|------|--------|------|
| **scripts/** | 🔧 工具 | 可執行的程式 | rotate.py, merge.sh |
| **references/** | 📚 手冊 | 文件、規範 | api_docs.md, schema.json |
| **assets/** | 🎨 材料 | 範本、圖片 | template.html, logo.png |

**比喻：**
- `scripts/` = 你的螺絲起子、扳手（實際幹活的工具）
- `references/` = 說明書（需要查資料時翻閱）
- `assets/` = 預先準備好的零件（直接拿來組裝）

---

## 🚀 動手做：建立第一個 Skill

### 步驟 1：建立 SKILL 資料夾
```bash
cd ~/.claude/skills
mkdir my-skill
cd my-skill
```

### 步驟 2：編輯 SKILL.md

寫好檔頭和本文：
```yaml
---
name: hello-skill
description: 打招呼工具。當用戶說「hello」時使用
---

# Hello Skill

跟用戶說：「你好！很高興見到你！」
```

### 步驟 3：存檔

完成！你的第一個 Skill 就做好了 🎉

---

## 💡 新手重點提醒

✅ **一定要做：**
- Description 要寫清楚「何時使用」
- 保持簡潔（不要解釋 Claude 已知的事）
- 離開當前 session (`/exit`) 再重新進入，如此才能載入新完成的 Skill
- 在 claude 中執行 `/skills` 觀察你的 skill 是否有被載入

❌ **不要做：**
- 不必建立 README.md（只需要 SKILL.md）
- 不要寫太多說明（用範例取代文字）

---

## 🎯 記住這個

> **Skill = 給 Claude 的食譜 📖**
>
> 寫清楚「什麼時候用」+「怎麼用」就完成了！

準備好建立你的第一個 Skill 了嗎？🚀
