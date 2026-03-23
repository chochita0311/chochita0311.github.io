# Board-Post DDL

This draft treats data as website posts first. It supports file-imported notes today and API-created posts later.

## Scope
- Included now: post board (`My Notes`), post list/detail/search, source sync metadata.
- Excluded now: comment/reply/member/admin.

## Global Rule Reference
- Apply naming and column standards from `docs/tables/standards.md`.
- This document only describes board-post domain specifics.

## Table 1: `mst_board`
| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `board_id` | INTEGER | PRIMARY KEY | 보드 고유 ID |
| `display_name` | TEXT | NOT NULL | 사용자에게 노출되는 보드 이름 |
| `sort_order` | INTEGER | NOT NULL DEFAULT 100 | 좌측 내비게이션 정렬 순서 |
| `record_status` | TEXT | NOT NULL DEFAULT `'ACTIVE'` | 레코드 상태 (`ACTIVE`, `INACTIVE`, `DELETED`) |
| `reg_id` | TEXT | NOT NULL | 생성자 식별자 |
| `reg_dt` | TEXT | NOT NULL | 생성 일시 (UTC ISO-8601) |
| `upd_id` | TEXT | NOT NULL | 최종 수정자 식별자 |
| `upd_dt` | TEXT | NOT NULL | 최종 수정 일시 (UTC ISO-8601) |

## Table 2: `mst_post`
| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `post_id` | INTEGER | PRIMARY KEY | 게시글 고유 ID |
| `board_id` | INTEGER | NOT NULL, FK -> `mst_board.board_id` | 소속 보드 ID |
| `title` | TEXT | NOT NULL | 게시글 제목 |
| `body_md` | TEXT | NOT NULL | 본문 원문 (Markdown/텍스트) |
| `post_status` | TEXT | NOT NULL DEFAULT `'published'` | 게시 상태 (`draft`, `published`, `archived`, `deleted`) |
| `source_origin` | TEXT | NOT NULL | 데이터 출처 (`imported_file`, `api_created`) |
| `source_folder` | TEXT | NULL | 파일 가져오기 시 원본 폴더 |
| `source_path` | TEXT | NULL, UNIQUE | 파일 가져오기 시 원본 상대 경로 |
| `checksum` | TEXT | NULL | 증분 동기화를 위한 본문 체크섬 |
| `source_mtime` | INTEGER | NULL | 원본 파일 수정 시각 (epoch ms) |
| `published_at` | TEXT | NOT NULL | 게시 일시 (UTC ISO-8601) |
| `reg_id` | TEXT | NOT NULL | 생성자 식별자 |
| `reg_dt` | TEXT | NOT NULL | 생성 일시 (UTC ISO-8601) |
| `upd_id` | TEXT | NOT NULL | 최종 수정자 식별자 |
| `upd_dt` | TEXT | NOT NULL | 최종 수정 일시 (UTC ISO-8601) |

Indexes:
- `idx_posts_board_published` on (`board_id`, `published_at` DESC)
- `idx_posts_status_upd` on (`post_status`, `upd_dt` DESC)
- `idx_posts_origin` on (`source_origin`)

## Table 3: `idx_fts_post` (FTS5)
| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `post_id` | INTEGER | rowid link | 원본 게시글 키 (`mst_post.post_id`) |
| `title` | TEXT | indexed | 전문 검색 대상 제목 |
| `body_md` | TEXT | indexed | 전문 검색 대상 본문 |

FTS settings:
- engine: `FTS5`
- content table: `mst_post`
- rowid link: `post_id`

## Table 4: `log_sync_run`
| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `sync_run_id` | INTEGER | PRIMARY KEY | 동기화 실행 ID |
| `started_at` | TEXT | NOT NULL | 동기화 시작 일시 |
| `finished_at` | TEXT | NULL | 동기화 종료 일시 |
| `status` | TEXT | NOT NULL | 실행 상태 (`running`, `success`, `failed`, `partial`) |
| `scanned_count` | INTEGER | NOT NULL DEFAULT 0 | 스캔한 파일 수 |
| `inserted_count` | INTEGER | NOT NULL DEFAULT 0 | 신규 입력 건수 |
| `updated_count` | INTEGER | NOT NULL DEFAULT 0 | 수정 건수 |
| `skipped_count` | INTEGER | NOT NULL DEFAULT 0 | 변경 없음 건수 |
| `error_count` | INTEGER | NOT NULL DEFAULT 0 | 오류 건수 |
| `error_summary` | TEXT | NULL | 오류 요약 |

