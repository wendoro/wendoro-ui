# Package Architecture & Consumer Compatibility

## Modular Entry Points

`@wendoro/ui` partitions exports into focused entry points built as both ESM (`.js`), CommonJS (`.cjs`), and alias-free TypeScript declarations (`.d.ts`):

1. **`@wendoro/ui`** (`src/index.ts` -> `dist/lib/wendoro-ui.{js,cjs}`): Core primitives, forms, feedback, overlays, navigation, and foundational business components. Chart modules are strictly excluded from the main bundle.
2. **`@wendoro/ui/styles.css`** (`dist/lib/styles.css`): Self-contained compiled CSS bundle containing Tailwind utilities, Light/Dark `--wdr-*` semantic variables, density rules, chart colors, and `prefers-reduced-motion` safeguards. Consuming apps do not need Tailwind CSS installed.
3. **`@wendoro/ui/themes/light.css` & `dark.css`**: Standalone semantic theme token files for custom CSS pipelines.
4. **`@wendoro/ui/tokens`** (`src/tokens/index.ts`): Zero-React programmatic TypeScript/JS tokens for colors, chart palette, typography, spacing, density, elevation, motion, and breakpoints.
5. **`@wendoro/ui/charts`** (`src/components/charts/index.ts`): 18 standard SVG charts + shared accessible chart container, legend, tooltip, annotations, thresholds, patterns, and `Intl` formatters.
6. **`@wendoro/ui/charts/advanced`** (`src/components/charts/advanced/index.ts`): 12 specialized analytical visualizations loaded only when imported.
7. **`@wendoro/ui/business`** (`src/components/business/index.ts`): Enterprise analytics, dashboard shell, advanced `DataTable`, Kanban, timelines, calendar grid, workflow, and hierarchy components.
8. **`@wendoro/ui/hooks`** (`src/hooks/index.ts`): `ThemeProvider`/`useTheme`, `DensityProvider`/`useDensity`, `useReducedMotion`, `useBreakpoint`, `useId`.

## Dependency & Tree-Shaking Design

- **Zero Chart-Engine Runtime Overhead**: Rather than introducing heavyweight third-party visualization runtimes (such as Recharts, ECharts, or ESM-only D3 wrappers that break mixed ESM/CJS consumer builds), `@wendoro/ui/charts` and `@wendoro/ui/charts/advanced` are built in pure modular React + SVG + TypeScript.
- **Runtime Dependencies**: Only `lucide-react` is required alongside `react` and `react-dom` (`>=18.0.0 <20.0.0`).
- **Build-Time Isolation**: `vite.lib.config.ts` bundles each entry separately; importing `@wendoro/ui` loads zero chart chunks.

## Presentation-Only Boundaries

Product applications must compose `@wendoro/ui` with `@wendoro/sdk` externally. UI components must never initialize SDK clients, store access tokens, query PostgreSQL/Firebase directly, or implement authorization policies.
