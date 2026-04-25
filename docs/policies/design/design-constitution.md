# Design Constitution

## 1. Project Context

- Product type: Static personal notes archive for browsing, searching, and reading long-term study materials on GitHub Pages.
- Primary users: The site owner as curator and repeat reader, plus occasional visitors reading individual notes or browsing categories.
- Primary jobs to be done: Browse notes by category or archive structure, search for a note quickly, read long-form Markdown content without distraction.
- Device priority: Desktop-first reading and archive navigation, with mobile adaptation that preserves reading comfort and navigation clarity.
- Technical constraints: Static HTML/CSS/JavaScript runtime, GitHub Pages compatibility, note content remains durable under `NOTES/`, avoid heavy framework or build-tool dependence.
- Starting artifact type: screen-plus-context.

## 2. Compatibility Constraints

- Data model constraints: UI must tolerate note metadata such as title, path, category, tags, date, excerpt, and missing preview fields without collapsing the layout. The currently verified archive shape is `NOTES/<top-level-category>/<collection>/<note>.md`.
- Role and permission constraints: Public runtime is effectively single-role read access; authoring and archive maintenance happen outside the published UI.
- Status/state constraints: The system must support empty archive, no search results, loading, fetch failure, long titles, and missing tags. Deeper taxonomy states beyond the currently observed two-level category structure should not define the baseline yet.
- Form and validation constraints: Search and filter controls should remain lightweight, forgiving, and keyboard-usable; avoid dense form-heavy patterns.
- Mobile and responsive constraints: Large editorial hierarchy must compress without becoming a dashboard; navigation can simplify, but reading width and content order must remain legible.
- Future expansion constraints: Additional screen families may include note detail, archive search results, category drill-down, and lightweight maintenance views without adding a new visual language. If a structure does not exist in `NOTES/` yet, keep the current baseline behavior instead of creating speculative UI.

## 3. Design DNA

- Tone keywords: Editorial, scholarly, atmospheric, deliberate, quiet, archival, premium, restrained.
- Visual principles:
  - Use intentional asymmetry to create editorial rhythm without losing orientation.
  - Define hierarchy through typography, spacing, and tonal depth before adding chrome.
  - Treat the archive as a curated reading space, not a dashboard or SaaS shell.
  - Keep interfaces breathable; density belongs in content, not in surrounding controls.
  - Let navigation feel structural but visually secondary to reading and discovery.
- Anti-principles:
  - No template-heavy blog styling.
  - No bright white or pure black surfaces.
  - No visible 1px section dividers as default structure.
  - No card grids that overpower reading.
  - No decorative gradients except controlled action emphasis.
  - No “AI product” cues, assistant persona framing, or novelty ornament.
  - No visual drift toward admin dashboards, notification centers, or utility consoles.
- Source of truth: This constitution is the durable rule set. [DESIGN.md](../../DESIGN.md) provides the visual north star and material rules. [index.html](../../index.html) is a starting artifact, not a durable source by itself.
- Reference boundaries: If a future screen conflicts with this constitution and `DESIGN.md`, update the constitution first instead of improvising screen-local styling.

## 4. Primitive Tokens

- Colors:
  - Base foundation: `surface #111317`, `surface-container-lowest #0c0e12`, `surface-container #1e2024`, `surface-container-high #282a2e`, `surface-bright #37393d`.
  - Text and content: `on-surface #e2e2e7`, muted copy from slate-gray values already used in the artifact, `outline-variant #434653` only as a ghost-accessibility fallback.
  - Accent family: `primary #b6c4ff`, `primary-container #0044cf`, `primary-fixed #dce1ff`.
  - Neutral contrast should stay cool and slate-biased rather than warm beige or stark grayscale.
- Typography:
  - UI and body family: `Inter`, with `Noto Sans KR` as the Korean fallback and stabilizer.
  - Display and title family: `Satoshi`, used only for major page titles, note titles, archive hero titles, and selected display roles where it strengthens hierarchy without reducing readability.
  - Fallback rule: self-hosted `Satoshi` `.woff2` assets load with `font-display: swap`; if loading fails, display roles must fall back to `Inter`, `Noto Sans KR`, and system sans-serif.
  - Display: 3.5rem, 800 weight for primary page titles and major note headlines.
  - Headline large: 2rem, 800 weight.
  - Headline medium: 1.75rem, 700-800 weight.
  - Body large: 1rem, 400-500 weight, line-height around 1.6.
  - Metadata label: 0.75rem, 600 weight, uppercase, tracked.
- Spacing:
  - Base rhythm: 4, 8, 12, 16, 24, 32, 48, 64 px.
  - Editorial sections should prefer 24 px and above; 16 px is the minimum comfortable spacing for repeated metadata clusters.
  - If a composition feels tight, increase spacing before adding structural decoration.
