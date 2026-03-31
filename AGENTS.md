# Repository Guidelines

## Purpose
- This repository is the GitHub Pages home for `https://chochita0311.github.io`
- It is a lightweight personal notes site for browsing, searching, and preserving long-term study materials
- Keep the project easy to maintain as the note collection grows

## Product Scope
- In scope:
  - note browsing
  - note search
  - note reading
  - note organization and long-term maintenance
- Out of scope unless explicitly planned:
  - unrelated dashboard expansion
  - membership or upsell features
  - notification-center patterns
  - heavy framework or build-tool adoption

## Codebase Map
- Scan the project root first before making structural assumptions
- `notes/`: long-term note archive
- `assets/`: frontend assets for the static app
- `docs/`: project, design, task, and shared reference documents
- `index.html`: current static entry page

## Source Of Truth
- Keep `AGENTS.md` short and operational
- Keep first-time user overview and local usage in `README.md`
- Keep project-specific detail under `docs/project/`
- Keep design-specific detail out of `AGENTS.md` and in `docs/designs/`

## Working Rules
- Prefer small, focused changes unless the task explicitly asks for a broader restructure
- Read the touched files first before changing patterns or structure
- When changing code or documents, review related comments, nearby docs, and adjacent maintenance guidance, and update them if they became stale
- Preserve GitHub Pages compatibility
- Keep the app lightweight and static-first
- Reuse existing project patterns before introducing new abstractions
- Do not revert unrelated user changes

## Notes And Data Rules
- New durable note content belongs under `notes/`
- Keep folders and filenames easy to search and understand
- If the UI still depends on local JSON preview data, keep that data aligned when a task requires UI parity

## Documentation Rules
- When behavior, structure, setup, or workflow changes, update the relevant Markdown docs in the same turn
- Use kebab-case for Markdown filenames under `docs/` unless there is a strong reason to preserve an existing name
- Keep project guidance neat, clean, and concise
- If information is duplicated across docs, merge it into the appropriate higher-level source and restructure the docs so they stay maintainable
- Keep each document responsible for one clear purpose and link to adjacent docs instead of repeating their content
- Prefer seamless doc navigation across layers: entrance, overview, policy, architecture, development, and design
- Use `AGENTS.md` for summary guidance only
- Use `README.md` for user-facing repository usage
- Use project docs for durable implementation detail
- Put detailed maintenance guidance in linked docs instead of expanding `AGENTS.md`, unless the change affects the entrance-map itself

## Planning And Ownership
- Only the Product Manager defines plan and acceptance criteria when the repo is using the shared role/task workflow
- Keep shared logs, tables, plans, and role docs concise and understandable across projects
