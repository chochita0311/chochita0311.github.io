# FEAT-0017: Note Archive Path Routing

## Metadata

- ID: `feat-0017`
- Status: `completed`
- Type: `product`
- Parent PRD: [prd-0006-archive-route-path-migration.md](docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Goal

- Product feature:
  - move note archive category and collection browsing onto canonical `/archive/note` query routes so filtered archive states can be refreshed, shared, and revisited without root-shell routing

## Acceptance Contract

- `/archive/note?category=<category>` is the canonical route for note category browsing.
- `/archive/note?category=<category>&collection=<collection>` is the canonical route for note collection browsing.
- Direct entry, refresh, and popstate on canonical note browse paths resolve to the correct filtered note set.
- Sidebar and topbar note-browse navigation emit canonical `/archive/note` routes instead of root-shell archive state.
- The visible archive list, filter meaning, and search interactions remain behaviorally equivalent after path migration.
- Transitional query-route support, if temporarily present during execution, is not treated as a second long-term canonical browse system.

## Scope Boundary

- In:
  - canonical category and collection query routing under `/archive/note`
  - note-browse route parsing and state restoration
  - sidebar and topbar emitters for note category and collection navigation
  - documentation required to lock canonical browse ownership
- Out:
  - note-detail canonical route ownership
  - final legacy query-route deletion
  - `404.html` fallback
  - archive list visual redesign
  - search relevance redesign

## User-Visible Outcome

- Users can open, refresh, and share note category and collection archive states through canonical `/archive/note` query routes without falling back through the landing route or root-shell behavior.

## Entry And Exit

- Entry point:
  - `feat-0016` has separated landing root from archive entry ownership
- Exit or transition behavior:
  - canonical note browse states are owned by `/archive/note` and ready for note-detail normalization and final legacy cleanup

## State Expectations

- Default:
  - `/archive/note/` shows the default note archive list
  - `/archive/note?category=<category>` shows the requested category
  - `/archive/note?category=<category>&collection=<collection>` shows the requested collection
- Loading:
  - refresh and direct entry do not briefly show a different default browse scope before the requested one resolves
- Empty:
  - empty results remain scoped to the resolved category or collection route rather than collapsing to root or landing
- Error:
  - malformed or unsupported browse paths fail gracefully without showing misleading unrelated archive states
- Success:
  - note browse routes are canonical, shareable, and stable under refresh and history traversal

## Dependencies

- Parent PRD [prd-0006-archive-route-path-migration.md](docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Entry ownership feature [feat-0016-landing-and-archive-entry-route-separation.md](docs/plans/feature/feat-0016-landing-and-archive-entry-route-separation.md)
- Route execution plan [archive-route-path-migration-plan.md](docs/plans/refactoring/archive-route-path-migration-plan.md)

## Likely Affected Surfaces

- [assets/js/archive/content.js](assets/js/archive/content.js)
- [assets/js/sidebar.js](assets/js/sidebar.js)
- [assets/js/topbar.js](assets/js/topbar.js)
- [assets/js/archive/search.js](assets/js/archive/search.js)
- `archive/note/`
- sitemap and canonical link sources

## Pass Or Fail Checks

- Direct entry to `/archive/note?category=<category>` resolves to the expected category notes.
- Direct entry to `/archive/note?category=<category>&collection=<collection>` resolves to the expected collection notes.
- Refresh on canonical note browse paths does not show the wrong default archive scope before the requested scope appears.
- Browser back/forward traversal preserves canonical note browse state.
- Sidebar and topbar interactions emit canonical `/archive/note` routes for note browsing.
- Root-shell browse ownership does not remain the primary canonical contract after this feature is complete.

## Regression Surfaces

- Existing note archive list filtering
- Existing sidebar and topbar category behavior
- Existing search result scoping
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-19`: initial draft created from approved `prd-0006` Step 2 browse-path migration scope
- `2026-04-19`: completed after category and collection browse state moved onto canonical `/archive/note?category=...` and `/archive/note?category=...&collection=...` routes
