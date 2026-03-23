# Table Standards (v1)

This file is the single source of truth for DB naming and column rules across subject areas.

## Scope
- Applies to all files under `docs/tables/`.
- Subject-area documents should reference this file and avoid duplicating global rules.

## 1) Table Naming Rules
- Use lowercase snake_case.
- Use semantic prefixes by table role:
  - `mst_`: master/entity table
  - `map_`: mapping table (N:M relation)
  - `log_`: log/history/run table
  - `idx_fts_`: full-text search virtual table
- Keep names domain-specific and explicit.
  - Good: `mst_post`, `map_post_hashtag`, `log_sync_run`
  - Avoid: generic names like `data`, `item`, `list`

## 2) Column Naming Rules
- Use lowercase snake_case.
- Primary key: `<entity>_id` (for example, `board_id`, `post_id`, `sync_run_id`).
- Foreign key: `<parent>_id` (for example, `board_id`, `post_id`).
- Record lifecycle status:
  - Preferred name: `record_status`.
  - Use this when row lifecycle is controlled by status change (soft delete) instead of hard delete.
  - `record_status` can be optional if the table always uses hard delete or status is represented by a domain-specific status column.
- Audit actor fields:
  - `reg_id`, `upd_id` are required for general business tables.
  - Exception: technical tables can omit these fields (for example, `idx_fts_*`, `log_*`).
- Time fields:
  - Base audit: `reg_dt`, `upd_dt` (UTC ISO-8601 text)
  - Domain event time: explicit names (for example, `published_at`, `started_at`)
- Audit column order for business tables:
  - `reg_id`, `reg_dt`, `upd_id`, `upd_dt`
- State/status fields should use clear domain names:
  - `post_status`, `run_status` preferred over generic `status` when ambiguity exists.

## 2.1) Soft Delete / Base Audit Set
- For business tables that use soft delete, treat the following as the baseline set:
  - `record_status`, `reg_id`, `reg_dt`, `upd_id`, `upd_dt`
- If `record_status` exists, it must be placed before `reg_id`.
- Recommended lifecycle values for `record_status`:
  - `ACTIVE`, `INACTIVE`, `DELETED`
- If a domain-specific status already fully represents lifecycle (for example, `post_status` includes `deleted`), `record_status` may be omitted to avoid duplicated meaning.
- Avoid `is_active` for expandable lifecycle control; use `record_status` unless a strict binary flag is truly sufficient.

## 3) Constraint Rules
- Define `NOT NULL` by default unless nullable is required by lifecycle.
- Use `UNIQUE` for immutable business identifiers (for example, `source_path`, `email`, `slug`).
- Define FK relations explicitly in DDL.
- Use CHECK constraints where state sets are stable (optional in early stage, recommended later).

## 4) Index Rules
- Add indexes only for known query paths.
- Name indexes as `idx_<table>_<columns/intention>`.
- Typical baseline:
  - list page sort key index (for example, `published_at DESC` with board filter)
  - status + update timestamp index
  - source-origin/source-path index for sync/upsert
- For content search, prefer FTS (`idx_fts_*`) over `%LIKE%` scans.

## 5) Subject-Area Folder Rule
- Keep DDL/ERD/migration notes inside each subject folder.
- Global standards belong only in `docs/tables/standards.md`.

## 6) Versioning Rule
- Update this file when global naming/column standards change.
- Subject-area docs should only include domain-specific exceptions.

## 7) DDL Comment Portability
- Current SQLite baseline:
  - Keep inline SQL text comments (`-- ...`) in DDL scripts.
  - Manage canonical table/column descriptions in `docs/tables/*.md`.
- Future migration to DB engines that support DDL comments (for example, MySQL/PostgreSQL):
  - Add table comments and column comments in migration scripts.
  - Keep comment text aligned with `docs/tables/*.md` descriptions.
  - Treat DDL comments as optional now and required after DB engine migration is finalized.
