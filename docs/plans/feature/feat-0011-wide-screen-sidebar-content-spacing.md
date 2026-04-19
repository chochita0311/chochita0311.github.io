# FEAT-0011: Wide-Screen Sidebar Content Spacing

## Metadata

- ID: `feat-0011`
- Status: `passed`
- Type: `product`
- Parent PRD: [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Created: `2026-04-18`
- Updated: `2026-04-19`

## Goal

- Product feature:
  - rebalance the archive shell on large monitors by increasing the horizontal separation between the fixed left sidebar and the main content canvas for both list and inline detail states

## Acceptance Contract

- On large-monitor layouts, the left gap from the fixed sidebar's right edge to the main content canvas reads roughly doubled relative to the current desktop spacing.
- The spacing adjustment applies to both `#archive-list-view` and `#archive-detail-view`.
- The change reuses the current breakpoint system rather than introducing a separate breakpoint model just for this feature.
- The revised spacing remains aligned with the current shell structure and does not create a disconnected second layout mode.
- Smaller breakpoints remain usable and do not regress into awkward empty space or cramped content.

## Scope Boundary

- In:
  - desktop and large-monitor horizontal spacing adjustments within the current shell
  - updates to main-content padding, margins, or max-width logic needed to increase the sidebar-to-content separation
  - parity between archive list and inline note-detail spacing behavior
  - responsive verification against the current breakpoint model
- Out:
  - landing entry behavior and scroll-driven media treatment
  - redesign of the fixed sidebar itself
  - major changes to card density, note typography, or archive controls unrelated to shell spacing
  - adding an entirely new breakpoint taxonomy for this one adjustment

## User-Visible Outcome

- Users on large monitors see the list and detail canvas sit farther from the fixed sidebar, so the archive no longer feels left-pinned or visually cramped against the shell edge.

## Entry And Exit

- Entry point:
  - user views the archive list or inline note detail on a desktop or large monitor
- Exit or transition behavior:
  - user remains in the same archive shell and flows, but the content canvas reads as better balanced relative to the fixed sidebar

## State Expectations

- Default:
  - desktop and larger shells show a visibly wider sidebar-to-content gap than before
- Loading:
  - archive and note-detail content do not jump into a conflicting temporary width while layout initializes
- Empty:
  - empty list or empty detail states still align cleanly within the revised content canvas
- Error:
  - if a spacing rule fails at a breakpoint, content should still remain readable and reachable rather than being clipped or hidden
- Success:
  - list and detail views both feel less left-weighted on wide displays while continuing to behave like the same archive application

## Dependencies

- Parent PRD [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Current shell layout in [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- Current note-detail layout in [note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
- Current archive shell structure in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)

## Likely Affected Surfaces

- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
- [assets/css/tokens.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/tokens.css)
- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [docs/plans/spec/](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec)

## Pass Or Fail Checks

- On large-monitor layouts, the main content canvas left edge sits visibly farther from the fixed sidebar than in the pre-feature layout.
- The increased gap applies to both the archive list view and the inline note-detail view.
- The current breakpoint system remains the basis for the spacing behavior.
- Standard desktop and smaller breakpoints do not introduce excessive dead space or clipping.
- The content canvas remains centered and readable after the spacing update.

## Regression Surfaces

- Fixed topbar and sidebar positioning
- Archive list width and pagination area
- Inline note-detail readability and TOC rail alignment
- Mobile and tablet shell behavior
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc: [spec-0007-wide-screen-sidebar-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0007-wide-screen-sidebar-content-spacing.md)
- Latest evaluator report: [eval-0011-functional-wide-screen-sidebar-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0011-functional-wide-screen-sidebar-content-spacing.md)
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0005
- `2026-04-19`: passed after large-screen spacing and list/detail left-edge alignment were verified through design and functional evaluation
