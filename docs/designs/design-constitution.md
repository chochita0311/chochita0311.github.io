# Notes App Design Constitution

## 1. Project Context
- Product type: personal Markdown notes library, reader, and maintenance surface for long-term study materials.
- Primary users: the repository owner as the sole author, curator, and reader.
- Primary jobs to be done: search notes, scan categorized note lists, open and read Markdown content, and grow the archive without breaking retrieval.
- Device priority: desktop-first for organization and maintenance, mobile-second for lookup and reading continuity.
- Technical constraints: static GitHub Pages hosting, lightweight HTML/CSS/JS, Markdown source files under `notes/`, no heavy framework baseline, and layered CSS files as the long-term styling architecture.
- Starting artifact type:
  - screen-plus-context

## 2. Compatibility Constraints
- Data model constraints: the UI treats note title, category, created date, Markdown body, optional tags, and source-path identity as stable note properties even when some metadata is inferred.
- Role and permission constraints: the base product is single-owner; any future public-read mode must remain additive and must not reshape the shell into a multi-user workspace.
- Status/state constraints: the system must support `default`, `searching`, `filtered`, `selected`, `empty`, `error`, `pagination-start`, and `pagination-end`; edit flows add `dirty`, `saving`, and `save-failed`.
- Form and validation constraints: search must support partial matches and zero-result states; create and edit flows must support required title handling, safe filename derivation, malformed metadata handling, and unsaved-change protection.
- Mobile and responsive constraints: browse, filter, pagination, and reading must remain usable without hover, wide tables, or permanently visible side navigation.
- Future expansion constraints: tags, favorites, recent notes, and collection views fit the product; membership, notifications, boards, and business-learning modules do not belong in the base system.

## 3. Design DNA
- Tone keywords:
  - calm
  - studious
  - precise
  - editorial
  - lightweight
  - private
  - structured
- Visual principles:
  - Retrieval and reading outrank dashboard spectacle.
  - Typography, spacing, and border contrast carry hierarchy before ornament.
  - The blue accent signals action, active state, and selection rather than decoration.
  - Browse views may be dense, but reading and editing views must open into calmer spacing.
  - Desktop and mobile are the same note library with different compression rules.
- Anti-principles:
  - No SaaS control-center styling.
  - No premium upsell, notification-center, or social-product cues.
  - No unrelated business-learning framing.
  - No dark-mode-first identity.
  - No page-specific raw values outside the token system.
  - No desktop table patterns that simply disappear on mobile.
- Source of truth: this constitution plus the layered CSS files in `assets/css/`, with primitives in `tokens.css` and product meaning in `semantic.css`.
- Reference boundaries: `index.html` is the extraction artifact for hierarchy, shell composition, and responsive assumptions; it is not itself the design system.

## 4. Primitive Tokens
- Colors:
  - Accent primary: `#144bb8`
  - Accent strong: `#0f3d97`
  - Accent tint: `rgba(20, 75, 184, 0.08)`
  - Page light: `#fdfcf9`
  - Page soft: `#f4f6fb`
  - Surface base: `#ffffff`
  - Surface soft: `#f8faff`
  - Text strong: `#111827`
  - Text body: `#0f172a`
  - Text muted: `#667085`
  - Border soft: `rgba(20, 75, 184, 0.1)`
  - Border strong: `#d8e0ee`
  - Success: `#15803d`
  - Warning: `#b45309`
  - Danger: `#c73f2e`
- Typography:
  - Primary UI family: `Manrope`, sans-serif
  - Reading family: `Manrope`, sans-serif
  - Display/page title: 32px to 40px, weight 800
  - Section title: 20px to 24px, weight 700
  - Body: 14px to 16px
  - Label: 12px
  - Caption/meta: 10px uppercase with wide tracking
- Spacing:
  - Approved scale: 4, 8, 12, 16, 24, 32, 40, 48
  - Desktop shell rhythm: 24 to 32
  - Mobile shell rhythm: 12 to 16
- Radius:
  - Approved scale: 8, 12, 16, pill
  - Default interactive/card radius: 12
  - Prominent/floating radius: 16
- Shadows:
  - Card: soft vertical lift only
  - Action emphasis: compact elevated shadow for primary actions
  - Hover: subtle change only
- Motion:
  - Duration: 120ms to 220ms
  - Easing: ease-out
  - Allowed properties: opacity, color, border-color, small translate, shadow
- States:
  - Focus uses a soft accent ring
  - Selected uses accent tint with accent text
  - Hover uses low-contrast tinting
  - Disabled lowers contrast without collapsing legibility

## 5. Semantic Tokens
- Page background: warm paper is the default app canvas, with soft mist reserved for low-contrast separation.
- Surface hierarchy:
  - `surface-page`: app canvas
  - `surface-shell`: topbar and navigation
  - `surface-card`: note lists, note detail wrappers, dialogs
  - `surface-soft`: selected chips, quiet helpers, low-emphasis modules
- Text hierarchy:
  - `text-heading`: page titles and note titles
  - `text-body`: primary list and reading text
  - `text-muted`: metadata and helper copy
  - `text-accent`: active navigation and selected utility emphasis
- Action hierarchy:
  - Primary: create, save, confirm
  - Secondary: pagination, view toggles, filter utilities
  - Tertiary: icon-only actions and low-priority row controls
- Feedback hierarchy:
  - Empty, loading, and error states are calm, instructional, and action-oriented
  - Success, warning, and danger use restrained tint surfaces rather than loud banners
