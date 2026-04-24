# Repository Guidelines

## Purpose
- GitHub Pages home for `https://chochita0311.github.io`
- Lightweight personal notes site for browsing, searching, and preserving long-term study materials
- Optimize for long-term maintainability as the note archive grows

## Use This File For
- quick repository orientation
- top-level working rules
- source-of-truth routing into `README.md`, `docs/policies/`, and `docs/plans/`

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
- `NOTES/`: current long-term Markdown archive
- `assets/`: frontend assets for the static app
- `docs/`: documentation map, project guides, design docs, and deeper references
- `index.html`: current static entry page

## Source Of Truth
- Keep `AGENTS.md` short and operational
- Keep first-time user overview and local usage in `README.md`
- Keep durable rules, definitions, contracts, and guides under `docs/policies/`
- Keep execution tracks, active plans, and refactoring work under `docs/plans/`

## Working Rules
- Prefer small, focused changes unless the task explicitly asks for a broader restructure
- Read the touched files first before changing patterns or structure
- When changing code or documents, review related comments, nearby docs, and adjacent maintenance guidance, and update them if they became stale
- Preserve GitHub Pages compatibility
- Keep the app lightweight and static-first
- Reuse existing project patterns before introducing new abstractions
- Do not revert unrelated user changes

## Notes And Data Rules
- New durable note content belongs under `NOTES/`
- Keep folders and filenames easy to search and understand
- If the UI still depends on local JSON preview data, keep that data aligned when a task requires parity

## Documentation Rules
- When behavior, structure, setup, or workflow changes, update the relevant Markdown docs in the same turn
- Use kebab-case for Markdown filenames under `docs/` unless there is a strong reason to preserve an existing name
- Keep each document responsible for one clear purpose
- Remove duplicated guidance by keeping one owner doc and linking to it elsewhere
- Link to adjacent docs instead of repeating their content
- Prefer seamless doc navigation across entrance, overview, project, and design layers
- Keep `docs/` split cleanly between policy ownership and plan ownership

## Planning And Ownership
- Only the human owner defines plan and acceptance criteria when the repo is using the shared role/task workflow; treat Product Manager as that owner only when explicitly assigned
- Keep shared logs, tables, plans, and role docs concise and understandable across projects
- When the request is to create or revise a `PRD`, treat it as planning-only work: write or update the PRD, then stop.
- Do not start feature planning, spec work, code changes, or evaluation from a `draft` PRD.
- Do not start spec work, code changes, or evaluation until one feature boundary is explicitly approved.
- If open points could still change scope, acceptance, dependency, or user-visible behavior, stop and ask instead of implementing.
- Do not reinterpret a planning request as implementation approval unless the user explicitly says to proceed with implementation.
