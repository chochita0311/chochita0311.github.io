# Run: Design Tab Canvas Shell Handoff

## Metadata

- ID: `run-20260503-01`
- Status: `passed`
- Feature: [feat-0031-design-tab-canvas-shell-handoff.md](../feature/feat-0031-design-tab-canvas-shell-handoff.md)
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Active Spec: [spec-0010-design-tab-canvas-shell-handoff.md](../spec/spec-0010-design-tab-canvas-shell-handoff.md)
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Created: `2026-05-03`
- Updated: `2026-05-03`

## Goal

- Execute the topbar Notes/Design route wiring and design canvas handoff for `feat-0031`.

## Selected Loop

- Feature type: `product`
- Surface: `frontend`
- Surface lanes:
  - topbar route wiring
  - design canvas handoff
- Required evaluators:
  - `design`
  - `functional`
  - `ux-heuristic`
- Current phase: `passed`

## Contract Surfaces

- Topbar `Notes` trigger route.
- Topbar `Design` link route.
- Body handoff class.
- Sidebar inert/aria-hidden state during handoff.
- `/archive/design/` full-canvas entry.

## Invocation Context

- Golden sources:
  - approved `feat-0031`
  - implemented `/archive/design/` page
- Relevant policies:
  - [interaction-evaluation.md](../../policies/experience/interaction-evaluation.md)
- Optional skills or tools expected:
  - none

## Current Artifacts

- Spec: [spec-0010-design-tab-canvas-shell-handoff.md](../spec/spec-0010-design-tab-canvas-shell-handoff.md)
- Contract evaluation:
- Design evaluation:
- Functional evaluation:
- UX heuristic evaluation:
- Fix log:
- Heuristic backlog:

## Current Route

- Next role: `human-review`
- Current blocker classification:
- In-run route: `completed`
- Post-run recommendation for human review:
  - accept `feat-0031` as passed

## Attempts

- Attempt 1:
  - status: `passed`
  - outcome:
    - topbar `Design` links now route to `/archive/design/` from root, archive, and note archive shells.
    - topbar `Notes` trigger now routes to `/archive/note/` on click while retaining hover/focus taxonomy dropdown behavior.
    - design handoff state isolates the sidebar, keeps the archive shell stable, crossfades the outgoing shell, then routes to the full-canvas design page with a slight canvas scale-in.
    - `/archive/design/` exposes the shared `Notes` taxonomy dropdown and uses a reverse soft fade back to `/archive/note/`; topbar menu styling stays hover/focus-only.
  - notes:
    - implement topbar route wiring and sidebar/canvas handoff.

## Post-Contract Regression Check

- Needed: yes
- Result: passed
- Notes:
  - focused Prettier check passed on touched files.
  - `npm run lint:js` completed with warnings only; warnings are existing unused-symbol warnings outside the handoff change.
  - Browser smoke checks passed for root-to-design, design-to-notes, handoff sidebar inert state, design route state, and browser back restoration.

## Human Review Outcome

- Decision:
- Returned layer if any:
- Follow-up run:

## Continuity Notes

