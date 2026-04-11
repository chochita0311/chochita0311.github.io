# Agent Roles

## Purpose
- Keep reusable role definitions for iterative harness work in one editable package.
- Draft and refine the role contracts here before promoting them into shared assets.
- Keep these role docs general-purpose unless a file is explicitly marked repo-local.

## Current Roles
- `docs/agents/prd-normalizer.md`: normalize chaotic product inputs into a bounded PRD package
- `docs/agents/feature-planner.md`: decompose a normalized PRD into loop-sized product and foundation features
- `docs/agents/workflow.md`: define the baton flow and approval points between roles

## Related Local Docs
- `docs/policies/project/prd-feature-management.md`: planning-governance rule for PRDs, features, approval, and traceability
- `docs/plans/prd/template-prd.md`: local PRD template for bounded planning documents
- `docs/plans/feature/template-feature.md`: local feature template for product and foundation features

## Planning Artifact Placement
- Store bounded PRD instances under `docs/plans/prd/`.
- Store loop-sized feature instances under `docs/plans/feature/`.
- Keep the rules for those artifacts in `docs/policies/project/prd-feature-management.md` instead of repeating them in folder README files.

## Workflow Variation
- Treat `docs/agents/workflow.md` as a strong default example, not the only valid orchestration shape.
- This repo may use smaller or larger workflows from the same role set depending on product scope, stack shape, and approval needs.
- When the workflow expands, keep the role contracts stable and add variation through sequencing rather than rewriting every role.

## Packaging Rule
- Treat `docs/agents/` as the working copy for role definitions being developed in this repo.
- Promote stable general-purpose role docs into `../ai-assets/agents/`.
- Keep repo-specific operating rules in `AGENTS.md` or `docs/policies/`; do not hide them inside reusable role definitions.
