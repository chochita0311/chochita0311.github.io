# Feature Plans

## Purpose
- Store loop-sized feature documents derived from approved PRDs.
- Give harness runs a stable execution target with explicit scope, dependencies, and pass or fail checks.

## What Belongs Here
- approved or draft feature documents such as `feat-0001-login-entry-view.md`
- feature-level continuity notes and explicit status changes

## What Does Not Belong Here
- upper-boundary PRD decisions
- durable repo policy
- broad roadmap planning not tied to a loop-sized target

## Required Links
- Every feature must reference one parent PRD by ID and path.
- Every feature should name any prerequisite features it depends on.
- Harness runs, evaluator outputs, and fix work should cite the active feature ID.

## Status Guidance
- Start feature docs as `draft` or `approved` after planner review.
- Move a feature to `in-loop` when execution begins.
- Use `passed` only when the feature checks and regression expectations are satisfied.
- Use `superseded` when a feature is split or replaced.

## Template
- Use `docs/plans/feature/template-feature.md` when creating a new feature plan.
- Use `docs/policies/project/prd-feature-management.md` for the governing rule on parent linkage, status, and harness traceability.
