# SPEC-0001: Archive List And Grid View Toggle

## Metadata

- ID: `spec-0001`
- Status: `approved`
- Run ID: `run-20260411-01`
- Parent Feature: [feat-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0001-archive-grid-view-replacement.md)
- Parent PRD: [prd-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0001-archive-grid-view-replacement.md)
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Source Set

- Human request:
  - keep the current list view as the main archive surface
  - add a grid view that can be toggled from the archive screen
  - keep left, top, and bottom shell areas unchanged
  - do not add currently missing features or data
- Parent feature: [feat-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0001-archive-grid-view-replacement.md)
- Parent PRD: [prd-0001-archive-grid-view-replacement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0001-archive-grid-view-replacement.md)
- Golden sources:
  - [ai-generated-grid.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/ai-generated-grid.html)
- Relevant policies or contracts:
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [design-constitution.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/design/design-constitution.md)
  - [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-data-contract.md)

## Implementation Goal

- Keep the current archive note-list stack as the default browse surface, add an in-scope toggle between list and grid, and render the grid as the alternate browse mode inside the existing shell.

## In-Scope Behavior

- Keep the current `archive-list-view` container, archive hero, footer, sidebar, top bar, and note-detail surfaces structurally intact.
- Add a small archive-local view toggle inside the archive hero area.
- Keep list rendering as the default note-list treatment.
- Add an alternate grid-card treatment inside the same archive-note-list region.
- Render cards from existing note fields already present in `assets/generated/archives-index.json`:
  - `category`
  - `collection`
  - `title`
  - `summary`
  - `tags`
  - `created` or `updated` when available
- Keep each card clickable through the existing `data-note-link` and `data-note-path` flow.
- Use the generated HTML as visual direction for:
  - denser card-based browse rhythm
  - multi-column layout on wider screens
  - stronger card surfaces and hover emphasis inside the archive area only
- Keep the list view visually closer to the current editorial list treatment.
- Preserve the current archive empty-state behavior, but render it inside the new grid surface without collapsing layout.

## Out-Of-Scope Behavior

- No new top-bar, sidebar, footer, bookmark, account, sort, or search controls
- No image area
- No new metadata requirements
- No note-detail redesign
- No Tailwind import or copying of the generated HTML shell

## Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)

## State And Interaction Contract

- Default:
  - note cards render in the current list-first browse treatment
- View toggle:
  - archive hero exposes list and grid controls
  - list is the default active mode
  - grid becomes active only after explicit user selection
- Responsive:
  - list view stays single-column across widths
  - grid view uses one column on narrow widths
  - grid view uses two columns on medium widths where space allows
  - grid view uses three columns on wide desktop widths where the current content width supports it
- Card content:
  - list mode top meta row shows category accent plus collection label
  - grid mode top meta row shows category accent plus a secondary date label when available, otherwise collection
  - title remains the primary readable element
  - summary remains visible in list mode and may be visually constrained in grid mode for card rhythm
  - tags remain visible using the existing tag data, with overflow handled gracefully in both modes
  - collection remains visible as compact secondary metadata in grid mode footer
- Click behavior:
  - clicking the card continues to open the existing note-detail flow
- View persistence:
  - the selected browse mode may persist in the archive URL using a `view` query parameter
  - list remains the implied default when no `view` parameter is present
- Empty state:
  - the current empty-state message remains visible and spans the available note-list region without broken card sizing in either mode

## Data And Contract Assumptions

- Use only the existing runtime index fields already present in note data.
- Prefer `updated`, then `created`, for the visible secondary date label when either exists.
- Do not assume preview images, read-time values, bookmarks, or per-card actions.
- Do not change the note-data contract in this feature.

## Acceptance Mapping

- List remains the default layout:
  - keep the base `.note-list` and default note-card treatment list-first
- Grid becomes an alternate mode:
  - add a scoped toggle and update `.note-list` and note-card styling for responsive multi-column browse when grid is active
- Grid informed by golden source only within archive area:
  - adopt stronger card surfaces, hover emphasis, and denser browse rhythm without importing unrelated shell elements
- Existing data only:
  - keep note markup driven from current runtime fields
- Existing click-through preserved:
  - retain `data-note-link` and `data-note-path` flow
- Shell untouched:
  - no structural or visual replacement for top bar, sidebar, footer, or detail view

## Evaluation Focus

- Design:
  - list view remains stable and readable as the primary browse surface
  - grid view feels materially closer to the provided grid-source mood without violating the editorial constitution
  - grid cards preserve containment for titles, tags, and footer metadata across supported breakpoints
  - left, top, and bottom shell remain unchanged
- Functional:
  - list and grid toggles switch the archive browse mode correctly
  - category filtering still re-renders correctly
  - note-detail navigation still opens from card click
  - pagination still works
- UX heuristic:
  - active view state remains obvious
  - scan rhythm stays readable
  - card click target remains obvious
  - no browse confusion caused by compressed metadata

## Open Blockers

- None. The corrected feature is executable from the current repo context.

## Continuity Notes

- `2026-04-11`: executable spec generated from approved feature boundary
- `2026-04-11`: rewritten in place after the earlier replacement-only interpretation was classified as a planning gap
