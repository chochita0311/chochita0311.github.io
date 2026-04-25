# PRD-0009: Public Surface Typography And Navigation Polish

## Metadata

- ID: `prd-0009`
- Status: `passed`
- Owner role: `human`
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Request Summary

- Polish the public archive and note-detail surfaces through a coherent typography, sidebar navigation, note reference, and small-label alignment pass.
- Adopt the recommended balanced font set for the GitHub Pages notes site: `Inter` and `Noto Sans KR` for UI/body text, with `Satoshi` for title and emotional display roles, while also correcting the observed navigation-orientation and detail-view polish issues recorded in this PRD.
- Treat the typography change as a design-system update, not as an isolated CSS swap, because the current design constitution still locks `Manrope` as the core typeface.

## Source Set

- Human request:
  - Use recommendation set 1: `Inter` for UI/body, `Noto Sans KR` for Korean stability, and `Satoshi` for title/emotional display typography.
  - Use `Satoshi` through downloaded/self-hosted webfont files rather than a Google Fonts-style CDN link.
  - Consider the repository's existing design-rule documents while creating the PRD.
  - Add the observed archive interaction issue where changing from one sidebar collection such as `Technology > Java` to another such as `Technology > Spring` after scrolling down keeps the list positioned near the bottom instead of showing the new list from the top.
  - Add the observed note-detail issue where references are broken on `/archive/note?id=51`.
  - Add the observed sidebar active-state issue where `/archive/note?category=Technology&collection=JAVA` opens the sidebar dropdown and highlights only `Technology`, but the active `JAVA` collection should also receive the active or hovered color treatment.
  - Add the observed direct note-entry issue where opening a note directly such as `/archive/note?id=37` does not expand the left sidebar, even though note-detail pages should open the sidebar to the note's category and collection as if the user entered from the archive list.
  - Add the observed topbar alignment issue where `body > nav > div.topbar__start > div` does not appear vertically centered.
  - Add a 12 px typography adjustment request for topbar navigation, note-detail facts labels `PUBLISHED`, `TAGS`, `REFERENCES`, `#note-detail-nav > a > span.note-detail__nav-label`, `#archive-detail-view > header > nav`, `body > aside > div.sidebar__profile > div > div:nth-child(2) > p`, `body > aside > div.sidebar__section > p`, and `body > main > footer > p`.
- Golden sources:
  - none yet
- Supporting docs:
  - [DESIGN.md](../../../DESIGN.md)
  - [design-constitution.md](../../policies/design/design-constitution.md)
  - [design-evaluation.md](../../policies/design/design-evaluation.md)
  - [interaction-evaluation.md](../../policies/experience/interaction-evaluation.md)
  - [prd-feature-management.md](../../policies/harness/prd-feature-management.md)
- Current implementation references:
  - [index.html](../../../index.html)
  - [archive/index.html](../../../archive/index.html)
  - [archive/note/index.html](../../../archive/note/index.html)
  - [tokens.css](../../../assets/css/tokens.css)
  - [base.css](../../../assets/css/base.css)
  - [layouts.css](../../../assets/css/layouts.css)
  - [components.css](../../../assets/css/components.css)
  - [note-detail.css](../../../assets/css/note-detail.css)

## Product Intent

- Make the archive and note-detail experience feel cleaner, more balanced, and more polished while preserving the current dark scholarly editorial character.
- Improve Korean and English readability across browsing, searching, and reading surfaces without drifting into a generic startup UI or a decorative space/SF theme.
- Preserve practical browse orientation when archive scope changes so the user sees the beginning of the newly selected list rather than inheriting the prior collection's scroll depth.
- Preserve note-detail reading trust by ensuring reference links or reference entries render and navigate correctly in affected notes.
- Preserve sidebar orientation by keeping category and collection active states visible and synchronized across list routes and direct note-detail routes.
- Tighten small navigation, metadata, sidebar, and footer text so secondary UI reads consistently without competing with note content.

## Confirmed Scope

- Define `Inter` as the primary Latin UI/body face.
- Define `Noto Sans KR` as the Korean UI/body fallback and Korean text stabilizer.
- Define `Satoshi` as the title, display, and emotional headline face where it improves hierarchy without harming readability.
- Replace the durable `Manrope` typography rule in the design constitution only after this PRD boundary is accepted.
- Keep the existing dark editorial shell, tonal layering, restrained accent system, card containment rules, and archive-first product scope.
- Cover the primary public surfaces:
  - landing and archive entry
  - archive browse and filtered results
  - note detail reading surface
  - topbar, sidebar, cards, controls, metadata, pagination, and empty/loading/error text
