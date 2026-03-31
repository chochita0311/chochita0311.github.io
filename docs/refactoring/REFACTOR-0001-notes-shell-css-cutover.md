# Notes Shell CSS Cutover Refactor Plan

## Purpose

This plan tracks the refactor needed to make the layered CSS files under `assets/css/` the real design source of truth for the notes app, instead of leaving `index.html` and its inline Tailwind configuration as the effective design system. The objective is to preserve the core note-browsing behavior while intentionally removing non-note product framing and aligning implementation with the locked design constitution.

## Refactor Type

- Primary type: `Structural + Semantic`
- Parity target: `Behavior-preserving core browse flow with intentional semantic cleanup`
- Compare baseline: `Current repository state on 2026-03-31, anchored to docs/designs/design-constitution.md, docs/designs/plan.md, assets/css/*, and index.html`

## Scope

1. Align primitive and semantic CSS tokens with the currently locked design constitution.
2. Rename and reshape board-oriented component and layout styling into note/library-oriented shared patterns.
3. Refactor `index.html` to consume `assets/css/app.css` as the canonical note library shell and remove inline Tailwind-driven design logic.

## Non-Goals

- Building the full note detail or note create/edit screens in this track.
- Introducing new product features such as favorites, recent notes, public-read mode, or dark theme.
- Redesigning the locked design constitution beyond implementation-alignment edits that are already implied by the current documents.
- Rewriting note data loading behavior beyond the minimum markup/class changes required for the library screen refactor.

## Invariants

- Functional: note-library browsing remains the active primary experience; search input, note list rendering, pagination controls, and list selection continue to exist after the refactor.
- Functional: the UI remains notes-first and does not reintroduce board, membership, notification-center, or unrelated business-product framing.
- Runtime: the static-site model remains unchanged; the app must continue to load as plain HTML/CSS/JS without adding a build step or framework dependency.
- Runtime: existing JavaScript wiring for list rendering and interaction remains reviewable and testable during the cutover rather than being silently replaced by a new interaction model.
- Data: current note metadata assumptions remain provisional in the plan, but the UI continues to support title, category/tag, date, and note-body oriented presentation.

## Planned Work

### Step 1 - Align tokens and semantics to the constitution

Goal:
- Make `assets/css/tokens.css` and `assets/css/semantic.css` reflect the locked constitution so the CSS layer no longer contradicts the design documents.

Why this grouping:
- Token and semantic alignment is the narrowest safe first batch because it reduces ambiguity before any HTML or component refactor depends on those variables.

Guardrails:
- Do not introduce new product features or optional themes in this step.
- Do not refactor page markup in this step.
- Do not rename broad component/layout classes until token and semantic naming is stable enough to support them.

Targets:
- `assets/css/tokens.css`
- `assets/css/semantic.css`
- `assets/css/design-tokens.css`
- `docs/designs/design-constitution.md`
- `docs/designs/plan.md`

Validation:
- Manual parity check between constitution primitives/semantics and the CSS variables.
- Static review that removed or renamed variables are not still required by `components.css`, `layouts.css`, or `index.html`.
- Browser smoke after the later markup cutover to confirm tokens remain consumable.

Exit gate:
- The token and semantic files no longer contradict the constitution on reading font, optional dark-theme primitives, page/surface meaning, or board-specific semantic names.

### Step 2 - Replace board-oriented CSS structure with notes-shell semantics

Goal:
- Convert shared component and layout styling from board-specific naming and assumptions into reusable note/library-oriented patterns that match the constitution.

Why this grouping:
- This batch is still mostly structural, but it has a wider blast radius than token alignment because classes and layout abstractions become dependencies for the page markup.

Guardrails:
- Preserve the browse-screen behavior and information architecture while renaming or reshaping CSS ownership.
- Do not merge note-detail or note-editor styling into this batch unless required for shared primitives only.
- Do not leave mixed board and note naming in the same active layer after the step closes.

Targets:
- `assets/css/components.css`
- `assets/css/layouts.css`
- `assets/css/base.css`
- `assets/css/app.css`

Validation:
- Static search that board-oriented names such as `board-*`, `posts-*`, or similar legacy shell terms are either removed or intentionally isolated for untouched JS-only behavior.
- Browser smoke on desktop and mobile breakpoints after `index.html` is migrated.
- Review focus on preserving shared browse interactions while clarifying ownership between semantic tokens, components, and layouts.

Exit gate:
- Shared CSS naming is note/library-oriented, layered CSS ownership is clearer, and no critical browse-screen styling still depends on board-specific component abstractions.

### Step 3 - Cut over index.html to the layered CSS shell

Goal:
- Make `index.html` the canonical note library screen using `assets/css/app.css`, while removing inline Tailwind design configuration and non-note product drift.

Why this grouping:
- This is the highest-risk batch because it changes the real entrypoint and validates whether the new CSS layers are sufficient in practice.

Guardrails:
- Preserve the core browse experience: search, note list, category/filter controls, pagination, and responsive shell continuity.
- Intentional semantic cleanup is allowed only for removing unrelated dashboard framing, board vocabulary, notification/membership chrome, and similar non-note modules.
- Do not mix in note-detail implementation, editor implementation, or metadata-model redesign.

Targets:
- `index.html`
- Any directly coupled client-side script block or inline script used by `index.html`
- `assets/css/app.css`
- `assets/css/components.css`
- `assets/css/layouts.css`

Validation:
- Manual smoke in desktop and mobile viewport widths.
- Check that the page loads without Tailwind CDN or inline Tailwind config.
- Verify search, list rendering, pagination controls, and selection/active states still function.
- Static search to confirm note-facing copy and classes no longer expose obvious board/membership/product-suite drift.

Exit gate:
- `index.html` renders from the layered CSS stack, the note library shell remains functional, and the page no longer depends on inline Tailwind design logic.

## Validation Gates

- Build or static validation:
  - HTML/CSS/JS syntax remains valid.
  - `rg` checks confirm removal of stale board-oriented design names from the active UI surface where intended.
- Tests:
  - Targeted runtime smoke on the note library flow: load page, inspect note list render, change page size if still present, paginate, select/open a note if the current screen supports it.
- Review focus:
  - constitution-to-CSS parity
  - notes-first semantic cleanup versus accidental behavior change
  - responsive shell continuity
  - client-visible regression in list rendering, pagination, or selection

## Intentional Deltas

- Remove non-note product framing from the current shell, including board, membership, notification-center, and unrelated business-learning cues.
- Replace inline Tailwind-driven design ownership with layered CSS ownership under `assets/css/`.
- Normalize shared naming toward notes/library semantics even where the current code still reflects earlier board-oriented terminology.

## Risks / Open Questions

- Current JS may still encode board-oriented assumptions, so class or markup cleanup in `index.html` may expose coupling that is not visible from CSS alone.
- The current plan still leaves metadata-model decisions open, which limits how far the list row and editor semantics can be finalized in this track.
- The current constitution leaves dark theme outside the locked baseline, so any existing dark-style code must be treated carefully rather than casually preserved or expanded.
- It is still open whether page-size controls belong in the stable browse IA, so that control should be preserved cautiously or isolated for later removal rather than silently dropped.

## Exit Goal

The repo reaches a mergeable state where `docs/designs/design-constitution.md` matches the CSS layer, `assets/css/` owns the notes library design system cleanly, and `index.html` serves as the notes-first library screen without inline Tailwind design ownership or unrelated dashboard drift.

## Handoff to Next Track

- After this track closes, the next refactor track should cover the note detail/read family and any follow-up decisions that depend on the canonical metadata model or write workflow.