- Shell sizing:
  - Desktop header: 64px to 74px
  - Desktop sidebar: 256px
  - Mobile header: 56px to 64px
  - Browse content max width: 1120px to 1200px
  - Reading content max width: 760px to 820px
- Reading mode: utility chrome recedes, the body column narrows, line-height increases, and metadata becomes secondary to note content.

## 6. Layout Rules
- App shell: sticky topbar plus persistent left rail on desktop; sticky compact topbar plus drawer-style navigation and single-column content on mobile.
- Navigation model: navigation is library-oriented and limited to note collections, note filters, and note tools; it is not a product-suite menu.
- Breakpoints:
  - Mobile: under 768px
  - Tablet/small desktop: 768px to 1023px
  - Desktop: 1024px and above
- Density rules:
  - Browse screens may use compact metadata layouts on desktop.
  - Reading and editing screens must visibly relax density.
  - Mobile stacks metadata under titles instead of preserving column headers.
- Content widths:
  - List pages may use the wide shell container.
  - Reading and editing pages use narrower centered content widths.

## 7. Core Components
- Buttons: allowed variants are `primary`, `secondary`, `ghost`, and `icon`; each action zone has one dominant primary action.
- Inputs: search is the canonical input pattern and defines border, background, placeholder, and focus behavior for other fields.
- Cards: cards group note rows, note metadata, dialogs, and state messaging with modest elevation and visible borders.
- Lists: note rows are the main browse unit and carry title, category or tags, date, and quick actions in a stable order.
- Tables: desktop-only enhancement for browse density; tables collapse into stacked rows or cards on mobile.
- Tabs or chips: chips filter by category, tag, or status and stay compact and horizontally scrollable on mobile.
- Dialogs or drawers: dialogs are used for confirmation and compact metadata editing; drawers and sheets are used for mobile navigation and overflow actions.
- Empty, loading, and error states: every screen family includes a title, short explanation, and one clear next action.

## 8. Core UI Patterns
- App shell pattern: brand mark, search, restrained utility actions, contextual note navigation, and a notes-first main panel.
- Card and panel pattern: shell panels stay quieter than content cards, and decorative layering remains minimal.
- Button pattern: primary action is filled accent, secondary action is outlined or soft-filled, and icon actions remain quiet until hover or focus.
- Navigation pattern: active items use accent tint plus accent text, and section labels use compact metadata styling sparingly.
- List and table pattern: the title column carries the semantic weight, metadata stays quiet, and row-end actions remain secondary.
- Form pattern: field rhythm follows the same spacing scale as browse surfaces, with inline validation and minimal modal complexity.
- Filter and chip pattern: filters stay single-line where possible, scroll horizontally on mobile, and do not replace primary navigation.

## 9. Mobile Evolution Rules
- What simplifies on mobile: sidebar becomes drawer, desktop table becomes stacked note cards, utility clusters compress behind overflow, and the primary create action may become floating.
- What must stay visually consistent: brand mark behavior, accent logic, border softness, type hierarchy, and chip styling.
- Navigation transformation: preserve the same information architecture while reducing simultaneous visible controls.
- Density rule: minimum target size is 44px, and reading comfort outranks list density on narrow screens.

## 10. Implementation Rules
- Primitive token rule: raw colors, spacing, typography, radius, shadow, and motion values belong only in `assets/css/tokens.css`.
- Semantic token rule: components and layouts consume semantic aliases from `assets/css/semantic.css`.
- Component rule: reusable UI definitions belong in `assets/css/components.css`, not inside individual pages.
- Layout rule: shell, breakpoint, and responsive transformations belong in `assets/css/layouts.css`.
- Source-of-truth update rule: update this constitution before expanding the system with a new durable screen family, new token scale, or new semantic layer.

## 11. AI Guardrails
- AI may:
  - extract stable patterns from the current artifact
  - normalize drift into a notes-first system
  - generate new screens from the locked shell, tokens, and components
  - refine responsive behavior without changing product identity
- AI may not:
  - introduce unrelated dashboard modules or business-product framing
  - create new visual styles outside the locked tone and token ranges
  - bypass the token and semantic layers with ad hoc values
  - multiply incompatible browse patterns for the same note entity
- Versioning trigger: revise the constitution whenever navigation structure, durable screen families, core token scales, or the note data model materially change.

## 12. Durable Screen Families
- Screen families:
  - Note library/list
  - Note detail/read
  - Note create/edit
- Why these families are fundamental: they map directly to the stable repeated jobs of retrieval, reading, and maintenance.
- Family-specific constraints:
  - Library/list supports search, filter, density control, explicit list states, and pagination.
  - Detail/read prioritizes Markdown readability over browse controls.
  - Create/edit stays lightweight and safe, with visible validation and save-state feedback.

## 13. Guardrails
- Forbidden visual drift:
  - no membership, notice-center, or board-suite modules in the base shell
  - no dark decorative surfaces as the primary identity
  - no accent overuse across borders, fills, and text at the same time
  - no desktop-only concepts that vanish rather than transform on mobile
- Rules for adding new tokens: add a token only when a recurring need cannot be expressed by the current approved scales across at least two screen families.
- Rules for adding new component variants: add a variant only when it has a named reusable role and explicit state behavior.
- Rules for versioning: changes to tone, shell, primary navigation, or family structure require a constitution revision and corresponding plan update.
