# Archive JS Structure Refactor Plan

## Purpose

Prepare the archive runtime for continued growth by splitting `assets/js/archive/content.js` into clearer ownership boundaries before the current monolith becomes too risky to extend.

## Refactor Type

- Primary type: Structural
- Secondary type: Interface
- Behavior target: Preserve current archive, landing, search, and detail behavior while introducing clearer JavaScript boundaries.

## Scope

- In scope:
  - JavaScript runtime structure for the archive entry page
  - Clearer ownership boundaries between landing lifecycle, archive orchestration, search control, and list/detail rendering
  - Script loading order updates needed to support new split files
  - Minimal documentation for the refactor track
- Initial verified targets:
  - `assets/js/archive/content.js`
  - `index.html`
  - Any newly added archive runtime files under `assets/js/`
- Out of scope for this track:
  - Full behavioral redesign of landing, search, or list/detail flows
  - Replacing the static multi-script model with bundling or framework modules
  - CSS restructuring beyond what is required to keep runtime ownership clear

## Non-Goals

- Do not introduce a build step.
- Do not migrate the site to ESM-only loading if that complicates GitHub Pages compatibility.
- Do not change search semantics, route semantics, or landing rules as part of the structural split.
- Do not mix route-flash fixes from `prd-0008` into this track unless a split requires a tiny compatibility adjustment.

## Invariants

- Keep GitHub Pages compatible static delivery.
- Preserve current URL handling for root landing, canonical archive paths, grid/list view, and note detail.
- Preserve current landing behavior on desktop and bypass behavior on non-root or narrow widths.
- Preserve current topbar search behavior and landing search behavior.
- Preserve existing script-to-script global contracts such as `window.NoteDetailRenderer` and `window.IndexNoteDetail`.

## Planned Work

## Phase 1: Extract Landing Lifecycle

- Goal: Move landing-specific runtime logic out of `archive-content.js` into a dedicated archive landing module.
- Why this grouping: The landing logic is the clearest bounded slice and already has strong DOM and lifecycle cohesion.
- Guardrails:
  - Preserve the current landing DOM contract in `index.html`.
  - Keep the API small and explicit rather than moving unrelated archive logic into the new file.
  - Do not change landing visuals or route behavior intentionally.
- Targets:
  - `assets/js/archive/content.js`
  - New `assets/js/main-landing.js`
  - `index.html`
- Validation:
  - `node --check` passes for touched JS files.
  - Desktop root still shows landing.
  - `/archive/` still bypasses landing.
  - Landing search controls still function.
- Exit gate:
  - Landing lifecycle code is no longer defined inline in `archive-content.js`, and the archive orchestrator depends on a clear landing API instead.
- Status:
  - Completed on 2026-04-19 through `assets/js/main-landing.js`.

## Phase 2: Split Search Orchestration

- Goal: Separate shared archive search orchestration from general archive page rendering.
- Why this grouping: Search behavior spans topbar and landing entry and should become independently maintainable after landing extraction.
- Guardrails:
  - Keep one canonical search logic path.
  - Avoid duplicating topbar and landing search implementations.
  - Preserve current debounce and manual-submit behaviors.
- Targets:
  - `assets/js/archive/content.js`
  - New `assets/js/archive/search.js`
- Validation:
  - Search still works from topbar and landing.
  - Route updates and search results remain unchanged.
- Exit gate:
  - Search control and search execution no longer live in the main archive orchestration file.
- Status:
  - Completed on 2026-04-19 through `assets/js/archive/search.js`.

## Phase 3: Split Archive Routing And Rendering

- Goal: Reduce `archive-content.js` to a thin entry orchestrator with rendering and route-state concerns moved behind clearer file boundaries.
- Why this grouping: Rendering and route orchestration are the remaining heavy responsibilities once landing and search are separated.
- Guardrails:
  - Preserve current state model unless an explicit child track approves a change.
  - Keep rendering ownership understandable: list, detail handoff, pagination, and location sync should have explicit homes.
  - Avoid creating several new opaque files without clear purpose.
- Targets:
  - `assets/js/archive/content.js`
  - New route/render helper files under `assets/js/`
- Validation:
  - List view, grid view, detail view, pagination, and category navigation still work.
  - Browser smoke checks cover representative archive flows.
- Exit gate:
  - `archive-content.js` acts mainly as boot/orchestration glue rather than the main implementation home for every archive concern.

## Validation Gates

- `node --check` passes for every touched JS file in each phase.
- Script load order remains valid in `index.html`.
- Representative runtime smoke checks cover:
  - root landing
  - archive bypass
  - topbar search
  - landing search
  - category navigation
  - note detail open
- Documentation stays aligned with structural ownership changes when a new boundary becomes durable.

## Intentional Deltas

- Introduce dedicated archive runtime modules before the page logic grows further.
- Prefer explicit global APIs between static scripts over one continually expanding monolith.

## Risks / Open Questions

- Because the app is still plain browser scripts, poor API boundaries could replace one monolith with several tightly coupled files if the split is careless.
- Future phases should decide whether shared archive state also needs a dedicated owner module or whether orchestration can remain centralized.
- If route-flash work lands in parallel later, module boundaries may need minor follow-up adjustment.

## Exit Goal

The archive page runtime has clear growth-oriented JavaScript boundaries, starting with landing lifecycle extraction, while current behavior remains stable and GitHub Pages compatibility stays intact.

## Handoff To Next Track

- After Phase 1, continue with search and route/render splits only if the new boundaries remain meaningfully separate and do not reintroduce opaque cross-file coupling.