- Radius:
  - Sharp micro radius: 2 px.
  - Standard surface radius: 8 px.
  - Large CTA or capsule radius: 12 px.
  - Full pill only for tags, pagination controls, and similar compact tokens.
- Shadows:
  - Default surfaces rely on tonal separation, not shadows.
  - Floating overlays only: `0 20px 40px rgba(0,0,0,0.4)` or softer equivalent.
- Motion:
  - Subtle color, opacity, and translation changes only.
  - Hover and focus transitions should stay within 120-180 ms and never feel elastic.
- Icons:
  - Approved UI icon family: Material Symbols Outlined.
  - Keep one icon family active in the published runtime; do not mix Rounded or Sharp variants casually.
  - Treat icons as supporting editorial navigation and actions, not as decorative illustration.
  - New UI icons should enter the shared registry before they are used in screen markup or JavaScript templates.
  - Use SVG only when the icon must be custom, multi-tone, or materially different from the Material Symbols family.
- States:
  - Hover uses brighter surface or accent text shift.
  - Focus uses clear primary emphasis with minimal glow.
  - Disabled lowers contrast and removes depth cues.
  - Error and empty states use typography and tonal grouping, not alarming panel chrome.

## 5. Semantic Tokens

- Page background: Default app background is `surface`; alternate structural areas may use a slightly lifted neutral plane, but the product should read as one dark editorial field.
- Surface hierarchy:
  - Canvas: `surface`.
  - Navigation rail: gradient between `surface-container` and `surface-container-lowest`.
  - Inset controls and search fields: `surface-container-lowest`.
  - Interactive rows and cards: `surface-container`.
  - Elevated hover or active surfaces: `surface-container-high`.
- Text hierarchy:
  - Display and major headlines: `on-surface` with strong weight.
  - Supporting summaries: muted slate text at high readability.
  - Metadata: uppercase tracked labels in lower-contrast neutrals.
  - Accent text: `primary` for focused navigation and interactive emphasis only.
- Action hierarchy:
  - Primary actions may use the blue gradient or solid `primary-container` fill with high contrast text.
  - Secondary actions use tonal fills with accent text.
  - Tertiary actions are ghost links with restrained hover surfaces.
- Feedback hierarchy:
  - Empty and loading states should feel archival and calm.
  - Error feedback uses the existing error family sparingly and should not dominate the page.
- Shell sizing:
  - Primary content shell should support a wide desktop browse layout with generous gutters.
  - Desktop rail width is locked around 280-320 px.
  - Reading columns should narrow relative to listing shells for sustained note reading.
- Reading mode: Long-form reading is the most important semantic mode; every token choice must preserve contrast, calm pacing, and annotation-friendly whitespace.

## 6. Layout Rules

- App shell:
  - Desktop uses a layered editorial shell: persistent structural navigation plus a main content canvas.
  - Shell pieces must feel integrated through tonal layering rather than boxed panels.
- Navigation model:
  - Primary navigation is archive/category oriented.
  - Search is always accessible and treated as a core archive control, not an accessory.
  - The current verified taxonomy supports top-level categories with one nested collection level; the baseline navigation should represent that shape directly.
  - Deep category trees should degrade into simpler disclosure patterns rather than multi-level hover mazes, but they are not part of the locked baseline until they exist in content.
- Breakpoints:
  - Desktop-first baseline above 1200 px.
  - Large tablet compaction around 900-1199 px.
  - Mobile simplification below 900 px.
- Density rules:
  - Keep note lists open and vertically paced.
  - Avoid compressing metadata into dense utility bars.
  - One clear primary action per region.
- Content widths:
  - Browse/list canvases can expand to wide editorial widths.
  - Reading content should cap around a comfortable long-form measure.
  - Side rails must never reduce the reading column to a cramped blog strip.
  - Hero regions can split into a large left reading headline and a smaller right status panel when supporting content exists.

## 7. Core Components

- Buttons:
  - Primary: Gradient or `primary-container` fill, 12 px radius, no stroke.
  - Secondary: Tonal fill with accent text.
  - Tertiary: Ghost link/button with subtle hover surface.
- Inputs:
  - Inset surface treatment using `surface-container-lowest`.
  - Focus is expressed by a precise primary underline or equivalent restrained accent emphasis.
- Cards:
  - Cards are optional framing devices, not the default structure for every note.
  - Rounded 8 px surfaces with tonal hover shift and no strong border.
