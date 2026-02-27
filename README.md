# Teaching Hub

Academic website built with Astro for course schedules/materials and publications.

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
├── aulas/crypto/                       # LaTeX slide sources
├── config/css-crypto-slides.json       # Mapping slide -> class(es)
├── scripts/
│   ├── sync-crypto-slides.mjs          # Compile LaTeX and generate resources
│   └── setup-git-hooks.mjs             # Installs pre-commit hook
├── public/                             # Static assets served as-is
├── src/
│   ├── components/
│   ├── content/
│   │   ├── courses/
│   │   ├── publications/
│   │   └── resources/
│   ├── cronogramas/                    # Local HTML schedules
│   ├── layouts/
│   ├── pages/
│   └── utils/
└── .github/workflows/deploy.yml
```

## Prerequisites
- Node.js 20+
- npm
- TeX Live packages for slide compilation (`pdflatex` + `brazil.ldf`):
  - Debian/Ubuntu example:
  ```bash
  sudo apt-get update
  sudo apt-get install -y texlive-latex-recommended texlive-latex-extra texlive-fonts-recommended texlive-pictures texlive-lang-portuguese
  ```

## Development
```bash
npm install
npm run dev
```

Main scripts:
- `npm run slides:sync`: compiles `aulas/crypto/*/main.tex` and generates course resources.
- `npm run build`: runs `prebuild` (`slides:sync`), then Astro build + Pagefind.
- `npm run preview`: serves `dist/` locally.

## Automatic Slide Pipeline
`slides:sync` does three things automatically:
1. Compiles all configured LaTeX decks.
2. Writes PDFs to `public/assets/pdfs/css/crypto/`.
3. Generates resource entries in `src/content/resources/generated/`.

Notes:
- Generated outputs are ignored by Git.
- A local `pre-commit` hook runs `npm run slides:sync`.
- CI runs the same flow during `npm run build` before deploy.

## Content Model (Current)
Collections in use:
- `courses`
- `resources`
- `publications`

For class-linked materials in schedule tables, use `resources` with:
- `course: "css"` (or another course slug)
- `type: "slides" | "pdf" | "link" | ...`
- `pdfPath` or `url`
- `class: <number>` or `"X-Y"` for merged rows
- `column: "materiais" | "exercicios" | "extra"`

Example:
```md
---
title: "AES"
course: "css"
type: "slides"
pdfPath: "/assets/pdfs/css/crypto/aes.pdf"
class: "13-14"
column: "materiais"
order: 130
---
```

## Deploy
Push to `main` triggers `.github/workflows/deploy.yml`:
1. install Node dependencies,
2. install TeX dependencies,
3. run `npm run build`,
4. deploy `dist/` to GitHub Pages.

## License
- Course content: CC BY-NC-SA 4.0
- Website code: MIT

See `LICENSE` for details.
