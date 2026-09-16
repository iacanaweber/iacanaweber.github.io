import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { FlatResource } from './resources';

interface ScheduleLike {
  id: string;
  label: string;
  entries: { number: number | null; description: string }[];
}

function parseClassRange(val: string | number): { from: number; to: number } | null {
  const s = String(val);
  const parts = s.split('-').map(p => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { from: Math.min(parts[0], parts[1]), to: Math.max(parts[0], parts[1]) };
  }
  const n = parseInt(s, 10);
  if (isNaN(n)) return null;
  return { from: n, to: n };
}

/** Um path de conteúdo é válido se existe na árvore do repo (aulas/) ou em public/. */
function contentFileExists(path: string): boolean {
  const rel = path.replace(/^\/+/, '');
  const cwd = process.cwd();
  return existsSync(join(cwd, rel)) || existsSync(join(cwd, 'public', rel));
}

/**
 * Validação de integridade do conteúdo, executada em build time.
 *
 * Erros (quebram o `astro build`; em dev apenas logam):
 *  - pdfPath/solutionPdfPath apontando para arquivo inexistente (classe do
 *    gabarito-404 que ficou meses em produção);
 *  - recurso vinculado a número de aula que não existe em nenhum cronograma
 *    (hoje ele some da página em silêncio).
 *
 * Avisos (nunca quebram):
 *  - mesmo pdfPath registrado com aulas divergentes em cadastros diferentes;
 *  - faixa de aulas parcialmente fora do cronograma;
 *  - turmas do mesmo curso com descrições divergentes para a mesma aula
 *    (numeração desalinhada por feriados — FSC LM/NP).
 */
export function validateCourseContent(
  courseSlug: string,
  resources: FlatResource[],
  schedules: ScheduleLike[]
): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  // ── 1. Arquivos referenciados existem? ────────────────────────────────
  for (const r of resources) {
    for (const [field, path] of [
      ['pdfPath', r.data.pdfPath],
      ['solutionPdfPath', r.data.solutionPdfPath],
    ] as const) {
      if (path && !contentFileExists(path)) {
        errors.push(`[${courseSlug}] "${r.data.title}": ${field} aponta para arquivo inexistente: ${path}`);
      }
    }
  }

  // ── 2. Vínculos de aula existem no cronograma? ────────────────────────
  const schedulesWithEntries = schedules.filter(s => s.entries.length > 0);
  if (schedules.length > 0 && schedulesWithEntries.length === 0) {
    warnings.push(
      `[${courseSlug}] cronograma vazio (SARC indisponível?) — validação de números de aula pulada.`
    );
  } else {
    const classSets = schedulesWithEntries.map(s => ({
      label: s.label,
      classes: new Set(s.entries.map(e => e.number).filter((n): n is number => n != null)),
    }));

    for (const r of resources) {
      if (r.data.class == null) continue;
      const range = parseClassRange(r.data.class);
      if (!range) {
        errors.push(`[${courseSlug}] "${r.data.title}": class inválido: "${r.data.class}"`);
        continue;
      }
      const wanted: number[] = [];
      for (let c = range.from; c <= range.to; c++) wanted.push(c);

      // Órfão = nenhuma das aulas existe em nenhum cronograma do curso.
      const anywhere = wanted.some(c => classSets.some(s => s.classes.has(c)));
      if (!anywhere) {
        errors.push(
          `[${courseSlug}] "${r.data.title}": aula ${r.data.class} não existe no cronograma — o material sumiria da página.`
        );
        continue;
      }
      const missing = wanted.filter(c => !classSets.every(s => s.classes.has(c)));
      if (missing.length > 0 && classSets.length > 0) {
        const missingEverywhere = wanted.filter(c => !classSets.some(s => s.classes.has(c)));
        if (missingEverywhere.length > 0) {
          warnings.push(
            `[${courseSlug}] "${r.data.title}": faixa ${r.data.class} parcialmente fora do cronograma (faltam: ${missingEverywhere.join(', ')}).`
          );
        }
      }
    }
  }

  // ── 3. Mesmo PDF em aulas divergentes? ────────────────────────────────
  // Um único cadastro pode pinar o mesmo deck em várias aulas de propósito
  // (classes: ["21-22", 24]) — isso gera itens com mesmo título e mesma
  // coluna, e é legítimo. Divergência suspeita é o mesmo PDF em CADASTROS
  // diferentes (coluna ou título diferentes) apontando para aulas distintas.
  const byPdf = new Map<string, { class: string; column: string; title: string }[]>();
  for (const r of resources) {
    if (!r.data.pdfPath || r.data.class == null) continue;
    if (!byPdf.has(r.data.pdfPath)) byPdf.set(r.data.pdfPath, []);
    byPdf.get(r.data.pdfPath)!.push({
      class: String(r.data.class),
      column: r.data.column ?? '(auto)',
      title: r.data.title,
    });
  }
  for (const [pdf, uses] of byPdf) {
    const suspicious = uses.some(a =>
      uses.some(b => a.class !== b.class && (a.column !== b.column || a.title !== b.title))
    );
    if (suspicious) {
      const detail = uses.map(u => `aula ${u.class} (${u.column})`).join(' vs ');
      warnings.push(
        `[${courseSlug}] mesmo PDF vinculado a aulas divergentes em cadastros diferentes: ${detail} — ${pdf} — decida qual é a correta.`
      );
    }
  }

  // ── 4. Turmas com numeração/conteúdo desalinhado? ─────────────────────
  if (schedulesWithEntries.length > 1) {
    const [first, ...rest] = schedulesWithEntries;
    const firstByNumber = new Map(
      first.entries.filter(e => e.number != null).map(e => [e.number, e.description])
    );
    for (const other of rest) {
      const diverging: number[] = [];
      for (const e of other.entries) {
        if (e.number == null) continue;
        const ref = firstByNumber.get(e.number);
        if (ref != null && ref.trim() !== e.description.trim()) diverging.push(e.number);
      }
      if (diverging.length > 0) {
        warnings.push(
          `[${courseSlug}] turmas "${first.label}" e "${other.label}" divergem no conteúdo das aulas: ${diverging.join(', ')} — materiais vinculados por número podem cair na linha errada para uma delas.`
        );
      }
    }
  }

  for (const w of warnings) console.warn(`⚠ [validate-content] ${w}`);

  if (errors.length > 0) {
    const message = `Validação de conteúdo falhou:\n  - ${errors.join('\n  - ')}`;
    if (import.meta.env.PROD) {
      throw new Error(message);
    }
    console.error(`✗ [validate-content] (dev — o build de produção FALHARIA)\n${message}`);
  }
}
