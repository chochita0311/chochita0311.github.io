# Note Data Contract

## Purpose
- Keep Markdown as the durable source of truth.
- Define the minimum metadata needed for archive browse, search, tag filtering, reading, and bookmarks on a static site.
- Define the generated JSON shape that the static UI can consume without hand-maintained duplicate data.

## Source Of Truth
- Canonical note content lives in Markdown files under `CATEGORIES/`.
- Verified path pattern:
  - `CATEGORIES/<category>/<collection>/<note>.md`
- Path defines the archive taxonomy.
- Frontmatter defines list, search, and UI metadata.
- Generated JSON is derived output, not hand-edited content.

## Recommended Note Shape
- File path example:
  - `CATEGORIES/Technology/JAVA/ApplicationRunner.md`
- Frontmatter example:

```md
---
id: technology-java-application-runner
title: ApplicationRunner
summary: How Spring Boot runs startup logic after the application context is ready.
tags:
  - java
  - spring-boot
  - lifecycle
date: 2026-04-05
updated: 2026-04-05
---

# ApplicationRunner

Actual note body here.
```

## Frontmatter Fields
- Required:
  - `id`
    - stable, unique string
    - should not change once bookmarks or links may rely on it
    - recommended pattern: lowercase slug combining category, collection, and note name
  - `title`
    - primary display title for lists and reading view
  - `summary`
    - short preview text for archive cards and search results
- Recommended:
  - `tags`
    - array of normalized strings
    - lowercase kebab-case is the safest static filtering shape
  - `date`
    - original note date in `YYYY-MM-DD`
  - `updated`
    - last meaningful revision date in `YYYY-MM-DD`
- Avoid for now:
  - deep nested metadata that the current UI does not use
  - duplicate category or collection fields unless the generator needs overrides later

## Body Rules
- The Markdown body remains the note itself.
- The first body heading can match `title`, but the UI should trust frontmatter `title` as the metadata owner.
- Long-form reading content should stay in Markdown instead of moving into JSON.

## Generated Static Index
- Generate one metadata index for the static UI.
- Recommended file:
  - `assets/data/notes-index.json`
- This file should be created from Markdown frontmatter plus path-derived category and collection values.

## Archive Copy Config
- Keep list-view title and summary copy in a small runtime JSON file instead of hard-coding it in JavaScript.
- Recommended file:
  - `assets/config/archive-descriptions.json`
- This file owns:
  - default archive hero title and summary
  - per-category empty-state copy
  - per-collection summary copy for list views
- This file is hand-editable content configuration, not generated note metadata.

## Recommended Archive Copy Shape

```json
{
  "default": {
    "title": "Recent Archives",
    "summary": "Curated overview copy for the landing archive."
  },
  "categories": {
    "Technology": {
      "title": "Technology",
      "summary": "Choose a collection from the sidebar to open the notes in this category."
    }
  },
  "collections": {
    "Technology/JAVA": {
      "title": "JAVA",
      "summary": "Real Markdown notes from Technology / JAVA."
    }
  }
}
```

## Recommended Index Shape

```json
[
  {
    "id": "technology-java-application-runner",
    "title": "ApplicationRunner",
    "summary": "How Spring Boot runs startup logic after the application context is ready.",
    "tags": ["java", "spring-boot", "lifecycle"],
    "date": "2026-04-05",
    "updated": "2026-04-05",
    "category": "Technology",
    "collection": "JAVA",
    "path": "CATEGORIES/Technology/JAVA/ApplicationRunner.md"
  }
]
```

## Why This Shape Works
- Browse:
  - category and collection lists can be built from `category` and `collection`
- Search:
  - query over `title`, `summary`, and `tags`
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
["technology-java-application-runner", "english-langs-studio-20250708"]
```

- Do not store full note objects in bookmarks.
- Bookmark resolution should always go through the latest generated note index.

## Search Contract
- Search should be index-based and client-side.
- Minimum searchable fields:
  - `title`
  - `summary`
  - `tags`
- Optional later:
  - generated excerpt
  - normalized keyword field

## Tag Contract
- Tags should come from frontmatter.
- Recommended normalization:
  - lowercase
  - kebab-case
  - no duplicates within one note
- The UI may display tags in a friendlier label format later, but the stored value should stay normalized.

## ID Rules
- `id` must stay stable across renames where possible.
- Recommended pattern:
  - `<category>-<collection>-<note-slug>`
- Example:
  - `technology-java-application-runner`

## Practical Recommendation
- Keep editing notes as Markdown files with frontmatter.
- Do not hand-maintain per-note JSON wrappers.
- Generate the archive index from Markdown when the data pipeline is added.
- Treat the generated JSON as a runtime asset, not as the primary content store.
