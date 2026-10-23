# Agent Package

## Purpose
- Keep local reusable agent docs for iterative harness work in one repo-owned package.
- Separate role contracts from flow, operation, and profile docs so workflow variants can compose from the same role set.
- Keep these docs aligned with the shared source package while preserving repo-specific rules in `AGENTS.md` and `docs/policies/`.

## Import Baseline

- The [harness import manifest](harness-import-manifest.json) records the accepted committed source, mapping version, and per-file source/rendered hashes for all 43 selected harness-origin files.
- Ownership is `managed` for 33 shared files and `local` for 10 files with intentional consumer wording. These ten files require explicit ownership review for later upstream changes.
- Before refreshing a `managed` file, compare its current bytes with the manifest's `rendered_sha256`; resolve a mismatch before replacing it. Advance its source revision, mapping version and both hashes together only after an accepted refresh.
- Preserve `local` files and their recorded source revision, mapping version and both detachment hashes during ordinary refresh. Rebase or reattach them only through an explicit ownership decision.
- Keep repository entrance docs, product artifacts and private experience with their existing local owners. Save the manifest only after the selected content, ownership, provenance and links pass validation.

## Roles Package
### Planning Roles
- `docs/agents/roles/prd-normalizer.md`: normalize chaotic product inputs into a bounded PRD package
- `docs/agents/roles/feature-planner.md`: decompose a normalized PRD into loop-sized product and foundation features

### Execution Roles
- `docs/agents/roles/orchestrator.md`: control one bounded execution loop, select the execution profile, and route failures to the right layer
- `docs/agents/roles/spec-agent.md`: translate one approved feature into an implementation-facing spec
- `docs/agents/roles/builder.md`: implement one approved spec without expanding scope
- `docs/agents/roles/contract-evaluator.md`: evaluate APIs, schemas, generated artifacts, source-of-truth ownership, and integration boundaries
- `docs/agents/roles/design-evaluator.md`: evaluate visual and design-surface correctness against sources and spec
- `docs/agents/roles/functional-evaluator.md`: evaluate runtime behavior, state handling, workflows, and regressions
- `docs/agents/roles/ux-heuristic-evaluator.md`: evaluate interaction clarity and friction without inventing new scope
- `docs/agents/roles/fix-agent.md`: apply targeted corrections from approved evaluator findings

## Flows Package
- `docs/agents/flows/workflow.md`: define baton flow, stop points, and role composition options

## Operations Package
- `docs/agents/operations/runner.md`: define how a human or harness starts and continues one run using prompts

- [Harness Improvement](operations/harness-improvement.md): configured stage entry/closing, bounded investigation and authorized common export

## Profiles Package
- `docs/agents/profiles/README.md`: explain reusable execution profiles
- `docs/agents/profiles/frontend-product.md`: user-facing screen, route, component, and interaction work
- `docs/agents/profiles/backend-product.md`: service, API, job, command, persistence, and message behavior work
- `docs/agents/profiles/fullstack-product.md`: coordinated multi-surface product work
- `docs/agents/profiles/foundation-contract.md`: contract, invariant, ownership, identity, and generated-output foundation work
- `docs/agents/profiles/infra-devtool.md`: infrastructure, tooling, scripts, CI, and local workflow work
- `docs/agents/profiles/docs-content.md`: documentation, content, policy, guide, and information-architecture work

## Experience And Response Assets

- [Operator briefing scaffold](templates/operator-briefing.md): non-persistent continuity responses
- [Local store](templates/harness-local-store.md), [stage record](templates/harness-stage-record.md), [experiment](templates/harness-experiment.md), and [Improvement Record](templates/harness-improvement-record.md): blank scaffolds completed at their private owners when needed
- [Improvement Record schema](schemas/improvement-record.schema.json): metadata shape; semantic evidence and authority review remain separate
- Find the configured local store at `docs/evidence/STORE.md`; preserve its locally excluded records and any existing override. Public records are selected separately; no public records or catalog are selected in the current import.

## Related Local Docs
- [Harness Improvement policy](../policies/harness/harness-improvement.md): private experience and promotion boundaries
- [Improvement Record contract](../policies/harness/improvement-record-contract.md): common knowledge/work identity and exchange
- [Operator context policy](../policies/harness/operator-briefing-and-review-receipts.md): conditional briefings and review receipts
- [Delegation policy](../policies/harness/competence-first-delegation.md): competence, bounded packets and final ownership
- `docs/policies/harness/prd-feature-management.md`: planning-governance rule for PRDs, features, approval, and traceability
- `docs/policies/harness/execution-loop-governance.md`: execution-loop rules, fail classification, routing, and artifact ownership
- `docs/policies/harness/execution-profiles.md`: profile selection, surface-lane, and evaluator routing rules
- `docs/policies/harness/traceability-and-link-hygiene.md`: portable path, link, and source-of-truth reference rules
- `docs/policies/design/design-evaluation.md`: reusable visual evaluation assets
- `docs/policies/experience/interaction-evaluation.md`: reusable interaction-quality evaluation assets
- `docs/plans/prd/template-prd.md`: local PRD template for bounded planning documents
- `docs/plans/feature/template-feature.md`: local feature template for product and foundation features
- `docs/plans/spec/template-spec.md`: local spec template for one approved execution target
- `docs/plans/run/template-run.md`: local run template for one active execution pass
- `docs/plans/evaluation/template-evaluation.md`: local evaluator report template
- `docs/plans/fix/template-fix-log.md`: local fix-log template
- `docs/plans/heuristic/template-heuristic-backlog.md`: local heuristic backlog template

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
- Treat `docs/agents/flows/workflow.md` as a strong default example, not the only valid orchestration shape.
- This repo may use smaller or larger workflows from the same role set depending on product scope, stack shape, and approval needs.
- When the workflow expands, keep the role contracts stable and add profiles, lanes, or flow docs through composition rather than rewriting every role.

## Local Invocation
- Initialize one execution pass from the approved feature document and the runner guide.
- Treat the runner guide as the ordered prompt source for the current execution pass instead of generating runtime scaffolding files automatically.

## Packaging Rule
- Treat `docs/agents/` as this repo's installed copy for stable roles, flows, operations, and profiles.
- Promote stable general-purpose improvements into `../ai-assets/agents/` only when they are reusable beyond this repo.
- Keep repo-specific operating rules in `AGENTS.md` or `docs/policies/`; do not hide them inside reusable role definitions.
