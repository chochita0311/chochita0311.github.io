# Design Collection Session Summary

Historical implementation and verification record for the owner-directed Design collection changes. [Project Architecture](../../policies/project/architecture.md#design-collection-runtime) owns current runtime boundaries.

## Scope And Sources

- Consolidated: `2026-10-03`.
- Source set: the session's owner requests, the supplied archive prototype and galaxy image, the working-tree changes, and local verification. Durable runtime files contain the imported result; no Downloads or scratch path is required to render it.
- The owner requested a replacement of the Design content area, a collection sidebar, constellation navigation and glow refinements, background replacement and tone tuning, finite pan/zoom bounds, and removal of the bottom-center minimap.
- The shared topbar, note content, and static GitHub Pages delivery remain the surrounding boundaries. Earlier orbital-browser specs and runs are preserved as history rather than rewritten as acceptance evidence for the new canvas.

## Implementation Snapshot

The following records the implementation as consolidated on `2026-10-03`. Future runtime changes belong to Project Architecture; this snapshot remains historical evidence.

### Entry And Collections

- `/archive/design/` now opens the constellation collection browser. The imported content is adapted inside the existing Design shell.
- The desktop content area is divided into a left collection sidebar and the main canvas. The sidebar uses twice the Notes sidebar width at the wide breakpoint, with the collection stylesheet owning narrower layouts.
- `assets/js/design/archive-controller.js` owns the collection list, active header metadata, and selection events. Andromeda is active; Orion and Lyra are disabled future slots.
- `assets/js/design/collection-browser.js` owns the current canvas, nodes, specimen cards, focus, and navigation. The generic name supports future collections without pretending that alternate canvases are already implemented.
- The fixture currently renders 16 node/card pairs. It is not connected to durable note files, a generated Design index, or a separate specimen detail route.
- Final review corrected the prototype's stale 20-specimen total and `/20` counters. The collection header now reads rendered item/node counts, and card counters use the fixture's actual length.

### Travel And Feedback

- Route selection uses the connected node graph and world-coordinate edge distance. This is the local shortest-distance policy, not a universal rule for every navigation graph.
- Camera motion and route feedback are independent. The camera starts at the current explored view and interpolates directly toward the destination with smooth acceleration and deceleration; it does not rewind to the selected origin or follow every route bend.
- Glow travels along one continuous multi-segment path. A longer tail and slower trace were introduced after feedback about abrupt node transitions and excessive speed.
- The tail finishes at the destination after the camera can already have settled. Transient travel feedback is then cleared separately from persistent specimen selection.
- Final reconciliation reproduced an old cleanup timer clearing a newer journey's glow during consecutive selections. Cleanup timers are now tracked and cancelled together with animation frames.
- Reduced motion skips decorative travel and applies the destination view immediately. Dragging, zooming, or resetting cancels active travel.

### Background And Bounds

- The active image is `assets/design/andromeda_galaxy.jpg`; the earlier `andromeda-bg-4k.jpg` asset is absent.
- Background dimming was introduced to preserve card and glow visibility, then eased after the owner found the image too faint. The current brightness filter is `0.64`, with saturation, contrast, overlays, and vignette adjusted in the collection stylesheet. These are local visual choices.
- Scale and translation are clamped against the rendered canvas viewport and the finite `3000 x 1800` world. Minimum zoom accounts for viewport width and height so normal navigation does not expose space outside the background.
- The bottom-center minimap, its viewport rectangle, and their HTML, CSS, and event/rendering logic are removed. The main `#viewport`, visible zoom/reset controls, and scale readout remain.

### Asset Preparation And File Ownership

- Landing entry asks the shell handoff layer to schedule Design CSS, JavaScript, and image prefetch hints. Pointer, focus, touch, and Design navigation also initiate warming.
- Prefetch is best effort and does not block navigation or prove that image decoding and destination interaction are ready before a click.
- Notes and Design now use domain folders in both JavaScript and CSS. Archive controllers orchestrate each archive; the Design collection browser owns its canvas behavior.

| Before | Current Owner | Change |
| --- | --- | --- |
| `assets/css/note-detail.css` | `assets/css/note/detail.css` | Path move; note-detail styling preserved |
| `assets/css/design.css` | `assets/css/design/cards.css` | Path move; earlier styles and shared Design entry presentation retained |
| Routed orbital browser in `assets/js/design/cards.js` | `assets/js/design/collection-browser.js` | New canvas implementation; earlier source retained but no longer loaded by the route |
| Collection metadata embedded in the prototype | `assets/js/design/archive-controller.js` | Collection list and selection orchestration |
| Prototype content styling | `assets/css/design/collection-browser.css` | Route-specific content styling, background tone, and glow presentation |

Active HTML stylesheet/script references, the app stylesheet import, prefetch targets, and affected documentation paths are aligned with these owners.

## Documentation Reconciliation

- Project Architecture owns maintained runtime boundaries and behavior; this record preserves the implementation snapshot and its evidence. Overview and historical records link to those distinct owners.
- The original CSS audit retains its 2026-05-03 paths and no-movement finding, with a pointer to this later migration. The orbital-browser spec and run retain their original acceptance and result.
- Generalized evaluation guidance is maintained in the separate `ai-assets` repository under `agents/policies/review/design-evaluation.md` and `interaction-evaluation.md`. It covers current-view continuity, independent route feedback, trace completion and cancellation, finite coverage, foreground/background hierarchy, and cold/warm rendered evidence without copying this screen's colors or timing values.

## Verification And Limits

- Earlier session checks reported passing frontend lint, minimap removal, the active background/filter, bounded zoom/pan, route timing, and no console errors in the inspected local flows.
- Final reconciliation passed `npm run lint`, explicit entry-shell Prettier checks, the icon-control check, and whitespace checks. The moved Notes and earlier Design styles are byte-identical to their previous tracked files, and the Design topbar markup is unchanged.
- A fresh-browser flow verified landing prefetch hints, entry into Design, return to Notes, the 16 rendered node/card pairs, disabled future collection slots, minimap absence, and the active background/filter without local asset failures or console errors.
- After the count correction, a fresh-browser check confirmed header totals of 16 specimens and 16 nodes, with card counters from `01 / 16` through `16 / 16`.
- A note-list-to-detail smoke check loaded an actual Markdown body with the moved note stylesheet. Start and middle travel screenshots showed the glow progressing along the same multi-segment route independently of the changing camera transform.
- Geometry checks at `1440 x 1000`, `1920 x 1080`, and `390 x 844` verified background coverage at minimum zoom and after extreme pan input, with no outer-document horizontal overflow. The extreme bounds checks used scripted button and synthetic pointer events; they are not evidence of every physical gesture or device.
- The reproduced consecutive-selection failure passed after tracking cleanup timers: a newer route survives the earlier journey's cleanup deadline, normal feedback completes, rapid reselection keeps the latest route, and reset clears it. Reduced motion selects the destination without travel feedback.
- Rendered screenshots were inspected for the active background and foreground layers. At the narrow `390 x 844` sample, the overlaid collection sidebar covers card content; mobile usability is not established by the passing bounds check. This remains a limitation of the desktop-first prototype.
- Read-only subagent reviews applied `docs-structuring` and `docs-shaping` to the affected document set. Reported ownership, history/snapshot wording, and source-mapping issues were corrected. A Markdown-AST check verified all 136 local links in the 18 changed Markdown documents; the separate generalized evaluation documents passed their own link and review checks in `ai-assets`.
- Computed styles and error-free execution alone are not treated as proof of natural motion, measured contrast, or final visual acceptance. The owner remains the judge of the tuned motion and tone.
- Additional collection rendering, durable Design content storage, and specimen detail navigation remain unimplemented. This record does not approve those future features.
- Production cache behavior, real network latency, all browser/device combinations, and a cross-project evaluation rerun require separate evidence. Generalized rules are review criteria derived from this session, not proof of universal product outcomes.
