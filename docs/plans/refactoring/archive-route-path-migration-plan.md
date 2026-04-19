# Archive Route Path Migration Plan

## Purpose

- Replace the former query-driven landing and archive route ownership with clearer archive-entry-oriented structure so landing visibility no longer depends on scattered root-shell query checks.
- Reduce coupling between landing state, archive browse state, and note-detail state while preserving current user-visible behavior during migration.
- Prepare a safer foundation for [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md) by simplifying route intent before deeper boot-gating or render-gating changes.

## Refactor Type

- Primary: `Structural`
- Secondary: `Interface`
- Parity target: behavior-preserving migration in staged steps, with one intentional semantic cleanup:
  - landing ownership should apply only to the root landing entry
  - shell archive navigation should no longer be modeled as landing bypass inside the same route namespace

## Scope

- URL shape and route ownership for:
  - landing root entry
  - archive family entry
  - note archive list entry
  - category and collection note archive entry
  - note detail entry
- Route parsing and history handling across:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [assets/js/main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js)
  - [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - [assets/js/archive/search.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/search.js)
  - [assets/js/sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
  - [assets/js/topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
- Static-hosting compatibility work required by GitHub Pages path handling.
- Related architecture and planning docs when the route model changes materially.
- Parent planning track:
  - [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)

## Non-Goals

- Redesigning landing visuals, archive card layout, or note-detail visual composition.
- Replacing the static GitHub Pages runtime with server rendering or a framework router.
- Changing archive search semantics beyond what is required to preserve route meaning.
- Reorganizing note content storage under `NOTES/`.
- Bundling unrelated archive runtime cleanup into the same migration unless needed for route safety.

## Invariants

- `/` remains the only landing-first entry.
- `/archive/` is the archive family entry and `/archive/note/` is the current note archive shell entry.
- Archive-kind shells should be implemented from root-level `archive/<kind>/` entry files.
- `/archive/` should currently resolve by default to the note list rather than requiring a separate hub screen.
- Non-root archive navigation must never require former landing-bypass flags such as `entry=archive` to suppress landing.
- Sidebar and topbar archive navigation must open archive state directly and must not leave landing visually active.
- Canonical note browse routes live under `/archive/note` with `category` and `collection` query parameters.
- Canonical note detail lives under `/archive/note?id=<note-id>`.
- Existing archive list, category, collection, search, and detail behavior must remain functionally equivalent during each migration step unless a delta is explicitly approved.
- GitHub Pages hosting must continue to serve all supported entry URLs without introducing broken refresh or deep-link behavior.
- History navigation, direct entry, refresh, and copy-pasted URLs must resolve to the same archive state after boot.

## Planned Work

### Step 1. Separate landing and archive entry ownership

- Goal
  - Stop modeling landing and note archive list as two modes of the same root query state.
- Why this grouping
  - This is the smallest high-value boundary change and directly addresses the current ownership confusion without forcing full path migration immediately.
- Guardrails
  - Keep current archive list rendering behavior unchanged.
  - Do not redesign landing behavior beyond URL ownership cleanup.
  - Preserve root landing entry on desktop and existing narrow-width suppression.
  - Introduce `/archive/` and `/archive/note/` ownership before deeper browse-path work.
  - Keep `/archive/` as the archive family entry path, but default its resolved experience to the note list until future kinds such as `design` and `project` need their own first-class surfaces.
- Targets
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [assets/js/main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js)
  - [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - new static archive entry files under `archive/`
  - route links in sidebar, topbar, and brand reset flows
- Validation
  - `/` still opens landing on eligible desktop widths.
  - `/archive/` opens archive family entry directly and resolves to the note list by default.
  - `/archive/note/` opens the current note archive shell directly without landing flash or bypass flags.
  - sidebar and topbar archive navigation no longer depend on former `entry=archive` landing-bypass flags.
  - refresh on landing, `/archive/`, and `/archive/note/` all resolve correctly.
- Exit gate
  - Landing visibility no longer depends on former `entry=archive` query checks, `/archive/` exists as archive family entry with note list as its default resolved state, and `/archive/note/` owns the current note archive shell.

### Step 2. Introduce path-based archive browse routing

- Goal
  - Move note category and collection browse intent off the root shell and onto canonical `/archive/note` query routing.
- Why this grouping
  - Once archive entry is separated from landing, browse states can migrate without reopening the landing contract.
- Guardrails
  - Keep one canonical route parser rather than splitting path logic across sidebar, topbar, and archive runtime helpers.
  - Preserve shareable direct links for category and collection states throughout migration.
  - Treat the `/archive/note` route family as canonical and keep only former root-shell query support transitional.
  - Remove former root-shell query ownership after the migration completes instead of keeping a parallel long-term route system.
- Targets
  - archive route parsing inside [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - navigation emitters in [assets/js/sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js) and [assets/js/topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
  - sitemap and route-generation scripts if browse URLs become published paths
  - archive note entry files under `archive/note/`
- Validation
  - `/archive/note?category=<category>` resolves to the same notes as the current category selection.
  - `/archive/note?category=<category>&collection=<collection>` resolves to the same notes as the current collection selection.
  - popstate and direct refresh keep the requested browse scope.
  - transitional root-shell query entry either upgrades cleanly to the canonical archive route or is explicitly removed at the chosen cutover point.
- Exit gate
  - Note browse scope is owned by `/archive/note` route ownership rather than by root-shell query checks inside landing logic.

### Step 3. Normalize note-detail route ownership

- Goal
  - Align note-detail entry with canonical `/archive/note?id=<note-id>` ownership so detail state is no longer a special query exception inside the archive shell.
- Why this grouping
  - Detail routing has the widest blast radius and should come after landing and browse ownership are stable.
- Guardrails
  - Preserve current note-detail rendering, breadcrumb meaning, and previous/next navigation behavior.
  - Use note primary keys for canonical detail identifiers; do not introduce slug-based canonical detail routing in this step.
  - Remove `pages/note/` runtime ownership during this step rather than preserving it as a second permanent route surface.
  - Do not change note identity or note file structure as part of this step.
- Targets
  - [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - [assets/js/index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
  - sitemap generation and canonical URL handling
- Validation
  - direct `/archive/note?id=<note-id>` entry resolves without showing wrong intermediate list or landing state
  - previous/next note navigation preserves correct route updates
  - no former `pages/note/` runtime surface remains after canonical `/archive/note?id=<note-id>` ownership is proven
- Exit gate
  - Note-detail ownership is compatible with the path-based archive model, no longer depends on `note` query special-casing inside landing visibility decisions, and no separate `pages/note/` route surface remains.

### Step 4. Remove legacy query-route compatibility debt

- Goal
  - Retire former root-shell query-based route ownership once the canonical archive-route model is proven stable.
- Why this grouping
  - Compatibility shims should be removed only after the new route model has runtime evidence and published-link handling in place.
- Guardrails
  - Remove only compatibility code whose replacement has already passed refresh, direct-entry, and history validation.
  - Delete legacy route code only after the full refactoring is complete and there is no active runtime surface still using it.
  - Do not preserve a second long-term canonical route system in parallel with the path model.
- Keep [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md) behavior-preserving relative to the new final route model.
- Targets
  - residual query checks in landing and archive route parsing
  - documentation that still treats query state as the canonical route contract
  - sitemap or internal link sources still emitting legacy query URLs
- Validation
  - no active runtime path still requires former root-shell `entry=archive`, `category`, `collection`, `note`, or `view` query branching for primary ownership
  - direct archive-route entry, refresh, and popstate remain stable after compatibility cleanup
- Exit gate
  - Archive-route ownership is canonical, former root-shell query ownership is removed from primary runtime decisions, and landing logic no longer inspects archive-route intent through scattered root-shell query conditions.

## Validation Gates

- Baseline compare target:
  - current `query-driven root shell` behavior on `master` before route migration begins
- Required evidence for each completed step:
  - direct-entry browser smoke for landing, archive list, category, collection, and note detail cases relevant to that step
  - refresh behavior checks for migrated entry URLs
  - popstate/history traversal checks for migrated entry URLs
  - link-source audit for sidebar, topbar, brand, landing search, and note navigation emitters
  - static-hosting compatibility check for explicit entry-file strategy first; defer `404.html` fallback strategy to [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md)
- Full-track checkpoint:
  - rerun [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md) flash-focused evaluation scenarios against the new route model before declaring the migration safe to continue or safe to merge

## Intentional Deltas

- Landing ownership becomes root-only by route design rather than by query exclusions layered onto the root archive shell.
- Archive navigation semantics become more explicit and path-driven under `/archive/` and `/archive/note/`.
- Internal URL generation shifts from query-first to path-first over multiple phases.

## Execution Notes

- Update sitemap entries and canonical link markup as the corresponding path-based archive and note-detail entries become live rather than treating those updates as a separate planning gate.
- Normalize or retire legacy query URLs only at the final removal step, after path-based direct entry and refresh behavior have already been proven stable.

## Exit Goal

- The site uses a canonical archive-route model where landing, archive browse, and note-detail ownership are explicit enough that landing visibility no longer depends on scattered root-shell query exclusions, and subsequent route-stability work can focus on boot correctness rather than on untangling route intent.

## Completion Notes

- `2026-04-19`: completed with `/`, `/archive/`, `/archive/note/`, `/archive/note?category=...&collection=...`, and `/archive/note?id=...` live as the canonical runtime contract.
- `2026-04-19`: former root-shell route ownership and former `entry=archive` landing-bypass handling were removed from primary runtime decisions.
- `2026-04-19`: former `pages/note/` runtime ownership was retired and the runtime structure was consolidated under root-level `archive/` entry files plus `assets/js/archive/` modules.

## Handoff to Next Track

- If GitHub Pages deep-link constraints prove too limiting for full path migration, record the highest-cleanliness static compromise explicitly rather than drifting back into mixed ownership implicitly.
