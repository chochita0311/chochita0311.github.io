# SPEC-0007: Wide-Screen Sidebar Content Spacing

## Metadata

- ID: `spec-0007`
- Status: `approved`
- Run ID: `run-20260418-02`
- Attempt: `1`
- Parent Feature: [feat-0011-wide-screen-sidebar-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0011-wide-screen-sidebar-content-spacing.md)
- Parent PRD: [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Created: `2026-04-18`
- Updated: `2026-04-20`

## Source Set

- Human request:
  - on huge monitors the content feels too left-weighted
  - the distance from the sidebar to the list and detail canvas should be roughly doubled
  - use the current breakpoint model rather than inventing a separate one
  - adjust the current shell state rather than creating a second large-screen mode
- Parent feature:
  - [feat-0011-wide-screen-sidebar-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0011-wide-screen-sidebar-content-spacing.md)
- Parent PRD:
  - [prd-0005-landing-entry-and-wide-screen-content-spacing.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0005-landing-entry-and-wide-screen-content-spacing.md)
- Golden sources:
  - current archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - current spacing ownership in [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css) and [note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
- Relevant policies or contracts:
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)

## Implementation Goal

- Rebalance the archive shell on desktop and large-monitor layouts by increasing the left-side content offset and internal content padding within the current breakpoint model so both list and inline detail views read farther from the fixed sidebar.

## In-Scope Behavior

- Adjust the desktop-and-up shell spacing logic that currently positions `archive-main` relative to the fixed sidebar.
- Increase the effective left gap between the sidebar edge and the centered content canvas so it reads roughly doubled from the current spacing direction on large displays.
- Keep the current breakpoint structure and update its values rather than adding a parallel breakpoint taxonomy.
- Ensure the spacing adjustment applies to both the archive list and the inline note-detail view.
- Keep content centered within the main canvas after the spacing change.
- Preserve current topbar and sidebar fixed positioning.
- Preserve smaller breakpoint behavior and avoid introducing unusable dead space or clipping.

## Out-Of-Scope Behavior

- Root landing entry behavior
- Scroll-driven media treatment
- List/grid card density changes
- Sidebar redesign
- Note-detail typography refactor unrelated to shell spacing

## Affected Surfaces

- [assets/css/layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [assets/css/note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
- [assets/css/tokens.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/tokens.css)
- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)

## State And Interaction Contract

- Default desktop state:
  - `archive-main` keeps its relationship to the fixed sidebar but uses larger horizontal spacing values than before
- Large-monitor state:
  - the list and detail canvas left edge reads visibly farther from the sidebar than in the pre-feature layout
- Shared-shell state:
  - both list and inline detail use the same revised shell offset logic rather than diverging into incompatible spacing modes
- Smaller-breakpoint state:
  - tablet and mobile retain their existing sidebar-collapse and full-width content behavior
- Failure tolerance:
  - if a particular large-screen adjustment is not supported, the layout must still remain readable and centered

## Data And Contract Assumptions

- Current shell spacing is primarily owned by CSS variables and layout rules rather than JS layout calculation.
- The breakpoint model already used by `layouts.css` and `note-detail.css` remains the source of truth for responsive shell behavior.
- The feature does not require runtime state or URL changes.

## Acceptance Mapping

- Wider gap:
  - content canvas left gap reads roughly doubled on large monitors
- Surface parity:
  - list and detail both inherit the revised spacing
- Breakpoint continuity:
  - current breakpoint model is reused, not replaced
- Shell continuity:
  - revised spacing still feels like the same archive shell
- Responsiveness:
  - smaller breakpoints do not regress

## Evaluation Focus

- Design evaluation should inspect:
  - perceived balance between sidebar and content on wide displays
  - parity between list and inline detail spacing
  - centered reading feel after the offset change
- Functional evaluation should inspect:
  - no clipping or overflow introduced by the new spacing values
  - preserved behavior on desktop, tablet, and mobile breakpoints

## Open Blockers

- None.

## Continuity Notes

- `2026-04-18`: initial spec created from approved feat-0011 with current-breakpoint spacing updates and list/detail parity locked
- `2026-04-20`: large-monitor shell centering was tightened so `archive-main` no longer stays left-clamped by a desktop max-width and the list/detail canvas centers within the post-sidebar content region on non-mobile layouts
