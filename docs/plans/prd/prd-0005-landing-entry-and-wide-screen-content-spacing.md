# PRD-0005: Landing Entry And Wide-Screen Content Spacing

## Metadata

- ID: `prd-0005`
- Status: `passed`
- Owner role: `human`
- Created: `2026-04-18`
- Updated: `2026-04-19`

## Request Summary

- Introduce a landing-first shell state before the archive list opens so the product does not drop users directly into browse mode.
- Increase the horizontal distance between the fixed left sidebar and the archive list or note-detail area on very large monitors so the content canvas feels less left-weighted.

## Source Set

- Human request:
  - "I want to make a landing page, before the list view open."
  - "Second one is, margin controlling, between left side bar and contents area, archive-detail-view or archive-list-view."
  - "When I see contents from huge monitor, it seems more lefted, so I think the distance from sidebar to list area or detail area can be father from current margin."
  - The preferred visual direction is closest to the `Quiet Archive` comparison, especially for the area above the recent-curations preview.
  - Visiting `chochita0311.github.io/` should show the landing-first shell state instead of the current list immediately.
  - `Video_Generation_With_Specific_Effects.mp4` is the preferred reference for a slowly played, scroll-driven landing motion treatment.
  - As the user scrolls down through the landing state, the motion treatment should progress slowly, and once the landing section is fully traversed the current archive list view should be shown.
  - Clicking the top-left brand title `조치타의 잡동사니` must bypass the landing state and take the user directly to the current archive list view rather than replaying the landing entry.
  - Only the structural pattern of `tmp/sample.html`'s `section.relative.min-h-[870px].flex.items-center.px-8.md:px-16.overflow-hidden` should be reused as a reference for the landing hero area.
  - The sample section currently overlaps the top bar, but the repository implementation must not overlap the existing top bar.
  - The landing hero should align with the current site's design tone and colors rather than copying the sample page styling literally.
  - The landing motion should use video as a half-transparent background layer.
  - As the user scrolls down, the background motion should advance through frames from the current MP4 reference.
- Golden sources:
  - [Website_Visuals_and_Video_Generation.mp4](/Users/jungsoo/Projects/chochita0311.github.io/tmp/Website_Visuals_and_Video_Generation.mp4)
  - [Video_Generation_With_Specific_Effects.mp4](/Users/jungsoo/Projects/chochita0311.github.io/tmp/Video_Generation_With_Specific_Effects.mp4)
- Supporting docs:
  - [roadmap.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/plans/project/roadmap.md)
  - [architecture.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/project/architecture.md)
  - [design-constitution.md](/Users/jungsoo/Projects/chochita0311.github.io/docs/policies/design/design-constitution.md)
- Current implementation references:
  - [index.html](/Users/jungsoo/Projects/chochita0311.github.io/index.html)
  - [layouts.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/layouts.css)
  - [note-detail.css](/Users/jungsoo/Projects/chochita0311.github.io/assets/css/note-detail.css)
  - [archive-content.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/archive-content.js)
  - [index-note-detail.js](/Users/jungsoo/Projects/chochita0311.github.io/assets/js/index-note-detail.js)
  - [sample.html](/Users/jungsoo/Projects/chochita0311.github.io/tmp/sample.html)

## Product Intent

- Give the site a deliberate front door inside the existing shell before archive browsing begins, then make the post-entry reading and browsing canvas feel better balanced on large displays without harming the current static, notes-first interaction model.

## Confirmed Scope

