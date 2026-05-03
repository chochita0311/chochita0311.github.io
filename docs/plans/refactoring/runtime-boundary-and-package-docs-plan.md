# Runtime Boundary And Package Docs Refactor Plan

## Purpose

Create a bounded refactor track for reducing ambiguity as the static archive grows. This plan covers inactive placeholder/source-copy cleanup, runtime JavaScript and CSS ownership, and package/subsystem documentation structure. It does not authorize feature implementation; each step still needs normal owner approval before code or document reshaping starts.

## Refactor Type

- Primary type: `Structural`
- Secondary type: `Semantic`
- Parity target: `Behavior-preserving` for published runtime behavior, with intentional repo-surface deltas only for files proven inactive or docs whose wording is reshaped without meaning changes.
- Compare baseline: current `master` state at plan creation.
- Baseline pin: `841e9dc3ec89dd1ae68a19a2369eae8d8f4cda0d`
- Baseline note: the working tree already contains untracked `docs/plans/refactoring/unused-js-symbol-cleanup-plan.md`; that file is outside this track unless explicitly adopted later.

## Scope

1. Classify current placeholder, parked, reference, duplicated-shell, and source-copy files before deleting anything.
2. Clarify whether `index.html`, `archive/index.html`, `archive/note/index.html`, and `archive/design/index.html` are active entry shells, removable copies, or candidates for a later shared shell source.
3. Keep `assets/js/` as the static runtime JavaScript root, but plan clearer subfolder boundaries by usage and domain.
4. Audit current CSS layering under `assets/css/` and split or re-home rules only where ownership is genuinely mixed.
5. Restructure and reshape package/subsystem docs that own durable runtime, archive, design, system, and asset guidance.
6. Audit `AGENTS.md` and `docs/policies/harness/**` for policy-layer drift, but change them only if the audit finds real ownership or organization problems.
7. Exclude agent-package docs and planning docs from the documentation pass.

## Non-Goals

- Do not treat active screen-visible elements, actual runtime logic, or generated runtime data as removable placeholder material.
- Do not delete active published entry files just because their markup is duplicated.
- Do not keep unused `example.html`-style source copies, demo pages, or no-reference artifacts just because they resemble earlier implementation sources.
- Do not introduce a framework, bundler, template compiler, or required build step for GitHub Pages.
- Do not change search semantics, note identity, route semantics, landing behavior, design-card behavior, or note rendering behavior as part of structural movement.
- Do not reshape `docs/agents/**` or `docs/plans/**` in this track.
- Do not reshape `AGENTS.md` or `docs/policies/harness/**` unless the documentation audit proves they are participating in package-doc ownership drift.
- Do not perform unrelated visual redesign, broad formatting churn, or package modernization.
- Do not reinterpret this plan as approval to implement all phases without an approved execution boundary.

## Invariants

- Functional: `/`, `/archive/`, `/archive/note/`, `/archive/design/`, category routes, collection routes, note detail routes, landing search, topbar search, sidebar navigation, and design handoff keep current user-visible behavior.
- Runtime: static GitHub Pages delivery remains compatible; active entry files continue to work on direct entry and refresh; plain-script global contracts and load order remain valid.
- Runtime globals: `window.AppIcons`, `window.ArchiveRoutes`, `window.ArchiveTaxonomy`, `window.TopbarController`, `window.ShellHandoff`, `window.NoteDetailRenderer`, `window.IndexNoteDetail`, `window.MainLanding`, `window.NoteSearch`, `window.NoteArchiveControls`, `window.NoteArchiveListRenderer`, `window.NoteArchivePopularTags`, and `window.ArchiveSearch` remain available to existing consumers until a later approved migration changes the contract.
- Data: `NOTES/` remains the durable Markdown source; `assets/generated/archives-index.json`, `assets/generated/archives-search-index.json`, `sitemap.xml`, and `robots.txt` remain generated or crawl-support artifacts, not hand-maintained content stores.
- CSS: `assets/css/app.css` remains the import entry unless a later approved step replaces it; token, semantic, layout, component, note-detail, and design ownership stay explicit.
- Documentation: durable rules stay under `docs/policies/`; active sequencing stays under `docs/plans/`; package/subsystem docs are shaped with meaning preservation.

