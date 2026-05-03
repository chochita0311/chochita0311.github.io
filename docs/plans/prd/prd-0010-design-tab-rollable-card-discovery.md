# PRD-0010: Design Tab Rollable Card Discovery

## Metadata

- ID: `prd-0010`
- Status: `passed`
- Owner role: `human`
- Created: `2026-05-02`
- Updated: `2026-05-02`

## Request Summary

- Enrich the site by turning the current `Design` topbar placeholder into a more visual, playful design-browsing surface.
- Explore a rollable card interaction inspired by `tmp/design_card.html`: still list-like and browseable, but with a stronger visual focus card and more playful movement than the current note list/grid patterns.

## Source Set

- Human request:
  - "let's make a prd."
  - "I want to make enrich my site, especially the design tab."
  - "I put a example as `./tmp/design_card.html`."
  - "the cards should be rollable, like list but I need more vision playful thing."
  - "do you have any ideas can expand list form interaction?"
  - When the user clicks `Design` in the topbar, the current left sidebar should fade away smoothly so the design surface can use the whole available area as a canvas.
  - For the first development pass, do not solve data injection. Use the existing centered card from `tmp/design_card.html` as the specimen and create a 20-card static list from that example.
  - For now, the PRD should focus only on list handling. Card detail, quick-peek, or expansion behavior does not need to be planned in this PRD.
- Golden sources:
  - none yet
- Reference artifact:
  - `tmp/design_card.html`: orbit/trackball-style visual card browsing example with a large focused card, surrounding implied orbit, drag/keyboard hints, and strong atmospheric presentation.
- Supporting docs:
  - `DESIGN.md`
  - `docs/policies/design/design-constitution.md`
  - `docs/plans/design/design-plan.md`
  - `docs/policies/experience/interaction-evaluation.md`
  - `docs/policies/harness/prd-feature-management.md`
  - `docs/plans/prd/prd-0006-archive-route-path-migration.md`
- Current implementation references:
  - `index.html`
  - `assets/css/tokens.css`
  - `assets/css/layouts.css`
  - `assets/css/components.css`
  - `assets/js/archive/content.js`
  - `assets/js/archive/route.js`

## Product Intent

- Make the `Design` area feel like a curated visual archive rather than another plain note category.
- Preserve the site's dark scholarly editorial identity while allowing the design surface to be more spatial, tactile, and collectible.
- Expand the current list/card browsing model into a rollable sequence where each design item can become the visual focus without losing ordered navigation, scanability, or static-site maintainability.
- Give the design surface a canvas mode by removing note-archive sidebar chrome during entry, so visual card browsing has enough uninterrupted stage area.
- Allow the first implementation pass to prove the rollable card interaction with static specimen cards before introducing a durable content/data model.

## Interaction Ideas To Explore

- **Focusable reel list:** Cards keep a list order, but one card is staged as the current focus while previous and next cards remain visible as compressed side or depth previews. Wheel, drag, arrow keys, and swipe move focus one item at a time.
- **Editorial orbit track:** Borrow the sample's orbit idea as a structural metaphor, not a full space theme. The active card sits in the foreground; inactive cards follow a shallow curved track with toned-down scale, opacity, and depth.
- **Stack-peel list:** Cards overlap slightly like a physical stack. Scrolling or dragging peels the next card into focus while the prior card settles behind it, preserving list continuity.
- **Filmstrip plus stage:** A compact vertical or horizontal rail exposes the list index, while the main stage shows the active card with image, title, tags, date, and short rationale.

These are concept candidates for child planning. The PRD does not approve all of them for implementation at once.

## Card Listing And Motion Recommendations

- **Recommended baseline: golden focus reel.** Use one dominant focused card plus two to four surrounding context cards. The focused card should own roughly `61.8%` of the available stage width or visual weight, while the surrounding index/context area uses the remaining `38.2%`.
- **Golden spiral track.** Place inactive cards along a shallow spiral or curved diagonal rather than a flat carousel. The active card sits at the spiral's visual origin; next cards recede along a curve using scale and opacity.
- **Fibonacci stack depth.** Use a predictable depth rhythm for visible cards: active card at `1.0` scale, adjacent cards around `0.82`, secondary cards around `0.68`, and far context cards around `0.56-0.62`. Spacing can follow `13 / 21 / 34 / 55` px offsets where practical.
- **Stage plus index strip.** Keep a thin card index strip on one edge for orientation, but let the main stage stay dominant. This prevents the interaction from becoming a generic carousel while preserving list scanability.
- **Partial-card promises.** Always show a sliver or muted edge of the next and previous cards so the user understands the surface is rollable before interacting.
- **Motion timing.** Use restrained editorial motion: approximately `320-420ms` for the main card transform, `180-260ms` for text opacity or metadata changes, and no more than `55-89ms` of stagger between adjacent cards.
- **Easing.** Prefer a soft deceleration curve such as `cubic-bezier(0.2, 0.7, 0.2, 1)` for card travel. Avoid springy, elastic, or bouncing movement.
- **Interaction feel.** Wheel, swipe, drag, and arrow controls should snap to one card at a time. Free spinning may feel playful, but it risks disorientation and should not be the default.
- **Reduced motion.** Reduced-motion mode should preserve the same golden-ratio layout but replace rolling travel with quick opacity and focus-state changes.

