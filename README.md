# chochita0311.github.io

Lightweight static Markdown archive site for browsing and reading personal study materials on GitHub Pages.

## Overview
- Desktop-first archive shell built with static HTML and layered CSS
- Durable Markdown archive currently organized under `CATEGORIES/`
- Current verified content shape: `CATEGORIES/<category>/<collection>/<note>.md`
- GitHub Pages must serve the repo as static files so runtime `.md` fetches keep working
- The published shell is styled and documented, but archive data binding is still being normalized

## Local Run
Use a local server for consistent browser testing.

```bash
node scripts/generate-archives-index.mjs
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Update Archive Content
- Add or reorganize Markdown files under `CATEGORIES/`
- Keep category and collection names searchable and understandable
- Use `docs/project/notes/note-data-contract.md` for note frontmatter and static index expectations
- Regenerate `assets/generated/archives-index.json` after note or folder changes with `node scripts/generate-archives-index.mjs`
- Update the UI or supporting docs in the same turn when the visible archive structure changes

## Documentation Map
- `AGENTS.md`: entrance and contributor map
- `docs/project/policy.md`: product direction and scope
- `docs/project/architecture.md`: runtime and content structure
- `docs/project/notes/note-data-contract.md`: note frontmatter and generated index contract
- `docs/project/notes/markdown-rendering-rules.md`: supported Markdown body rendering rules for the runtime
- `docs/project/developer-guide.md`: development and verification guidance
- `docs/project/roadmap.md`: current and future direction
- `docs/designs/design-constitution.md`: design source of truth
