# Tokens, Themes, Density & Responsive System

## Brand & Semantic Colors

- **Brand Palette (`brandColors`)**: Primary Yellow (`#FACC15`), Primary Red (`#DC2626`), Deep Black (`#111111`), Crisp White (`#FFFFFF`), Warm White (`#FAFAF7`), Charcoal (`#242424`), Border Gray (`#E5E5E5`), and Muted Gray (`#737373`). Blue, purple, indigo, and teal are prohibited across brand UI and charts.
- **Chart Palette (`chartPaletteTokens` / `--wdr-chart-1`..`8`)**: High-contrast light/dark series tokens derived from charcoal/black, gold/amber, crimson red, forest green, warm slate, and muted gray.

## Typography, Spacing & Density

- **Type Scale (`typographyScale`)**: Includes `pageTitle`, `sectionTitle`, `cardTitle`, `body`, `bodySmall`, `caption`, `numeric`, `metric`, and `mono`. Tabular numbers (`font-variant-numeric: tabular-nums`) are enforced on KPI cards, metrics, and table cells.
- **Spatial Density (`DensityProvider` / `densityScales`)**:
  - `compact`: `32px` control height, `36px` table rows, `16px` card padding (`[data-density="compact"]`).
  - `comfortable` (default): `40px` control height, `44px` table rows, `20px` card padding.
  - `spacious`: `44px` control height, `52px` table rows, `24px` card padding.

## Elevation, Motion & Breakpoints

- **Elevation (`elevationTokens` & `zIndexTokens`)**: Single-elevation surfaces bounded by `1px` borders plus semantic dialog, dropdown, popover, toast (`60`), and tooltip (`70`) stacking layers.
- **Motion (`motionDurations`, `motionEasings`, `motionTokens`)**: Reduced-motion CSS rules honor `@media (prefers-reduced-motion: reduce)` and expose `useReducedMotion()` in React. No interactive workflow depends on transition timing completion.
- **Responsive Breakpoints (`breakpoints` & `useBreakpoint()`)**: Standardized at `320px` (`xs`), `375px` (`mobile`), `768px` (`tablet`), `1024px` (`laptop`), `1280px` (`desktop`), and `1440px` (`wide`).
