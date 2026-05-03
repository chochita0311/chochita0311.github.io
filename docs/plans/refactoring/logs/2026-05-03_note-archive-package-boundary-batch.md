# Note Archive Package Boundary Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Related track: `docs/plans/refactoring/archive-js-structure-plan.md`
- Scope: note-specific archive browse/search package placement

## Summary

- Goal:
  - Keep `assets/js/archive/` reserved for archive-wide concerns and move note-specific browse/search runtime files into `assets/js/note/`.
- Outcome:
  - `Pass`
- Short conclusion:
  - The active file layout now treats archive as the content container and note as the current content package inside it.

## What Changed

- Moved/Renamed:
  - `assets/js/archive/content.js` -> `assets/js/note/archive-controller.js`
  - `assets/js/archive/search.js` -> `assets/js/note/search.js`
- Updated:
  - Active script tags in `index.html`, `archive/index.html`, and `archive/note/index.html`.
  - `assets/js/note/archive-controller.js` now reads `window.NoteSearch || window.ArchiveSearch`.
  - `assets/js/note/search.js` publishes `window.NoteSearch` and keeps `window.ArchiveSearch` as a compatibility alias.
  - `docs/policies/project/architecture.md` now maps archive-wide routing separately from note browse/search ownership.
  - Active refactor plans and logs now point deeper note browse/read splitting at `assets/js/note/archive-controller.js`.
- Removed:
  - No additional files.

## Behavior / Parity Notes

- Behavior-preserving intent:
  - The plain-script load order remains the same relative order: route, shell, note detail, landing, note search, note archive controller.
  - Existing `window.ArchiveSearch` consumers remain supported through a compatibility alias.
  - `window.NoteSearch` is added as the clearer package-level owner name.
- Intentional deltas:
  - The file paths now express the future model: `archive/` for archive-wide URL grammar, `note/` for note browse/search/read behavior.
- Parity claim status:
  - `Provisional`
- Parity confidence basis:
  - `Targeted route smoke`

## Validation

- Build / compile:
  - command: `find assets/js -name '*.js' -exec /opt/homebrew/bin/node --check {} \;`
  - result: `Pass`
- Targeted tests:
  - command: `npm run lint`
  - result: `Pass`
  - command: `node scripts/check-icon-control.mjs`
  - result: `Pass`
  - command: stale old-path `rg` audit across active HTML, runtime JS, scripts, and durable policy docs
  - result: `Pass, no active references to assets/js/archive/content.js or assets/js/archive/search.js remained`
- Runtime / smoke / manual verification:
  - Started local server with `python3 -m http.server 8000`.
  - Checked `/`: root landing rendered with no console errors.
  - Checked root landing search for `spring`: search routed to `/archive/` and rendered results with no console errors.
  - Checked `/archive/note?id=1`: note detail rendered with no console errors.
  - Checked `/archive/design/`: design surface rendered with no console errors.
  - Network requests showed `assets/js/note/search.js` and `assets/js/note/archive-controller.js` loading successfully; no old `assets/js/archive/search.js` or `assets/js/archive/content.js` request was observed.

## Risks / Limitations

- Follow-up on 2026-05-03 split list rendering, view controls, pagination, and popular-tag behavior into separate note modules. The controller still owns state, data boot, location sync, and detail route handoff.
- This batch moves ownership paths but does not split list rendering, detail routing, pagination, or tag filtering into smaller modules.

## Next Action

- Continue any deeper split through `docs/plans/refactoring/archive-js-structure-plan.md`.
