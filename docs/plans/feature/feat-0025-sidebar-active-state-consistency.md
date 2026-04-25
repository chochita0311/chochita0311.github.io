# FEAT-0025: Sidebar Active State Consistency

## Metadata

- ID: `feat-0025`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - ensure sidebar category and collection active styling stays visible and synchronized on scoped archive routes.

## Acceptance Contract

- Opening `/archive/note?category=Technology&collection=JAVA` shows both `Technology` and `JAVA` as active in the sidebar.
- The active collection receives the approved active or hovered color treatment rather than leaving only the parent category highlighted.
- Active state remains correct after direct entry, refresh, and in-app sidebar navigation.
- The fix does not create stale active styling when moving to another category, collection, or note.
- Hover, focus, and active styles remain visually distinguishable enough for navigation clarity.

## Scope Boundary

- In:
  - sidebar active category state
  - sidebar active collection state
  - route-to-sidebar visual state synchronization for scoped archive routes
  - visual parity between hover and active treatment where approved
- Out:
  - direct note-detail sidebar expansion from note metadata
  - scroll reset between scopes
  - broad sidebar layout redesign
  - typography system migration

## User-Visible Outcome

- Users can see both the current category and the current collection in the sidebar when browsing scoped archive routes.

## Entry And Exit

- Entry point:
  - user opens or navigates to a category and collection scoped archive route.
- Exit or transition behavior:
  - sidebar keeps the matching category expanded and the active collection visibly selected.

## State Expectations

- Default:
  - active category and collection reflect the current route.
- Loading:
  - sidebar does not briefly highlight the wrong collection.
- Empty:
  - empty scoped results still show the active category and collection context.
- Error:
  - invalid category or collection does not leave stale highlighting.
- Success:
  - sidebar state communicates the current browse scope.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)

## Likely Affected Surfaces

- [assets/js/sidebar.js](../../../assets/js/sidebar.js)
- [assets/js/archive/content.js](../../../assets/js/archive/content.js)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/css/layouts.css](../../../assets/css/layouts.css)

## Pass Or Fail Checks

- Open `/archive/note?category=Technology&collection=JAVA` and confirm both `Technology` and `JAVA` show active styling.
- Switch to another collection and confirm the old collection is no longer active.
- Refresh the scoped route and confirm active state remains correct.
- Hover and focus states still work on sidebar items.
- No unrelated sidebar items receive active styling.

## Regression Surfaces

- Sidebar category disclosure behavior
- Archive route state
- Collection filtering
- Direct entry and refresh behavior

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning.
- `2026-04-25`: passed after browser verification showed `/archive/note?category=Technology&collection=JAVA` highlights both `Technology` and `JAVA`.
