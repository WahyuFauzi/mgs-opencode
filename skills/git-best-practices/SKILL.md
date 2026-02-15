---
name: git-best-practices
description: Git workflow fundamentals, commit standards, branching, and collaboration best practices
license: MIT
compatibility: opencode
metadata:
  audience: developers
  experience: intermediate
---

## What I do

Provide practical Git guidance for daily development workflows, focusing on common operations that most teams use regularly.

### Core Areas Covered

**Commit Standards**
- Conventional Commits format (type(scope): description)
- Writing clear, atomic commit messages
- When to use `--amend` or rebase
- Squashing commits before merging

**Branch Management**
- Feature branch workflows (Git Flow simplified)
- Feature branch naming conventions
- When to create, merge, or delete branches
- Handling pull requests and code reviews

**Essential Operations**
- Using `git stash` for context switching
- Cherry-picking commits between branches
- Resolving merge conflicts safely
- Interactive rebase for cleaning up history

**Team Collaboration**
- Pull request etiquette
- Merging strategies (merge vs. rebase)
- Managing release branches
- Tagging versions

## When to use me

Use this skill when you need to:
- Set up Git workflows for a project
- Write better commit messages
- Resolve merge conflicts
- Clean up messy commit history
- Establish branching conventions
- Manage releases with tags
- Guide team members on Git practices

### Common Scenarios

- **Setting up a new project**: Establish commit conventions and branch strategy
- **Code reviews**: Ensure consistent commit message format
- **Conflicts**: Resolve merge conflicts cleanly
- **Team onboarding**: Teach Git workflow to new team members
- **Release preparation**: Tag versions and manage release branches
- **History cleanup**: Squash or rebase commits before merging

## Guidelines

### Commit Message Format

Follow the Conventional Commits specification:

```
type(scope): subject

body (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(api): add user authentication endpoint

Implement JWT-based authentication with refresh tokens.
```

```
fix(ui): resolve race condition in loading spinner

The spinner was showing briefly after data loaded.
```

### Branch Naming

```
feature/description
bugfix/description
hotfix/description
release/version
docs/topic
test/coverage-area
```

### Atomic Commits

- **DO**: Make one logical change per commit
- **DO**: Test each commit independently
- **DON'T**: Mix unrelated changes
- **DON'T**: Commit broken code with "WIP" messages

### Rebase vs. Merge

**Use Rebase When:**
- Cleaning up local feature branches before PR
- Maintaining linear history
- Your branch is ahead of main

**Use Merge When:**
- Preserving the context of when changes were merged
- Collaborating on shared branches
- Merging release branches

### Stashing Workflow

```bash
# Save current work
git stash push -m "work in progress"

# Switch branches and do other work
git checkout other-branch

# Come back and restore
git stash pop
```

### Interactive Rebase

```bash
# Rebase last 3 commits
git rebase -i HEAD~3

# Commands during rebase:
# pick = use commit
# squash = combine with previous
# fixup = combine, discard this message
# drop = remove commit
```

### Resolving Conflicts

1. Open files with conflict markers (`<<<<<<<`)
2. Decide which version to keep or combine both
3. Remove the conflict markers
4. Test your changes
5. Add and commit the resolution

```bash
git status                    # See conflicted files
git add file.js               # Mark as resolved
git commit                    # Complete the merge
```

### Cherry-Picking

```bash
# Pick a specific commit from another branch
git cherry-pick <commit-hash>

# Cherry-pick without committing
git cherry-pick --no-commit <commit-hash>
```

## Common Workflows

### Feature Branch Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make commits
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feature/new-feature

# After review, squash merge into main
```

### Hotfix Workflow

```bash
# Create from main or release branch
git checkout -b hotfix/critical-bug

# Fix, commit, push
git add .
git commit -m "fix: resolve critical bug"
git push

# Merge to main and release branches
```

### Release Workflow

```bash
# Tag a release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release branch
git checkout -b release/v1.0.0
```

## Common Pitfalls to Avoid

- **Large commits** - Break into smaller, logical changes
- **Vague messages** - Be specific about what and why
- **Rebase shared branches** - Only rebase your own work
- **Force push without care** - Can rewrite others' history
- **Ignore conflicts** - Don't just pick one side randomly
- **Commit sensitive data** - Use .gitignore properly

## Useful Commands Reference

```bash
# View history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Unstage a file
git restore --staged file.js

# Undo local changes (careful!)
git restore file.js

# Compare branches
git diff main..feature-branch

# See who changed what
git blame file.js
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials)

## Ask Before Proceeding

Clarify these questions when needed:
- What is the current Git workflow (Git Flow, trunk-based, custom)?
- How big is the team and how do they collaborate?
- What is the release process (continuous, periodic, ad-hoc)?
- Is history preservation important or can commits be rewritten?
