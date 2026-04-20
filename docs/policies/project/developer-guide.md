# Developer Guide

## Local Run
Follow the local run instructions in `README.md`.

## Change Approach
- Read the touched files first.
- Prefer small, focused changes.
- Reuse existing project patterns before introducing new abstractions.
- Do not treat sandbox tool issues as repository failures without checking the environment context.
- Use `docs/policies/project/policy.md` for scope decisions and `docs/policies/project/architecture.md` for structure details.
- When a repeatable visual or interaction rule emerges, move it to the owning policy layer instead of leaving it as one-off memory.
- Use `docs/policies/design/design-evaluation.md` for reusable visual evaluation rules.
- Use `docs/policies/experience/interaction-evaluation.md` for reusable interaction-quality evaluation rules.

## Icon Changes
- Use `assets/js/icons.js` as the canonical runtime owner for approved icon names.
- Add new icons to the shared registry before using them in JavaScript-rendered markup.
- Keep the published runtime on Material Symbols Outlined unless the design docs explicitly approve another family.
- Static HTML should follow the shared `icon icon--material material-symbols-outlined` class pattern.
- Decorative icons should be hidden from assistive technology by default, and icon-only buttons must carry an `aria-label`.
- Use `docs/policies/system/icon.md` for the detailed policy and approved inventory.

## Note Content Updates
- Add durable note content under `NOTES/` using the current pattern `NOTES/<category>/<collection>/<note>.md`.
- Use `docs/policies/archive/note/note-maintenance-workflow.md` for the operational add/move/import workflow.
- Use the note metadata contract in `docs/policies/archive/note/note-data-contract.md` when adding or normalizing note frontmatter.
- Use `docs/policies/archive/note/markdown-rendering.md` when changing supported Markdown body syntax or note authoring expectations.
- Keep folders and filenames searchable and understandable.
- Regenerate `assets/generated/archives-index.json` with `node scripts/generate-archives-index.mjs` after note or folder changes.
- Regenerate `sitemap.xml` with `node scripts/generate-sitemap.mjs` after note additions, moves, or note URL-shape changes, and only after the archive index is current.
- Keep `robots.txt` pointing at the published sitemap URL.
- Update the visible archive shell and owner docs when the category structure changes.

## Verification
- Run the simplest verification that matches the change.
- After icon, HTML shell, or icon-related JS changes, run `node scripts/check-icon-control.mjs` if the script matches the current runtime structure; otherwise use a targeted manual icon audit and record the fallback clearly.
- When sitemap-related files change, verify that `sitemap.xml` is valid XML-shaped output with absolute site URLs and that `robots.txt` still points to the correct sitemap location.
- After deployment, submit or recheck `https://chochita0311.github.io/sitemap.xml` in Google Search Console.
- If required validation cannot run in the current environment, state that clearly.
- Do not claim full validation when key commands could not be executed.

## Documentation Updates
- Update only the document that owns the changed fact, then replace duplication elsewhere with links or pointers.
- Update `README.md` for user-facing usage changes.
- Update `docs/policies/` for durable rules, guides, contracts, or governance changes.
- Update `docs/plans/` for action plans, roadmaps, refactoring tracks, or active sequencing changes.
