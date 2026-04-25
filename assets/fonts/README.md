# Font Assets

## Satoshi Self-Hosting Contract

- Approved display family: `Satoshi`.
- Source: official Fontshare family download, `https://api.fontshare.com/v2/fonts/download/satoshi`.
- Downloaded package: `Satoshi_Complete.zip` from Fontshare on `2026-04-25`.
- Included webfont format: `.woff2`.
- Included local paths:
  - `assets/fonts/Satoshi-Regular.woff2`
  - `assets/fonts/Satoshi-Bold.woff2`
- License evidence: `assets/fonts/FFL.txt`, extracted from the official Fontshare package.
- Deployment and commits must preserve the license file alongside the font files.
- Display roles use `Satoshi` through local `@font-face` rules in `assets/css/tokens.css`, with `Inter`, `Noto Sans KR`, and system sans-serif fallbacks.

## Google Fonts

- `Inter` owns Latin UI and body text.
- `Noto Sans KR` owns Korean fallback and mixed Korean text stability.
