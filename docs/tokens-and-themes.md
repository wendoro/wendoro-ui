# Tokens, Themes, High-Contrast, Density & Responsive System

## Brand, Contrast & Multi-Tenant Overrides

- **Brand Palette (`brandColors`)**: Primary Yellow (`#FACC15`), Primary Red (`#DC2626`), Deep Black (`#111111`), Crisp White (`#FFFFFF`), Warm White (`#FAFAF7`), Charcoal (`#242424`), Border Gray (`#E5E5E5`), and Muted Gray (`#737373`). Blue, purple, indigo, and teal are excluded from the default Wendoro brand identity.
- **High-Contrast Mode (`src/themes/high-contrast.css`)**: Activated via `<ThemeProvider defaultContrast="high">` (`[data-contrast="high"]` or `.high-contrast`) in both Light (`#FFFFFF` / `#000000`) and Dark (`#000000` / `#FFFFFF` + `#FACC15` focus rings) themes.
- **Scoped Brand Overrides (`createThemeCssVariables`)**: Multi-tenant SaaS, white-label portals, and agencies can pass `BrandThemeOverrides` to `<ThemeProvider customTheme={...} scoped>` to override `--wdr-primary`, `--wdr-surface`, `--wdr-border`, `--wdr-radius-*`, or `--wdr-chart-1..4` locally without mutating global styles.
- **Touch Target Tokens (`touchTargetTokens`)**: Enforces `44px` minimum (`48px` comfortable) interactive target sizing on mobile navigation and touch controls.

## Typography, Spacing & Density

- **Type Scale (`typographyScale`)**: Includes `pageTitle`, `sectionTitle`, `cardTitle`, `body`, `bodySmall`, `caption`, `numeric`, `metric`, and `mono`. Tabular numbers (`font-variant-numeric: tabular-nums`) are enforced on KPI cards, metrics, Gantt timelines, and table cells.
- **Spatial Density (`DensityProvider` / `densityScales`)**:
  - `compact`: `32px` control height, `36px` table rows, `16px` card padding (`[data-density="compact"]`).
  - `comfortable` (default): `40px` control height, `44px` table rows, `20px` card padding.
  - `spacious`: `44px` control height, `52px` table rows, `24px` card padding.

## Elevation, Motion & Responsive Breakpoints

- **Elevation (`elevationTokens`, `borderTokens`, `focusRingTokens`, `zIndexTokens`)**: Crisp `1px` borders, semantic focus rings, and deterministic z-index layers (`bottomNav: 35`, `sheet: 55`, `toast: 60`, `tooltip: 70`, `tour: 75`).
- **Motion (`motionDurations`, `motionEasings`, `motionTokens`)**: Reduced-motion CSS rules honor `@media (prefers-reduced-motion: reduce)` and expose `useReducedMotion()` in React.
- **Responsive Breakpoints (`breakpoints`, `useBreakpoint()`, `resolveDeviceCategory()`)**: Standardized at `320px` (`xs`), `375px` (`mobile`), `430px` (`largeMobile`), `768px` (`tablet`), `1024px` (`laptop`), `1280px` (`desktop`), `1440px` (`wide`), and `1920px` (`ultraWide`), grouping viewports into `'mobile' | 'tablet' | 'desktop'`.
