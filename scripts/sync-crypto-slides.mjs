import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const configPath = join(repoRoot, 'config', 'css-crypto-slides.json');
const pdfOutputDir = join(repoRoot, 'public', 'assets', 'pdfs', 'css', 'crypto');
const generatedDir = join(repoRoot, 'src', 'content', 'resources', 'generated');
const legacyGeneratedDir = join(repoRoot, 'src', 'content', 'resources', '_generated');
const texBuildRoot = join(tmpdir(), 'css-crypto-slides-build');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function toSlug(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function yamlQuote(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

function runPdflatex(texDir, outDir) {
  for (let i = 0; i < 2; i += 1) {
    const result = spawnSync(
      'pdflatex',
      ['-interaction=nonstopmode', '-halt-on-error', `-output-directory=${outDir}`, 'main.tex'],
      { cwd: texDir, stdio: 'pipe', encoding: 'utf8' }
    );
    if (result.status !== 0) {
      const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
      const lines = output.split('\n');
      const errorLine = lines.find(line => line.trim().startsWith('! '))?.trim();
      const sourceLine = lines.find(line => /^\s*l\.\d+/.test(line))?.trim();
      const message = errorLine
        ? `${errorLine.replace(/^!\s*/, '')}${sourceLine ? ` (${sourceLine})` : ''}`
        : `pdflatex failed with exit code ${result.status}`;
      const logPath = join(outDir, 'main.log');
      throw new Error(`LaTeX compile error in ${texDir}/main.tex: ${message}. See ${logPath}`);
    }
  }
}

function verifyLatexEnvironment() {
  const checks = [
    { file: 'brazil.ldf', packageHint: 'texlive-lang-portuguese' },
    { file: 'beamer.cls', packageHint: 'texlive-latex-recommended' },
  ];

  for (const check of checks) {
    const result = spawnSync('kpsewhich', [check.file], { encoding: 'utf8' });
    if (result.status !== 0 || !result.stdout.trim()) {
      throw new Error(
        `Missing LaTeX dependency: ${check.file}. Install package: ${check.packageHint}`
      );
    }
  }
}

function cleanupDirectory(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function ensureDirectory(path) {
  mkdirSync(path, { recursive: true });
}

function isLatexArtifact(fileName) {
  return [
    '.aux',
    '.log',
    '.out',
    '.toc',
    '.nav',
    '.snm',
    '.vrb',
    '.fls',
    '.fdb_latexmk',
    '.synctex.gz',
    '.xdv',
    '.dvi',
    '.bbl',
    '.blg',
    '.lof',
    '.lot',
    '.lol',
    '.pdf',
  ].some(ext => fileName.endsWith(ext));
}

function latestSourceMtimeMs(dir) {
  let latest = 0;
  const stack = [dir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (isLatexArtifact(entry.name)) continue;
      const mtime = statSync(fullPath).mtimeMs;
      if (mtime > latest) latest = mtime;
    }
  }

  return latest;
}

function needsRebuild(texDir, outputPdfPath) {
  if (!existsSync(outputPdfPath)) return true;
  const sourceMtime = latestSourceMtimeMs(texDir);
  const pdfMtime = statSync(outputPdfPath).mtimeMs;
  return sourceMtime > pdfMtime;
}

function generateMarkdown(slide, classValue, suffixIndex) {
  const classSuffix = classValue == null ? 'general' : `class-${toSlug(classValue)}`;
  const fileName = `${String(slide.order).padStart(4, '0')}-${slide.id}-${classSuffix}-${suffixIndex}.md`;
  const filePath = join(generatedDir, fileName);

  const lines = [
    '---',
    `title: ${yamlQuote(slide.title)}`,
    'course: "css"',
    'type: "slides"',
    `pdfPath: ${yamlQuote(`/assets/pdfs/css/crypto/${slide.pdfName}`)}`,
    'column: "materiais"',
    `order: ${slide.order + suffixIndex}`,
  ];

  if (classValue != null) {
    if (typeof classValue === 'number') {
      lines.push(`class: ${classValue}`);
    } else {
      lines.push(`class: ${yamlQuote(classValue)}`);
    }
  }

  lines.push('---', '');
  writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
  assert(existsSync(configPath), `Missing config: ${configPath}`);
  const parsed = JSON.parse(readFileSync(configPath, 'utf8'));
  const slides = parsed.slides;

  assert(Array.isArray(slides) && slides.length > 0, 'Config must contain a non-empty slides array');
  verifyLatexEnvironment();

  ensureDirectory(pdfOutputDir);
  cleanupDirectory(generatedDir);
  rmSync(legacyGeneratedDir, { recursive: true, force: true });
  cleanupDirectory(texBuildRoot);

  let compiledCount = 0;
  let skippedCount = 0;

  for (const slide of slides) {
    assert(slide.id, 'Slide id is required');
    assert(slide.title, `Slide ${slide.id} is missing title`);
    assert(slide.texDir, `Slide ${slide.id} is missing texDir`);
    assert(slide.pdfName, `Slide ${slide.id} is missing pdfName`);
    assert(Number.isFinite(slide.order), `Slide ${slide.id} has invalid order`);

    const texDir = resolve(repoRoot, slide.texDir);
    const texMain = join(texDir, 'main.tex');
    assert(existsSync(texMain), `Missing TeX source: ${texMain}`);
    const finalPdfPath = join(pdfOutputDir, slide.pdfName);

    if (needsRebuild(texDir, finalPdfPath)) {
      const buildOutDir = join(texBuildRoot, slide.id);
      cleanupDirectory(buildOutDir);
      runPdflatex(texDir, buildOutDir);

      const producedPdf = join(buildOutDir, 'main.pdf');
      assert(existsSync(producedPdf), `PDF was not produced for ${slide.id}`);
      copyFileSync(producedPdf, finalPdfPath);
      compiledCount += 1;
    } else {
      skippedCount += 1;
    }

    if (Array.isArray(slide.classes) && slide.classes.length > 0) {
      slide.classes.forEach((classValue, index) => generateMarkdown(slide, classValue, index));
    } else {
      generateMarkdown(slide, null, 0);
    }
  }

  const generatedFiles = readdirSync(generatedDir).filter(name => name.endsWith('.md')).length;
  console.log(
    `Slide sync complete: ${compiledCount} compiled, ${skippedCount} up-to-date, ${generatedFiles} resource entries generated.`
  );
}

main();
