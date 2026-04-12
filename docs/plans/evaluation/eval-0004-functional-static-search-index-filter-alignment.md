# EVAL-0004-FUNCTIONAL: Static Search Index Filter Alignment

## Metadata

- ID: `eval-0004-functional`
- Status: `approved`
- Evaluator Type: `functional`
- Result: `PASS`
- Run ID: `run-20260412-02`
- Attempt: `2`
- Feature: [feat-0004-static-search-index-foundation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0004-static-search-index-foundation.md)
- Spec: [spec-0004-static-search-index-foundation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0004-static-search-index-foundation.md)
- Created: `2026-04-12`

## Scope

- Active feature:
  - static search index foundation
- Active spec:
  - `spec-0004`
- Evaluated build or commit:
  - working tree after generator filtering was aligned to the archive-search contract

## Checks

- Verified that the generator excludes numeric-only tokens from `archives-search-index.json`.
- Verified that the generator excludes one-character tokens by default.
- Verified that the generator excludes the default English stopword set.
- Verified that tag-derived tokens still allow the short-length exception.
- Verified that reverse-index values remain numeric note `id` arrays.
- Verified that browse index generation still succeeds after the filtering changes.

## Findings

- No blocking functional defects found for the corrected feat-0004 scope.

## Regression Notes

- Existing browse metadata generation remained intact.
- Search index remains a separate generated artifact beside `archives-index.json`.
- Static runtime compatibility is preserved because filtering changes only affect generated lookup content.

## Route

- Next action:
  - `pass`

## Continuity Notes

- `2026-04-12`: pass recorded after generator filtering was aligned to the archive-search contract and regenerated assets reflected the reduced low-signal token set
