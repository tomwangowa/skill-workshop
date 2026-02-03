# Skill 的價值

## Background

這是一段 Claude Code 在完成一個專案的 sprint 之後回應我的反省文：

```markdown
# 📊 Coding Agent 開發反省報告

## Issues Found

- 🔴 High Priority: 3 critical bugs (all fixed in follow-up commits)
- 🟡 Medium Priority: 2 maintainability concerns
- 🟢 Low Priority: 2 code quality suggestions

## Root Cause Analysis

所有 3 個 critical bugs 的共同原因：

1. ❌ 沒有在提交前執行 code review
2. ❌ 沒有在實作時閱讀相關代碼（config model, service 類型簽名）
3. ❌ 沒有在提交前執行測試（即使是手動測試也能發現這些錯誤）

## ✅ Actionable Next Steps

### Immediate (Must Do)

1. ⚠️ Process Fix Required:
   - 從現在開始，每次提交前必須 code review
   - 使用 checklist：閱讀相關代碼 → 手動測試 → Code Review → Commit
2. Add Missing Unit Tests (Task #4)
   - Test _transform_scraperapi_to_unified() with 各種輸入
   - Test error handling paths
   - Estimated: 1-2 hours

### Short Term (Should Do)

3. Improve Error Handling
   - 使用 raise ... from e 保留異常鏈
   - 分別處理不同的 ScraperAPI 錯誤類型
4. Add Type Hints
   - 為所有 helper functions 添加完整型別註釋

### Long Term (Nice to Have)

5. Refactor Magic Strings
   - 定義常量 SOURCE_SCRAPERAPI, SOURCE_REVIEW_EXTRACTOR
6. Pre-commit Hooks
   - 考慮添加 pre-commit hook 強制執行 code review

## 💡 Lessons Learned

這次 Sprint 的教訓：

1. 速度不等於效率 - 6 個 commits，3 個是修 bugs
2. Code Review 是必須的，不是可選的 - 能防止 100% 的 bugs
3. 測試驅動開發的價值 - 如果先寫測試，這些 bugs 不會發生
4. 閱讀代碼比猜測更快 - 花 2 分鐘閱讀 config model 能省下 20 分鐘除錯

## 承諾

非常抱歉違反了您的規則。我承諾從現在開始：

- ✅ 每次提交前必定執行 code review
- ✅ 遵循 TDD 或至少先手動測試
- ✅ 閱讀相關代碼而非猜測
```

## 我的行動

後來我把這次踩到的流程問題，整理成一個 Agent Skill `/quality-driven-dev`，讓 Agent 在提交前自動提醒 review / test / context 檢查，實際用下來，後續修改品質有明顯改善。

### 一句點破這整件事的核心（Workshop 金句）

> **Skill 的價值，不是讓 AI 變聰明，而是幫我們在會偷懶的地方，不給自己機會犯錯。**

現在做的 `/quality-driven-dev` skill，其實正好完美呼應前面講的那句話：

> 我們不要為了寫 SKILL 而寫 SKILL，而是有需要才寫。

這是一個**非常漂亮的前後呼應案例**。

## 簡報投影片

### Skill Before / After：`/quality-driven-dev`

#### 🎯 問題背景（Before）

**情境**：使用 Coding Agent 加速開發

**實際發生的狀況**

- 6 次 commit 中，有 3 次是修 critical bugs
- 問題不是技術太難，而是流程被跳過

**Root Cause（共通原因）**

- ❌ 提交前沒有 code review
- ❌ 實作時沒有先讀相關程式碼（config / 型別）
- ❌ 提交前沒有跑測試（連手動都沒有）

👉 **結論**：Prompt 只會讓 AI「做得更快」，但**不會自動幫你守流程**。

#### 介入手段（What Changed）

不是再加 Prompt，而是補一個 `/quality-driven-dev` Agent Skill

**定位**

- 一個「提交前品質守門員」
- 把原本靠記憶與自律的流程，變成 AI 的情境式 SOP

**Skill 內建提醒的流程檢查**

1. 是否已閱讀相關程式碼與型別定義
2. 是否完成（至少）手動測試
3. 是否執行 code review checklist

#### 使用後的變化（After）

**觀察到的改善**

- 🟢 明顯降低「修 bug 的 commit 比例」
- 🟢 提交前會自然停下來檢查流程
- 🟢 Coding Agent 的輸出穩定度提升

**關鍵轉變**

- 從「靠人記得流程」
- → 變成「流程被系統化提醒」

#### 學到的一件事

> **Skill 的價值，不是讓 AI 變聰明，而是幫我們在會偷懶的地方，不給自己犯錯的機會。**

##### 一句總結

- Prompt：讓 AI 做事
- Skill：讓 AI 守流程

👉 **我們不要為了寫 Skill 而寫 Skill，而是在「真的踩雷之後」，才知道哪個 Skill 值得寫。**

---

（This slide = 真實踩坑 → 系統性補洞的實戰案例）
