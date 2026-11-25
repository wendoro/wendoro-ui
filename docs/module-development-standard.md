# Wendoro UI — Future Module Development Standard

Every future module, industry pack, or domain-specific studio integrating into `@wendoro/ui` or extending it externally must conform to these 12 engineering requirements so new capabilities automatically look, behave, and scale as part of one coherent platform.

## 1. Visual Conventions
- Use Wendoro visual hierarchy: crisp 1px borders (`--wdr-border`), purposeful elevation (`--wdr-shadow-sm|md|lg`), clean card radii (`--wdr-radius-md|lg`), and `tabular-nums` for all counters, metrics, timestamps, and progress indicators.
- Avoid excessive gradients, decorative clutter, or unrequested purple/blue/indigo/teal brand accents.

## 2. Token Compatibility
- Never hardcode hex values in component styles. Consume semantic CSS variables (`bg-surface`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, etc.) or `@wendoro/ui/tokens`.

## 3. Theme & White-Label Customization
- Support runtime `<ThemeProvider customTheme={...}>` and `createThemeCssVariables()` overrides without leaking styles globally when `scoped` is true.

## 4. Light, Dark & High-Contrast Support
- All surfaces, text, badges, SVG strokes, and focus indicators must remain legible across:
  - Light mode (`[data-theme="light"]`)
  - Dark mode (`[data-theme="dark"]` / `.dark`)
  - High-Contrast Light & Dark (`[data-contrast="high"]` / `.high-contrast`)

## 5. Responsive Mobile, Tablet & Desktop Layouts
- Design intentionally for `320px–430px` (touch-first mobile, 44px+ targets, stacked/sheet controls), `768px` (tablet rails/collapsible split panes), and `1024px–1920px+` (multi-panel desktop workspaces, keyboard shortcuts, dense tables).
- Never use horizontal-scroll-only traps for primary navigation or actions.

## 6. Accessibility Requirements (WCAG 2.2 AA)
- Provide full keyboard operation (`Tab`, `Enter`, `Space`, `Escape`, and Arrow navigation for composite controls such as radiogroups, tabs, menus, and floating windows).
- Pair status colors with text labels or icons; include `aria-live="polite"` for dynamic status updates (`AutosaveIndicator`, `ConnectionStatusBanner`, `MultiStepProgress`) and focus management in modal dialogs/sheets.
- Honor `prefers-reduced-motion: reduce`.

## 7. Consistent Interaction Patterns & Security
- Follow Wendoro controlled/uncontrolled prop conventions (`value` + `defaultValue` + `onValueChange`; `open` + `onOpenChange`).
- Sanitize all consumer-provided URLs via `sanitizeUrl()` and avoid `dangerouslySetInnerHTML`.
- Keep all modules strictly presentational and backend-agnostic (zero direct DB, auth, OS-exec, or API SDK calls).

## 8. TypeScript Standards
- Compile cleanly under strict TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`) with zero `@/` path aliases emitted in consumer `.d.ts` files.
- Export explicit Props interfaces alongside components.

## 9. Export Conventions & Hybrid Architecture
- Core primitives belong in `@wendoro/ui` (`src/components/ui/*`).
- Composite business/workspace/installer modules belong in `@wendoro/ui/business` (`src/components/business/*`) and **must never import `src/components/charts/*`** (accept visualizations via slots/render props).
- Native visualizations belong in `@wendoro/ui/charts` or `@wendoro/ui/charts/advanced`; heavy external engines must integrate only via `ChartAdapterProvider` / `ExternalChart` or optional peer packages.
- Declare compatibility with `WendoroModuleManifest` (`WENDORO_MODULE_CONTRACT_VERSION = '2.0.0'`).

## 10. Testing Standards
- Ship Vitest + `@testing-library/react` unit tests verifying interactive state changes, keyboard navigation, XSS/URL safety, and responsive switching across `320px–1920px` viewports.
- Include representative usage in `tests/integration/consumer-fixture/ConsumerApp.tsx`.

## 11. Storybook Documentation
- Every exported component family must have Storybook 8 (`@storybook/react`) stories with `tags: ['autodocs']`, interactive examples, and exclusively synthetic demo data (`Demo User`, `Sample Organization`, `demo@example.invalid`).

## 12. Dependency & Bundle-Size Review
- Core runtime dependencies are strictly gated (`lucide-react` + React peers). Any proposed third-party dependency requires license review, tree-shaking verification via `npm run test:integration`, and tarball inspection via `npm pack --dry-run`.
