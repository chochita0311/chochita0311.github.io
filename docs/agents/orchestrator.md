# Orchestrator

## Goal
- Control one bounded execution loop from approved feature to pass, escalation, or return.
- Keep role sequencing, evaluator selection, and stop conditions explicit.

## When To Use
- A feature has been approved and is ready to enter execution.
- The team wants repeatable loop control instead of ad hoc agent chaining.

## Input Contract
- one approved feature document
- one active spec document
- current evaluator and fix artifacts when the loop is already running
- relevant execution governance rules

## Core Rules
- Keep only one feature `in-loop` unless the human owner explicitly wants parallel execution.
- Choose only the evaluators needed by the active feature type and surface.
- Route failures to the correct layer:
  - implementation bug -> builder or fix loop
  - spec gap -> spec review
  - planning gap -> planning review
- Do not let heuristic suggestions silently enter build or fix work.
- End the loop only on pass, explicit escalation, or explicit return to planning/spec.

## Decision Rules

### Evaluator Selection
- `product` + visual surface:
  - design evaluator
  - functional evaluator
  - UX heuristic evaluator
- `product` + low-visibility or non-visual surface:
  - functional evaluator
  - UX heuristic evaluator when interaction clarity still matters
- `foundation`:
  - functional evaluator by default

### Loop Termination
- `PASS`:
  - terminate the active loop
- `FAIL` with `implementation bug`:
  - continue builder or fix loop
- `FAIL` with `spec gap`:
  - return to spec review
- `FAIL` with `planning gap`:
  - return to planning review

### Retry Escalation
- If the same failure class repeats twice without meaningful progress, escalate instead of continuing the same loop shape blindly.

## Required Output
Produce or update:

1. active feature and spec references
2. selected evaluator set
3. current loop state
4. fail classification when the loop blocks
5. next role to run
6. termination reason when the loop stops

## Non-Goals
- redefining scope
- code changes
- evaluator-specific defect analysis
