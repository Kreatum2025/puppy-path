#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = process.cwd();

const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '.expo',
  'android',
  'ios',
]);

const EXCLUDED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'claude-guard.mjs',
]);

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
const SCANNED_EXTENSIONS = new Set([...CODE_EXTENSIONS, '.json', '.env']);

const SECRET_PATTERNS = [
  { name: 'private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: 'AWS access key id', re: /AKIA[0-9A-Z]{16}/ },
  { name: 'Google API key', re: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'Slack token', re: /xox[baprs]-[0-9A-Za-z-]{10,}/ },
  { name: 'Stripe live secret key', re: /sk_live_[0-9A-Za-z]{16,}/ },
  {
    name: 'hardcoded secret assignment',
    re: /\b(SECRET|PASSWORD|PASSWD|PRIVATE_KEY|ACCESS_TOKEN|API_KEY)\b\s*[:=]\s*["'][^"']{12,}["']/i,
  },
];

const PLACEHOLDER_PATTERN = /your[_-]|changeme|xxxx|<[^>]+>|placeholder|example|dummy/i;
const DEBUGGER_PATTERN = /(^|[^\w.])debugger\b/;
const CONSOLE_LOG_PATTERN = /console\.log\s*\(/;

let blockingIssues = 0;
const warnings = [];

function shouldSkipDir(name) {
  return EXCLUDED_DIRS.has(name);
}

function shouldSkipFile(name) {
  return EXCLUDED_FILES.has(name) || name.endsWith('.example');
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) {
        walk(fullPath, files);
      }
      continue;
    }

    if (entry.isFile() && !shouldSkipFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

for (const file of walk(ROOT)) {
  const ext = extname(file);

  if (!SCANNED_EXTENSIONS.has(ext)) {
    continue;
  }

  let text;

  try {
    text = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  const rel = relative(ROOT, file).split(/[\\/]/).join('/');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    for (const { name, re } of SECRET_PATTERNS) {
      if (re.test(line) && !PLACEHOLDER_PATTERN.test(line)) {
        console.error(`BLOCKED: possible secret (${name})`);
        console.error(`  ${rel}:${lineNumber}: ${line.trim()}`);
        blockingIssues++;
      }
    }

    if (CODE_EXTENSIONS.has(ext) && DEBUGGER_PATTERN.test(line)) {
      console.error('BLOCKED: debugger statement');
      console.error(`  ${rel}:${lineNumber}: ${line.trim()}`);
      blockingIssues++;
    }

    if (CODE_EXTENSIONS.has(ext) && CONSOLE_LOG_PATTERN.test(line)) {
      warnings.push(`  ${rel}:${lineNumber}: ${line.trim()}`);
    }
  });
}

if (warnings.length > 0) {
  console.error(`WARNING: ${warnings.length} console.log call(s) found (not blocking):`);
  console.error(warnings.join('\n'));
}

if (blockingIssues > 0) {
  console.error(`\nclaude-guard: ${blockingIssues} blocking issue(s) found.`);
  process.exit(2);
}

console.log('claude-guard: OK (no blocking issues).');
