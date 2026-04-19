# SPEC-0003: Archive Controls And Popular Tag Filtering

## Metadata

- ID: `spec-0003`
- Status: `approved`
- Run ID: `run-20260411-03`
- Attempt: `1`
- Parent Feature: [feat-0003-archive-controls-and-popular-tag-filtering.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0003-archive-controls-and-popular-tag-filtering.md)
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Source Set

- Human request:
  - list/grid toggle should become icons
  - controls should move to the lower archive-hero area
  - page size should sit to the left of the view toggle
  - list defaults to `10`, grid defaults to `6`
  - popular tags should derive from real notes and only show tags used at least twice
  - clicking a popular tag should show the full-archive results for that tag
  - when popular tag filtering is active, sidebar category focus should clear
  - brand title should return to the default home state
- Parent feature:
  - [feat-0003-archive-controls-and-popular-tag-filtering.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0003-archive-controls-and-popular-tag-filtering.md)
- Parent PRD:
  - [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Golden sources:
  - current archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- Relevant policies or contracts:
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-data-contract.md)

## Implementation Goal

- Replace the current text-based archive controls with a lower-hero density bar, derive and wire popular-tag filtering from runtime note metadata, and make the brand title reset the archive shell to its default landing state.

## In-Scope Behavior

- Change the archive hero layout so controls render in a lower control row.
- Replace text list/grid buttons with icon buttons.
- Add a page-size dropdown to the left of the view toggle.
- List mode must offer `5/10/20` with default `10`.
- Grid mode must offer `6/12/18` with default `6`.
- Switching views must reset page size to that view's default.
- Render popular tags from real notes with minimum frequency `2`.
- Clicking a popular tag must:
  - clear category and collection focus
  - filter the full archive to matching notes
  - update the archive title and summary to the tag-filter state
- Starting a search in the existing topbar input must clear active popular-tag state even though full search behavior belongs to `feat-0004`.
- Clicking the brand title must reset:
  - category
  - collection
  - active tag
  - active note
  - page
  - view mode to list
  - page size to list default

## Out-Of-Scope Behavior

- Search result filtering logic
- Topbar taxonomy restructuring
- Note-detail redesign
- Search index generation

## Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [archive/note/index.html](/Users/jungsoo/Projects/chochita0311.github.io/archive/note/index.html)
- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)

## State And Interaction Contract

- Default archive state:
  - list view
  - page size `10`
  - no active tag
  - no selected category or collection
- Category or collection navigation clears active tag state.
- Popular tag filtering is global and must not preserve sidebar category selection styling.
- Search input only needs to clear active tag state in this feature.
- The brand-title reset may navigate or rerender, but the resulting state must match the default landing state.

## Data And Contract Assumptions

- Popular tags derive from `archives-index.json` `tags`.
- Tag comparison uses exact normalized tag values already present in note metadata.
- Archive list rendering can continue to key off note `path` for note opening.

## Acceptance Mapping

- Icon control replacement:
  - lower hero control row with icon view buttons
- Page-size behavior:
  - per-view dropdown options and default reset rules
- Popular tag derivation:
  - frequency count from runtime notes, minimum `2`
- Global tag filtering:
  - full-archive results and sidebar focus clear
- Home reset:
  - brand title returns archive to default landing state

## Evaluation Focus

- Functional evaluation should verify:
  - page-size options and resets by view
  - full-archive tag filtering regardless of prior sidebar selection
  - sidebar active state clearing on tag filter
  - brand-title reset behavior
- Design evaluation should verify:
  - lower control row placement
  - icon control clarity
  - no visual regression in sticky archive hero and sidebar shell

## Open Blockers

- None.

## Continuity Notes

- `2026-04-11`: initial spec created for feat-0003 archive control and popular-tag execution
- `2026-04-11`: approved for execution after confirming dropdown page-size control, global popular-tag behavior, and search-clears-tag interaction
