# Iaçanã Ianiski Weber - Academic Site

Personal academic website built with Astro for course schedules/materials and publications.

## Overview
This repository powers a static website with:
- course pages with dynamic schedule tables,
- resources linked per class (including slide PDFs in the **Materiais** column),
- publication pages,
- static full-text search via Pagefind.

## Tech Stack
- Astro 4
- TypeScript content collections (`src/content/config.ts`)
- Pagefind (post-build search index)
- GitHub Actions for deploy to GitHub Pages

## Repository Layout
```text
.
├── aulas/                              # Slide sources (LaTeX and PPTX)
├── config/slides.json                  # Slide source -> PDF/resource mapping
├── scripts/
│   ├── sync-slides.mjs                 # Compile slides and refresh resources
│   ├── pre-commit-slides.mjs           # Commit-time slide checks/automation
│   └── setup-git-hooks.mjs             # Installs pre-commit hook
├── public/                             # Static assets served as-is
├── src/
│   ├── components/
│   ├── content/
│   │   ├── courses/
│   │   ├── publications/
│   │   └── resources/
│   ├── cronogramas/                    # Local HTML schedules (fallback/reference)
│   ├── layouts/
│   ├── pages/
│   └── utils/
└── .github/workflows/deploy.yml
```

## Prerequisites
- Node.js 20+
- npm
- For LaTeX slide builds: `pdflatex` with TeX Live packages (`brazil.ldf`, `beamer.cls`).
- For PPTX conversion: PowerPoint via `powershell.exe` (Windows/WSL) or LibreOffice (`soffice`).

## Development
```bash
npm install
npm run dev
```

Main scripts:
- `npm run slides:sync`: compiles all slides configured in `config/slides.json` and updates `src/content/resources/*-materiais.md`.
- `npm run build`: Astro build + Pagefind indexing (does not compile slides).
- `npm run build:ci`: CI-safe build (same output as `build`).
- `npm run preview`: serves `dist/` locally.

## Slide Workflow (Local-First)
Slides are compiled locally and committed as PDFs. CI does not compile slide sources.

1. Add or modify slide source files under `aulas/`.
2. Ensure each new source is mapped in `config/slides.json`.
3. Run `npm run slides:sync`.
4. Commit source changes plus generated PDFs/resource updates.

Pre-commit hook behavior:
- If no staged slide source/config changes are detected, compile is skipped.
- If staged slide sources are detected, `slides:sync` runs automatically.
- If a staged slide source is not mapped in `config/slides.json`, the commit is blocked.

## Deploy
Push to `main` triggers `.github/workflows/deploy.yml`:
1. install Node dependencies,
2. run `npm run build:ci`,
3. deploy `dist/` to GitHub Pages.

## License
- Course content: CC BY-NC-SA 4.0
- Website code: MIT

See `LICENSE` for details.
