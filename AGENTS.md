# Repository Guidelines

## Default Information Management
- For any changes to the project structure, coding style, or other guidelines, please propose updates to this document to keep it current
- When changing `AGENTS.md`, or `docs/agents/*.md` templates, ask for review and do not revise pre-existing contents in those files; only add new content for new tasks or updates; only indentation changes are allowed for formatting consistency
- All agent role definitions,logs, plans, and tables would be shared through each project, so please keep the content clear and concise for easy understanding
- Only The Product Manager defines plan and acceptance criteria

## Project Structure & Module Organization
- `English - Langs Studio/` holds the Markdown review notes. Files are plain `.md` files
- `English - YBM Life English/` holds other assets for study materials

## Commit & Pull Request Guidelines
- If you add Git, use clear, imperative commit messages
- For PRs, include: a brief summary, note list changes, and a screenshot of the viewer if UI changes

# Project Features

## Initial Goals
- Firstly, started from collecting materials that I take from offline English classes, make them easily searchable and viewable
  - Implement a simple web app that allows me to view and search through my Markdown notes efficiently
  - Refer to the notes from source folders, but consider those notes will be added into a database, so that I can add more notes in the future without breaking the existing data structure
- Keep the app lightweight and fast by avoiding heavy frameworks or build tools
- Add some English learning features like vocabulary highlighting, flashcards, note tagging, and progress tracking

## Mid-term Goals (Web App, mobile view support)
- login
- member systems; control user roles (admin, teacher, student)
- reservation for class schedule management
  - when paid, add subscription card by admin
  - class schedule calendar view; remained seats for each class like theater reservation system
- Board for announcements and contents from the academy
  - html tags support in posts (consider security)
  - upload photos and files
  - comments system for interaction; reply, likes, emojis

## Long-term Goals (Android/iOS Apps)
- Expand to mobile apps after web app stabilization
- Real-time chat system between students, teachers and foreigners
- Foreigners' community features for meeting and socializing; for whom visit Korea to attend offline English volunteering works, cultural exchange going out together (need map integration like Tinder, nomad table)
- Enrichment study matrials; video lessons, quizzes, progress tracking based on review notes
- notification system for upcoming classes via email or in-app alerts
- payment system integration
- multi-language support for foreigners

# Technical Considerations
- Ensure the UI is clean and user-friendly, focusing on ease of navigation through notes; Start with a web app but consider mobile view so that I can expand to mobile apps later
- Consider using sqlite for lightweight data storage
- Prioritize performance and responsiveness, especially for search functionality
- Keep security in mind, especially for user authentication and data privacy

# Development Process
- Follow the roles and responsibilities outlined in the Product Manager agent to maintain focus on MVP delivery
- Design UI/UX after defining clear acceptance criteria for each feature (see designer agent)
- Design Data Model before implementing backend services (see data engineer agent)

## Agent Development Tracking
- Use `docs/logs/INDEX.md` as the single dashboard for all agent work.
- Use role-based task IDs:
  - Product Manager: `PM-0001`
  - Backend Engineer: `BE-0001`
  - Database Engineer: `DB-0001`
  - Designer: `DE-0001`
  - Frontend Engineer: `FE-0001`
- Keep task logging concise in one table with columns:
  - Task ID, Agent, Status, Last Update, Summary, Next Action

# Personal Notes
- I have 6 years mid-level backend careers but never developed frontend apps before, focusing on learning frontend basics through this project
- Thinking of 1000 DAU, so keep it simple and efficient
- Focus on core features first; avoid over-engineering
