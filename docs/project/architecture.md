# Project Architecture

## Runtime Shape
- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published desktop archive shell.
- `.nojekyll` keeps GitHub Pages from transforming note Markdown into `.html`, which preserves runtime fetches to `CATEGORIES/**/*.md`.
- `assets/css/app.css` is the shell entry stylesheet imported by `index.html`.
- `assets/js/sidebar-categories.js` renders the left category rail from the current archive snapshot.
- `assets/js/archive-content.js` renders collection-driven note lists in the right content area.
- `assets/css/` owns the current screen through extracted token, base, semantic, layout, and component layers.
- The published shell no longer depends on Tailwind runtime output.
- Future browse, search, tag, and bookmark flows should consume a generated note index rather than hand-maintained UI-only data.

## Content Shape
- `CATEGORIES/` is the current durable Markdown archive.
- The verified content shape is `CATEGORIES/<category>/<collection>/<note>.md`.
- Note metadata and generated static-index expectations are defined in `docs/project/note-data-contract.md`.
- The current shell is not yet wired to a restored runtime content loader.

## Main Paths
- `index.html`
- `assets/js/sidebar-categories.js`
- `assets/js/archive-content.js`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `CATEGORIES/`
- `docs/project/note-data-contract.md`

## Constraints
- Avoid introducing a build requirement for the published runtime.
- Keep the visible archive model aligned to `CATEGORIES/<category>/<collection>/<note>.md`.
- Treat Markdown files as the only durable note content source.
- Keep the published shell desktop-first until product scope explicitly changes.

## Maintenance Flow
- Add or update notes under `CATEGORIES/`.
- Keep the visible category and collection structure aligned with the archive tree.
- Verify the app against a local HTTP server before publishing.
