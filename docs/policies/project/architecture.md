# Project Architecture

## Runtime Shape

- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published desktop archive shell.
- `.nojekyll` keeps GitHub Pages from transforming note Markdown into `.html`, which preserves runtime fetches to `NOTES/**/*.md`.
- `assets/css/app.css` is the shell entry stylesheet imported by `index.html`.
- `assets/generated/archives-index.json` is the generated runtime archive index derived from `NOTES/`.
- `assets/generated/archives-search-index.json` is the generated reverse search index derived from Markdown title, tags, and body content.
- `sitemap.xml` is the generated crawl-discovery file for the home page and standalone note URLs.
- `robots.txt` is the crawl-entry file that keeps the published sitemap location discoverable to search crawlers.
- `assets/js/sidebar.js` renders the left category rail from the generated note index.
- `assets/js/topbar.js` renders the topbar notes taxonomy menu from the generated note index.
- `assets/js/main-landing.js` owns the landing-first shell lifecycle for the archive entry view.
- `assets/js/archive-search.js` owns shared archive search control and execution orchestration.
- `assets/js/archive-content.js` renders archive and collection note lists from the generated note index.
- `assets/js/icons.js` owns the shared icon registry and Material Symbols rendering helper used by the runtime.
- `assets/css/` owns the current screen through extracted token, base, semantic, layout, and component layers.
- The published shell no longer depends on Tailwind runtime output.
- Future browse, search, tag, and bookmark flows should consume a generated note index rather than hand-maintained UI-only data.

## Content Shape

- `NOTES/` is the current durable Markdown archive.
- The verified content shape is `NOTES/<category>/<collection>/<note>.md`.
- Source note identity is owned by numeric Markdown frontmatter `id` values.
- Note metadata and generated static-index expectations are defined in `docs/policies/content/note/note-data-contract.md`.
- Markdown body rendering behavior is defined in `docs/policies/content/note/markdown-rendering.md`.
- The published shell reads a generated note index plus Markdown source files at runtime.
- Search features should read the generated reverse index rather than scanning Markdown on demand in the browser.

## Main Paths

- `index.html`
- `assets/generated/archives-index.json`
- `assets/generated/archives-search-index.json`
- `sitemap.xml`
- `robots.txt`
- `assets/js/sidebar.js`
- `assets/js/topbar.js`
- `assets/js/main-landing.js`
- `assets/js/archive-search.js`
- `assets/js/icons.js`
- `assets/js/archive-content.js`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `NOTES/`
- `docs/policies/content/note/note-data-contract.md`
- `docs/policies/content/note/markdown-rendering.md`
- `docs/policies/system/icon.md`

## Constraints

- Avoid introducing a build requirement for the published runtime.
- Keep the visible archive model aligned to `NOTES/<category>/<collection>/<note>.md`.
- Treat Markdown files as the only durable note content source.
- Treat `assets/generated/archives-index.json` and `assets/generated/archives-search-index.json` as generated runtime output, not hand-edited source content.
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