- Lists:
  - Note lists are separated by spacing and typography, not divider rules.
  - Rows can gain a tonal hover field but should remain mostly open.
  - The baseline note row supports category label, date, title, excerpt, lightweight tags, and compact secondary metadata in a right gutter.
- Tables:
  - Avoid tables for the primary note-browsing experience.
  - If used for archive maintenance or dense metadata views, they inherit the no-hard-divider rule as much as accessibility allows.
- Tabs or chips:
  - Use chips for filters, tags, and archive pivots.
  - They should read as small editorial index markers, not pill-heavy app controls.
- Dialogs or drawers:
  - Reserved for mobile navigation, search overlays, or archive actions that truly need isolation.
  - Floating layers use blur and ambient shadow, never stark modal cards.
- Empty, loading, and error states:
  - Each state should preserve the calm editorial tone.
  - Use concise language, tonal grouping, and one recovery path.

## 8. Core UI Patterns

- App shell pattern: Tonal layers plus a wide content canvas; navigation remains structurally stable while content shifts between archive, results, and reading modes.
- Card and panel pattern: Use only where grouping materially helps comprehension; most archive content should remain list-led.
- Button pattern: Actions are sparse, prominent when primary, and never multiplied just to fill space.
- Navigation pattern: Category navigation, archive pivots, and search must feel coherent as one archive system. The baseline pattern is structurally stable navigation paired with lightweight mode or context switching when needed.
- List and table pattern: Lists are editorial and summary-led; dense table behavior is exceptional and secondary.
- Form pattern: Inputs should feel like annotation tools or archive controls, not enterprise forms.
- Filter and chip pattern: Filters are compact, textual, and easy to scan; they must not become a colorful badge cloud.

## 9. Mobile Evolution Rules

- What simplifies on mobile: Persistent side navigation collapses into a drawer or sheet, metadata stacks vertically, and browse controls compress into a single top region.
- What must stay visually consistent: Dark editorial atmosphere, the approved `Inter`/`Noto Sans KR`/`Satoshi` hierarchy, tonal layering, spacious note previews, and restrained accent usage.
- Navigation transformation: Hover-driven navigation must become tap/disclosure driven; nested flyouts are not allowed on mobile.
- Density rule: Reduce simultaneous options before reducing type comfort or line spacing.

## 10. Implementation Rules

- Primitive token rule: No raw color, radius, spacing, or shadow values should be introduced outside the locked token families unless the constitution is updated.
- Semantic token rule: Components should reference semantic roles such as canvas, surface, muted text, accent action, and reading width rather than direct raw values.
- Component rule: New component variants must inherit the no-line editorial system and justify why an existing pattern is insufficient.
- Layout rule: New pages must compose from the shell, reading widths, and tonal layers defined here before inventing page-specific scaffolds.
- Source-of-truth update rule: If `DESIGN.md` or a committed screen changes a durable rule, update this constitution in the same work cycle.

## 11. AI Guardrails

- AI may:
  - Extend the archive UI using the existing editorial language.
  - Refine component states while staying within the token system.
  - Propose new screen layouts when they preserve archive-first priorities.
- AI may not:
  - Replace the editorial system with generic blog, dashboard, or app-store patterns.
  - Introduce unrelated personas, assistant branding, or ornamental feature blocks.
  - Add new tokens, component families, or visual themes without updating this constitution.
- Versioning trigger: Any durable change to tone, token families, shell structure, or component rules requires a constitution update and a note in the active plan.

## 12. Durable Screen Families

- Screen families:
  - Archive browse and category listing.
  - Search and filtered results.
  - Note reading detail.
  - Lightweight archive maintenance or metadata review surfaces, if exposed in the UI later.
- Why these families are fundamental: They map directly to the product scope of browsing, searching, reading, and long-term archive organization.
- Family-specific constraints:
  - Browse/list screens prioritize scan rhythm, category clarity, and clean mapping to the verified archive hierarchy.
  - Search/result screens prioritize fast narrowing without losing editorial calm.
  - Reading detail screens prioritize typography, note structure, and comfortable measure.
  - Maintenance-oriented surfaces must stay subordinate to the reading-first visual language.

## 13. Guardrails

- Forbidden visual drift:
  - No bright light-mode panels layered arbitrarily into the dark shell.
  - No border-led sectioning.
  - No crowded widget dashboards.
  - No AI-profile or social-profile framing in the archive shell.
- Rules for adding new tokens: Add tokens only when at least one durable screen family cannot be expressed with the current set and the new token has a reusable semantic role.
- Rules for adding new component variants: Add variants only after checking whether hierarchy, spacing, or semantic text changes solve the need first.
- Rules for versioning: Treat this document as the design source of truth and revise it when durable rules change, not when one page needs a temporary workaround.
