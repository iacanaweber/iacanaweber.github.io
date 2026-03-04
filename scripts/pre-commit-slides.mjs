import { spawnSync } from 'node:child_process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: 'pipe',
    encoding: 'utf8',
    ...options,
  });
  if (result.status !== 0) {
    const stderr = (result.stderr ?? '').trim();
    const stdout = (result.stdout ?? '').trim();
    const detail = stderr || stdout;
    throw new Error(detail || `${command} ${args.join(' ')} failed with code ${result.status}`);
  }
  return result.stdout ?? '';
}

function hasCompileTrigger(path) {
  if (path === 'config/css-slides.json') return true;
  if (!path.startsWith('aulas/')) return false;
  return /\.(pptx|tex)$/i.test(path);
}

function main() {
  const staged = run('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const shouldCompile = staged.some(hasCompileTrigger);
  if (!shouldCompile) {
    console.log('[pre-commit] No staged PPTX/LaTeX slide changes. Skipping compilation.');
    return;
  }

  console.log('[pre-commit] Slide source changes detected. Running slides compilation...');
  const sync = spawnSync('npm', ['run', 'slides:sync'], {
    stdio: 'inherit',
    encoding: 'utf8',
  });
  if (sync.status !== 0) {
    process.exit(sync.status ?? 1);
  }

  const addGenerated = spawnSync(
    'bash',
    ['-lc', 'git add public/assets/pdfs src/content/resources/*-materiais.md'],
    { stdio: 'inherit', encoding: 'utf8' }
  );
  if (addGenerated.status !== 0) {
    process.exit(addGenerated.status ?? 1);
  }

  console.log('[pre-commit] Added generated PDFs/resources to commit.');
}

main();
