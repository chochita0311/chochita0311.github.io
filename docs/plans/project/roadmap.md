# Project Roadmap

## Current Direction
- Clean up the repository around a clear notes-first product shape.
- Keep the static app easy to browse, search, read, and maintain.

## Near-Term Priorities
- Reduce ambiguity between Markdown archive content and UI preview data.
- Keep the generated note index simple for now while preparing the runtime for future archive growth.
- Keep the generated archive index field set under review so it stays lean for current browse needs without blocking future features such as bookmarks, tag search, and richer sorting.
- Wire the existing topbar search UI to client-side archive index search for title, summary, tags, and archive taxonomy without introducing a server dependency.
- Keep repository docs clean, separated, and easy to navigate.
- Continue simplifying the app toward a clearer personal notes experience.

## Longer-Term Direction
- Improve the connection between `NOTES/` content and the browser runtime.
- Evolve the generated note index from a single runtime file toward a layered structure such as manifest plus recent and per-category indexes when archive size makes that tradeoff worthwhile.
- Expand note-management workflows without losing the lightweight static model.
- Keep future growth compatible with GitHub Pages and long-term archive maintenance.
