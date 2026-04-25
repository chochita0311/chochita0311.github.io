# FEAT-0020: Typography Token And Policy Alignment

## Metadata

- ID: `feat-0020`
- Status: `passed`
- Type: `foundation`
- Surface: `docs`
- Execution Profile: `foundation-contract`
- Required Evaluators: `contract`, `design`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Foundation feature:
  - align durable typography policy and token ownership around `Inter`, `Noto Sans KR`, and `Satoshi` so downstream implementation no longer conflicts with the current `Manrope` design rule.

## Acceptance Contract

- The design constitution defines the approved typography roles for `Inter`, `Noto Sans KR`, and `Satoshi`.
- Any durable `Manrope` rule in the design constitution is either replaced or explicitly demoted so it no longer blocks the approved PRD direction.
- `DESIGN.md` and adjacent design planning docs no longer present `Manrope` as the active creative north-star typeface without qualification.
- The approved typography roles clarify which surfaces use body/UI fonts and which surfaces may use the display/title font.
- Downstream feature work can update CSS tokens without guessing whether the typography system is allowed.

## Scope Boundary

- In:
  - design constitution typography updates
  - design-source wording updates needed to remove conflicting `Manrope` guidance
  - token-role definitions for body/UI, Korean fallback, title/display, metadata, and code text
  - documentation notes that preserve the dark scholarly archive tone under the new font set
- Out:
  - adding font files
  - changing runtime CSS links or `@font-face`
  - applying typography to public screens
  - solving sidebar, note-reference, scroll, or topbar alignment bugs

## Contract Surfaces

- [docs/policies/design/design-constitution.md](../../policies/design/design-constitution.md)
- [DESIGN.md](../../../DESIGN.md)
- [docs/plans/design/design-plan.md](../design/design-plan.md)
- CSS token names that later implementation will map to font families

## User-Visible Outcome

- None directly. This feature creates the durable typography contract that later visible work must follow.

## Entry And Exit

- Entry point:
  - PRD-0009 is approved and still names `Manrope` as a policy conflict.
- Exit or transition behavior:
  - typography policy is aligned, and feature `feat-0021` or `feat-0022` can proceed without a design-source conflict.

## State Expectations

- Default:
  - design policy consistently names the approved font roles.
- Loading:
  - not applicable.
- Empty:
  - not applicable.
- Error:
  - downstream CSS work still has to guess whether `Manrope` or the new font set owns the system.
- Success:
  - typography contract is stable enough for implementation planning.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)

## Likely Affected Surfaces

- [docs/policies/design/design-constitution.md](../../policies/design/design-constitution.md)
- [DESIGN.md](../../../DESIGN.md)
- [docs/plans/design/design-plan.md](../design/design-plan.md)

## Pass Or Fail Checks

- `Manrope` is no longer the unqualified active core face in durable design policy.
- `Inter`, `Noto Sans KR`, and `Satoshi` each have an explicit role.
- Korean fallback and long-form reading needs are covered.
- Code and monospace note content remain outside the new display-font rule.
- No runtime implementation is required to understand the typography contract.

## Regression Surfaces

- Dark scholarly editorial tone
- Design constitution token ownership
- Existing archive-first product scope

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning.
- `2026-04-25`: passed after design constitution, design brief, and design plan were aligned to the `Inter` / `Noto Sans KR` / `Satoshi` typography contract.
