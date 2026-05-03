# SPEC-0010: Design Tab Canvas Shell Handoff

## Metadata

- ID: `spec-0010`
- Status: `approved`
- Run ID: `run-20260503-01`
- Attempt: `1`
- Parent Feature: [feat-0031-design-tab-canvas-shell-handoff.md](../feature/feat-0031-design-tab-canvas-shell-handoff.md)
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Surface Lane: `topbar-route-and-canvas-handoff`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Created: `2026-05-03`
- Updated: `2026-05-03`

## Source Set

- Human request:
  - run `feat-0031`
  - make notes route and design route usable from the main page
- Parent feature:
  - [feat-0031-design-tab-canvas-shell-handoff.md](../feature/feat-0031-design-tab-canvas-shell-handoff.md)
- Parent PRD:
  - [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Golden sources:
  - current topbar in `index.html`, `archive/index.html`, and `archive/note/index.html`
  - first-pass `/archive/design/` route from `feat-0028`
- Relevant policies or contracts:
  - [interaction-evaluation.md](../../policies/experience/interaction-evaluation.md)
  - [architecture.md](../../policies/project/architecture.md)

## Implementation Goal

- Wire topbar `Notes` and `Design` route entry points so the main shell can move between notes and design surfaces, with a soft shell crossfade before entering `/archive/design/` and a slight Design canvas scale-in after route entry.

## In-Scope Behavior

- Existing note/archive topbar `Design` links navigate to `/archive/design/`.
- Clicking `Design` from pages that have the notes sidebar applies a short design-handoff state before navigation.
- During handoff, the outgoing archive shell fades and blurs while its layout dimensions stay stable.
- During handoff, the sidebar fades with the shell instead of visibly sliding away.
- After route entry, the Design canvas fades in with a slight scale-in.
- During handoff, the sidebar is inert and `aria-hidden`.
- Reduced-motion users navigate immediately or near-immediately.
- Clicking the topbar `Notes` trigger opens `/archive/note/`; hover/focus exposes the existing notes taxonomy dropdown only on note/archive shells.
- `/archive/design/` keeps hover/focus-only topbar menu styling and does not expose the `Notes` taxonomy dropdown on hover/focus.
- Clicking `Notes` from `/archive/design/` applies a soft reverse fade before navigating to the notes shell.
- After the reverse handoff, the first-depth `Notes` dropdown opens on the returned notes shell only if pointer hover or focus still owns `Notes`.
- The fixed topbar preserves the clicked or hovered menu state across Notes/Design page swaps so route entry does not visually snap back.
- Same-route `Notes` clicks on note/archive shells are handled in place and do not reload the page.
- Sidebar category and tag regions reserve loading space before async data renders.
- Clicking `Design` from `/archive/design/` resets the Design browser to its initial state without route handoff animation.

## Out-Of-Scope Behavior

- Rebuilding the notes taxonomy dropdown.
- Implementing dynamic design data.
- Changing project, game, or about placeholder behavior.
- Changing the rollable card browser implementation from `feat-0029`.
- Changing note archive list, search, or note-detail rendering.

## Affected Surfaces

- [index.html](../../../index.html)
- [archive/index.html](../../../archive/index.html)
- [archive/note/index.html](../../../archive/note/index.html)
- [archive/design/index.html](../../../archive/design/index.html)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/js/shell-bootstrap.js](../../../assets/js/shell-bootstrap.js)
- [assets/js/topbar.js](../../../assets/js/topbar.js)
- [assets/js/shell-handoff.js](../../../assets/js/shell-handoff.js)

## State And Interaction Contract

- Notes/default state:
  - sidebar is visible on note/archive shells.
  - topbar `Notes` click navigates to `/archive/note/`.
  - same-route topbar `Notes` clicks do not trigger a reload.
- Design handoff state:
  - body receives a handoff class.
  - outgoing archive shell fades and blurs without changing width or margin.
  - sidebar fades and becomes inert during the crossfade.
  - outgoing archive content does not visibly expand before navigation.
  - navigation to `/archive/design/` happens after the roughly 520ms normal-motion transition, or immediately for reduced motion.
- Design route state:
  - `/archive/design/` loads the full-canvas design page with hover/focus-only topbar menu state and a roughly 520ms slight normal-motion scale-in.
  - hovering or focusing `Notes` on `/archive/design/` does not open the taxonomy dropdown.
  - same-route `Design` clicks dispatch a Design reset instead of reloading the route.
- Notes return handoff state:
  - body receives a notes-handoff class.
  - outgoing Design canvas uses an explicit roughly 680ms fade/blur/scale exit instead of disappearing abruptly.
  - navigation to `/archive/note/` happens after the normal-motion Design exit, or immediately for reduced motion.
