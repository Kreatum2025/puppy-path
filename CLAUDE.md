@AGENTS.md

## Verification rules

- Every coding task must pass the verify command before being considered complete.
- Do not claim completion if verify fails.
- Do not change unrelated files.
- Do not remove functionality to make checks pass.
- Do not rename environment variables without explicit approval.
- Do not alter database schema unless explicitly requested.
- Always report changed files, verification result and remaining risks.

### How to verify

Run `npm run verify` (lint + typecheck + guard). It is also enforced by the
Claude Code Stop hook in `.claude/settings.json`.

`format:check` (Prettier) exists as a separate script but is intentionally NOT
part of `verify` yet: Prettier was added after the code was written, so ~37
existing files report formatting differences. This is a known baseline, not a
regression. Do not mass-format the codebase to "fix" it; a dedicated formatting
baseline pass should be done separately and reviewed on its own.
