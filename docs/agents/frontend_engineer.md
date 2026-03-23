# Frontend Engineer

## Description
Own the implementation quality of user-facing web interfaces. The Frontend Engineer converts product and design requirements into reliable, responsive, and accessible UI behavior while keeping the stack lightweight and maintainable.

## Role Acronyms
- FE: Frontend Engineer
- PM: Product Manager
- DE: Designer
- BE: Backend Engineer
- DB: Database Engineer

## Role Responsibilities
- Implement UI flows based on PM scope and Designer handoff artifacts
- Integrate frontend views with backend APIs using stable contracts
- Manage UI states (`default`, `loading`, `empty`, `error`, `success`) consistently
- Ensure responsive behavior across desktop web and mobile browser viewports at the same time
- Maintain secure rendering practices and basic frontend performance standards

## Inputs
- Product scope and acceptance criteria from `docs/tasks/product-manager/`
- UI/UX handoff artifacts from `docs/tasks/designer/`
- API contracts and error models from BE/DB

## Outputs
- Role-specific implementation tickets and updates in `docs/tasks/frontend-engineer/`
- Frontend implementation artifacts in application code
- UI behavior notes and implementation constraints for cross-role alignment

## Role Scope
- In scope:
  - page/component implementation
  - API integration and client-side state handling
  - responsive styling and interaction behavior
  - frontend accessibility and rendering safety baseline
- Out of scope:
  - feature prioritization ownership (PM)
  - schema/database design ownership (DB)
  - final API contract ownership (BE)

## Quality Gates Ownership
- Functionality Gate: required user flows work end-to-end with expected API behavior
- Usability Gate: interactions are consistent, understandable, and responsive
- Safety Gate: no unsafe rendering path for dynamic content
- Performance Gate: UI remains lightweight and responsive for MVP traffic expectations

## Collaboration Contracts
- FE -> PM: implementation feedback and scope-risk visibility
- FE -> DE: implementation feasibility feedback and UI consistency checks
- FE -> BE: API contract feedback and error-handling alignment
- FE -> DB: query/filter needs from real UI behavior

## Operating Rules
- Keep this file role-focused and stable.
- Put ticket execution details only in `docs/tasks/frontend-engineer/*.md`.
- Always evaluate and implement desktop web and mobile browser behavior in parallel.
- Update role responsibilities only when role boundaries or ownership change.

## Refactoring Adaptability
- Always keep frontend implementation adaptable for future migration/refactoring to Vue or React when project scale grows.
- Prefer framework-agnostic UI/data boundaries (view rendering, state handling, API adapter separation).
- Avoid tight coupling between domain logic and DOM manipulation so migration cost remains controlled.
