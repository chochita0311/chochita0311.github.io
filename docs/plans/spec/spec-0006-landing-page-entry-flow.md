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
  - `assets/landing-entry-main.mp4` should drive the landing motion treatment
  - the video should span the full landing content canvas as a background treatment
  - the video should auto-play when the landing is visible without scroll-driven scrubbing
  - the title animation should replay independently every `20` seconds while the landing remains visible
  - shell navigation outside the landing surface should bypass landing immediately instead of leaving the landing layer visible over archive state changes
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

- Add a landing-first root experience inside the existing archive shell that occupies the current content canvas below the fixed topbar, uses a semi-transparent auto-playing full-background video treatment, and hands off into the existing archive list while preserving a direct brand-title path to the list view.

## In-Scope Behavior

- Add a new landing section inside the current `archive-main` canvas before the archive list container.
- Structure the landing hero using the same general pattern as `section.relative.min-h-[870px].flex.items-center.px-8.md:px-16.overflow-hidden`, but translate it into the repository's native HTML and CSS instead of copying Tailwind markup.
- Keep the landing section below the fixed topbar and within the content area offset created by the fixed sidebar.
- Keep the topbar and sidebar visible while the landing is shown.
- Use the current shell color palette and typography tone for the landing hero.
- Add a full-background media treatment for the landing hero that uses `assets/landing-entry-main.mp4`.
- Keep the landing media visually restrained so foreground content remains readable while covering the full landing canvas.
- Start the landing media automatically when the landing is shown instead of tying playback to scroll position.
- Replay the title animation on an independent `20`-second cycle while the landing remains visible.
- Treat sidebar and topbar archive navigation as archive-mode interactions rather than as landing-owned actions.
- After the landing section is fully traversed, reveal the existing archive list as the natural continuation of the page.
- Only show the landing-first state on the root archive route `/`.
- Add a deterministic bypass path so clicking the brand title on the root shell goes directly to `/archive/`.
- Preserve current archive reset behavior when bypassing to the list view.
- Fail safely to a readable static landing hero if the video treatment cannot initialize.

## Out-Of-Scope Behavior

- Reworking archive list rendering, grid-card density, or note-detail layout
- Replacing topbar labels or sidebar taxonomy behavior
- Introducing landing ownership outside `/` or changing the canonical archive route family owned by `prd-0006`
- Full-page shell redesign or separate marketing homepage
- Wide-screen spacing changes for the list and detail canvas

## Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/js/archive/content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [assets/js/index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [assets/css/app.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/app.css)

## State And Interaction Contract

- Root-entry state:
  - when `pathname` resolves to `/`, the landing section is shown first
  - the archive list remains mounted downstream so a normal page scroll can reach it
- Bypass-entry state:
  - when the user enters `/archive/`, the page initializes directly into the archive list state and skips the landing hero
- Brand-title behavior:
  - clicking `조치타의 잡동사니` on the root archive shell navigates to `/archive/` and resets archive filters and view state to the current default list behavior
- Landing layout state:
  - the landing section height fills the current visible content canvas below the topbar
  - the landing section must not slide underneath the topbar
- Landing media state:
  - video is positioned behind the hero content across the full landing canvas
  - media starts automatically when the landing is shown and may loop while visible
  - landing shell visibility must not wait on archive note-index or search-index fetch completion
  - archive note/search data may preload in the background while landing is visible so landing handoff and search can respond promptly
- Landing title state:
  - title animation may replay independently every `20` seconds while landing is visible
- Shell navigation bypass state:
  - sidebar or topbar archive navigation while landing is visible dismisses landing immediately
  - the requested archive category or collection state renders without leaving the landing layer active
- Scroll handoff state:
  - the landing section ends directly before the current archive list section
  - scrolling beyond the landing section exposes the archive list without requiring a second CTA-only interaction
- Fallback state:
  - if scroll-scrubbed media cannot run, render a static poster-like background layer and keep the same landing copy and archive-list handoff

## Data And Contract Assumptions

- Landing ownership is limited to `/`, while archive list ownership belongs to `/archive/` and the broader archive route family.
- The landing feature should use the owned runtime asset `assets/landing-entry-main.mp4`.
- Archive list and note-detail initialization contracts remain owned by the current archive runtime and must not be redefined by landing code.
- The landing section owns only root-entry presentation and handoff, not note-loading logic.
- Archive note-index and search-index loading may preload in the background, as long as landing shell visibility on `/` does not wait for their completion.

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
  - semi-transparent full-background video treatment using `assets/landing-entry-main.mp4`
- Motion behavior:
  - landing media auto-plays when visible and is not scrubbed by scroll
  - landing video playback is slowed to `0.8x`
- Shell interaction behavior:
  - non-landing shell navigation bypasses landing immediately and does not leave landing visually active over archive state changes
- Handoff:
  - end of landing flows into the current archive list
- Brand bypass:
  - brand-title click initializes directly into the list view through `/archive/`
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
  - `/archive/` direct list initialization
  - brand-title bypass behavior
  - auto-playing landing motion behavior
  - landing-to-list handoff
  - safe fallback when media cannot initialize

## Open Blockers

- None.

## Continuity Notes

- `2026-04-18`: initial spec created from approved feat-0010 with root-only landing entry, scroll-scrubbed media, and brand-title bypass behavior locked
- `2026-04-19`: updated again so the landing motion uses `assets/landing-entry-main.mp4`, auto-plays on visibility, and covers the full landing canvas as a background treatment
- `2026-04-19`: updated so landing video playback runs at `0.8x` and title animation replays independently every `20` seconds while landing remains visible
- `2026-04-19`: updated so sidebar and topbar archive navigation bypass landing immediately instead of leaving the landing surface active after archive-state navigation
- `2026-04-19`: updated so landing bypass is owned by canonical `/archive/` entry routing instead of by a root-only `entry=archive` query flag
- `2026-04-19`: updated so landing shell boot is independent from archive data boot, allowing `/` to render landing immediately while archive note/search data may preload in the background
