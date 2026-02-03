# Top 5 Common Mistakes When Using/Creating Skills

## 1. ❌ Frontmatter Configuration Errors

### Common Issues:

- YAML syntax errors (mixed spaces/tabs, missing colons)
- Field name typos (descrption → description)
- Skill name using uppercase or spaces

### ❌ Wrong Example:

```yaml
---
name: Fix Issue  # ❌ Cannot have uppercase and spaces
descrption: Fix bugs  # ❌ Typo
allowed-tools: bash  # ❌ Tool name case error
---
```

### ✅ Correct Example:

```yaml
---
name: fix-issue
description: Fix bugs and create PR
allowed-tools: Read, Grep, Bash(gh *)
---
```

### 🎯 Remember:

- **Skill name**: Only lowercase letters, numbers, hyphens (max 64 characters)
- **YAML indentation**: Use 2 spaces, not tabs
- Use `---` markers to separate frontmatter from content

---

## 2. ❌ allowed-tools Syntax Errors

### Common Issues:

- Tool name case errors
- Bash permission syntax errors (missing spaces)
- Forgetting to list necessary tools

### ❌ Wrong Examples:

```yaml
allowed-tools: bash, read, grep  # ❌ Lowercase
allowed-tools: Bash(npm*)        # ❌ Missing space
allowed-tools: "Read", "Edit"    # ❌ Unnecessary quotes
```

### ✅ Correct Examples:

```yaml
allowed-tools: Read, Grep, Bash(npm *)
allowed-tools: Bash(git commit *)
allowed-tools: Edit(/src/**)
```

### 🎯 Key Points:

- **Tool names**: Read, Edit, Write, Bash, Grep, Glob (first letter capitalized)
- **Bash permissions**: `Bash(command *)` - space required between command and asterisk
- Only grant necessary tools, avoid over-authorization

---

## 3. ❌ Description Too Generic or Too Specific

### Problem A: Too Generic → Skill Triggers Too Often

#### ❌ Wrong Example:

```yaml
---
name: code-suggestions
description: Improve code  # ❌ Will trigger on any code discussion
---
```

#### ✅ Correct Example:

```yaml
---
name: code-suggestions
description: Suggest code improvements following SOLID principles. Use when user asks "how can I improve this code" or "refactor this section"
---
```

### Problem B: Too Specific → Claude Can't Find the Skill

#### ❌ Wrong Example:

```yaml
description: xyz  # ❌ Too short, no keywords
```

#### ✅ Correct Example:

```yaml
description: Deploy application to AWS production environment. Use when ready to push changes to production after tests pass.
```

### 🎯 Best Practices:

- Include keywords (deploy, test, commit, review, etc.)
- Specify usage timing ("Use when...", "Use after...")
- Provide example phrases ("like 'create a GET /api/users endpoint'")

---

## 4. ❌ Incorrect Use of disable-model-invocation and user-invocable

### Common Confusion:

| Configuration | You Can Call | Claude Can Auto-Call | Purpose |
|---------------|--------------|----------------------|---------|
| (default) | ✅ | ✅ | General knowledge & instructions |
| `disable-model-invocation: true` | ✅ | ❌ | Operations with side effects (deploy, commit) |
| `user-invocable: false` | ❌ | ✅ | Background knowledge (no manual execution needed) |

### ❌ Fatal Error:

```yaml
---
name: dead-skill
disable-model-invocation: true  # ❌ Claude can't use it
user-invocable: false            # ❌ You can't use it either
---
# Nobody can use this skill!
```

### ✅ Correct Usage:

#### Operations with Side Effects:

```yaml
---
name: deploy-production
disable-model-invocation: true  # ✅ Only manual /deploy-production
---
```

#### Background Knowledge:

```yaml
---
name: api-conventions
user-invocable: false  # ✅ Claude auto-applies, no manual invocation needed
---
```

---

## 5. ❌ File Structure and Location Errors

### Problem A: Wrong Skill Location → Not Discoverable

#### ❌ Wrong Locations:

```
❌ ~/.claude/SKILL.md                    # Not in a directory
❌ .claude/skills/SKILL.md               # Missing subdirectory
❌ .claude/commands/my-skill/SKILL.md    # Wrong parent directory name
```

#### ✅ Correct Locations:

```
✅ ~/.claude/skills/my-skill/SKILL.md          # Personal skill
✅ ./.claude/skills/project-skill/SKILL.md     # Project skill
✅ plugin/skills/plugin-skill/SKILL.md         # Plugin skill
```

### Problem B: All Content in SKILL.md → Context Explosion

#### ❌ Wrong Approach:

```
my-skill/
└── SKILL.md (1000+ lines, includes all documentation)
```

#### ✅ Correct Approach:

```
my-skill/
├── SKILL.md (50 lines overview)
├── reference.md (detailed documentation)
├── examples.md (usage examples)
└── scripts/
    └── validate.py
```

#### SKILL.md Content:

```yaml
---
name: api-docs
---
Refer to the complete [API Documentation](reference.md) and [Usage Examples](examples.md).

## Quick Reference
[Brief overview]
```

### 🎯 Best Practices:

- Keep SKILL.md under 500 lines
- Put detailed documentation in support files
- Reference support files in SKILL.md so Claude knows they exist
- Claude will load support files on demand

---

## 🔍 Methods to Verify Skills

### 1. Check if Skill is Loaded:

```bash
/context
```

Check the output for:
- Skill description appears
- Not in "excluded skills" list

### 2. Test Skill Triggering:

- **Direct call**: `/skill-name`
- **Indirect trigger**: Say keywords from the description

### 3. Check Tool Permissions:

- After executing skill, check for permission prompts
- If frequently requesting permissions → add to `allowed-tools`

---

## 📋 Quick Checklist

Before creating a skill, check:

- [ ] **Skill name**: lowercase, hyphens, max 64 characters
- [ ] **description** includes keywords and usage timing
- [ ] **allowed-tools** lists required tools with correct syntax
- [ ] Use only one invocation control (`disable-model-invocation` or `user-invocable`)
- [ ] **File location**: `.claude/skills/<skill-name>/SKILL.md`
- [ ] **SKILL.md** kept concise (< 500 lines)
- [ ] Verified skill loaded using `/context`

---

## Need More Details?

Need more detailed explanations or examples for a specific error? 🎯
