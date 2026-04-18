# FEAT-0007: Footer Pagination Anchor And Control Relocation

## Metadata

- ID: `feat-0007`
- Status: `draft`
- Type: `product`
- Parent PRD: [prd-0004-archive-navigation-and-label-polish.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Goal

- Product feature:
  - make archive page-turning feel stable by anchoring footer interactions across page changes, moving the page-size control into the footer left area, moving previous and next controls into the footer center area, and keeping the page-size control as a downward-opening control with a stable direction cue

## Acceptance Contract

- When a user repeatedly clicks previous or next near the bottom of the archive viewport, the footer interaction area remains practically anchored rather than jumping away because the next page has a different list height.
- The page-size control no longer renders in the upper archive control row.
- The page-size control renders in the left side of the archive footer.
- The previous and next pagination controls render in the center area of the archive footer.
- Page-related controls and labels render on a row that is separate from the footer credit row.
- The page-size control opens downward.
- The page-size direction cue does not flip upward when the menu opens.
- The footer layout keeps the repository's current visual language and does not copy `tmp/sample.html`.

## Scope Boundary

- In:
  - footer pagination anchoring behavior across page turns
  - archive footer layout changes for page-size and previous/next relocation
  - separation of page-related footer row from footer credit row
  - page-size dropdown direction and stable cue behavior
  - archive control-row cleanup directly caused by moving page-size out of the upper area
  - responsive footer adjustments needed to keep the relocated controls usable
- Out:
  - renaming `CATEGORIES/` to `NOTES/`
  - topbar relabeling beyond any text directly required by footer control behavior
  - popular-tag threshold changes
  - grid-card spacing, truncation, or hidden-tag hover reveal
  - redesign of the footer credit text itself

## User-Visible Outcome

- Users can keep paging from the footer without losing the click target, and the archive footer now presents page-size on the left, page navigation in the center, and the footer credit on its own separate row.

## Entry And Exit

- Entry point:
  - user is on the archive list screen and reaches the footer controls while browsing a paginated note list
- Exit or transition behavior:
  - user remains on the archive list screen after page turns, with the footer controls staying available for continued browsing and with page-size interaction occurring from the footer left area

## State Expectations

- Default:
  - page-size control is in the footer left area
  - previous and next controls are in the footer center area
  - page-related footer content is separated from the credit row
- Loading:
  - footer layout does not collapse or flash to the old upper-control placement while archive content initializes
- Empty:
  - empty archive states still keep a coherent footer without broken control placement
- Error:
  - if archive data fails to load, footer controls fail in a bounded and readable way rather than leaving overlapping or orphaned footer elements
- Success:
  - repeated page turns stay practically anchored, footer controls are relocated as specified, and the page-size menu opens downward with a stable cue

## Dependencies

- Parent PRD [prd-0004-archive-navigation-and-label-polish.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Current archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- Current footer and control styles in [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css) and [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- Current archive runtime in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js) and [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- Placement reference only in [sample.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/sample.html)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [assets/js/archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [assets/js/index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [docs/policies/project/architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
- [docs/policies/project/developer-guide.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/developer-guide.md)

## Pass Or Fail Checks

- The upper archive control row no longer contains the page-size control.
- The archive footer left area contains the page-size control.
- The archive footer center area contains the previous and next page controls.
- The footer credit renders on a separate row from page-size, page label, and previous/next controls.
- Clicking previous from a short final page does not move the footer controls out of practical repeat-click reach.
- Clicking next and previous repeatedly does not cause the page-size control and navigation controls to jump away from the bottom interaction area.
- Opening the page-size control shows a downward-opening menu.
- Opening the page-size control does not flip its direction cue upward.
- The relocated footer controls still work on smaller screens without overlap or unreadable compression.

## Regression Surfaces

- Archive page-size selection behavior
- Archive previous and next pagination behavior
- Archive page label updates
- Archive footer credit rendering
- Grid and list view switching
- Empty and error archive states
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0004
