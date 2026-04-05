# Project Architecture

## Runtime Shape
- The site is a static web app built with HTML, CSS, and JavaScript.
- `index.html` is the published desktop archive shell.
- `assets/css/app.css` is the shell entry stylesheet imported by `index.html`.
- `assets/css/` owns the current screen through extracted token, base, semantic, layout, and component layers.
- The published shell no longer depends on Tailwind runtime output.

## Content Shape
- `CATEGORIES/` is the current durable Markdown archive.
- The verified content shape is `CATEGORIES/<category>/<collection>/<note>.md`.
- The current shell is not yet wired to a restored runtime content loader.

## Main Paths
- `index.html`
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/base.css`
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/app.css`
- `CATEGORIES/`

## Constraints
- Avoid introducing a build requirement for the published runtime.
- Keep the visible archive model aligned to `CATEGORIES/<category>/<collection>/<note>.md`.
- Treat Markdown files as the only durable note content source.
- Keep the published shell desktop-first until product scope explicitly changes.

## Maintenance Flow
- Add or update notes under `CATEGORIES/`.
- Keep the visible category and collection structure aligned with the archive tree.
- Verify the app against a local HTTP server before publishing.
