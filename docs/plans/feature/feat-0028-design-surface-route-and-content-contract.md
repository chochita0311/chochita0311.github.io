# FEAT-0028: Design Surface Route And Content Contract

## Metadata

- ID: `feat-0028`
- Status: `passed`
- Type: `foundation`
- Surface: `mixed`
- Execution Profile: `foundation-contract`
- Required Evaluators: `contract`
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Goal

- Foundation feature:
  - define the first-pass `Design` surface contract so downstream implementation does not need to guess the route, static specimen-card shape, or deferred data-injection boundary.

## Acceptance Contract

- The first-pass `Design` entry route is selected and documented.
- The route decision stays compatible with the archive-kind model from `prd-0006`, or records why a lighter in-page state is preferred for the first pass.
- The first implementation content model is fixed to 20 static specimen cards based on the centered card in `tmp/design_card.html`.
- The static specimen-card shape defines required and optional fields enough for `feat-0029` to render cards without inventing data ownership.
- Dynamic data injection, generated design indexes, Markdown-derived design content, and permanent design storage are explicitly deferred.
- Future replacement of the static specimen set remains possible without changing the user-visible card interaction.

## Scope Boundary

- In:
  - canonical or first-pass `Design` surface route decision
  - first-pass static specimen-card field contract
  - source-of-truth note that the 20 specimen cards are prototype interaction content
  - deferred-data boundary for future design content work
  - any documentation updates needed to make the contract traceable
- Out:
  - implementing the topbar click behavior
  - implementing the sidebar fade or canvas expansion
  - implementing the rollable card animation
  - building dynamic data injection
  - creating generated design indexes or Markdown import flows
  - finalizing the full design content inventory

## Surface Lanes

- Lane: route and shell contract
  - path roots:
    - `index.html`
    - `archive/`
    - future `archive/design/` if chosen
    - `assets/js/archive/route.js`
  - dependencies:
    - approved parent PRD
  - expected evidence:
    - route ownership written in this feature/spec or adjacent policy docs
  - evaluator ownership:
    - contract
- Lane: specimen card contract
  - path roots:
    - `tmp/design_card.html`
    - future frontend module or static card list selected by spec
  - dependencies:
    - approved parent PRD
  - expected evidence:
    - required and optional specimen-card fields are listed
  - evaluator ownership:
    - contract

## Contract Surfaces

- `Design` topbar destination route or state.
- First-pass static card list ownership.
- Required specimen fields:
  - stable id
  - title
  - summary or description
  - category or type label
  - updated/date label
  - stage label
  - complexity label
  - preview image source or placeholder strategy
  - preview image alt text
- Optional specimen fields:
  - tags
  - visual accent metadata

## User-Visible Outcome

- Optional for this foundation feature. The downstream visible outcome is that `Design` can load a stable first-pass surface without waiting for a final content pipeline.

## Entry And Exit

- Entry point:
  - planning starts from approved `prd-0010`.
- Exit or transition behavior:
  - downstream feature planning can proceed with a known route and specimen-card shape.

## State Expectations

- Default:
  - first-pass `Design` content is represented by 20 static specimen cards.
- Loading:
  - no dynamic loading contract is required for specimen cards.
- Empty:
  - not applicable to the first-pass hard-coded specimen set.
- Error:
  - no generated-data error state is required for the first pass.
- Success:
  - route and card-shape ownership are explicit.

## Dependencies

- Approved parent PRD [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)

## Likely Affected Surfaces

- [docs/plans/prd/prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- [docs/policies/project/architecture.md](../../policies/project/architecture.md)
- [docs/policies/design/design-constitution.md](../../policies/design/design-constitution.md), only if the route or data decision becomes durable design law
- [index.html](../../../index.html)
- [assets/js/archive/route.js](../../../assets/js/archive/route.js)
- Future `archive/design/` entry file if selected

## Pass Or Fail Checks

- A single first-pass route or entry state is chosen for `Design`.
- The chosen route or state does not conflict with the existing note archive route model.
- The static 20-card specimen approach is clearly documented as prototype interaction content.
- Required specimen-card fields are listed and sufficient for card rendering.
- Dynamic data injection is not required by any downstream first-pass feature.
- No generated design-data artifact is treated as required before `feat-0029`.

## Regression Surfaces

- Existing `/`, `/archive/`, and `/archive/note/` route ownership
- Topbar route assumptions
- Note archive generated-data contract
- GitHub Pages static hosting compatibility

## Harness Trace

- Active spec doc: [spec-0008-design-surface-route-and-content-contract.md](../spec/spec-0008-design-surface-route-and-content-contract.md)
- Active run: [run-20260502-01-design-surface-route-and-content-contract.md](../run/run-20260502-01-design-surface-route-and-content-contract.md)
- Execution profile: `foundation-contract`
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-05-02`: initial draft created from approved PRD-0010.
- `2026-05-02`: approved by the human owner as written for downstream spec planning.
- `2026-05-02`: narrowed optional specimen fields after human clarification that PRD-0010 should focus only on list handling, not card detail, quick-peek, expansion, or external-link handoff behavior.
- `2026-05-02`: passed after `/archive/design/` was selected and implemented as the first-pass route, static specimen-card ownership was fixed, sitemap generation included the route, and dynamic data injection remained deferred.
