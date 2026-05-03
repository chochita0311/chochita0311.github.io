# Stale Parked Asset Removal Batch

## Log Type

- Type: `Batch`
- Date: `2026-05-03`
- Related track: `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md`
- Scope: parked stale archive hero-copy restore files

## Summary

- Goal:
  - Remove the `stale/` directory after owner approval because the parked archive hero-copy restore context is no longer needed.
- Outcome:
  - `Pass`
- Short conclusion:
  - The repository no longer keeps a separate stale parking directory for removed hero-copy JSON.

## What Changed

- Removed:
  - `stale/stale.md`
  - `stale/assets/config/archive-descriptions.json`
- Updated:
  - `docs/plans/refactoring/runtime-boundary-and-package-docs-plan.md` now records the owner-approved removal instead of retaining `stale/`.

## Behavior / Parity Notes

- Behavior-preserving intent:
  - No runtime screen, script, generated data file, or active fetch path used `stale/`.
- Intentional deltas:
  - Historical restore convenience for the removed archive hero copy is gone.
- Parity claim status:
  - `Preserved for runtime behavior`
- Parity confidence basis:
  - `Reference audit`

## Validation

- Static reference audit:
  - command: `rg` audit for `stale/`, `stale/stale.md`, and `stale/assets/config/archive-descriptions.json`
  - result: `Only historical plan references and the current refactor track referenced the directory before removal.`

## Risks / Limitations

- Older feature and PRD plan docs still mention the original `stale/` parking decision as historical context.
- Restoring the removed archive hero copy would now require reconstructing it from git history rather than reading `stale/assets/config/archive-descriptions.json`.

## Next Action

- Keep future removed examples out of `stale/` unless there is a concrete approved restore plan.