## Recommended Motion Model: Orbital Slide

- Use an **orbital slide**, not a flat slide and not a literal spinning orbit.
- The interaction remains list-ordered: every wheel, swipe, drag release, or arrow action moves the focus by one card and snaps to a stable active card.
- The visual path is curved: cards move through shallow elliptical positions around the active card, which creates the feeling of orbit without allowing uncontrolled spinning.
- The focused card stays near the golden-ratio focal area of the canvas. Incoming cards travel from the context track into focus; outgoing cards slide out to the adjacent context position.
- Card state should be computed from each card's relative index to the active card:
  - active: foreground, `1.0` scale, full readable metadata
  - adjacent: near-context, about `0.82` scale, muted metadata
  - secondary: far-context, about `0.68` scale, thumbnail/title only
  - hidden/offstage: not visually dominant and not focusable
- The first implementation should behave as a finite ordered reel with clear start and end boundaries. Circular wrap can be reconsidered later if the interaction feels too rigid.
- The motion should feel like a card changing orbital lanes, not like a wheel spinning freely.

## Confirmed Scope

- Define a user-facing `Design` tab or archive-kind surface that is distinct from the note archive but still belongs to the same site.
- Clicking the topbar `Design` entry should transition into a design canvas state where the left sidebar fades away smoothly.
- The design surface should reclaim the sidebar's former space so the rollable cards can use the full available content canvas.
- Use `tmp/design_card.html` as an interaction and mood reference for rollable cards, not as a literal styling source to copy wholesale.
- Use golden-ratio composition as a guiding layout principle for the rollable card view, especially the relationship between the focused card, context cards, and orientation controls.
- Create a rollable card browsing model that remains list-like:
  - stable item order
  - clear current item
  - visible previous/next context
  - keyboard and pointer navigation
  - readable metadata
- Treat design items as curated entries, not generic dashboard cards. Each card should be able to show a design title, short description, category or tag metadata, optional visual thumbnail, and optional link target.
- For the first development pass, use 20 static card specimens based on the centered card in `tmp/design_card.html`.
- Defer dynamic data injection, generated indexes, Markdown-derived design content, and durable design-item storage until after the specimen interaction is validated.
- Keep the visual direction compatible with the current dark editorial design system, including tonal layering, restrained accent use, `Inter` / `Noto Sans KR` / `Satoshi` typography roles, and no hard divider-led structure.
- Support desktop-first richness while defining a mobile fallback that does not rely on hover or large spatial depth.
- Preserve GitHub Pages compatibility and the static-first runtime model.
- Keep the current notes browsing, search, and reading flows out of this PRD except where shared shell navigation or route ownership must remain coherent.

## Excluded Scope

- Implementing the design tab, card interaction, route changes, or data files as part of this PRD drafting step.
- Replacing the existing note archive list or grid with the rollable design card model.
- Removing the sidebar globally from note archive, search, or note-detail surfaces.
- Making sidebar disappearance abrupt, permanent, or disconnected from topbar navigation state.
- Planning or implementing card detail, quick-peek, focused expansion, or external-link handoff behavior in this PRD.
- Solving dynamic design data injection in the first implementation pass.
- Building a generated design index, Markdown import pipeline, or permanent design content schema before the static specimen interaction is accepted.
- Turning the whole site into the sample's `Design Cosmos` space UI or importing the sample's Tailwind, Material theme tokens, copy, navigation labels, or external image URLs directly.
- Adding a heavy framework, 3D engine, animation library, or build pipeline only for the design-tab interaction.
- Creating membership, upsell, notification, or unrelated dashboard features.
- Defining the full design content inventory if the source entries, thumbnails, and ownership are not yet confirmed.
- Changing the durable design constitution unless a later approved feature intentionally promotes part of this interaction into reusable design law.

## Uncertainty

- The design content source is not yet defined:
  - static JSON
  - Markdown frontmatter
  - hard-coded curated entries
  - or another repo-local source
- The first pass can use hard-coded specimen cards, but their long-term source of truth remains unresolved.
- The exact route is not fixed. The likely direction should align with the archive-kind model from `prd-0006`, but child planning must decide whether `Design` lives at `/archive/design/`, another static path, or a lighter in-page state.
- The required visual assets are not yet defined. Child planning must decide whether thumbnails come from committed images, generated assets, screenshots, or existing project artifacts.
- The preferred interaction variant is not yet chosen among reel, orbit, stack-peel, filmstrip-stage, or a hybrid.
- The acceptable motion level is not yet fixed, especially for reduced-motion users, mobile devices, and lower-powered browsers.
- The exact golden-ratio mapping is not fixed. Child design work must decide whether the ratio applies to width, scale, stage split, card spacing, motion timing, or a combination.
- The relationship between `Design`, `Projects`, and `Game` topbar placeholders remains open. This PRD only scopes `Design`.

## Constraints

