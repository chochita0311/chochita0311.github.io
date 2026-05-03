# SPEC-0008: Design Surface Route And Content Contract

## Metadata

- ID: `spec-0008`
- Status: `approved`
- Run ID: `run-20260502-01`
- Attempt: `1`
- Parent Feature: [feat-0028-design-surface-route-and-content-contract.md](../feature/feat-0028-design-surface-route-and-content-contract.md)
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Surface: `mixed`
- Execution Profile: `foundation-contract`
- Surface Lane: `route-and-specimen-contract`
- Required Evaluators: `contract`
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Source Set

- Human request:
  - run `feat-0028` and `feat-0029`
  - first pass should use the sample card as static specimen content, not data injection
- Parent feature:
  - [feat-0028-design-surface-route-and-content-contract.md](../feature/feat-0028-design-surface-route-and-content-contract.md)
- Parent PRD:
  - [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Golden sources:
  - `tmp/design_card.html`
- Relevant policies or contracts:
  - [architecture.md](../../policies/project/architecture.md)
  - [prd-feature-management.md](../../policies/harness/prd-feature-management.md)
  - [traceability-and-link-hygiene.md](../../policies/harness/traceability-and-link-hygiene.md)

## Implementation Goal

- Lock the first-pass `Design` route and specimen-card contract for the rollable card browser.

## In-Scope Behavior

- Select `/archive/design/` as the first-pass design surface route.
- Add a static entry file for `/archive/design/`.
- Treat 20 hard-coded specimen cards as prototype interaction content.
- Defer dynamic data injection, generated design indexes, Markdown-derived design content, and durable design item storage.
- Add route helper support for `/archive/design/` if needed by runtime consumers.
- Keep the design route compatible with the existing `archive-kind` parser behavior.
- Update route or architecture documentation that becomes stale because `/archive/design/` now exists.

## Out-Of-Scope Behavior

- Topbar `Design` click handoff from existing pages.
- Sidebar fade or canvas transition from note archive surfaces.
- Rollable card animation.
- Dynamic data pipeline for design items.
- Card detail, quick-peek, expansion, or external-link handoff behavior.

## Affected Surfaces

- [archive/design/index.html](../../../archive/design/index.html)
- [assets/js/archive/route.js](../../../assets/js/archive/route.js)
- [scripts/generate-sitemap.mjs](../../../scripts/generate-sitemap.mjs)
- [docs/policies/project/architecture.md](../../policies/project/architecture.md)
- [docs/plans/feature/feat-0028-design-surface-route-and-content-contract.md](../feature/feat-0028-design-surface-route-and-content-contract.md)

## Surface Lanes

- Lane: route contract
  - path roots:
    - `archive/design/`
    - `assets/js/archive/route.js`
    - `scripts/generate-sitemap.mjs`
  - dependency order:
    - choose route, then expose it in page and helper contracts
  - implementation responsibility:
    - make `/archive/design/` an explicit static route
  - validation evidence:
    - direct route opens and sitemap generator includes it
- Lane: specimen contract
  - path roots:
    - `tmp/design_card.html`
    - design-card frontend assets from `feat-0029`
  - dependency order:
    - required fields must exist before rendering 20 cards
  - implementation responsibility:
    - hard-coded specimen cards remain prototype content
  - validation evidence:
    - no generated design data required

## State And Interaction Contract

- `/archive/design/` is the first-pass design surface entry.
- Existing `/`, `/archive/`, and `/archive/note/` ownership remains unchanged.
- `ArchiveRoutes.parsePathname("/archive/design/")` continues to parse as `archive-kind` with `archiveKind: "design"`.
- Specimen cards are static frontend content for this feature track.

## Data And Contract Assumptions

- The first-pass specimen shape has these required fields:
  - `id`
  - `title`
  - `summary`
  - `category`
  - `updated`
  - `stage`
  - `complexity`
  - `previewSrc`
  - `previewAlt`
- Optional first-pass field:
  - `tags`
- No generated artifact is a source of truth for design cards in this pass.

## Contract Surfaces

- Producer expectations:
  - the design-card module provides 20 specimen entries directly in frontend code.
- Consumer expectations:
  - the design-card renderer consumes the hard-coded fields above.
- Generated artifacts:
  - `sitemap.xml` remains generated from `scripts/generate-sitemap.mjs`; `/archive/design/` should be included by the generator.
- Source-of-truth owner:
  - this spec and `feat-0028` own the first-pass route/specimen contract.
- Stale-assumption check:
  - architecture docs and sitemap generator must not claim only note archive routes exist under `archive/`.

## Required Evaluators

- Contract:
  - verify route ownership, static specimen shape, and deferred data boundary.
- Design:
  - not required for this foundation feature.
- Functional:
  - not required beyond direct route existence and generator smoke.
- UX heuristic:
  - not required for this foundation feature.

## Acceptance Mapping

- First-pass route chosen:
  - `/archive/design/`
- Route compatibility:
  - existing archive-kind parser path remains compatible.
- Static content contract:
  - 20 hard-coded specimen cards with required fields.
- Deferred data:
  - no design index, Markdown importer, or generated design data.
- Replaceability:
  - static specimen shape is simple and can later be replaced by a durable source.

## Evaluation Focus

- Contract evaluator should inspect whether downstream `feat-0029` can proceed without guessing route, card fields, or data ownership.

## Open Blockers

- None.

## Continuity Notes

- `2026-05-02`: initial spec created for approved `feat-0028`.
