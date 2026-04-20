# FEAT-0001: Archive List And Grid View Toggle

## Metadata

- ID: `feat-0001`
- Status: `passed`
- Type: `product`
- Parent PRD: [prd-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0001-archive-grid-view-replacement.md)
- Created: `2026-04-11`
- Updated: `2026-04-20`

## Goal

- Keep the current archive list surface as the default browse mode and add a toggleable grid mode that uses the existing archive-note data while preserving the surrounding shell.

## Acceptance Contract

- The archive browse area defaults to the current list-style layout.
- The archive browse area exposes an in-scope toggle between list and grid views.
- The grid presentation is visibly informed by `./tmp/ai-generated-grid.html` only within the archive content area.
- Existing archive data fields continue to populate the cards without requiring new metadata.
- Existing click-through and archive browsing behavior remain intact.
- Left sidebar, top bar, bottom footer, and note-detail surfaces remain outside this feature's visual replacement scope.

## Scope Boundary

- In:
  - archive view toggle inside the current archive hero or content header area
  - preserving the current list browse mode as the default state
  - archive card structural and visual updates needed for the grid presentation
  - responsive behavior for the grid within the current archive content area
  - preserving current runtime data usage and note-card click behavior
- Out:
  - new data fields
  - new top-bar or sidebar controls copied from the generated HTML
  - footer redesign
  - note-detail redesign

## User-Visible Outcome

- The archive screen starts in list view and lets the user switch to a grid browse mode while the rest of the page shell remains unchanged.

## Entry And Exit

- Entry point:
  - user opens the archive list view in the current published shell
- Exit or transition behavior:
  - selecting a note should continue to open the existing note-detail flow without regression

## State Expectations

- Default:
  - archive notes render in the stable list-first browse layout
- Alternate:
  - user can switch to a stable grid card layout
- Mobile:
  - archive stays in list mode and does not expose the list-grid toggle
- Loading:
  - existing archive loading behavior remains intact unless current implementation has no separate loading state
- Empty:
  - existing empty-state messaging remains visible and stable inside the grid surface
- Error:
  - existing archive error handling remains intact
- Success:
  - archive note cards render with existing metadata and support existing interactions

## Dependencies

- Existing archive-note data contract in [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-data-contract.md)
- Existing archive rendering flow in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- Existing shell and layout structure in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html) and [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)

## Pass Or Fail Checks

- The archive note area defaults to list view on first load.
- The archive screen exposes a working toggle between list and grid views.
- The archive note area renders as a coherent responsive grid when grid is active.
- Every rendered card uses only currently available fields already present in the archive runtime data.
- Clicking a rendered grid card still opens the intended note-detail behavior.
- Clicking a rendered list card still opens the intended note-detail behavior.
- Sidebar category changes still update the archive surface correctly.
- The top bar, left sidebar, footer, and note-detail area are not visually replaced by generated demo-shell markup.
- No new mock controls or fake data surfaces from `./tmp/ai-generated-grid.html` appear in the implementation.

## Regression Surfaces

- Sidebar category rail rendering and filtering
- Archive hero title and summary behavior
- Footer pagination panel
- Note-detail opening flow
- Static GitHub Pages runtime compatibility

## Harness Trace

- Active run doc: [run-20260411-01-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/run/run-20260411-01-archive-grid-view-replacement.md)
- Active spec doc: [spec-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0001-archive-grid-view-replacement.md)
- Latest evaluator reports:
  - [eval-0001-design-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0001-design-archive-grid-view-replacement.md)
  - [eval-0001-functional-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0001-functional-archive-grid-view-replacement.md)
  - [eval-0001-ux-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0001-ux-archive-grid-view-replacement.md)
- Latest fix note:

## Continuity Notes

- `2026-04-11`: initial approved product feature from archive grid replacement request
- `2026-04-11`: entered execution loop with run-20260411-01 and spec-0001
- `2026-04-11`: execution exposed a planning gap because list should remain default and grid should be a toggle
- `2026-04-11`: corrected in place and passed after rebuilt toggle-based implementation and re-evaluation
- `2026-04-20`: mobile browse was narrowed to list-only so the archive no longer shows an oversized toggle for a one-column grid state on small screens
