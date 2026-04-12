# PRD-0002: Archive Discovery And Navigation Refinement

## Metadata

- ID: `prd-0002`
- Status: `passed`
- Owner role: `human`
- Created: `2026-04-11`
- Updated: `2026-04-12`

## Request Summary

- Refine the archive landing experience so browsing, filtering, and navigation feel more usable without changing the static-first notes product model.
- Adjust the archive view controls, activate topbar search, derive popular tags from real note metadata, simplify top navigation category exposure, and make the brand title return to the default home state.

## Source Set

- Human request:
  - Replace the current list and grid text toggle with icons.
  - Move the list and grid toggle from the top area of the archive hero to the lower area of that section.
  - Add a page-size control to the left of the view toggle.
  - Default page size should be `10` in list view and `6` in card or grid view.
  - Make the top-right search work against note body content, title, and tags.
  - Show sidebar popular tags only when a tag appears in at least `2` notes.
  - Clicking a popular tag should filter the archive list to notes matching that tag.
  - On the main screen, topbar `Categories` should behave like `Library` and `About` at rest, then show underline plus dropdown only on hover.
  - Topbar category navigation should expose only `2` levels:
    - category
    - collection
  - Individual note links must not appear in the topbar category dropdown.
  - Clicking topbar category or collection items should update the archive list to the matching scope.
  - Clicking `조치타의 메모장` in the top-left should return the user to the initial home or archive landing state.
- Post-run human review:
  - The previous feat-0002 interpretation was wrong.
  - Numeric note identity should replace the note `id` in Markdown source files, not be added as a separate derived `note_id` field.
  - Generated outputs such as `archives-index.json` should use that numeric `id` directly.
  - Legacy slug-shaped string IDs should be removed rather than preserved in a parallel field.
- Clarified product decisions:
  - Page-size options:
    - list view: `5`, `10`, `20`
    - grid view: `6`, `12`, `18`
  - When the user switches between list and grid, page size resets to that view's default:
    - list: `10`
    - grid: `6`
  - Clicking a popular tag filters against the full archive, not the current sidebar category or collection scope.
  - When a popular-tag filter is activated, sidebar category or collection focusing should clear because the result scope is global.
  - Topbar search applies only within the current menu depth or current archive scope, not globally across the entire archive.
  - Clicking the brand title should reset to the default `index.html` landing state.
  - Full-text search should use a static, generated reverse index separated from `archives-index.json`.
  - Search results should always be sorted by newest first.
  - Partial-match or prefix search is explicitly out of scope.
- Golden sources:
  - None supplied beyond the human request.
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
  - [sidebar-categories.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar-categories.js)

## Product Intent

- Make it easier to discover notes from the archive home by combining clearer view controls, working search, real tag-driven filtering, and more predictable category navigation.

## Confirmed Scope

- Replace the current list and grid text toggle with icon-based controls.
- Reposition the page-size control and view toggle into the lower area of the archive hero rather than the current top-right placement.
- Add a user-visible page-size control immediately to the left of the view toggle.
- Add page-size options by active view mode:
  - list view: `5`, `10`, `20`
  - grid view: `6`, `12`, `18`
- Apply default page size by active view mode and reset to that default when the user switches views:
  - list view: `10`
  - grid view: `6`
- Make the topbar search input functional on the main archive page.
- Search must match notes by:
  - title
  - tags
  - note content
- Implement note-content search through a separate static search index rather than by expanding `archives-index.json`.
- Use numeric note IDs as the source `id` in Markdown frontmatter and generated outputs.
- Remove legacy slug-shaped string IDs instead of retaining `slug`, `legacy_id`, or another parallel identifier field.
- Use basic token-based Korean and English search behavior comparable to a default, lightweight Elasticsearch-style experience.
- Exclude partial-match or prefix search from the initial scope.
- Sort all search results by newest first.
- Compute sidebar popular tags from the real note set currently available to the archive.
- Only render tags in the popular-tags list when the same normalized tag is present in at least `2` notes.
- Clicking a popular tag filters the full archive to notes matching that tag.
- Activating a popular-tag filter clears active sidebar category or collection focus.
- Change the topbar `Categories` idle state so it is not visually pre-hovered on the main archive page.
- Preserve the hover-driven underline and dropdown affordance for `Categories`.
- Limit the topbar categories dropdown depth to category and collection only.
- Make the topbar `Categories` dropdown taxonomy match the sidebar structure at category and collection depth.
- Allow clicking topbar category items to filter the archive to that category.
- Allow clicking topbar collection items to filter the archive to that category plus collection scope.
- Make the top-left brand title act as a home control that resets the archive to the default `index.html` landing state.

