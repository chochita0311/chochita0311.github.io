# CSS And Package Docs Structure Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Scope: CSS ownership audit, package-doc structuring, and targeted policy-doc reshaping

## Summary

- Goal:
  - Confirm whether the CSS layers need structural movement and reshape package docs affected by the runtime boundary refactor.
- Outcome:
  - `Pass`
- Short conclusion:
  - CSS stayed in place because ownership is coherent; runtime package docs were reshaped where the new JS/CSS boundaries made the old flat structure or links stale.

## CSS Audit

- `assets/css/app.css` remains the stylesheet entry and cross-surface handoff owner.
- `assets/css/tokens.css`, `base.css`, and `semantic.css` remain primitive, browser-base, and semantic-variable layers.
- `assets/css/layouts.css` remains the shell, archive canvas, landing-entry, and responsive layout layer.
- `assets/css/components.css` remains the shared control, topbar/sidebar, archive-card, view-toggle, page-size, and footer component layer.
- `assets/css/note-detail.css` remains the note-detail and rendered-Markdown presentation layer.
- `assets/css/design.css` remains the Design archive-kind surface layer.
- No selector movement was made; future CSS movement should start from a concrete mixed-owner selector problem.

## Docs Structuring

- Operating mode:
  - `incremental`
- Changed owner docs:
  - `docs/policies/project/architecture.md`
  - `docs/policies/archive/note/archive-search-contract.md`
  - `docs/policies/archive/note/markdown-rendering.md`
  - `docs/policies/archive/note/note-data-contract.md`
  - `docs/policies/archive/note/note-maintenance-workflow.md`
  - `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Previously changed in the related JS-domain batch:
  - `docs/policies/project/developer-guide.md`
  - `docs/policies/system/icon.md`
  - `docs/policies/archive/note/markdown-rendering.md`
- Audited and left unchanged:
  - `AGENTS.md`
  - `docs/policies/project/policy.md`
  - `docs/policies/design/**`
  - `docs/policies/experience/interaction-evaluation.md`
  - `docs/policies/harness/**`
  - `assets/fonts/README.md`
  - `docs/README.md`
- Excluded:
  - `docs/agents/**`

## Docs Shaping

- `docs/policies/project/architecture.md` was reshaped from one flat runtime list into explicit sections for entry shells, generated runtime data, JavaScript ownership, CSS ownership, content shape, main paths, constraints, and maintenance flow.
- Archive note package links now use source-relative links instead of nested `docs/...` paths.
- `docs/policies/archive/note/markdown-rendering.md` now keeps level 5 and level 6 heading examples inside the supported-heading list.
- No design, experience, harness, or font docs were rewritten because the audit did not find package ownership drift.

## Validation

- Targeted checks:
  - command: `rg -n '\]\(docs/|\]\(assets/|\]\(README\.md\)|\]\(AGENTS\.md\)|\]\(DESIGN\.md\)' docs/policies docs/README.md README.md AGENTS.md assets/fonts/README.md`
  - result: `Pass, no nested repo-root-style Markdown links remained in the audited policy package docs`
  - command: `rg -n "assets/js/(icons|sidebar|topbar|shell-bootstrap|shell-handoff|main-landing|index-note-detail|note-detail-renderer|design-cards)\\.js" docs/policies docs/README.md README.md AGENTS.md index.html archive scripts assets -g '!docs/plans/**'`
  - result: `Pass, no stale old JavaScript path references remained outside plan history`
- Formatting:
  - Covered by the final `npm run lint` pass for Markdown-adjacent HTML/CSS/JS formatting scope where applicable.

## Risks / Limitations

- The CSS audit was structural and ownership-focused; it did not attempt full viewport visual parity beyond the browser smoke already run for the JS-domain batch.
- Package-doc shaping was targeted, not a full rewrite of every stable policy document.

## Next Action

- Continue deeper `assets/js/note/archive-controller.js` route/render splitting only through `docs/plans/refactoring/archive-js-structure-plan.md`.
- Start a separate docs-only pass if the owner later wants broader design or harness policy reshaping beyond the package-boundary changes needed here.
