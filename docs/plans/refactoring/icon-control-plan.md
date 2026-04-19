# Icon Control Refactor Plan

Create one controlled icon system for the repo so icon choice, naming, accessibility, and future migration from font icons to SVG stay manageable without changing the app's current behavior.

## Refactor Type

- Primary type: Structural
- Secondary type: Semantic
- Behavior target: Preserve current visuals and runtime behavior while introducing icon governance and a shared control point.

## Scope

- In scope:
  - Material Symbols usage in HTML, CSS, and JavaScript
  - Central icon registry for approved icon names
  - Shared rendering and accessibility rules for icon markup
  - Design and developer documentation for icon usage
- Current implementation points verified in this track:
  - `index.html`
  - `archive/index.html`
  - `archive/note/index.html`
  - `assets/js/sidebar.js`
  - `assets/js/index-note-detail.js`
  - `assets/css/base.css`
- Out of scope for this track:
  - Full SVG migration
  - Custom branded icon set
  - Replacing Material Symbols in the current runtime
  - Visual redesign beyond icon control and consistency

## Non-Goals

- Do not add a build step.
- Do not change the site away from GitHub Pages compatible static delivery.
- Do not redesign the archive shell just to accommodate icon cleanup.
- Do not mix unrelated component refactors into this track.

## Invariants

- Keep GitHub Pages compatibility.
- Keep the app lightweight and static-first.
- Keep Material Symbols as the active icon source during this track.
- Preserve current visible icon appearance unless an explicit icon rename is approved.
- Do not introduce style drift across archive and note pages while centralizing icon control.

## Planned Work

## Phase 1: Inventory And Baseline

- Goal: Produce a complete inventory of current icon usage and identify where raw icon names are hardcoded.
- Why this grouping: A control system is incomplete if JS-rendered markup and static HTML are not both mapped first.
- Guardrails:
  - Do not rename icons during inventory.
  - Treat JS-generated markup as first-class usage, not secondary usage.
  - Record both icon name and usage context.
- Targets:
  - `index.html`
  - `archive/index.html`
  - `archive/note/index.html`
  - `assets/js/sidebar.js`
  - `assets/js/index-note-detail.js`
- Validation:
  - Generate a deduplicated list of icon names in current use.
  - Confirm each icon has at least one verified source location.
- Exit gate:
  - Every current icon token used by the published UI is mapped to a source file and usage context.
- Status:
  - Completed on 2026-04-10. Inventory recorded in `docs/plans/refactoring/icon-control-inventory.md`.

## Phase 2: Define The Icon Contract

- Goal: Define what "controlled icons" means in this repository.
- Why this grouping: Governance should exist before code centralization so new files do not continue the current drift.
- Guardrails:
  - Keep the contract short and operational.
  - Keep design rules in design docs and implementation rules in project docs where appropriate.
  - Do not make speculative future SVG rules the main policy yet.
- Targets:
  - `docs/policies/design/design-constitution.md`
  - `docs/policies/project/developer-guide.md`
  - A dedicated icon-control doc if the repo needs one owner document
- Validation:
  - Document the approved icon source as Material Symbols Outlined.
  - Document semantic naming expectations for the registry.
  - Document accessibility rules for decorative and actionable icons.
  - Document migration entry rules for adding new icons.
- Exit gate:
  - The repo has one durable written icon policy and one explicit source-of-truth path for it.
- Status:
  - Completed on 2026-04-10 through `docs/policies/system/icon.md`, plus related updates in `docs/policies/project/developer-guide.md` and `docs/policies/design/design-constitution.md`.

## Phase 3: Centralize Icon Definitions

- Goal: Remove uncontrolled raw icon literals from runtime logic by introducing a shared icon registry.
- Why this grouping: A registry is the main technical control point for icon consistency and future migration.
- Guardrails:
  - Keep the registry framework-free.
  - Keep names semantic where possible and avoid encoding page-specific presentation details into keys.
  - Do not force a full HTML abstraction if simple static markup is sufficient for now.
- Targets:
  - New runtime-owned registry file under `assets/js/` or `assets/config/`
  - `assets/js/sidebar.js`
  - `assets/js/index-note-detail.js`
- Validation:
  - JS-rendered icons read from the shared registry.
  - Category fallback icon behavior remains intact.
  - No unexplained raw icon strings remain in touched JS files.
- Exit gate:
  - JavaScript icon usage is routed through one canonical registry.
- Status:
  - Completed on 2026-04-10 through `assets/js/icons.js`.

## Phase 4: Add A Shared Rendering Pattern

