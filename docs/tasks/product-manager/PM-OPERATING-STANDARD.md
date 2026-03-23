# PM Operating Standard (Stage 1)

## Purpose
- Standardize how PM supervises early-stage delivery when DB/Design/FE decisions are tightly coupled.
- Reuse the same operating flow from PM-0001 for upcoming PM tickets.

## Applies To
- PM tickets in `docs/tasks/product-manager/PM-####.md`
- Linked execution tickets in `docs/tasks/<role>/`
- Current stage: static FE + localdb JSON baseline, with API expansion prepared next.

## Core Principles
- PM owns scope boundaries and acceptance criteria.
- User supervision is a formal gate for architecture/schema/UI decisions in early stage.
- DB rules and FE behavior must be synchronized before coding.
- Keep logs minimal: update only `docs/logs/INDEX.md` plus ticket files.

## Standard Workflow
1. Define PM ticket
- Write objective, in-scope/out-of-scope, and acceptance criteria.
- Split "now" vs "next" clearly (do not over-pack one ticket).

2. Freeze decision baseline
- Confirm table/domain baseline from `docs/tables/`.
- Confirm UI flow baseline (list/detail/search/navigation).
- Mark unresolved decisions explicitly as TODO for next PM ticket.

3. Delegate by role
- PM -> DB: schema, constraints, DDL artifacts, migration notes.
- PM -> DE: UX states and responsive behavior handoff.
- PM -> FE: implementation path and interface boundary (local now, API-ready next).
- PM -> QA: executable test checklist and release risks.

4. Implement and validate
- FE implements only approved PM scope.
- QA verifies against PM acceptance criteria, not subjective preference.
- PM confirms unresolved gaps and schedules them into next PM ticket.

5. Close and handoff
- Update ticket status and `docs/logs/INDEX.md`.
- Record "carried-forward TODOs" into next PM ticket (`PM-0002`, `PM-0003`, ...).

## Final Closure Process (Required)
1. QA execution complete
- QA ticket (for example `QA-0001`) must be executed and updated to `done`.
- QA result must include pass/fail summary, defects, and residual risk.

2. PM closure decision
- PM decides closure only against current ticket scope (not future expanded scope).
- If no blocking defect exists in-scope, PM can mark current `*-0001` tickets as `done`.

3. Draft boundary handling
- Expanded DB/feature ideas discovered during execution are kept as draft.
- Draft items must not block current ticket closure if they are out-of-scope.
- Move draft items explicitly into next PM ticket scope.

4. Status synchronization
- Reflect final status in:
  - role tickets in `docs/tasks/<role>/`
  - `docs/logs/INDEX.md`
- Keep ordering and status rules in the index.

## Mandatory PM Checklist (Per Ticket)
- [ ] Scope is single-slice and testable.
- [ ] Acceptance criteria are measurable.
- [ ] DB/DE/FE/QA task links are present.
- [ ] Out-of-scope items are listed.
- [ ] Next-ticket TODOs are captured.
- [ ] QA execution ticket is `done` with evidence.
- [ ] PM closure decision is recorded (in-scope pass/fail).
- [ ] Draft-only items are moved to next PM ticket.
- [ ] `docs/logs/INDEX.md` updated.

## Stage-1 Supervision Gate (Required)
- Gate A: table naming/rules agreed (`docs/tables/standards.md`).
- Gate B: board/post UX flow agreed (list/detail/back behavior).
- Gate C: FE implementation reviewed against PM acceptance.
- Gate D: PM approves close and defines next ticket entry criteria.

## Deliverable Format (Recommended)
- PM ticket: purpose/scope/delegation/acceptance/next-step.
- DB ticket: schema + constraints + artifacts + migration considerations.
- DE ticket: UX state spec + responsive notes + FE handoff checklist.
- FE ticket: implemented behaviors + API boundary draft.
- QA ticket: pass/fail checklist + defect list + residual risk.

## Definition of Done (PM Ticket)
- In-scope features work and are verified.
- Role tickets are aligned with PM criteria.
- Follow-up items are moved to next PM ticket, not left implicit.
- `docs/logs/INDEX.md` reflects latest status and next action.
