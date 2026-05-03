# Note Archive Controller Split Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/archive-js-structure-plan.md`
- Scope: note archive controller rendering/control split

## Summary

- Goal:
  - Reduce `assets/js/note/archive-controller.js` by moving cohesive note list rendering, view controls, pagination, and popular-tag behavior into dedicated note package modules.
- Outcome:
  - `Pass`
- Short conclusion:
  - The note archive controller now keeps state, data boot, location sync, sidebar handoff, and list/detail orchestration while smaller modules own reusable UI behavior.

## What Changed

- Added:
  - `assets/js/note/list-renderer.js`
  - `assets/js/note/view-controls.js`
  - `assets/js/note/popular-tags.js`
- Updated:
  - `assets/js/note/archive-controller.js` now delegates note card markup, empty-state markup, list page rendering, page-size controls, view-mode controls, pagination controls, and popular-tag rendering.
  - Active script tags in `index.html`, `archive/index.html`, and `archive/note/index.html` now load the new note modules before `assets/js/note/archive-controller.js`.
  - `docs/policies/project/architecture.md` maps the new note module ownership.
  - `docs/plans/refactoring/archive-js-structure-plan.md` records the Phase 3 split.
  - `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md` records the expanded note package boundary.

## Behavior / Parity Notes

- Behavior-preserving intent:
  - Note browse, search, grid/list, page size, popular tags, sidebar navigation, and direct note detail entry keep the existing visible behavior.
  - The plain-script model remains unchanged; the split only adds earlier note helper scripts before the controller.
- Intentional deltas:
  - New explicit globals support the static-script package boundary:
    - `window.NoteArchiveControls`
    - `window.NoteArchiveListRenderer`
    - `window.NoteArchivePopularTags`
- Parity claim status:
  - `Provisional`
- Parity confidence basis:
  - `Targeted route and interaction smoke`

## Validation

- Build / compile:
  - command: `find assets/js -name '*.js' -exec /opt/homebrew/bin/node --check {} \;`
  - result: `Pass`
- Targeted tests:
  - command: `npm run lint`
  - result: `Pass`
  - command: `node scripts/check-icon-control.mjs`
  - result: `Pass`
- Runtime / smoke / manual verification:
  - Started local server with `python3 -m http.server 8000`.
  - Checked `/`: root landing rendered with no console errors.
  - Ran landing search for `spring`: routed to `/archive/` and rendered list results with no console errors.
  - Switched list to grid view: URL changed to `/archive/?view=grid` and results rendered.
  - Opened page-size menu and selected `12`: grid results and page label updated.
  - Clicked popular tag `Spring`: tag-filtered results rendered with no console errors.
  - Opened a note card from the filtered grid: note detail rendered at `/archive/note?id=61`.
  - Ran topbar search from note detail: returned to note list results with no console errors.
  - Checked direct detail entry at `/archive/note?id=1`: note detail rendered with no console errors.
  - Checked `/archive/design/`: design surface rendered with no console errors.
  - Network requests showed `assets/js/note/view-controls.js`, `assets/js/note/list-renderer.js`, `assets/js/note/popular-tags.js`, and `assets/js/note/archive-controller.js` loading successfully.

## Risks / Limitations

- `assets/js/note/archive-controller.js` still owns note detail route handoff and location synchronization.
- Deeper extraction should be narrower than this batch, likely focused on detail route/render handoff or archive state access.

## Next Action

- Continue any remaining detail-route or state-boundary cleanup through `docs/plans/refactoring/archive-js-structure-plan.md`.
