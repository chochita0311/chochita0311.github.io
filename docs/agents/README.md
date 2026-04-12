# Agent Package

## Purpose
- Keep reusable agent docs for iterative harness work in one editable package.
- Separate role contracts from flow and operation docs so the package can grow into multiple workflows.
- Draft and refine these docs here before promoting stable versions into shared assets.

## Role Package
### Planning Roles
- `docs/agents/role/prd-normalizer.md`: normalize chaotic product inputs into a bounded PRD package
- `docs/agents/role/feature-planner.md`: decompose a normalized PRD into loop-sized product and foundation features

### Execution Roles
- `docs/agents/role/orchestrator.md`: control one bounded execution loop and route failures to the right layer
- `docs/agents/role/spec-agent.md`: translate one approved feature into an implementation-facing spec
- `docs/agents/role/builder.md`: implement one approved spec without expanding scope
- `docs/agents/role/design-evaluator.md`: evaluate visual and design-surface correctness against sources and spec
- `docs/agents/role/functional-evaluator.md`: evaluate behavioral correctness, state handling, and regressions
- `docs/agents/role/ux-heuristic-evaluator.md`: evaluate interaction clarity and friction without inventing new scope
- `docs/agents/role/fix-agent.md`: apply targeted corrections from approved evaluator findings

## Flow Package
- `docs/agents/flow/workflow.md`: define baton flow, stop points, and role composition options

## Operation Package
- `docs/agents/operation/runner.md`: define how a human or harness starts and continues one run using prompts

## Related Local Docs
- `docs/policies/harness/prd-feature-management.md`: planning-governance rule for PRDs, features, approval, and traceability
- `docs/policies/harness/execution-loop-governance.md`: execution-loop rules, fail classification, routing, and artifact ownership
- `docs/plans/prd/template-prd.md`: local PRD template for bounded planning documents
- `docs/plans/feature/template-feature.md`: local feature template for product and foundation features
- `docs/plans/spec/template-spec.md`: local spec template for one approved execution target
- `docs/plans/run/template-run.md`: local run template for one active execution pass

## Planning Artifact Placement
- Store bounded PRD instances under `docs/plans/prd/`.
- Store loop-sized feature instances under `docs/plans/feature/`.
- Store implementation-facing spec instances under `docs/plans/spec/`.
- Store run records under `docs/plans/run/`.
- Store evaluator reports under `docs/plans/evaluation/`.
- Store fix logs under `docs/plans/fix/`.
- Store heuristic backlog records under `docs/plans/heuristic/`.
- Keep the rules for those artifacts in `docs/policies/harness/prd-feature-management.md` instead of repeating them in folder README files.

## Workflow Variation
- Treat `docs/agents/flow/workflow.md` as a strong default example, not the only valid orchestration shape.
- This repo may use smaller or larger workflows from the same role set depending on product scope, stack shape, and approval needs.
- When the workflow expands, keep the role contracts stable and add new flow docs through composition rather than rewriting every role.

## Local Invocation
- Initialize one execution pass from the approved feature document and the runner guide.
- Treat the runner guide as the ordered prompt source for the current execution pass instead of generating runtime scaffolding files automatically.

## Packaging Rule
- Treat `docs/agents/` as the working copy for role, flow, and operation docs being developed in this repo.
- Promote stable general-purpose role docs into `../ai-assets/agents/`.
- Keep repo-specific operating rules in `AGENTS.md` or `docs/policies/`; do not hide them inside reusable role definitions.
