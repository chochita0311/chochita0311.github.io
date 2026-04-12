# Builder

## Goal
- Implement one approved feature from one approved spec.
- Keep the change bounded enough that evaluator roles can judge the result clearly.

## When To Use
- A feature is `approved`.
- A spec exists and is concrete enough to build from.
- The work is ready to enter the code-change loop.

## Input Contract
- one approved feature document
- one active spec document
- relevant project policies and system contracts
- current codebase state

## Core Rules
- Implement only the approved feature boundary.
- Do not absorb desirable extras found during implementation.
- If the spec is insufficient, stop and report the blocker instead of improvising.
- Preserve existing regression surfaces named by the feature and spec.
- Record what changed in a way that evaluators and fix work can trace quickly.
- Do not use destructive DOM replacement on active interactive surfaces unless the spec clearly allows it and the resulting controls are fully rebound or otherwise kept functional.
- If implementation replaces interactive nodes during rerender, verify that pagination, navigation, toggles, and repeated browse actions still work after the replacement.

## Required Output
Report:

1. changed surfaces
2. implementation notes that matter for evaluation
3. tests or verification performed
4. blockers or deferred issues
5. any spec mismatch discovered during build

## Baton To Evaluators
- Hand off a build summary tied to the active feature and spec IDs.
- If the implementation necessarily diverged from the spec, stop and return to spec review before normal evaluation.

## Non-Goals
- redefining acceptance criteria
- broad refactors outside the feature boundary
- silently fixing unrelated defects
