# FEAT-0018: Note Detail Route Normalization

## Metadata

- ID: `feat-0018`
- Status: `completed`
- Type: `product`
- Parent PRD: [prd-0006-archive-route-path-migration.md](docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Goal

- Product feature:
  - normalize note-detail ownership onto canonical `/archive/note?id=<note-id>` routing so detail entry no longer depends on special query handling on the root shell or any separate legacy route surface

## Acceptance Contract

- `/archive/note?id=<note-id>` is the canonical note-detail route.
- Note-detail identity uses note primary keys as the canonical query identifier; slug-based canonical detail routing is not introduced.
- Direct entry, refresh, and popstate on canonical note-detail routes resolve to the correct note without showing misleading list or landing states first.
- no `pages/note/` runtime surface remains after canonical ownership is proven.
- Previous and next note navigation update canonical note-detail routes correctly.
- Detail rendering, breadcrumb meaning, and reading behavior remain functionally equivalent after route normalization.

## Scope Boundary

- In:
  - canonical note-detail route ownership under `/archive/note?id=<note-id>`
  - note-detail parser and route restoration behavior
  - explicit retirement of the former `pages/note/` route surface
  - canonical-link updates for note detail when the new route is live
  - documentation required to fix detail ownership
- Out:
  - category and collection browse-path migration
  - final legacy query-route removal
  - note file-structure changes
  - note-detail visual redesign
  - `404.html` recovery planning

## User-Visible Outcome

- Users can open and refresh note details through one stable canonical route, and note reading no longer depends on special-case root-shell query routes or a separate long-term detail entry surface.

## Entry And Exit

- Entry point:
  - canonical note browse paths under `/archive/note/...` are already established
- Exit or transition behavior:
  - note detail becomes canonically owned by the `/archive/note` route family and the remaining migration work is limited to removing obsolete legacy compatibility

## State Expectations

- Default:
  - `/archive/note?id=<note-id>` resolves directly to the requested note detail
- Loading:
  - initial detail entry does not briefly show landing or the wrong archive list state before the note resolves
- Empty:
  - unknown note IDs fail gracefully without implying that a different note or list state was resolved
- Error:
  - broken handoff between canonical detail routing and removal of former legacy detail ownership fails this feature
- Success:
  - note detail has one canonical path contract and behaves consistently across direct entry, refresh, and history traversal

## Dependencies

- Parent PRD [prd-0006-archive-route-path-migration.md](docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Browse-path feature [feat-0017-note-archive-path-routing.md](docs/plans/feature/feat-0017-note-archive-path-routing.md)
- Route execution plan [archive-route-path-migration-plan.md](docs/plans/refactoring/archive-route-path-migration-plan.md)

## Likely Affected Surfaces

- [assets/js/archive/content.js](assets/js/archive/content.js)
- [assets/js/index-note-detail.js](assets/js/index-note-detail.js)
- `archive/note/`
- sitemap and canonical link sources

## Pass Or Fail Checks

- Direct entry to `/archive/note?id=<note-id>` resolves to the correct note.
- Refresh on `/archive/note?id=<note-id>` does not show misleading landing or archive-list states before detail appears.
- Browser back/forward traversal preserves note-detail route ownership.
- Previous and next note navigation update canonical detail paths correctly.
- No slug-based canonical note-detail route is introduced.
- no separate legacy note-detail route surface remains after migration proof is complete.

## Regression Surfaces

- Existing note-detail rendering
- Existing breadcrumb and previous/next behavior
- Existing note lookup by primary key
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-19`: initial draft created from approved `prd-0006` Step 3 note-detail normalization scope
- `2026-04-19`: completed after canonical note detail was normalized to `/archive/note?id=<note-id>`, previous/next navigation was aligned to note IDs, and former `pages/note/` runtime ownership was removed
