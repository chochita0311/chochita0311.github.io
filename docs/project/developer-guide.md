# Developer Guide

## Local Run
Follow the local run instructions in `README.md`.

## Change Approach
- Read the touched files first.
- Prefer small, focused changes.
- Reuse existing project patterns before introducing new abstractions.
- Do not treat sandbox tool issues as repository failures without checking the environment context.
- Refer to `docs/project/policy.md` for scope decisions and `docs/project/architecture.md` for structure details.

## Content Updates
- Add durable note content under `notes/`.
- Keep folders and filenames searchable and understandable.
- If a task must expose new or changed content in the current UI, update the local JSON preview data when required.

## Verification
- Run the simplest verification that matches the change.
- If required validation cannot run in the current environment, state that clearly.
- Do not claim full validation when key commands could not be executed.

## Documentation Updates
- Update only the document that owns the changed fact, then replace duplication elsewhere with links or pointers.
- Update `README.md` for user-facing usage changes.
- Update `docs/project/` for project policy, architecture, workflow, or roadmap changes.
- Update `docs/designs/` for design-specific changes.
