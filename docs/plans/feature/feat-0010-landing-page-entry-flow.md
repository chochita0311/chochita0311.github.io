# FEAT-0010: Landing Page Entry Flow

## Metadata

- ID: `feat-0010`
- Status: `passed`
- Type: `product`
- Parent PRD: [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Created: `2026-04-18`
- Updated: `2026-04-19`

## Goal

- Product feature:
  - make the root archive route feel like a deliberate first entry by showing a landing-first shell state inside the current content canvas, then handing off into the existing archive list through a slow scroll-driven video-backed transition

## Acceptance Contract

- Visiting `chochita0311.github.io/` presents a landing-first shell state before the archive list becomes the primary visible state.
- The landing state lives only inside the current content canvas and does not overlap the fixed topbar or fixed left sidebar.
- The landing hero tone aligns with the repository's current dark archive shell and stays closer to the quieter `Quiet Archive` concept than to the more luminous explorations.
- Only the structural pattern of `tmp/sample.html`'s targeted hero section is reused; the sample page as a whole is not copied.
- The landing hero uses a semi-transparent background video treatment derived from `Video_Generation_With_Specific_Effects.mp4`.
- Landing motion advances in sync with scroll progress through the landing section rather than behaving like a loud autonomous splash playback.
- After the landing section is fully traversed, the existing archive list becomes the visible downstream browse state.
- Clicking the top-left brand title `조치타의 잡동사니` on the root archive shell bypasses the landing state and opens the current archive list view directly.

## Scope Boundary

- In:
  - landing-first root entry behavior for `chochita0311.github.io/`
  - landing hero section inside the current `archive-main` canvas
  - reuse of only the targeted structural pattern from [sample.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/sample.html)
  - quiet-archive hero styling aligned to the existing shell
  - semi-transparent video background treatment derived from [Video_Generation_With_Specific_Effects.mp4](/Users/jungsoo/Projects/chochita0311.github.io/tmp/Video_Generation_With_Specific_Effects.mp4)
  - scroll-driven motion progression through the landing section
  - landing-to-list handoff at the end of the landing section
  - root-route and brand-title behavior separation
- Out:
  - broad redesign of archive list cards, note-detail reading UI, or sidebar taxonomy behavior
  - building a separate marketing page or full-page takeover outside the existing shell
  - topbar information-architecture changes unrelated to brand-title bypass behavior
  - changes to note loading, filtering, or pagination beyond what is required after landing handoff
  - wide-screen spacing changes for the list and detail canvas

## User-Visible Outcome

- Users arriving at `/` see a quieter, motion-backed landing hero inside the existing shell, scroll through it as the background motion progresses, and then continue naturally into the same archive list they use today.

## Entry And Exit

- Entry point:
  - user visits `chochita0311.github.io/`
- Exit or transition behavior:
  - scrolling through the landing section progresses the background motion and hands off into the existing archive list
  - clicking the top-left brand title bypasses landing and resets directly into the current list view

## State Expectations

- Default:
  - root route shows the landing-first shell state inside the content canvas
  - topbar and left sidebar remain visible
  - landing hero sits below the fixed topbar
- Loading:
  - landing media initializes without collapsing the hero layout or hiding primary copy and CTA
- Empty:
  - if media cannot provide visible frames, the landing still reads as an intentional quiet-archive hero rather than a broken blank panel
- Error:
  - if the video-backed motion treatment fails, the landing falls back to a readable static hero and users can still reach the archive list
- Success:
  - landing content remains readable over the semi-transparent motion background, scroll progression feels slow and controlled, and the list handoff feels deliberate

## Dependencies

- Parent PRD [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Current shell structure in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- Current archive initialization and brand reset behavior in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- Current list/detail state toggling in [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- Current layout ownership in [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css) and [note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
- Structural reference in [sample.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/sample.html)
- Motion reference in [Video_Generation_With_Specific_Effects.mp4](/Users/jungsoo/Projects/chochita0311.github.io/tmp/Video_Generation_With_Specific_Effects.mp4)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/js/archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [assets/js/index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [assets/css/app.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/app.css)
- [docs/plans/spec/](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec)

## Pass Or Fail Checks

- Visiting `/` renders a landing-first hero before the archive list becomes the primary visible state.
- The landing hero is contained within the current content canvas and does not overlap the topbar or sidebar.
- The implemented hero borrows only the targeted section structure from `tmp/sample.html`.
- The landing hero remains visually aligned with the current archive shell color and tone.
- A semi-transparent video treatment is visible behind the landing hero content.
- Scrolling through the landing section advances the background motion progressively rather than replaying as an unrelated autoplay loop.
- Reaching the end of the landing section reveals the existing archive list as the downstream state.
- Clicking `조치타의 잡동사니` on the root archive shell opens the current list view directly instead of replaying landing.
- If motion media fails, users can still read the landing content and reach the archive list.

## Regression Surfaces

- Existing archive list rendering
- Existing inline note-detail transition behavior
- Brand-title reset behavior
- Topbar and sidebar fixed positioning
- Search input visibility and behavior
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc: [spec-0006-landing-page-entry-flow.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0006-landing-page-entry-flow.md)
- Latest evaluator report: [eval-0010-functional-landing-page-entry-flow.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0010-functional-landing-page-entry-flow.md)
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0005
- `2026-04-19`: remained in-loop after design review passed with suggestions but functional and UX evaluation returned the feature for interaction-isolation fixes
- `2026-04-19`: passed after landing-state interaction isolation was added and evaluation rerun confirmed root landing, brand bypass, and downstream archive handoff behavior