- Preserve the repo's product scope: browsing, searching, reading, organization, and long-term maintenance of personal materials.
- Keep the design surface lightweight and static-hostable on GitHub Pages.
- Reuse existing tokens, typography, icon family, shell structure, and route concepts before adding new component families.
- Sidebar fade-out and canvas expansion must feel like one coherent shell transition rather than two unrelated layout changes.
- Maintain accessibility:
  - keyboard navigation for roll controls
  - focus-visible states
  - semantic links or buttons
  - reduced-motion handling
  - screen-reader access to the same ordered list
- During the design canvas state, the hidden sidebar must not remain pointer-active, keyboard-focusable, or screen-reader-prominent.
- Avoid visual overlap, clipped text, unstable card dimensions, or scroll traps.
- Keep motion subtle enough that the site still feels curated and scholarly, not arcade-like.
- Golden-ratio composition should improve hierarchy and movement rhythm, not become a decorative rule that harms readability or responsive containment.
- Reduced-motion handling should replace the sidebar fade with an immediate or near-immediate state change while preserving the same layout outcome.
- Preserve navigation continuity. Entering and leaving the design surface should not confuse the current route, hover/focus-only topbar menu behavior, or archive shell state.
- Any new design-data contract must clearly define required and optional fields before implementation starts.
- The first static 20-card specimen set must be treated as prototype interaction content, not as the final content contract.
- If a child feature changes durable design rules, update `docs/policies/design/design-constitution.md` and related design docs in the same execution track.

## Acceptance Envelope

- The approved product boundary describes a `Design` surface that enriches the site without weakening the existing note archive.
- The selected interaction direction makes cards feel rollable and visually playful while still behaving like an ordered, understandable list.
- The card listing layout uses golden-ratio-inspired hierarchy so the focused card clearly dominates while surrounding cards preserve browse context.
- Card motion feels smooth, directional, and deliberate, with no bounce, spin, or uncontrolled momentum that would weaken the editorial tone.
- Clicking `Design` in the topbar moves the site into the design surface and smoothly fades the left sidebar out of view.
- After the sidebar handoff, the design surface uses the reclaimed area as part of its visual canvas instead of leaving an empty sidebar gutter.
- The sidebar is not interactive or announced as active navigation while the design canvas owns the screen.
- Returning to note archive surfaces restores the sidebar intentionally without visual flash or stale design-canvas state.
- The focused card, adjacent cards, metadata, and navigation controls remain readable and contained across supported desktop and mobile widths.
- The design surface provides at least one non-pointer navigation path, such as keyboard arrow controls or accessible next/previous buttons.
- Reduced-motion users receive a stable non-rolling or minimally animated browsing experience without losing functionality.
- The design tab no longer reads as a dead placeholder once implemented through later approved feature work.
- The implementation can be built with static HTML/CSS/JavaScript and repo-local assets or data.
- The first implemented version can demonstrate the interaction with 20 static specimen cards derived from `tmp/design_card.html`, with no dynamic data injection required.
- Static specimen cards are easy to replace later and do not create a hidden dependency on final design content storage.
- The final experience remains aligned with the current dark editorial design system, not a generic carousel, dashboard widget, or literal copy of the sample page.
- Notes archive browsing, search, and note-detail flows continue to work independently after any future design-tab implementation.

## Candidate Features

- [feat-0028-design-surface-route-and-content-contract.md](../feature/feat-0028-design-surface-route-and-content-contract.md): define the design surface route, source data shape, required card fields, optional visual assets, and relationship to the existing archive-kind route model.
- [feat-0029-rollable-design-card-browse.md](../feature/feat-0029-rollable-design-card-browse.md): design and implement the selected golden-ratio-informed rollable card browsing interaction for desktop and mobile using 20 static specimen cards from the sample card structure, including keyboard, pointer, swipe, and reduced-motion behavior.
- [feat-0031-design-tab-canvas-shell-handoff.md](../feature/feat-0031-design-tab-canvas-shell-handoff.md): connect the topbar `Design` entry to the new surface, fade the note sidebar away, reclaim the full canvas area, and keep active navigation, route entry, refresh, and return behavior coherent.

## Continuity Notes

- `2026-05-02`: initial draft created from the request to enrich the site, especially the `Design` tab, using `tmp/design_card.html` as a rollable-card interaction reference.
- `2026-05-02`: added the design canvas shell handoff requirement: clicking topbar `Design` should smoothly fade away the left sidebar and let the design surface use the full available canvas.
- `2026-05-02`: added golden-ratio card listing and motion recommendations, with `golden focus reel` as the preferred baseline candidate for child design planning.
- `2026-05-02`: added the first-pass implementation boundary: ignore dynamic data injection initially and use 20 static specimen cards based on the centered card in `tmp/design_card.html`.
- `2026-05-02`: approved by the human owner for downstream feature planning and linked draft child features `feat-0028` through `feat-0031`.
- `2026-05-02`: narrowed the approved PRD boundary to list handling only; card detail, quick-peek, expansion, and external-link handoff behavior are out of scope for this PRD.
- `2026-05-03`: passed after active child features `feat-0028`, `feat-0029`, and `feat-0031` passed; `feat-0030` remains superseded because card detail and quick-peek behavior are out of scope.
