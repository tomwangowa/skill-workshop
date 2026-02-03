# How to Ensure Skills Can Be Invoked by AI

## Short Answer

There is no dedicated keywords field, but you should explicitly write keywords and trigger scenarios in the description.

---

## ✅ Best Practices: Writing Keywords in Description

### Strategy 1: Directly List Trigger Keywords

```yaml
---
name: deploy-production
description: Deploy application to production environment. Keywords: deploy, push to production, release, go live
disable-model-invocation: true
---
```

### Strategy 2: Describe Usage Timing (Recommended) ⭐

```yaml
---
name: create-api-endpoint
description: Create a new REST API endpoint following project conventions. Use when user asks to "create an endpoint", "add API route", "build new API", or "make a GET/POST endpoint"
---
```

### Strategy 3: Include Example Phrases

```yaml
---
name: fix-github-issue
description: Fix a GitHub issue and create PR. Use when user says "fix issue #123", "resolve bug 456", or "implement feature request"
argument-hint: [issue-number]
---
```

### Strategy 4: Combined Approach (Most Recommended) ⭐⭐

```yaml
---
name: code-review
description: |
  Perform comprehensive code review following team standards.

  **Use when:**
  - User asks to "review this code"
  - "Check my implementation"
  - "Is this code good?"
  - "Review my PR"

  **Keywords:** review, check, validate, audit, inspect, evaluate
---
```

---

## 🎯 Techniques to Improve Trigger Rate

### 1. Use Verb + Noun Combinations

```yaml
description: Create git commit with conventional commit message. Triggers: commit, create commit, save changes, commit code
```

**Common verbs:**
- create, build, make, add
- fix, resolve, repair
- review, check, validate
- deploy, push, release
- analyze, investigate, explore

### 2. Include Synonyms

```yaml
description: Deploy application (synonyms: push, release, ship, publish, launch to production)
```

### 3. List Common Misexpressions

```yaml
description: |
  Fix TypeScript errors and type issues.
  Use when user mentions: "TS error", "type error", "TypeScript complaining", "red squiggly lines", "type mismatch"
```

### 4. Use Structured Format

```yaml
description: |
  Generate comprehensive README documentation.

  Triggers on:
  - "create README"
  - "write documentation"
  - "generate docs"
  - "need a README file"

  Best for: new projects, open source repos, documentation updates
```

---

## 📊 Description Structure Templates

### Template A: Concise Version

```yaml
description: [Action] [Object]. Use when [scenario]. Keywords: [key1, key2, key3]
```

**Example:**
```yaml
description: Create React component following design system. Use when building UI components. Keywords: component, create component, new component, React component
```

### Template B: Complete Version

```yaml
description: |
  [One-line summary]

  **Use when:**
  - [Scenario 1]
  - [Scenario 2]

  **Triggers:**
  - "[User statement 1]"
  - "[User statement 2]"

  **Keywords:** [keyword list]
```

**Example:**
```yaml
description: |
  Review pull request and provide structured feedback.

  **Use when:**
  - User provides PR number or URL
  - User asks for code review
  - Before merging to main branch

  **Triggers:**
  - "review PR #123"
  - "check this pull request"
  - "feedback on my code"

  **Keywords:** review, PR, pull request, code review, feedback
```

---

## 🔍 Verifying Skill Can Be Triggered

### Method 1: Check Using /context

```bash
/context
```

Review the output:
- ✅ Skill description appears in "Available skills" section
- ❌ Skill appears in "Excluded skills" (exceeded character budget)

### Method 2: Test Triggering

Say keywords from the description:
```
You: "Help me review this code"
→ Should trigger if description contains "review" and "code"
```

### Method 3: Direct Invocation Confirmation

```bash
/skill-name
```

First ensure the skill functionality itself is normal, then test automatic triggering.

---

## ⚠️ Common Pitfalls

### Pitfall 1: Description Too Generic

```yaml
# ❌ Wrong: Will trigger on any code discussion
description: Help with code

# ✅ Correct: Clear usage scenario
description: Refactor code following SOLID principles. Use when user explicitly asks to "refactor" or "improve code structure"
```

### Pitfall 2: Only Keywords Without Context

```yaml
# ❌ Wrong: Claude doesn't know when to use
description: Keywords: deploy, push, release

# ✅ Correct: Keywords + usage scenario
description: Deploy to production. Use when tests pass and user confirms ready to deploy. Keywords: deploy, push to prod, go live
```

### Pitfall 3: Keywords Conflict With Other Skills

```yaml
# ❌ If multiple skills all use "review"
skill-1: description: Review code
skill-2: description: Review documentation

# ✅ Use more specific keywords
skill-1: description: Review source code implementation for bugs and best practices. Keywords: code review, PR review
skill-2: description: Review technical documentation for clarity and completeness. Keywords: docs review, documentation check
```

---

## 🎓 Advanced Techniques

### Technique 1: Use Negative Keywords (Explain in Content)

```yaml
---
name: quick-fix
description: Quick bug fixes for simple issues. Use for minor bugs, typos, small changes
---
This skill is for QUICK fixes only.
Do NOT use for:
- Major refactoring
- Architectural changes
- Breaking changes
```

### Technique 2: Priority Hints

```yaml
description: |
  Primary test runner for the project.
  **Use this FIRST when user asks to run tests.**
  Keywords: test, run tests, execute tests, test suite
```

### Technique 3: Conditional Triggering

```yaml
description: |
  Deploy to staging environment.
  Use when user mentions "staging" OR "test environment" (but NOT "production").
  Keywords: staging, deploy staging, push to staging
```

---

## 📋 Description Checklist

Check when creating a description:

- [ ] One-line summary of skill functionality
- [ ] Contains 3-5 core keywords
- [ ] Lists 2-3 usage scenarios ("Use when...")
- [ ] Includes example user statements ("like '...'", "mentions '...'")
- [ ] Avoids keyword conflicts with other skills
- [ ] Description length is moderate (50-200 characters ideal)
- [ ] Uses active voice and action verbs

---

## 💡 Summary

Although there is no dedicated keywords field, by including the following in the description:

1. ✅ Explicitly list keywords
2. ✅ Describe usage scenarios
3. ✅ Provide example statements
4. ✅ Include synonyms

You can significantly improve the probability of the skill being correctly triggered!
