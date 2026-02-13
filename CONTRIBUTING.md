# Contributing

Thank you for your interest in improving this course website.

## Who Can Contribute

- **Students**: Report broken links, typos, or confusing content by opening an issue.
- **Teaching assistants**: Propose new exercises, fix errors in solutions, or improve explanations via pull request.
- **Colleagues**: Suggest structural improvements, accessibility fixes, or new features.

## How to Report Issues

1. Go to the **Issues** tab on GitHub.
2. Click **New Issue**.
3. Include:
   - Which page has the problem (URL or file path).
   - What the issue is (broken link, typo, incorrect solution, etc.).
   - Suggested fix, if you have one.

## How to Submit Changes

1. **Fork** this repository.
2. Create a new branch: `git checkout -b fix/description-of-change`.
3. Make your changes.
4. Test locally with `npm run dev`.
5. Commit with a descriptive message.
6. Open a **Pull Request** against `main`.

## Content Guidelines

- Keep language clear and concise.
- Use proper Markdown formatting.
- Follow the existing frontmatter schema (see `src/content/config.ts`).
- Do not commit solutions that should remain private (check the `solutionsPublic` field).

## Code Guidelines

- Follow the existing code style.
- Test your changes with `npm run build` before submitting.
- Keep component changes backward-compatible when possible.

## Questions?

Open an issue or contact the instructor.
