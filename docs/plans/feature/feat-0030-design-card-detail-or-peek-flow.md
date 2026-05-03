# FEAT-0030: Design Card Detail Or Peek Flow

## Metadata

- ID: `feat-0030`
- Status: `superseded`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Supersession Note

- This feature is not part of the active `PRD-0010` scope. It is retained only as historical planning context because the approved PRD boundary was narrowed to list handling only.

## Goal

- Product feature:
  - define and implement the first-pass way a focused design card exposes more information without requiring final design data injection.

## Acceptance Contract

- A focused design card has one clear way to expose more information.
- The first-pass model is chosen before implementation as one of:
  - inline quick-peek expansion
  - focused-card expansion within the canvas
  - detail route or detail panel
  - external link handoff for specimen cards that have an approved URL
- The chosen model preserves the rollable card browser's orientation.
- Opening and closing the additional information state does not reset the active card unexpectedly.
- The motion or transition starts from the focused card's current visual position where practical.
- Keyboard and screen-reader users can open, read, and close the additional information state.
- The feature does not require final design content storage or generated data.

## Scope Boundary

- In:
  - selecting the first-pass peek/detail model
  - focused-card open/close affordance
  - accessible open/close behavior
  - preserving active-card state
  - static specimen detail or peek copy where needed
  - responsive containment for the expanded state
- Out:
  - final design content model
  - full design case-study authoring system
  - note-detail route changes
  - broad modal or drawer redesign across the site
  - data injection or generated indexes

## Contract Surfaces

- Focused-card action affordance.
- Expanded/peek state ownership.
- Open/close behavior.
- Focus restoration after close.
- Optional static fields needed for peek content.

## Required Evaluators

- `design`: expanded state hierarchy, fit with design canvas, containment.
- `functional`: open/close behavior, focus restoration, active-card preservation.
- `ux-heuristic`: clarity of what opens, whether the user keeps orientation after closing.

## User-Visible Outcome

- The user can inspect more information about the active design card without losing their place in the rollable card list.

## Entry And Exit

- Entry point:
  - user focuses a design card on the design surface.
- Exit or transition behavior:
  - user returns to the same active card and card position after closing the peek/detail state.

## State Expectations

- Default:
  - focused card shows enough affordance to reveal more information.
- Loading:
  - not required for static specimen content.
- Empty:
  - if no extra specimen detail exists, the action should be absent rather than opening an empty panel.
- Error:
  - if an optional external link is unavailable, the card should not expose a broken action.
- Success:
  - extra information appears and closes predictably.

## Dependencies

- Approved parent PRD [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Prefer after `feat-0029-rollable-design-card-browse` creates the focused-card state model.
- May depend on `feat-0028-design-surface-route-and-content-contract` if static peek fields are part of the specimen-card shape.

## Likely Affected Surfaces

- [index.html](../../../index.html)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- Design-card frontend JavaScript created for `feat-0029`
- Future `archive/design/` entry file if selected

## Pass Or Fail Checks

- A focused card exposes one clear more-information action.
- The action is keyboard reachable.
- The expanded, peek, or handoff state is readable and contained.
- Closing the state returns focus and active-card position predictably.
- The active card is not reset by opening or closing the state.
- Missing optional detail/link data does not produce broken UI.

## Regression Surfaces

- Rollable design card browse state
- Topbar and canvas mode
- Existing note-detail route and reading surface
- Existing modal, drawer, or action styles if reused

## Harness Trace

- Active spec doc:
- Active run:
- Execution profile: `frontend-product`
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-05-02`: initial draft created from approved PRD-0010.
- `2026-05-02`: superseded after human clarification that PRD-0010 is focused only on list handling; card detail, quick-peek, expansion, and external-link handoff behavior are out of current scope.
