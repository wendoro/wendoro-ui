# Wendoro UI (`@wendoro/ui`)

> **Business, connected.** — Official Website: [https://wendoro.in](https://wendoro.in)

Wendoro UI is the shared design system and reusable React component library for the Wendoro software ecosystem, including Wendoro Desk, Flow, Platform, Studio, Insights, Support, Commerce, and People.

## Project Purpose

Wendoro UI prevents individual product teams from building inconsistent interfaces by centralizing:

- Brand & semantic design tokens (color, typography, spacing, radius, shadows)
- Light, Dark, and System theme switching powered by CSS custom properties
- Accessible core, feedback, layout, navigation, data-display, and advanced primitives
- Reusable business application patterns (`MetricCard`, `KpiCard`, `DataTable`, `PageHeader`, `FilterBar`, `NotificationCenter`, etc.)

## Installation (Workspace / Package Consumption)

```bash
npm install @wendoro/ui lucide-react
```

Import the stylesheet once at your application root and wrap your app in `ThemeProvider`:

```tsx
import '@wendoro/ui/styles.css';
import { ThemeProvider, Button, PageHeader } from '@wendoro/ui';

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <PageHeader title="Workspace" description="Business, connected." />
      <Button variant="primary">Create Record</Button>
    </ThemeProvider>
  );
}
```

## Development Setup

```bash
npm install
npm run dev          # Starts the Design System Preview app on http://localhost:3000
```

## Theming

Wendoro UI supports `light`, `dark`, and `system` modes without page reloads via `ThemeProvider` and `useTheme()`:

- **Light theme** (`src/themes/light.css`): Warm White (`#FAFAF7`) canvas, Crisp White (`#FFFFFF`) surfaces, Deep Black (`#111111`) foreground, Primary Yellow (`#FACC15`) actions, Primary Red (`#DC2626`) destructive actions.
- **Dark theme** (`src/themes/dark.css`): Deep Black (`#111111`) canvas, Charcoal (`#242424`) elevated surfaces, Warm White (`#FAFAF7`) foreground, calibrated accessible contrast.

Components never hardcode colors; all surfaces, borders, text, and interactive states consume semantic CSS variables (`--wdr-*`).

## Component Usage

- **Core**: `Button`, `IconButton`, `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`
- **Feedback**: `Alert`, `Badge`, `ToastProvider`, `useToast`, `Notification`, `Progress`, `Skeleton`, `Spinner`
- **Layout**: `Card`, `Separator`, `Container`, `Stack`, `Grid`, `Dialog`, `Drawer`, `Sheet`
- **Navigation**: `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar`, `DropdownMenu`, `NavigationMenu`
- **Data Display**: `Avatar`, `AvatarGroup`, `Table`, `EmptyState`, `Tooltip`, `Popover`
- **Advanced**: `CommandPalette`, `Calendar`, `DatePicker`, `Accordion`, `Collapsible`, `FormField`
- **Business**: `MetricCard`, `KpiCard`, `StatusBadge`, `UserProfile`, `ActivityItem`, `ActivityFeed`, `DataTable`, `SearchBar`, `FilterBar`, `PageHeader`, `DashboardGrid`, `NotificationCenter`

## Storybook

```bash
npm run storybook        # Launch Storybook on http://localhost:6006
npm run build-storybook  # Build static Storybook documentation
```

## Testing & Verification

```bash
npm run test:run         # Run Vitest + React Testing Library test suite
npm run typecheck        # Run strict TypeScript type checks
npm run lint             # Run ESLint across src, stories, and tests
npm run build            # Build the Design System Preview application
npm run build:lib        # Build @wendoro/ui ESM/CJS library bundle & .d.ts declarations
```

## Contribution Guidelines

1. Consume semantic CSS variables (`--wdr-*` / Tailwind semantic utilities); never introduce blue, purple, indigo, or teal into the brand palette.
2. Pair every status indicator with explicit text or iconography—never rely on color alone.
3. Ensure full keyboard navigation (`Tab`, `Arrow` keys, `Escape`, `Enter`/`Space`) and visible `focus-visible` rings.
4. Add unit + interaction tests under `tests/` and Storybook stories under `stories/` for every new component.
5. Keep `src/index.ts` exports clean and verify `npm run typecheck`, `npm run test:run`, `npm run build`, and `npm run build-storybook`.
