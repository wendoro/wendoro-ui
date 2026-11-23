# Wendoro UI (`@wendoro/ui`)

> **Business, connected.** — Official Website: [https://wendoro.in](https://wendoro.in)  
> Repository: [https://github.com/wendoro/wendoro-ui](https://github.com/wendoro/wendoro-ui)

Wendoro UI is the shared design system and reusable React component library for the Wendoro software ecosystem, including Wendoro Desk, Wendoro Flow, Wendoro Platform, Wendoro Studio, Wendoro Insights, Wendoro Support, Wendoro Commerce, and Wendoro People.

---

## Project Overview

Wendoro UI prevents individual Wendoro applications from developing inconsistent interfaces by centralizing:

- **Design Tokens**: Semantic CSS custom properties (`--wdr-*`) and TypeScript tokens (`@wendoro/ui/tokens`) for colors, typography, spacing (4px scale), radius, and shadows.
- **Brand Palette**: Primary Yellow (`#FACC15`), Primary Red (`#DC2626`), Deep Black (`#111111`), White (`#FFFFFF`), Warm White (`#FAFAF7`), Charcoal (`#242424`), Border Gray (`#E5E5E5`), and Muted Gray (`#737373`). Blue, purple, indigo, and teal are excluded.
- **Theming**: Light, Dark, and System themes with zero-reload switching and WCAG 2.2 AA contrast calibration.
- **Component Architecture**: Accessible core, feedback, layout, navigation, data-display, advanced, and business components built with React, TypeScript, Tailwind CSS v4, and Lucide icons.

---

## Installation

`@wendoro/ui` requires `react` and `react-dom` (`>=18.0.0 <20.0.0`) as peer dependencies:

```bash
npm install @wendoro/ui react react-dom lucide-react
```

*(Note: `@wendoro/ui` is currently marked `"private": true` while preparing the publishing workflow and is consumed via workspace/tarball/git integration.)*

Import the compiled stylesheet once at your application entry point and wrap your root with `ThemeProvider`:

```tsx
import '@wendoro/ui/styles.css';
import { ThemeProvider, Button, PageHeader } from '@wendoro/ui';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="wendoro-app-theme">
      <PageHeader title="Workspace" description="Business, connected." />
      <Button variant="primary">Create Record</Button>
    </ThemeProvider>
  );
}
```

---

## Development Setup

```bash
npm install
npm run dev          # Starts the Design System Showcase app on http://localhost:3000
```

---

## Component Usage

- **Core**: `Button`, `IconButton`, `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`
- **Feedback**: `Alert`, `Badge`, `ToastProvider`, `useToast`, `Notification`, `Progress`, `Skeleton`, `Spinner`
- **Layout**: `Card`, `Separator`, `Container`, `Stack`, `Grid`, `Dialog`, `Drawer`, `Sheet`
- **Navigation**: `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar`, `DropdownMenu`, `NavigationMenu`
- **Data Display**: `Avatar`, `AvatarGroup`, `Table`, `EmptyState`, `Tooltip`, `Popover`
- **Advanced**: `CommandPalette`, `Calendar`, `DatePicker`, `Accordion`, `Collapsible`, `FormField`
- **Business**: `MetricCard`, `KpiCard`, `StatusBadge`, `UserProfile`, `TeamDirectory`, `ActivityItem`, `ActivityFeed`, `DataTable`, `SearchBar`, `FilterBar`, `PageHeader`, `DashboardGrid`, `NotificationCenter`

---

## Team Components (`TeamDirectory` & `UserProfile`)

`UserProfile` and `TeamDirectory` render team member cards and inline rows using initials-based `Avatar` fallbacks (unless an explicit `avatarSrc` is supplied). Missing optional attributes such as `role`, `department`, `email`, or `statusBadge` are cleanly omitted rather than replaced with placeholder values.

```tsx
import { TeamDirectory, UserProfile, type TeamMember } from '@wendoro/ui';

const members: TeamMember[] = [
  {
    id: 'ananya-rao',
    name: 'Ananya Rao',
    role: 'Principal Systems Lead',
    department: 'Wendoro Platform',
    email: 'ananya@wendoro.in',
    status: 'completed',
    statusLabel: 'Verified',
    contactHref: 'mailto:ananya@wendoro.in',
  },
  {
    id: 'sumita-singh',
    name: 'Sumita Singh',
    affiliation: 'Wendoro · Team member',
  },
];

export function TeamOverview() {
  return (
    <div className="space-y-6">
      <UserProfile
        variant="card"
        name="Ananya Rao"
        role="Principal Systems Lead"
        department="Wendoro Platform"
        email="ananya@wendoro.in"
        statusBadge="completed"
        statusLabel="Verified"
        actions={[{ id: 'copy', label: 'Copy email', onSelect: () => {} }]}
      />
      <TeamDirectory
        members={members}
        defaultView="grid"
        demoNotice="Team showcase displaying provided member attributes."
      />
    </div>
  );
}
```

---

## Activity Feed (`ActivityFeed` & `ActivityItem`)

`ActivityFeed` renders chronological team and product events with actor initials avatars, action verbs, entities, source product tags, tabular amounts, status badges, optional metadata, and an optional `demoLabel` banner for demonstration data.

```tsx
import { ActivityFeed } from '@wendoro/ui';

<ActivityFeed
  demoLabel="Sample UI demonstration data — illustrative component preview only."
  items={[
    {
      id: 'evt-1',
      actor: 'Ananya Rao',
      actorSubtitle: 'Principal Systems Lead · Wendoro Platform',
      action: 'approved',
      entity: 'settlement batch #SL-4092',
      source: 'Wendoro Commerce',
      amount: '$48,200 cleared',
      status: 'completed',
      statusLabel: 'Verified',
      timestamp: '6 minutes ago',
    },
  ]}
/>
```

---

## Theming & CSS Distribution

### Theme Switching
Wrap your app in `ThemeProvider` and call `useTheme()` anywhere inside:

- `theme`: `'light' | 'dark' | 'system'`
- `resolvedTheme`: `'light' | 'dark'`
- `setTheme(theme)` & `toggleTheme()`
- `storageKey`: customizable localStorage key (defaults to `'wendoro-ui-theme'`)

Light theme (`src/themes/light.css`) uses Warm White (`#FAFAF7`) background, Crisp White (`#FFFFFF`) elevated surfaces, and Deep Black (`#111111`) foreground. Dark theme (`src/themes/dark.css`) uses Deep Black (`#111111`) background, Charcoal (`#242424`) elevated surfaces, and Warm White (`#FAFAF7`) foreground.

### Stylesheet & Subpath Exports
The library build compiles a self-contained CSS bundle so consuming apps do **not** need Tailwind CSS v4 `@source` configuration:

- `@wendoro/ui` — ESM (`./dist/lib/wendoro-ui.js`), CJS (`./dist/lib/wendoro-ui.cjs`), and TypeScript types (`./dist/lib/index.d.ts`)
- `@wendoro/ui/styles.css` — Compiled standalone stylesheet (`./dist/lib/styles.css`) including all theme tokens and component utility classes
- `@wendoro/ui/themes/light.css` — Raw light theme CSS variables
- `@wendoro/ui/themes/dark.css` — Raw dark theme CSS variables
- `@wendoro/ui/tokens` — Programmatic TypeScript/JS design tokens (`brandColors`, `typographyScale`, `spacing`, `radius`, `shadows`)

---

## Storybook

```bash
npm run storybook        # Launch interactive Storybook on http://localhost:6006
npm run build-storybook  # Build static Storybook documentation into storybook-static/
```

Stories live under `stories/` and use `@storybook/addon-a11y` for accessibility checks across tokens, core inputs, feedback, layout/navigation, overlays, `TeamDirectory`, `UserProfile`, and `ActivityFeed`.

---

## Testing

```bash
npm run test             # Watch mode (Vitest + React Testing Library)
npm run test:run         # Single-run CI verification suite
```

Test coverage in `tests/` verifies token parity, light/dark/system theme switching, core form and button accessibility, keyboard navigation and focus trapping in overlays (`Dialog`, `Drawer`, `DropdownMenu`, `CommandPalette`, `Select`, `Tabs`), `TeamDirectory`, `UserProfile`, `ActivityFeed`, and package CSS/bundle integration (`tests/css-distribution.test.tsx`).

---

## Build & Package Integration

```bash
npm run typecheck        # TypeScript check across app, stories, and tests
npm run lint             # ESLint across src, stories, and tests
npm run build            # Build the showcase application (tsc --noEmit && vite build)
npm run build:lib        # Emit .d.ts declarations, ESM/CJS bundles, tokens, and dist/lib/styles.css
```

For local package integration tests before publishing:

1. Run `npm run build:lib` to generate `dist/lib/`.
2. Link or install the workspace package (e.g., `npm pack` or monorepo workspace dependency `"@wendoro/ui": "workspace:*"`).
3. Ensure consuming apps provide a single `react` and `react-dom` instance (matching `peerDependencies: ">=18.0.0 <20.0.0"`).

---

## Contribution Guidelines

1. Consume semantic CSS variables (`--wdr-*` / Tailwind semantic utilities); never introduce blue, purple, indigo, or teal into the brand palette.
2. Pair every status indicator with explicit text or iconography—never rely on color alone.
3. Ensure full keyboard navigation (`Tab`, `Arrow` keys, `Escape`, `Enter`/`Space`), focus trapping in modal overlays, and visible `focus-visible` rings.
4. Keep demo data clearly labeled and never fabricate personal details or company records.
5. Add Vitest + RTL tests under `tests/` and Storybook stories under `stories/` for every new or modified component, then run `npm run build:lib`, `npm run typecheck`, `npm run lint`, `npm run test:run`, `npm run build`, and `npm run build-storybook`.

---

## Versioning

`@wendoro/ui` follows Semantic Versioning (`MAJOR.MINOR.PATCH`), currently at `0.1.0` (`"private": true`). Breaking token or component API changes bump `MINOR` during `0.x` pre-release development and `MAJOR` once `1.0.0` is tagged.
