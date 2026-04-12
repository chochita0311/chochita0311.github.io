# Icon Control Inventory

## Purpose

Record the verified baseline icon inventory for the icon-control refactor track so migration work can prove coverage instead of assuming it.

## Approved Runtime Source

- Google Material Symbols Outlined loaded from Google Fonts in:
  - `index.html`
  - `pages/note/index.html`

## Verified Icon Names In Current Use

- Navigation and structure:
  - `expand_more`
  - `chevron_left`
  - `chevron_right`
  - `search`
- Actions and utility:
  - `ios_share`
  - `bookmark`
  - `more_horiz`
  - `sell`
- Category and taxonomy:
  - `menu_book`
  - `memory`
  - `folder`

## Verified Usage Sites

- `index.html`
  - top navigation disclosure
  - nested menu chevrons
  - topbar search field
  - footer links
  - note breadcrumbs
  - note action buttons
  - pagination buttons
- `pages/note/index.html`
  - top navigation disclosure
  - nested menu chevrons
  - topbar search field
  - footer links
  - note breadcrumbs
  - note action buttons
- `assets/js/sidebar-categories.js`
  - category icons for English and Technology
  - category fallback icon
- `assets/js/index-note-detail.js`
  - archive footer pagination
  - inline detail breadcrumbs
- `assets/js/note-detail-page.js`
  - note page breadcrumbs

## Notes

- The published runtime previously hardcoded raw icon names directly in both static HTML and JavaScript-rendered markup.
- Accessibility naming for icon-only note action buttons was not explicit in the baseline markup.
