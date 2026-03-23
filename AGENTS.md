# Repository Guidelines

## Repository Overview
- This repository is my GitHub-hosted notes site and is published at `https://chochita0311.github.io`
- The note collection will continue to grow with materials written by me, generated with AI assistance, or gathered from search-based tips and references
- Organize all new materials so they remain easy to search, review, and preserve as long-term personal study assets

## Initial Note
- Build a lightweight notes web app that helps me keep my own materials well organized in one place
- Make the content easy to browse, search, and expand over time without breaking the structure as more notes are added

## Goals
- Implement a simple web app that allows me to view and search through my Markdown notes efficiently
- Keep the app lightweight and fast by avoiding heavy frameworks or build tools

## Project Structure & Module Organization
- `notes/` is root holding the Markdown notes. Files are plain `.md` files
- `docs/design-system/` holds the shared design rules, brand tokens, and UI guardrails for future screens
- `assets/css/tokens.css` holds primitive design tokens only: colors, typography, spacing, radius, shadows, and state constants
- `assets/css/semantic.css` maps primitive tokens into product meanings such as page surfaces, shell sizing, interactive roles, and state usage
- `assets/css/base.css` holds reset and shared element foundations
- `assets/css/components.css` holds reusable component styles and should avoid raw design values
- `assets/css/layouts.css` holds shell and responsive layout rules
- `assets/css/app.css` is the compatibility entry point that imports the layered CSS files
- `assets/css/design-tokens.css` is a backward-compatible alias to `assets/css/tokens.css`

## Default Information Management
- For any changes to the project structure, coding style, or other guidelines, please propose updates to this document to keep it current
- When changing `AGENTS.md`, or `docs/agents/*.md` templates, ask for review and do not revise pre-existing contents in those files; only add new content for new tasks or updates; only indentation changes are allowed for formatting consistency
- All agent role definitions,logs, plans, and tables would be shared through each project, so please keep the content clear and concise for easy understanding
- Only The Product Manager defines plan and acceptance criteria

## Design Guardrails
- Use `index.html` as the canonical visual baseline for the note app unless a newer design-system version is approved
- Follow `docs/design-system/NOTE-APP-DESIGN-SYSTEM.md` for brand tokens, component patterns, and identity guardrails
- Keep the visual system consistent across pages by reusing the shared tokens instead of introducing one-off colors, spacing, shadows, or radius values
- Treat `tokens.css` as raw primitives, `semantic.css` as product meaning, and component/layout files as consumers of those layers
- Treat files under `assets/styleguide/` as exploratory references unless their patterns are aligned with the canonical tokens

## Commit & Pull Request Guidelines
- If you add Git, use clear, imperative commit messages
- For PRs, include: a brief summary, note list changes, and a screenshot of the viewer if UI changes
