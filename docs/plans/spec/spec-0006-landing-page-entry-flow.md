# SPEC-0006: Landing Page Entry Flow

## Metadata

- ID: `spec-0006`
- Status: `approved`
- Run ID: `run-20260418-01`
- Attempt: `1`
- Parent Feature: [feat-0010-landing-page-entry-flow.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0010-landing-page-entry-flow.md)
- Parent PRD: [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Source Set

- Human request:
  - root `/` should show a landing-first shell state instead of the archive list
  - the landing hero should reuse only the structural pattern of `tmp/sample.html`'s targeted section
  - the landing hero must sit below the fixed topbar and inside the current shell
  - the landing tone should align with the current archive shell and stay closer to the quieter concept
  - `Video_Generation_With_Specific_Effects.mp4` should drive a slow scroll-based background motion
  - the video should sit behind the landing hero at about `50%` transparency
  - scrolling through the landing should hand off into the current archive list
  - clicking `조치타의 잡동사니` should bypass landing and open the current archive list directly
- Parent feature:
  - [feat-0010-landing-page-entry-flow.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0010-landing-page-entry-flow.md)
- Parent PRD:
  - [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Golden sources:
  - [sample.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/sample.html)
  - [Video_Generation_With_Specific_Effects.mp4](/Users/jungsoo/Projects/chochita0311.github.io/tmp/Video_Generation_With_Specific_Effects.mp4)
- Relevant policies or contracts:
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [design-constitution.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/design/design-constitution.md)

## Implementation Goal

- Add a landing-first root experience inside the existing archive shell that occupies the current content canvas below the fixed topbar, uses a semi-transparent scroll-scrubbed video background, and hands off into the existing archive list while preserving a direct brand-title path to the list view.

## In-Scope Behavior

- Add a new landing section inside the current `archive-main` canvas before the archive list container.
- Structure the landing hero using the same general pattern as `section.relative.min-h-[870px].flex.items-center.px-8.md:px-16.overflow-hidden`, but translate it into the repository's native HTML and CSS instead of copying Tailwind markup.
- Keep the landing section below the fixed topbar and within the content area offset created by the fixed sidebar.
- Keep the topbar and sidebar visible while the landing is shown.
- Use the current shell color palette and typography tone for the landing hero.
- Add a background media layer for the landing hero that uses `Video_Generation_With_Specific_Effects.mp4` or a repository-local derivative of it.
- Start the landing media layer at roughly `50%` opacity so foreground content remains readable.
- Tie landing media progression to scroll position through the landing section so the motion advances with scroll instead of free-running.
- After the landing section is fully traversed, reveal the existing archive list as the natural continuation of the page.
- Only show the landing-first state on the root archive route without a bypass flag.
- Add a deterministic bypass path so clicking the brand title on the root shell goes directly to the current archive list state.
- Preserve current archive reset behavior when bypassing to the list view.
- Fail safely to a readable static landing hero if the video treatment cannot initialize.

## Out-Of-Scope Behavior

- Reworking archive list rendering, grid-card density, or note-detail layout
- Replacing topbar labels or sidebar taxonomy behavior
- Introducing new routes outside the current root archive shell
- Full-page shell redesign or separate marketing homepage
- Wide-screen spacing changes for the list and detail canvas

## Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/js/archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [assets/js/index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [assets/css/app.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/app.css)

## State And Interaction Contract

- Root-entry state:
  - when `pathname` resolves to the root archive shell and no explicit bypass flag is present, the landing section is shown first
  - the archive list remains mounted downstream so a normal page scroll can reach it
- Bypass-entry state:
  - when an explicit archive-entry flag is present in the root archive URL, the page initializes directly into the archive list state and skips the landing hero
  - use a root-only query flag such as `?entry=archive` so bypass behavior is deterministic and compatible with existing query parsing
- Brand-title behavior:
  - clicking `조치타의 잡동사니` on the root archive shell navigates to the root archive shell with the bypass flag and resets archive filters and view state to the current default list behavior
- Landing layout state:
  - the landing section height fills the current visible content canvas below the topbar
  - the landing section must not slide underneath the topbar
- Landing media state:
  - background video or derivative media is positioned behind the hero content
  - media opacity is approximately `0.5`
  - media motion is scrubbed by landing-section scroll progress from start to end
- Scroll handoff state:
  - the landing section ends directly before the current archive list section
  - scrolling beyond the landing section exposes the archive list without requiring a second CTA-only interaction
- Fallback state:
  - if scroll-scrubbed media cannot run, render a static poster-like background layer and keep the same landing copy and archive-list handoff

## Data And Contract Assumptions

- Root archive route already uses query parameters for archive state, so one additional root-only entry flag can be added without changing the broader routing model.
- The landing feature may consume `tmp/` media during local exploration, but production implementation should prefer a repository-local owned asset path if runtime delivery from `tmp/` is unsuitable.
- Archive list and note-detail initialization contracts remain owned by the current archive runtime and must not be redefined by landing code.
- The landing section owns only root-entry presentation and handoff, not note-loading logic.

## Acceptance Mapping

- Root landing:
  - `/` shows landing-first entry
- Shell preservation:
  - topbar and sidebar remain visible and landing sits below the topbar
- Sample reuse boundary:
  - only the targeted hero-section pattern is reused conceptually
- Tone alignment:
  - landing styling follows current shell colors and quiet-archive direction
- Video treatment:
  - semi-transparent video background at about `50%` opacity
- Scroll-driven motion:
  - scroll position advances the landing media
- Handoff:
  - end of landing flows into the current archive list
- Brand bypass:
  - brand-title click initializes directly into the list view through the bypass route
- Resilience:
  - failed media still leaves a readable landing and accessible archive list

## Evaluation Focus

- Design evaluation should inspect:
  - landing hero alignment with the current shell
  - non-overlap with the fixed topbar
  - readability over the video layer
  - restraint of glow and motion treatment
- Functional evaluation should inspect:
  - `/` landing initialization
  - `?entry=archive` direct list initialization
  - brand-title bypass behavior
  - scroll-scrubbed motion progression
  - landing-to-list handoff
  - safe fallback when media cannot initialize

## Open Blockers

- None.

## Continuity Notes

- `2026-04-18`: initial spec created from approved feat-0010 with root-only landing entry, scroll-scrubbed media, and brand-title bypass behavior locked
