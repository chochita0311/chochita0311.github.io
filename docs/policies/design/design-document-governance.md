# Design Document Governance

## Purpose
- Define the ownership, hierarchy, and update rules for [DESIGN.md](../../../DESIGN.md), [design-constitution.md](./design-constitution.md), and [design-plan.md](../../plans/design/design-plan.md).
- Keep creative intent, durable design law, and active work clearly separated.
- Prevent design drift as the product expands across screens, states, and features.

## Governance Model
- [DESIGN.md](../../../DESIGN.md) is the creative source.
- [design-constitution.md](./design-constitution.md) is the durable design source of truth.
- [design-plan.md](../../plans/design/design-plan.md) is the active working document.

These files are related, but they are not peers. Each one owns a different type of information and should be updated for different reasons.

## Source Hierarchy
1. [design-constitution.md](./design-constitution.md) governs implementation and evaluation.
2. [DESIGN.md](../../../DESIGN.md) provides intent, direction, and source material.
3. [design-plan.md](../../plans/design/design-plan.md) tracks current scope, sequencing, and unresolved decisions.

If documents conflict:
- The constitution wins for durable rules.
- The plan wins only for active sequencing and open work.
- `DESIGN.md` may influence a future rule change, but it does not override locked rules by itself.

## Document Ownership

### `DESIGN.md`
- Owns:
  - creative north star
  - visual intent
  - tone and atmosphere
  - source-material interpretation
  - early system direction from screens or artifacts
- Should contain:
  - rationale for why the system should feel a certain way
  - palette and typography direction
  - composition and hierarchy observations
  - design cues extracted from generated, drafted, or observed artifacts
- Should not contain:
  - final token governance
  - enforceable implementation rules
  - build sequencing
  - page-local exceptions written as durable law

### `design-constitution.md`
- Owns:
  - durable design law
  - implementation contract
  - evaluation baseline
  - reusable system constraints
- Should contain:
  - primitive and semantic tokens
  - layout rules
  - component rules
  - mobile evolution rules
  - implementation guardrails
  - automation and AI guardrails when relevant
  - durable screen families
- Should not contain:
  - temporary work notes
  - speculative one-off experiments
  - build order
  - unresolved uncertainty that belongs in the plan

### `design-plan.md`
- Owns:
  - active design scope
  - sequencing
  - unresolved decisions
  - current deltas between the desired system and the implemented one
- Should contain:
  - current build sequence
  - active screen scope
  - open questions
  - risks
  - immediate next actions
- Should not contain:
  - a rewritten constitution
  - locked token tables already owned elsewhere
  - stable creative rationale already owned by `DESIGN.md`

## Update Rules
- Update [DESIGN.md](../../../DESIGN.md) when the creative direction, visual rationale, or source-material interpretation meaningfully changes.
- Update [design-constitution.md](./design-constitution.md) when a durable rule changes.
- Update [design-plan.md](../../plans/design/design-plan.md) when active scope, sequencing, or uncertainty changes.
- Do not update all three documents by default. Update only the document that owns the change.

## Rule Promotion
When new design input appears:
1. Review the input against [DESIGN.md](../../../DESIGN.md) and [design-constitution.md](./design-constitution.md).
2. Identify what changed: intent, rule, or active work.
3. Promote a change into the constitution only if it is durable, reusable, and likely to affect more than one screen, state, or component family.
4. Keep one-off experiments, temporary polish, and sequencing decisions out of the constitution.
5. Record active follow-up and unresolved implementation work in [design-plan.md](../../plans/design/design-plan.md).

## Evaluation Rules
- Evaluate implementation primarily against [design-constitution.md](./design-constitution.md).
- Use [DESIGN.md](../../../DESIGN.md) as supporting context for tone, intent, and rationale.
- Use [design-plan.md](../../plans/design/design-plan.md) to understand current deltas and active work, not to redefine the system.

## Drift Prevention
- Do not treat `DESIGN.md` and the constitution as equal sources of truth.
- Do not mechanically sync documents after every visual tweak.
- Do not promote temporary screen polish into durable system law.
- Do not introduce new tokens, component families, or layout primitives in implementation without a constitution update.

## Practical Summary
- `DESIGN.md` explains why the design should feel this way.
- `design-constitution.md` defines what the system must consistently obey.
- `design-plan.md` defines what is being changed now.
