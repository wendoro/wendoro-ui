# Security Summary

During the `@wendoro/ui` audit and hardening pass, every library component, utility, theme stylesheet, build configuration, and dependency graph was reviewed for security, accessibility, and supply-chain issues:

1. **Untrusted URL & Image URI Rendering (`Breadcrumb`, `NavigationMenu`, `UserProfile`, `Avatar`)** — Resolved
   - **Risk**: `Breadcrumb`, `NavigationMenu`, `UserProfile`, and `Avatar` passed caller-provided `href` and `src` strings straight into `<a>` and `<img>` elements without protocol validation, permitting script-execution schemes (`javascript:`, `vbscript:`, control-character-obfuscated schemes) or script-capable SVG data URIs (`data:image/svg+xml`).
   - **Fix**: Added `sanitizeUrl` and `sanitizeImageUrl` in `src/utils/url.ts`, updated all link/image-rendering components to sanitize URLs before rendering, fell back to semantic `<button type="button">` elements (or omitted contact links / rendered initials) when URLs are absent or rejected, and ensured `Avatar` resets `imgError` cleanly when `src` updates.

2. **Supply-Chain & Dependency Hygiene (`.github/workflows/ci.yml`, `package-lock.json`, `bun.lock`)** — Resolved / Partially Tracked
   - **Fix**: Added a repository-local CI workflow pinned to immutable third-party GitHub Action commit SHAs with least-privilege `permissions: contents: read`, frozen lockfile enforcement (`bun install --frozen-lockfile` and `npm ci`), runtime secret/unsafe-sink scanning, and runtime/full dependency audits.
   - **Remaining Dev-Dependency Advisories**: `npm audit --omit=dev` reports **0** vulnerabilities in shipped runtime dependencies (`lucide-react`), while full `npm audit` reports 13 transitive advisories inside `devDependencies` (`vitest@2.1.x` -> `tinypool`/`esbuild`/`vite-node`, `@storybook/*@8.5.x` -> `glob`/`minimatch`/`uuid`) that require coordinated major tooling upgrades.

3. **Dark-Theme Contrast & Notification Lifecycle (`src/themes/dark.css`, `Toast.tsx`, `Alert.tsx`)** — Resolved
   - **Fix**: Updated `--wdr-destructive-hover` in `src/themes/dark.css` from `#EF4444` to `#B91C1C` so paired `#FFFFFF` text meets WCAG 2.2 AA (>= 4.5:1), removed contrast-degrading `opacity-90` on destructive `ToastCard` descriptions, and tracked/cleared `ToastProvider` timeout handles on dismiss, eviction, and unmount.

4. **Demo Data Integrity (`src/data/wendoro-demo-data.ts`, stories, showcase, tests)** — Resolved
   - **Fix**: Replaced fabricated personal names, emails, settlement amounts, batch IDs, and prod-like identifiers with explicitly labeled synthetic demo records (`Demo Lead`, `Sample Member A/B/C`, `@demo.invalid`, `Sample Record #01`).

## PoC Verification

All fixes were verified with automated Vitest + React Testing Library test cases inside `tests/security-and-a11y.test.tsx`, `tests/tokens-and-theme.test.tsx`, `tests/core-components.test.tsx`, `tests/overlays-and-navigation.test.tsx`, and `tests/business-components.test.tsx`:

- **URL & Image Scheme Neutralization (`tests/security-and-a11y.test.tsx`)**:
  - `sanitizeUrl('javascript:alert(1)')`, `sanitizeUrl('java\nscript:alert(1)')`, `sanitizeUrl('vbscript:msgbox(1)')`, `sanitizeUrl('data:text/html,<script>alert(1)</script>')`, and `sanitizeUrl('//untrusted.example/redirect')` all return `undefined`.
  - `sanitizeImageUrl('data:image/svg+xml;base64,PHN2Zz4=')` returns `undefined`, while safe raster base64 (`data:image/png;base64,...`), `https:`, `blob:`, and relative paths pass.
  - Rendering `<Breadcrumb>`, `<NavigationMenu>`, `<UserProfile>`, and `<Avatar>` with `javascript:` or `data:image/svg+xml` payloads renders inert `<button>` elements (without `href`), omits unsafe contact links, and falls back to initials instead of an `<img>`.
- **Toast Timer Leak & Storage Failure Resilience (`tests/overlays-and-navigation.test.tsx`, `tests/tokens-and-theme.test.tsx`)**:
  - Verified `window.clearTimeout` cancels scheduled toast timers on dismiss and provider unmount.
  - Verified `ThemeProvider` handles `localStorage` `getItem`/`setItem` exceptions, legacy `MediaQueryList.addListener`, `scoped` isolation, and server-side `renderToString` without crashing.