- Treat font loading, fallback behavior, and self-hosted `Satoshi` assets as part of the product quality envelope because the site runs on GitHub Pages.
- Include archive scope-change scroll positioning as a companion interaction polish item: when sidebar navigation changes the active category or collection, the resulting list should enter from the top of the new result set.
- Include note-detail reference integrity as a companion reading-surface polish item, starting from the observed broken references on `/archive/note?id=51`.
- Include sidebar active-state consistency for category and collection routes, including `/archive/note?category=Technology&collection=JAVA`.
- Include direct note-entry sidebar expansion so note-detail routes such as `/archive/note?id=37` open the sidebar to the note's resolved category and collection.
- Include topbar start vertical alignment correction for `body > nav > div.topbar__start > div`.
- Include 12 px font-size normalization for the requested small-label and navigation surfaces:
  - topbar navigation
  - note-detail facts labels `PUBLISHED`, `TAGS`, `REFERENCES`
  - `#note-detail-nav > a > span.note-detail__nav-label`
  - `#archive-detail-view > header > nav`
  - `body > aside > div.sidebar__profile > div > div:nth-child(2) > p`
  - `body > aside > div.sidebar__section > p`
  - `body > main > footer > p`
- Keep the implementation lightweight and static-first.

## Excluded Scope

- Adopting recommendation set 2 or 3.
- Adding `Space Grotesk`, `Orbitron`, `General Sans`, or `Clash Display`.
- Broad color, layout, animation, icon, card, route, search, or archive-data redesign beyond the scoped sidebar collection scroll-position fix, sidebar active-state repair, direct note-entry sidebar expansion, note-detail reference repair, topbar alignment correction, and small-text size normalization.
- Changing the note content model or generated archive index.
- Rewriting note content broadly unless a broken reference is caused by one clearly incorrect source link or metadata value.
- Adding a heavy build pipeline only for font processing.
- Applying a decorative space/SF typography style that overpowers the current scholarly archive tone.
- Using `Satoshi` for dense body copy, long Korean text, code blocks, or metadata-heavy control surfaces where readability would suffer.
- Committing any font file whose source, license, or allowed web use has not been verified for public GitHub Pages hosting.

## Resolved Decisions

- `Satoshi-Regular.woff2` and `Satoshi-Bold.woff2` are the included self-hosted Fontshare weights.
- The extracted Fontshare `FFL.txt` license/source record is kept under `assets/fonts/`.
- `Satoshi` is applied only to approved display/title roles, including major titles, archive hero titles, note titles, and note card titles.
- `Inter` and `Noto Sans KR` load through Google Fonts; `Satoshi` loads through local `@font-face` rules with `font-display: swap`.
- The design constitution and `DESIGN.md` now name the `Inter` / `Noto Sans KR` / `Satoshi` hierarchy instead of `Manrope`.
- The `/archive/note?id=51` reference failure was a Markdown inline-link rendering issue caused by raw URL auto-linking inside already-linked content.
- Sidebar category, collection, and direct note-detail context are synchronized through route parameters and note metadata.
- The requested 12 px surfaces are mapped to durable component classes rather than one-off selector overrides.

## Constraints

- Preserve GitHub Pages compatibility and static hosting.
- Preserve the current product scope: note browsing, note search, note reading, and long-term archive maintenance.
- Keep the app lightweight; do not add framework or build-tool dependencies only to support fonts.
- Use only necessary font weights to avoid slowing the first page load.
- Prefer `woff2` for self-hosted `Satoshi` assets if approved and available.
- Use `font-display: swap` or an equivalent no-blocking loading approach for web fonts.
- Keep fallback stacks strong enough that content remains legible if web fonts fail.
- Maintain card containment, title truncation, metadata row alignment, and responsive breakpoint containment from [design-evaluation.md](../../policies/design/design-evaluation.md).
- Preserve interaction stability and avoid route or state flashes caused by late font loading, layout shifts, or re-rendered typography surfaces, per [interaction-evaluation.md](../../policies/experience/interaction-evaluation.md).
- Apply the interaction-evaluation navigation continuity and scope-transition reset rules to sidebar collection changes so a newly selected list does not inherit the previous collection's scroll position.
- Note-detail reference fixes must preserve GitHub Pages-safe links and should not introduce a second route contract that conflicts with the archive or note-detail route model.
- Sidebar active and expanded states must preserve navigation continuity: the visible sidebar state should match the active archive scope or active note metadata after direct URL entry, refresh, and in-app navigation.
- Topbar alignment and 12 px text normalization must preserve readable contrast, touch/click targets, card containment, and existing topbar/sidebar interaction behavior.
- Keep code blocks and monospace note content on the existing monospace stack unless a separate approved typography decision changes it.

## Acceptance Envelope

