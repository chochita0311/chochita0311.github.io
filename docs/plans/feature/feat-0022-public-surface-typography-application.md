# FEAT-0022: Public Surface Typography Application

## Metadata

- ID: `feat-0022`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - apply the approved `Inter`, `Noto Sans KR`, and `Satoshi` typography roles across public archive and note-detail surfaces while preserving readability, layout containment, and the dark scholarly archive tone.

## Acceptance Contract

- UI/body text uses the approved `Inter` plus `Noto Sans KR` stack.
- Title/display roles use `Satoshi` only where approved by the typography contract.
- Korean, English, and mixed text remain readable in topbar, sidebar, cards, list rows, note detail, metadata, empty states, and controls.
- Code blocks and monospace note content remain on the existing monospace stack.
- Card titles, metadata, footers, and repeated list surfaces do not clip, overlap, or lose alignment after the font change.
- Font loading does not introduce visible route flashes, unreadable fallback states, or avoidable layout shift.

## Scope Boundary

- In:
  - CSS token and font-family application
  - runtime font-loading link updates based on `feat-0021`
  - public archive list and note-detail typography application
  - responsive containment checks for typography changes
- Out:
  - policy alignment already owned by `feat-0020`
  - font-source contract already owned by `feat-0021`
  - sidebar scroll, active state, direct note context, reference repair, and small-text alignment fixes
  - broad color, layout, route, search, or note-data redesign

## User-Visible Outcome

- The public site uses the approved balanced font system and feels more polished without losing archive readability or visual containment.

## Entry And Exit

- Entry point:
  - typography policy and font-loading contract are available.
- Exit or transition behavior:
  - users browse and read with the new typography system and no regressions in layout or interaction stability.

## State Expectations

- Default:
  - all public surfaces use the approved typography roles.
- Loading:
  - fonts swap or fall back without hiding content or creating route flash.
- Empty:
  - empty and no-result states remain calm and readable.
- Error:
  - font load failure still leaves readable content.
- Success:
  - typography changes are visible and stable across landing, archive, and note-detail surfaces.

## Dependencies

- `feat-0020-typography-token-and-policy-alignment`
- `feat-0021-font-source-and-loading-contract`

## Likely Affected Surfaces

- [index.html](../../../index.html)
- [archive/index.html](../../../archive/index.html)
- [archive/note/index.html](../../../archive/note/index.html)
- [assets/css/tokens.css](../../../assets/css/tokens.css)
- [assets/css/base.css](../../../assets/css/base.css)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/css/note-detail.css](../../../assets/css/note-detail.css)

## Pass Or Fail Checks

- Body/UI text resolves to the approved `Inter` plus `Noto Sans KR` stack.
- Approved title/display surfaces resolve to `Satoshi`.
- Korean and mixed-language note metadata remains readable.
- Cards and repeated note surfaces retain containment at supported breakpoints.
- Note detail reading remains comfortable.
- No visible route flash or misleading intermediate state is introduced by font loading.

## Regression Surfaces

- Archive list rendering
- Search and filter controls
- Sidebar and topbar readability
- Note-detail reading and code blocks
- Static GitHub Pages font loading

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning after typography policy and font-source contract prerequisites.
- `2026-04-25`: passed after public HTML font links and CSS font tokens were updated; browser verification showed body text using the `Inter` / `Noto Sans KR` stack and title roles using the `Satoshi` display stack with safe fallbacks.