## Planned Work

### Step 1 - Placeholder And Source-Copy Inventory

Goal:
- Build a decision table that classifies each candidate as `active runtime`, `active screen-visible placeholder`, `active runtime data`, `inactive reference`, `unused source-copy/example artifact`, `parked stale asset`, or `safe deletion candidate`.

Why this grouping:
- The repo has both active duplicated shell HTML and inactive/reference artifacts. Deletion is only safe after those categories are separated.

Guardrails:
- Protect anything still used by an actual screen, visible placeholder state, route entry, event flow, script load order, generated-data contract, or runtime fetch path.
- Do not include `assets/generated/archives-search-index.json` or `assets/generated/archives-index.json` in placeholder cleanup; those are generated runtime data, not source-copy leftovers.
- Unused `example.html` files, demo pages, copied initial-source HTML, and no-reference helper files may be removed after the reference audit proves they do not support an active route or logic path.
- Do not treat duplicated shell markup as dead code until every published entry URL has a replacement or confirmed no-use status.
- Do not remove public-but-reference files such as `assets/icons.html` without deciding whether their public URL should remain available.
- Remove parked stale assets when the owner explicitly decides the restore value is no longer needed.

Targets:
- `index.html`
- `archive/index.html`
- `archive/note/index.html`
- `archive/design/index.html`
- `assets/icons.html`
- `assets/js/page-footer.js`
- `stale/stale.md`
- `stale/assets/config/archive-descriptions.json`
- topbar placeholder destinations in the active entry shells

Validation:
- `rg` reference audit for every deletion candidate.
- `git ls-files` check to distinguish tracked runtime files from ignored local scratch files.
- Browser smoke for `/`, `/archive/`, `/archive/note/`, and `/archive/design/` before any candidate is removed.
- Documented disposition table with one owner decision per candidate.

Exit gate:
- No file is deleted until it has a recorded classification, reference audit result, and route-impact judgment.

Status:
- Initial cleanup completed on 2026-05-03.
- Removed `assets/icons.html` as an unreferenced public reference/demo page with no active route, script, fetch, or docs-map dependency outside this refactor plan.
- Removed `assets/js/page-footer.js` as an unreferenced helper with no active script tag or `data-page-footer` mount.
- Removed `stale/stale.md` and `stale/assets/config/archive-descriptions.json` after the owner confirmed the parked restore context is no longer needed.
- Retained the active visible placeholder states in the shell, including loading, empty, disabled navigation, and search states.

### Step 2 - Active Shell Boundary Decision

Goal:
- Decide whether the duplicated HTML shell across root and archive entries should remain as explicit static entry files or move toward a shared source pattern.

Why this grouping:
- `index.html`, `archive/index.html`, and `archive/note/index.html` are near-copies, but they currently serve distinct direct-entry paths and route metadata. This is active runtime duplication, not automatically removable placeholder code.

Guardrails:
- Keep direct-entry and refresh behavior stable.
- Keep route-specific metadata, canonical URLs, and relative asset paths correct.
- Avoid JavaScript-only shell injection if it would create route flash, SEO regression, or accessibility regression.
- Do not add a build requirement unless a later approved plan changes the static-first constraint.

Targets:
- `index.html`
- `archive/index.html`
- `archive/note/index.html`
- `archive/design/index.html`
- `docs/policies/project/architecture.md`
- `docs/policies/project/developer-guide.md`

Validation:
- Diff shell regions and route-specific metadata so intentional differences are explicit.
- Smoke direct entry and refresh for all published entry URLs.
- Confirm script order and stylesheet order remain equivalent where entries share runtime behavior.

Exit gate:
- Active shell ownership is documented, and any retained duplication is intentional rather than ambiguous source-copy drift.

