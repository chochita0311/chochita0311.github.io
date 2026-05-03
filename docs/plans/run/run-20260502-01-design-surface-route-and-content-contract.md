# Run: Design Surface Route And Content Contract

## Metadata

- ID: `run-20260502-01`
- Status: `passed`
- Feature: [feat-0028-design-surface-route-and-content-contract.md](../feature/feat-0028-design-surface-route-and-content-contract.md)
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Active Spec: [spec-0008-design-surface-route-and-content-contract.md](../spec/spec-0008-design-surface-route-and-content-contract.md)
- Surface: `mixed`
- Execution Profile: `foundation-contract`
- Required Evaluators: `contract`
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Goal

- Execute the approved route and specimen-card contract for the first-pass design surface.

## Selected Loop

- Feature type: `foundation`
- Surface: `mixed`
- Surface lanes:
  - route contract
  - specimen card contract
- Required evaluators:
  - `contract`
- Current phase: `passed`

## Contract Surfaces

- `/archive/design/`
- `ArchiveRoutes` design route helper and existing `archive-kind` parsing.
- Static specimen-card field shape.
- Sitemap generation for the new static route.

## Invocation Context

- Golden sources:
  - `tmp/design_card.html`
- Relevant policies:
  - [architecture.md](../../policies/project/architecture.md)
  - [prd-feature-management.md](../../policies/harness/prd-feature-management.md)
- Optional skills or tools expected:
  - none

## Current Artifacts

- Spec: [spec-0008-design-surface-route-and-content-contract.md](../spec/spec-0008-design-surface-route-and-content-contract.md)
- Contract evaluation:
- Design evaluation:
- Functional evaluation:
- UX heuristic evaluation:
- Fix log:
- Heuristic backlog:

## Current Route

- Next role: `human-review`
- Current blocker classification:
- In-run route: `completed`
- Post-run recommendation for human review:
  - accept `feat-0028` as passed

## Attempts

- Attempt 1:
  - status: `passed`
  - outcome:
    - `/archive/design/` implemented as the first-pass design route.
    - `ArchiveRoutes.buildDesignPath()` added while preserving existing archive-kind parsing.
    - `scripts/generate-sitemap.mjs` now emits `/archive/design/`.
    - architecture documentation now records the design entry, CSS, and JS ownership.
  - notes:
    - `/archive/design/` selected as the first-pass design surface route.

## Post-Contract Regression Check

- Needed: yes
- Result: passed
- Notes:
  - focused Prettier check passed on touched files.
  - `npm run lint:js` completed with warnings only; warnings are existing unused-symbol warnings outside the new design card module.

## Human Review Outcome

- Decision:
- Returned layer if any:
- Follow-up run:

## Continuity Notes

- `2026-05-02`: run initialized from approved `feat-0028` and `spec-0008`.
- `2026-05-02`: run passed after route, sitemap, and architecture contract updates landed.
