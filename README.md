# Wendoro UI (`@wendoro/ui`)

> **Business, connected.** — Official Website: [https://wendoro.in](https://wendoro.in)  
> Repository: [https://github.com/wendoro/wendoro-ui](https://github.com/wendoro/wendoro-ui)

Wendoro UI is the shared design system and reusable React component library for the Wendoro software ecosystem, including **Wendoro Desk**, **Wendoro Flow**, **Wendoro Platform**, **Wendoro Studio**, **Wendoro Insights**, **Wendoro Support**, **Wendoro Commerce**, and **Wendoro People**.

---

## Project Overview

Wendoro UI prevents individual Wendoro applications from developing inconsistent interfaces by centralizing:

- **Design Tokens**: Semantic CSS custom properties (`--wdr-*`) and TypeScript tokens (`@wendoro/ui/tokens`) for colors, typography, spacing (4px scale), radius, and shadows.
- **Brand Palette**: Primary Yellow (`#FACC15`), Primary Red (`#DC2626`), Deep Black (`#111111`), White (`#FFFFFF`), Warm White (`#FAFAF7`), Charcoal (`#242424`), Border Gray (`#E5E5E5`), and Muted Gray (`#737373`). Blue, purple, indigo, and teal are excluded.
- **Theming**: Light, Dark, and System themes with zero-reload switching and accessible semantic color contrast.
- **Component Architecture**: Accessible core, feedback, layout, navigation, data-display, advanced, and business components built with React, TypeScript, Tailwind CSS v4, and Lucide icons.

---

## Installation

`@wendoro/ui` declares `react` and `react-dom` (`>=18.0.0 <20.0.0`) as peer dependencies and depends on `lucide-react`:

```bash
npm install @wendoro/ui react react-dom lucide-react
```

> **Pre-publish status**: `@wendoro/ui` is currently marked `"private": true` in `package.json` while release governance is finalized. Consuming Wendoro apps integrate via workspace dependency (`"@wendoro/ui": "workspace:*"`) or a local tarball (`npm pack`).

Import the compiled stylesheet once at your application entry point and wrap your root with `ThemeProvider`:

```tsx
import '@wendoro/ui/styles.css';
import { ThemeProvider, ToastProvider, Button, PageHeader } from '@wendoro/ui';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="wendoro-app-theme">
      <ToastProvider>
        <PageHeader title="Workspace" description="Business, connected." />
        <Button variant="primary">Create Record</Button>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

---

## Development Setup

```bash
npm install
npm run dev          # Starts the Design System Showcase app on http://localhost:3000
npm run storybook    # Launches interactive Storybook on http://localhost:6006
```

---

## Package Exports & Imports

`package.json` exposes tree-shakeable ESM, CJS, standalone compiled CSS, raw theme stylesheets, TypeScript declarations (zero internal path aliases), and the tokens subpath:

| Subpath | Output | Purpose |
| --- | --- | --- |
| `@wendoro/ui` | `dist/lib/wendoro-ui.js`, `dist/lib/wendoro-ui.cjs`, `dist/lib/index.d.ts` | All UI components, business components, hooks, utilities, and types |
| `@wendoro/ui/styles.css` | `dist/lib/styles.css` | Precompiled standalone Tailwind v4 + theme stylesheet (no consumer Tailwind setup required) |
| `@wendoro/ui/themes/light.css` | `src/themes/light.css` | Raw Light theme `--wdr-*` CSS custom properties |
| `@wendoro/ui/themes/dark.css` | `src/themes/dark.css` | Raw Dark theme `--wdr-*` CSS custom properties |
| `@wendoro/ui/tokens` | `dist/lib/tokens/index.js`, `dist/lib/tokens/index.cjs`, `dist/lib/tokens/index.d.ts` | Programmatic TypeScript/JS tokens (`brandColors`, `semanticColorTokens`, `typographyScale`, `spacing`, `radius`, `shadows`) |

---

## Component Catalog

- **Core**: `Button`, `IconButton`, `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`
- **Feedback**: `Alert`, `Badge`, `ToastProvider`, `useToast`, `Notification`, `Progress`, `Skeleton`, `Spinner`
- **Layout**: `Card`, `Separator`, `Container`, `Stack`, `Grid`, `Dialog`, `Drawer`, `Sheet`
- **Navigation**: `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar`, `DropdownMenu`, `NavigationMenu`
- **Data Display**: `Avatar`, `AvatarGroup`, `Table`, `EmptyState`, `Tooltip`, `Popover`
- **Advanced**: `CommandPalette`, `Calendar`, `DatePicker`, `Accordion`, `Collapsible`, `FormField`
- **Business**: `MetricCard`, `KpiCard`, `StatusBadge`, `UserProfile`, `TeamDirectory`, `ActivityItem`, `ActivityFeed`, `DataTable`, `SearchBar`, `FilterBar`, `PageHeader`, `DashboardGrid`, `NotificationCenter`

---

## Theme Configuration & Design Tokens

### Runtime Theme Switching
Wrap your app in `ThemeProvider` and call `useTheme()` anywhere inside:

- `theme`: `'light' | 'dark' | 'system'`
- `resolvedTheme`: `'light' | 'dark'`
- `setTheme(theme)` & `toggleTheme()`
- `storageKey`: customizable `localStorage` key (defaults to `'wendoro-ui-theme'`)

Light theme (`src/themes/light.css`) pairs Warm White (`#FAFAF7`) background, Crisp White (`#FFFFFF`) elevated surfaces, and Deep Black (`#111111`) foreground. Dark theme (`src/themes/dark.css`) pairs Deep Black (`#111111`) background, Charcoal (`#242424`) elevated surfaces, and Warm White (`#FAFAF7`) foreground. Both themes activate via `.dark` or `[data-theme='dark']` on `<html>` or a scoped container.

### Programmatic Tokens

```ts
import {
  brandColors,
  semanticColorTokens,
  typographyScale,
  spacing,
  radius,
  shadows,
} from '@wendoro/ui/tokens';

// Example:
// brandColors.primaryYellow === '#FACC15'
// semanticColorTokens.destructiveSubtleForeground === 'var(--wdr-destructive-subtle-foreground)'
```

---

## External Consumer Integration Example

Below is a realistic consumer pattern verified by the integration fixture (`tests/integration/consumer-fixture/ConsumerApp.tsx`):

```tsx
import * as React from 'react';
import '@wendoro/ui/styles.css';
import {
  ThemeProvider,
  useTheme,
  Sidebar,
  SidebarSection,
  SidebarItem,
  Alert,
  Button,
  DataTable,
  Dialog,
  DialogFooter,
  StatusBadge,
  UserProfile,
  ActivityFeed,
  type DataTableColumn,
} from '@wendoro/ui';
import { brandColors } from '@wendoro/ui/tokens';

interface ServiceRow {
  id: string;
  product: string;
  status: 'active' | 'error';
}

const columns: DataTableColumn<ServiceRow>[] = [
  { key: 'product', header: 'Product', sortable: true, accessor: (r) => r.product, cell: (r) => r.product },
  { key: 'status', header: 'State', cell: (r) => <StatusBadge status={r.status} /> },
];

function DeskWorkspace() {
  const { toggleTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground" data-accent={brandColors.primaryYellow}>
      <Sidebar header={<span className="font-bold">Wendoro Desk</span>}>
        <SidebarSection title="Operations">
          <SidebarItem active>Overview</SidebarItem>
        </SidebarSection>
      </Sidebar>
      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <UserProfile variant="inline" name="Ananya Rao" role="Principal Systems Lead" department="Wendoro Platform" />
          <div className="flex gap-2">
            <Button variant="outline" onClick={toggleTheme}>Toggle Theme</Button>
            <Button variant="primary" onClick={() => setOpen(true)}>Inspect</Button>
          </div>
        </div>
        <Alert variant="destructive" title="Webhook attention required">
          Check secret rotation status for commerce events.
        </Alert>
        <DataTable
          aria-label="Service status"
          data={[{ id: '1', product: 'Wendoro Desk', status: 'active' }]}
          columns={columns}
          getRowId={(row) => row.id}
        />
        <ActivityFeed items={[]} demoLabel="Sample UI demonstration data" />
        <Dialog open={open} onOpenChange={setOpen} title="Diagnostics">
          <p className="text-sm text-muted-foreground">All tokens loaded cleanly.</p>
          <DialogFooter>
            <Button variant="primary" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </Dialog>
      </main>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <DeskWorkspace />
    </ThemeProvider>
  );
}
```

---

## Storybook

```bash
npm run storybook        # Interactive Storybook on http://localhost:6006
npm run build-storybook  # Build static documentation into storybook-static/
```

Stories live under `stories/` with `@storybook/addon-a11y` enabled and cover Design Tokens, Core Controls, Feedback (loading/empty/alerts), Layout & Navigation, Overlays & Calendar, `TeamDirectory`, `UserProfile`, `ActivityFeed`, `BusinessComponents`, and explicit Light/Dark theme previews.

---

## Testing & CI Sequence

Tests are cleanly split so a **fresh checkout passes unit tests and typechecking without running a prior build**:

- `npm run test`: Interactive Vitest watch mode.
- `npm run test:run`: Clean-checkout unit & component suite (`tests/*.test.tsx`, excluding `tests/integration/**`). Requires **zero** prebuilt artifacts in `dist/`.
- `npm run test:integration`: Builds `dist/lib` (`npm run build:lib`), typechecks the alias-free external consumer fixture (`tests/integration/consumer-fixture/tsconfig.consumer.json`), and executes `tests/integration/package-distribution.test.tsx` against the compiled ESM, CJS, `.d.ts`, `styles.css`, and `@wendoro/ui/tokens` artifacts.
- `npm run test:ci`: Runs the full verification pipeline from start to finish.

### Exact CI Verification Sequence

Run in this order on a clean checkout (`dist/` absent):

```bash
npm ci
npm run typecheck          # App, stories, and unit tests (tsconfig.json)
npm run lint               # ESLint across src/, stories/, tests/
npm run test:run           # Unit & component suite (no dist/ required)
npm run test:integration   # Builds dist/lib + external consumer tsc + package distribution Vitest
npm run build              # Showcase app build (tsc --noEmit && vite build)
npm run build-storybook    # Static Storybook build
npm pack --dry-run         # Verify tarball allowlist (dist/lib, src/styles, src/themes, README.md)
```

Or run steps 2–7 in one command via:

```bash
npm run test:ci
```

---

## Build & Release Workflow

### Build Commands

```bash
npm run build        # Build the showcase application into dist/
npm run build:lib    # Clean dist/lib, emit alias-free .d.ts, ESM/CJS bundles, tokens subpath, and dist/lib/styles.css
```

### Release Checklist (Internal / Pre-Publish)

1. Ensure working tree is clean and run the full CI sequence (`npm run test:ci`).
2. Inspect exact package contents with `npm pack --dry-run` to confirm only `dist/lib/`, `src/styles/`, `src/themes/`, `README.md` (and `LICENSE` when present) are packaged—no tests, stories, or showcase source.
3. Bump version in `package.json` following SemVer (`MAJOR.MINOR.PATCH`).
4. Keep `"private": true` until registry authentication and release pipelines are formally approved for `@wendoro/ui`.

---

## Versioning & Contribution Guidelines

- **Versioning**: Follows Semantic Versioning (`0.1.0` pre-release). Breaking token or component API changes bump `MINOR` during `0.x` development and `MAJOR` after `1.0.0`.
- **Tokens & Brand**: Consume semantic CSS variables (`--wdr-*` / Tailwind semantic utilities); never introduce blue, purple, indigo, or teal.
- **Accessibility**: Pair every status indicator with explicit text or iconography; preserve keyboard navigation (`Tab`, `Arrow` keys, `Home`/`End`, `Escape`, `Enter`/`Space`), focus trapping/restoration in overlays, and visible `focus-visible` rings.
- **Imports**: Within library source (`src/components/**`, `src/hooks/**`, `src/utils/**`, `src/tokens/**`), always use relative imports instead of `@/` aliases so generated `.d.ts` files remain portable for external consumers.
- **Demo Data**: Keep demonstration records clearly labeled (`demoLabel`, `demoNotice`) and never fabricate personal details or business transactions.

