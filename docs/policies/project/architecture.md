# Project Architecture

## Purpose

- Map the runtime file ownership for the static GitHub Pages app.
- Keep package boundaries clear as notes, search, reading, and design surfaces grow.
- Route durable structure decisions to the owning policy docs instead of repeating them in plans.

## Runtime Entry Shells

- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published root landing shell.
- `archive/index.html` is the canonical archive browse shell.
- `archive/note/index.html` is the canonical note-list and note-detail shell.
- `archive/design/index.html` owns the first-pass `Design` archive-kind surface at `/archive/design/`.
- `.nojekyll` keeps GitHub Pages from transforming note Markdown into `.html`, which preserves runtime fetches to `NOTES/**/*.md`.
- The published shell no longer depends on Tailwind runtime output.

## Generated Runtime Data

- `assets/generated/archives-index.json` is the generated runtime archive index derived from `NOTES/`.
- `assets/generated/archives-search-index.json` is the generated reverse search index derived from Markdown title, tags, and body content.
- `sitemap.xml` is the generated crawl-discovery file for the root landing plus canonical archive browse and note-detail URLs.
- `robots.txt` is the crawl-entry file that keeps the published sitemap location discoverable to search crawlers.
- Future browse, search, tag, and bookmark flows should consume generated note data rather than hand-maintained UI-only data.

## JavaScript Ownership

- Routing:
  - `assets/js/archive/route.js` owns canonical archive path parsing and URL generation for the browser runtime.
- Shell:
  - `assets/js/shell/bootstrap.js` applies early shell state from session storage before deferred scripts load.
  - `assets/js/shell/sidebar.js` renders the left category rail from the generated note index.
  - `assets/js/shell/topbar.js` renders the topbar notes taxonomy menu from the generated note index.
  - `assets/js/shell/handoff.js` owns Notes/Design route handoff timing, shell transition classes, and topbar handoff coordination.
- Landing:
  - `assets/js/landing/main.js` owns the landing-first shell lifecycle for the archive entry view.
- Notes:
  - `assets/js/note/archive-controller.js` owns note archive state, data boot, location synchronization, sidebar handoff, and list/detail orchestration.
  - `assets/js/note/list-renderer.js` owns note list card markup, empty-state markup, and list page rendering.
  - `assets/js/note/view-controls.js` owns note archive view-mode, page-size, responsive list fallback, and pagination controls.
  - `assets/js/note/popular-tags.js` owns repeated-tag counting, popular-tag chip rendering, and popular-tag selection behavior.
  - `assets/js/note/search.js` owns note search control and execution orchestration against the generated note search index.
  - `assets/js/note/detail-renderer.js` owns note Markdown parsing and rendered body construction.
  - `assets/js/note/detail-controller.js` owns note-detail utility interactions such as breadcrumb handoff, copy-body action wiring, and table-of-contents focus behavior.
- Design:
  - `assets/js/design/cards.js` owns the first-pass static 20-card specimen set and orbital-slide card browser behavior for `/archive/design/`.
- Shared:
  - `assets/js/shared/icons.js` owns the shared icon registry and Material Symbols rendering helper used by the runtime.

## CSS Ownership

- `assets/css/app.css` is the shell entry stylesheet imported by active entry shells; it owns stylesheet import order and cross-surface handoff classes that cannot belong cleanly to only Notes or Design.
- `assets/css/tokens.css` owns raw scales and reusable primitive values such as spacing, color bases, radius, typography scale, and shell dimensions.
- `assets/css/base.css` owns browser-base element styling and shared base utility classes such as icon class primitives.
- `assets/css/semantic.css` owns semantic variable mapping only, such as page-role colors and surfaces derived from tokens.
- `assets/css/layouts.css` owns shell, page, and responsive layout structure, including shared archive canvas sizing and sticky shell regions.
- `assets/css/components.css` owns reusable UI selectors and shared component typography behavior.
- `assets/css/note-detail.css` owns note-detail-specific presentation and should not redefine shared archive shell layout.
- `assets/css/design.css` owns the first-pass design-card surface presentation and should not alter note archive list or note-detail presentation.

## Content Shape

- `NOTES/` is the current durable Markdown archive.
- The verified content shape is `NOTES/<category>/<collection>/<note>.md`.
- Source note identity is owned by numeric Markdown frontmatter `id` values.
- Note metadata and generated static-index expectations are defined in [note-data-contract.md](../archive/note/note-data-contract.md).
- Markdown body rendering behavior is defined in [markdown-rendering.md](../archive/note/markdown-rendering.md).
- The published shell reads a generated note index plus Markdown source files at runtime.
- Search features should read the generated reverse index rather than scanning Markdown on demand in the browser.

## Main Paths

- Entry shells:
  - `index.html`
  - `archive/`
  - `archive/design/`
- Generated data and crawl support:
  - `assets/generated/archives-index.json`
  - `assets/generated/archives-search-index.json`
  - `sitemap.xml`
  - `robots.txt`
- JavaScript:
  - `assets/js/archive/route.js`
  - `assets/js/design/cards.js`
  - `assets/js/landing/main.js`
  - `assets/js/note/archive-controller.js`
  - `assets/js/note/list-renderer.js`
  - `assets/js/note/view-controls.js`
  - `assets/js/note/popular-tags.js`
  - `assets/js/note/search.js`
  - `assets/js/note/detail-renderer.js`
  - `assets/js/note/detail-controller.js`
  - `assets/js/shared/icons.js`
  - `assets/js/shell/bootstrap.js`
  - `assets/js/shell/sidebar.js`
  - `assets/js/shell/topbar.js`
  - `assets/js/shell/handoff.js`
- CSS:
  - `assets/css/app.css`
  - `assets/css/tokens.css`
  - `assets/css/base.css`
  - `assets/css/semantic.css`
  - `assets/css/layouts.css`
  - `assets/css/components.css`
  - `assets/css/note-detail.css`
  - `assets/css/design.css`
- Content and owner docs:
  - `NOTES/`
  - `docs/policies/archive/note/note-data-contract.md`
  - `docs/policies/archive/note/markdown-rendering.md`
  - `docs/policies/system/icon.md`

## Constraints

- Avoid introducing a build requirement for the published runtime.
- Keep the visible archive model aligned to `NOTES/<category>/<collection>/<note>.md`.
- Treat Markdown files as the only durable note content source.
- Treat `assets/generated/archives-index.json` and `assets/generated/archives-search-index.json` as generated runtime output, not hand-edited source content.
- Treat `archive/index.html`, `archive/note/index.html`, and `archive/design/index.html` as owned runtime entry files aligned to the canonical archive route contract.
- Treat `sitemap.xml` as generated output aligned to the published URL shape, not hand-edited source content.
- Keep `robots.txt` minimal and stable unless crawl restrictions or sitemap location change.
- Keep the published shell desktop-first until product scope explicitly changes.
- Keep shared icon naming and rendering aligned to `assets/js/shared/icons.js` and [icon.md](../system/icon.md).

## Maintenance Flow

- Add or update notes under `NOTES/`.
- Regenerate `assets/generated/archives-index.json` and `assets/generated/archives-search-index.json` after note additions, moves, metadata changes, or content edits that affect search.
- Regenerate `sitemap.xml` after note additions, moves, or note URL pattern changes.
- Update `robots.txt` if the sitemap filename or published domain changes.
- Keep the visible category and collection structure aligned with the archive tree.
- Verify the app against a local HTTP server before publishing.
