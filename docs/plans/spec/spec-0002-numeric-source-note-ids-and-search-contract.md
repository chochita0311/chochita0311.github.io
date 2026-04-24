# SPEC-0002: Numeric Source Note IDs And Search Contract

## Metadata

- ID: `spec-0002`
- Status: `approved`
- Run ID: `run-20260411-02`
- Attempt: `1`
- Parent Feature: [feat-0002-numeric-source-note-ids-and-search-contract.md](docs/plans/feature/feat-0002-numeric-source-note-ids-and-search-contract.md)
- Parent PRD: [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Created: `2026-04-11`
- Updated: `2026-04-11`

## Source Set

- Human request:
  - numeric note identity should replace the note `id` in Markdown source files
  - generated outputs such as `archives-index.json` should use that numeric `id` directly
  - legacy slug-shaped string IDs should be removed rather than preserved in a parallel field
- Parent feature:
  - [feat-0002-numeric-source-note-ids-and-search-contract.md](docs/plans/feature/feat-0002-numeric-source-note-ids-and-search-contract.md)
- Parent PRD:
  - [prd-0002-archive-discovery-and-navigation-refinement.md](docs/plans/prd/prd-0002-archive-discovery-and-navigation-refinement.md)
- Golden sources:
  - current generated archive ordering in [archives-index.json](assets/generated/archives-index.json)
- Relevant policies or contracts:
  - [note-data-contract.md](docs/policies/archive/note/note-data-contract.md)
  - [architecture.md](docs/policies/project/architecture.md)

## Implementation Goal

- Move note identity to numeric Markdown frontmatter `id` values for all existing notes, make generated archive data use those numeric IDs directly, and remove the invalidated derived `note_id` approach.

## In-Scope Behavior

- Update every existing note under `CATEGORIES/` so frontmatter `id` is numeric.
- Assign numeric IDs in the current archive menu order:
  - `English/Langs Studio`: `1-20`
  - `Technology/JAVA`: `21-34`
  - `Technology/Messaging`: `35`
- Remove legacy slug-shaped string IDs rather than preserving them under another field.
- Update `scripts/generate-archives-index.mjs` so generated archive records use numeric `id` values directly.
- Make generator validation explicit enough that missing or non-numeric note IDs do not silently fall back to slug generation.
- Regenerate `assets/generated/archives-index.json`.
- Update planning or contract docs as needed so future notes use the next numeric ID rather than re-numbering existing notes.

## Out-Of-Scope Behavior

- Search UI wiring
- Separate reverse-index generation
- Topbar or sidebar interaction work
- Archive rendering changes outside numeric ID consumption

## Affected Surfaces

- `CATEGORIES/**/*.md`
- [generate-archives-index.mjs](scripts/generate-archives-index.mjs)
- [archives-index.json](assets/generated/archives-index.json)
- [note-data-contract.md](docs/policies/archive/note/note-data-contract.md)
- [architecture.md](docs/policies/project/architecture.md)

## State And Interaction Contract

- Numeric source IDs are a contract change only; no user-visible interaction change is required in this feature.
- Existing note browse and detail flows must continue to resolve notes correctly after the ID migration.

## Data And Contract Assumptions

- `id` is now the numeric source identifier in Markdown and generated archive data.
- The generator must not invent legacy slug IDs once the migration is complete.
- Future note creation should use the next available integer after the current maximum source `id`.
- Legacy slug-shaped string IDs are removed entirely from source metadata and generated archive output.

## Acceptance Mapping

- Numeric Markdown `id` ownership:
  - update all existing notes to numeric frontmatter IDs
- Generated runtime alignment:
  - output numeric `id` directly in `archives-index.json`
- Initial assignment rule:
  - map existing notes to `1-35` in current menu order
- Future issuance rule:
  - document “next max integer” rule for new notes
- Legacy ID removal:
  - keep no `slug`, `legacy_id`, or `note_id` parallel identity field in source or generated browse data

## Evaluation Focus

- Functional evaluation should verify:
  - all existing notes have numeric `id`
  - generator rejects missing or non-numeric source IDs
  - generated archive data exposes numeric `id` values only
  - note browsing remains stable after the migration

## Open Blockers

- None.

## Continuity Notes

- `2026-04-11`: initial spec created after post-run human review invalidated the derived `note_id` approach
- `2026-04-11`: executed and approved after source note IDs were migrated to numeric values and generated archive output aligned to the new contract
