# FEAT-0027: Small Text And Topbar Alignment

## Metadata

- ID: `feat-0027`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - center the topbar start content vertically and normalize the requested small navigation, fact-label, sidebar, and footer text surfaces to 12 px.

## Acceptance Contract

- `body > nav > div.topbar__start > div` appears vertically centered within the topbar.
- Topbar navigation text uses 12 px and remains readable and clickable.
- Note-detail fact labels `PUBLISHED`, `TAGS`, and `REFERENCES` use 12 px and remain aligned with their values.
- `#note-detail-nav > a > span.note-detail__nav-label` uses 12 px without reducing note-section navigation clarity.
- `#archive-detail-view > header > nav` uses 12 px without damaging breadcrumb readability.
- `body > aside > div.sidebar__profile > div > div:nth-child(2) > p`, `body > aside > div.sidebar__section > p`, and `body > main > footer > p` use 12 px without overlap, clipping, or unintended layout shift.

## Scope Boundary

- In:
  - topbar start vertical alignment
  - 12 px text normalization for the requested topbar, note-detail, sidebar, and footer small-text surfaces
  - mapping fragile selectors to durable component roles where possible
  - responsive checks for clipping and readability
- Out:
  - broad typography system migration
  - changing font family ownership
  - sidebar route-state fixes
  - note reference repair
  - broad layout redesign

## User-Visible Outcome

- Small interface labels and navigation text read more consistently, and the topbar start content sits visually centered.

## Entry And Exit

- Entry point:
  - user views public archive or note-detail surfaces with topbar, sidebar, metadata, and footer text visible.
- Exit or transition behavior:
  - small text surfaces render at the approved size and remain aligned across standard breakpoints.

## State Expectations

- Default:
  - requested small-text surfaces use 12 px and maintain layout.
- Loading:
  - topbar and small-text alignment does not jump during initial render.
- Empty:
  - footer and sidebar labels remain readable in empty or no-result states.
- Error:
  - error states do not inherit broken spacing from the small-text change.
- Success:
  - visual alignment and small-type consistency improve without reducing usability.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Prefer after `feat-0022-public-surface-typography-application` if the font family migration affects text metrics.

## Likely Affected Surfaces

- [assets/css/layouts.css](../../../assets/css/layouts.css)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/css/note-detail.css](../../../assets/css/note-detail.css)
- [index.html](../../../index.html)
- [archive/index.html](../../../archive/index.html)
- [archive/note/index.html](../../../archive/note/index.html)

## Pass Or Fail Checks

- `body > nav > div.topbar__start > div` is vertically centered in desktop and responsive topbar states.
- Topbar nav text is 12 px and still usable.
- Note-detail facts labels are 12 px and aligned.
- Requested note-detail nav, archive header nav, sidebar profile, sidebar section, and footer paragraph surfaces are 12 px.
- No requested text surface clips, overlaps, or causes an unintended layout shift.

## Regression Surfaces

- Topbar layout and controls
- Sidebar profile and section labels
- Note-detail facts and section navigation
- Archive detail breadcrumbs
- Footer readability

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning, preferably after public typography application if font metrics change.
- `2026-04-25`: passed after browser verification showed topbar start content centered and each requested topbar, fact-label, note-detail nav, archive header nav, sidebar, and footer text surface rendering at `12px`.
