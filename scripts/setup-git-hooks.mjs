import { chmodSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const gitDir = resolve(repoRoot, '.git');

if (process.env.CI) {
  console.log('Skipping git hook installation on CI.');
  process.exit(0);
}

if (!existsSync(gitDir)) {
  console.log('Skipping git hook installation (no .git directory).');
  process.exit(0);
}

const hooksDir = resolve(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });

const hookPath = resolve(hooksDir, 'pre-commit');
const hookContents = `#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"
if [ "\${SKIP_SLIDES_SYNC:-0}" = "1" ]; then
  echo "[pre-commit] SKIP_SLIDES_SYNC=1 -> skipping slide sync"
  exit 0
fi

node scripts/pre-commit-slides.mjs
`;

writeFileSync(hookPath, hookContents, 'utf8');
chmodSync(hookPath, 0o755);

console.log('Installed .git/hooks/pre-commit -> node scripts/pre-commit-slides.mjs');