Purpose:
- Track each import/sync execution from source files to DB.
- Provide observability for operations (success/failure, inserted/updated/skipped counts).
- Support debugging and retry planning for failed sync runs.
- Lifecycle: treat as temporary operations table; remove or replace when project evolves to mature ingestion/observability stack.

## SQL Skeleton
```sql
-- 테이블: 보드 마스터
CREATE TABLE IF NOT EXISTS mst_board (
  -- 보드 고유 ID (PK)
  board_id INTEGER PRIMARY KEY,
  -- 화면 표시명
  display_name TEXT NOT NULL,
  -- 좌측 메뉴 정렬 순서
  sort_order INTEGER NOT NULL DEFAULT 100,
  -- 레코드 상태 (soft delete 포함)
  record_status TEXT NOT NULL DEFAULT 'ACTIVE',
  -- 생성자/생성일시
  reg_id TEXT NOT NULL,
  reg_dt TEXT NOT NULL,
  -- 수정자/수정일시
  upd_id TEXT NOT NULL,
  upd_dt TEXT NOT NULL
);

-- 테이블: 게시글 마스터
CREATE TABLE IF NOT EXISTS mst_post (
  -- 게시글 고유 ID (PK)
  post_id INTEGER PRIMARY KEY,
  -- 소속 보드 ID (FK)
  board_id INTEGER NOT NULL REFERENCES mst_board(board_id),
  -- 제목/본문
  title TEXT NOT NULL,
  body_md TEXT NOT NULL,
  -- 게시 상태
  post_status TEXT NOT NULL DEFAULT 'published',
  -- 생성 출처 (파일 가져오기/API 생성)
  source_origin TEXT NOT NULL,
  -- 파일 가져오기 메타데이터
  source_folder TEXT,
  source_path TEXT UNIQUE,
  checksum TEXT,
  source_mtime INTEGER,
  -- 게시 일시
  published_at TEXT NOT NULL,
  -- 생성자/생성일시
  reg_id TEXT NOT NULL,
  reg_dt TEXT NOT NULL,
  -- 수정자/수정일시
  upd_id TEXT NOT NULL,
  upd_dt TEXT NOT NULL
);

-- 목록 조회(보드별 최신순) 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_board_published
ON mst_post(board_id, published_at DESC);

-- 상태 + 수정일시 조회 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_status_upd
ON mst_post(post_status, upd_dt DESC);

-- 출처 기반 동기화/필터 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_posts_origin
ON mst_post(source_origin);

-- 게시글 전문 검색 인덱스(FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS idx_fts_post USING fts5(
  title,
  body_md,
  content='mst_post',
  content_rowid='post_id'
);

-- 테이블: 동기화 실행 로그 (임시 운영용)
CREATE TABLE IF NOT EXISTS log_sync_run (
  -- 실행 고유 ID (PK)
  sync_run_id INTEGER PRIMARY KEY,
  -- 실행 시간
  started_at TEXT NOT NULL,
  finished_at TEXT,
  -- 실행 결과 상태
  status TEXT NOT NULL,
  -- 처리 건수 집계
  scanned_count INTEGER NOT NULL DEFAULT 0,
  inserted_count INTEGER NOT NULL DEFAULT 0,
  updated_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  -- 오류 집계
  error_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT
);
```

## Next Expansion Priority
- Add hashtag model:
  - `mst_hashtag`
  - `map_post_hashtag`
- Add reply model:
  - `mst_post_reply` (self-reference for nested reply depth if needed)
- Keep ownership/permission and revision history outside this next step unless explicitly requested.
