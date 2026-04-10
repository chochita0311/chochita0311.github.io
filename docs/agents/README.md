# Agent Roles

## Purpose
- Keep reusable role definitions for iterative harness work in one editable package.
- Draft and refine the role contracts here before promoting them into shared assets.
- Keep these role docs general-purpose unless a file is explicitly marked repo-local.

## Current Roles
- `docs/agents/prd-normalizer.md`: normalize chaotic product inputs into a bounded PRD package
- `docs/agents/feature-planner.md`: decompose a normalized PRD into loop-sized feature units
- `docs/agents/workflow.md`: define the baton flow and approval points between roles

## Packaging Rule
- Treat `docs/agents/` as the working copy for role definitions being developed in this repo.
- Promote stable general-purpose role docs into `../ai-assets/agents/`.
- Keep repo-specific operating rules in `AGENTS.md` or `docs/policies/`; do not hide them inside reusable role definitions.
