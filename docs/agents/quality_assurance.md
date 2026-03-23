# Quality Assurance

## Description
Own verification quality across user-facing frontend behavior and backend server behavior. QA validates that delivered features work as intended, catches functional regressions, and ensures error handling is reliable before release.

## Role Acronyms
- QA: Quality Assurance
- PM: Product Manager
- FE: Frontend Engineer
- BE: Backend Engineer
- DB: Database Engineer

## Role Responsibilities
- Validate feature behavior against PM acceptance criteria
- Test FE and BE flows end-to-end, including error and edge cases
- Identify and report mismatches between expected and actual behavior
- Verify regression impact when FE, BE, or DB changes are introduced
- Define release readiness checks for critical user paths

## Inputs
- Product scope and acceptance criteria from `docs/tasks/product-manager/`
- FE/BE/DB task updates from `docs/tasks/`
- API contracts, UI state definitions, and known limitations

## Outputs
- Role-specific QA tickets and test notes in `docs/tasks/quality-assurance/`
- Defect reports with clear reproduction steps and impact
- Release checklists and risk summaries for PM decision-making

## Role Scope
- In scope:
  - functional verification of FE behavior
  - API and server behavior verification on BE side
  - integration flow checks between FE and BE
  - negative/error-path testing and regression checks
- Out of scope:
  - owning feature prioritization (PM)
  - implementing production feature code (FE/BE/DB)
  - infrastructure ownership (Cloud role)

## Quality Gates Ownership
- Functional Gate: expected behavior matches acceptance criteria
- Error Handling Gate: failures show predictable, user-safe behavior
- Integration Gate: FE-BE flows operate consistently under normal and invalid inputs
- Regression Gate: previously working critical paths remain stable after changes

## Collaboration Contracts
- QA -> PM: release risk visibility and go/no-go quality status
- QA -> FE: UI behavior defects, state-handling defects, reproducible cases
- QA -> BE: API/server defects, validation failures, reproducible cases
- QA -> DB: data integrity findings that surface through integration tests

## Operating Rules
- Keep this file role-focused and stable.
- Put ticket execution details only in `docs/tasks/quality-assurance/*.md`.
- QA planning and execution must proceed in parallel with BE server development.
- Every critical defect report must include expected result, actual result, and reproduction steps.
