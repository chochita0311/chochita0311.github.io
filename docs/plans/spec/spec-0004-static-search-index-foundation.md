# SPEC-0004: Static Search Index Foundation

## Metadata

- ID: `spec-0004`
- Status: `approved`
- Run ID: `run-20260412-02`
- Attempt: `2`
- Parent Feature: [feat-0004-static-search-index-foundation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0004-static-search-index-foundation.md)
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-12`
- Updated: `2026-04-12`

## Source Set

- Human-approved feature:
  - [feat-0004-static-search-index-foundation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/feature/feat-0004-static-search-index-foundation.md)
- Parent PRD:
  - [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Golden sources:
  - current generator in [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- Relevant policies or contracts:
  - [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)
  - [archive-search-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/archive-search-contract.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)

## Implementation Goal

- Extend the static archive generator so it emits a separate reverse search index that later runtime search can consume without rescanning Markdown in the browser.

## In-Scope Behavior

- Add a generated runtime asset at `assets/generated/archives-search-index.json`.
- Build reverse-index terms from note `title`, `tags`, and Markdown body content.
- Resolve reverse-index entries directly to numeric source note `id` values.
- Normalize tokens with NFKC, lowercase English text, and basic Hangul or alphanumeric token extraction.
- Exclude partial-match and prefix expansion.
- Exclude numeric-only tokens.
- Exclude one-character tokens by default.
- Exclude a small default English stopword set.
- Keep tags indexed even when the same value would otherwise be filtered only for short length.
- Keep `archives-index.json` as the browse metadata artifact.
- Update note and architecture contracts so the new search-index artifact is owned and documented.

## Out-Of-Scope Behavior

- Topbar search UI behavior
- Scoped runtime filtering
- Dropdown taxonomy rendering
- Note-detail redesign

## Affected Surfaces

- [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- [archives-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-index.json)
- generated [archives-search-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-search-index.json)
- [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md)
- [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)

## State And Contract Rules

- Search-index generation must remain deterministic for the same Markdown source set.
- The reverse index may omit per-note browse metadata because `archives-index.json` already owns that data.
- Markdown body should be reduced to plain searchable text before token extraction.
- Search index tokens should be unique per note per term.
- Empty source sets should still emit a valid empty reverse-index structure.
- Search token filtering must align with [archive-search-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/archive-search-contract.md).

## Acceptance Mapping

- Separate generated asset:
  - `archives-search-index.json` exists beside `archives-index.json`
- Numeric identity:
  - reverse-index values are numeric note IDs
- Searchable fields:
  - title, tags, and body contribute terms
- Token policy:
  - NFKC normalization, lowercase English, Hangul or alphanumeric exact tokens only
  - numeric-only, one-character, and default English stopword filtering
  - short-length exception for tag-derived tokens only
- Contract ownership:
  - note and architecture docs name the artifact and regeneration flow

## Evaluation Focus

- Functional evaluation should verify:
  - separate asset generation
  - numeric ID references
  - title, tags, and body contribution
  - absence of prefix expansion
  - numeric-only, short-token, and stopword filtering
  - generator stability after the new output is added

## Open Blockers

- None.

## Continuity Notes

- `2026-04-12`: initial spec created after splitting former mixed feat-0004 into separate foundation and product features
- `2026-04-12`: corrected after archive-search contract was introduced so generator filtering rules now include numeric-only, short-token, and stopword exclusions
