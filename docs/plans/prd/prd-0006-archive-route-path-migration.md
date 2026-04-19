# PRD-0006: Archive Route Path Migration

## Metadata

- ID: `prd-0006`
- Status: `completed`
- Owner role: `human`
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Request Summary

- Move landing, archive browse, and note-detail route ownership toward a cleaner archive-entry-oriented structure so landing no longer depends on query-string exclusions layered onto the root shell.

## Source Set

- Human request:
  - "더 깔끔한 방향은 말씀하신 대로 상태를 query가 아니라 path로 나누는 겁니다."
  - "그건 대공사인가?"
  - "use $refactor-plan plan"
- Golden sources:
  - none yet
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [archive-route-path-migration-plan.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/refactoring/archive-route-path-migration-plan.md)
  - [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [assets/js/main-landing.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/main-landing.js)
  - [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - [assets/js/archive/search.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/search.js)
  - [assets/js/sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
  - [assets/js/topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)

## Product Intent

- Make route ownership explicit enough that `/` means landing, archive navigation means archive, and detail entry means detail, without forcing landing visibility to infer archive intent from scattered query checks.

## Confirmed Scope

- Define a path-oriented route model for:
  - landing root entry
  - archive family entry
  - note archive list entry
  - note category entry
  - note collection entry
  - note-detail entry
- Use a static-host-compatible route shape on GitHub Pages with explicit archive entry files.
- Adopt this canonical route family:
  - `/` for landing
  - `/archive/` for archive family entry, with the default landing target inside archive resolving to the note list
  - `/archive/note/` for the current note archive shell
  - `/archive/note?category=<category>` for note category browse
  - `/archive/note?category=<category>&collection=<collection>` for note collection browse
  - `/archive/note?id=<note-id>` for canonical note detail
- Keep the route hierarchy singular under archive kinds such as `note`, `design`, and `project`.
- Use root-level `archive/<kind>/` entry files as the runtime home for archive-kind shells such as `archive/note/` and future `archive/design/`.
- Treat route ownership cleanup as a prerequisite track that can simplify later route-stability and boot-stability work.
- Absorb route-model and route-orchestration cleanup that was previously mixed into initial route-flash discussion, except for `404.html` deep-link fallback recovery.
- Preserve current user-facing archive behavior during staged migration unless an intentional delta is explicitly approved.
- Keep the migration compatible with the current static runtime and generated-note-index model.
- Own route-shape decisions that were previously mixed into route-flash planning, including:
  - canonical entry URLs
  - note-detail canonical ownership
  - legacy query removal
  - route/parser boundary cleanup when needed to support the new path model

## Excluded Scope

- Landing visual redesign
- Archive list redesign
- Note-detail reading redesign
- Server-side rendering or framework-router adoption
- Note-storage reorganization under `NOTES/`
- Search relevance redesign unrelated to route ownership

## Constraints

- Keep GitHub Pages compatibility.
- Keep refresh, direct-entry, and popstate behavior stable throughout migration.
- Preserve root landing on `/`.
- Preserve archive shell behavior after landing handoff, with the current note archive shell moving under `/archive/note/`.
- Treat `/archive/` as the archive family entry path, but default its first resolved content to the note list until additional archive kinds have their own user-facing surfaces.
- Avoid mixing route migration with unrelated visual cleanup.
- Update route-related docs and generated URL sources when canonical route shape changes.
- Remove legacy query-route ownership once the path model is live rather than keeping two long-term canonical route systems in parallel.
- Use note primary keys as canonical detail identifiers under `/archive/note?id=<note-id>`; do not introduce slug-based canonical ownership in this track.
- Do not preserve `pages/note/` as a runtime route surface after canonical note-detail ownership moves under `/archive/note?id=<note-id>`.
- Defer `404.html`-based deep-link recovery strategy to [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md); this track should prefer explicit static entry files first.
- If route/runtime boundaries such as `archive-router` or `archive-render` need to change to support the canonical path model, treat that structure change as part of this PRD rather than as part of `prd-0008`.

## Acceptance Envelope

- Landing ownership is root-only by route design rather than by query-string exclusion logic.
- Archive navigation no longer depends on former `entry=archive` or equivalent landing-bypass query checks to express primary route intent.
- Note archive navigation is owned by `/archive/note` and its query-driven descendants rather than by root-shell query state.
- `/archive/` remains the archive family entry path and currently resolves by default to the note list, while still leaving room for multiple archive kinds such as `note`, `design`, and `project`.
- Category and collection states have one explicit route model under `/archive/note?category=...` and `/archive/note?category=...&collection=...`.
- Canonical note detail is owned by `/archive/note?id=<note-id>`.
- The chosen route shape remains statically hostable on GitHub Pages and supports refresh and direct entry.
- Legacy query routes no longer remain as an equal canonical route system after the migration is complete.
- Route parsing and runtime ownership are clean enough that follow-up flash work does not need to keep solving around the old query-driven route contract.
- The resulting route model makes follow-up work such as [prd-0008-initial-route-render-flash-elimination.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0008-initial-route-render-flash-elimination.md) easier to reason about.

## Candidate Features

- `feat-0016-landing-and-archive-entry-route-separation`: separate landing root entry from archive family and note archive entry ownership
- `feat-0017-note-archive-path-routing`: migrate note category and collection browse state toward canonical `/archive/note/...` routing
- `feat-0018-note-detail-route-normalization`: align note detail ownership to canonical `/archive/note?id=<note-id>`
- `feat-0019-legacy-query-route-removal`: remove legacy query-route ownership only after the full path migration is complete and no active runtime surface still depends on it

## Continuity Notes

- `2026-04-19`: initial draft created from route-ownership cleanup discussion and linked to the active refactor plan for staged migration work
- `2026-04-19`: positioned ahead of `prd-0008` because route ownership cleanup may be the cleaner prerequisite for later route-flash elimination work
- `2026-04-19`: route family decisions were narrowed so archive kinds live under `/archive/<kind>/`, the current note archive shell moves to `/archive/note/`, note browse filters live under `/archive/note` query parameters, and canonical note detail moves to `/archive/note?id=<note-id>`
- `2026-04-19`: archive implementation direction was narrowed further so archive-kind shells are expected under root-level `archive/<kind>/`, `/archive/` remains the archive family entry but currently defaults to the note list, legacy query ownership should be removed after migration completion, and `404` fallback strategy is deferred to `prd-0008`
- `2026-04-19`: route-related planning that had been mixed into `prd-0008` was consolidated here so `prd-0008` can stay focused on boot gating, flash elimination, and optional `404.html` recovery only
- `2026-04-19`: note-detail canonical identity was fixed to note primary keys rather than slugs, `pages/note/` was retired from runtime ownership, and legacy route code removal was constrained to the end of the full refactoring after unused-path verification
- `2026-04-19`: approval granted after route family, note-detail identity, `/archive/` default behavior, and legacy removal policy were all fixed tightly enough for execution
- `2026-04-19`: implementation completed with canonical `/`, `/archive/`, `/archive/note/`, `/archive/note?category=...&collection=...`, and `/archive/note?id=...` ownership live, former `entry=archive` landing-bypass behavior retired, and former `pages/note/` runtime ownership removed
