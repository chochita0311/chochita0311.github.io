# FEAT-0008: Notes Root And Topbar Placeholder Reframe

## Metadata

- ID: `feat-0008`
- Status: `draft`
- Type: `foundation`
- Parent PRD: [prd-0004-archive-navigation-and-label-polish.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Goal

- Foundation feature:
  - rename the durable archive root from `CATEGORIES/` to `NOTES/`, fix all active runtime and generator ownership around that path, and reframe the user-facing archive navigation language around `Notes` plus the future-facing topbar placeholder set

## Acceptance Contract

- The durable note source root is `NOTES/`.
- Active runtime code no longer relies on `CATEGORIES/` as the live content root.
- Active generator scripts and generated outputs no longer rely on `CATEGORIES/` as the live content root.
- Owner docs no longer describe `CATEGORIES/` as the active archive root.
- Product-visible navigation text uses `Notes` instead of `Categories` on touched surfaces.
- The topbar visible labels read `Notes`, `Projects`, `Design`, `Game`, and `About`.
- `Projects`, `Design`, `Game`, and `About` remain bounded placeholders and do not break existing notes browsing.

## Scope Boundary

- In:
  - root directory rename from `CATEGORIES/` to `NOTES/`
  - runtime path updates for note loading and note-link generation
  - generator and generated-artifact updates tied to the new root
  - documentation updates for active content-root ownership
  - user-facing copy updates from `Categories` to `Notes`
  - topbar relabeling to `Notes / Projects / Design / Game / About`
  - placeholder behavior needed so new topbar labels do not break the current notes-first app
- Out:
  - footer control relocation and page-size behavior
  - popular-tag threshold changes
  - grid-card spacing, truncation, or hidden-tag hover reveal
  - creation of real `Projects`, `Design`, `Game`, or `About` product sections
  - changing the nested note structure beyond the root-path rename

## User-Visible Outcome

- Users see `Notes` as the primary notes navigation language, the topbar adopts the future-facing placeholder labels, and note browsing still works after the archive root is renamed to `NOTES/`.

## Entry And Exit

- Entry point:
  - user lands on the main archive shell or a note detail route that reads note content from the durable archive root
- Exit or transition behavior:
  - user continues to browse notes through the same archive and note-detail flows, but the active content root and product-facing labels now consistently reflect `NOTES`

## State Expectations

- Default:
  - archive initialization reads from `NOTES/`
  - topbar shows `Notes`, `Projects`, `Design`, `Game`, and `About`
- Loading:
  - note loading and archive boot do not fail because of mixed `CATEGORIES/` and `NOTES/` assumptions
- Empty:
  - empty archive messaging, if reached, reflects `Notes` terminology where touched
- Error:
  - runtime failures caused by stale `CATEGORIES/` assumptions are eliminated from active paths
- Success:
  - content loads from `NOTES/`, visible labels say `Notes`, and placeholder topbar items remain non-breaking

## Dependencies

- Parent PRD [prd-0004-archive-navigation-and-label-polish.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Current archive runtime in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js), [note-detail-page.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/note-detail-page.js), and [sidebar-categories.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar-categories.js)
- Current taxonomy and topbar behavior in [topbar-taxonomy.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar-taxonomy.js)
- Current generators in [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs) and [generate-sitemap.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-sitemap.mjs)
- Current content and contract docs in [README.md](/Users/jungsoo/Projects/chochita0311.github.io/README.md), [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md), and [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)

## Likely Affected Surfaces

- `NOTES/` and former `CATEGORIES/`
- [assets/js/archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [assets/js/note-detail-page.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/note-detail-page.js)
- [assets/js/sidebar-categories.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar-categories.js)
- [assets/js/topbar-taxonomy.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar-taxonomy.js)
- [scripts/generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- [scripts/generate-sitemap.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-sitemap.mjs)
- [assets/generated/archives-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-index.json)
- [assets/generated/archives-search-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-search-index.json)
- [sitemap.xml](/Users/jungsoo/Projects/chochita0311.github.io/sitemap.xml)
- [README.md](/Users/jungsoo/Projects/chochita0311.github.io/README.md)
- [docs/policies/project/architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
- [docs/policies/project/developer-guide.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/developer-guide.md)
- [docs/policies/content/note/note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)

## Pass Or Fail Checks

- The durable content root exists as `NOTES/`.
- Active runtime fetches resolve note content from `NOTES/`.
- No active generator script still treats `CATEGORIES/` as the live source root.
- Generated archive artifacts and sitemap entries resolve against `NOTES/`-based note paths.
- Touched docs describe `NOTES/` as the active archive root.
- Product-visible `Categories` labels on touched archive surfaces are replaced with `Notes`.
- The topbar visible labels render as `Notes`, `Projects`, `Design`, `Game`, and `About`.
- Clicking active notes-navigation surfaces still leads to the existing notes archive behavior.

## Regression Surfaces

- Archive boot and note loading
- Sidebar taxonomy building
- Topbar taxonomy building
- Search index generation
- Sitemap generation
- Existing note-detail URLs
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0004
