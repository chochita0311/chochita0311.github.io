# Project Architecture

## Runtime Shape
- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` provides the current published shell.
- `assets/js/app.js` holds the main client behavior.
- `assets/css/` contains the layered styling system.

## Content Shape
- `notes/` is the long-term Markdown archive.
- The current browser-facing list/detail flow also uses local JSON data under `docs/tables/localdb/`.
- Until the UI is fully driven from Markdown sources, tasks may need to keep both archive content and local preview data aligned.

## Main Paths
- `index.html`
- `assets/js/app.js`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `notes/`
- `docs/tables/localdb/`

## Constraints
- Avoid introducing build requirements unless the product direction changes intentionally.
- Keep file organization understandable as the note archive grows.
- Prefer incremental cleanup over broad rewrites.
- Refer to `docs/project/policy.md` for product scope and `docs/project/developer-guide.md` for change workflow.
