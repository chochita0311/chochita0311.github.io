# SPEC-0005: Topbar Taxonomy And Scoped Search

## Metadata

- ID: `spec-0005`
- Status: `approved`
- Run ID: `run-20260412-03`
- Attempt: `1`
- Parent Feature: [feat-0005-topbar-taxonomy-and-scoped-search.md](docs/plans/feature/feat-0005-topbar-taxonomy-and-scoped-search.md)
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-12`
- Updated: `2026-04-12`

## Source Set

- Human-approved feature:
  - [feat-0005-topbar-taxonomy-and-scoped-search.md](docs/plans/feature/feat-0005-topbar-taxonomy-and-scoped-search.md)
- Parent PRD:
  - [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Golden sources:
  - current archive shell in [index.html](index.html)
  - current archive runtime in [archive-content.js](assets/js/archive/content.js)
- Relevant policies or contracts:
  - [note-data-contract.md](docs/policies/archive/note/note-data-contract.md)
  - [archive-search-contract.md](docs/policies/archive/note/archive-search-contract.md)
  - [architecture.md](docs/policies/project/architecture.md)

## Implementation Goal

- Replace the hard-coded topbar taxonomy with real category and collection navigation and wire the topbar search input to the passed reverse index so users can search within the current archive scope.

## In-Scope Behavior

- Remove the pre-hovered topbar `Categories` treatment from the main archive page.
- Render topbar taxonomy from real archive metadata at category and collection depth only.
- Do not expose note-level entries in the topbar dropdown.
- Clicking a topbar category navigates to that category scope.
- Clicking a topbar collection navigates to that category plus collection scope.
- Topbar search runs automatically while typing with a short debounce.
- Search uses the static reverse index plus current archive metadata.
- Search applies within the current category or collection scope.
- Clicking a topbar category or collection while search is active clears the query and returns that scope to its default list state.
- Search results use token lookup from the reverse index and keep archive sorting newest first.
- Multi-token queries use union candidate matching and then apply current scope filtering.

## Out-Of-Scope Behavior

- Search-index generation or token-rule changes
- Popular-tag behavior
- Page-size behavior
- Note-detail redesign

## Affected Surfaces

- [index.html](index.html)
- [archive-content.js](assets/js/archive/content.js)
- [sidebar.js](assets/js/sidebar.js)
- [topbar.js](assets/js/topbar.js)
- [components.css](assets/css/components.css)
- generated [archives-search-index.json](assets/generated/archives-search-index.json)

## State And Interaction Contract

- Default state:
  - topbar `Categories` is visually idle
  - search field is empty
  - dropdown is hidden until hover or focus
- Hover or focus state:
  - underline and chevron affordance appear
  - dropdown becomes visible
- Search state:
  - query remains in the input while the user stays in the same scope
  - clearing the input restores the current scope default list
- Scope change state:
  - topbar category or collection click clears the query and restores the selected scope default list
- Empty results:
  - search shows an intentional empty state inside the archive surface without breaking navigation

## Acceptance Mapping

- Idle topbar:
  - `Categories` no longer appears pre-hovered on initial load
- Taxonomy depth:
  - category and collection only
- Real taxonomy:
  - topbar structure matches sidebar category and collection structure
- Scoped search:
  - search uses current category or collection scope
- Auto search:
  - debounce-based input search without magnifier click
- Scope reset:
  - topbar navigation clears active query and returns to default scoped list state

## Evaluation Focus

- Design evaluation should verify:
  - idle versus hover topbar treatment
  - dropdown clarity and containment
  - no visual regression in the shell
- Functional evaluation should verify:
  - category and collection click behavior
  - scoped search results
  - query reset on topbar scope change
  - body-term search through the reverse index

## Open Blockers

- None.

## Continuity Notes

- `2026-04-12`: initial spec created after feat-0004 passed and made the reverse search index available for product search wiring
