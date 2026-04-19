# FEAT-0019: Legacy Query Route Removal

## Metadata

- ID: `feat-0019`
- Status: `completed`
- Type: `foundation`
- Parent PRD: [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Goal

- Foundation feature:
  - remove obsolete root-shell query-route ownership only after the full archive route migration is complete and proven so the runtime no longer carries two competing ownership models

## Acceptance Contract

- Legacy root-shell query-route ownership is deleted only after canonical `/archive/` and `/archive/note` route ownership is fully live.
- No active runtime surface still depends on former root-shell `entry=archive` or root-shell `category`, `collection`, `note`, or `view` query branching for primary route ownership when this feature is complete.
- Sitemap and canonical-link generation emit the canonical archive-route family rather than former root-shell query URLs.
- Any remaining transitional normalization of old root-shell query URLs is explicit and temporary rather than a hidden second canonical route system.
- Downstream route-stability work can assume one canonical archive-route contract without carrying legacy ownership rules.

## Scope Boundary

- In:
  - final removal of former root-shell query-route ownership logic
  - cleanup of obsolete landing and archive query checks on `/`
  - cleanup of legacy emitters and published-link sources that still target the old root-shell route model
  - documentation updates needed to retire former root-shell query-route ownership
- Out:
  - initial landing and archive entry separation
  - category and collection path routing
  - note-detail normalization
  - `404.html` fallback planning
  - unrelated UI cleanup

## Entry And Exit

- Entry point:
  - archive entry, note browse, and note-detail routing under `/archive/` and `/archive/note` are already proven stable
- Exit or transition behavior:
  - route ownership is archive-route-first end to end, and later flash or boot work no longer needs to account for former root-shell query ownership

## State Expectations

- Default:
  - canonical archive routes own landing, archive, browse, and detail behavior without parallel root-shell query ownership
- Loading:
  - removal should not create regressions in refresh or direct-entry behavior on canonical archive routes
- Empty:
  - not applicable beyond ensuring removed query branches do not resurrect fallback root-shell behavior
- Error:
  - deleting query ownership while an active runtime surface still depends on it fails this feature
- Success:
  - the codebase no longer has unresolved ownership ambiguity between the former root-shell query model and the canonical archive-route model

## Dependencies

- Parent PRD [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Entry ownership feature [feat-0016-landing-and-archive-entry-route-separation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0016-landing-and-archive-entry-route-separation.md)
- Browse-path feature [feat-0017-note-archive-path-routing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0017-note-archive-path-routing.md)
- Note-detail feature [feat-0018-note-detail-route-normalization.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0018-note-detail-route-normalization.md)

## Likely Affected Surfaces

- [assets/js/main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js)
- [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [assets/js/archive/search.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/search.js)
- [assets/js/sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- [assets/js/topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
- sitemap and canonical link sources
- route-related planning docs

## Pass Or Fail Checks

- No primary route owner still depends on former root-shell `entry=archive`, `category`, `collection`, `note`, or `view` query checks.
- Canonical archive routes remain stable under direct entry, refresh, and history traversal after legacy cleanup.
- Sitemap and canonical-link output no longer publish former root-shell query URLs as canonical routes.
- Documentation no longer describes query routes as equal canonical ownership.
- Downstream route work can reference one canonical archive-route contract without guessing.

## Regression Surfaces

- Canonical landing visibility on `/`
- Canonical archive entry and note browse behavior
- Canonical note-detail entry behavior
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-19`: initial draft created from approved `prd-0006` final cleanup step for retiring legacy query-route ownership
- `2026-04-19`: completed after former root-shell route ownership and former landing-bypass behavior were retired, while `/archive/note` query parameters remained as the canonical browse and detail contract
