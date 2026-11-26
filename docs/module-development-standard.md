# Wendoro UI — Future Module Development Standard & Template

Every future module, industry pack, or domain-specific studio integrating into `@wendoro/ui` or extending it externally must conform to these 12 engineering requirements and register its manifest so new capabilities automatically inherit the Wendoro design language.

## 1. Visual Conventions
- Use Wendoro visual hierarchy: crisp 1px borders (`--wdr-border`), purposeful elevation (`--wdr-shadow-sm|md|lg`), clean card radii (`--wdr-radius-md|lg`), and `tabular-nums` for all counters, metrics, timestamps, and progress indicators.
- Avoid excessive gradients, decorative clutter, or blue/purple/indigo/teal/cyan/violet brand overrides.

## 2. Token Compatibility & Registration
- Consume semantic CSS variables (`bg-surface`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`) or `@wendoro/ui/tokens`.
- Additional module-level design tokens may be registered dynamically via `registerDesignTokenSet(id, tokens)` from `@wendoro/ui/tokens`.

## 3. Theme Presets & White-Label Customization
- Support runtime `<ThemeProvider customTheme={...}>`, built-in presets (`registerThemePreset`, `applyPreset`), and `createThemeCssVariables()` overrides without leaking styles globally when `scoped` is true.

## 4. Light, Dark & High-Contrast Support
- All surfaces, text, badges, SVG strokes, and focus indicators must remain legible across:
  - Light mode (`[data-theme="light"]`)
  - Dark mode (`[data-theme="dark"]` / `.dark`)
  - High-Contrast Light & Dark (`[data-contrast="high"]` / `.high-contrast`)

## 5. Responsive Mobile, Tablet & Desktop Layouts
- Design intentionally across `320px`, `360px`, `375px`, `390px`, `430px` (mobile touch-first), `768px`, `820px` (tablet split/rail layouts), and `1024px`, `1280px`, `1440px`, `1920px` (multi-panel desktop workspaces).
- Support RTL layouts via `DirectionProvider` (`dir="rtl" | "ltr"`) and logical spacing/alignment.

## 6. Accessibility Requirements (WCAG 2.2 AA)
- Provide full keyboard operation (`Tab`, `Enter`, `Space`, `Escape`, Arrow navigation for menus, tabs, grids, sliders, and floating panels).
- Pair status colors with text labels or icons; include `aria-live="polite"` for dynamic status updates and accessible `<figcaption>` / `<table>` fallbacks for charts.
- Honor `prefers-reduced-motion: reduce`.

## 7. Security, URL Safety & Resource Cleanup
- Sanitize all consumer-provided URLs via `sanitizeUrl()` / `sanitizeImageUrl()`.
- Never use `dangerouslySetInnerHTML`, `eval`, or `new Function`.
- Clean up all timers (`setTimeout`/`setInterval`), listeners, and `ResizeObserver` instances on unmount.
- Keep all modules strictly presentational and backend-agnostic.

## 8. TypeScript Standards
- Compile cleanly under strict TypeScript (`strict`, `noUnusedLocals`, `noUnusedParameters`) with relative internal imports inside `src/components/**`, `src/tokens/**`, `src/hooks/**`, `src/utils/**`, and `src/subpaths/**` so zero `@/` path aliases appear in emitted `.d.ts` files.

## 9. Hybrid Modular Export & Bundle-Size Budgets
- Core primitives belong in `@wendoro/ui` and `@wendoro/ui/core`.
- Domain suites expose targeted subpaths: `@wendoro/ui/forms`, `@wendoro/ui/navigation`, `@wendoro/ui/data`, `@wendoro/ui/workspace`, `@wendoro/ui/commerce`, `@wendoro/ui/admin`, and `@wendoro/ui/industry`, alongside `@wendoro/ui/business` (all zero chart imports).
- Optional complex subsystems belong in `@wendoro/ui/ai`, `@wendoro/ui/editors`, `@wendoro/ui/editor`, `@wendoro/ui/charts`, or `@wendoro/ui/adapters`.
- Target gzip bundle budgets defined in `WENDORO_BUNDLE_BUDGETS`:
  - Core `@wendoro/ui`: <= 45 KB gzip
  - `@wendoro/ui/tokens`: <= 6 KB gzip
  - `@wendoro/ui/business`: <= 55 KB gzip
  - `@wendoro/ui/charts`: <= 25 KB gzip
  - `@wendoro/ui/ai`: <= 25 KB gzip
  - `@wendoro/ui/editors`: <= 25 KB gzip
  - `@wendoro/ui/adapters`: <= 18 KB gzip

## 10. Testing Standards
- Ship Vitest + `@testing-library/react` unit tests verifying interactions, keyboard navigation, RTL/i18n, timer cleanup, URL safety, and responsive switching across `320px–1920px`.
- Register consumer usage in `tests/integration/consumer-fixture/ConsumerApp.tsx` and distribution assertions in `tests/integration/package-distribution.test.tsx`.

## 11. Storybook Documentation & Synthetic Data
- Organize stories according to the 22 Wendoro UI taxonomy categories with `tags: ['autodocs']`, interactive examples, loading/empty/error states, and exclusively synthetic demo data (`Demo User`, `Sample Organization`, `demo@example.invalid`).

## 12. Standard Module Creation Template

```ts
import { registerWendoroExtension } from '@wendoro/ui/adapters';
import { WENDORO_MODULE_CONTRACT_VERSION } from '@wendoro/ui/business';

registerWendoroExtension({
  id: 'my-module',
  name: 'My Custom Module',
  subpath: '@wendoro/ui/adapters',
  contractVersion: WENDORO_MODULE_CONTRACT_VERSION,
  category: 'custom',
  maxGzipKb: 18,
});
```