Status:
- Partial execution on 2026-05-03. Active entry shells were retained. `index.html` asset references were normalized to root-absolute `/assets/...` paths after runtime smoke showed the root landing history transition could otherwise resolve a relative favicon path under `/archive/assets/...`.

### Step 3 - JavaScript Domain Structure

Goal:
- Keep `assets/js/` as the correct GitHub Pages runtime asset root while grouping files by domain and usage so future growth is easier to reason about.

Why this grouping:
- The current placement under `assets/js/` is appropriate for a static site, but root-level runtime files mix shell, note, archive, landing, design, and shared concerns. Note browse/search logic also should not stay under `archive/` if archive becomes a broader content container.

Guardrails:
- Preserve the plain-script model unless a future approved plan changes it.
- Move one dependency cluster at a time and update every script tag in the same step.
- Keep public globals stable while files move.
- Continue the existing `archive-js-structure-plan.md` intent rather than duplicating or contradicting it.
- Do not combine file moves with behavior edits.

Targets:
- `assets/js/archive/content.js`
- `assets/js/archive/search.js`
- `assets/js/archive/route.js`
- `assets/js/main-landing.js`
- `assets/js/sidebar.js`
- `assets/js/topbar.js`
- `assets/js/shell-bootstrap.js`
- `assets/js/shell-handoff.js`
- `assets/js/index-note-detail.js`
- `assets/js/note-detail-renderer.js`
- `assets/js/design-cards.js`
- `assets/js/icons.js`
- `assets/js/page-footer.js`
- script tags in active HTML entry files

Validation:
- Old-path to new-path source map before moving files.
- `node --check` for every moved or edited JavaScript file.
- `npm run lint`.
- Browser console smoke for root landing, archive list, category, collection, note detail, topbar search, landing search, sidebar navigation, and design route handoff.
- `rg` confirms no stale script paths remain.

Exit gate:
- Runtime JavaScript has a clear domain map, `assets/js/` remains the static asset root, archive-wide routing remains separate from note browse/search code, and any further detail-route or state-boundary splitting is explicitly handed off to the existing archive JS structure track.

Status:
- First domain move completed on 2026-05-03.
- `assets/js/` remains the static runtime JavaScript root.
- Shared runtime icons now live under `assets/js/shared/icons.js`.
- Shell runtime files now live under `assets/js/shell/`: `bootstrap.js`, `sidebar.js`, `topbar.js`, and `handoff.js`.
- Root landing runtime now lives under `assets/js/landing/main.js`.
- Note runtime files now live under `assets/js/note/`: `archive-controller.js`, `search.js`, `list-renderer.js`, `view-controls.js`, `popular-tags.js`, `detail-renderer.js`, and `detail-controller.js`.
- Design runtime now lives under `assets/js/design/cards.js`.
- Archive runtime now keeps only archive-wide route grammar under `assets/js/archive/route.js`.
- `assets/js/note/archive-controller.js` has been reduced toward state/data/location orchestration; `docs/plans/refactoring/archive-js-structure-plan.md` now owns any further detail-route extraction.
- `assets/js/note/search.js` publishes `window.NoteSearch` and keeps `window.ArchiveSearch` as a compatibility alias for existing plain-script consumers.
- Updated active script tags, icon-control tooling, and durable policy docs to the new paths.

### Step 4 - CSS Layer Boundary Audit

Goal:
- Decide whether the current CSS structure is still healthy, then split or re-home rules only where a file has mixed ownership that slows maintenance.

Why this grouping:
- The current CSS layers are conceptually sound, but `components.css`, `layouts.css`, `note-detail.css`, `design.css`, and handoff rules in `app.css` need an ownership audit as new surfaces are added.

Guardrails:
- Treat this as structural CSS movement, not visual redesign.
- Preserve import order and cascade behavior.
- Keep `tokens.css`, `semantic.css`, and `base.css` stable unless a rule clearly belongs elsewhere.
- Do not move selectors only for aesthetic file-size symmetry.
- Do not change design tokens without updating the design constitution in the same approved execution step.

