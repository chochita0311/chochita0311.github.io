# Project Architecture

## Runtime Shape
- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published desktop archive shell.
- `.nojekyll` keeps GitHub Pages from transforming note Markdown into `.html`, which preserves runtime fetches to `CATEGORIES/**/*.md`.
- `assets/css/app.css` is the shell entry stylesheet imported by `index.html`.
- `assets/generated/archives-index.json` is the generated runtime archive index derived from `CATEGORIES/`.
- `assets/js/sidebar-categories.js` renders the left category rail from the generated note index.
- `assets/js/archive-content.js` renders archive and collection note lists from the generated note index.
- `assets/js/icons.js` owns the shared icon registry and Material Symbols rendering helper used by the runtime.
- `assets/css/` owns the current screen through extracted token, base, semantic, layout, and component layers.
- The published shell no longer depends on Tailwind runtime output.
- Future browse, search, tag, and bookmark flows should consume a generated note index rather than hand-maintained UI-only data.

## Content Shape
- `CATEGORIES/` is the current durable Markdown archive.
- The verified content shape is `CATEGORIES/<category>/<collection>/<note>.md`.
- Note metadata and generated static-index expectations are defined in `docs/policies/content/note/note-data-contract.md`.
- Markdown body rendering behavior is defined in `docs/policies/content/note/markdown-rendering.md`.
- The published shell reads a generated note index plus Markdown source files at runtime.

## Main Paths
- `index.html`
- `assets/generated/archives-index.json`
- `assets/js/sidebar-categories.js`
- `assets/js/icons.js`
- `assets/js/archive-content.js`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `CATEGORIES/`
- `docs/policies/content/note/note-data-contract.md`
- `docs/policies/content/note/markdown-rendering.md`
- `docs/policies/system/icon.md`

## Constraints
- Avoid introducing a build requirement for the published runtime.
- Keep the visible archive model aligned to `CATEGORIES/<category>/<collection>/<note>.md`.
- Treat Markdown files as the only durable note content source.
- Treat `assets/generated/archives-index.json` as generated runtime output, not hand-edited source content.
- Keep the published shell desktop-first until product scope explicitly changes.
- Keep shared icon naming and rendering aligned to `assets/js/icons.js` and `docs/policies/system/icon.md`.

## Maintenance Flow
- Add or update notes under `CATEGORIES/`.
- Regenerate `assets/generated/archives-index.json` after note additions, moves, or metadata changes.
- Keep the visible category and collection structure aligned with the archive tree.
- Verify the app against a local HTTP server before publishing.
