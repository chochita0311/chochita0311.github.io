# Runtime Boundary And Unused Cleanup Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/unused-js-symbol-cleanup-plan.md`
- Related track: `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Scope: unused JavaScript symbols, inactive source/reference artifacts, and root shell asset path normalization

## Summary

- Goal:
  - Remove confirmed unused private JavaScript symbols and clear proven no-use source/reference artifacts without changing published archive behavior.
- Outcome:
  - `Pass`
- Short conclusion:
  - The lint warning cleanup completed, two inactive tracked artifacts were removed, and root landing asset paths were normalized after smoke testing exposed a relative-path route drift.

## What Changed

- Added:
  - `docs/plans/refactoring/logs/2026-05-03_runtime-boundary-unused-cleanup-batch.md`
- Updated:
  - `index.html` now uses root-absolute `/assets/...` references for root shell CSS, favicon/profile image, landing video, and deferred scripts.
  - `docs/plans/refactoring/unused-js-symbol-cleanup-plan.md` records step completion.
  - `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md` records the initial cleanup decisions.
- Moved/Renamed:
  - None.
- Removed:
  - `assets/js/archive/content.js`: unused `SEARCH_DEBOUNCE_MS`.
  - `assets/js/archive/content.js`: unused local `landingSearchField`.
  - `assets/js/archive/route.js`: unused `encodeSegment`.
  - `assets/js/index-note-detail.js`: unused `detailRail`.
  - `assets/js/main-landing.js`: unused `currentArchiveUrl`.
  - `assets/icons.html`: unreferenced reference/demo page.
  - `assets/js/page-footer.js`: unreferenced helper with no active script tag or mount.

## Behavior / Parity Notes

- Behavior-preserving intent:
  - Deleted symbols had no callers and were reported by ESLint as unused.
  - Removed artifacts had no active route, script, fetch, mount, or non-plan docs-map dependency.
  - Root shell asset path normalization keeps the same assets but makes them stable after `history.pushState` changes the visible path.
- Intentional deltas:
  - The public but unlinked `assets/icons.html` URL is gone.
  - The unused `assets/js/page-footer.js` file is gone.
- Important compatibility or contract notes:
  - `assets/generated/archives-index.json` and `assets/generated/archives-search-index.json` were not changed.
  - Active entry shells remain in place.
  - `stale/` files were retained in this batch because earlier planning docs intentionally referenced them as restore context; a later owner-approved cleanup removed them on 2026-05-03.
- Parity claim status:
  - `Provisional`
- Parity confidence basis:
  - `Partial audit`
- If `Preserved`, strict baseline audit completed:
  - `No`

## Validation

- Baseline or compare target:
  - Current `master` state before the batch.
- Baseline resolved commit SHA:
  - `841e9dc3ec89dd1ae68a19a2369eae8d8f4cda0d`
- Build / compile:
  - command: `/opt/homebrew/bin/node --check assets/js/archive/content.js`
  - result: `Pass`
  - command: `/opt/homebrew/bin/node --check assets/js/archive/route.js`
  - result: `Pass`
  - command: `/opt/homebrew/bin/node --check assets/js/index-note-detail.js`
  - result: `Pass`
  - command: `/opt/homebrew/bin/node --check assets/js/main-landing.js`
  - result: `Pass`
- Targeted tests:
  - command: `npm run lint`
  - result: `Pass`
  - command: `rg -n 'href="assets/|src="assets/' index.html archive assets -g '*.html'`
  - result: `Pass, no matches`
  - command: `rg -n "SEARCH_DEBOUNCE_MS|landingSearchField|encodeSegment|detailRail|currentArchiveUrl|page-footer\\.js|data-page-footer|assets/icons\\.html|icons\\.html" assets index.html archive docs README.md AGENTS.md -g '!docs/plans/**'`
  - result: `Only active retained helpers remained: main landing search field and archive search debounce owner`
- Runtime / smoke / manual verification:
  - Started local server with `python3 -m http.server 8000`.
  - Checked `/`: root landing rendered with no console errors.
  - Checked root landing search for `java`: search results rendered after route changed to `/archive/`, with no console errors after root asset normalization.
  - Checked `/archive/`: archive list rendered with no console errors.
  - Checked `/archive/note/`: note list rendered with no console errors.
  - Checked `/archive/note?category=English&collection=Langs%20Studio`: scoped list rendered with no console errors.
  - Checked `/archive/note?id=1`: note detail rendered with no console errors.
  - Checked `/archive/design/`: design surface rendered with no console errors.

## Risks / Limitations

- Known residual risks:
  - `assets/icons.html` removal deletes a public but unlinked reference URL.
  - Broader JavaScript domain moves, CSS reshaping, and package-doc shaping remain future work.
- What this log does not prove:
  - It does not prove full visual parity across all viewport sizes.
  - It does not prove every topbar/sidebar interaction path.
  - It does not complete the full runtime-boundary plan.

## Next Action

- Next step:
  - Continue with a separate, narrower JavaScript domain-structure batch if deeper `assets/js/note/archive-controller.js` splitting is approved.
- Handoff note:
  - Package docs should be structured and shaped in a later docs-only pass; `AGENTS.md` and `docs/policies/harness/**` remain no-change based on the initial audit.

## Same-Day Path Follow-Up

- The files named in this log were later moved in the same refactor turn:
  - `assets/js/archive/content.js` -> `assets/js/note/archive-controller.js`
  - `assets/js/archive/search.js` -> `assets/js/note/search.js`
  - `assets/js/index-note-detail.js` -> `assets/js/note/detail-controller.js`
  - `assets/js/main-landing.js` -> `assets/js/landing/main.js`
