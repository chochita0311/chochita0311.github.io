# FEAT-0003: Archive Controls And Popular Tag Filtering

## Metadata

- ID: `feat-0003`
- Status: `passed`
- Type: `product`
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Goal

- Product feature:
  - make the archive list surface easier to scan by improving the view controls, page-size behavior, global popular-tag filtering, and home reset behavior

## Acceptance Contract

- The archive hero exposes an icon-based list or grid view toggle in the lower control area, not the current upper-right position.
- A page-size dropdown control appears immediately to the left of the view toggle and shows the current numeric value.
- The page-size control exposes `5/10/20` in list mode and `6/12/18` in grid mode.
- The archive defaults to `10` items per page in list mode and `6` items per page in grid mode.
- Switching between list and grid resets page size to that view's default.
- The sidebar popular-tags surface is derived from real note metadata and only includes tags used by at least `2` notes.
- Clicking a popular tag filters the full archive result set to that tag, regardless of the previously focused sidebar category or collection.
- Activating a popular-tag filter clears active sidebar category or collection focus.
- Starting a search clears the active popular-tag state so search runs outside the tag-filtered mode.
- Clicking the brand title returns the archive to the default `index.html` landing state.

## Scope Boundary

- In:
  - archive hero control layout changes for page size and view mode
  - icon-based view-mode control
  - page-size state and pagination interaction changes
  - popular-tag derivation from runtime note data
  - popular-tag click filtering against the full archive
  - clearing sidebar category or collection focus when global tag filtering activates
  - brand-title home reset behavior on the main archive shell
- Out:
  - topbar scoped search behavior
  - full-text search index generation
  - topbar categories dropdown restructuring
  - note-detail redesign

## User-Visible Outcome

- Users can control archive density more clearly, switch views with icons, use popular tags as a global archive filter, and return to the landing state from the brand control.

## Entry And Exit

- Entry point:
  - user is on the main archive landing shell in `index.html`
- Exit or transition behavior:
  - selecting a note still enters the existing note-detail flow
  - clicking the brand title returns the user from filtered or detail-adjacent archive states to the default landing state

## State Expectations

- Default:
  - archive starts in list view with page size `10` and no active popular-tag filter
- Loading:
  - existing archive-loading behavior remains stable while controls and popular tags initialize
- Empty:
  - empty archive or empty filter results remain intentionally rendered with no broken controls
- Error:
  - missing note metadata should not break the view toggle, page-size control, or archive shell
- Success:
  - the user can change density, switch views, apply a global popular-tag filter, and reset home state without losing archive stability

## Dependencies

- Parent PRD [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Current archive rendering in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- Current sidebar category rendering in [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- Current archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)

## Pass Or Fail Checks

- The list or grid control is icon-based and no longer rendered as the current text buttons.
- The page-size dropdown appears to the left of the view toggle in the lower archive-hero control area and shows the current numeric value.
- List mode exposes `5/10/20` and starts at `10`.
- Grid mode exposes `6/12/18` and starts at `6`.
- Switching from list to grid resets page size to `6`.
- Switching from grid to list resets page size to `10`.
- Popular tags only include tags used by at least `2` notes.
- Clicking a popular tag filters the full archive and is not limited to the previously selected sidebar category or collection.
- When a popular tag filter is active, sidebar category or collection active state is cleared.
- Starting a search clears the active popular-tag state and leaves no sidebar category or collection item selected when the search scope becomes global.
- Clicking the brand title returns the archive to the default unfiltered landing state in `index.html`.

## Regression Surfaces

- Existing list and grid archive rendering
- Pagination controls
- Sidebar category navigation
- Note-detail opening flow
- Static GitHub Pages runtime compatibility

## Harness Trace

- Active spec doc: [spec-0003-archive-controls-and-popular-tag-filtering.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0003-archive-controls-and-popular-tag-filtering.md)
- Latest evaluator report: [eval-0003-functional-archive-controls-and-popular-tag-filtering.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0003-functional-archive-controls-and-popular-tag-filtering.md)
- Latest fix note:

## Continuity Notes

- `2026-04-11`: initial draft split from PRD-0002 to isolate archive-surface controls and global tag filtering from search and topbar taxonomy work
- `2026-04-11`: approved after fixing dropdown page-size control, tag-versus-search reset behavior, and home reset expectations
- `2026-04-11`: passed after archive control relocation, page-size reset rules, popular-tag global filtering, and brand-home reset behavior were verified in the local browser
