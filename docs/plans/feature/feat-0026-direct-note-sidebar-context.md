# FEAT-0026: Direct Note Sidebar Context

## Metadata

- ID: `feat-0026`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `functional`, `ux-heuristic`, `design`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - expand and highlight the left sidebar from note metadata when users open note-detail routes directly.

## Acceptance Contract

- Opening `/archive/note?id=37` directly expands the sidebar to the note's resolved category and collection.
- The sidebar context matches the state a user would see after entering the same note from the archive list.
- Direct entry, refresh, and in-app note navigation keep the sidebar synchronized to the active note.
- Unknown or unresolved note metadata fails gracefully without stale sidebar expansion.
- The fix does not create a new route contract or require users to enter from list pages first.

## Scope Boundary

- In:
  - resolving note category and collection from note metadata or archive index data
  - applying sidebar expansion and highlighting on direct note-detail entry
  - maintaining sidebar context during note-detail refresh and in-app note navigation
- Out:
  - collection active styling for scoped list routes already owned by `feat-0025`
  - note reference repair
  - route-model redesign
  - sidebar layout redesign

## Contract Surfaces

- Note-detail route `/archive/note?id=<note-id>`
- Note metadata fields for category and collection
- Sidebar state model for expanded category and active collection

## User-Visible Outcome

- Users who open a note directly still see where the note belongs in the sidebar.

## Entry And Exit

- Entry point:
  - user opens a direct note-detail URL such as `/archive/note?id=37`.
- Exit or transition behavior:
  - note detail is visible and the sidebar is expanded to the note's category and collection.

## State Expectations

- Default:
  - direct note entry derives sidebar context from note metadata.
- Loading:
  - sidebar avoids showing a stale or wrong expanded context before note metadata resolves.
- Empty:
  - not applicable.
- Error:
  - unknown note IDs do not leave stale category or collection state.
- Success:
  - sidebar context matches the active note.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Prefer `feat-0025-sidebar-active-state-consistency` first if active styling rules are not yet stable.

## Likely Affected Surfaces

- [assets/js/index-note-detail.js](../../../assets/js/index-note-detail.js)
- [assets/js/sidebar.js](../../../assets/js/sidebar.js)
- [assets/js/archive/content.js](../../../assets/js/archive/content.js)
- [assets/generated/archives-index.json](../../../assets/generated/archives-index.json)

## Pass Or Fail Checks

- Open `/archive/note?id=37` directly and confirm the left sidebar expands to the note category and collection.
- Refresh `/archive/note?id=37` and confirm sidebar context remains correct.
- Navigate to previous or next note and confirm sidebar context updates if category or collection changes.
- Unknown note IDs do not leave stale sidebar state.
- Entering the same note from the list and directly produces equivalent sidebar context.

## Regression Surfaces

- Note-detail route resolution
- Sidebar disclosure behavior
- Archive list to detail navigation
- Previous and next note navigation

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning after sidebar active-state rules are stable.
- `2026-04-25`: passed after browser verification showed direct entry to `/archive/note?id=37` expands and highlights the sidebar based on the note's `Technology / JAVA` context.
