# Archive Search Contract

## Purpose

- Define durable rules for building and maintaining the static archive search index.
- Keep search-token behavior, filtering rules, and ownership out of feature-local docs.
- Give future search UI work one stable contract for what the generated search index contains.

## Ownership

- This document owns search-index tokenization and filtering rules for note search.
- Use [note-data-contract.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/content/note/note-data-contract.md) for note metadata ownership and generated artifact presence.
- Use [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md) for runtime placement and regeneration flow.

## Runtime Artifact

- Search index file:
  - `assets/generated/archives-search-index.json`
- Generator:
  - `scripts/generate-archives-index.mjs`
- Ownership:
  - generated only
  - not hand-edited
  - derived from Markdown source under `CATEGORIES/`

## Searchable Sources

- Index these fields:
  - note `title`
  - note `tags`
  - Markdown `body`
- Do not rely on runtime Markdown fetch-and-scan for archive search.
- Keep browse metadata in `archives-index.json` and reverse lookup terms in `archives-search-index.json`.

## Identity Rule

- Reverse-index matches must resolve directly to numeric source note `id` values.
- Do not introduce a parallel search-only note identifier.

## Normalization Rules

- Normalize text with `NFKC`.
- Lowercase English text before token extraction.
- Reduce Markdown body content to plain searchable text before tokenization.
- Tokenize by exact basic units using English letters, numbers, and Hangul text.

## Token Inclusion Rules

- Include Hangul tokens.
- Include English alphanumeric tokens.
- Include tokens derived from `title`, `tags`, and body text.
- Keep tags indexed even when the same value would otherwise be filtered for short length.

## Token Exclusion Rules

- Exclude prefix expansions.
- Exclude partial-match expansions.
- Exclude numeric-only tokens.
- Exclude one-character tokens by default.
- Exclude obvious Markdown syntax residue when body text is reduced.
- Exclude a small English stopword set to reduce low-signal matches.

## Default English Stopwords

- The default stopword set should stay intentionally small and predictable.
- Recommended baseline:
  - `a`
  - `an`
  - `and`
  - `as`
  - `at`
  - `by`
  - `for`
  - `from`
  - `in`
  - `is`
  - `of`
  - `on`
  - `or`
  - `the`
  - `this`
  - `to`
  - `with`

## Korean Token Rule

- Keep Korean token handling simple.
- Do not introduce aggressive Korean stopword removal unless a later approved plan proves it is necessary.
- Do not introduce morphological expansion, stemming, or synonym logic by default.

## Determinism Rule

- The same source Markdown set should generate the same token set and note-ID mapping.
- Search-index output must stay stable enough for downstream runtime code and debugging.

## File Size Guidance

- Prefer reducing low-signal tokens over removing meaningful searchable fields.
- If the generated file becomes too large for practical static use, tighten token filtering before dropping major source fields such as body text.

## Future Scaling Note

- The default contract uses one generated search-index file.
- If search-index size later becomes too large for practical static loading, prefer token-based sharding before category-only sharding.
- Recommended direction:
  - split by token range or script group
  - keep scope filtering as a separate runtime step using archive metadata
- This preserves global search behavior while still allowing category or collection scoping after candidate note IDs are resolved.

## Change Control

- If a feature wants to change search token behavior, stopword rules, or match semantics, update this policy first.
- Do not silently change search quality by adjusting the generator alone.
