# Note Maintenance Workflow

## Purpose

- Define the single operational workflow for adding, normalizing, moving, or regrouping notes in this repository.
- Keep note-source edits, generated runtime assets, and crawl-discovery output aligned.
- Reduce duplicated guidance across `README.md`, project workflow docs, and note contracts.

## Use This Doc For

- adding a new note
- importing raw notes from another workspace
- moving notes between collections
- creating a new collection such as `NOTES/Technology/DATABASE`
- regenerating runtime artifacts after note changes

## Source Of Truth

- Markdown files under `NOTES/` are the durable content source.
- Note metadata shape is owned by [note-data-contract.md](docs/policies/archive/note/note-data-contract.md).
- Markdown syntax and rendering expectations are owned by [markdown-rendering.md](docs/policies/archive/note/markdown-rendering.md).
- Generated runtime files are derived output and must not become the primary editing surface.

## Working Shape

- Path pattern:
  - `NOTES/<category>/<collection>/<note>.md`
- Current example:
  - `NOTES/Technology/Spring/Jdbc Batch.md`

## Core Workflow

1. Place or move the note under the correct `NOTES/<category>/<collection>/` path.
2. Normalize the filename so it is topic-based and searchable.
3. Add or normalize frontmatter using the contract field order:
   - `id`
   - `title`
   - `summary`
   - `tags`
   - `created`
   - `updated`
4. Keep the Markdown body as the durable reading source.
5. If the note has source links, move them into a final `## References` section instead of leaving them scattered through the draft body.
6. Regenerate the archive indexes:
   - `node scripts/generate-archives-index.mjs`
7. Regenerate the sitemap after the archive index is up to date:
   - `node scripts/generate-sitemap.mjs`
8. Verify that the affected category, collection, and note IDs appear in:
   - `assets/generated/archives-index.json`
   - `assets/generated/archives-search-index.json`
   - `sitemap.xml`
9. Update owner docs only if the repository structure or workflow changed.

## Workflow Variants

### Add A New Note

- Create the Markdown file in the target collection.
- Assign the next available numeric `id` after the current maximum.
- Write a short `summary` for list/search preview.
- Use normalized tags when they help search or filtering.
- Set `created` and `updated` in `YYYY-MM-DD`.
- Run:

```bash
node scripts/generate-archives-index.mjs
node scripts/generate-sitemap.mjs
```

### Import Or Normalize Raw Notes

- Convert link dumps or loose notes into the repository frontmatter shape before treating them as complete.
- When a raw note contains links, rewrite it so the explanation reads as a note and move the links into a final `## References` section.
- Do not leave imported notes without numeric `id`.
- If imported notes have no summary yet, add a short working summary instead of leaving the field empty.
- If imported notes arrive with date-prefixed filenames, rename them to topic-based filenames and keep the date in frontmatter.

### Move Notes Between Collections

- Move the Markdown file to the new collection path.
- Keep the same `id` unless there is a deliberate identity split.
- Update `updated` when the move is meaningful archive maintenance.
- Regenerate archive indexes.
- Regenerate sitemap after the archive indexes are current.

### Create Or Rename A Collection

- Create or rename the folder under the owning category path in `NOTES/`.
- Confirm the collection name is searchable and understandable in the visible UI.
- Regenerate archive indexes so menu/search/runtime metadata pick up the new taxonomy.
- Regenerate sitemap so crawlable collection URLs stay aligned.
- Update user-facing or workflow docs if the taxonomy change is durable.

## Generated Outputs

- `assets/generated/archives-index.json`
  - browse metadata for sidebar, archive lists, and note lookup
- `assets/generated/archives-search-index.json`
  - reverse search index derived from title, tags, and body text
- `sitemap.xml`
  - crawl-discovery output for home, archive, category, collection, and note URLs

## Verify Changes

- No note under `NOTES/` is missing numeric `id`.
- New note paths appear in `assets/generated/archives-index.json`.
- Search index generation completes without error.
- `sitemap.xml` includes the affected collection and note URLs.
- `robots.txt` still points at the published sitemap location when sitemap ownership changes.

## Common Failure Modes

- Running `generate-sitemap` before regenerating `archives-index.json`
  - result: sitemap reflects stale note inventory
- Importing notes without frontmatter
  - result: archive index generation fails on missing `id`
- Leaving reference links as a raw dump instead of moving them under `## References`
  - result: notes remain hard to read and inconsistent with the archive note shape
- Moving notes without regenerating derived files
  - result: menu/search/detail links drift from source content
