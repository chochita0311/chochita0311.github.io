# Board-Post ERD

This ERD focuses on a post-based model with one active left-tab board (`My Notes`) and future expansion.

## Subject Areas
- Board/Post Domain
- Search Domain
- Ingestion/Operations Domain

## ERD (Conceptual)
```mermaid
erDiagram
    mst_board ||--o{ mst_post : contains
    mst_post ||--o{ idx_fts_post : indexed_as
    log_sync_run ||--o{ mst_post : upserts

    mst_board {
      int board_id PK
      string display_name
      int sort_order
      string record_status
      string reg_id
      datetime reg_dt
      string upd_id
      datetime upd_dt
    }

    mst_post {
      int post_id PK
      int board_id FK
      string title
      text body_md
      string post_status
      string source_origin
      string source_folder
      string source_path UK_NULLABLE
      string checksum
      long source_mtime
      datetime published_at
      string reg_id
      datetime reg_dt
      string upd_id
      datetime upd_dt
    }

    idx_fts_post {
      int post_id PK_FK
      text title
      text body_md
    }

    log_sync_run {
      int sync_run_id PK
      datetime started_at
      datetime finished_at
      string status
      int scanned_count
      int inserted_count
      int updated_count
      int skipped_count
      int error_count
      text error_summary
    }
```

## Current Implementation Boundary
- Implement baseline:
  - `mst_board`
  - `mst_post`
  - `idx_fts_post` (or equivalent search index)
  - `log_sync_run` (temporary operational table)
- Defer to next expansion:
  - `mst_hashtag`, `map_post_hashtag`
  - `mst_post_reply`
  - keep member/admin/comment moderation out of next step unless re-scoped
