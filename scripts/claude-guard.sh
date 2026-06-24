#!/usr/bin/env bash
#
# claude-guard.sh — lightweight AI safety checks for code changes.
# Blocks obvious committed secrets and `debugger` statements; warns on
# stray console.log. Exits 2 on any blocking finding so it can gate `verify`
# and the Claude Code Stop hook.
#
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Directories and files we never scan.
EXCLUDE_DIR=(
  --exclude-dir=node_modules
  --exclude-dir=.git
  --exclude-dir=dist
  --exclude-dir=build
  --exclude-dir=.next
  --exclude-dir=coverage
  --exclude-dir=.expo
  --exclude-dir=android
  --exclude-dir=ios
)
EXCLUDE_FILE=(
  --exclude=package-lock.json
  --exclude=yarn.lock
  --exclude=pnpm-lock.yaml
  --exclude=bun.lockb
  --exclude=claude-guard.sh
  --exclude=*.example
)

# Code files only (for debugger / console checks).
CODE_INCLUDE=(--include=*.ts --include=*.tsx --include=*.js --include=*.jsx)
# Code + config (for secret checks); placeholders in *.example are excluded above.
SECRET_INCLUDE=(--include=*.ts --include=*.tsx --include=*.js --include=*.jsx --include=*.json --include=*.env)

errors=0

block() {
  # $1 = human description, remaining = matching lines
  shift_desc="$1"; shift
  echo "BLOCKED: $shift_desc" >&2
  printf '%s\n' "$@" >&2
  echo "" >&2
  errors=$((errors + 1))
}

# --- 1. Obvious secrets ---------------------------------------------------
# High-signal patterns that should never appear in source.
SECRET_PATTERNS=(
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'        # private key blocks
  'AKIA[0-9A-Z]{16}'                          # AWS access key id
  'AIza[0-9A-Za-z_\-]{35}'                    # Google API key
  'xox[baprs]-[0-9A-Za-z-]{10,}'              # Slack token
  'sk_live_[0-9A-Za-z]{16,}'                  # Stripe live secret key
  '(SECRET|PASSWORD|PASSWD|PRIVATE_KEY|ACCESS_TOKEN|API_KEY)[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{12,}["'"'"']'
)
for pat in "${SECRET_PATTERNS[@]}"; do
  matches="$(grep -rnIE "${SECRET_INCLUDE[@]}" "${EXCLUDE_DIR[@]}" "${EXCLUDE_FILE[@]}" -- "$pat" . 2>/dev/null || true)"
  # Drop obvious placeholders (your_, changeme, xxxx, <...>, example).
  matches="$(printf '%s' "$matches" | grep -viE 'your_|your-|changeme|xxxx|<[^>]+>|placeholder|example' || true)"
  if [ -n "$matches" ]; then
    block "possible secret matching /$pat/" "$matches"
  fi
done

# --- 2. debugger statements (blocking) ------------------------------------
dbg="$(grep -rnIE "${CODE_INCLUDE[@]}" "${EXCLUDE_DIR[@]}" "${EXCLUDE_FILE[@]}" -- '(^|[^A-Za-z0-9_])debugger[[:space:]]*;?' . 2>/dev/null || true)"
if [ -n "$dbg" ]; then
  block "debugger statement(s) found" "$dbg"
fi

# --- 3. console.log (warning only) ----------------------------------------
clog="$(grep -rnIE "${CODE_INCLUDE[@]}" "${EXCLUDE_DIR[@]}" "${EXCLUDE_FILE[@]}" -- 'console\.log\(' . 2>/dev/null || true)"
if [ -n "$clog" ]; then
  count="$(printf '%s\n' "$clog" | grep -c . || true)"
  echo "WARNING: $count console.log call(s) found (not blocking):" >&2
  printf '%s\n' "$clog" >&2
  echo "" >&2
fi

if [ "$errors" -gt 0 ]; then
  echo "claude-guard: $errors blocking issue(s) found." >&2
  exit 2
fi

echo "claude-guard: OK (no blocking issues)."