Targets:
- `assets/css/app.css`
- `assets/css/tokens.css`
- `assets/css/base.css`
- `assets/css/semantic.css`
- `assets/css/layouts.css`
- `assets/css/components.css`
- `assets/css/note-detail.css`
- `assets/css/design.css`
- HTML class contracts in active entry files

Validation:
- Selector ownership map for shell, archive list, note detail, design surface, shared controls, and transitions.
- `npm run format:check`.
- Browser visual smoke at representative desktop and mobile widths for archive list, grid view, note detail, landing, and design surface.
- `rg` check for stale class or stylesheet references after any split.

Exit gate:
- CSS ownership is explicit enough for future additions, and any split has proven no visible drift on the active routes.

Status:
- Ownership audit completed on 2026-05-03.
- No selector movement was made in this batch because the current layers are still coherent:
  - `tokens.css`, `base.css`, and `semantic.css` keep primitive, browser-base, and semantic-variable ownership separate.
  - `layouts.css` owns shell, archive canvas, landing-entry layout, and responsive layout structure.
  - `components.css` owns shared reusable controls, topbar/sidebar components, archive cards, view toggles, page-size controls, and footer component styling.
  - `note-detail.css` owns note-detail presentation and Markdown-rendered body styling.
  - `design.css` owns the Design archive-kind surface.
  - `app.css` owns import order and cross-surface Notes/Design handoff transition classes.
- `docs/policies/project/architecture.md` was updated to make the `app.css` handoff ownership and `note-detail.css` path explicit.
- A future split should be driven by a concrete mixed-owner selector problem, not by file size alone.

### Step 5 - Package Docs Structuring Pass

Goal:
- Use `docs-structuring` in incremental mode to assign package/subsystem documentation ownership before reshaping individual docs.

Why this grouping:
- Structuring should happen before wording reshapes so each durable fact has one owner and repeated guidance is replaced by links instead of paraphrase drift.

Guardrails:
- Exclude `docs/agents/**` and `docs/plans/**`.
- Include `AGENTS.md` and `docs/policies/harness/**` as audit-only policy-layer inputs; leave them unchanged if they are already well organized.
- Change `AGENTS.md` or `docs/policies/harness/**` only when the audit finds duplicated durable rules, stale routing, or ownership drift that affects package/subsystem docs.
- Do not introduce a broad new documentation hierarchy unless an audit proves the current `docs/policies/` package layout cannot carry the growing structure.
- Suggest optional splits first when multiple valid structures are plausible.
- Keep project-level docs concise and push subsystem detail to the owning subsystem doc.

Targets:
- `docs/policies/project/architecture.md`
- `docs/policies/project/developer-guide.md`
- `docs/policies/project/policy.md`
- `AGENTS.md` as audit-only unless drift is found
- `docs/policies/harness/**` as audit-only unless drift is found
- `docs/policies/archive/note/archive-search-contract.md`
- `docs/policies/archive/note/markdown-rendering.md`
- `docs/policies/archive/note/note-data-contract.md`
- `docs/policies/archive/note/note-maintenance-workflow.md`
- `docs/policies/design/design-document-governance.md`
- `docs/policies/design/design-constitution.md`
- `docs/policies/design/design-evaluation.md`
- `docs/policies/experience/interaction-evaluation.md`
- `docs/policies/system/icon.md`
- `assets/fonts/README.md`
- `docs/README.md` only when navigation links must change

Validation:
- Doc-role map with file, role, owner layer, current problem, and planned action.
- `before -> after` structure summary for applied changes.
- Cross-link audit for changed docs.
- Confirmation that `docs/agents/**` and `docs/plans/**` were not reshaped.
- Confirmation that `AGENTS.md` and `docs/policies/harness/**` were either unchanged because they were already organized enough or changed only with a recorded drift reason.

Exit gate:
- Package/subsystem doc ownership is clear enough that shaping can proceed doc-by-doc without moving facts to the wrong layer.

