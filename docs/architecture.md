# Package Architecture & Consumer Compatibility

## Modular Entry Points

`@wendoro/ui` partitions exports into focused entry points built as both ESM (`.js`), CommonJS (`.cjs`), and alias-free TypeScript declarations (`.d.ts`):

1. **`@wendoro/ui`** (`src/index.ts` -> `dist/lib/wendoro-ui.{js,cjs}`): Core primitives, forms 2.0, mobile touch-first primitives, UX patterns, feedback, overlays, navigation, and business modules (chart-free).
2. **`@wendoro/ui/styles.css`** (`dist/lib/styles.css`): Self-contained compiled CSS bundle containing Tailwind utilities, Light/Dark `--wdr-*` semantic variables, High-Contrast overrides, density rules, chart colors, and `prefers-reduced-motion` safeguards.
3. **`@wendoro/ui/themes/light.css`, `dark.css`, & `high-contrast.css`**: Standalone semantic theme and accessibility contrast files for custom CSS pipelines.
4. **`@wendoro/ui/tokens`** (`src/tokens/index.ts`): Zero-React programmatic TypeScript/JS tokens for colors, chart palette, typography, spacing, density, elevation, motion, breakpoints, touch targets, and `createThemeCssVariables()`.
5. **`@wendoro/ui/charts`** (`src/components/charts/index.ts`): 18 standard SVG charts + shared accessible chart container, legend, tooltip, annotations, thresholds, patterns, `Intl` formatters, and `ExternalChart` / `ChartAdapterProvider`.
6. **`@wendoro/ui/charts/advanced`** (`src/components/charts/advanced/index.ts`): 13 specialized analytical visualizations (including `GeoRegionChart`) loaded only when imported.
7. **`@wendoro/ui/business`** (`src/components/business/index.ts`): Enterprise analytics, `AdaptiveWorkspaceLayout`, advanced `DataTable`, `DataComparisonTable`, `WorkflowBuilder`, `GanttChart`, `ResourceAllocationBoard`, `ApprovalQueue`, `CommentThread`, Kanban, timelines, calendar grid, hierarchy, and 8 multi-industry workspace patterns.
8. **`@wendoro/ui/hooks`** (`src/hooks/index.ts`): `ThemeProvider`/`useTheme` (with contrast & custom brand overrides), `DensityProvider`/`useDensity`, `useReducedMotion`, `useBreakpoint`, `useKeyboardShortcuts`, `useUndoAction`, `useId`.

## Dependency & Tree-Shaking Design

- **Zero Chart-Engine Runtime Overhead**: Rather than introducing heavyweight third-party visualization runtimes directly into core dependencies, `@wendoro/ui/charts` and `@wendoro/ui/charts/advanced` are built in pure modular React + SVG + TypeScript. Optional external engines plug into `ChartAdapterProvider` + `ExternalChart` without increasing base bundle size.
- **Runtime Dependencies**: Only `lucide-react` is required alongside `react` and `react-dom` (`>=18.0.0 <20.0.0`).
- **Build-Time Isolation**: `vite.lib.config.ts` bundles each entry separately; importing `@wendoro/ui` or `@wendoro/ui/business` loads zero chart chunks (industry patterns accept charts via `chartSlot?: React.ReactNode`).

## Presentation-Only Boundaries

Product applications must compose `@wendoro/ui` with external data/API layers cleanly. UI components must never initialize database connections, Firebase clients, SDK clients, store access tokens, or implement tenant authorization logic.
