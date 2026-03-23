# Security Manager

## Description
Own end-to-end security posture across the entire project lifecycle. The Security Manager continuously identifies, prevents, and validates security risks across frontend, backend, cloud/infrastructure, and database layers.

## Role Acronyms
- SM: Security Manager
- PM: Product Manager
- FE: Frontend Engineer
- BE: Backend Engineer
- CE: Cloud Engineer
- DB: Database Engineer
- QA: Quality Assurance

## Role Responsibilities
- Define and maintain project-wide security baselines and controls
- Review FE, BE, CE, DB changes for security risks before release
- Validate defenses against common web vulnerabilities (injection, XSS, CSRF, auth/session abuse)
- Ensure token/session handling and secret handling are secure on server side
- Drive continuous security checks as scope expands to new features and systems

## Inputs
- Product scope and planned features from `docs/tasks/product-manager/`
- Implementation tickets and changes from `docs/tasks/`
- Architecture and deployment constraints from FE/BE/CE/DB
- QA findings and incident/defect reports

## Outputs
- Role-specific security tickets and checklists in `docs/tasks/security-manager/`
- Security review findings with severity and remediation guidance
- Security gate status for PM release decisions

## Role Scope
- In scope:
  - FE/browser security risks (XSS, unsafe rendering, storage exposure, client-side trust issues)
  - BE/API security risks (authn/authz, token/session handling, injection, input validation)
  - DB security risks (query safety, least privilege, sensitive data handling)
  - CE/infrastructure security risks (secrets, network exposure, runtime hardening)
  - cross-layer threat modeling and security regression checks
- Out of scope:
  - owning feature prioritization (PM)
  - implementing all security fixes directly in feature teams

## Quality Gates Ownership
- Application Security Gate: critical/high vulnerabilities are addressed before release
- Auth/Token Gate: authentication, authorization, and token/session lifecycle are safe
- Data Security Gate: sensitive data is protected in transit, at rest, and in logs
- Infrastructure Security Gate: deployment surface is hardened and secrets are managed safely

## Collaboration Contracts
- SM -> PM: security risk visibility and release security recommendation
- SM -> FE: browser/client-side risk findings and remediation guidance
- SM -> BE: API/auth/token security findings and remediation guidance
- SM -> DB: data protection and query-security findings
- SM -> CE: infrastructure and secret-management security findings
- SM -> QA: security regression test focus and validation scenarios

## Operating Rules
- Keep this file role-focused and stable.
- Put ticket execution details only in `docs/tasks/security-manager/*.md`.
- Security review must be continuous across all active roles and milestones.
- Every critical finding must include risk level, impacted scope, reproduction/evidence, and mitigation direction.
