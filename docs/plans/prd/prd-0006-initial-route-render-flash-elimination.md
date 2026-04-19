# PRD-0006: Initial Route Render Flash Elimination

## Metadata

- ID: `prd-0006`
- Status: `draft`
- Owner role: `human`
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Request Summary

- Remove route-entry flashes during refresh and first load so archive screens do not briefly show incorrect placeholder, empty, or default shell states before the actual route state is ready.

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
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
  - [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
  - [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)

## Product Intent

- Make every archive entry route feel deliberate and stable by preventing incorrect intermediate UI from flashing before the client runtime finishes resolving the actual route state.

## Confirmed Scope

- Address first-load and refresh flashes for archive routes that depend on client-side route parsing and data hydration.
- Cover root archive bypass entry such as `?entry=archive`.
- Cover query-driven archive list states such as category- and collection-filtered URLs.
- Cover note-detail entry states when the runtime resolves a note route on first load.
- Eliminate flashes of incorrect landing visibility, default archive list state, default archive footer state, and other route-sensitive placeholder UI that should not appear before the route is resolved.
- Consider topbar-search debounce feedback as part of the same route-stability track so topbar typing can feel responsive without showing misleading intermediate route states.
- Consider archive runtime structure cleanup that separates route orchestration from render orchestration when that separation is needed to make initial route handling more stable and easier to reason about.
- Prefer a shell-level boot strategy so route-sensitive regions remain hidden or neutral until initial route resolution and first render are complete.
- Keep the final rendered state unchanged once boot completes; this work is about initial stability, not redesigning the archive UI.
- Preserve the current static GitHub Pages runtime and client-rendered archive architecture.

## Excluded Scope

- Replacing the client-rendered static architecture with server rendering
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
- The repository has not yet chosen whether route-stability work should remain in the current orchestration file or whether it should formalize clearer runtime boundaries such as:
  - `archive-router` for URL and route-state handling
  - `archive-render` for list/detail and empty-state rendering
  - or a later dedicated `archive-state` owner if state ownership becomes too diffuse
- The repository has not yet defined whether a minimal loading indicator should be visible during boot or whether the experience should remain visually blank in the route-sensitive regions until ready.
- The exact scope boundary between acceptable neutral placeholders and unacceptable misleading placeholders is not yet fully specified.
- The exact performance target for "no visible flash" is not yet defined and should be set in child spec work.
- The exact debounce-feedback timing and motion-reduction behavior are not yet fixed.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Avoid introducing server-side dependencies or heavy framework boot layers.
- Preserve current route behavior for landing, archive list, archive filters, and note detail after boot completes.
- Do not reintroduce static dummy content that can appear before real runtime data is ready.
- Keep the fix coherent across root, query-driven list, and detail routes rather than solving only one entry case.
- Keep any topbar debounce feedback subtle enough that the topbar remains calm during normal archive browsing.
- Avoid making the topbar search feel visually tied to the landing search treatment.
- If runtime structure is split as part of this track, keep the split behavior-preserving and use it to clarify route handling rather than to redesign archive flows.
- Update related docs if the boot model or route-state ownership changes materially.

## Acceptance Envelope

- Refreshing or directly opening `index.html?entry=archive` does not briefly show the wrong landing, empty archive, or other incorrect intermediate archive state.
- Refreshing or directly opening filtered archive routes such as `?entry=archive&category=...&collection=...` does not briefly show the wrong default archive state before the filtered state appears.
- Refreshing or directly opening note-detail routes does not briefly show misleading default list or placeholder detail content before the resolved note state appears.
- Any loading treatment used during initial boot is visually neutral and does not read like real archive content.
- The user experiences a single stable transition from page load into the correct route state rather than multiple flashes between intermediate states.
- While the user types into the topbar search, the debounce interval can provide a restrained “search is preparing” cue without causing route flash, layout shift, or confusion with landing-search behavior.
- If route/render runtime responsibilities are split during this track, the resulting structure makes initial route handling easier to reason about without changing the final user-facing route outcomes.
- The static app remains lightweight and route behavior remains correct after boot.

## Candidate Features

- `feat-0012-route-boot-visibility-gating`: hide or neutralize route-sensitive regions until the first route render is complete
- `feat-0013-neutral-initial-loading-shell`: define an optional non-misleading loading treatment for archive boot if blank gating alone is not sufficient
- `feat-0014-topbar-search-feedback-during-debounce`: add restrained topbar feedback during debounce as part of the broader route-stability polish track
- `feat-0015-route-and-render-runtime-separation`: separate route-state handling from DOM rendering if that makes route-entry stabilization safer and clearer

## Continuity Notes

- `2026-04-19`: initial draft created from repeated refresh-flash findings on archive entry, filtered list, and other query-driven routes
- `2026-04-19`: expanded draft scope to also capture a future topbar-search debounce feedback pass so search typing feels responsive without introducing misleading intermediate UI
- `2026-04-19`: expanded draft scope to also allow a behavior-preserving separation between route orchestration and render orchestration if that improves route-entry stability work
