# Design System Specification: High-End Scholarly Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**
This design system moves away from the "template-heavy" look of traditional blogs, opting instead for a bespoke, high-end editorial experience. It is designed to feel like a premium physical journal translated into a digital space—heavy on atmosphere, light on structural clutter. 

To achieve the "Digital Curator" aesthetic, we break the standard rigid grid. We utilize **intentional asymmetry**, massive typographic contrast, and **tonal layering** to guide the reader’s eye. The goal is "Impeccable Seamlessness": a layout where elements feel like they are floating in a cohesive, atmospheric environment rather than being locked into boxes.

---

## 2. Colors & Tonal Depth
We are moving away from flat design into a world of **Ambient Occlusion**. This system relies on the interplay of deep charcoals and slate grays to create a sense of physical presence.

### The Palette
*   **Background (`surface`):** `#111317` – A deep, obsidian foundation that provides more soul than pure black.
*   **Primary Action (`primary`):** `#b6c4ff` (Text/Icon) / `#0044cf` (Container) – A vibrant electric blue that cuts through the gray scale with surgical precision.
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: `#0c0e12` (For deep inset elements)
    *   `surface-container`: `#1e2024` (Standard content cards)
    *   `surface-container-high`: `#282a2e` (Elevated interaction states)

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. 
Boundaries must be defined solely through background color shifts or subtle tonal transitions. Use `surface-container-low` sections sitting on a `surface` background to denote change. If a container feels "lost," do not add a stroke; instead, adjust its elevation tier or increase the padding.

### The "Glass & Gradient" Rule
To elevate CTAs and Hero sections:
*   **Glassmorphism:** Use semi-transparent surface colors (e.g., `surface_variant` at 60% opacity) with a `20px` backdrop-blur for floating navigation or overlays.
*   **Signature Textures:** Apply a subtle linear gradient from `primary` (#b6c4ff) to `primary_container` (#0044cf) at a 135-degree angle for primary buttons to give them a "machined" metallic sheen.

---

## 3. Typography: The Editorial Scale
We use **Manrope** for its geometric yet humanist qualities. Our hierarchy is unapologetically bold to mimic high-end print journalism.

*   **Display (800 Weight):** Use `display-lg` (3.5rem) for main titles. The 800-weight is our signature; it should feel heavy, authoritative, and expensive.
*   **Headlines:** `headline-lg` (2rem) and `headline-md` (1.75rem). Use these to break up long-form scholarly text.
*   **Body (400/500 Weight):** `body-lg` (1rem). Set line-height to 1.6 for maximum readability. In scholarly contexts, white space between paragraphs is as important as the text itself.
*   **Labels (600 Weight):** `label-md` (0.75rem). Use All-Caps with 0.05rem letter spacing for metadata (e.g., "PUBLISHED IN ASTROPHYSICS").

---

## 4. Elevation & Depth: The Layering Principle
Hierarchy is achieved through **Tonal Layering** rather than structural lines.

*   **Stacking Surfaces:** Instead of a flat grid, treat the UI as physical layers. Place a `surface-container-lowest` card inside a `surface-container-low` section to create a soft, natural "sink" effect.
*   **Ambient Shadows:** For floating elements (Modals, Dropdowns), use extra-diffused shadows.
    *   *Spec:* `0px 20px 40px rgba(0, 0, 0, 0.4)`. 
    *   The shadow should never be pure black; it should feel like a tinted "glow" of the background.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token (#434653) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (Primary to Primary-Container), `xl` (0.75rem) corner radius. No border.
*   **Secondary:** `surface-container-highest` fill with `primary` text.
*   **Tertiary:** Ghost style. No background, `primary` text, transitions to a subtle `surface-bright` background on hover.

### Cards & Lists
*   **Rule:** Forbid divider lines. 
*   **Execution:** Separate list items using `1rem` of vertical space. For scholarly citations or feed items, use a slight background shift (`surface-container`) on hover to define the interactive area.
*   **Shape:** Use `lg` (0.5rem) roundedness for a modern, architectural feel.

### Input Fields
*   **Style:** Inset look. Use `surface-container-lowest` background. 
*   **Focus State:** Do not use a heavy glow. Use a 2px `primary` bottom-border only, creating a sophisticated "underlined" focus that feels like a premium stationary form.

### Scholarly "Pull-Quotes"
*   **Component:** A unique component for this system. 
*   **Style:** No quotation marks. Use a `3px` vertical bar of `primary_fixed` on the left, `headline-sm` italicized text, and generous `3rem` inset padding.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. Large-scale typography on the left with metadata tucked into a wide right-hand gutter.
*   **Do** use `surface-bright` (#37393d) for subtle hover states on dark components.
*   **Do** lean into "Breathing Room." If you think there is enough margin, add 16px more.

### Don’t:
*   **Don't** use 100% opaque borders. They break the seamless "Space Gray" immersion.
*   **Don't** use pure black (#000000) or pure white (#FFFFFF). Use `surface` and `on-surface`.
*   **Don't** use standard "Drop Shadows" on cards. Rely on color shifts (Tonal Layering) first. Shadows are reserved for elements that actually "float" (modals/tooltips).