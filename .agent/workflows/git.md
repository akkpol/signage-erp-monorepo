---
description: Git workflow and commit conventions for SignageERP
---

# SignageERP Git Workflow

Best practices for version control on SignageERP project.

## Commit Message Convention

### Format
```
<type>(<scope>): <subject>

<body> (optional)
```

### Types
- **feat** - New feature
- **fix** - Bug fix
- **refactor** - Code refactoring (no behavior change)
- **style** - Code style/formatting (no logic change)
- **docs** - Documentation only
- **chore** - Build/config changes
- **test** - Adding/updating tests
- **perf** - Performance improvements

### Examples
```bash
# Good commits
git commit -m "feat(pricing): add discount percentage calculation"
git commit -m "fix(api): resolve module resolution error"
git commit -m "refactor(types): reorganize Material interface"
git commit -m "docs: update README with setup instructions"

# Bad commits (avoid)
git commit -m "update"
git commit -m "fix bug"
git commit -m "wip"
```

## Daily Workflow

### 1. Check Status
```bash
git status
git diff  # See changes
```

### 2. Stage Files
// turbo
```bash
# Stage specific files
git add apps/api/src/pricing/pricing.service.ts

# Stage all changes (use carefully!)
git add .

# Stage all in a directory
git add apps/api/
```

### 3. Commit
```bash
git commit -m "feat(pricing): implement labor cost calculation"
```

### 4. Push to GitHub
```bash
git push origin main
```

## Branching Strategy (Simple)

For solo dev, keep it simple:

### Main Branch (main)
- Working code only
- Test before pushing

### Feature Branches (optional)
```bash
# Create feature branch
git checkout -b feature/material-crud

# Work on feature...
git add .
git commit -m "feat(materials): add CRUD endpoints"

# Merge back to main
git checkout main
git merge feature/material-crud
git push

# Delete feature branch
git branch -d feature/material-crud
```

## Commit Frequency

### ✅ Commit When:
- ✅ Complete a logical unit (1 feature/fix)
- ✅ Before switching tasks
- ✅ End of work session
- ✅ After tests pass

### ❌ Don't Commit:
- ❌ Code that doesn't compile
- ❌ Half-finished features (unless WIP branch)
- ❌ Commented-out code (delete it)
- ❌ Sensitive data (.env files)

## .gitignore Best Practices

Already configured, but verify:
```bash
# View .gitignore
cat .gitignore

# Check if file would be ignored
git check-ignore -v <file>
```

**Critical items to ignore:**
- `node_modules/`
- `.env` and `.env*.local`
- `dist/` and `build/`
- `.next/`
- `*.db` (SQLite database)

## Useful Git Commands

### View History
```bash
# Recent commits
git log --oneline -10

# Changes in specific file
git log --oneline apps/api/src/pricing/pricing.service.ts

# Detailed log
git log --graph --all --decorate
```

### Undo Changes

**Unstage file:**
```bash
git restore --staged <file>
```

**Discard local changes:**
```bash
git restore <file>  # Careful! This deletes changes
```

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Amend last commit message:**
```bash
git commit --amend -m "New message"
```

### Sync with GitHub

```bash
# Pull latest changes
git pull origin main

# Force push (dangerous, only if solo)
git push --force origin main
```

## Commit Checklist

Before committing:
- [ ] Code compiles/runs
- [ ] No console.log() left in production code
- [ ] No commented-out code
- [ ] Updated relevant documentation
- [ ] Tested the feature/fix
- [ ] Clear, descriptive commit message

## When to Push

### Push Immediately:
- ✅ End of work session (backup)
- ✅ Working feature complete
- ✅ Important milestone

### Don't Push Yet:
- ❌ Work in progress (use WIP branch)
- ❌ Experimental/broken code
- ❌ Unfinished refactoring

## Typical Work Session

```bash
# 1. Start work
git status                    # Check current state
git pull origin main          # Get latest

# 2. Make changes
# ... edit files ...

# 3. Review changes
git status
git diff

# 4. Commit
git add apps/api/src/materials/
git commit -m "feat(materials): add Material CRUD API"

# 5. Push
git push origin main

# 6. Verify on GitHub
# Open https://github.com/akkpol/signage-erp-monorepo
```

## Emergency: Recover Lost Work

**Dropped stash:**
```bash
git fsck --lost-found
git show <commit-hash>
```

**Deleted branch:**
```bash
git reflog
git checkout -b recovered-branch <commit-hash>
```

## Best Practices Summary

1. ✅ **Commit often** - Small, logical commits
2. ✅ **Clear messages** - Use conventional format
3. ✅ **Test first** - Don't commit broken code
4. ✅ **Push regularly** - Backup your work
5. ✅ **Review diffs** - Know what you're committing
6. ❌ **No secrets** - Never commit .env files
7. ❌ **No generated files** - Check .gitignore

## Git Aliases (Optional Speed Boost)

Add to `~/.gitconfig`:
```ini
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  unstage = restore --staged
  last = log -1 HEAD
  visual = log --graph --oneline --all
```

Usage:
```bash
git st      # instead of git status
git ci -m   # instead of git commit -m
```

---

**Remember:** Git is your safety net. Commit often, push regularly! 🚀