Status:
- Incremental structuring pass completed on 2026-05-03.
- Doc-role map:
  - `AGENTS.md`: entrance-map and operational routing; audited only, unchanged.
  - `docs/policies/project/architecture.md`: runtime ownership map; reshaped around entry shells, generated data, JavaScript ownership, CSS ownership, content shape, paths, constraints, and maintenance flow.
  - `docs/policies/project/developer-guide.md`: operational maintenance guide; updated only for the icon registry path and otherwise left stable.
  - `docs/policies/project/policy.md`: product scope and change-expectation owner; left stable.
  - `docs/policies/archive/note/*`: note data, maintenance, rendering, and search contract package; relative cross-links and a Markdown heading-list structure issue were fixed.
  - `docs/policies/design/*`: design governance, constitution, and evaluation package; audited as stable in this pass.
  - `docs/policies/experience/interaction-evaluation.md`: reusable interaction-evaluation asset package; audited as stable in this pass.
  - `docs/policies/system/icon.md`: icon governance package; updated for the shared registry path and left otherwise stable.
  - `assets/fonts/README.md`: font asset evidence package; audited as stable in this pass.
  - `docs/policies/harness/**`: policy-like harness docs; audited as organized enough and unchanged.
- `docs/agents/**` was not read for reshaping and was not changed.
- `docs/README.md` did not need navigation changes for this batch.

### Step 6 - Package Docs Shaping Pass

Goal:
- Use `docs-shaping` in `reshape` mode on the targeted package/subsystem docs after ownership is clear.

Why this grouping:
- Several durable docs are useful but long or historically accumulated. Shaping should improve flow, headings, and repeated explanations while preserving force words and meaning.

Guardrails:
- Apply the minimum effective restructuring.
- Leave stable docs unchanged when no meaningful composition improvement exists.
- Preserve `must`, `should`, `only`, `never`, and `unless` language.
- Do not invent new policy or strategy during shaping.
- Do not reshape `docs/agents/**` or `docs/plans/**` in this track.
- Do not reshape `AGENTS.md` or `docs/policies/harness/**` unless Step 5 records a concrete package-doc ownership problem.

Status:
- Targeted reshape pass completed on 2026-05-03.
- `docs/policies/project/architecture.md` received the main content-level reshape because it was the package doc most affected by the runtime boundary change.
- `docs/policies/archive/note/archive-search-contract.md`, `docs/policies/archive/note/note-data-contract.md`, and `docs/policies/archive/note/note-maintenance-workflow.md` had nested-doc links corrected to local relative links.
- `docs/policies/archive/note/markdown-rendering.md` had the supported heading list reshaped without changing renderer behavior.
- Stable docs were left unchanged where reshaping would have added churn without improving ownership or navigation.

Targets:
- The Step 5 target docs that the structuring pass marks as needing content-level reshaping.

Validation:
- Changed-files versus unchanged-stable-files report.
- Composition diagnosis for each changed doc or doc set.
- Preservation check for constraints, exceptions, examples, links, and force words.
- Resulting outline review for each reshaped doc.

Exit gate:
- Package/subsystem docs read as deliberate owner docs, not accumulated notes, and no unique guidance is lost.

### Step 7 - Runtime Ownership Docs And Closure

Goal:
- Update durable owner docs and close the refactor track with evidence once runtime and package-doc boundaries have changed.

Why this grouping:
- Structural refactors become stale quickly if architecture and developer workflow docs still describe the old file layout.

Guardrails:
- Update only the document that owns the changed fact.
- Do not rewrite unrelated historical plans.
- Record execution logs only for actual refactor steps that change code or docs, not for speculative future work.

Targets:
- `docs/policies/project/architecture.md`
- `docs/policies/project/developer-guide.md`
- `docs/README.md` if package navigation changes
- `docs/plans/refactoring/logs/` if implementation steps create durable execution evidence
- this plan file

