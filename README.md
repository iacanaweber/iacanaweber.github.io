# Teaching Hub

A modern, fast, static course website for hosting university course materials — notes, exercises, homework, exams, and resources. Built with [Astro](https://astro.build) and deployed to [GitHub Pages](https://pages.github.com).

## Technology Choice: Why Astro?

| Criterion | Astro | Jekyll | Next.js |
|-----------|-------|--------|---------|
| Content collections with typed schemas | Built-in | Manual | Manual |
| Markdown-first workflow | Excellent | Excellent | Good |
| JS shipped to client | Zero by default | Zero | Large bundle |
| Build speed | Fast | Medium | Slow |
| GitHub Pages deploy | Via Actions | Native | Via Actions |
| Component model | Any framework | Liquid templates | React required |
| Search integration | Pagefind (static) | Lunr.js | Custom |

**Astro** was chosen because it combines the Markdown-first simplicity of Jekyll with modern DX (TypeScript, content collections with Zod validation, component-based architecture), while shipping **zero JavaScript** by default for excellent performance. Content collections enforce consistent frontmatter across all materials, catching errors at build time.

## Features

- Organized by course with sidebar navigation
- Tag filtering and sorting on material listings
- Site-wide static search via [Pagefind](https://pagefind.app)
- Dark mode with persistent preference
- Math rendering via KaTeX (loaded only when needed)
- RSS feed for updates
- Auto-generated sitemap + SEO metadata
- Print-friendly CSS for notes and exams
- Responsive, accessible, mobile-friendly design
- GitHub Actions CI/CD for automatic deployment

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm (included with Node.js)
- Git

## Quick Start

```bash
# Clone the repository
git clone https://github.com/<your-username>/teaching.git
cd teaching

# Install dependencies
npm install

# Start the development server
npm run dev
```

The site will be available at `http://localhost:4321/teaching/`.

## Building

```bash
# Build the site + search index
npm run build

# Preview the production build locally
npm run preview
```

The built site is output to the `dist/` directory. The build command also runs Pagefind to generate the static search index.

## Deploying to GitHub Pages

### Step 1: Create the GitHub Repository

1. Create a new repository on GitHub named `teaching` (or any name you prefer).
2. Push your code:
   ```bash
   git init
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/teaching.git
   git push -u origin main
   ```

### Step 2: Configure GitHub Pages

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Source**, select **GitHub Actions**.
4. That's it — the included workflow (`.github/workflows/deploy.yml`) will build and deploy automatically on every push to `main`.

### Step 3: Update the Base URL

Edit `astro.config.mjs` and set your `site` and `base`:

```js
// For a project site (username.github.io/teaching):
site: 'https://<your-username>.github.io',
base: '/teaching',

// For a user/org site (username.github.io):
site: 'https://<your-username>.github.io',
base: '/',
```

Commit and push — the site will redeploy automatically.

### Step 4: Verify

After the Actions workflow completes (check the **Actions** tab), your site will be live at:
- Project site: `https://<your-username>.github.io/teaching/`
- User site: `https://<your-username>.github.io/`

## Project Structure

```
teaching/
├── .github/workflows/deploy.yml  ← GitHub Actions deploy workflow
├── public/
│   ├── assets/pdfs/              ← PDF files for download
│   └── favicon.svg
├── src/
│   ├── components/               ← Reusable UI components
│   │   ├── Breadcrumb.astro
│   │   ├── CourseCard.astro
│   │   ├── CourseSidebar.astro
│   │   ├── DarkModeToggle.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── MaterialCard.astro
│   │   └── TagFilter.astro
│   ├── content/                  ← All content (Markdown)
│   │   ├── config.ts             ← Content schemas (Zod)
│   │   ├── courses/              ← Course definitions
│   │   ├── notes/                ← Class notes
│   │   ├── exercises/            ← Exercises
│   │   ├── homework/             ← Homework assignments
│   │   ├── tests/                ← Past exams
│   │   └── resources/            ← Links, books, tools
│   ├── layouts/                  ← Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── CourseLayout.astro
│   │   └── MaterialLayout.astro
│   ├── pages/                    ← Route pages
│   │   ├── index.astro           ← Home page
│   │   ├── about.astro
│   │   ├── policies.astro
│   │   ├── search.astro
│   │   ├── rss.xml.ts            ← RSS feed
│   │   ├── 404.astro
│   │   └── courses/              ← Dynamic course routes
│   ├── styles/global.css         ← Global styles + dark mode
│   └── utils/helpers.ts          ← Utility functions
├── astro.config.mjs              ← Astro configuration
├── package.json
├── tsconfig.json
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

## How to Add a New Course

1. Create a new Markdown file in `src/content/courses/`. The filename becomes the course slug used in URLs. For example, `src/content/courses/new-course.md` will be accessible at `/courses/new-course/`.

2. Use this template:

   ```markdown
   ---
   title: "Full Course Name"
   shortName: "ABC"
   description: "One-sentence description of the course."
   semester: "2025/1"
   schedule: "Days and times"
   color: "#hexcolor"
   order: 4
   objectives:
     - "Learning objective 1"
     - "Learning objective 2"
   bibliography:
     - "Author — Book Title"
   ---

   ## Schedule

   | Week | Topic |
   |------|-------|
   | 1    | Introduction |
   ...

   ## Assessment

   - Exam 1: 30%
   - Exam 2: 30%
   - Assignments: 40%
   ```

3. That's it. The course automatically appears on the home page, courses index, and gets its own section with sidebar navigation. All six sub-pages (overview, notes, exercises, homework, tests, resources) are generated automatically.

## How to Add Content (Notes, Exercises, Homework, Tests)

1. Create a Markdown file in the appropriate folder under `src/content/`:
   - `src/content/notes/` for class notes
   - `src/content/exercises/` for exercises
   - `src/content/homework/` for homework
   - `src/content/tests/` for exams

2. Use the frontmatter template:

   ```markdown
   ---
   title: "Title of the Material"
   course: "course-slug"          # Must match the filename in courses/
   date: 2025-03-15               # Publication date
   tags: ["Tag1", "Tag2"]         # For filtering
   description: "Brief summary."  # Shown in cards
   pdfLink: "/assets/pdfs/file.pdf"        # Optional
   sourceLink: "https://github.com/..."    # Optional
   solutionsAvailable: true                # Optional
   solutionsPublic: false                  # Optional
   math: true                             # Optional (loads KaTeX)
   draft: false                           # Set true to hide
   ---

   Your Markdown content here...
   ```

3. The `course` field must match a course slug (the filename without `.md` in `src/content/courses/`). For example, if your course file is `fsc.md`, use `course: "fsc"`.

## How to Add Resources

Resources (books, tools, links) use a slightly different schema:

```markdown
---
title: "Resource Title"
course: "course-slug"
type: "book"              # book | tool | link | video | other
url: "https://example.com"
description: "What this resource is and why it's useful."
tags: ["Tag1"]
order: 1                  # Controls display order
---
```

## How to Attach PDFs

1. Place the PDF file in `public/assets/pdfs/`. For example: `public/assets/pdfs/fsc-midterm-2024.pdf`.

2. Reference it in the frontmatter:
   ```yaml
   pdfLink: "/assets/pdfs/fsc-midterm-2024.pdf"
   ```

   The path is relative to the `public/` directory. Astro copies everything in `public/` to the build output as-is.

3. You can also link to external PDFs:
   ```yaml
   pdfLink: "https://example.com/document.pdf"
   ```

## Tags, Filtering, and Search

### Tags
Each content item can have an array of `tags` in its frontmatter. Tags appear on cards and can be used to filter material listings. Use consistent tag names across items for best results.

### Filtering
Material listing pages (notes, exercises, etc.) show a filter bar with all tags used in that course's materials. Click a tag to show only matching items. Use the sort dropdown to order by date or title.

### Search
The site uses [Pagefind](https://pagefind.app) for full-text static search:

- **Indexing**: Pagefind runs after the Astro build and indexes all pages with `data-pagefind-body` (material detail pages).
- **How it works**: A compact index is generated at build time and loaded client-side. No server needed.
- **Limitations**: Search is only available in the production build (not during `npm run dev`). Run `npm run build && npm run preview` to test search locally.

## Customizing Theme and Colors

### Site-Wide Colors
Edit `src/styles/global.css` — all colors are CSS custom properties in the `:root` and `[data-theme="dark"]` blocks. Key variables:

| Variable | Purpose |
|----------|---------|
| `--color-primary` | Links, buttons, accents |
| `--color-bg` | Page background |
| `--color-text` | Body text |
| `--color-border` | Borders and dividers |

### Per-Course Colors
Each course has a `color` field in its frontmatter. This colors the sidebar accent, course card border, and material card accent.

### Site Name
Change the site title in:
- `src/layouts/BaseLayout.astro` — the `siteTitle` constant
- `src/components/Header.astro` — the logo text
- `src/components/Footer.astro` — the copyright line

### Favicon
Replace `public/favicon.svg` with your own.

## Troubleshooting

### Build fails with content schema errors
A frontmatter field doesn't match the schema in `src/content/config.ts`. Check the error message — it will tell you which file and field is invalid.

### Search doesn't work in dev mode
Expected. Pagefind generates its index during `npm run build`. Use `npm run build && npm run preview` to test search.

### Pages return 404 on GitHub Pages
- Ensure `base` in `astro.config.mjs` matches your repository name.
- Ensure GitHub Pages source is set to **GitHub Actions** (not "Deploy from branch").
- Check the Actions tab for build errors.

### Math formulas don't render
Ensure the page's frontmatter has `math: true`. KaTeX CSS is only loaded when this flag is set.

### Dark mode flickers on load
The inline script in `BaseLayout.astro` should prevent this. If you see a flash, ensure the script runs before any CSS transition applies.

### Styles look wrong after changing base URL
Clear the browser cache and rebuild. Some cached assets may reference old paths.

## License

- **Course content** (notes, exercises, exams): [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Website code** (layouts, components, scripts): [MIT](https://opensource.org/licenses/MIT)

See [LICENSE](./LICENSE) for details.
