# FEAT-0031: Design Tab Canvas Shell Handoff

## Metadata

- ID: `feat-0031`
- Status: `passed`
- Type: `product`
- Surface: `frontend`
- Execution Profile: `frontend-product`
- Required Evaluators: `design`, `functional`, `ux-heuristic`
- Parent PRD: [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Goal

- Product feature:
  - connect the topbar `Design` entry to a design canvas state where the notes sidebar fades away and the design surface reclaims the full available canvas.

## Acceptance Contract

- Clicking `Design` in the topbar enters the design surface.
- The outgoing notes shell softly fades and blurs during the handoff while its layout dimensions stay stable.
- The Design route enters with a slight scale-in so the visual story reads as leaving notes and entering a canvas.
- From the Design route, hovering `Notes` only applies topbar hover styling and does not expose the taxonomy dropdown.
- Clicking `Notes` from the Design route softly fades the Design canvas before returning to the notes shell; if the pointer still hovers `Notes` after route entry, the first-depth dropdown opens on the notes shell.
- Same-route `Notes` clicks on note/archive shells do not reload the shell or reinitialize sidebar menus.
- The topbar preserves the clicked/hovered menu state across Notes/Design document navigations to reduce reload flicker.
- Sidebar category and tag regions reserve loading space so async menu rendering does not push the tag area around.
- Clicking `Design` while already on the Design route resets the Design browser to its initial state without replaying a route transition.
- The design route owns the full-canvas layout after navigation instead of exposing archive-content expansion during the handoff.
- The hidden sidebar is not pointer-active, keyboard-focusable, or announced as the active navigation surface.
- Reduced-motion users receive an immediate or near-immediate sidebar/canvas state change.
- Returning to note archive surfaces restores the sidebar intentionally.
- The route and full-canvas surface make clear that `Design` owns the current surface; topbar menu styling remains hover/focus-only.
- Route entry, refresh, and browser back/forward behavior remain coherent with the route/state contract from `feat-0028`.

## Scope Boundary

- In:
  - topbar `Design` activation
  - design canvas mode state
  - soft outgoing shell crossfade
  - slight Design route scale-in
  - Design route `Notes` click return without hover dropdown
  - reverse Design-to-Notes shell crossfade
  - topbar hold-state continuity across Notes/Design document swaps
  - same-route Notes click stability
  - sidebar loading-layout stability
  - same-route Design reset behavior
  - stable outgoing archive layout during handoff
  - sidebar fade-out during the crossfade
  - restoring sidebar on note/archive return
  - reduced-motion shell behavior
  - hover/focus-only topbar menu state for `Design`
  - interaction isolation for hidden sidebar
- Out:
  - implementing the rollable card browser itself
  - implementing card detail or peek behavior
  - removing the sidebar globally
  - redesigning note archive sidebar content
  - dynamic design data injection
  - changing unrelated topbar placeholders such as `Projects`, `Game`, or `About`

## Contract Surfaces

- Topbar `Notes` and `Design` link or button behavior.
- Body or shell state used for design canvas mode.
- Sidebar visibility, inert/focus, and accessibility behavior.
- Soft shell crossfade, reverse shell return, and main canvas layout after route entry.
- Route/state synchronization with the selected design surface entry.

## Required Evaluators

- `design`: soft crossfade transition polish, canvas spacing, hover/focus-only topbar menu state, responsive fit.
- `functional`: click entry, Notes dropdown behavior, return behavior, route/refresh/back-forward behavior, inert hidden sidebar.
- `ux-heuristic`: orientation during shell handoff and whether the surface feels like a deliberate canvas mode.

## User-Visible Outcome

- The user clicks `Design`, sees the notes shell fade back without stretching, then lands on a Design canvas that subtly scales into place.
- On the Design route, the user can hover `Notes` like a normal topbar item without opening the taxonomy dropdown, or click `Notes` to return through a matching soft fade.
- Repeatedly clicking `Notes` while already on the notes shell does not flicker or reload the sidebar.
- Topbar menu state reads as continuous while content switches between Notes and Design.

## Entry And Exit

- Entry point:
  - topbar `Design` action or direct design surface route entry.
- Exit or transition behavior:
  - navigating back to notes or archive surfaces restores the sidebar and exits design canvas mode.

## State Expectations

- Default:
  - notes/archive surfaces keep the sidebar visible.
- Loading:
  - route or initial render does not briefly show an incorrect sidebar/canvas combination if avoidable.
- Empty:
  - if design content is not yet available, the canvas mode still owns the layout without exposing an empty sidebar gutter.
- Error:
  - design surface failure should not leave the sidebar hidden on unrelated note/archive routes.
- Success:
  - shell state matches the current topbar route and surface.

## Dependencies

- Approved parent PRD [prd-0010-design-tab-rollable-card-discovery.md](../prd/prd-0010-design-tab-rollable-card-discovery.md)
- Prefer after `feat-0028-design-surface-route-and-content-contract` selects the design route or entry state.
- Coordinate with `feat-0029-rollable-design-card-browse` so the routed design page uses the full canvas after the crossfade completes.

## Likely Affected Surfaces

- [index.html](../../../index.html)
- [assets/css/layouts.css](../../../assets/css/layouts.css)
- [assets/css/components.css](../../../assets/css/components.css)
- [assets/js/shell-bootstrap.js](../../../assets/js/shell-bootstrap.js)
- [assets/js/topbar.js](../../../assets/js/topbar.js)
- [assets/js/sidebar.js](../../../assets/js/sidebar.js)
- [assets/js/archive/route.js](../../../assets/js/archive/route.js)
- Future design-surface JavaScript or entry file

## Pass Or Fail Checks

- Clicking `Design` enters design canvas mode.
- The outgoing archive shell fades and blurs in normal motion mode.
- The Design canvas subtly scales into place after route entry.
- The Design route `Notes` item does not open the taxonomy dropdown on hover/focus.
- Clicking `Notes` from Design uses a soft reverse fade before the notes shell returns.
- Clicking `Notes` from a notes shell does not reinitialize sidebar category or tag loading.
- Notes/Design document navigation preserves the target topbar menu state during route entry.
- Clicking `Design` from Design resets to the first card without route handoff animation.
- Archive content does not visibly stretch wider during the handoff.
- Hidden sidebar cannot receive pointer clicks or keyboard focus.
- Reduced-motion mode does not rely on a long fade.
- Navigating back to `/archive/` or `/archive/note/` restores the sidebar.
- Browser refresh and back/forward do not leave stale canvas/sidebar state.
- Topbar `Design` does not keep persistent active color or underline after route entry.

## Regression Surfaces

- Notes sidebar interactions
- Topbar `Notes` dropdown
- Archive list and note-detail routes
- Landing entry state
- Search field behavior in topbar and landing entry

## Harness Trace

- Active spec doc: [spec-0010-design-tab-canvas-shell-handoff.md](../spec/spec-0010-design-tab-canvas-shell-handoff.md)
- Active run: [run-20260503-01-design-tab-canvas-shell-handoff.md](../run/run-20260503-01-design-tab-canvas-shell-handoff.md)
- Execution profile: `frontend-product`
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-05-02`: initial draft created from approved PRD-0010.
- `2026-05-02`: approved by the human owner for downstream spec planning.
- `2026-05-03`: passed after topbar `Notes` and `Design` route wiring, sidebar handoff, sidebar inert state, design route state, and browser route restoration were implemented and smoke-tested.
- `2026-05-03`: post-pass topbar polish normalized hover/focus color and removed persistent visual active styling from `Design` so topbar items only underline/color-change on hover or focus.
- `2026-05-03`: normal-motion handoff briefly changed to a center-out canvas wipe over a stable archive shell, then was superseded by a softer shell crossfade plus slight Design canvas scale-in.
- `2026-05-03`: Design route `Notes` restored the shared taxonomy dropdown and added a reverse Design-to-Notes soft crossfade.
- `2026-05-03`: same-route `Design` clicks reset the Design browser instead of replaying route-entry animation.
- `2026-05-03`: same-route `Notes` clicks no longer reload the notes shell, Design-to-Notes keeps the hovered Notes dropdown locked during handoff, and sidebar loading areas reserve space to prevent category/tag layout flicker.
- `2026-05-03`: added explicit topbar hold-state continuity so Notes/Design page swaps preserve the clicked or hovered menu state during route entry.
- `2026-05-03`: moved topbar hold-state bootstrap ahead of first paint and changed release to wait for hover/focus or the next pointer move, preventing the link color/underline from briefly dropping during document navigation.
- `2026-05-03`: kept the Design route topbar shell width stable by reserving the right search slot invisibly and fading the Notes search slot out during Design handoff.
- `2026-05-03`: extended the before-first-paint return state to the Notes sidebar and archive shell so Design-to-Notes does not briefly paint the sidebar before the return animation starts.
- `2026-05-03`: same-route pointer clicks on `Notes` now release the temporary dropdown handoff lock and blur the trigger, so moving the pointer away clears the highlight.
- `2026-05-03`: refined same-route `Notes` clicks so the dropdown stays open while hovered, and Design-to-Notes dropdown navigation restores the active first or second depth branch during route entry.
- `2026-05-03`: topbar taxonomy rendering now keeps the first-depth dropdown open if the pointer or focus is already inside `Notes` while menu data replaces the loading state.
- `2026-05-03`: superseded Design-route dropdown parity: `Notes` hover on Design now behaves like a plain topbar hover, and clicking `Notes` returns to the notes shell where first-depth opens only if the pointer still hovers `Notes`.
- `2026-05-03`: slowed Notes-to-Design and Design-to-Notes handoff/entry motion to about 520ms so the shell fade, canvas scale-in, and notes return feel less abrupt.
- `2026-05-03`: refined Design-to-Notes return timing with an explicit Design canvas exit animation and deferred the returned `Notes` dropdown until after the notes shell animation finishes.
- `2026-05-03`: hid the topbar taxonomy panel until async taxonomy data is ready, preventing the transient `Loading notes...` placeholder from appearing during Design-to-Notes return.