Validation:
- `rg` stale-path audit for moved JS, CSS, and docs paths.
- Active route smoke results are recorded before marking runtime steps complete.
- Documentation links resolve by inspection for changed files.

Exit gate:
- Runtime structure, docs structure, and this plan agree on the final boundaries, with residual risks and any handoff work recorded.

## Validation Gates

- Static validation:
  - `node --check` for every moved or edited JavaScript file.
  - `npm run lint`.
  - `npm run format:check`.
- Runtime smoke:
  - `/`
  - `/archive/`
  - `/archive/note/`
  - `/archive/note?category=<known-category>`
  - `/archive/note?category=<known-category>&collection=<known-collection>`
  - `/archive/note?id=<known-note-id>`
  - `/archive/design/`
- Reference audits:
  - `rg` for stale script, stylesheet, class, docs, and public asset paths after each move.
  - `git ls-files` for deletion candidates before removal.
- Parity audit coverage:
  - source mapping for any moved JS file from old path to new path.
  - script load-order comparison before and after moves.
  - route and direct-refresh behavior checked for every active entry shell touched.
  - side effects checked for history updates, canonical link updates, sidebar/topbar events, session storage handoff flags, and generated-index fetches.
- Documentation validation:
  - docs-structuring role map and `before -> after` summary for package docs.
  - docs-shaping preservation report for each reshaped doc set.
  - `docs/agents/**` and `docs/plans/**` confirmed untouched.
  - `AGENTS.md` and `docs/policies/harness/**` audit outcome recorded, including no-change decisions when they are already organized enough.

## Intentional Deltas

- Confirmed inactive placeholders, copied source examples, demo pages, or no-reference helper files may be removed after audit and owner approval.
- Runtime JavaScript may move into clearer domain folders under `assets/js/`.
- CSS rules may move between existing or newly approved CSS owner files when ownership is mixed.
- Package/subsystem docs may be restructured and reshaped while preserving meaning.
- No intended user-visible behavior change for the published app.

## Risks / Open Questions

- `index.html`, `archive/index.html`, and `archive/note/index.html` look like source copies but are currently active static entry shells; deleting them without a replacement would break published routes.
- Some visible placeholders are intentional runtime states, such as loading text, empty states, and disabled future nav links; those should not be removed under source-copy cleanup unless their owning feature scope changes.
- Initial cleanup removed `assets/icons.html`; this intentionally removes a public but unlinked reference/demo URL.
- Initial cleanup removed `assets/js/page-footer.js` after confirming no active script tag or `data-page-footer` mount.
- `stale/` was removed after the human owner decided the prior hero-copy restore context is no longer needed.
- Plain browser scripts have no import graph, so script order and global names are the main runtime coupling risk when moving files.
- CSS cascade movement can change visuals even when selectors and declarations are unchanged.
- The current JavaScript folder taxonomy is `archive`, `shell`, `landing`, `note`, `design`, and `shared`; future additions should either fit those domains or add a new package with explicit ownership.
- The package docs pass needs a first audit to decide whether each target doc needs shaping or should stay stable.
- Initial audit on 2026-05-03 found `AGENTS.md` and `docs/policies/harness/**` organized enough for this track; leave them unchanged unless a later package-doc audit finds concrete routing, duplication, or ownership drift.

## Exit Goal

The repo has explicit runtime boundaries for active entry shells, JavaScript, CSS, and package/subsystem docs. Confirmed inactive placeholders and unused source-copy examples are removed or deliberately parked, `assets/js/` remains an intentional static runtime asset root, CSS ownership is documented, package docs are structured and shaped without touching agent-package or planning docs, and published site behavior remains stable.

## Handoff to Next Track

- Further note archive state, rendering, and detail-route splitting belongs in `docs/plans/refactoring/archive-js-structure-plan.md` or a narrower successor track that uses this plan as the source-mapping baseline.
- If Step 5 finds that package docs need a new hierarchy rather than incremental cleanup, stop and request owner approval before applying a larger documentation restructure.