- The approved typography system clearly defines which roles use `Inter`, `Noto Sans KR`, and `Satoshi`.
- The design constitution and any adjacent design source docs no longer conflict with the chosen typography system.
- English, Korean, and mixed English/Korean content remain readable in archive cards, navigation, search controls, and note detail pages.
- Major titles gain a more distinctive tone through `Satoshi` without reducing scan clarity or overpowering the archive shell.
- Font loading does not introduce visible layout shift, broken fallbacks, unreadable flash states, or route-entry instability.
- Repeated cards preserve title containment, metadata alignment, and footer structure after typography changes.
- Topbar, sidebar, controls, filters, pagination, and note-detail utility rows preserve existing interaction affordances and spacing relationships.
- After scrolling down in one collection and selecting a different sidebar collection, the archive list shows the top of the newly selected result set rather than remaining near the bottom of the previous scroll position.
- Sidebar-driven category or collection changes preserve orientation without causing route flash, list flicker, or misleading intermediate empty/default states.
- Opening `/archive/note?id=51` renders its references in a usable state with no broken reference links, missing reference targets, or visibly malformed reference entries.
- The note-detail reference fix works without weakening normal note-detail navigation, breadcrumbs, section rail behavior, or Markdown rendering for other notes.
- Opening `/archive/note?category=Technology&collection=JAVA` shows both the active `Technology` category and the active `JAVA` collection with the correct active or hovered color treatment.
- Opening a note directly, such as `/archive/note?id=37`, expands the left sidebar to the note's resolved category and collection so the sidebar matches the context that would appear when entering the note from the archive list.
- Sidebar expansion and active-state repair works on direct entry, refresh, and in-app navigation without leaving stale category or collection highlighting.
- `body > nav > div.topbar__start > div` appears vertically centered within the topbar.
- Topbar navigation uses 12 px text without weakening readability or click affordance.
- Note-detail facts labels `PUBLISHED`, `TAGS`, and `REFERENCES` use 12 px text and remain visually aligned with their values.
- `#note-detail-nav > a > span.note-detail__nav-label`, `#archive-detail-view > header > nav`, `body > aside > div.sidebar__profile > div > div:nth-child(2) > p`, `body > aside > div.sidebar__section > p`, and `body > main > footer > p` use 12 px text without overlap, clipping, or unintended layout shift.
- The final experience still reads as a premium dark scholarly archive, not as a generic startup site, SF interface, dashboard, or portfolio showcase.

## Candidate Features

- [feat-0020-typography-token-and-policy-alignment.md](../feature/feat-0020-typography-token-and-policy-alignment.md): update the design constitution and typography tokens so `Inter`, `Noto Sans KR`, and `Satoshi` have clear role ownership.
- [feat-0021-font-source-and-loading-contract.md](../feature/feat-0021-font-source-and-loading-contract.md): define the approved font sources, self-hosted `Satoshi` asset requirements, fallback stacks, and loading behavior for GitHub Pages.
- [feat-0022-public-surface-typography-application.md](../feature/feat-0022-public-surface-typography-application.md): apply the approved typography roles across landing, archive, and note-detail surfaces while preserving layout containment and interaction stability.
- [feat-0023-sidebar-scope-scroll-reset.md](../feature/feat-0023-sidebar-scope-scroll-reset.md): reset or normalize archive list scroll position when sidebar category or collection navigation changes the active result scope.
- [feat-0024-note-detail-reference-integrity.md](../feature/feat-0024-note-detail-reference-integrity.md): repair broken note-detail references, starting with `/archive/note?id=51`, and verify the fix against adjacent note-detail navigation and Markdown rendering behavior.
- [feat-0025-sidebar-active-state-consistency.md](../feature/feat-0025-sidebar-active-state-consistency.md): ensure active category and collection state styling is visible for scoped archive routes such as `/archive/note?category=Technology&collection=JAVA`.
- [feat-0026-direct-note-sidebar-context.md](../feature/feat-0026-direct-note-sidebar-context.md): expand and highlight the left sidebar from note metadata when opening note-detail routes directly, starting with `/archive/note?id=37`.
- [feat-0027-small-text-and-topbar-alignment.md](../feature/feat-0027-small-text-and-topbar-alignment.md): center the topbar start content vertically and normalize the requested small navigation, fact-label, sidebar, and footer text surfaces to 12 px.

## Continuity Notes

- `2026-04-25`: initial draft created from the user's request to use recommendation set 1 and to account for this repo's design and interaction policy documents.
- `2026-04-25`: added the observed sidebar collection-switch scroll-position issue as a scoped interaction companion item for the same polish track.
- `2026-04-25`: added the observed broken references on `/archive/note?id=51` as a scoped note-detail reading-surface companion item.
- `2026-04-25`: added the observed sidebar active-state issue for `/archive/note?category=Technology&collection=JAVA` and direct note-entry sidebar expansion issue for `/archive/note?id=37`.
- `2026-04-25`: added the observed topbar start vertical-centering issue and requested 12 px normalization for small navigation, fact-label, sidebar, and footer text surfaces.
- `2026-04-25`: renamed and reframed from `Balanced Typography System` to `Public Surface Typography And Navigation Polish` so the PRD boundary matches the combined typography, sidebar, note-detail, and alignment scope.
- `2026-04-25`: approved by the human owner for downstream feature planning.
- `2026-04-25`: created draft child feature documents `feat-0020` through `feat-0027` and linked them from the candidate feature list.
- `2026-04-25`: passed after all approved child features `feat-0020` through `feat-0027` were implemented and verified.
- `2026-04-25`: added the official Fontshare Satoshi webfont files and license record to `assets/fonts/`.
