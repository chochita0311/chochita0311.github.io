# PRD-0001: Archive List And Grid View Toggle

## Metadata
- ID: `prd-0001`
- Status: `approved`
- Owner role: `human`
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Request Summary
- Keep the current archive list view as the main default browse surface.
- Add a grid-view mode that can be toggled from the archive screen based on `./tmp/ai-generated-grid.html`.
- Keep the existing left sidebar, top bar, and bottom footer areas unchanged, and do not add any feature or data that does not already exist in the current product.

## Source Set
- Human request:
  - `./tmp/ai-generated-grid.html` should drive the grid-view direction.
  - Only the currently implemented list-view area should be replaced on screen.
  - Left, top, and bottom areas must remain unchanged.
  - Do not add currently missing features or data arbitrarily.
- Golden sources:
  - [`./tmp/ai-generated-grid.html`](/Users/jungsoo/Projects/chochita0311.github.io/tmp/ai-generated-grid.html)
- Supporting docs:
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [design-constitution.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/design/design-constitution.md)
  - [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)

## Product Intent
- Keep archive notes readable in the current list-first browse surface while adding a secondary grid view for denser scanning.

## Confirmed Scope
- Keep the current list-oriented archive note surface as the default view.
- Add a user-visible toggle that switches between list and grid views inside the current archive content area.
- Add a grid-oriented archive card layout as the alternate view.
- Keep the existing shell structure outside the archive list area intact:
  - top bar
  - left sidebar
  - bottom footer or pagination area
- Reuse existing archive-note data already available in the runtime index and current UI.
- Preserve existing note-card click-through behavior and archive browsing purpose.
- Keep the implementation compatible with the current static GitHub Pages runtime.

## Excluded Scope
- Adding new archive metadata fields
- Adding images, bookmarks, account controls, sort controls, or other behaviors that do not already exist in the current product
- Rebuilding the left sidebar, top bar, or footer into the generated HTML look
- Changing note-detail behavior or note-loading architecture

## Uncertainty
- Exact visual density and card rhythm should be derived from the generated grid source and current design constitution together, not copied literally from the Tailwind demo shell.
- Existing footer pagination structure should remain intact even if the grid source shows a different footer treatment.
- The list view remains the default view unless a user explicitly switches to grid.

## Constraints
- Only the current archive content region may be changed for the view toggle and alternate grid presentation.
- Existing surrounding shell surfaces must remain visually and structurally intact.
- Do not introduce new data requirements beyond the current archive index and note metadata contract.
- Do not import the generated HTML's unrelated shell elements, mock controls, or invented content model.
- Preserve the current static-first implementation shape and existing runtime patterns.

## Acceptance Envelope
- The archive screen defaults to the current list-style browse mode.
- The archive screen exposes a clear toggle between list and grid views.
- The grid view uses only currently available archive note data and current interactions.
- The top bar, left sidebar, footer area, and note-detail region continue to behave as before.
- The grid mode feels materially informed by `./tmp/ai-generated-grid.html` in the archive-grid area without copying unrelated demo-shell features.

## Candidate Features
- `feat-0001-archive-grid-view-replacement`: keep list as the default archive view, add a list/grid toggle, and render the alternate grid mode while preserving existing shell and data boundaries

## Continuity Notes
- `2026-04-11`: initial PRD approved for grid replacement
- `2026-04-11`: corrected in place after execution exposed a planning gap; list remains default and grid becomes a toggleable alternate mode
