# SPEC-0009: Rollable Design Card Browse

## Metadata

- ID: `spec-0009`
- Status: `approved`
- Run ID: `run-20260502-02`
- Attempt: `1`
- Parent Feature: [feat-0029-rollable-design-card-browse.md](../feature/feat-0029-rollable-design-card-browse.md)
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Surface Lane: `design-card-browser`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Source Set

- Human request:
  - run `feat-0028` and `feat-0029`
  - use the centered card from `tmp/design_card.html` as the specimen
  - use 20 static cards
  - use orbital slide, not pure slide or free orbit
- Parent feature:
  - [feat-0029-rollable-design-card-browse.md](../feature/feat-0029-rollable-design-card-browse.md)
- Parent PRD:
  - [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Golden sources:
  - `tmp/design_card.html`
- Relevant policies or contracts:
  - [design-constitution.md](../../policies/design/design-constitution.md)
  - [interaction-evaluation.md](../../policies/experience/interaction-evaluation.md)
  - [spec-0008-design-surface-route-and-content-contract.md](spec-0008-design-surface-route-and-content-contract.md)

## Implementation Goal

- Build a first-pass `/archive/design/` card browser with 20 static specimen cards and a golden-ratio-informed orbital slide interaction.

## In-Scope Behavior

- Render 20 static design cards.
- Show one active foreground card with readable title, metadata, preview, summary, and tags.
- Show previous and next context cards on a shallow curved/elliptical path.
- Use finite list boundaries with disabled unavailable controls at the first and last card.
- Support previous/next buttons.
- Support keyboard arrow navigation when focus is within the design stage.
- Support wheel advancement with one-card snapping and throttling.
- Support pointer drag and touch swipe release to advance one card.
- Use reduced-motion behavior that changes focus without rolling travel.
- Keep text contained at desktop, tablet, and mobile widths.

## Out-Of-Scope Behavior

- Dynamic data injection.
- Generated design index.
- Sidebar fade/canvas handoff from topbar `Design` on existing pages.
- Card detail, quick-peek, expansion, or external-link handoff behavior.
- Replacing note archive list/grid behavior.

## Affected Surfaces

- [archive/design/index.html](../../../archive/design/index.html)
- [assets/css/app.css](../../../assets/css/app.css)
- [assets/css/design.css](../../../assets/css/design.css)
- [assets/js/design-cards.js](../../../assets/js/design-cards.js)
- [assets/js/archive/route.js](../../../assets/js/archive/route.js)

## State And Interaction Contract

- Default:
  - card `1` is active.
- Active state:
  - foreground card uses `1.0` scale and full metadata.
- Adjacent state:
  - near cards use about `0.82` scale and remain visually secondary.
- Secondary state:
  - far cards use about `0.68` scale and are muted.
- Offstage state:
  - hidden cards do not dominate or receive interaction.
- Movement:
  - one discrete input moves by one card.
  - cards travel through shallow curved positions.
  - no free spin, bounce, or uncontrolled momentum.

## Data And Contract Assumptions

- `feat-0028` owns the specimen field shape.
- The first-pass data source is a static array in the frontend module.
- `assets/og-cheetah.jpg` may be used as the repeated placeholder image source for all specimen cards.

## Contract Surfaces

- Producer expectations:
  - `assets/js/design-cards.js` owns static card rendering and interaction.
- Consumer expectations:
  - `/archive/design/` loads the design CSS and JS module.
- Generated artifacts:
  - none for card data.
- Source-of-truth owner:
  - `feat-0029` owns first-pass visible card behavior.
- Stale-assumption check:
  - no code should expect dynamic design data before a future feature creates that contract.

## Required Evaluators

- Contract:
  - covered by `spec-0008`.
- Design:
  - inspect hierarchy, golden-ratio composition, visual fit, and responsive containment.
- Functional:
  - inspect controls, keyboard, wheel, pointer drag, touch swipe, boundaries, and reduced motion.
- UX heuristic:
  - inspect browse orientation and whether the orbital slide is playful without becoming disorienting.

## Acceptance Mapping

- 20 static cards:
  - render 20 cards from frontend specimen data.
- Dominant active card:
  - active card class/state is visually foregrounded.
- Context cards:
  - previous/next card states remain visible.
- Golden-ratio hierarchy:
  - stage uses a dominant active card with smaller context track.
- Orbital slide:
  - relative-index classes position cards on a curved path.
- Input support:
  - buttons, arrows, wheel, drag, and swipe all move by one card.
- Reduced motion:
  - transform duration is effectively removed while focus changes remain available.
- Responsive containment:
  - desktop and mobile layouts avoid text clipping and overlap.

## Evaluation Focus

- Design evaluation should focus on whether the surface looks like a curated design archive, not a generic carousel.
- Functional evaluation should focus on finite boundaries and one-card snap behavior.
- UX evaluation should focus on whether the user understands current position and next/previous affordances.

## Open Blockers

- None.

## Continuity Notes

- `2026-05-02`: initial spec created for approved `feat-0029`.