- Return state:
  - `/archive/note/` and `/archive/` load normal note/archive shells with sidebar visible.
  - notes shell may apply a roughly 620ms return-entry animation when reached from Design.
  - the document root holds the return-entry start state before first paint so the sidebar does not flash before the return animation begins.
- Topbar continuity state:
  - outgoing navigation stores the intended topbar hold target.
  - incoming route applies that hold target before first paint through the document root.
  - the shell handoff script keeps that hold only while hover/focus can visually inherit it, using the topbar controller for visual state.
  - if the pointer leaves the clicked topbar target during the outgoing or incoming handoff, the hold state and stored hold target are cleared immediately.
  - same-route pointer clicks on `Notes` release temporary handoff state without closing the dropdown while pointer-hover still owns it.
  - during Design-to-Notes return, the `Notes` dropdown is deferred until after the notes shell return animation; it opens only if hover/focus still owns `Notes` at that point.
  - the topbar taxonomy panel does not open while its async taxonomy data is still loading, so the transient `Loading notes...` placeholder is not exposed during route transitions.
  - async topbar taxonomy rendering preserves an already-hovered or focused first-depth dropdown on normal note/archive shells instead of hiding it when real menu items replace the loading state.
  - the Design route keeps a reserved right topbar slot so the notes search slot does not change the topbar layout during route swaps.

## Data And Contract Assumptions

- `ArchiveRoutes.buildDesignPath()` exists from `feat-0028`.
- `/archive/design/` is a static entry route.
- The handoff animation is a route transition aid, not shared state that persists after navigation.

## Contract Surfaces

- Producer expectations:
  - topbar markup exposes route targets for `Notes` and `Design`.
  - `topbar.js` owns the topbar taxonomy dropdown, hover/focus state, and visual hold controller.
  - `shell-handoff.js` owns the design handoff, notes return click behavior, and route-delay state.
- Consumer expectations:
  - archive shells include `topbar.js` before `shell-handoff.js`.
  - design route includes the shared topbar taxonomy scripts and remains a full-canvas static page.
- Generated artifacts:
  - none.
- Source-of-truth owner:
  - `feat-0031` owns the first-pass shell handoff behavior.
- Stale-assumption check:
  - no topbar `Design` route target should remain `href="#"` on note/archive shells.

## Required Evaluators

- Contract:
  - not required beyond route targets.
- Design:
  - inspect soft shell crossfade, stable outgoing archive layout, Design canvas scale-in, reverse notes return, topbar continuity, and hover/focus-only topbar menu state.
- Functional:
  - inspect notes/design navigation, same-route Notes clicks, Design-route Notes hover suppression, reduced motion, sidebar inert behavior, refresh, and back/forward.
- UX heuristic:
  - inspect whether the transition preserves orientation.

## Acceptance Mapping

- Clicking `Design` enters design surface:
  - `href="/archive/design/"` plus `shell-handoff.js` handoff.
- Sidebar fade:
  - `body.is-design-handoff .sidebar`.
- Shell crossfade:
  - `body.is-design-handoff .archive-main`.
  - `body.is-design-handoff .sidebar`.
- Design scale-in:
  - `.design-main`.
- Same-route Design reset:
  - `design:reset` event.
  - no `is-design-handoff` class and no page reload.
- Notes return fade:
  - `body.is-notes-handoff .design-main`.
  - `body.is-notes-return .archive-main`.
  - `body.is-notes-return .sidebar`.
- Sidebar loading stability:
  - `.sidebar__category-list`.
  - `.sidebar__tags`.
- Topbar continuity:
  - `.topbar`.
  - `[data-topbar-hold]`.
- Hidden sidebar isolation:
  - `inert` and `aria-hidden` set before navigation.
- Reduced motion:
  - near-immediate navigation.
- Return:
  - `/archive/note/` route remains normal sidebar shell.
- Topbar state:
  - design page topbar keeps hover/focus-only menu styling.
  - design page `Notes` hover/focus does not open the taxonomy dropdown.

## Evaluation Focus

- Verify route entry from root and note/archive pages.
- Verify the handoff class appears before navigation.
- Verify `/archive/design/` uses full canvas and `/archive/note/` restores sidebar.
- Verify no `Design` topbar links remain dead placeholders.
- Verify same-route `Design` clicks reset the card browser without replaying route transition effects.
- Verify same-route `Notes` clicks do not reload the note shell or replay sidebar loading.
- Verify sidebar category/tag loading does not push the tag section after initial render.

## Open Blockers

- None.

## Continuity Notes

- `2026-05-03`: initial spec created for approved `feat-0031`.
