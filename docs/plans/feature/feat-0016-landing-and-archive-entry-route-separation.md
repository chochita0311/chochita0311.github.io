# FEAT-0016: Landing And Archive Entry Route Separation

## Metadata

- ID: `feat-0016`
- Status: `completed`
- Type: `foundation`
- Parent PRD: [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Goal

- Foundation feature:
  - separate landing root ownership from archive entry ownership so `/` no longer has to infer archive intent from query exclusions or shell bypass flags

## Acceptance Contract

- `/` remains the only landing-first entry.
- `/archive/` becomes the archive family entry path and resolves to the note list by default.
- `/archive/note/` becomes the explicit note archive shell entry.
- Primary archive navigation no longer depends on former `entry=archive` or equivalent landing-bypass query flags.
- Sidebar, topbar, brand, and landing-search emitters can target archive entry routes without guessing whether landing is still active.
- Route ownership at the entry level is clear enough that downstream browse-path and note-detail migration work does not need to guess between root-shell mode switching and explicit archive entry paths.

## Scope Boundary

- In:
  - landing root and archive entry ownership separation
  - `/archive/` and `/archive/note/` entry definitions
  - first-step route emitter cleanup for sidebar, topbar, brand, and landing search
  - entry-level history and direct-entry behavior needed to preserve static-host compatibility
  - documentation updates required to make archive entry ownership executable
- Out:
  - category and collection path routing under `/archive/note/...`
  - canonical note-detail route migration
  - legacy query-route code removal beyond what is needed to stop entry ownership ambiguity
  - `404.html` recovery planning
  - landing visual redesign or archive list redesign

## Entry And Exit

- Entry point:
  - approved `prd-0006` requires the first executable step to stop treating landing and archive list as two modes inside the same root-shell route
- Exit or transition behavior:
  - downstream route work can build on explicit `/archive/` and `/archive/note/` entry ownership instead of continuing query-first entry branching

## State Expectations

- Default:
  - `/` remains landing-first on eligible desktop widths
  - `/archive/` resolves to the note list by default
  - `/archive/note/` resolves directly to the current note archive shell
- Loading:
  - entry ownership should resolve without showing landing over archive routes or archive over landing routes
- Empty:
  - if archive content has no items, the empty state still belongs to the resolved archive entry rather than to landing fallback
- Error:
  - broken entry ownership that still requires former `entry=archive` handling or scattered root-route checks fails this feature
- Success:
  - landing and archive entry responsibilities are explicit enough that later path-routing work no longer needs to solve entry ambiguity first

## Dependencies

- Parent PRD [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Active refactor track [archive-route-path-migration-plan.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/refactoring/archive-route-path-migration-plan.md)
- Current entry ownership in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html), [main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js), and [content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/js/main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js)
- [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [assets/js/archive/search.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/search.js)
- [assets/js/sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- [assets/js/topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
- `archive/`

## Pass Or Fail Checks

- Direct entry to `/` still shows landing-first behavior on eligible desktop widths.
- Direct entry to `/archive/` opens archive state and resolves to the note list by default.
- Direct entry to `/archive/note/` opens the current note archive shell without needing landing-bypass query flags.
- Sidebar and topbar archive navigation no longer emit former `entry=archive` landing-bypass flags as primary ownership.
- Brand and landing-search archive handoff no longer depend on root-shell mode switching to express archive entry.
- Entry ownership is documented clearly enough that downstream browse and detail features can proceed without guessing.

## Regression Surfaces

- Existing landing visibility rules on root
- Existing archive list rendering
- Existing topbar and sidebar navigation
- Existing history and refresh behavior
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-19`: initial draft created from approved `prd-0006` Step 1 ownership split between landing root and archive entry
- `2026-04-19`: completed after landing was restricted to `/`, archive ownership moved to `/archive/` and `/archive/note/`, and shell navigation stopped relying on former landing-bypass flags
