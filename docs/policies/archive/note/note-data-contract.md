# Note Data Contract

## Purpose

- Keep Markdown as the durable source of truth.
- Define the minimum metadata needed for archive browse, search, tag filtering, reading, and bookmarks on a static site.
- Define the generated JSON shape that the static UI can consume without hand-maintained duplicate data.
- Keep this document focused on the note schema and generated-data contract.

## Use This Doc For

- note field definitions
- `id` rules and frontmatter expectations
- generated runtime data expectations

## Workflow Routing

- Use [note-maintenance-workflow.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/note-maintenance-workflow.md) for the operational steps to add, import, move, or regroup notes.
- Use this document when you need field definitions, ID rules, or generated-data expectations.

## Source Of Truth

- Canonical note content lives in Markdown files under `NOTES/`.
- Verified path pattern:
  - `NOTES/<category>/<collection>/<note>.md`
- Path defines the archive taxonomy.
- Frontmatter defines list, search, and UI metadata.
- Generated JSON is derived output, not hand-edited content.
- Dates belong in frontmatter, not in durable filenames. If a source note arrives with a leading `YYYYMMDD` filename, rename it to a topic-based note name and store the date in `created`.

## Note Shape

- File path example:
  - `NOTES/Technology/JAVA/ApplicationRunner.md`
- Frontmatter example:

```md
---
id: 34
title: ApplicationRunner
summary: How Spring Boot runs startup logic after the application context is ready.
tags:
  - java
  - spring-boot
  - lifecycle
created: 2026-04-05
updated: 2026-04-05
---

# ApplicationRunner

Actual note body here.
```

## Frontmatter Contract

- Strict field order:
  - `id`
  - `title`
  - `summary`
  - `tags`
  - `created`
  - `updated`
- New and normalized notes must follow this order exactly.
- Required:
  - `id`
    - stable, unique positive integer
    - source-of-truth note identity
    - generated outputs must use this numeric `id` directly
    - existing notes are assigned in current menu order
    - new notes must use the next available integer after the current maximum `id`
  - `title`
    - primary display title for lists and reading view
  - `summary`
    - short preview text for archive cards and search results
- Recommended:
  - `tags`
    - array of normalized strings
    - lowercase kebab-case is the safest static filtering shape
  - `created`
    - original note date in `YYYY-MM-DD`
  - `updated`
    - last meaningful revision date in `YYYY-MM-DD`
- Legacy compatibility only:
  - `published`
    - accepted alias when older notes have not been normalized yet
  - `date`
    - accepted alias when older notes have not been normalized yet
- Avoid for now:
  - deep nested metadata that the current UI does not use
  - duplicate category or collection fields unless the generator needs overrides later

## Body Rules

- The Markdown body remains the note itself.
- The first body heading can match `title`, but the UI should trust frontmatter `title` as the metadata owner.
- Long-form reading content should stay in Markdown instead of moving into JSON.
- If a note includes source or supporting links, collect them in a final `## References` section at the end of the note body.
- Do not leave raw link dumps at the top or in the middle of the main explanation once the note has been normalized.
- Keep explanatory content in the main body and keep reference links grouped under `## References`.
- Body rendering expectations and supported syntax are documented in `docs/policies/archive/note/markdown-rendering.md`.

## Generated Data Contract

- Generate these runtime artifacts for the static UI:
  - browse metadata index: `assets/generated/archives-index.json`
  - reverse search index: `assets/generated/archives-search-index.json`
- Generator script:
  - `scripts/generate-archives-index.mjs`
- `archives-index.json` owns archive browse metadata derived from frontmatter and path-based taxonomy.
- `archives-search-index.json` owns generated search lookup data derived from note source content.
- Search index behavior, filtering, and token rules are defined in [archive-search-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/archive-search-contract.md).

## Generated Index Shape

```json
[
  {
    "id": 34,
    "title": "ApplicationRunner",
    "summary": "How Spring Boot runs startup logic after the application context is ready.",
    "tags": ["java", "spring-boot", "lifecycle"],
    "created": "2026-04-05",
    "updated": "2026-04-05",
    "category": "Technology",
    "collection": "JAVA",
    "path": "NOTES/Technology/JAVA/ApplicationRunner.md"
  }
]
```

## Runtime Use

- Browse:
  - category and collection lists can be built from `category` and `collection`
- Search:
  - archive metadata comes from `archives-index.json`
  - exact token lookup comes from `archives-search-index.json`
- Tag click:
  - filter notes by exact tag match
- Reading:
  - list metadata comes from the index
  - note body still comes from the Markdown source or generated HTML later
- Bookmarks:
  - store only note `id`s in browser storage and resolve them against the index

## Bookmark Contract

- Store bookmark state in `localStorage`.
- Recommended shape:

```json
[34, 2]
```

- Do not store full note objects in bookmarks.
- Bookmark resolution should always go through the latest generated note index.

## Search Relationship

- Search should be index-based and client-side.
- Search runtime behavior should consume:
  - browse metadata from `archives-index.json`
  - lookup terms from `archives-search-index.json`
- Search index file shape and token rules belong in [archive-search-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/archive/note/archive-search-contract.md).

## Tag Contract

- Tags should come from frontmatter.
- Recommended normalization:
  - lowercase
  - kebab-case
  - no duplicates within one note
- The UI may display tags in a friendlier label format later, but the stored value should stay normalized.

## ID Rules

- `id` must stay stable across renames where possible.
- `id` is a numeric source identifier, not a slug.
- Existing notes were assigned numeric IDs in current menu order during the initial migration.
- New notes should receive the next available integer after the current maximum `id`.
- Do not keep a parallel `slug`, `legacy_id`, or other secondary identifier field unless a future approved plan adds it explicitly.

## Working Guidance

- Keep editing notes as Markdown files with frontmatter.
- Do not hand-maintain per-note JSON wrappers or search index data.
- Treat the generated JSON as a runtime asset, not as the primary content store.
