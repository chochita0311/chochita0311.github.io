# FEAT-0024: Note Detail Reference Integrity

## Metadata

- ID: `feat-0024`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `functional`, `ux-heuristic`, `contract`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Product feature:
  - repair broken note-detail references, starting with `/archive/note?id=51`, while preserving normal note-detail rendering and navigation.

## Acceptance Contract

- Opening `/archive/note?id=51` renders references in a usable state.
- Reference links, reference targets, and reference entries are not visibly broken or malformed.
- The fix classifies the source of the failure before changing behavior.
- Reference repair does not break breadcrumbs, previous/next navigation, section rail behavior, or Markdown rendering in other notes.
- Links remain GitHub Pages-safe and do not introduce a competing route contract.

## Scope Boundary

- In:
  - diagnosing the broken references on `/archive/note?id=51`
  - fixing reference rendering, link normalization, relative path handling, anchors, generated reference data, or source metadata only as needed
  - regression checks against adjacent note-detail navigation
- Out:
  - broad note content rewriting
  - broad generated index redesign unless the reference bug requires one narrowly scoped derived-output fix
  - route-model redesign
  - visual redesign of note detail

## Contract Surfaces

- Markdown reference source shape
- Generated note/archive index fields if references depend on derived metadata
- Note-detail route and link normalization

## User-Visible Outcome

- Users can read note `51` and use its references without encountering broken links or malformed reference entries.

## Entry And Exit

- Entry point:
  - user opens `/archive/note?id=51`.
- Exit or transition behavior:
  - references render and navigate correctly while the user remains in the note-detail context.

## State Expectations

- Default:
  - note references render correctly.
- Loading:
  - references do not briefly appear as broken placeholders if source data is still resolving.
- Empty:
  - notes without references remain valid and do not show broken reference shells.
- Error:
  - unknown or invalid reference targets fail gracefully without corrupting the note detail.
- Success:
  - reference rendering is trustworthy for the affected note and does not regress other notes.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)

## Likely Affected Surfaces

- [assets/js/index-note-detail.js](../../../assets/js/index-note-detail.js)
- [assets/js/archive/content.js](../../../assets/js/archive/content.js)
- [assets/css/note-detail.css](../../../assets/css/note-detail.css)
- [assets/generated/archives-index.json](../../../assets/generated/archives-index.json)
- source note for id `51`

## Pass Or Fail Checks

- `/archive/note?id=51` shows usable references.
- Each visible reference link resolves or degrades gracefully.
- Other note-detail pages still render normally.
- Breadcrumbs, previous/next controls, and section rail behavior remain intact.
- No broad note-content rewrite is required unless one bad source value is the proven cause.

## Regression Surfaces

- Note-detail rendering
- Markdown parsing and link normalization
- Generated archive index usage
- Static GitHub Pages links

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning.
- `2026-04-25`: passed after the Markdown link renderer was fixed to avoid nested or malformed anchors, and `/archive/note?id=51` rendered usable reference links in the reference panel and content body.
