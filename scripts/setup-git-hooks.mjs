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

if ! command -v kpsewhich >/dev/null 2>&1 || ! kpsewhich brazil.ldf >/dev/null 2>&1; then
  echo "[pre-commit] Missing LaTeX dependency (brazil.ldf)."
  if [ "\${AUTO_INSTALL_LATEX_DEPS:-1}" = "1" ] && command -v apt-get >/dev/null 2>&1; then
    echo "[pre-commit] Attempting automatic install via apt-get..."
    sudo apt-get update
    sudo apt-get install -y \
      texlive-latex-recommended \
      texlive-latex-extra \
      texlive-fonts-recommended \
      texlive-pictures \
      texlive-lang-portuguese
  else
    echo "[pre-commit] Auto-install disabled/unavailable."
    echo "[pre-commit] Set AUTO_INSTALL_LATEX_DEPS=1 and use a Debian/Ubuntu system with apt-get."
    exit 1
  fi

  if ! command -v kpsewhich >/dev/null 2>&1 || ! kpsewhich brazil.ldf >/dev/null 2>&1; then
    echo "[pre-commit] LaTeX dependencies are still missing after installation attempt."
    exit 1
  fi
fi

npm run slides:sync
`;

writeFileSync(hookPath, hookContents, 'utf8');
chmodSync(hookPath, 0o755);

console.log('Installed .git/hooks/pre-commit -> npm run slides:sync');