- Define a landing experience that appears before the current archive list view is shown.
- Treat the landing experience as the new default first impression for the root experience rather than a secondary marketing page hidden elsewhere.
- Keep the existing topbar and fixed left sidebar visible while the landing experience is shown.
- Keep the landing experience constrained to the current main content canvas area rather than expanding into a full-bleed full-website takeover.
- Use the quieter `Quiet Archive` direction as the preferred tonal baseline for the landing canvas, especially in the hero area above the archive-preview section.
- Use only the structural layout idea of `tmp/sample.html`'s hero section as a reference, specifically the centered, overflow-hidden, large-min-height landing section pattern.
- Keep that borrowed section pattern below the fixed top bar and within the current shell so it does not overlap the top bar.
- Align the landing palette, typography tone, and component feel with the repository's current dark archive shell rather than with the sample page's standalone styling.
- Preserve the archive list and note detail as reachable downstream states after the landing experience.
- Define the root URL `chochita0311.github.io/` as the entry route that presents the landing-first shell state.
- Keep the topbar brand-title action as a direct archive reset path that opens the current list view instead of replaying the landing entry.
- Use `Video_Generation_With_Specific_Effects.mp4` as the preferred motion reference for the landing section, with a slow scroll-driven progression.
- Allow the landing motion treatment to be implemented as a repository-fit adaptation of the reference rather than a literal embedded playback of the source artifact.
- Render the preferred video treatment as a semi-transparent background layer behind the landing hero content.
- Drive the background motion forward through the MP4 reference as the landing section scroll progresses.
- Define the landing-to-archive transition as a scroll-driven handoff: after the landing section is fully traversed, the current archive list view becomes the visible downstream state.
- Revisit the horizontal layout relationship between the fixed left sidebar and the main content canvas on large monitors.
- Adjust spacing for both `#archive-list-view` and `#archive-detail-view` so the list and detail experiences do not feel pinned too close to the sidebar on wide screens.
- On large-monitor layouts, target an initial spacing change where the left gap from the sidebar's right edge to the content canvas left edge is approximately doubled relative to the current desktop spacing.
- Keep responsive behavior in scope so any new spacing rule still works cleanly on laptop and smaller breakpoints.

## Excluded Scope

- Replacing the archive list or note-detail interaction model beyond what is required to enter them from the landing experience
- Large-scale information architecture changes for topbar placeholder sections such as `Projects`, `Design`, `Game`, or `About`
- Redesigning sidebar taxonomy behavior, search behavior, or note rendering behavior unrelated to entry flow or wide-screen spacing
- Broad typography, color, or branding overhaul unless child design work proves a small landing-specific adjustment is required
- Creating a multi-page marketing site, CMS workflow, or heavy framework-based landing stack
- Changing the brand-title interaction so it behaves like a marketing-home restart instead of an archive reset entry point
- Copying the sample page as a whole instead of borrowing only the targeted landing section pattern

## Uncertainty

- The exact landing copy is not yet defined. Child design and spec work must decide the final hero message, supporting sentence, and any secondary CTA while preserving the quiet-archive tone.
- The exact wide-screen breakpoint is not fixed in this PRD. Child design work must choose where the doubled spacing behavior begins without creating an awkward gap on standard desktop widths.
- The exact implementation method for the scroll-driven motion treatment is intentionally open. Child work may use scrubbed video, frame-sequence treatment, layered visuals, or another static-site-safe pattern if it achieves the same slow-progress effect.
- The exact threshold that counts as the landing section being "fully traversed" is intentionally open. Child spec work must choose a concrete handoff point that feels deliberate and not abrupt.
- The exact video opacity, blend treatment, and foreground contrast balance are intentionally open. Child design and spec work must choose values that preserve readability over motion.

## Constraints

- Keep the site compatible with the current static GitHub Pages runtime.
- Preserve the lightweight static-first architecture and avoid introducing server-side dependencies.
- Keep the product notes-first; the landing experience should introduce the archive, not distract from it.
- Reuse existing shell, layout, and archive patterns where possible instead of building a parallel application structure.
- Keep the landing experience inside the existing shell frame, with topbar and left sidebar remaining visible.
- Keep the landing experience sized to the current content area footprint instead of taking over the full page width.
- Keep the landing hero positioned below the fixed top bar instead of allowing the reused section pattern to slide underneath it.
- Keep the root entry behavior and the brand-title reset behavior intentionally different:
  - root URL enters through landing
  - brand-title click goes directly to the current archive list
