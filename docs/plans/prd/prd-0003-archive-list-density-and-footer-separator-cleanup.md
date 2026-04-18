# PRD-0003: Archive List Density And Footer Separator Cleanup

## Metadata

- ID: `prd-0003`
- Status: `approved`
- Owner role: `human`
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Request Summary

- Clean up redundant archive-list chrome around the hero and footer so the list view feels tighter and visually cleaner.
- Specifically remove the redundant archive hero head wrapper, reduce excessive list-view spacing between note cards, and eliminate the double-divider effect above the archive footer shown in the supplied screenshot.

## Source Set

- Human request:
  - `archive-hero__head` seems redundant and should be removed.
  - Remove that hero section and keep only the page-size dropdown and the list-grid toggle in that area.
  - Keep active archive browsing behavior working while removing only the hero copy section.
  - Move only `assets/config/archive-descriptions.json` into `./stale/` because it was tied to the removed hero copy.
  - Reduce the margin or visual gap between note cards in list view.
  - Remove the two-line effect created by the last list card divider plus the archive footer divider.
- Golden sources:
  - [s1.png](/Users/jungsoo/Projects/chochita0311.github.io/tmp/s1.png)
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
  - [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
  - [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)

## Product Intent

- Make the archive list screen feel more intentional by removing the hero copy section, tightening list density, simplifying the visual handoff from the final note card into pagination and footer controls, and parking the removed hero-copy config in `./stale/` for possible future recovery.

## Confirmed Scope

- Remove the archive hero head or copy section so the archive area keeps only the page-size dropdown and the list-grid toggle in that control row.
- Remove the current archive hero title and summary block from the list screen.
- Reduce vertical spacing between note cards when the archive is in list view.
- Resolve the stacked-divider effect above the archive footer so the final page section reads as one clean boundary, not two adjacent lines.
- Move `assets/config/archive-descriptions.json` into `./stale/`.
- Add `stale/stale.md` with a short explanation that the parked hero-copy config may be reused if the removed archive hero copy needs to return later.

## Excluded Scope

- Reworking the archive grid view layout or density
- Redesigning the page-size or grid-toggle interaction model
- General repository-wide stale-file cleanup unrelated to this archive hero cleanup
- Replacing the active `archives-index.json` runtime path or the current generator ownership
- Broader archive-footer redesign beyond resolving the double-divider issue at the list-to-footer boundary

## Uncertainty

- The exact visual solution for the footer-divider issue is intentionally open. The child feature may remove the last card border, change footer top-border behavior, or use another simpler treatment, as long as the final boundary reads as a single divider.
- The exact reduced list-view gap is intentionally not fixed in this PRD. Child design/spec work should choose a tighter value that improves density without making cards feel cramped.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Preserve archive browsing, filtering, pagination, and note-opening behavior.
- Reuse existing archive layout patterns where possible instead of introducing new decorative containers.
- Keep `./stale/` usage explicit and limited to the removed hero-copy config plus any directly related note explaining its relocation.
- Maintain documentation accuracy if any file ownership or active runtime paths change.

## Acceptance Envelope

- The archive list screen no longer shows the current hero title and summary block.
- The archive area retains only the page-size dropdown and the list-grid toggle as its visible top controls.
- In list view, consecutive note cards render with noticeably tighter vertical spacing than the current implementation.
- At the bottom of a paginated list, the transition from the last note card into the archive footer presents as a single clean divider treatment rather than two stacked horizontal lines.
- `assets/generated/archives-index.json` and `scripts/generate-archives-index.mjs` remain active and continue supporting the current browse flow.
- `assets/config/archive-descriptions.json` no longer lives in its former active path.
- A `stale/stale.md` file exists and briefly explains why the parked hero-copy config was moved there and that it may be useful for future revert or recovery work.

## Candidate Features

- `feat-0006-archive-hero-and-list-boundary-cleanup`: remove the archive hero copy section, tighten list-view spacing, clean up the list-to-footer divider boundary, and park the removed hero-copy config in `./stale/`

## Continuity Notes

- `2026-04-18`: initial draft created from the human request and screenshot review
- `2026-04-18`: revised after human clarification that this cleanup removes the hero copy section but should not change the active browse-index workflow
- `2026-04-18`: approved with `archive-descriptions.json` as the only stale relocation tied to the removed hero copy
