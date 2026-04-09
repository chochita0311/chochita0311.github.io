# Design Brief: High-End Scholarly Editorial

This document is the creative source for the design system: it captures the north star, visual rationale, and material direction extracted from the starting artifact.

Concrete tokens, enforceable implementation rules, and durable system constraints belong in [docs/designs/design-constitution.md](./docs/designs/design-constitution.md).

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

### The "No-Line" Direction
The visual system should avoid relying on 1px solid borders for sectioning.
Boundaries should prefer background color shifts or subtle tonal transitions. If a container feels "lost," the first move should be adjusting elevation or padding rather than adding a stroke.

### The "Glass & Gradient" Direction
To elevate CTAs and hero sections:
*   **Glassmorphism:** Floating navigation or overlays may use semi-transparent surfaces with restrained blur to feel atmospheric rather than glossy.
*   **Signature Textures:** Primary actions may use a subtle blue gradient to create a machined, editorial sheen.

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

## 5. Component Cues

### Buttons
*   **Primary:** Favor a gradient or strong accent fill with a soft architectural radius and no visible border.
*   **Secondary:** Favor tonal fills with accent-led text treatment.
*   **Tertiary:** Favor ghost styling with a restrained hover field.

### Cards & Lists
*   **Direction:** Avoid divider lines as the primary organizing device.
*   **Execution:** Separate list items with vertical space and use slight tonal hover shifts to define interaction.
*   **Shape:** Rounded surfaces should feel modern and architectural rather than soft or playful.

### Input Fields
*   **Style:** Inputs should feel inset and quiet rather than chrome-heavy.
*   **Focus State:** Focus should feel precise and restrained, closer to an editorial underline than a loud glow.

### Scholarly "Pull-Quotes"
*   **Component:** A distinctive editorial component for moments of emphasis.
*   **Style:** It should avoid literal quotation marks and lean on a slim accent bar, italicized headline-scale text, and generous inset spacing.

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
