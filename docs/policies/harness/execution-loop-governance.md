# Execution Loop Governance

## Purpose

- Define how approved features move through spec, build, evaluation, fix, and escalation.
- Keep execution loops traceable, bounded, and type-aware.
- Make the execution return model explicit so teams can see what happens inside an automated run and what happens only after human review.

## Ownership

- This document owns execution-loop rules.
- Use `docs/agents/flow/workflow.md` for sequence examples.
- Use `docs/policies/harness/prd-feature-management.md` for planning-layer rules and approval criteria.
- Use this document as the owner for execution return semantics:
  - in-run local fix
  - post-run return to spec
  - post-run return to planning
  - re-entry after human decision

## Execution Artifacts

- `docs/plans/run/` owns active run records.
- `docs/plans/spec/` owns implementation-facing specs.
- `docs/plans/evaluation/` owns evaluator reports.
- `docs/plans/fix/` owns fix logs.
- `docs/plans/heuristic/` owns heuristic backlog records.

## Core Operating Rules

- Only one feature should normally be `in-loop` at a time.
- Do not execute from raw planner output.
- Do not silently expand scope during build, evaluation, or fix.
- Every execution artifact must reference the active feature ID and active spec ID.
- If a blocker belongs to planning or spec, route upward instead of normalizing it as an implementation defect.
- Treat one active run as an automated execution unit.
- Human review does not interrupt a normal in-progress run.
- Scope, spec, or planning returns should happen after the run reports its result to the human owner, unless the run is technically blocked and cannot continue.

## Execution Return Model

Execution is not a straight line. The normal operating structure is:

1. run from one approved feature
2. complete the automated execution loop for that run
3. report the result to the human owner
4. human decides whether to accept, return to spec, or return to planning
5. correct the owning layer
6. start a new run from the corrected point

This model should be used instead of ad hoc phrases such as "go back", "resolve", or "fix" without classification.

### 1. Continue In Loop

- Use this when the issue is an `implementation bug`.
- The approved feature and active spec are still valid.
- Stay inside the current execution loop.
- Apply targeted fixes.
- Re-run only the needed evaluators.

### 2. Post-Run Return To Spec

- Use this when the run completes and the human owner decides the approved feature is still right but the active spec must be corrected.
- The approved feature boundary is still valid, but the active spec is too weak, contradictory, or underspecified.
- Update the spec first.
- Start a new run from build or targeted fix work against the corrected spec.

### 3. Post-Run Return To Planning

- Use this when the run completes and the human owner decides the problem changes approved scope, mode meaning, dependency meaning, or user-visible intent.
- The problem changes approved scope, mode meaning, dependency meaning, or user-visible intent.
- Return to feature review or PRD review.
- Re-approve the corrected boundary before resuming spec or build.

### 4. Invalidate Earlier Attempt When Needed

- Use this when post-run review proves that an earlier pass was based on a materially wrong assumption.
- Do not leave the earlier pass implied as valid.
- Mark the run history or continuity notes so the correction path is explicit.
- Resume from the corrected planning or spec basis instead of pretending the earlier pass was a valid step.

### 5. Re-Entry Rule

- Re-enter at the lowest layer that is now trustworthy.
- If planning changed, resume from planning approval and then continue into spec.
- If only spec changed, resume from spec and then continue into build.
- If only implementation changed, remain inside the normal fix and re-evaluate loop.
- Do not jump forward from a corrected planning gap straight into evaluation without rebuilding the intermediate artifacts.

### 6. Technical Block Exception

- A run may stop early only when it is technically blocked and cannot continue safely.
- This is not a normal human-interrupt path.
- Record the run as `blocked`.
- Report the blocker to the human owner.
- Only after that report may the human owner decide whether the next step is local unblock, return to spec, or return to planning.

## Practical Decision Rule

- Ask:
  - Is the approved feature boundary still correct?
  - Is the active spec still correct?
  - Is only the implementation wrong?
- Route based on the first broken layer:
  - boundary wrong after run review: return to planning
  - boundary correct but spec weak after run review: return to spec
  - boundary and spec correct but code wrong during run: continue in loop

## Optional Capability Rule

- A role may have optional local skills or optional MCP tools that improve execution quality.
- Document those capabilities in the role contract when omission would reduce consistency.
- If the capability exists in the current environment and is relevant to the active feature, it should be used.
- If the capability does not exist in the current environment, the role must still remain operable through its base contract.
- Do not turn optional capabilities into hard blockers unless the project explicitly promotes them into required tooling.

## Dependency Depth Guidance

- Prefer dependency depth of `2` or less for any active feature.
- If dependency depth exceeds `2`, the planner or orchestrator should:
  - justify why the deeper chain is still stable
  - or split the feature or contract work before execution continues
- Treat this as a warning rule, not a hard universal ban.

## Feature-Type-Aware Loops

- `foundation` feature default loop:
  - Spec Agent
  - Builder or contract updater
  - Functional Evaluator
  - Fix Agent
  - re-evaluate
