# PRD-0004: Archive Navigation And Label Polish

## Metadata

- ID: `prd-0004`
- Status: `approved`
- Owner role: `human`
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Request Summary

- Refine archive pagination behavior, grid-card presentation, and user-facing navigation labels so note browsing feels more stable and future-facing.
- Specifically keep pagination controls anchored during page turns, revisit the page-size control pattern, rename user-facing `Categories` language to `Notes`, update top navigation labels, tighten grid density, raise the popular-tags threshold, and improve grid-card overflow treatment.

## Source Set

- Human request:
  - When navigating to the last archive page and then pressing the previous-page button, the clicked footer control shifts because the shorter final page changes the list height. Keep the archive footer control area stable so repeated previous or next paging does not move the click target away.
  - Revisit the page-size dropdown button pattern; design discussion is needed.
  - Move the page-size control into the archive footer left area, using `./tmp/sample.html` only as a placement reference, not as a visual style to copy.
  - Move the current page-navigation buttons into the footer center area.
  - The page-size control should open downward, not upward, and its direction cue should stay stable instead of flipping upward when the control is opened.
  - Separate the footer rows so page-related controls and labels do not share the same row as the footer credit, similar in principle to how card bottoms separate tags and collection metadata.
  - Rename `CATEGORIES` label usage to `NOTES` across the product-facing surface and related code.
  - Rename the durable content root from `./CATEGORIES` to `./NOTES` and update related code and documentation accordingly.
  - Replace the current topbar labels `CATEGORIES`, `LIBRARY`, `ARCHIVE`, `ABOUT` with `NOTES`, `PROJECTS`, `DESIGN`, `GAME`, `ABOUT`.
  - `PROJECTS`, `DESIGN`, `GAME`, and `ABOUT` may remain dummy entries for now.
  - Show popular tags only when a tag appears in at least `5` notes.
  - Reduce card-view spacing because current card margins feel too large.
  - In card view, hovering `+N` should reveal the abbreviated hidden tags.
  - In card view, long titles and summaries should truncate with `...` so rows align more cleanly.
