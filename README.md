# chochita0311.github.io

Lightweight static notes site for browsing, searching, and preserving personal study materials on GitHub Pages.

## Overview
- Personal notes web app with a static HTML/CSS/JS runtime
- Long-term Markdown archive under `notes/`
- GitHub Pages project intended to stay lightweight, searchable, and maintainable

## Local Run
Because the app fetches local JSON files, run it through a local server instead of opening `index.html` directly with `file://`.

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Documentation Map
- `AGENTS.md`: entrance and contributor map
- `docs/project/policy.md`: product direction and scope
- `docs/project/architecture.md`: runtime and content structure
- `docs/project/developer-guide.md`: development and verification guidance
- `docs/project/roadmap.md`: current and future direction
- `docs/designs/design-constitution.md`: design source of truth
