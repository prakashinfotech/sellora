---
name: code-review
description: 'Review code changes before pushing to ensure no sensitive files, hardcoded secrets, or error-prone code are included. Use before committing or pushing changes.'
argument-hint: 'Optional: specify focus area (e.g., security, env files, error code)'
---

# Code Review Skill

## When to Use

- Before committing changes to check for security issues
- Before pushing to ensure no sensitive data is exposed
- When reviewing staged changes for potential problems
- To verify code quality and prevent accidental commits of secrets

## Procedure

1. Check git status and staged changes for sensitive files (.env, .env.local, config files with secrets).
2. Scan modified code files for hardcoded API keys, passwords, tokens, or other secrets.
3. Look for error-prone code: console.log statements, debugger, TODO/FIXME comments, incomplete error handling.
4. Verify no environment variables or configuration keys are directly embedded in source code.
5. Ensure no database credentials, SMTP passwords, or other sensitive data is exposed.
6. Check for any files that should be in .gitignore but might be staged.
7. Provide a summary of findings and recommendations for fixes.