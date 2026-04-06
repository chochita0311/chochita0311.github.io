# Developer Guide

## Local Run
Follow the local run instructions in `README.md`.

## Change Approach
- Read the touched files first.
- Prefer small, focused changes.
- Reuse existing project patterns before introducing new abstractions.
- Do not treat sandbox tool issues as repository failures without checking the environment context.
- Use `docs/project/policy.md` for scope decisions and `docs/project/architecture.md` for structure details.
- When a bug or UX regression reveals a repeatable project rule, record that rule in this guide instead of leaving it as one-off memory.

## Interaction Stability
- Click-driven view changes should swap to the next state only when the destination content is ready enough to avoid visible flicker, flash, or placeholder-only intermediate states.
- Do not expose internal source paths, loading scaffolds, or temporary copy during normal screen transitions if the user can avoid seeing them.
- Prefer atomic content swaps, cached data reuse, and background prefetching over clearing the current screen first and then rebuilding it.
- Verify important browse and read flows by clicking through them in a browser and checking for brief visual flashes, unstable sticky regions, or loading-state leaks.

## Content Updates
- Add durable note content under `CATEGORIES/` using the current pattern `CATEGORIES/<category>/<collection>/<note>.md`.
- Use the note metadata contract in `docs/project/note-data-contract.md` when adding or normalizing note frontmatter.
- Keep folders and filenames searchable and understandable.
- Update the visible archive shell and owner docs when the category structure changes.

## Verification
- Run the simplest verification that matches the change.
- If required validation cannot run in the current environment, state that clearly.
- Do not claim full validation when key commands could not be executed.

## Documentation Updates
- Update only the document that owns the changed fact, then replace duplication elsewhere with links or pointers.
- Update `README.md` for user-facing usage changes.
- Update `docs/project/` for project policy, architecture, workflow, or roadmap changes.
- Update `docs/designs/` for design-specific changes.
