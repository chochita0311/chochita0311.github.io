# Project Architecture

## Runtime Shape

- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published root landing shell.
- `archive/index.html`, `archive/note/index.html`, and `archive/design/index.html` are the static archive entry shells for canonical archive browse paths and first-pass archive-kind surfaces.
- `.nojekyll` keeps GitHub Pages from transforming note Markdown into `.html`, which preserves runtime fetches to `NOTES/**/*.md`.
- `assets/css/app.css` is the shell entry stylesheet imported by `index.html`.
- `assets/generated/archives-index.json` is the generated runtime archive index derived from `NOTES/`.
- `assets/generated/archives-search-index.json` is the generated reverse search index derived from Markdown title, tags, and body content.
- `sitemap.xml` is the generated crawl-discovery file for the root landing plus canonical archive browse and note-detail URLs.
- `robots.txt` is the crawl-entry file that keeps the published sitemap location discoverable to search crawlers.
- `assets/js/archive/route.js` owns canonical archive path parsing and URL generation for the browser runtime.
- `archive/design/index.html` owns the first-pass `Design` archive-kind surface at `/archive/design/`.
- `assets/js/design-cards.js` owns the first-pass static 20-card specimen set and orbital-slide card browser behavior for `/archive/design/`.
- `assets/js/sidebar.js` renders the left category rail from the generated note index.
- `assets/js/topbar.js` renders the topbar notes taxonomy menu from the generated note index.
- `assets/js/shell-handoff.js` owns Notes/Design route handoff timing, shell transition classes, and topbar handoff coordination.
- `assets/js/main-landing.js` owns the landing-first shell lifecycle for the archive entry view.
- `assets/js/archive/search.js` owns shared archive search control and execution orchestration.
- `assets/js/archive/content.js` renders archive and collection note lists from the generated note index.
- `assets/js/index-note-detail.js` owns note-detail utility interactions such as breadcrumb handoff, copy-body action wiring, and table-of-contents focus behavior.
- `assets/js/icons.js` owns the shared icon registry and Material Symbols rendering helper used by the runtime.
- `assets/css/` owns the current screen through extracted token, base, semantic, layout, and component layers.
- `assets/css/tokens.css` owns raw scales and reusable primitive values such as spacing, color bases, radius, typography scale, and shell dimensions.
- `assets/css/semantic.css` owns semantic variable mapping only, such as page-role colors and surfaces derived from tokens.
- `assets/css/layouts.css` owns shell, page, and responsive layout structure, including shared archive canvas sizing and sticky shell regions.
- `assets/css/components.css` owns reusable UI selectors and shared component typography behavior.
- `assets/css/note-detail.css` owns note-detail-specific presentation and should not redefine shared archive shell layout.
- `assets/css/design.css` owns the first-pass design-card surface presentation and should not alter note archive list or note-detail presentation.
- The published shell no longer depends on Tailwind runtime output.
- Future browse, search, tag, and bookmark flows should consume a generated note index rather than hand-maintained UI-only data.

## Content Shape

- `NOTES/` is the current durable Markdown archive.
- The verified content shape is `NOTES/<category>/<collection>/<note>.md`.
- Source note identity is owned by numeric Markdown frontmatter `id` values.
- Note metadata and generated static-index expectations are defined in `docs/policies/archive/note/note-data-contract.md`.
- Markdown body rendering behavior is defined in `docs/policies/archive/note/markdown-rendering.md`.
- The published shell reads a generated note index plus Markdown source files at runtime.
- Search features should read the generated reverse index rather than scanning Markdown on demand in the browser.

## Main Paths

- `index.html`
- `archive/`
- `archive/design/`
- `assets/generated/archives-index.json`
- `assets/generated/archives-search-index.json`
- `sitemap.xml`
- `robots.txt`
- `assets/js/archive/route.js`
- `assets/js/design-cards.js`
- `assets/js/sidebar.js`
- `assets/js/topbar.js`
- `assets/js/shell-handoff.js`
- `assets/js/main-landing.js`
- `assets/js/archive/search.js`
- `assets/js/icons.js`
- `assets/js/archive/content.js`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `assets/css/design.css`
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
- Keep shared icon naming and rendering aligned to `assets/js/icons.js` and `docs/policies/system/icon.md`.

## Maintenance Flow

- Add or update notes under `NOTES/`.
- Regenerate `assets/generated/archives-index.json` and `assets/generated/archives-search-index.json` after note additions, moves, metadata changes, or content edits that affect search.
- Regenerate `sitemap.xml` after note additions, moves, or note URL pattern changes.
- Update `robots.txt` if the sitemap filename or published domain changes.
- Keep the visible category and collection structure aligned with the archive tree.
- Verify the app against a local HTTP server before publishing.
