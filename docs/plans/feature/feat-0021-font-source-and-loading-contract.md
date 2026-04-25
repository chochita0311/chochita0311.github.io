# FEAT-0021: Font Source And Loading Contract

## Metadata

- ID: `feat-0021`
- Status: `passed`
- Type: `foundation`
- Surface: `docs`
- Execution Profile: `foundation-contract`
- Required Evaluators: `contract`, `functional`, `design`
- Parent PRD: [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- Created: `2026-04-25`
- Updated: `2026-04-25`

## Goal

- Foundation feature:
  - define the approved font source, asset, fallback, and loading contract for `Inter`, `Noto Sans KR`, and self-hosted `Satoshi` before runtime typography is applied.

## Acceptance Contract

- Google Fonts usage for `Inter` and `Noto Sans KR` is documented with the exact weight range needed by the approved typography roles.
- Self-hosted `Satoshi` requirements are documented, including accepted file format, expected path, allowed weights, and source/license evidence requirement.
- The project has a clear rule that `Satoshi` must not be committed without verified public GitHub Pages hosting rights.
- Font loading behavior uses a no-blocking strategy such as `font-display: swap`.
- Fallback stacks are defined for UI/body, Korean text, display/title, and monospace/code text.
- Downstream implementation can add or wire fonts without guessing source, weight, or fallback ownership.

## Scope Boundary

- In:
  - font-source contract
  - approved weights and fallback stacks
  - self-hosted `Satoshi` asset path and license-record expectations
  - loading behavior expectations for GitHub Pages
  - documentation needed for future implementation
- Out:
  - broad font subsetting or build-pipeline creation
  - applying new fonts to runtime surfaces
  - committing unverified font files
  - changing unrelated CSS layout or component styles

## Contract Surfaces

- Font source URLs for `Inter` and `Noto Sans KR`
- Self-hosted `Satoshi` asset path and license note location
- [assets/css/tokens.css](../../../assets/css/tokens.css)
- HTML font-loading entries in [index.html](../../../index.html), [archive/index.html](../../../archive/index.html), and [archive/note/index.html](../../../archive/note/index.html)

## User-Visible Outcome

- None directly. This feature fixes the implementation contract that later typography application must use.

## Entry And Exit

- Entry point:
  - `feat-0020` has aligned design policy or the typography role contract is otherwise approved.
- Exit or transition behavior:
  - runtime font wiring can proceed with approved sources, weights, asset paths, and fallbacks.

## State Expectations

- Default:
  - font sources and fallbacks are deterministic.
- Loading:
  - font loading must not block readable text or create misleading route states.
- Empty:
  - not applicable.
- Error:
  - if a web font fails, fallback text remains readable and layout remains stable.
- Success:
  - downstream specs can wire fonts without unresolved licensing or source questions.

## Dependencies

- Approved parent PRD [prd-0009-public-surface-typography-and-navigation-polish.md](../prd/prd-0009-public-surface-typography-and-navigation-polish.md)
- `feat-0020-typography-token-and-policy-alignment`

## Likely Affected Surfaces

- [docs/policies/design/design-constitution.md](../../policies/design/design-constitution.md)
- [assets/css/tokens.css](../../../assets/css/tokens.css)
- [index.html](../../../index.html)
- [archive/index.html](../../../archive/index.html)
- [archive/note/index.html](../../../archive/note/index.html)
- future local font assets and license/source note

## Pass Or Fail Checks

- The accepted `Satoshi` asset requirement is explicit before any font file is committed.
- Only necessary font weights are included in the contract.
- Fallback stacks cover English, Korean, title/display, and monospace content.
- Loading behavior avoids render-blocking text and excessive layout shift.
- No heavy build pipeline is introduced only for fonts.

## Regression Surfaces

- Static GitHub Pages compatibility
- First render and route-entry stability
- Existing readable fallback behavior

## Harness Trace

- Active spec doc:
- Active run:
- Latest evaluator report:
- Latest fix note:

## Continuity Notes

- `2026-04-25`: initial draft created from approved PRD-0009.
- `2026-04-25`: approved by the human owner for downstream spec planning.
- `2026-04-25`: passed after Google font loading was defined for `Inter` and `Noto Sans KR`, and `assets/fonts/README.md` documented the self-hosted `Satoshi` asset contract and fallback rule.
- `2026-04-25`: official Fontshare `Satoshi_Complete.zip` was downloaded, and `Satoshi-Regular.woff2`, `Satoshi-Bold.woff2`, and `FFL.txt` were added under `assets/fonts/`.