- `2026-05-03`: run initialized from approved `feat-0031` and `spec-0010`.
- `2026-05-03`: run passed after implementation, focused checks, and browser smoke verification.
- `2026-05-03`: post-pass topbar polish removed persistent `Design` active styling and normalized topbar hover/focus color to `--page-brand-strong` so `Notes`, `Design`, and other topbar items behave consistently.
- `2026-05-03`: verified that landing and design-route topbar items reset to muted text with no underline after mouse-away, while hover and click handoff use `--page-brand-strong`.
- `2026-05-03`: superseded the center-out wipe with a soft shell crossfade and slight `.design-main` scale-in; the outgoing archive layout remains stable and no handoff overlay is used.
- `2026-05-03`: browser smoke verified `/archive/note/` handoff keeps `.archive-main` width and left margin stable, fades/blurs the outgoing shell, keeps sidebar inert/aria-hidden, loads `/archive/design/` with 20 cards, and disables the scale-in under reduced motion.
- `2026-05-03`: restored the shared `Notes` taxonomy dropdown on `/archive/design/` and added a reverse Design-to-Notes crossfade with notes-shell return entry.
- `2026-05-03`: browser smoke verified `/archive/design/` `Notes` hover opens the taxonomy dropdown, Design-to-Notes applies `is-notes-handoff`, the notes shell returns with `notes-shell-enter`, Notes-to-Design still crossfades with stable archive dimensions, and reduced-motion Design-to-Notes skips animation.
- `2026-05-03`: same-route `/archive/design/` `Design` click now dispatches `design:reset`, returns the card browser to `01 / 20`, and avoids route handoff or page-entry replay.
- `2026-05-03`: same-route note-shell `Notes` clicks now no-op instead of reloading, Design-to-Notes locks the hovered Notes dropdown open during handoff, and sidebar category/tag regions reserve loading space to reduce menu/tag flicker.
- `2026-05-03`: browser smoke verified repeated note-shell `Notes` click keeps the same document marker, does not navigate, preserves sidebar category height and tag position, and Design-to-Notes keeps the Notes dropdown open during `is-notes-handoff`.
- `2026-05-03`: added explicit topbar hold-state continuity so Notes/Design page swaps preserve the clicked or hovered menu state during route entry.
- `2026-05-03`: browser smoke verified Notes-to-Design stores `topbar-hold=design` and enters Design with `data-topbar-hold="design"`, while Design-to-Notes stores `topbar-hold=notes` and enters Notes with the Notes dropdown still expanded.
- `2026-05-03`: tightened topbar continuity after human review by bootstrapping `data-topbar-hold` before first paint and delaying hold release until hover/focus or the next pointer move can take over.
- `2026-05-03`: browser smoke verified Notes-to-Design and Design-to-Notes keep color and underline through route entry at 0ms, 120ms, 460ms, and 900ms; a no-hover direct entry keeps the hold until the next pointer move clears it.
- `2026-05-03`: reserved the Design route right topbar slot and faded the Notes search slot during handoff so the topbar does not shift when the visible search field leaves or returns.
- `2026-05-03`: applied the before-first-paint notes-return state to the sidebar and archive shell to prevent a visible sidebar flash before `is-notes-return` starts animating.
- `2026-05-03`: fixed same-route `Notes` pointer click focus persistence by releasing `data-handoff-open` and blurring the trigger while preserving keyboard focus behavior.
- `2026-05-03`: corrected the `Notes` click behavior so the dropdown remains open while the pointer is still hovering it, and restored active dropdown branch state for Design-to-Notes first/second-depth menu handoff.
- `2026-05-03`: preserved an already-hovered or focused first-depth `Notes` dropdown when async taxonomy rendering swaps the loading menu for real menu items.
- `2026-05-03`: superseded the Design-route dropdown parity behavior after human clarification: `Notes` hover on Design now stays a plain topbar hover without opening taxonomy, and clicking `Notes` returns to the notes shell where first-depth opens only if hover/focus still owns `Notes`.
- `2026-05-03`: tuned route handoff timing after human review by extending Notes-to-Design, Design-to-Notes, Design entry, and Notes return motion to about 520ms for a softer appearance.
- `2026-05-03`: browser smoke verified computed motion timing: Design entry and Notes return animations report `0.52s`, while sidebar/archive/design-main handoff transitions report `0.42s` to `0.52s`.
- `2026-05-03`: adjusted Design-to-Notes after human review so the outgoing Design canvas uses an explicit roughly 680ms exit animation and the returned `Notes` dropdown is deferred until after the notes shell return animation.
- `2026-05-03`: browser smoke verified Design-to-Notes timing: `design-surface-exit` reports `0.68s`, `notes-shell-enter` reports `0.62s`, and the `Notes` dropdown remains hidden during notes return before opening after the shell animation finishes.
- `2026-05-03`: added a taxonomy-ready gate for the topbar dropdown so the initial `Loading notes...` placeholder cannot be shown by hover CSS before real taxonomy data renders.
- `2026-05-03`: browser smoke verified the taxonomy-ready gate: with taxonomy fetch held pending, `Loading notes...` remains in markup but the dropdown computes to `display: none`; after taxonomy is ready, hover opens real category items.
- `2026-05-03`: centered idle topbar navigation text by moving the underline from layout-affecting `border-bottom` to a non-layout `::after` underline, while preserving the slight hover/focus lift.
- `2026-05-03`: changed topbar handoff hold release so pointer-away during Notes-to-Design or Design-to-Notes clears both the visible hold and stored route-entry hold immediately instead of keeping the clicked hover state until the next surface finishes loading.
- `2026-05-03`: fixed a Design-to-Notes edge case where the user could hover `Notes` during the deferred notes-return animation and end with only the topbar hover state; when the return animation finishes, the dropdown now rechecks current hover/focus ownership and opens if taxonomy data is ready.
- `2026-05-03`: split route/shell handoff coordination out of `topbar.js` into `assets/js/shell-handoff.js`; `topbar.js` now owns topbar taxonomy, hover/focus, dropdown, and visual hold APIs, while `shell-handoff.js` owns route delays, body transition classes, sidebar inert state, and handoff storage.
