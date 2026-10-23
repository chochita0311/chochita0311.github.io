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

## Harness Context And Experience

- When a canonical target starts or resumes and prior context materially affects understanding or execution, apply `docs/policies/harness/operator-briefing-and-review-receipts.md`; otherwise preserve the normal response shape.

When Harness Improvement is selected, follow
docs/agents/operations/harness-improvement.md for ordinary stage entry, observed
component use, and closing reflection. Find the default local store at
docs/evidence/STORE.md or an existing override through this consumer's approved
private context. Follow the configuration procedure for first setup; preserve
existing records and report unresolved conflicts without resetting them. With a
ready binding, retrieve relevant experience and retain knowledge and improvement work in common records as
part of the normal PRD/feature/spec/build/evaluate/fix flow without a separate
user command. Otherwise report the persistence gap and keep observations
session-only. Preserve existing approvals; export common experience only
within its separately applicable source-edit and disclosure authority.
In established ai-assets commonization context, recognize short export requests
through that operation's Recognize An Export Request section. Without a narrower
selection, review available current-project harness, skill/resource and UI/UX
experience. Respect case-only, review-only and category/time limits; generalize
and review public fitness before any common-source write.
Use Improvement Record v1 for reusable experience and unresolved asset-level
work. Import selected public records as references or explicit work candidates;
keep local applicability and execution in the private receipt/task owner. Follow
the operation's maintenance and record import/export procedures, preserving
revisit conditions and action authority. A pending task is not a supported lesson.
