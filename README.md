# chochita0311.github.io

Lightweight static Markdown archive site for browsing and reading personal study materials on GitHub Pages.

## Project Overview
- Desktop-first archive shell built with static HTML and layered CSS
- Durable Markdown archive currently organized under `NOTES/`
- Current verified content shape: `NOTES/<category>/<collection>/<note>.md`
- GitHub Pages must serve the repo as static files so runtime `.md` fetches keep working
- The published shell is styled and documented, but archive data binding is still being normalized

## Local Development

### Run Locally
Use a local server for consistent browser testing.

```bash
node scripts/generate-archives-index.mjs
node scripts/generate-sitemap.mjs
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Lint And Format
This repo uses lightweight frontend tooling for the site source:

- `Prettier` formats the frontend source files and utility scripts
- `ESLint` checks the site JavaScript and local `.mjs` scripts for common mistakes
- Lint and format config is stored under `configs/lint/`

Install local dev dependencies:

```bash
npm install
```

Run checks:

```bash
npm run lint
```

Auto-format files:

```bash
npm run format
```

Notes:

- This setup is local development tooling only and does not affect GitHub Pages runtime output
- `node_modules/` is ignored and should not be committed
- Generated archive data under `assets/generated/` is excluded from lint and format checks
- Archive note content under `NOTES/` is intentionally outside this lint scope
- Because config lives under `configs/lint/`, npm scripts pass explicit config paths instead of relying on root autodiscovery

## Note Maintenance
- Add or reorganize Markdown files under `NOTES/`.
- Keep category and collection names searchable and understandable.
- Use `docs/policies/archive/note/note-maintenance-workflow.md` for add, move, import, and regeneration steps.
- Use `docs/policies/archive/note/note-data-contract.md` for note frontmatter and generated-data expectations.
- Regenerate `assets/generated/archives-index.json` after note or folder changes with `node scripts/generate-archives-index.mjs`.
- Regenerate `sitemap.xml` after note additions, moves, or URL-shape changes with `node scripts/generate-sitemap.mjs`.
- Keep `robots.txt` aligned to the published sitemap location so crawlers can discover `sitemap.xml`.
- Update the UI or supporting docs in the same turn when the visible archive structure changes.

## Documentation Entry Points
- `AGENTS.md`: operational entrance doc for repo-local rules and source-of-truth routing
- `docs/README.md`: documentation map for policies, plans, and agent-package docs
- `docs/policies/project/policy.md`: product direction and scope
- `docs/policies/project/developer-guide.md`: maintenance, verification, and documentation-update workflow
- `docs/policies/archive/note/`: note workflow, note contract, and Markdown rendering rules
- `docs/plans/project/roadmap.md`: current and future direction

For deeper policy ownership, use `docs/README.md` instead of treating this file as the full docs index.
