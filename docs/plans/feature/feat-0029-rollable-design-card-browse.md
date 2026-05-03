# FEAT-0029: Rollable Design Card Browse

## Metadata

- ID: `feat-0029`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Goal

- Product feature:
  - implement a first-pass rollable `Design` card browser using 20 static specimen cards from `tmp/design_card.html`, with a golden-ratio-informed orbital slide motion model.

## Acceptance Contract

- The `Design` surface renders 20 static specimen cards based on the centered card structure from `tmp/design_card.html`.
- One card is clearly active and visually dominant.
- Nearby previous and next cards remain visible as contextual cards without competing with the focused card.
- The layout follows the golden focus reel direction:
  - focused card owns roughly `61.8%` of visual stage weight or width where practical
  - context and index cards occupy the remaining visual balance
  - depth uses scale states close to `1.0`, `0.82`, `0.68`, and muted offstage treatment
- Card movement uses the orbital slide model:
  - one input changes focus by one card
  - cards move along a shallow curved or elliptical path
  - the interaction snaps to a stable active card
  - no free spin, bounce, or uncontrolled momentum appears
- Keyboard, pointer, wheel, drag, and touch or swipe behavior are supported where practical.
- Reduced-motion mode preserves functionality and layout hierarchy without rolling travel.
- Text and card contents remain contained across desktop and mobile widths.

## Scope Boundary

- In:
  - 20 static specimen cards
  - centered active-card stage
  - adjacent context cards
  - orbital slide transforms and snap behavior
  - next/previous controls or equivalent accessible controls
  - keyboard arrow navigation
  - wheel, drag, and swipe handling where practical
  - reduced-motion behavior
  - responsive containment
- Out:
  - dynamic data injection
  - generated design index
  - full card detail page
  - final design content inventory
  - global sidebar removal
  - note archive list/grid redesign
  - replacing the whole site with the sample page's visual theme

## Contract Surfaces

- Card state classes or equivalent state attributes for:
  - active
  - adjacent
  - secondary
  - hidden/offstage
- Input behavior:
  - next
  - previous
  - arrow key navigation
  - pointer drag release
  - wheel or swipe advancement
- Reduced-motion behavior through `prefers-reduced-motion`.

## Required Evaluators

- `design`: card hierarchy, golden-ratio composition, responsive containment, visual fit with existing design system.
- `functional`: controls, keyboard navigation, snap behavior, finite list boundaries, reduced-motion behavior.
- `ux-heuristic`: orientation, browse clarity, interaction predictability, friction from motion.

## User-Visible Outcome

- The user can browse a playful but ordered design-card list where cards roll into focus through a curved orbital slide motion.

## Entry And Exit

- Entry point:
  - user is on the first-pass `Design` surface.
- Exit or transition behavior:
  - the active card can change through controls or gestures; card detail, quick-peek, expansion, and external-link handoff behavior are out of scope.

## State Expectations

- Default:
  - first card or selected card is active, with adjacent cards visible.
- Loading:
  - not required for hard-coded specimen content.
- Empty:
  - not required for the first 20-card specimen set.
- Error:
  - card controls fail gracefully and do not trap focus if a browser lacks an optional gesture API.
- Success:
  - user can move through the finite card set and always identify the active card.

## Dependencies

- Approved parent PRD [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Prefer after `feat-0028-design-surface-route-and-content-contract` defines the first-pass surface and specimen-card shape.
- Coordinate with `feat-0031-design-tab-canvas-shell-handoff` if the card browser needs the reclaimed sidebar canvas during implementation.

## Likely Affected Surfaces

- [index.html](../../../index.html)
- [assets/css/tokens.css](../../../assets/css/tokens.css)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- [assets/css/components.css](../../../assets/css/components.css)
- New or existing frontend JavaScript for the design-card surface
- Future `archive/design/` entry file if selected

## Pass Or Fail Checks

- 20 static specimen cards render on the design surface.
- The active card is visually dominant and stable after each interaction.
- Previous and next context cards remain visible without overlap or clipping.
- Next and previous movement changes focus by exactly one card.
- First and last cards enforce finite boundaries or visibly disable unavailable movement.
- Keyboard navigation works.
- Pointer or gesture navigation works where supported.
- Reduced-motion mode removes or minimizes rolling travel while preserving card focus changes.
- Card text does not overflow, overlap, or become unreadable on supported breakpoints.

## Regression Surfaces

- Current archive note list and grid views
- Topbar layout
- Sidebar layout when not in design canvas mode
- Landing entry route and archive route behavior
- Material Symbols icon loading and existing CSS token usage

## Harness Trace

- Active spec doc: [spec-0009-rollable-design-card-browse.md](../spec/spec-0009-rollable-design-card-browse.md)
- Active run: [run-20260502-02-rollable-design-card-browse.md](../run/run-20260502-02-rollable-design-card-browse.md)
- Execution profile: `frontend-product`
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-05-02`: initial draft created from approved PRD-0010.
- `2026-05-02`: approved by the human owner as written for downstream spec planning.
- `2026-05-02`: clarified after human direction that this feature owns list handling only and must not depend on card detail or quick-peek behavior.
- `2026-05-02`: passed after `/archive/design/` rendered 20 static specimen cards with active/context states, finite previous/next boundaries, keyboard navigation, pointer/wheel interaction, reduced-motion support, and desktop/mobile browser smoke checks.
