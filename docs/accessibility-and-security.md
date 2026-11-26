# Accessibility & Security Architecture

## Accessibility Standards (WCAG 2.2 AA Target)

- **High-Contrast Mode & Touch Targets**: Dedicated Light and Dark high-contrast token sets (`[data-contrast="high"]` / `.high-contrast`) enforce crisp `#000000`/`#FFFFFF` luminance contrast and `3px` visible focus rings. Mobile touch controls target `44px–48px` minimum hit areas (`touchTargetTokens`).
- **Keyboard-First Interactions**: Interactive controls (`BottomSheet`, `SwipeActionItem`, `PullToRefresh`, `WorkflowBuilder`, `DataTable`, `KanbanBoard`, `GanttChart`, `RichTextEditor`, `ContextMenu`, `Dialog`, `Drawer`) expose keyboard fallbacks alongside pointer/touch gestures so no workflow relies exclusively on swipe or drag interactions.
- **Non-Color Indicators**: Status badges, `PriorityIndicator`, `WorkloadIndicator`, Gantt milestones, and charts combine explicit text labels, icons, SVG fill patterns, dash arrays, and geometric markers plus semantic HTML data tables.
- **Reduced Motion**: Transitions and animations automatically honor `@media (prefers-reduced-motion: reduce)` and `useReducedMotion()`.
- **Verification Scope Notice**: Automated Vitest + Testing Library + ESLint checks verify DOM semantics, ARIA attributes, keyboard state changes, and simulated viewport transitions in JSDOM (`320px`–`1920px`). Manual verification with live browsers and assistive technologies (NVDA, VoiceOver, JAWS) remains required before production accessibility certification.

## Security Hardening

- **URL & Image Sanitization (`src/utils/url.ts`)**: `sanitizeUrl` allows only safe `http:`, `https:`, `mailto:`, `tel:`, `/...`, or `#...` URLs (blocking `javascript:`, `vbscript:`, `data:text/html`, and protocol-relative redirects). `sanitizeImageUrl` additionally blocks `data:image/svg+xml` payloads. Applied across `Breadcrumb`, `NavigationMenu`, `MegaMenu`, `UserProfile`, `Avatar`, `RichTextEditor`, and `MarkdownEditor`.
- **No Raw HTML Injection**: Components avoid `dangerouslySetInnerHTML`, `eval`, or unsafe inline style injection. `RichTextEditor` and `MarkdownEditor` parse markdown preview tokens into safe React elements rather than raw HTML strings.
- **No Global Mutation in Preview**: `ThemeProvider` handles storage errors and SSR (`typeof window === 'undefined'`) safely and supports `disableStorage` + `scoped` overrides.

## Dependency Advisory Status

- **Lockfile & Advisory Audit (`bun audit`)**: `bun audit` reports **0 vulnerabilities** across 330 resolved packages (`lucide-react` is the sole runtime dependency). `npm audit` requires a `package-lock.json` lockfile (`ENOLOCK` under `bun.lock`-only installs); preserve the synchronized lockfile baseline without weakening audit thresholds.
