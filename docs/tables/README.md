# Tables By Subject Area

This directory organizes database design documents by subject area.

## Global Standard
- `docs/tables/standards.md` is the central rule file for table naming and column conventions.
- Subject-area files should reference this standard and only define domain-specific exceptions.

## Subject Areas
- `board-post/`: board and post domain
- `member-admin-user/`: member/admin/user domain (future)
- `schedule-management/`: class schedule and reservation domain (future)

## Current Core Reference
Use documents in `board-post/`:
- `docs/tables/board-post/mvp-ddl.md`
- `docs/tables/board-post/subject-areas-erd.md`

## Naming Rule
- Keep each subject area self-contained.
- Add DDL, ERD, and migration notes inside the same subject folder.
- Use additive changes so future domains can be introduced without restructuring existing folders.
