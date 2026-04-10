# Design Plan

## 1. Summary
- Project: `chochita0311.github.io`
- Current stage: Stabilizing the first visible archive shell into a reusable design system.
- Starting artifact: [index.html](../../../index.html) plus product and technical context from [DESIGN.md](../../../DESIGN.md), [README.md](../../../README.md), and the verified archive structure under `CATEGORIES/`.
- Main design challenge: Keep the strong editorial shell while grounding navigation and list behavior in the actual category structure that already exists.
- Recommended immediate direction: Treat the current shell as the stable browse baseline, and only expand into behaviors that `CATEGORIES/` already supports.

## 2. Constitution Status
- Constitution exists: Yes. See [design-constitution.md](../../policies/design/design-constitution.md).
- Locked decisions already captured there:
  - Editorial dark-shell direction.
  - Tonal layering over border-led structure.
  - Manrope-led hierarchy and asymmetrical layout rules.
  - Durable screen families for browse, search, and reading.
- Sections that still need to be written or revised: Future revisions should only happen if the app shell, token families, or major screen families change.

## 3. Starting Artifact
- Classification: screen-plus-context.
- Why this classification applies: The repo includes a fully visible first page artifact plus explicit design intent in `DESIGN.md`, project/runtime constraints, and a concrete category tree in `CATEGORIES/`.
- Main benefit of this starting point: The artifact already exposes typography, navigation hierarchy, spacing rhythm, and mood strongly enough to extract durable rules.
- Main risk of this starting point: Placeholder note copy can still imply more finished archive behavior than the content model actually guarantees.

## 4. Current Deltas
- Product maturity: MVP.
- Context or constraint changes not yet reflected in the constitution:
  - The current shell is now close to the intended archive baseline and should be treated as a reusable starting layout.
  - The current browse screen has now been delegated into `assets/` as token, base, semantic, layout, and component layers instead of runtime Tailwind utilities.
- Backend and frontend alignment risks needing active follow-up:
  - The UI still needs to be reconnected to real note/archive data rather than placeholder article entries.
  - Category rendering should stay aligned to the verified `CATEGORIES/<category>/<collection>/<note>.md` shape.

## 5. Initial Artifact Extraction
- Typography hierarchy:
  - Strong oversized page heading and large note titles align well with the editorial goal.
  - Metadata labels already use small uppercase tracked styling that fits the constitution.
- Surface hierarchy:
  - The revised artifact now holds one dark atmospheric field with tonal layering that matches `DESIGN.md`.
- Spacing rhythm:
  - Large vertical gaps in the note list are appropriate and should be retained.
  - Rail and hero spacing are stable enough to treat as baseline layout rules.
- Accent behavior:
  - Electric blue is used correctly as a high-contrast accent, but some current fills and hovers need semantic cleanup.
- Shell assumption:
  - Desktop persistent navigation plus a wide archive canvas is the right family.
  - Rail-led navigation with a secondary top mode bar is workable now.
- Reusable component hints:
  - Search field, category rows, metadata chips, note list entries, and pagination controls are reusable.
- Validation against product and system constraints:
  - Entity families map to notes, top-level categories, nested collections, tags, and archive results.
  - Public read-only behavior means the shell should avoid action-heavy UI.
  - The content tree currently verifies two top-level categories, `English` and `Technology`, with one nested collection level each in the observed sample.
  - Required states such as empty archive, search miss, and loading are still absent from the artifact and should remain unchanged until implemented.

## 6. What Is Stable Already
- Locked decisions:
  - The product should feel like a premium scholarly archive, not a generic notes blog.
  - Dark tonal depth and no-line separation are durable.
  - Desktop-first archive navigation remains the base shell.
  - A rail-led browse layout is workable against the current category tree.
- Reusable patterns already visible:
  - Large editorial note list entries.
  - Small metadata labels and tags.
  - Tonal search field treatment.
  - Reusable rail section, hero panel, note row, and pagination modules.
- Constraints already clear:
  - Static-first runtime.
  - GitHub Pages compatibility.
  - Notes remain the durable content source.
  - Current category depth should be treated as the baseline IA.

## 7. What Is Not Stable Yet
- Missing token decisions: None at the constitution level; implementation now has a stable asset-owned baseline, but future screens still need to reuse it consistently.
- Missing semantic decisions:
  - Reading-width semantics still need implementation for note detail views.
- Missing component boundaries:
  - Search, category navigation, note preview row, and empty-state components need explicit implementation boundaries.
- Missing compatibility decisions:
  - How mobile navigation exposes the current category and collection structure without overbuilding.
- Drift risks:
  - Placeholder article copy can still drift away from real note metadata.
  - Reintroducing light panels or border-led card stacks will violate the constitution quickly.

## 8. Active Screen Scope
- Current priority families:
  - Archive browse and category listing.
  - Search and filtered results.
  - Note reading detail.
- Why these families come first: They cover the repo’s in-scope jobs directly and define the minimum durable archive experience.
- What can be deferred:
  - Any maintenance-oriented authoring surface.
  - Extra editorial flourishes that do not improve browse, search, or reading.
  - Any taxonomy depth beyond the category and collection levels that exist now.

## 9. Current Build Sequence
- `1.` Keep the current `index.html` shell as the browse baseline and replace placeholder category and note data with content derived from `CATEGORIES/`.
- `2.` Bind search, category listing, and collection listing to the verified archive shape, including robust empty, loading, and no-result states when they are implemented.
- `3.` Build or restore the note reading view using the same token and layout rules before expanding into secondary tooling screens.

## 10. Open Decisions
- Decisions needed before expansion:
  - How much tag filtering should be visible by default on desktop once real tag data is confirmed.
- Decisions that can wait:
  - Whether pagination remains explicit buttons or shifts to archive section jumps.
  - Whether pull-quote styling appears in note detail only or also in archive previews.
- Decisions blocked by missing product context:
  - Any information architecture beyond the currently verified category and collection shape.

## 11. Risks And Unknowns
- Design risks:
  - The current artifact can tempt one-off aesthetic decisions that do not map to real archive states.
  - Too much navigation ornament will make the archive feel theatrical rather than usable.
- Technical risks:
  - The runtime/documentation mismatch around missing CSS and JS layers may complicate implementation sequencing.
  - Placeholder content may hide real data edge cases until late.
- Product risks:
  - Archive organization may drift if the UI assumes deeper taxonomy than the content actually has.
  - Search could become visually secondary despite being a core job.
- Unknowns requiring clarification:
  - Whether a dedicated note detail screen already exists elsewhere in the unpublished worktree.
  - Whether tags are curated, derived from filenames, or absent from the durable content source.

## 12. Immediate Next Actions
- `1.` Keep the current shell and replace placeholder browse data with real category and note data from `CATEGORIES/`.
- `2.` Define how the verified category and collection structure maps into the rail and note-list modules.
- `3.` Keep `assets/` as the concrete token and component home, and extend the existing semantic/layout/component layers rather than reintroducing utility-owned screen styling.

## 13. Versioning Note
- Design system status: `v1 locked`.
- If this run changes the constitution:
  - Tightened the baseline around the current `index.html` shell and the verified `CATEGORIES/` structure.
  - Reduced speculative taxonomy assumptions and locked only the category depth that exists now.
  - Restored the layered CSS asset structure so tokens, semantics, layouts, and components now have a durable implementation home.
