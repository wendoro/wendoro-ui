# Accessibility & Security Architecture

## Accessibility Standards (WCAG 2.2 AA Target)

- **Keyboard-First Interactions**: Interactive controls (`Tabs`, `Dialog`, `Drawer`, `DropdownMenu`, `MegaMenu`, `DataTable`, `KanbanBoard`, `TreeView`, `CalendarGrid`, `ResizablePanel`, `Wizard`) provide keyboard navigation, Escape dismissal, and visible focus rings (`--wdr-ring`).
- **Non-Color Indicators**: Status badges combine explicit labels and icons; charts pair colors with SVG fill patterns, dash arrays, and point markers plus semantic HTML data tables.
- **Reduced Motion**: Transitions and animations automatically honor `@media (prefers-reduced-motion: reduce)`.
- **Verification Scope Notice**: Automated Vitest + Testing Library + ESLint checks verify DOM semantics, ARIA attributes, focus handlers, and keyboard state changes in JSDOM. Manual verification with live browsers (desktop/mobile viewports 320px–1440px) and assistive technologies (NVDA, VoiceOver, JAWS) remains required before production certification.

## Security Hardening

- **URL & Image Sanitization (`src/utils/url.ts`)**: `sanitizeUrl` allows only safe `http:`, `https:`, `mailto:`, `tel:`, `/...`, or `#...` URLs (blocking `javascript:`, `vbscript:`, `data:text/html`, and protocol-relative redirects). `sanitizeImageUrl` additionally blocks `data:image/svg+xml` payloads. Applied across `Breadcrumb`, `NavigationMenu`, `MegaMenu`, `UserProfile`, and `Avatar`.
- **No Raw HTML Injection**: Components avoid `dangerouslySetInnerHTML`, `eval`, or unsafe style interpolation. Strings passed to cells, tooltips, banners, and labels render strictly as React text nodes.
- **No Global Mutation in Preview**: `ThemeProvider` handles storage errors and SSR (`typeof window === 'undefined'`) safely; Storybook enforces `disableStorage` and `scoped` providers.

## Dependency Advisory Status

- **Runtime Dependencies (`npm audit --omit=dev`)**: **0 vulnerabilities** (`lucide-react` is the sole runtime dependency).
- **Development Tooling (`npm audit` / `bun audit`)**: Known upstream advisories remain inside pre-existing dev tooling (`vitest@2.1.9`, `vite@6.4.6`, and `@storybook/*@8.5.8` transitive packages), which require semver-major upgrades (`vitest@5.x` / Storybook major update). They are not masked or suppressed in audit reports and must be evaluated on a dedicated tooling upgrade branch.
