import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  unlinkSync,
} from 'node:fs';

/**
 * Publica em public/aulas/ SOMENTE o que deve ser servido pelo site.
 *
 * Substitui o antigo symlink public/aulas → ../aulas, que publicava a árvore
 * de fontes inteira (53 .tex — incluindo main_gabarito.tex com respostas —,
 * PDFs de solução nunca linkados e gabarito.txt), tudo acessível por URL
 * adivinhável.
 *
 * Regras:
 *  - fontes e artefatos LaTeX/PPTX nunca são publicados;
 *  - arquivos de solução (gabarito/soluções/respostas/correto.c) só são
 *    publicados quando REFERENCIADOS no conteúdo (pdfPath/solutionPdfPath
 *    em src/content/resources/*.md ou outputPdfPath em config/slides.json);
 *  - todo o resto (PDFs de aula, zips/txt/código de labs, imagens) é
 *    publicado — URLs /aulas/... já distribuídas continuam funcionando.
 *
 * Roda como predev/prebuild (local e CI). O diretório public/aulas/ é
 * gitignored e totalmente gerenciado por este script.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const sourceRoot = join(repoRoot, 'aulas');
const publishRoot = join(repoRoot, 'public', 'aulas');

const SOURCE_EXTENSIONS = /\.(tex|pptx|ppt|sty|cls|bib)$/i;
const LATEX_ARTIFACTS = /\.(aux|log|out|toc|nav|snm|vrb|fls|fdb_latexmk|synctex\.gz|xdv|dvi|bbl|blg|lof|lot|lol)$/i;

function isSolutionFile(fileName) {
  const normalized = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return /gabarito|solucoes|solucao|respostas|correto\.c$/.test(normalized);
}

function collectReferencedPaths() {
  const referenced = new Set();
  const addPath = value => {
    if (typeof value === 'string' && value.startsWith('/aulas/')) {
      referenced.add(value.replace(/^\/+/, ''));
    }
  };

  const resourcesDir = join(repoRoot, 'src', 'content', 'resources');
  for (const name of readdirSync(resourcesDir)) {
    if (!name.endsWith('.md')) continue;
    const text = readFileSync(join(resourcesDir, name), 'utf8');
    for (const match of text.matchAll(/(?:pdfPath|solutionPdfPath):\s*"([^"]+)"/g)) {
      addPath(match[1]);
    }
  }

  const slidesConfig = JSON.parse(readFileSync(join(repoRoot, 'config', 'slides.json'), 'utf8'));
  for (const slide of slidesConfig.slides ?? []) {
    addPath(slide.outputPdfPath);
  }

  return referenced;
}

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, out);
    } else if (entry.isFile()) {
      out.push(fullPath);
    }
  }
  return out;
}

function shouldPublish(relPath, referenced) {
  const fileName = relPath.split('/').pop();
  if (SOURCE_EXTENSIONS.test(fileName) || LATEX_ARTIFACTS.test(fileName)) return false;
  if (isSolutionFile(fileName)) return referenced.has(`aulas/${relPath}`);
  return true;
}

function main() {
  if (!existsSync(sourceRoot)) {
    console.error(`[publish-assets] Diretório de origem não encontrado: ${sourceRoot}`);
    process.exit(1);
  }

  // Transição: remove o antigo symlink, se ainda existir.
  if (existsSync(publishRoot) || (() => { try { lstatSync(publishRoot); return true; } catch { return false; } })()) {
    if (lstatSync(publishRoot).isSymbolicLink()) {
      unlinkSync(publishRoot);
      console.log('[publish-assets] Symlink public/aulas removido (era o vazamento de fontes/gabaritos).');
    }
  }
  mkdirSync(publishRoot, { recursive: true });

  const referenced = collectReferencedPaths();
  const published = new Set();
  let copied = 0;
  let retainedSolutions = 0;
  let retainedSources = 0;

  for (const absPath of walkFiles(sourceRoot)) {
    const relPath = relative(sourceRoot, absPath).split('\\').join('/');
    if (!shouldPublish(relPath, referenced)) {
      const fileName = relPath.split('/').pop();
      if (isSolutionFile(fileName)) retainedSolutions += 1;
      else retainedSources += 1;
      continue;
    }

    published.add(relPath);
    const destPath = join(publishRoot, relPath);
    const srcStat = statSync(absPath);
    if (existsSync(destPath)) {
      const destStat = statSync(destPath);
      if (destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs) continue;
    }
    mkdirSync(dirname(destPath), { recursive: true });
    copyFileSync(absPath, destPath);
    copied += 1;
  }

  // Remove do publish o que não deve mais estar lá (arquivo apagado na origem
  // ou recém-negado pelas regras).
  let pruned = 0;
  if (existsSync(publishRoot)) {
    for (const absPath of walkFiles(publishRoot)) {
      const relPath = relative(publishRoot, absPath).split('\\').join('/');
      if (!published.has(relPath)) {
        rmSync(absPath, { force: true });
        pruned += 1;
      }
    }
  }

  console.log(
    `[publish-assets] ${published.size} arquivos publicados (${copied} copiados agora, ${pruned} removidos), ` +
    `${retainedSources} fontes e ${retainedSolutions} arquivos de solução retidos.`
  );
}

main();
