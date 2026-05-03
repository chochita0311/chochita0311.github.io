# Unused JavaScript Symbol Cleanup Refactor Plan

## Purpose

Track a small behavior-preserving cleanup for the current JavaScript `no-unused-vars` lint warnings. The goal is to remove confirmed dead private symbols so lint output stays useful and future cleanup work does not have to rediscover the same warning set.

## Refactor Type

- Primary type: `Semantic`
- Parity target: `Behavior-preserving`
- Compare baseline: current `master` before this plan was added
- Baseline pin: `841e9dc3ec89dd1ae68a19a2369eae8d8f4cda0d`

## Scope

1. Remove or rehome the five current unused-symbol warnings reported by `npm run lint`:
   - `assets/js/note/archive-controller.js` at current path, formerly `assets/js/archive/content.js`: `SEARCH_DEBOUNCE_MS`
   - `assets/js/note/archive-controller.js` at current path, formerly `assets/js/archive/content.js`: `landingSearchField`
   - `assets/js/archive/route.js`: `encodeSegment`
   - `assets/js/note/detail-controller.js` at current path, formerly `assets/js/index-note-detail.js`: `detailRail`
   - `assets/js/landing/main.js` at current path, formerly `assets/js/main-landing.js`: `currentArchiveUrl`
2. Verify that similarly named active helpers remain intact:
   - `assets/js/note/search.js`: `DEFAULT_SEARCH_DEBOUNCE_MS`
   - `assets/js/landing/main.js`: active `landingSearchField` helper exposed through `window.MainLanding`
3. Keep the cleanup limited to private unused symbols and directly related reference checks.

## Non-Goals

- Do not change archive search behavior, debounce timing, route semantics, note detail rendering, landing behavior, or design route behavior.
- Do not change ESLint severity, suppress warnings with disable comments, or add `--max-warnings=0` as part of this cleanup.
- Do not introduce a bundler, module migration, or broader JavaScript ownership refactor.
- Do not perform unrelated formatting or naming churn.

## Invariants

- Functional: archive landing, note list, search, note detail, and design route navigation continue to work as they do at the baseline commit.
- Runtime: static script loading remains GitHub Pages compatible, and existing browser global contracts remain stable.
- Data: generated archive data, search index shape, URL query parameters, and note identifiers are unchanged.
- Lint: removing dead symbols should reduce warning noise without hiding any remaining issue through config changes.

## Planned Work

### Step 1 - Confirm Current Warning Baseline

Goal:
- Re-run the lint gate and confirm the current warning set before editing code.

Why this grouping:
- The cleanup is only safe if the target symbols are still the active warnings and no new warning category has become mixed into the task.

Guardrails:
- Do not edit files during this step.
- If new warnings appear, classify them separately before expanding scope.

Targets:
- `package.json`
- `configs/lint/eslint.config.js`
  - `assets/js/note/archive-controller.js`
- `assets/js/archive/route.js`
- `assets/js/note/detail-controller.js`
- `assets/js/landing/main.js`

Validation:
- `npm run lint`
- `rg -n "SEARCH_DEBOUNCE_MS|landingSearchField|encodeSegment|detailRail|currentArchiveUrl" assets/js`

Exit gate:
- The five listed symbols are confirmed as the cleanup target, or the plan is updated before implementation starts.

Status:
- Completed on 2026-05-03. `npm run lint` confirmed the expected five `no-unused-vars` warnings and no extra warning category before editing.

### Step 2 - Remove Confirmed Private Dead Symbols

Goal:
- Delete the unused constants and helpers that have no runtime callers.

Why this grouping:
- The listed symbols are private to their script files and can be reviewed as a low-blast-radius semantic cleanup.

Guardrails:
- Remove only the unused definitions identified in scope.
- Do not remove active similarly named helpers in other files.
- Do not change call sites, route builders, or search orchestration unless a reference audit proves that the symbol is not actually dead.

Targets:
  - `assets/js/note/archive-controller.js`
- `assets/js/archive/route.js`
- `assets/js/note/detail-controller.js`
- `assets/js/landing/main.js`

Validation:
- `node --check assets/js/note/archive-controller.js`
- `node --check assets/js/archive/route.js`
- `node --check assets/js/note/detail-controller.js`
- `node --check assets/js/landing/main.js`
- `npm run lint`

Exit gate:
- The five listed unused-symbol warnings are gone, and no replacement lint warnings are introduced in the touched files.

Status:
- Completed on 2026-05-03. Removed the five private unused symbols and preserved the active `assets/js/note/search.js` debounce owner plus the active `assets/js/landing/main.js` landing search field helper.

### Step 3 - Runtime Smoke Check Affected Surfaces

Goal:
- Confirm that deleting the unused symbols did not disturb the plain-script runtime.

Why this grouping:
- Static browser scripts can fail from load-order or global-contract mistakes even when syntax and lint checks pass.

Guardrails:
- Keep this smoke check focused on surfaces touched by the cleanup.
- Do not combine the smoke check with design or interaction changes.

Targets:
- `/`
- `/archive/`
- `/archive/note/`
- representative note detail query route
- `/archive/design/`

Validation:
- Root landing renders and landing search field behavior remains intact.
- Archive note list renders and topbar/landing search still reaches the expected archive search flow.
- A note detail route renders without JavaScript errors.
- Design route still opens from the topbar and returns to notes without JavaScript errors.
- Browser console has no new errors from the touched files.

Exit gate:
- Static checks pass, runtime smoke passes, and the working diff contains only the scoped cleanup.

Status:
- Completed on 2026-05-03 as part of the combined runtime-boundary cleanup batch. Browser smoke covered root landing, landing search, `/archive/`, `/archive/note/`, `/archive/note?category=English&collection=Langs%20Studio`, `/archive/note?id=1`, and `/archive/design/` with no console errors after root shell asset paths were normalized.

## Validation Gates

- Static validation:
  - `node --check` for each touched JavaScript file.
  - `npm run lint`.
- Reference audit:
  - `rg` confirms removed symbols no longer have stale references.
  - Active same-name or related helpers are preserved where still used.
- Runtime smoke:
  - Landing, archive list, search, note detail, and design route navigation still load without new console errors.
- Review focus:
  - Confirm this is deletion of private unused code, not a behavior rewrite.

## Intentional Deltas

- Remove confirmed private unused constants and helper functions.
- Reduce current lint warning noise.
- No intended user-visible behavior change.
- No intended lint configuration change.

## Risks / Open Questions

- `encodeSegment` may become useful again only if category or collection routing moves away from query parameters; that future route shape is outside this cleanup.
- `SEARCH_DEBOUNCE_MS` duplicates debounce ownership that currently lives in `assets/js/note/search.js`; cleanup should preserve the current search module as the owner.
- `landingSearchField` exists in both archive content and main landing contexts; remove only the unused archive content helper unless reference audit proves otherwise.
- Browser smoke is still needed because these files are plain scripts rather than imported modules with compile-time dependency checks.

## Exit Goal

`npm run lint` exits successfully without the five listed `no-unused-vars` warnings, affected JavaScript files pass syntax checks, and representative browser routes show no new runtime errors or behavior changes.
