# Runtime JavaScript Domain Structure Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Related track: `docs/plans/refactoring/archive-js-structure-plan.md`
- Scope: JavaScript runtime domain folders, script tags, icon tooling, and path-owning policy docs

## Summary

- Goal:
  - Keep `assets/js/` as the static runtime asset root while moving root-level JavaScript files into clearer usage and domain folders.
- Outcome:
  - `Pass`
- Short conclusion:
  - Runtime JavaScript now has explicit `archive`, `design`, `landing`, `note`, `shared`, and `shell` folders without changing public globals or route behavior.

## What Changed

- Added:
  - `docs/plans/refactoring/logs/2026-05-03_runtime-js-domain-structure-batch.md`
- Updated:
  - Active script tags in `index.html`, `archive/index.html`, `archive/note/index.html`, and `archive/design/index.html`.
  - `scripts/check-icon-control.mjs` now checks the active archive shells and the new shared icon registry path.
  - Durable path references in `docs/policies/project/architecture.md`, `docs/policies/project/developer-guide.md`, `docs/policies/system/icon.md`, and `docs/policies/archive/note/markdown-rendering.md`.
  - `assets/js/note/detail-controller.js` now uses `ICONS.actions.copy` when resetting the copy action icon.
- Moved/Renamed:
  - `assets/js/icons.js` -> `assets/js/shared/icons.js`
  - `assets/js/shell-bootstrap.js` -> `assets/js/shell/bootstrap.js`
  - `assets/js/shell-handoff.js` -> `assets/js/shell/handoff.js`
  - `assets/js/sidebar.js` -> `assets/js/shell/sidebar.js`
  - `assets/js/topbar.js` -> `assets/js/shell/topbar.js`
  - `assets/js/main-landing.js` -> `assets/js/landing/main.js`
  - `assets/js/note-detail-renderer.js` -> `assets/js/note/detail-renderer.js`
  - `assets/js/index-note-detail.js` -> `assets/js/note/detail-controller.js`
  - `assets/js/design-cards.js` -> `assets/js/design/cards.js`
- Removed:
  - None in this batch.

## Behavior / Parity Notes

- Behavior-preserving intent:
  - The plain-script model and existing globals remain in place.
  - File moves were paired with script tag updates in every active entry shell.
  - Follow-up in the same refactor turn moved note-specific browse/search files from `assets/js/archive/` to `assets/js/note/`; `assets/js/archive/` now keeps only archive-wide route grammar.
- Intentional deltas:
  - Runtime JavaScript path ownership is now folder-based by domain.
  - Icon validation now treats the active static shells as approved raw Material Symbols owners and `assets/js/shared/icons.js` as the JavaScript registry owner.
- Important compatibility or contract notes:
  - `window.AppIcons`, `window.ArchiveRoutes`, `window.TopbarController`, `window.ShellHandoff`, `window.NoteDetailRenderer`, `window.IndexNoteDetail`, `window.MainLanding`, `window.NoteSearch`, and `window.ArchiveSearch` remain published globals.
  - Static GitHub Pages delivery remains plain HTML, CSS, and JavaScript with no build step.
- Parity claim status:
  - `Provisional`
- Parity confidence basis:
  - `Targeted route smoke`
- If `Preserved`, strict baseline audit completed:
  - `No`

## Validation

- Build / compile:
  - command: `find assets/js -name '*.js' -exec /opt/homebrew/bin/node --check {} \;`
  - result: `Pass`
- Targeted tests:
  - command: `npm run lint`
  - result: `Pass`
  - command: `node scripts/check-icon-control.mjs`
  - result: `Pass`
  - command: `rg` stale old-path audit across active HTML and durable policy docs
  - result: `Pass, no stale old script paths remained`
- Runtime / smoke / manual verification:
  - Started local server with `python3 -m http.server 8000`.
  - Checked `/`: root landing rendered with no console errors.
  - Checked root landing search for `java`: search routed to `/archive/` and rendered results with no console errors.
  - Checked `/archive/`: archive list rendered with no console errors.
  - Checked `/archive/note/`: note shell rendered the archive list with no console errors.
  - Checked `/archive/note?category=English&collection=Langs%20Studio`: scoped list rendered with no console errors.
  - Checked `/archive/note?id=1`: note detail rendered with no console errors.
  - Checked `/archive/design/`: design surface rendered with no console errors.
  - Checked topbar search for `spring` from `/archive/`: search routed to `/archive/note/` and rendered matching results with no console errors.
  - Checked sidebar category navigation from `/archive/note/` to `English`: category-scoped list rendered with no console errors.
  - Extended action smoke after review question:
    - landing search submit
    - grid/list view toggle
    - pagination next
    - page-size menu open and size change
    - popular tag filter
    - note-card navigation to detail
    - note copy, bookmark, and more action buttons
    - note outline jump
    - note breadcrumb navigation back to collection scope
    - Design next-card control
    - Design-to-Notes topbar handoff
  - The extended action smoke produced no console errors.
  - Preserved network requests during the smoke showed active moved assets returning `200` or cache `304`; no missing moved-script request was observed.

## Risks / Limitations

- Known residual risks:
  - `assets/js/note/archive-controller.js` is still the main note browse/read implementation hotspot.
  - This batch did not prove visual parity across all viewport sizes.
- What this log does not prove:
  - It does not complete the CSS layer audit.
  - It does not complete the package-doc structuring and shaping pass.
  - It does not split note route/render ownership beyond moving the note controller and search modules into the note package.

## Next Action

- Next step:
  - Continue with the CSS layer audit or the package-doc structuring/shaping pass as a separate bounded batch.
- Handoff note:
  - Any deeper note archive route/render split should continue from `docs/plans/refactoring/archive-js-structure-plan.md` instead of mixing behavior changes into this domain-folder move.
