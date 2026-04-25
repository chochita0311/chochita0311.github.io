# FEAT-0023: Sidebar Scope Scroll Reset

## Metadata

- ID: `feat-0023`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `functional`, `ux-heuristic`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - reset or normalize archive list scroll position when sidebar category or collection navigation changes the active result scope.

## Acceptance Contract

- After scrolling down in one collection, selecting a different sidebar collection shows the top of the newly selected result set.
- Scope changes such as `Technology > Java` to `Technology > Spring` do not inherit the old list scroll position.
- The scroll reset applies to sidebar-driven category and collection changes, not arbitrary internal rerenders.
- The transition does not create route flash, list flicker, or misleading empty/default intermediate states.
- Browser history and direct-entry behavior remain stable.

## Scope Boundary

- In:
  - sidebar-driven category and collection scope changes
  - list scroll-position normalization after a new result scope is selected
  - verification across repeated sidebar collection changes
- Out:
  - typography application
  - sidebar active-state styling
  - direct note-detail sidebar expansion
  - note-detail reference repair
  - route-model redesign

## User-Visible Outcome

- Users who switch collections from the sidebar see the new list from the beginning instead of landing near the bottom because of the previous collection's scroll depth.

## Entry And Exit

- Entry point:
  - user is on an archive list or filtered collection and has scrolled below the top.
- Exit or transition behavior:
  - after selecting a different sidebar category or collection, the visible list starts at the top of the new result scope.

## State Expectations

- Default:
  - new sidebar scope begins at the top of its result set.
- Loading:
  - loading or render gating does not flash wrong list content.
- Empty:
  - no-result or empty states appear from the top of the content area.
- Error:
  - failed route or data resolution does not preserve a misleading old scroll depth.
- Success:
  - scope change and scroll position feel like one coherent transition.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)

## Likely Affected Surfaces

- [assets/js/archive/content.js](../../../assets/js/archive/content.js)
- [assets/js/sidebar.js](../../../assets/js/sidebar.js)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- archive list runtime state

## Pass Or Fail Checks

- Scroll down in `Technology > Java`, select `Technology > Spring`, and confirm the new list is visible from the top.
- Repeat the same check between two other sidebar collections.
- Category-level sidebar changes also begin from the top of the new result scope.
- Direct route entry remains unaffected.
- Back/forward behavior remains coherent.

## Regression Surfaces

- Archive route state
- Sidebar navigation
- Pagination and page-size controls
- Existing list render stability

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning.
- `2026-04-25`: passed after browser verification showed switching from `Technology > JAVA` near the bottom of the page to `Technology > Spring` resets the list to the top of the new result scope.
