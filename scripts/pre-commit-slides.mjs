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

const EXAM_PATH_PATTERN = /(^|[/_\-.])(prova|provas|g1|g2)([/_\-.]|$)/i;

function blockExamMaterial(staged) {
  const examFiles = staged.filter(
    file => file.startsWith('aulas/') && EXAM_PATH_PATTERN.test(file)
  );
  if (examFiles.length > 0) {
    console.error('[pre-commit] BLOQUEADO: material com cara de prova num repositório PÚBLICO:');
    for (const file of examFiles) console.error(`  - ${file}`);
    console.error('[pre-commit] Política: prova nunca entra neste repositório (qualquer coisa');
    console.error('[pre-commit] commitada é visível no GitHub). Guarde provas fora daqui.');
    console.error('[pre-commit] Falso positivo? Renomeie o arquivo ou use git commit --no-verify.');
    process.exit(1);
  }
}

function main() {
  const staged = run('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'])
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  blockExamMaterial(staged);

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

  // Stagea os artefatos que o sync realmente produz: os .md gerados e os PDFs
  // compilados dentro de aulas/ (o caminho antigo, public/assets/pdfs, só
  // contém publicações e nunca recebia os slides — era por isso que "esquecer
  // o git add" publicava PDF desatualizado). PDFs cobertos pelo .gitignore
  // (ex.: material de terceiros) são pulados: git add neles falharia e
  // derrubaria o commit inteiro.
  const addGenerated = spawnSync(
    'bash',
    ['-lc', "git add src/content/resources/*-materiais.md && find aulas -name '*.pdf' -print0 | while IFS= read -r -d '' pdf; do git check-ignore -q \"$pdf\" || git add -- \"$pdf\"; done"],
    { stdio: 'inherit', encoding: 'utf8' }
  );
  if (addGenerated.status !== 0) {
    process.exit(addGenerated.status ?? 1);
  }

  console.log('[pre-commit] Added generated resources and compiled PDFs (aulas/**.pdf) to commit.');
}

main();
