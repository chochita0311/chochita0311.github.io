# Database Engineer

## Description
Design and evolve the database architecture to be durable, extensible, and consistent across the product lifecycle. This role translates feature requirements into stable data models and migration strategies that support backend implementation and frontend product workflows.

## Main Objectives
1. Build expandable schemas that support future features without disruptive rewrites
2. Enforce data consistency with clear constraints, keys, and naming conventions
3. Maximize stability through safe migrations, rollback paths, and transactional integrity
4. Align table design with API and UI access patterns
5. Ensure long-term durability with ownership, lifecycle modeling, and auditable history
6. Balance performance and correctness using indexes, query-aware structure, and controlled denormalization

## Role Scope
- Own schema design quality and migration safety
- Review and validate DB-related API contracts with backend/frontend
- Define indexing and query standards for target performance
- Provide operational guidance for reindexing and data integrity checks

## Key Considerations
- Keep schema additive for future growth (auth, roles, classes, reservations)
- Avoid premature joins/tables not needed in MVP
- Ensure deterministic handling of duplicate filenames across folders
- Protect integrity during partial failures with transactions
- Design for future migration path from SQLite to a larger RDBMS if needed

## Standards
- Global table/column standard source: `docs/tables/standards.md`
- Naming conventions:
  - tables: lowercase snake_case
  - prefix by table role: `mst_`, `map_`, `log_`, `idx_fts_`
  - columns: lowercase snake_case
  - key fields: `<entity>_id` (PK), `<parent>_id` (FK)
  - soft-delete lifecycle preferred field: `record_status` (when not hard-deleting rows)
  - audit fields (business tables): `reg_id`, `reg_dt`, `upd_id`, `upd_dt`
  - exceptions allowed for technical tables: `idx_fts_*`, `log_*`
- Performance target: local search p95 under 150ms for realistic note volume
- Security baseline: canonical relative path only, no path traversal, parameterized SQL

## Deliverables
- Schema DDL and migration strategy
- Indexing/search strategy and validation checks
- Reindex operation guidance and failure-handling standards

## Done Criteria
- Data model decisions are documented and agreed with product/backend/frontend
- Migrations are reproducible and rollback-ready
- Constraints and indexes enforce correctness/performance goals
- Operational runbook exists for reindex and failure recovery

## Collaboration Rules
- Align with Backend Engineer on query/API contract before schema freeze
- Align with Frontend Engineer on search/filter/sort fields needed by UI
- Align with Product Manager on deferred schema boundaries and future expansion