- `product` feature default loop:
  - Spec Agent
  - Builder
  - Design Evaluator when visual surfaces matter
  - Functional Evaluator
  - UX Heuristic Evaluator as side-channel
  - Fix Agent
  - re-evaluate

## Fail Classification

Every blocking finding should be classified as one of:

- `implementation bug`
  - the approved spec is clear and the code does not satisfy it
- `spec gap`
  - the feature is approved, but the active spec is too weak or contradictory to execute safely
- `planning gap`
  - the issue changes approved scope, unresolved dependency meaning, or product-boundary intent

## Classification Examples

- `implementation bug`
  - tags or titles spill outside an approved card even though the spec already requires stable containment
  - a grid card click no longer opens note detail even though the spec preserves click-through
  - pagination or other existing controls stop working because a rerender replaced the DOM nodes without preserving or rebinding their interaction handlers
- `spec gap`
  - the feature clearly needs stable card containment, but the spec failed to define title clamp, tag overflow, or breakpoint behavior
  - the visual direction is approved, but the build has no precise rule for how summaries should compress inside the new card
  - the feature changes a rerender path, but the spec never defined whether the affected controls must survive DOM replacement or be rebound after rebuild
- `planning gap`
  - execution reveals that the approved feature boundary was wrong, such as “replace list with grid” when the real intended scope was “keep list and add a grid toggle”
  - execution reveals a missing user-visible mode or scope decision that should have been resolved before spec

## Return Path

- `implementation bug`:
  - continue in loop
  - apply local fix
  - re-evaluate as needed
- `spec gap`:
  - finish the current automated run unless a technical blocker prevents continuation
  - report to the human owner
  - return to spec review only after human decision
  - start a new run from build or targeted fix work after spec correction
- `planning gap`:
  - finish the current automated run unless a technical blocker prevents continuation
  - report to the human owner
  - return to feature or PRD review only after human decision
  - re-approve before starting a new run into spec or build

## Heuristic Side-Channel Rule

- `UX Heuristic Evaluator` is a signal emitter, not a default blocking gate.
- It may return:
  - `PASS`
  - `PASS WITH SUGGESTIONS`
  - `FAIL`
- `PASS WITH SUGGESTIONS` does not block feature completion.
- Suggestions should be recorded in heuristic backlog artifacts and considered in later planning.
- `FAIL` should be reserved for:
  - dead-end interaction
  - severe orientation loss
  - unrecoverable navigation confusion
  - contradiction inside already approved scope
- If a heuristic failure implies new scope, report it for post-run human review instead of fixing ad hoc inside the run.

## Heuristic Severity Guidance

- `low` and `medium` heuristic findings should default to backlog suggestions.
- `high` heuristic findings should still default to backlog unless they contradict the already approved feature contract.
- Only clearly blocking heuristic failures should stop the active loop.

## Spec Readiness Gate

Do not start executable spec work when:

- a required foundation feature is not `passed`
- an open PRD item still changes the active feature
- the user-visible outcome or contract outcome is still ambiguous
- required fallback behavior is still undefined

## Traceability Rules

- Use one run identifier such as `run-YYYYMMDD-01` for each active execution pass.
- Use one spec document per active feature loop.
- A run may include multiple attempts when execution loops locally or is retried after a technical blocker.
- Record return-to-spec or return-to-planning as post-run human decisions rather than as silent in-run redirects.
- Use evaluator reports that name:
  - run ID
  - attempt number when relevant
  - feature ID
  - spec ID
  - evaluator type
  - pass/fail result
  - fail classification when blocked
- Use fix logs that reference the evaluator reports they addressed.
- Use fix logs that also reference the active run ID.
- Use fix logs that reference the active attempt when the same run has multiple passes.
- Use heuristic backlog entries for non-blocking suggestion accumulation.

## Post-Contract Regression Check

- When a run changes a source-of-truth contract, generated-data contract, or identity model, the run should automatically check for stale assumptions in:
  - runtime code
  - generators and scripts
  - adjacent policy or contract docs
- Treat this as a default post-run verification step, not an optional question for the human owner.
- Record the result in the run report when the changed contract could plausibly leave stale paths behind.

## Invalidation Rule

- If later evidence proves that an earlier execution pass was based on a wrong feature boundary, wrong spec basis, or materially invalid assumption:
  - do not keep the earlier pass implied as valid
  - mark the run or continuity notes so the earlier pass is explicitly invalidated or replaced
  - preserve the correction path clearly enough that later readers can see why the current truth changed
- Normal project work should prefer explicit attempt history over rewriting the same pass invisibly.

## Compact Mental Model

- `implementation bug`:
  - fix here
- `spec gap`:
  - report, then human may send back to spec
- `planning gap`:
  - report, then human may send back to feature or PRD
- after correction:
  - start a new run from the corrected layer

## Termination Conditions

- The loop may end with:
  - `passed`
  - `blocked`
  - `returned-to-spec`
  - `returned-to-planning`
