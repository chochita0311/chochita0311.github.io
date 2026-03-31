# Init Design Startup Plan

## 1. Summary
- Project: `chochita0311.github.io` personal Markdown notes app.
- Current stage: notes-library baseline established in the layered CSS system, with the library screen cut over from inline Tailwind ownership.
- Starting artifact: the current desktop/mobile notes dashboard in `index.html`.
- Main design challenge: stabilize the refactored library screen and use it as the base for the next screen families without reintroducing product drift.
- Recommended immediate direction: treat the library shell as the active baseline, lock its implementation details through validation, and move next into the note detail/read family.

## 2. Constitution Status
- Constitution exists: yes; this run establishes the default `docs/designs/design-constitution.md` as the current durable baseline.
- Locked decisions already captured there: notes-first identity, warm paper plus blue accent, desktop/mobile shell continuity, stable screen families, and token-layered styling rules.
- Sections that still need to be written or revised: future changes tied to real product decisions such as metadata shape, write workflow, or navigation structure changes.

## 3. Starting Artifact
- Classification:
  - screen-plus-context
- Why this classification applies: the repository contains a visible first screen, product constraints in `AGENTS.md`, notes under `notes/`, existing token files under `assets/css/`, and current JavaScript that reveals entity drift.
- Main benefit of this starting point: it already demonstrates responsive shell assumptions, search emphasis, filter chips, browse density, pagination patterns, and a clear desktop/mobile relationship.
- Main risk of this starting point: it still mixes the note library with unrelated labels and modules such as boards, notifications, membership, and business-learning framing.

## 4. Current Deltas
- Product maturity:
  - MVP
- Context or constraint changes not yet reflected in the constitution: the implementation has been cut over to the layered CSS system and the validation evidence is now recorded; the library shell should now be treated as the active baseline.
- Backend and frontend alignment risks needing active follow-up: note metadata derivation, create/edit workflow boundaries, remaining legacy JS naming outside the library flow, and whether list controls like page size remain part of the stable information architecture.

## 5. Initial Artifact Extraction
- The artifact already establishes the main browse shell, search-led header, filter chips, list rows, pagination, and a clear desktop/mobile relationship.
- The artifact already points toward a warm-paper, blue-accent notes library rather than a multi-product workspace.
- Then validate against product and system constraints:
  - entity families: notes and collections fit; boards, notices, and membership do not
  - role-based screen families: not needed beyond the owner workflow
  - lifecycle states: list structure exists but empty, loading, and failure states are still implicit
  - validation and access patterns: edit behavior is still absent from the artifact

## 6. What Is Stable Already
- Locked decisions:
  - see the constitution for the durable shell, color direction, component baseline, and screen-family rules
- Reusable patterns already visible:
  - search input
  - filter chips
  - list/table container
  - pagination controls
  - floating mobile create action
- Constraints already clear:
  - lightweight implementation stack
  - no need for multi-user workflow
  - layered CSS now owns the active library-shell styling

## 7. What Is Not Stable Yet
- Missing token decisions: reading-mode typography detail and editor-specific spacing.
- Missing semantic decisions: destructive-action treatment, selected-row behavior, and state-panel styling for missing or failed note loads.
- Missing component boundaries: metadata editing surface, whether view-toggle controls survive the baseline, and whether the floating mobile create action belongs to every family or only the library screen.
- Missing compatibility decisions: canonical metadata model, filename generation strategy, and how editing works under static-site constraints.
- Drift risks: legacy naming in untouched JS/files can preserve the wrong product vocabulary even when the active library shell is aligned.

## 8. Active Screen Scope
- Current priority families:
  - Note library/list
  - Note detail/read
  - Note create/edit
- Why these families come first: they cover the product’s repeated jobs and expose the durable shell, state, metadata, and token decisions.
- What can be deferred: favorites, recent notes, public-read mode, and theme expansion.

## 9. Current Build Sequence
- `1.` Define and implement the note detail/read family using the now-stable shell, typography, and state model.
- `2.` Define the create/edit family after the metadata and file-handling model is explicit enough to avoid speculative UI.
- `3.` Clean up remaining legacy naming in untouched flows only when that work directly supports the next family.

## 10. Open Decisions
- Decisions needed before expansion:
  - what note metadata is canonical
  - whether page-size selection belongs in the stable browse UI
  - how note editing is implemented within static hosting constraints
- Decisions that can wait:
  - favorites and recent-note views
  - richer taxonomy beyond category and tags
- Decisions blocked by missing product context:
  - whether editing is local-only, generated, or externally assisted
  - whether note collections are folders, frontmatter values, or both

## 11. Risks And Unknowns
- Design risks: future work can still drift if new screens stop honoring the restored library-shell baseline and constitution.
- Technical risks: untouched flows still include legacy naming and older detail-page coupling outside the active library shell.
- Product risks: create/edit UI can become fake if the underlying note-write workflow is not clarified first.
- Unknowns requiring clarification: canonical metadata model, write workflow on GitHub Pages, and the long-term role of dark mode.

## 12. Immediate Next Actions
- `1.` Draft the note detail/read family before expanding secondary navigation or auxiliary modules.
- `2.` Clarify the canonical note metadata model and write workflow before real create/edit implementation.
- `3.` Decide whether page-size selection remains part of the stable browse IA before carrying it into additional screen families.

## 13. Versioning Note
- Design system status:
  - v0 draft
- If this run changes the constitution:
  - what changed: the library screen has now been cut over to the layered CSS system while preserving the original visual direction more closely through Playwright-based parity checks.
  - why it changed: the project needed the active notes library to move from exploratory inline styling into the shared CSS layers without turning the refactor into a design rewrite.
  - what should be updated next: the detail-screen baseline and metadata/write-workflow decisions.
