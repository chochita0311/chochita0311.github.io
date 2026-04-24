# PRD-0007: Note Detail Utility And Reading Polish

## Metadata

- ID: `prd-0007`
- Status: `done`
- Type: `product`
- Created: `2026-04-19`
- Updated: `2026-04-19`

## Goal

- Tighten the note-detail reading surface so the utility row, footer navigation, and section rail feel cleaner and more intentional during everyday reading.

## Scope

- In:
  - align the note summary line length with the note title block
  - make category and collection breadcrumbs read as clickable navigation and return to the corresponding archive list
  - make note-detail rail entries focus the real heading they reference
  - shorten footer navigation labels from `Previous Note` and `Next Note` to `Previous` and `Next`
  - replace the leftmost note action with `content_copy`
  - copy only the Markdown body, excluding frontmatter
- Out:
  - redesign of the full note-detail layout
  - new share, bookmark, or bulk note-management features
  - tag-system redesign beyond follow-up idea capture

## Acceptance Contract

- The summary width reads as part of the same headline block as the note title.
- Hovering note-detail breadcrumbs shows clickable affordance and clicking category or collection returns to the corresponding archive list state.
- Clicking a rail item moves to and focuses the real section heading.
- Footer note navigation labels render as `Previous` and `Next`.
- The leftmost note-detail action uses the `content_copy` icon and copies the current note body without frontmatter.

## Likely Affected Surfaces

- [index.html](index.html)
- [archive/index.html](archive/index.html)
- [archive/note/index.html](archive/note/index.html)
- [assets/css/note-detail.css](assets/css/note-detail.css)
- [assets/js/index-note-detail.js](assets/js/index-note-detail.js)
- [assets/js/archive/content.js](assets/js/archive/content.js)
- [assets/js/icons.js](assets/js/icons.js)

## Continuity Notes

- `2026-04-19`: created after deferring route-render flash work to `prd-0008` so the current cycle can focus on note-detail polish.
- `2026-04-19`: closed directly at the PRD layer after implementation verification. No separate `feat` or `spec` execution logs were created for this cycle because the workflow boundary was already off from the start and the team chose to finish and record the outcome here.
