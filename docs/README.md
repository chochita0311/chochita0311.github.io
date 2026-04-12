# Docs Map

This directory holds the repository's durable policy docs and active planning artifacts.

## What Lives Here

- `docs/agents/`: agent package under active refinement, split into role, flow, and operation docs
- `docs/policies/`: durable rules, definitions, contracts, guides, and governance docs
- `docs/plans/`: active or historical planning tracks, execution plans, and refactoring work

## Package Guide

- `docs/agents/role/`: general-purpose harness role docs for planning, spec, build, evaluation, and fix loops
- `docs/agents/flow/`: sequence and baton-flow docs that compose roles into workflows
- `docs/agents/operation/`: run-start and run-continuation invocation docs
- `docs/policies/project/`: project/runtime policy, architecture, and workflow rules
- `docs/policies/harness/execution-loop-governance.md`: execution-loop rules, fail routing, and execution artifact ownership
- `docs/policies/design/`: durable design rules, reusable design-evaluation assets, and design-document governance
- `docs/policies/experience/`: reusable interaction-quality evaluation assets
- `docs/policies/content/`: content contracts, note schemas, and rendering rules
- `docs/policies/system/`: cross-cutting shared system policy such as icon governance
- `docs/policies/harness/prd-feature-management.md`: durable planning-governance rule for PRD and feature traceability
- `docs/plans/prd/`: bounded PRD documents and PRD template
- `docs/plans/feature/`: loop-sized feature documents and feature template
- `docs/plans/spec/`: implementation-facing spec documents and spec template
- `docs/plans/run/`: active run records and run template
- `docs/plans/evaluation/`: evaluator reports for active or historical execution loops
- `docs/plans/fix/`: fix logs tied to evaluator findings
- `docs/plans/heuristic/`: heuristic suggestion backlog records
- `docs/plans/project/`: project direction and roadmap planning
- `docs/plans/design/`: active design sequencing and open design decisions
- `docs/plans/refactoring/`: refactor tracks, inventories, and implementation plans

## How To Navigate

- Start with `README.md` for overview and local usage.
- Use `docs/agents/` when you are refining reusable agent packages and execution docs.
- Use `docs/agents/operation/runner.md` when you need execution startup prompts and run-continuation rules.
- Use `docs/policies/` when you need source-of-truth rules.
- Use `docs/policies/harness/prd-feature-management.md` when you need the operating rules for PRD and feature traceability.
- Use `docs/policies/harness/execution-loop-governance.md` when you need execution-loop routing, fail classification, heuristic handling, or the explicit return model for local fix, return-to-spec, return-to-planning, and re-entry.
- Use `docs/policies/experience/interaction-evaluation.md` when you need reusable rules for transition stability, navigation continuity, or interaction-quality review.
- Use `docs/plans/prd/` for upper-boundary planning documents.
- Use `docs/plans/feature/` for loop-sized execution targets.
- Use `docs/plans/spec/` for implementation-facing specs derived from approved features.
- Use `docs/plans/run/` for active run records tied to one execution pass.
- Use `docs/plans/evaluation/`, `docs/plans/fix/`, and `docs/plans/heuristic/` for execution trace artifacts.
- Use `docs/plans/` when you need active work context, sequencing, or historical implementation tracks.
