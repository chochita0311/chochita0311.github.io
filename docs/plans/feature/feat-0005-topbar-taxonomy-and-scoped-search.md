# FEAT-0005: Topbar Taxonomy And Scoped Search

## Metadata

- ID: `feat-0005`
- Status: `passed`
- Type: `product`
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-12`
- Updated: `2026-04-12`

## Goal

- Product feature:
  - make topbar category navigation feel intentional and activate scoped archive search without exposing deeper taxonomy than the approved archive structure

## Acceptance Contract

- The topbar `Categories` item appears idle by default and is not pre-hovered on initial page load.
- Hovering `Categories` reveals the underline and dropdown affordance rather than showing them permanently.
- The dropdown taxonomy stops at category and collection depth and never exposes note-level links.
- The topbar category taxonomy matches the archive structure used by the sidebar.
- Clicking a topbar category filters the archive to that category.
- Clicking a topbar collection filters the archive to that category plus collection scope.
- The top-right search field works on the main archive page within the current category or collection scope.
- Search runs automatically while the user types rather than requiring a dedicated search-button click.
- Search input uses a short debounce so the static client search remains stable while typing.
- Clicking a topbar category or collection while a search query is active clears the search query and shows that scope's default list state.
- Search matches title, tags, and note content through the passed static search-index contract.
- Search results are sorted newest first.
- Search does not provide partial-match or prefix matching.

## Scope Boundary

- In:
  - topbar categories idle, hover, and dropdown behavior
  - topbar taxonomy generation for category and collection depth
  - topbar category and collection click-to-filter behavior
  - topbar search interaction and scope binding
  - automatic search trigger behavior while typing
  - search result rendering within the current archive list surface
  - interaction continuity between topbar navigation and search state
- Out:
  - static search-index contract design or generation
  - popular-tag filtering behavior
  - page-size control behavior
  - note-detail redesign

## User-Visible Outcome

- Users can hover topbar categories to browse the real archive taxonomy, click category or collection scopes, and search within the current scope from the top-right field.

## Entry And Exit

- Entry point:
  - user is on the main archive shell and interacts with topbar navigation or search
- Exit or transition behavior:
  - topbar category selection updates the archive list without breaking the surrounding shell
  - search results remain inside the current archive list surface and preserve the current navigation context until the user selects a new topbar category or collection, which resets the query and returns that scope to its default list state

## State Expectations

- Default:
  - categories is visually idle and search field is empty
- Loading:
  - topbar taxonomy and search bindings initialize without exposing fake or partially built menu states
- Empty:
  - scoped search with no matches renders an intentional empty result state inside the archive surface
- Error:
  - unavailable search-index data should fail in a bounded way without breaking archive browsing
- Success:
  - topbar hover, click, and scoped search interactions all work against the approved archive taxonomy and passed search contract

## Dependencies

- Parent PRD [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Required foundation features:
  - `feat-0002-numeric-source-note-ids-and-search-contract`
  - `feat-0004-static-search-index-foundation`
- Existing archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- Existing archive and navigation behavior in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js) and [sidebar-categories.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar-categories.js)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [sidebar-categories.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar-categories.js)
- [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- generated static search-index asset under `assets/generated/`

## Pass Or Fail Checks

- `Categories` is not visually active before hover on the default archive landing state.
- Hovering `Categories` reveals the intended underline and dropdown affordance.
- The dropdown exposes categories and collections only and never individual notes.
- The dropdown taxonomy matches the sidebar taxonomy at category and collection depth.
- Clicking a topbar category updates the archive list to that category.
- Clicking a topbar collection updates the archive list to that category plus collection.
- Clicking a topbar category or collection while search is active clears the search query instead of carrying it into the next scope.
- Typing in the top-right search field filters within the current category or collection scope instead of the full archive.
- Typing in the top-right search field triggers automatic search after a short debounce and does not require clicking the magnifier icon.
- Search results include matches from title, tags, and indexed note content.
- Search results are ordered newest first.
- Partial-match or prefix queries are not required for pass.

## Regression Surfaces

- Existing topbar shell layout
- Sidebar category navigation
- Archive list rendering
- Note-detail opening flow
- Static GitHub Pages runtime compatibility

## Harness Trace

- Active spec doc: [spec-0005-topbar-taxonomy-and-scoped-search.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0005-topbar-taxonomy-and-scoped-search.md)
- Latest evaluator report: [eval-0005-functional-topbar-taxonomy-and-scoped-search.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0005-functional-topbar-taxonomy-and-scoped-search.md)
- Latest fix note:

## Continuity Notes

- `2026-04-12`: created by splitting the former mixed feat-0004 boundary into a foundation search-index feature and a downstream product search feature
- `2026-04-12`: passed after topbar taxonomy was generated from real archive metadata and scoped search was wired to the static reverse index with debounce and scope-reset behavior
