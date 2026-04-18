# Markdown Rendering Rules

## Purpose
- Document how note body Markdown is rendered by the current static runtime.
- Keep rendering behavior explicit for note authors and future runtime changes.
- Provide one owner document for supported syntax, known limitations, and compatibility expectations.

## Scope
- This document covers the note body renderer used by the published site.
- It does not define note metadata. Frontmatter and archive index expectations belong in [note-data-contract.md](./note-data-contract.md).
- It is influenced by the editing and preview expectations seen in tools such as `https://markdownlivepreview.com/`, but it documents this project's actual runtime behavior rather than an external editor's full feature set.

## Reference Standards
- General preview reference:
  - `https://markdownlivepreview.com/`
- Basic syntax reference:
  - `https://www.markdownguide.org/basic-syntax/`
- Use these as authoring references, but treat this document as the owner of what the current runtime actually supports.

## Renderer Owner
- Source file:
  - `assets/js/note-detail-renderer.js`
- Primary styles:
  - `assets/css/note-detail.css`

## General Model
- Notes are stored as Markdown files under `NOTES/`.
- Frontmatter is parsed separately from the body.
- The body is rendered through a lightweight custom renderer, not a full CommonMark or GitHub Flavored Markdown implementation.
- Supported syntax should be treated as an explicit allowlist.

## Supported Syntax

### Headings
- Supported:
  - `# Heading`
  - `## Heading`
  - `### Heading`
  - `#### Heading`
- `##### Heading`
- `###### Heading`
- A body `# Heading` is supported, but if the first level 1 heading matches frontmatter `title`, the renderer suppresses it to avoid duplicating the reading view title.
- `##`, `###`, and `####` headings are added to the note outline rail.
- For compatibility, always put a space after the `#` markers.
- Alternate heading syntax using underline markers such as `===` or `---` is supported for level 1 and level 2 headings.

### Paragraphs
- Plain text lines are merged into paragraphs until a block boundary is reached.
- Empty lines break paragraphs.
- For compatibility, keep paragraphs left-aligned and avoid leading spaces or tabs.

### Line Breaks
- A single newline inside a paragraph is rendered as a visible line break.
- This is intentionally simpler than full Markdown processor compatibility rules and does not distinguish between soft line breaks and hard line breaks.
- If a paragraph should remain visually continuous, keep it on one line in the source.

### Lists
- Supported unordered list markers:
  - `- item`
  - `+ item`
- Supported ordered list marker:
  - `1. item`
- Nested lists are not guaranteed to render correctly and should be avoided for now.
- Ordered list items should use the `1. 2. 3.` form for readability and compatibility, even though the renderer does not enforce exact numbering semantics.

### Block Quotes
- Supported:
  - `> quoted text`
- Nested blockquotes and multi-paragraph blockquotes are not guaranteed to render the same way as a full Markdown engine.

### Code Blocks
- Supported fenced code blocks:

~~~~md
```java
System.out.println("hello");
```
~~~~

- The renderer does not currently apply language-specific syntax highlighting.
- The opening fence language label is ignored for styling behavior.

### Inline Formatting
- Supported:
  - `**bold**`
  - `__bold__`
  - `*italic*`
  - `_italic_`
  - `***bold and italic***`
  - `___bold and italic___`
  - `` `inline code` ``
  - `[label](https://example.com)`
  - raw `https://example.com` links
- Prefer asterisk-based emphasis when compatibility matters.
- Combined emphasis such as bold-plus-italic is supported in the basic triple-marker form shown above.

### Tables
- Supported basic pipe tables:

```md
| Column | Meaning |
| --- | --- |
| A | First value |
| B | Second value |
```

- Header alignment markers such as `:---`, `---:`, or `:---:` are tolerated by parsing, but the current renderer does not apply alignment-specific styles.
- Multi-line table cells are not supported.

### Special Project-Specific Patterns
- Bold-only lines may be promoted to section headings in some cases.
- Lines starting with `▪️` are treated as small heading blocks.
- Lines starting with `:` are rendered as short explanatory paragraphs.
- Lines starting with `💡` are rendered as callout blocks.

These are project-specific conventions, not standard Markdown.

## Frontmatter Rules
- Frontmatter must start at the top of the file using `---`.
- Supported array syntax in frontmatter:

```yml
tags:
  - kafka
  - messaging
```

- Frontmatter parsing is intentionally simple.
- Complex YAML structures, nested objects, and advanced YAML syntax should be avoided.
- Metadata rules and required field order belong in [note-data-contract.md](./note-data-contract.md).

## Known Limitations
- This is not a full CommonMark implementation.
- The renderer currently does not support:
  - nested lists with reliable indentation semantics
  - task lists like `- [ ] item`
  - images
  - HTML blocks
  - footnotes
  - definition lists
  - reliable nested or multi-paragraph blockquote behavior
  - language-aware code highlighting
  - table cell alignment styling
  - multi-line table cells

## Authoring Guidance
- Prefer simple, explicit Markdown.
- Use frontmatter `summary` instead of relying on body extraction when the note matters for browse quality.
- Use `##`, `###`, and `####` headings for structure that should appear in the reading outline.
- Keep tables simple and single-line per row.
- Avoid depending on advanced GitHub-specific Markdown features unless the renderer is upgraded first.

## Compatibility Rule
- If rendering behavior changes in `assets/js/note-detail-renderer.js`, update this document in the same change.
- If note authoring guidance changes, update [note-data-contract.md](./note-data-contract.md) only when the change affects note structure or metadata expectations.
