# FEAT-0006: Archive Hero And List Boundary Cleanup

## Metadata

- ID: `feat-0006`
- Status: `draft`
- Type: `product`
- Parent PRD: [prd-0003-archive-list-density-and-footer-separator-cleanup.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0003-archive-list-density-and-footer-separator-cleanup.md)
- Created: `2026-04-18`
- Updated: `2026-04-18`

## Goal

- Product feature:
  - remove the archive hero copy block, tighten the list-view rhythm, clean up the footer boundary, and park the removed hero-copy config in `./stale/` while keeping the active archive browse flow unchanged

## Acceptance Contract

- The archive list screen no longer renders the current hero title and summary block.
- The top archive control area keeps only the page-size dropdown and the list-grid toggle.
- The archive hero wrapper no longer carries redundant structural markup that only existed to hold removed hero copy.
- In list view, note cards render with tighter vertical spacing than the current implementation.
- The bottom of the paginated list presents a single clean divider treatment between the final visible note card and the archive footer.
- The final visible list card does not create a doubled separator with the archive footer.
- `assets/generated/archives-index.json` remains in its active runtime location.
- `scripts/generate-archives-index.mjs` remains in its active runtime location.
- `assets/config/archive-descriptions.json` no longer lives in its former active location.
- `stale/stale.md` exists and briefly explains why the parked hero-copy config was moved and how it may be useful for future restore work.

## Scope Boundary

- In:
  - archive hero copy removal
  - archive hero wrapper simplification
  - list-view spacing reduction
  - final-card versus footer separator cleanup
  - relocation of `assets/config/archive-descriptions.json` into `./stale/`
  - creation of `stale/stale.md`
  - runtime and documentation updates directly required by removal of the hero-copy config
- Out:
  - grid-view layout redesign
  - page-size interaction redesign
  - list-grid toggle behavior redesign
  - general stale-file audit outside the explicitly named hero-copy config
  - replacing the active `archives-index.json` runtime path or generator ownership

## User-Visible Outcome

- Users see a cleaner archive list surface with only the top controls, tighter list spacing, and a single clean boundary above the pagination footer instead of the current stacked-divider effect.

## Entry And Exit

- Entry point:
  - user lands on the archive list screen in the main shell
- Exit or transition behavior:
  - user remains in the same archive list surface with the same page-size and view-toggle controls, but without the prior hero copy block and without the doubled footer divider treatment

## State Expectations

- Default:
  - archive list opens without the current hero title and summary block
  - page-size and view-toggle controls remain available
- Loading:
  - archive list initializes without a broken top gap or orphaned hero wrapper space
- Empty:
  - empty archive states still render coherently without depending on the removed hero copy block
- Error:
  - if the archive browse-index relocation requires runtime replacement, the resulting path must fail in a bounded and intentional way rather than leaving the archive shell half-rendered
- Success:
  - archive list spacing is tighter, the footer boundary reads cleanly, the hero-copy config is parked in `stale/`, and the browse flow still works through the active note index

## Dependencies

- Parent PRD [prd-0003-archive-list-density-and-footer-separator-cleanup.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0003-archive-list-density-and-footer-separator-cleanup.md)
- Current archive shell in [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- Current archive styles in [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css) and [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- Current archive browse runtime in [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js) and [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- Current generated archive browse artifact in [archives-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-index.json)
- Current generator script in [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- Removed hero-copy config formerly in [archive-descriptions.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/config/archive-descriptions.json)

## Likely Affected Surfaces

- [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
- [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
- [components.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/components.css)
- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
- [sidebar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/sidebar.js)
- [topbar.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/topbar.js)
- [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
- [developer-guide.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/developer-guide.md)
- [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)
- `stale/`

## Pass Or Fail Checks

- The archive list screen no longer renders the current `Recent Archives` title and summary block.
- The archive top area shows only the page-size dropdown and the list-grid toggle.
- No redundant wrapper remains whose only purpose was to host removed hero copy.
- In list mode, the visual gap between consecutive note cards is smaller than before the feature.
- Intermediate list cards still keep intentional separation.
- The last visible list card does not produce a doubled line with the archive footer.
- The archive footer still presents one clear boundary above pagination and credit content.
- `assets/generated/archives-index.json` is still the active browse index path.
- `scripts/generate-archives-index.mjs` is still the active generator path.
- `assets/config/archive-descriptions.json` is absent from its former active path.
- `stale/stale.md` exists and mentions future restore or reuse of the removed hero-copy config.

## Regression Surfaces

- Archive page-size control
- Archive list-grid toggle
- Archive pagination footer
- Sidebar category initialization
- Topbar category initialization
- Archive note rendering
- Static GitHub Pages compatibility

## Harness Trace

- Active spec doc:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-18`: initial draft created from approved PRD-0003
- `2026-04-18`: corrected after implementation review so the feature keeps `archives-index.json` and `generate-archives-index.mjs` active and only parks the removed hero-copy config in `stale/`
