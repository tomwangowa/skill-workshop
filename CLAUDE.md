# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a workshop/learning repository for Claude Code Skills development. It contains:
- Educational materials about creating and using Skills
- Best practices guides and troubleshooting documentation
- Code examples demonstrating various programming patterns
- Slide decks for presentations about Skills

## Repository Structure

```
skill-workshop/
├── skill-*.md              # Core skill development guides (English and zh-TW)
├── coding-agent-retrospective.md  # Real-world lessons from agent development
├── Skill 的價值.md         # Value proposition and case studies
├── clean-code-var-naming.json     # Variable naming workshop data
├── tidy-doc.md / untidy-doc.md    # Documentation quality examples
├── slide-deck/             # Workshop presentation materials (PDFs)
├── bubble_sort.py          # Python code example with documentation
└── useGoogleAuth.js        # React hook example
```

## Key Files and Their Purpose

### Skill Development Documentation

**skill-invocation-guide.md / skill-invocation-guide-zh-TW.md**
- How to make Skills discoverable to Claude
- Keyword and trigger configuration strategies
- Description writing best practices
- Available in English and Traditional Chinese

**skill-common-mistakes.md / skill-common-mistakes-zh-TW.md**
- Top 5 common errors when creating Skills
- Frontmatter configuration pitfalls
- allowed-tools syntax errors
- File structure mistakes

**skill-troubleshooting-guide-zh-TW.md**
- Comprehensive diagnostic guide for Skill issues
- Step-by-step debugging procedures
- Common error patterns and solutions

### Workshop Materials

**Skill 的價值.md**
- Real case study from a coding agent sprint
- Before/after comparison showing Skill impact
- Key insight: "Skills don't make AI smarter, they prevent us from cutting corners"

**coding-agent-retrospective.md**
- Sprint retrospective analyzing 3 critical bugs
- Root cause: skipping code review, testing, and context reading
- Led to creation of quality-driven-dev skill

### Code Examples

**bubble_sort.py**
- Well-documented Python implementation
- Demonstrates Clean Code documentation practices
- Type hints, docstrings, comprehensive examples

**useGoogleAuth.js**
- React hook for Google OAuth authentication
- Shows state management and security patterns
- Example of production-like code structure

**clean-code-var-naming.json**
- Prompt optimization data for variable naming
- Shows before/after prompt engineering
- Analysis scores and improvement suggestions

## Working With This Repository

### Language Preferences
- Documentation exists in both English and Traditional Chinese (zh-TW)
- Code comments are in English
- When creating new guides, consider bilingual versions for broader accessibility

### Content Organization Principles
This repository demonstrates:
1. **Separation of concerns**: Keep SKILL.md concise (<500 lines), detailed docs in separate files
2. **Real examples over theory**: Include actual code examples and case studies
3. **Before/after comparisons**: Show both problematic and correct approaches
4. **Bilingual support**: Provide materials in multiple languages where valuable

### When Adding New Materials

**For new Skill guides:**
- Follow the structure of existing skill-*.md files
- Include practical examples and common pitfalls
- Add both English and zh-TW versions if the content is foundational

**For code examples:**
- Use comprehensive documentation (docstrings, JSDoc)
- Include type hints where applicable
- Provide usage examples with expected output
- Demonstrate best practices, not just working code

**For workshop materials:**
- Store presentation files in slide-deck/
- Use descriptive filenames indicating sequence (1) Opening.pdf, (2) Introduction.pdf
- Reference real case studies from coding-agent-retrospective.md

## Important Context

### Core Workshop Themes

**The Value of Skills**
From "Skill 的價值.md", the key insight:
> "Skill 的價值，不是讓 AI 變聰明，而是幫我們在會偷懶的地方，不給自己犯錯的機會。"

Translation: Skills don't make AI smarter; they prevent us from cutting corners where we tend to be lazy.

**Lessons from Real Development** (coding-agent-retrospective.md)
- 6 commits, 3 were bug fixes
- All bugs shared root cause: skipping review, testing, and context reading
- Speed ≠ efficiency; quality processes save time overall
- Led to creation of /quality-driven-dev skill to enforce best practices

### Skill Configuration Patterns

**Frontmatter essentials:**
```yaml
---
name: skill-name                    # lowercase-with-hyphens only
description: |
  Action description with keywords.
  Use when: [trigger scenarios]
  Keywords: keyword1, keyword2
allowed-tools: Read, Edit, Bash(git *)
---
```

**Common allowed-tools patterns:**
- File operations: `Read, Edit, Write, Glob, Grep`
- Git operations: `Bash(git status), Bash(git diff *), Bash(git log *)`
- Git commits: `Bash(git add *), Bash(git commit *)`
- Package management: `Bash(npm *), Bash(pip *)`
- Path restrictions: `Edit(/src/**), Write(/dist/**)`

### Quality Principles Demonstrated

From the retrospective and examples in this repo:
1. Always read relevant code before modifying
2. Test before committing (even manual testing catches obvious bugs)
3. Code review is mandatory, not optional
4. Context reading takes 2 minutes but saves 20 minutes of debugging
5. TDD prevents bugs from happening in the first place

## Notes for Future Claude Instances

When working in this repository:
- This is educational/workshop material, not production code
- Focus on clarity and teaching value over brevity
- Real case studies (coding-agent-retrospective.md) are more valuable than theoretical examples
- Bilingual content serves a broader audience - maintain both when updating foundational guides
- The slide-deck/ folder contains presentation materials - treat as read-only unless explicitly asked to modify