## Excluded Scope

- Introducing server-side search or any backend dependency
- Adding note-level items into the topbar navigation dropdown
- Adding new product areas such as notifications, members, or dashboards
- Redesigning the note detail screen beyond navigation handoff requirements
- Rebuilding the sidebar information architecture beyond the requested popular-tags behavior
- Changing the durable Markdown note ownership model under `CATEGORIES/`

## Uncertainty

- The request places the page-size control to the left of the view toggle, but does not define the exact UI pattern. This PRD confirms placement and behavior, not a final component style.
- The exact reverse-index file shape, token normalization details, and generator implementation are left to child design and spec work as long as they preserve the confirmed product behavior in this PRD.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Reuse the generated archive index and current runtime patterns where possible.
- Keep Markdown under `CATEGORIES/` as the only durable note source of truth.
- Keep the topbar category dropdown aligned with the real archive taxonomy and avoid hard-coded fake branches.
- Do not expose third-level note entries in the topbar categories menu.
- Keep the archive discovery flow lightweight and client-side.
- Any content-search implementation must remain static-friendly and must not require live indexing on a server.
- Full-text search data must live in a generated file separate from `assets/generated/archives-index.json`.
- Numeric note identity must be owned by the Markdown source `id` field rather than introduced only as a derived runtime helper.
- Identity migration should not leave a parallel legacy string-ID field in the note metadata contract unless the PRD is revised again.
- If search requires new generated data or identity rules, those changes must be derived from Markdown and documented in the note data contract rather than hand-maintained.

## Acceptance Envelope

- On the archive landing page, the view controls are icon-based and placed in the lower archive-hero control area, with page-size control to the left of the view toggle.
- The page-size control exposes `5/10/20` in list mode and `6/12/18` in grid mode.
- The archive defaults to `10` items per page in list mode and `6` items per page in grid mode, and switching views resets to that view's default page size.
- The top-right search field produces archive results on the main screen based on title, tags, and note content through a separate static reverse index.
- Search only applies within the current category or collection scope selected from archive navigation.
- Search uses lightweight token matching for Korean and English and does not provide partial-match or prefix search.
- Search results are sorted by newest first.
- The sidebar popular-tags area is populated from real runtime note data and only includes tags that appear at least twice.
- Clicking a popular tag filters the full archive list to notes carrying that tag and clears sidebar category or collection focus.
- The topbar `Categories` item appears idle by default and only reveals the current underline plus dropdown affordance on hover.
- The topbar categories dropdown stops at collection depth and never exposes individual notes.
- Clicking the brand title returns the user to the default `index.html` landing state.
- Clicking a topbar category or collection updates the archive list to the selected scope without breaking the existing static note-browsing flow.

## Candidate Features

- `feat-0002-numeric-source-note-ids-and-search-contract`: move note identity to numeric Markdown `id` values, remove legacy slug IDs, and fix downstream search-identity ownership
- `feat-0003-archive-controls-and-popular-tag-filtering`: refine archive view controls, page-size behavior, global popular-tag filtering, sidebar focus clearing, and brand-title home reset
- `feat-0004-static-search-index-foundation`: generate and validate the static reverse-index contract needed for archive search
- `feat-0005-topbar-taxonomy-and-scoped-search`: restructure topbar category behavior to 2-depth navigation and wire scoped topbar search against the passed search index

## Continuity Notes

- `2026-04-11`: initial draft created from human request covering archive discovery and navigation refinements
- `2026-04-11`: approved after clarifying search architecture, page-size behavior, popular-tag scope, and home reset behavior
- `2026-04-11`: decomposed into one foundation feature and two product features for safer spec and execution sequencing
- `2026-04-11`: corrected after post-run human review invalidated the earlier feat-0002 identity interpretation; numeric note identity must live in Markdown `id` and generated outputs directly
- `2026-04-11`: clarified that legacy slug-shaped string IDs should be removed rather than preserved in a secondary field
- `2026-04-12`: split former mixed feat-0004 into separate search-index foundation and topbar-search product features after clarifying that foundation and product outcomes must be planned separately
- `2026-04-12`: final human review accepted feat-0002 through feat-0005 and closed the PRD as complete
