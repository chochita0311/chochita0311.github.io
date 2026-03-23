# Note App Design System Blueprint

## Purpose
- This document defines the visual baseline for the note app using the current `index.html` as the canonical source.
- All new screens should inherit this system unless a future version explicitly revises the tokens and guardrails.
- The goal is consistency, not redesign-by-screen.

## Source Of Truth
- Primary reference: `index.html`
- Implementation references: `assets/css/tokens.css`, `assets/css/semantic.css`, `assets/css/base.css`, `assets/css/components.css`, `assets/css/layouts.css`
- Styleguide files under `assets/styleguide/` are exploratory references, not stronger than `index.html`

## Current Design DNA

### Tone Keywords
- Luxury minimal
- Soft cream workspace
- Deep navy text foundation
- Editorial typography contrast
- Primary-blue interaction language
- Soft elevation, not heavy depth
- Rounded, calm, structured
- Desktop-first dashboard composition

### Visual Principles
- Use whitespace and type hierarchy before using decoration
- Keep the interface bright, quiet, and premium rather than trendy
- Make blue the only strong accent in normal UI states
- Prefer subtle borders and soft tinted surfaces over loud fills
- Preserve a structured grid and panel composition

## Locked Design Tokens v1.0

### Brand Colors
- `--color-primary: #144BB8`
- `--color-primary-strong: #0F3D97`
- `--color-bg-light: #FDFCF9`
- `--color-bg-mist: #F4F6FB`
- `--color-bg-dark: #0A0D14`
- `--color-surface-light: #FFFFFF`
- `--color-surface-soft: #F8FAFF`
- `--color-surface-dark: #0F172A`
- `--color-text-strong: #111827`
- `--color-text-body: #0F172A`
- `--color-text-muted: #667085`
- `--color-border-soft: rgba(20, 75, 184, 0.10)`
- `--color-border-strong: #D8E0EE`

### Functional Usage
- Primary actions: `--color-primary`
- Hover or pressed emphasis: `--color-primary-strong`
- App background: `--color-bg-light` with very soft cool gradient support
- Default card surface: `--color-surface-light`
- Secondary surface: `--color-surface-soft`
- Main headings: `--color-text-strong`
- Supporting copy: `--color-text-muted`
- Default border: `--color-border-soft`

### Typography
- UI font family: `Manrope, sans-serif`
- Reading font family: `Lexend, Manrope, sans-serif`
- Display title: `32px-40px`, `800`, tight tracking `-0.03em`
- Page title: `28px-32px`, `800`, tight tracking `-0.03em`
- Section title: `18px-20px`, `700`
- Body: `14px-16px`, `500`
- UI label: `12px-13px`, `700`
- Caption: `10px-12px`, `700-800`, uppercase with wide tracking
- Reading body: `16px`, line height `1.72`

### Radius
- `--radius-sm: 8px`
- `--radius-md: 12px`
- `--radius-lg: 16px`
- Pill radius: `9999px`

### Shadow
- Primary card shadow: `0 4px 20px -2px rgba(20, 75, 184, 0.05)`
- Elevated interactive shadow: `0 12px 26px rgba(20, 75, 184, 0.20)`
- Hover panel shadow: `0 12px 30px -5px rgba(20, 75, 184, 0.14)`

### Spacing Scale
- `4 / 8 / 12 / 16 / 24 / 32`
- Extended layout spacing allowed for page shells: `40 / 48`

### State Tokens
- `--color-success: #15803D`
- `--color-warning: #B45309`
- `--color-danger: #C73F2E`
- `--color-focus-ring: rgba(20, 75, 184, 0.13)`
- `--color-selected-bg: #EDF4FF`
- `--color-hover-bg: #FAFCFF`

### Shell Tokens
- `--sidebar-width: 256px`
- `--topbar-height-desktop: 74px`
- `--topbar-height-mobile: 64px`
- `--shell-padding-desktop: 16px`
- `--shell-padding-mobile: 12px`
- `--board-drawer-width: min(84vw, 320px)`

## Core UI Patterns

### 1. App Shell
- Cream-based background with subtle cool radial or linear wash is allowed
- Desktop layout uses top bar + left navigation + main content
- Mobile layout should simplify the shell but keep the same tonal palette

### 2. Cards And Panels
- White or softly tinted surface
- `12px` to `16px` radius
- Thin blue-tinted border
- Soft shadow only
- Content should breathe through padding, not decorative frames

### 3. Buttons
- Primary button:
  - solid primary blue fill
  - white text
  - bold label
  - slight lift on hover
- Secondary button:
  - white or soft-tinted background
  - blue or navy text
  - visible soft border
- Icon buttons:
  - circular or softly rounded
  - hover state uses `primary/5`

### 4. Sidebar Navigation
- Cream or near-cream surface
- Small uppercase section labels
- Nav rows use icon left + text right
- Active item uses `primary/10` fill, blue text, and soft blue border

### 5. Tables And Lists
- Structured grid layout
- Header row uses small uppercase label styling
- Row hover is soft blue tint only
- Title remains the strongest text in each row
- Metadata stays muted and visually secondary

### 6. Chips And Filters
- Active chip uses primary fill or primary-tinted fill
- Inactive chip remains white with a soft border
- Chips must stay compact and pill-shaped

### 7. Forms
- Inputs should feel quiet and integrated, not glossy
- Use understated borders or bottom borders
- Focus state is blue, not multicolor

## Identity Guardrails

### Do Not Introduce
- Random gradients as decorative branding
- More than one accent color in normal interface states
- Hard black shadows or floating glassmorphism
- Neon, saturated purple, or gaming-style colors
- Mixed radius values that make components feel unrelated
- Heavy illustration styles that overpower the content
- Loud background patterns behind dense text

### Keep Consistent
- Cream background family
- Navy text foundation
- Single blue accent system
- Manrope as the primary typeface
- Tight, bold headline styling
- Structured spacing and grid rhythm

## Styleguide Drift Notes
- Some `assets/styleguide/` screens use nearby but inconsistent blues, creams, and radii.
- When there is conflict, prefer the values and composition language already present in `index.html` and the layered CSS token system.
- Future cleanup should migrate exploratory screens toward these locked tokens rather than creating new variants.

## Mobile Evolution Rules
- Convert sidebar concepts into bottom navigation or compact top-level tabs
- Keep the cream background and soft card system
- Preserve the luxury minimal tone instead of switching to a playful mobile-app style
- Maintain content density discipline; mobile should be compact, not crowded

## Implementation Rules For Future Work
- Define tokens once and reuse them across pages
- `tokens.css` is for raw values only
- `semantic.css` is for product meaning and role-based aliases
- `components.css` and `layouts.css` should not introduce new raw hex values or ad hoc radius scales unless the design system is versioned first
- New components should map to these tokens before adding new values
- If a new screen needs a new token, version this document first
- Prefer shared classes or CSS variables over one-off inline values
- Use Codex to enforce tokens and spacing, not to invent new visual directions

## Codex Guardrails
- Codex may generate token files, shared components, and layout boilerplate that follows this system
- Codex should not randomly change layout tone, accent colors, radius language, or shadow style
- Any intentional visual evolution should be treated as a versioned design-system change, not an isolated page edit