- Golden sources:
  - None supplied beyond the human request.
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [policy.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/policy.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
  - [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
  - [topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
  - [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
  - [note-detail-page.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/note-detail-page.js)
  - [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)

## Product Intent

- Make archive browsing feel physically stable, visually tighter, and semantically clearer by aligning user-facing labels with the notes product, reducing friction in repeated pagination, and improving grid-card scan quality.

## Confirmed Scope

- Preserve the archive footer pagination interaction point when users move between pages, especially when transitioning from a short final page to a fuller previous page or vice versa.
- Treat repeated pagination as a continuous browse action rather than an interaction that should force the footer controls away from the current viewport focus.
- Revisit the current page-size dropdown control and define a better interaction pattern through child design and spec work.
- Move the archive page-size control from the current archive control row into the left side of the archive footer.
- Move the current previous and next page controls into the center area of the archive footer.
- Ensure the page-size control opens downward rather than upward and that its direction cue stays unchanged instead of flipping upward when opened.
- Separate the archive footer into distinct rows so page-related controls and labels are not laid out on the same row as the footer credit.
- Use `tmp/sample.html` only as a layout-location reference for footer placement, while keeping this repository's current design language rather than copying the sample's styling.
- Rename user-facing `Categories` language to `Notes` across the main archive screen, note-detail browse affordances, topbar labeling, sidebar labeling, and any other product-visible archive navigation text touched by this work.
- Rename the durable archive content root from `CATEGORIES/` to `NOTES/`.
- Update runtime fetch paths, generated data ownership, scripts, documentation, and navigation copy that currently depend on `CATEGORIES/`.
- Update the topbar information architecture labels to:
  - `Notes`
  - `Projects`
  - `Design`
  - `Game`
  - `About`
- Keep `Projects`, `Design`, `Game`, and `About` as non-functional placeholder entries for now if no scoped destination exists yet.
- Raise the minimum repeated-tag threshold for the sidebar popular-tags area from `2` to `5`.
- Reduce horizontal and or vertical spacing in grid-card view so card density feels tighter than the current layout.
- Add a hover affordance for the grid-card `+N` tag overflow chip so hidden tags can be inspected without expanding the card permanently.
- Truncate long grid-card titles and summaries with ellipsis so cards align more consistently within a row.

## Excluded Scope

- Changing the note-source ownership model beyond renaming the root path from `CATEGORIES/` to `NOTES/`
- Implementing real destination pages or content systems for `Projects`, `Design`, `Game`, or `About`
- Broad note-detail redesign unrelated to navigation label parity
- Reworking list-view card density unless needed as a secondary consequence of shared card styles
- Changing sitemap, indexing, or crawl behavior

## Uncertainty

- The pagination-stability fix is confirmed as a product requirement, but the implementation mechanism is intentionally open. Child work may use scroll anchoring, preserved footer offset, viewport compensation, or another static-friendly approach as long as the footer controls remain practically repeat-clickable across page turns.
- The page-size control definitely needs redesign discussion, but this PRD does not yet choose a final replacement pattern. Child design work must compare whether the control remains a dropdown, becomes a segmented selector, or adopts another compact pattern.
- The footer now has a confirmed two-row separation requirement, but child work still needs to define the exact composition within the page-controls row, including where the page label sits relative to page-size and previous/next controls across breakpoints.
- The page-size control direction is now fixed as a downward-opening menu, and the direction cue must remain stable on open. Child work may still refine the exact cue styling as long as it does not flip into an upward state.
- The request now explicitly includes renaming the durable content root from `CATEGORIES/` to `NOTES/`. Child work should still avoid low-value churn in unrelated identifiers that are not tied to runtime paths, docs, or meaningful product semantics.
- Popular tags with the `>= 5` threshold remain computed globally across the full notes archive rather than within the current category, collection, or search scope.
- The topbar dummy entries may remain inert links or placeholder buttons until a later PRD defines those sections. Child work must choose the least misleading placeholder behavior.
- The exact truncation line count for grid-card titles and summaries is intentionally open. Child design work must choose values that improve row alignment without hiding too much useful context.
- The hidden-tag reveal pattern is intentionally open. Tooltip, hover card, or inline expansion are all allowed candidates if they keep the grid compact.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Preserve existing note browsing, search, filtering, and note-opening flows unless this PRD explicitly changes them.
- Keep the product notes-first; placeholder topbar entries must not imply a full multi-section product has already been built.
- Reuse existing archive rendering and styling patterns where possible instead of introducing heavy new abstractions.
- Keep accessibility intact for pagination controls, hover-revealed tag overflow, and any replacement page-size control.
- Keep the archive footer readable and balanced after relocating controls; the new footer layout should feel intentional on both desktop and smaller screens.
- Keep the footer credit visually separated from page-size, page label, and page-navigation controls rather than compressing them into one mixed row.
- Preserve the current durable note structure pattern under the renamed root: `NOTES/<category>/<collection>/<note>.md`.
- Update generators, runtime fetches, and owner docs together so the root rename does not leave mixed `CATEGORIES/` and `NOTES/` assumptions in active code paths.
- If internal identifiers remain named around `category` for nested taxonomy reasons, user-facing copy must still read as `Notes` where this PRD applies.
- Maintain documentation accuracy when navigation labels, thresholds, or control behavior change.

## Acceptance Envelope

- When a user clicks archive previous or next pagination controls near the bottom of the viewport, the footer control area remains practically anchored so the user can continue paging without the clicked control jumping out of reach after the page update.
- The archive exposes a revised page-size control pattern that is intentionally chosen rather than inherited by default from the current dropdown.
- The archive page-size control is rendered in the left side of the archive footer rather than the current upper control row.
- The page-size control opens downward, and its direction cue does not flip upward when the menu is opened.
- The current previous and next pagination controls are rendered in the center area of the archive footer.
- The footer credit is rendered on a separate row from the page-size control, page label, and pagination controls.
- The touched footer layout preserves the repository's current visual language and does not copy the styling of `tmp/sample.html`.
- The durable note root is `NOTES/`, and active runtime code, generators, and owner docs no longer rely on `CATEGORIES/` as the live archive root.
- Product-visible `Categories` labeling no longer appears in the touched archive navigation surfaces; `Notes` is used instead.
- The topbar visible labels read `Notes`, `Projects`, `Design`, `Game`, and `About`.
- `Projects`, `Design`, `Game`, and `About` do not break navigation flow even if they remain placeholders.
- The sidebar popular-tags area only includes tags that appear in at least `5` notes according to the chosen runtime scope.
- Grid-card spacing is visibly tighter than the current implementation.
- In grid view, hidden tags represented by `+N` can be inspected on hover without permanently expanding every card.
- In grid view, long titles and summaries truncate with ellipsis in a way that makes card rows read more evenly aligned.

## Candidate Features

- `feat-0007-footer-pagination-anchor-and-control-relocation`: keep footer pagination controls stable across page turns, move page-size into the footer left area, move page navigation into the footer center area, and redesign the page-size control
- `feat-0008-notes-root-and-topbar-placeholder-reframe`: rename the archive root and user-facing `Categories` language to `Notes`, then update topbar labels to the future-facing placeholder set
- `feat-0009-popular-tag-threshold-and-grid-card-polish`: raise the popular-tag threshold and tighten grid-card spacing, truncation, and hidden-tag reveal behavior

## Continuity Notes

- `2026-04-18`: initial draft created from the human request covering pagination stability, page-size control reconsideration, notes labeling, topbar placeholder relabeling, popular-tag threshold changes, and grid-card polish
- `2026-04-18`: revised after human clarification that the durable archive root must also be renamed from `CATEGORIES/` to `NOTES/`
- `2026-04-18`: revised after human clarification that the page-size control belongs in the footer left area and the current page-navigation controls should move to the footer center without copying `tmp/sample.html` styling
- `2026-04-18`: approved after clarifying that popular tags remain globally computed and that page-related footer controls should stay separated from the footer credit row
