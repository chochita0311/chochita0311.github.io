# FEAT-0009: Popular Tag Threshold And Grid Card Polish

## Metadata

- ID: `feat-0009`
- Status: `draft`
- Type: `product`
- Parent PRD: [prd-0004-archive-navigation-and-label-polish.md](docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Goal

- Product feature:
  - make the archive grid denser and easier to scan by raising the popular-tag threshold to a more selective global standard and refining grid-card spacing, overflow disclosure, and text truncation

## Acceptance Contract

- The sidebar popular-tags area only includes tags that appear in at least `5` notes globally across the archive.
- Grid-card spacing is tighter than the current layout.
- In grid view, long note titles truncate with ellipsis in a consistent aligned pattern.
- In grid view, long note summaries truncate with ellipsis in a consistent aligned pattern.
- In grid view, the `+N` overflow tag affordance reveals the hidden tags on hover without permanently expanding every card.

## Scope Boundary

- In:
  - global popular-tag threshold change from `>= 2` to `>= 5`
  - sidebar popular-tag rendering updates caused by the new threshold
  - grid-card spacing reduction
  - grid-card title truncation alignment
  - grid-card summary truncation alignment
  - hover reveal behavior for hidden grid-card tags behind `+N`
- Out:
  - footer pagination relocation
  - page-size control redesign or cue behavior
  - root rename from `CATEGORIES/` to `NOTES/`
  - topbar placeholder relabeling
  - list-view spacing changes unless required by shared card code and explicitly bounded

## User-Visible Outcome

- Users see a more selective global popular-tags list and a tighter, more uniform archive grid whose hidden tags can still be inspected on hover.

## Entry And Exit

- Entry point:
  - user lands on the archive list in grid mode or observes the sidebar popular-tags area on the main archive shell
- Exit or transition behavior:
  - user remains in the archive surface, but the grid presents tighter and more aligned cards while the sidebar shows only globally repeated tags meeting the higher threshold

## State Expectations

- Default:
  - sidebar popular-tags list shows only tags meeting the global `>= 5` threshold
  - grid cards appear tighter and more consistently aligned
- Loading:
  - grid layout does not collapse or flash oversized spacing before note cards render
- Empty:
  - if no tags meet the higher threshold, the sidebar empty message remains intentional and readable
- Error:
  - hover disclosure and truncation behavior fail safely rather than breaking card layout or interaction
- Success:
  - global popular tags are more selective, grid cards align more evenly, and hidden tags remain inspectable on hover

## Dependencies

- Parent PRD [prd-0004-archive-navigation-and-label-polish.md](docs/plans/prd/prd-0004-archive-navigation-and-label-polish.md)
- Current archive rendering in [archive-content.js](assets/js/archive/content.js)
- Current grid-card styling in [components.css](assets/css/components.css) and [layouts.css](assets/css/layouts.css)
- Current archive shell in [index.html](index.html)

## Likely Affected Surfaces

- [assets/js/archive/content.js](assets/js/archive/content.js)
- [assets/css/components.css](assets/css/components.css)
- [assets/css/layouts.css](assets/css/layouts.css)
- [index.html](index.html)
- [docs/policies/project/developer-guide.md](docs/policies/project/developer-guide.md)

## Pass Or Fail Checks

- Tags appearing fewer than `5` times globally do not render in the sidebar popular-tags area.
- Tags appearing `5` or more times globally do render in the sidebar popular-tags area.
- Switching category, collection, or search scope does not change the underlying global threshold computation logic for popular tags.
- Grid cards render with visibly reduced spacing compared with the pre-feature layout.
- Long grid-card titles truncate with ellipsis instead of expanding rows unpredictably.
- Long grid-card summaries truncate with ellipsis instead of expanding rows unpredictably.
- Hovering the `+N` tag overflow affordance reveals the hidden tags without permanently expanding the grid card.

## Regression Surfaces

- Popular-tag click filtering behavior
- Grid/list view toggle behavior
- Grid-card responsive layout
- Archive note click targets
- Sidebar empty-state rendering
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0004
