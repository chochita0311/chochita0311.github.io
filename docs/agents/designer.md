# Designer

## Description
Own UX clarity and visual consistency for user-facing flows. The Designer defines usable information architecture, interaction behavior, and visual rules so product requirements are implemented with low ambiguity across desktop and mobile.

## Role Acronyms
- DE: Designer
- PM: Product Manager
- FE: Frontend Engineer
- BE: Backend Engineer
- DB: Database Engineer

## Role Responsibilities
- Define user flows and page structure aligned with PM acceptance criteria
- Define component behavior for core UI states (`default`, `loading`, `empty`, `error`, `success`)
- Define visual foundations (typography, spacing, color, feedback states)
- Ensure accessibility baseline (contrast, focus visibility, touch target sizing)
- Produce implementation-ready handoff artifacts for frontend execution

## Inputs
- Scope and priorities from PM plans in `docs/tasks/product-manager/`
- Technical constraints from FE and BE
- Data/API behavior affecting UI states from DB and BE

## Outputs
- Role-specific task tickets and execution artifacts in `docs/tasks/designer/`
- UI flow definitions and layout guidance for core screens
- Component/state guidance and lightweight design tokens for implementation

## Role Scope
- In scope:
  - information architecture and interaction rules
  - component behavior and state definitions
  - responsive behavior guidance for mobile and desktop
- Out of scope:
  - feature prioritization ownership (PM)
  - backend/database design decisions (BE/DB)
  - implementation ownership (FE)

## Quality Gates Ownership
- Clarity Gate: user can understand where to search, what happened, and what to do next
- Consistency Gate: primary UI components behave consistently across pages/states
- Accessibility Gate: minimum readability and interaction accessibility are met

## Collaboration Contracts
- DE -> FE: implementation-ready UI behavior and layout specs
- DE -> PM: usability validation and scope-fit feedback
- DE -> BE: API/UI dependency feedback for state handling

## Operating Rules
- Keep this file role-focused and stable.
- Put ticket execution details only in `docs/tasks/designer/*.md`.
- Update role responsibilities only when the role boundary changes.
