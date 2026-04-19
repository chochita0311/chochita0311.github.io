# PRD-0007: Initial Route Render Flash Elimination

## Metadata

- ID: `prd-0007`
- Status: `draft`
- Owner role: `human`
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Request Summary

- Remove first-load and refresh flashes so canonical archive screens do not briefly show incorrect placeholder, empty, or default shell states before the actual state is ready.

## Source Set

- Human request:
  - "http://127.0.0.1:3000/index.html?entry=archive ... 새로고침을 반복해서 클릭하면 랜딩 페이지가 순간순간 번쩍 거리는데 이것도 버그야?"
  - "http://127.0.0.1:3000/index.html?entry=archive 현재 상태에서 새로고침을 해보면, 노트가 하나도 없을 때 상태가 잠깐 나왔다가 목록이 나오는 거 같은데 맞아?"
  - "http://127.0.0.1:3000/index.html?entry=archive&category=Technology&collection=JAVA 처음 상태 뿐만 아니라 쿼리가 들어간 상태마다 새로고침을 하면 번쩍번쩍 거리는데 이런 부분은 보통 다른 사이트에서 어떻게 처리해?"
  - "우선 그거는 다음 prd를 작성해서 draft사항으로 넣어둬"
- Golden sources:
  - none yet
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
  - [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
  - [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)

## Product Intent

- Make canonical landing, archive, and note-detail entries feel deliberate and stable by preventing incorrect intermediate UI from flashing before the client runtime finishes resolving the actual state.

## Confirmed Scope

- Address first-load and refresh flashes after the canonical route model from [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md) is in place or sufficiently fixed for boot work.
- Cover canonical landing, archive, category, collection, and note-detail entries after route ownership is settled.
- Eliminate flashes of incorrect landing visibility, default archive list state, default archive footer state, and other route-sensitive placeholder UI that should not appear before the route is resolved.
- Consider topbar-search debounce feedback as part of the same route-stability track so topbar typing can feel responsive without showing misleading intermediate route states.
- Prefer a shell-level boot strategy so route-sensitive regions remain hidden or neutral until initial route resolution and first render are complete.
- Allow `404.html`-based deep-link recovery planning if explicit static entry files alone are insufficient for GitHub Pages refresh stability on canonical nested paths.
- Keep the final rendered state unchanged once boot completes; this work is about initial stability, not redesigning the archive UI.
- Preserve the current static GitHub Pages runtime and client-rendered archive architecture.
- Keep route-model definition, route-parser cleanup, and legacy query-route removal in [prd-0006-archive-route-path-migration.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0006-archive-route-path-migration.md), with `404.html` fallback retained here only if canonical nested-path recovery still needs it.

## Excluded Scope

- Replacing the client-rendered static architecture with server rendering
- Choosing the canonical route family itself
- Migrating landing, archive, category, collection, or note-detail ownership from query routes to path routes
- Removing legacy query-route ownership as a route-model decision
- Broad route parser or route ownership refactoring beyond what is required for boot gating or `404.html` recovery
- Redesigning the landing experience, archive list layout, or note-detail layout beyond what is required to stop route-entry flashes
- Broad loading-skeleton design work unless a neutral loading treatment is later approved through child design/spec work
- Search relevance changes, sidebar taxonomy changes, or note-content rendering changes unrelated to initial route stability

## Uncertainty

- The repository has not yet chosen whether the preferred solution is:
  - a global app boot gate
  - route-sensitive region gating
  - a neutral skeleton/loading shell
  - or a combination of those approaches
- The preferred topbar debounce-feedback style is not yet chosen. Child design/spec work may use one or a combination of:
  - icon pulse
  - subtle field glow
  - sweep light
  - placeholder state change
  - tiny progress cue
- The repository has not yet defined whether a minimal loading indicator should be visible during boot or whether the experience should remain visually blank in the route-sensitive regions until ready.
- The exact scope boundary between acceptable neutral placeholders and unacceptable misleading placeholders is not yet fully specified.
- The exact performance target for "no visible flash" is not yet defined and should be set in child spec work.
- The exact debounce-feedback timing and motion-reduction behavior are not yet fixed.
- The repository has not yet chosen whether `404.html` deep-link recovery is actually needed once the `prd-0006` explicit entry-file plan is implemented.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Avoid introducing server-side dependencies or heavy framework boot layers.
- Preserve the canonical route behavior defined by `prd-0006` after boot completes.
- Do not reintroduce static dummy content that can appear before real runtime data is ready.
- Keep the fix coherent across canonical landing, archive, and note-detail entries rather than solving only one entry case.
- Keep any topbar debounce feedback subtle enough that the topbar remains calm during normal archive browsing.
- Avoid making the topbar search feel visually tied to the landing search treatment.
- If `404.html` recovery is added in this track, keep it aligned to the canonical route model rather than reintroducing query-first ownership.
- Update related docs if the boot model or route-state ownership changes materially.

## Acceptance Envelope

- Refreshing or directly opening canonical archive entries does not briefly show the wrong landing, empty archive, or other incorrect intermediate archive state.
- Refreshing or directly opening canonical category and collection entries does not briefly show the wrong default archive state before the requested state appears.
- Refreshing or directly opening canonical note-detail entries does not briefly show misleading default list or placeholder detail content before the resolved note state appears.
- Any loading treatment used during initial boot is visually neutral and does not read like real archive content.
- The user experiences a single stable transition from page load into the correct route state rather than multiple flashes between intermediate states.
- While the user types into the topbar search, the debounce interval can provide a restrained “search is preparing” cue without causing route flash, layout shift, or confusion with landing-search behavior.
- If `404.html` recovery is needed, it restores the canonical route state without creating a second conflicting route contract.
- The static app remains lightweight and route behavior remains correct after boot.

## Candidate Features

- `feat-0012-route-boot-visibility-gating`: hide or neutralize route-sensitive regions until the first route render is complete
- `feat-0013-neutral-initial-loading-shell`: define an optional non-misleading loading treatment for archive boot if blank gating alone is not sufficient
- `feat-0014-topbar-search-feedback-during-debounce`: add restrained topbar feedback during debounce as part of the broader route-stability polish track
- `feat-0015-canonical-route-deep-link-recovery`: add `404.html`-based recovery only if canonical nested path refresh cannot be supported cleanly through explicit static entry files

## Continuity Notes

- `2026-04-19`: initial draft created from repeated refresh-flash findings on archive entry, filtered list, and other query-driven routes
- `2026-04-19`: expanded draft scope to also capture a future topbar-search debounce feedback pass so search typing feels responsive without introducing misleading intermediate UI
- `2026-04-19`: renumbered from `prd-0006` to `prd-0007` after route path migration became the earlier prerequisite planning track
- `2026-04-19`: route-model and route-orchestration planning was moved into `prd-0006`; this PRD now retains only boot-stability, flash-elimination, and optional `404.html` recovery concerns
