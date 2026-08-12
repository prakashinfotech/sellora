---
name: git-commit-message
description: 'Generate git commit messages based on changes. Use when creating commit messages for staged or unstaged changes.'
argument-hint: 'Optional: specify commit style (e.g., conventional commits) or additional context'
---

# Git Commit Message Generator

## When to Use

- When you have changes to commit and need a descriptive commit message
- For generating conventional commit messages
- To analyze git diff and summarize changes

## Procedure

1. Check the current git status to identify staged and unstaged changes.
2. Retrieve the git diff for the relevant changes (staged by default, or unstaged if specified).
3. Analyze the changes: identify modified files, types of changes (additions, modifications, deletions), and affected components.
4. Generate a commit message that summarizes the changes, optionally following conventional commit format (e.g., feat:, fix:, docs:).
5. Provide the suggested commit message to the user.