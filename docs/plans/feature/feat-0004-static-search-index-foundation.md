# FEAT-0004: Static Search Index Foundation

## Metadata

- ID: `feat-0004`
- Status: `passed`
- Type: `foundation`
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-11`
- Updated: `2026-04-12`

## Goal

- Foundation feature:
  - generate one bounded static reverse-index contract for archive search so later product search behavior can run without guessing about search data ownership, token storage, or runtime lookup shape

## Acceptance Contract

- A generated static search-index asset exists separately from `assets/generated/archives-index.json`.
- The search-index asset is derived from Markdown source plus approved generated archive metadata, not hand-maintained runtime data.
- The search-index asset supports exact token lookup across note title, tags, and note body content.
- Search-index tokens support basic normalized Korean and English token matching without partial-match or prefix expansion.
- Search-index entries resolve to numeric source note `id` values.
- The generator fails in a bounded way when required search-index source data is missing or invalid.
- The foundation contract is concrete enough that downstream scoped-search UI can read it without guessing about file path, note identity, or reverse-index structure.

## Scope Boundary

- In:
  - static search-index generation
  - reverse-index file contract
  - token normalization rules for Korean and English search terms
  - note identity mapping in search-index entries
  - generator validation and failure rules
  - documentation updates for the search-index artifact and ownership
- Out:
  - topbar hover and dropdown behavior
  - topbar category or collection click behavior
  - search input debounce behavior
  - scoped search rendering in the archive UI
  - note-detail redesign

## System Outcome

- The project has one reusable static search-index artifact that later product features can consume for scoped archive search.

## Entry And Exit

- Entry point:
  - archive generator reads Markdown notes and emits runtime assets under `assets/generated/`
- Exit or transition behavior:
  - downstream product search work can load the generated search index without inventing its contract during UI implementation

## State Expectations

- Default:
  - no separate search-index asset is assumed until generation runs
- Loading:
  - generator builds archive metadata and search-index assets from the same Markdown source set
- Empty:
  - empty note sets still emit a valid but empty search-index asset
- Error:
  - invalid source IDs or unreadable Markdown fail generation in a bounded and diagnosable way
- Success:
  - one deterministic search-index artifact exists and is ready for downstream product search implementation

## Dependencies

- Parent PRD [prd-0002-archive-discovery-and-navigation-refinement.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Required foundation feature: `feat-0002-numeric-source-note-ids-and-search-contract`
- Archive generator in [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- Note source contract in [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-data-contract.md)

## Likely Affected Surfaces

- [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive/content.js)
- [generate-archives-index.mjs](/Users/jungsoo/Projects/chochita0311.github.io/scripts/generate-archives-index.mjs)
- [archives-index.json](/Users/jungsoo/Projects/chochita0311.github.io/assets/generated/archives-index.json)
- generated static search-index asset under `assets/generated/`
- [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-data-contract.md)
- [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)

## Pass Or Fail Checks

- The repository generates a search-index asset separate from `archives-index.json`.
- Search-index entries reference numeric note IDs directly.
- Search-index tokens are derived from note title, tags, and body content.
- The search-index contract does not include partial-match or prefix expansion.
- The generator can rebuild the search index from Markdown without manual post-processing.
- Downstream runtime code can locate the search-index asset and read a stable reverse-index structure.

## Regression Surfaces

- Existing archive-index generation
- Numeric source note IDs
- Static GitHub Pages runtime compatibility

## Harness Trace

- Active spec doc: [spec-0004-static-search-index-foundation.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/spec/spec-0004-static-search-index-foundation.md)
- Latest evaluator report: [eval-0004-functional-static-search-index-filter-alignment.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/evaluation/eval-0004-functional-static-search-index-filter-alignment.md)
- Latest fix note:

## Continuity Notes

- `2026-04-11`: initial mixed draft covered both topbar taxonomy and scoped search product behavior
- `2026-04-12`: boundary rewritten as a pure foundation feature after the harness rule was tightened to require separate foundation and product features
- `2026-04-12`: passed after the generator began emitting a separate static reverse-index asset for title, tags, and body tokens keyed by numeric note IDs
- `2026-04-12`: corrected after archive-search contract introduced explicit low-signal token filtering rules; latest pass reflects numeric-only, single-character, and stopword exclusion
