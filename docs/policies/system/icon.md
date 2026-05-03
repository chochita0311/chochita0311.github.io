# Icon Control

## Purpose
- Keep icon choice, naming, and accessibility consistent across the static archive runtime.
- Centralize icon decisions so future AI-generated screens do not introduce uncontrolled icon drift.

## Approved Source
- The current approved icon source is Google Material Symbols Outlined.
- Official icon browser and source reference: `https://fonts.google.com/icons`
- Do not mix Rounded or Sharp variants into the published runtime unless the design constitution is updated first.
- Do not add image-based PNG icon assets for normal UI controls.

## Canonical Runtime Owner
- `assets/js/shared/icons.js` owns the shared icon registry and the default Material Symbols rendering helper.
- Use semantic registry keys before adding a new raw glyph name to page code.

## Registry Rules
- Add new icons to `window.AppIcons.ICONS` before using them in runtime code.
- Use semantic keys such as navigation, actions, and categories instead of scattering raw glyph names.
- Keep fallback icons explicit inside the registry rather than hidden in component code.

## Markup Rules
- Use the shared rendering pattern from `window.AppIcons.renderIcon(...)` in JavaScript-generated markup.
- Static HTML should follow the same class pattern:

```html
<span class="icon icon--material material-symbols-outlined" aria-hidden="true">search</span>
```

- Treat decorative icons as hidden from assistive technology by default.
- Icon-only buttons must carry an accessible name on the button element with `aria-label`.

## When SVG Is Allowed
- Use SVG instead of Material Symbols only when one of these is true:
  - the icon must be product-specific or brand-specific
  - the icon needs multi-tone styling or fine-grained animation
  - the icon shape must deviate from the Material Symbols family

## Current Approved Inventory
- Navigation: `expand_more`, `chevron_left`, `chevron_right`, `search`
- Actions: `content_copy`, `ios_share`, `bookmark`, `more_horiz`, `sell`
- Categories: `menu_book`, `memory`, `folder`

## Change Workflow
- Add or change the icon in `assets/js/shared/icons.js`.
- Update any touched static markup to the canonical class and accessibility pattern.
- Run `node scripts/check-icon-control.mjs`.
- Update this doc and any design-system rule that changed in the same turn.
- Verify archive browse and note read flows after icon changes.
