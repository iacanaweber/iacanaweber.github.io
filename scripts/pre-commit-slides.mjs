import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  if (path === 'config/slides.json') return true;
  if (!path.startsWith('aulas/')) return false;
  return /\.(pptx|tex)$/i.test(path);
}

function loadSlideMappings() {
  const configPath = resolve(process.cwd(), 'config', 'slides.json');
  const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
  const slides = Array.isArray(parsed.slides) ? parsed.slides : [];

  const pptxPaths = new Set();
  const latexDirs = [];

  for (const slide of slides) {
    if (typeof slide.pptxPath === 'string') {
      pptxPaths.add(slide.pptxPath.replace(/\\/g, '/'));
    }
    if (typeof slide.texDir === 'string') {
      latexDirs.push(slide.texDir.replace(/\\/g, '/').replace(/\/+$/, ''));
    }
  }

  return { pptxPaths, latexDirs };
}

function ensureSourcesAreMapped(staged) {
  const { pptxPaths, latexDirs } = loadSlideMappings();
  const unmapped = [];

  for (const file of staged) {
    if (!file.startsWith('aulas/')) continue;

    if (/\.pptx$/i.test(file)) {
      if (!pptxPaths.has(file)) unmapped.push(file);
      continue;
    }

    if (/\.tex$/i.test(file)) {
      const normalized = file.replace(/\\/g, '/');
      const isMappedLatex = latexDirs.some(dir => normalized.startsWith(`${dir}/`));
      if (!isMappedLatex) unmapped.push(file);
    }
  }

  if (unmapped.length > 0) {
    console.error('[pre-commit] Found slide source files not mapped in config/slides.json:');
    for (const file of unmapped) console.error(`  - ${file}`);
    console.error('[pre-commit] Add these files to config/slides.json before committing.');
    process.exit(1);
  }
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

  ensureSourcesAreMapped(staged);

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