- Goal: Standardize icon markup, classes, and accessibility behavior across static HTML and generated UI.
- Why this grouping: Registry centralization alone will not prevent markup drift or inconsistent accessibility.
- Guardrails:
  - Keep the canonical pattern compatible with current Material Symbols usage.
  - Avoid introducing a component framework pattern into a static app.
  - Decorative icons should not be exposed to assistive technology by default.
- Targets:
  - `assets/css/base.css`
  - `index.html`
  - `archive/index.html`
  - `archive/note/index.html`
  - Any new shared JS helper added for icon rendering
- Validation:
  - One canonical icon class pattern exists.
  - Icon-only buttons have accessible naming through surrounding labels or explicit attributes.
  - Decorative icons consistently use the agreed accessibility treatment.
- Exit gate:
  - New icons have one obvious rendering pattern to follow.
- Status:
  - Completed on 2026-04-10 through the shared `window.AppIcons.renderIcon(...)` helper, the `.icon` and `.icon--material` base classes, and static markup normalization.

## Phase 5: Migrate Current Usage

- Goal: Replace scattered literals and ad hoc icon markup with the agreed registry and rendering conventions.
- Why this grouping: Migration is safe only after the registry and markup rules exist.
- Guardrails:
  - Preserve current page behavior and visual output.
  - Keep archive and note page parity where they intentionally share structure.
  - Do not fold unrelated content or layout edits into the migration.
- Targets:
  - `index.html`
  - `archive/index.html`
  - `archive/note/index.html`
  - `assets/js/sidebar.js`
  - `assets/js/index-note-detail.js`
- Validation:
  - Local browser smoke check for archive and note pages.
  - Search confirms raw icon literals are minimized to the registry and any approved static exceptions.
  - No regressions in category navigation, pagination, breadcrumbs, or note actions.
- Exit gate:
  - Current icon usage is under the new control model without visible regressions.
- Status:
  - Completed on 2026-04-10 for current archive and note-page icon usage in static HTML and touched JavaScript render paths.

## Phase 6: Extend Design-System Rules

- Goal: Make icon choice and usage part of the repo's durable design system rather than a code-only convention.
- Why this grouping: The repo already has a design constitution, so icon rules should become part of that durable system.
- Guardrails:
  - Keep icon policy aligned with the existing editorial design language.
  - Avoid turning icon rules into a generic design-system taxonomy unrelated to the app.
  - Do not approve multiple icon families casually.
- Targets:
  - `docs/policies/design/design-constitution.md`
  - `docs/policies/project/developer-guide.md`
- Validation:
  - The constitution states the approved family and style baseline.
  - The developer guide explains how to add or change icons without bypassing the registry.
  - The docs explain when SVG is justified instead of font icons.
- Exit gate:
  - Future implementation work can follow icon rules without rediscovering them from scattered code.
- Status:
  - Completed on 2026-04-10 in the design constitution and developer guidance.

## Validation Gates

- Search-based inventory confirms all current icon names and usage sites.
- A shared registry exists before broader migration claims are made.
- Local browser smoke checks cover archive browse and note detail flows after migration.
- Accessibility spot checks cover decorative icons and icon-only action buttons.
- Documentation updates land in the same work cycle as the implementation changes they describe.
- Validation status:
  - Completed on 2026-04-10.
  - `node --check` passed for `assets/js/icons.js`, `assets/js/sidebar.js`, and `assets/js/index-note-detail.js`.
  - Browser smoke checks passed for the archive runtime surfaces that were active when the refactor was completed.
  - Console errors discovered during smoke testing exposed unrelated runtime path issues and were corrected in the same cycle because they blocked clean validation of the touched icon paths.

## Intentional Deltas

- Introduce a semantic icon registry as the canonical control point.
- Introduce a shared icon rendering and accessibility pattern.
- Add explicit icon governance to design and developer documentation.
- Reduce reliance on raw icon-name literals spread through UI files.

## Risks / Open Questions

- Some current icon names such as `ios_share` may be platform-flavored and may deserve later normalization.
- Static HTML will likely retain some direct icon markup even after JS centralization unless more abstraction is intentionally added.
- If the product later needs stronger brand distinction or custom motion, selected icons may need to migrate from font glyphs to SVG.
- The current design constitution does not yet define icon-specific rules, so doc ownership must be made explicit during implementation.

## Exit Goal

After this track, the repo has one approved icon source, one registry, one rendering pattern, and one documentation owner for icon policy. The current runtime remains behaviorally stable while future icon changes become deliberate and reviewable.

## Handoff To Next Track

- Optional future work:
  - normalize platform-flavored icon names such as `ios_share` if the product needs less platform-specific language
  - migrate selected high-value icons to SVG if brand distinction or custom motion becomes a real requirement
  - optional: integrate `scripts/check-icon-control.mjs` into a broader repo verification routine if a shared check entrypoint is introduced later