- Keep the landing motion slow and atmospheric rather than cinematic or attention-seeking.
- Keep the video background visually subordinate to the content by using partial transparency and adequate foreground contrast.
- Preserve the current archive list as the post-landing destination rather than replacing it with a new summary page.
- Maintain accessible keyboard and screen-reader transitions between landing, archive list, and note detail states.
- Keep the large-screen spacing fix compatible with the fixed sidebar pattern already used in the shell.
- Avoid breaking current mobile and tablet layouts while improving the desktop and huge-monitor experience.
- Update related documentation if entry flow, layout ownership, or design guidance becomes materially different after child implementation.

## Acceptance Envelope

- Visiting `chochita0311.github.io/` no longer drops the user directly into the archive list as the first visible product state.
- The product presents a landing-first shell experience inside the current content canvas with a clear path into the note archive.
- The topbar and left sidebar remain visible while the landing experience is shown.
- The landing experience does not expand into a full-bleed page outside the current shell layout.
- The landing hero direction feels closer to the quieter `Quiet Archive` concept than to the more luminous comparison directions.
- The implemented landing hero borrows only the targeted structural pattern from `tmp/sample.html` and does not copy the sample page as a whole.
- The landing hero sits below the fixed top bar and does not visually overlap it.
- The landing colors and tone remain aligned with the repository's current archive shell rather than the sample page's standalone treatment.
- The landing section uses a slow scroll-driven motion treatment derived from `Video_Generation_With_Specific_Effects.mp4` rather than a loud autoplay splash behavior.
- The landing motion is rendered as a semi-transparent background treatment behind the hero content.
- As the user scrolls through the landing section, the background motion advances through the MP4 reference frames in sync with scroll progress.
- As the user scrolls through the landing section, the motion treatment progresses gradually and hands off into the current archive list view once the landing section is fully traversed.
- A user can move from the landing experience into archive browsing without confusion or unnecessary extra steps.
- Clicking the top-left brand title `조치타의 잡동사니` on the root archive shell takes the user directly to the current archive list view and does not replay the landing-first state.
- After entering the archive, both list and detail views continue to function within the existing static app model.
- The supplied video references are used directionally, and the implemented landing motion is a repository-fit new version rather than a direct copy of a reference artifact.
- On large monitors, the horizontal separation between the fixed left sidebar and the main content area is visibly greater than it is today.
- The wide-screen target direction is achieved such that the content canvas left gap reads roughly doubled relative to the current sidebar-to-content spacing.
- The spacing adjustment improves balance for both the archive list and inline note-detail view rather than solving only one of them.
- The revised spacing does not regress smaller breakpoints into unusable whitespace or cramped content widths.
- The product still feels like one coherent notes application rather than a landing page bolted onto an unrelated archive shell.

## Candidate Features

- `feat-0010-landing-page-entry-flow`: define and implement the landing-first experience, entry CTA, and transition into archive browsing
- `feat-0011-wide-screen-sidebar-content-spacing`: rebalance the sidebar-to-content gap for archive list and note-detail views on large displays

## Continuity Notes

- `2026-04-18`: initial draft created from the human request covering a landing-first root experience and wider desktop spacing between the fixed sidebar and archive content areas
- `2026-04-18`: revised after human clarification that the landing experience should be a shell-state entry within the current content area, with the topbar and sidebar still visible, and that wide-screen spacing should target roughly double the current sidebar-to-content gap
- `2026-04-18`: revised after human clarification that the preferred landing direction is the quieter concept, that root entry should show a scroll-driven landing motion before the archive list, and that the top-left brand title should bypass landing and open the current list view directly
- `2026-04-18`: revised after human clarification that only the targeted hero section pattern from `tmp/sample.html` should be reused, that it must sit below the fixed top bar, and that the landing motion should appear as a half-transparent scroll-driven video background using frames from the current MP4 reference
- `2026-04-19`: closed as passed after feat-0010 and feat-0011 both passed implementation and evaluation, including landing interaction isolation and large-screen list/detail alignment verification
