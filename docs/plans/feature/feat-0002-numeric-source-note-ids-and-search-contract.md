# FEAT-0002: Numeric Source Note IDs And Search Contract

## Metadata

- ID: `feat-0002`
- Status: `passed`
- Type: `foundation`
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Goal

- Foundation feature:
  - redefine note identity and search ownership so downstream search work does not guess whether numeric IDs belong in source Markdown, generated outputs, or separate derived fields

## Acceptance Contract

- Markdown frontmatter `id` is explicitly defined as the numeric note identity when this feature is complete.
- Generated runtime outputs use that numeric `id` directly instead of introducing a separate derived `note_id` field.
- Existing notes receive numeric IDs in current menu order.
- New notes receive the next numeric ID without re-numbering existing notes.
- Legacy slug-shaped string IDs are removed rather than retained as `slug`, `legacy_id`, or another parallel identifier field.
- The search contract is updated so downstream work does not guess whether search identity is the source `id`, a derived key, or both.
- Documentation is updated so later implementation does not need to guess source-of-truth ownership for note identity.

## Scope Boundary

- In:
  - numeric note identity ownership in Markdown frontmatter
  - generated browse-index identity shape
  - rule for initial numeric assignment across existing notes
  - rule for issuing the next numeric ID for future notes
  - removal of legacy slug-shaped string IDs from source metadata and generated browse data
  - search-identity ownership needed by downstream search work
  - documentation updates required to make the contract executable
- Out:
  - visible search UI wiring
  - topbar search interactions
  - archive list rendering changes
  - popular-tag UI behavior
  - topbar navigation hover behavior

## Entry And Exit

- Entry point:
  - post-run human review invalidated the previous feat-0002 interpretation because numeric identity was added as a derived field instead of replacing source `id`
- Exit or transition behavior:
  - downstream planning and spec work can proceed against a corrected source-of-truth identity rule

## State Expectations

- Default:
  - current implementation is treated as invalidated for feat-0002 acceptance
- Loading:
  - planning may redefine generator and content updates after the corrected contract is approved
- Empty:
  - not applicable beyond contract completeness
- Error:
  - leaving source identity ambiguous would block downstream execution
- Success:
  - the corrected numeric source-ID contract is clear enough for a new run

## Dependencies

- Parent PRD [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Existing note metadata guidance in [note-data-contract.md](docs/policies/archive/note/note-data-contract.md)
- Existing generator entry point in [generate-archives-index.mjs](scripts/generate-archives-index.mjs)

## Likely Affected Surfaces

- [note-data-contract.md](docs/policies/archive/note/note-data-contract.md)
- [architecture.md](docs/policies/project/architecture.md)
- [generate-archives-index.mjs](scripts/generate-archives-index.mjs)
- `CATEGORIES/**/*.md`
- `assets/generated/archives-index.json`

## Pass Or Fail Checks

- No unresolved question remains about whether the numeric identity lives in Markdown `id` or in a separate derived field.
- No unresolved question remains about whether `archives-index.json` uses the numeric source `id` directly.
- No unresolved question remains about the initial numeric assignment rule for existing notes.
- No unresolved question remains about how future notes receive the next numeric ID.
- No unresolved question remains about whether legacy slug-shaped IDs are retained in a parallel field; they are removed.
- Downstream spec work can reference one clear identity contract without guessing.

## Regression Surfaces

- Existing browse index generation
- Existing archive list and detail note lookup
- Static GitHub Pages compatibility
- Markdown as the durable source of truth under `CATEGORIES/`

## Harness Trace

- Active spec doc: [spec-0002-numeric-source-note-ids-and-search-contract.md](docs/plans/spec/spec-0002-numeric-source-note-ids-and-search-contract.md)
- Latest evaluator report: [eval-0002-functional-numeric-source-note-ids-and-search-contract.md](docs/plans/evaluation/eval-0002-functional-numeric-source-note-ids-and-search-contract.md)
- Latest fix note:

## Continuity Notes

- `2026-04-11`: initial draft split out as a foundation feature from PRD-0002 to stabilize search ownership before product implementation
- `2026-04-11`: approved after fixing numeric note-id registry direction, initial sequential assignment rule, and lightweight token-search boundary
- `2026-04-11`: previous execution result invalidated by post-run human review because the implementation added a derived `note_id` instead of changing the source Markdown `id`
- `2026-04-11`: returned to planning and re-opened as a draft foundation feature for corrected numeric source-ID ownership
- `2026-04-11`: clarified that legacy slug-shaped string IDs should be removed entirely rather than preserved in a secondary field
- `2026-04-11`: passed after migrating all existing source note IDs to numeric values, aligning generated archive output, and validating the corrected contract
