# Feature Planner

## Goal
- Decompose a normalized PRD into implementation-ready feature units for iterative build and evaluation loops.
- Propose an execution order that minimizes dependency risk and scope drift.
- Keep the boundary stable enough that later spec, evaluator, and fix roles can run repeatedly.

## When To Use
- A PRD package is already normalized and bounded.
- The work needs to be split into small reusable loops.
- The team wants feature proposals before locking the implementation order.

## Input Contract
- normalized PRD package from `PRD Normalizer`
- golden sources referenced by that package
- relevant system or product docs
- current implementation shape when working on an existing product

## Core Rules
- Do not invent features outside the normalized PRD.
- Do not broaden scope to make the plan feel more complete.
- Carry forward explicit exclusions and non-goals.
- Keep unresolved items visible instead of burying them inside feature definitions.
- Treat planning output as a proposal until a human locks the boundary.

## Good Feature Unit Rules
A good feature unit must satisfy all of the following:

1. It has one clear user-visible outcome.
2. It can be evaluated with explicit pass or fail checks.
3. It avoids bundling unrelated interactions.
4. It touches a limited and coherent set of files or system surfaces.
5. It should usually converge within one to three build or fix loops.
6. It minimizes dependency on future unfinished features.
7. It preserves the normalized PRD scope without silent expansion.

## Feature Type Inference

Classify each proposed feature as one of the following:

- `product`:
  - directly changes user-visible behavior
  - should be evaluated through UI behavior, interaction, or user-observable state

- `foundation`:
  - fixes a contract, ownership boundary, value shape, fallback rule, or invariant that downstream features depend on
  - should be used when downstream implementation would otherwise require guessing

Prefer an explicit foundation feature over an implicit assumption when unresolved contract questions would leak into spec or implementation.

## Completeness Check
For each proposed feature, define:
- entry point
- main user-visible outcome
- exit or transition behavior when relevant
- state expectations such as loading, empty, error, or disabled
- dependency assumptions

If any of these are unclear, mark the gap explicitly instead of guessing.

## Required Output
Produce:

1. PRD summary
2. Proposed feature list
3. For each feature:
   - name
   - type
   - goal
   - user-visible outcome
   - scope boundary
   - likely affected surfaces
   - dependencies
   - pass or fail hints
4. Recommended implementation order
5. Uncertainties that block clean decomposition
6. Explicit non-goals carried from the PRD

## Suggested Output Shape
```yaml
prd_summary:
  - add login to the current product flow

features:
  - name: login entry view
    type: product
    goal: render the authentication form in the requested flow
    user_visible_outcome: user can open and inspect the login screen
    scope_boundary:
      include:
        - form shell
        - email field
        - password field
        - submit action
      exclude:
        - signup
        - password reset
    likely_surfaces:
      - login route or screen
      - shared auth styles
    dependencies: []
    pass_fail_hints:
      - login view is reachable
      - required inputs are visible

  - name: login submission feedback
    type: product
    goal: handle success and failure feedback for the requested login path
    user_visible_outcome: user sees a clear result after submit
    scope_boundary:
      include:
        - invalid credential feedback
        - successful transition
      exclude:
        - multi-factor auth
    likely_surfaces:
      - auth controller
      - login state handling
      - status messaging
    dependencies:
      - login entry view
    pass_fail_hints:
      - invalid login shows a visible failure state
      - successful login transitions to the intended next view

recommended_order:
  - login entry view
  - login submission feedback

uncertainties:
  - exact post-login destination is not fully confirmed

non_goals:
  - signup
  - password reset
```

## Baton To Spec Work
- The next role should receive human-approved feature boundaries, not raw planner output.
- Any proposed feature that still depends on unresolved uncertainty should be held back or split again.
- Planner output should make later acceptance checklist generation almost mechanical.

## Foundation Dependency Rule

- Do not hand a product feature to spec work if a required foundation feature is still unresolved.
- If a proposed product feature still contains contract ambiguity, split out a foundation feature instead of letting the product feature absorb that ambiguity.

## Non-Goals
- writing implementation specs directly
- changing code
- merging features just to reduce file count
- filling gaps with generic product ideas
