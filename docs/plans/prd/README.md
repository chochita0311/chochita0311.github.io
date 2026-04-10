# PRD Plans

## Purpose
- Store bounded product requirement documents that act as the upper planning boundary for harness work.
- Keep source-normalized scope, exclusions, and acceptance envelope in one place before feature decomposition begins.

## What Belongs Here
- approved or draft PRD documents such as `prd-0001-login-foundation.md`
- PRD-level continuity updates that change upper scope boundaries

## What Does Not Belong Here
- per-feature loop plans
- evaluator reports
- implementation notes
- durable project policy that should live under `docs/policies/`

## Required Links
- A PRD should link to its golden sources or list them clearly in a source set.
- A PRD should list candidate features that may later become documents under `docs/plans/feature/`.

## Status Guidance
- Start new PRDs as `draft`.
- Move a PRD to `approved` before feature planning relies on it.
- Use `superseded` instead of deleting a PRD that has already been referenced.

## Template
- Use `docs/plans/prd/template-prd.md` when creating a new PRD.
- Use `docs/policies/project/prd-feature-management.md` for the governing rule on PRD ownership, status, and traceability.
