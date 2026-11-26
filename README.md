# Wendoro UI (`@wendoro/ui`)

> **Business, connected.** — Official Website: [https://wendoro.in](https://wendoro.in)  
> Repository: [https://github.com/wendoro/wendoro-ui](https://github.com/wendoro/wendoro-ui)

Wendoro UI is the shared enterprise design system, visualization suite, and reusable React component library for the Wendoro software ecosystem, powering **Wendoro Desk**, **Wendoro Flow**, **Wendoro Platform**, **Wendoro Studio**, **Wendoro Insights**, **Wendoro Support**, **Wendoro Commerce**, and **Wendoro People**.

---

## Architecture & Modular Subpaths

Wendoro UI is engineered with strict separation between core UI primitives and specialized modules so consumers never bundle unused visualization code:

| Subpath | Output | Purpose |
| --- | --- | --- |
| `@wendoro/ui` | `dist/lib/wendoro-ui.js`, `dist/lib/wendoro-ui.cjs`, `dist/lib/index.d.ts` | Core UI, forms, feedback, navigation, overlays, and enterprise business modules (chart-free) |
| `@wendoro/ui/styles.css` | `dist/lib/styles.css` | Standalone compiled Tailwind v4 + design tokens + density + reduced-motion stylesheet |
| `@wendoro/ui/themes/light.css` | `src/themes/light.css` | Raw Light theme `--wdr-*` CSS custom properties |
| `@wendoro/ui/themes/dark.css` | `src/themes/dark.css` | Raw Dark theme `--wdr-*` CSS custom properties |
| `@wendoro/ui/themes/high-contrast.css` | `src/themes/high-contrast.css` | High-contrast accessibility theme overrides (`[data-contrast="high"]` / `.high-contrast`) |
| `@wendoro/ui/tokens` | `dist/lib/tokens/index.{js,cjs,d.ts}` | Brand, chart palette, semantic colors, typography, spacing/density, elevation, motion, breakpoints, and `createThemeCssVariables` |
| `@wendoro/ui/charts` | `dist/lib/charts/index.{js,cjs}`, `dist/lib/components/charts/index.d.ts` | 18 standard charts (including `zoomable` series) + `ExternalChart`/`ChartAdapterProvider` bridge, legend, tooltip, thresholds, annotations, Intl formatters, and `<table>` fallbacks |
| `@wendoro/ui/charts/advanced` | `dist/lib/charts/advanced/index.{js,cjs}`, `dist/lib/components/charts/advanced/index.d.ts` | 15 advanced analytical charts (`CandlestickChart`, `NetworkGraphChart`, `FunnelChart`, `WaterfallChart`, `HeatmapChart`, `CalendarHeatmap`, `TreemapChart`, `SankeyChart`, `BoxPlotChart`, `ViolinChart`, `HistogramChart`, `RangeBandChart`, `MultiSeriesTimeSeriesChart`, `MixedAxisChart`, `GeoRegionChart`) |
| `@wendoro/ui/business` | `dist/lib/business/index.{js,cjs}`, `dist/lib/components/business/index.d.ts` | Analytics, AppShell & AdaptiveWorkspaceLayout, DataTable + DataTools, Collaboration, Communication, Commerce UI, Identity UX, Device/PWA UI, WorkflowBuilder, 13 Industry Patterns |
| `@wendoro/ui/hooks` | `dist/lib/hooks/index.{js,cjs,d.ts}` | `ThemeProvider`/`useTheme` (including presets & contrast), `DensityProvider`/`useDensity`, `DirectionProvider`/`useDirection`, `useClipboard`, `useReducedMotion`, `useBreakpoint`, `useKeyboardShortcuts`, `useUndoAction`, `useId` |
| `@wendoro/ui/ai` | `dist/lib/ai/index.{js,cjs}`, `dist/lib/components/ai/index.d.ts` | Optional Layer 4 AI workspace: `AiAssistantPanel`, `ConversationStreamView`, `PromptEditor`, `PromptLibrary`, `ModelSelector`, `ModelComparisonTable`, `AgentLauncher`, `AgentDirectory`, `HumanApprovalCheckpoint`, `TokenUsageBar` |
| `@wendoro/ui/editors` | `dist/lib/editors/index.{js,cjs}`, `dist/lib/components/editors/index.d.ts` | Optional Layer 4 Editors & Builders: `MarkdownEditor`, `CodeEditor`, `JsonViewer`, `YamlViewer`, `XmlViewer`, `DiffViewer`, `ColorPicker`, `GradientEditor`, `MediaGallery`, `ImageAnnotationPanel`, `AudioWaveformPreview`, `VideoTimelineScrubber`, `DocumentPreviewCard`, `VisualFormBuilder`, `DashboardBuilder`, `ReportBuilder` |
| `@wendoro/ui/adapters` | `dist/lib/adapters/index.{js,cjs}`, `dist/lib/components/adapters/index.d.ts` | Layer 5 Geospatial & Extension Platform: `MapAdapterProvider`, `MapContainer`, `FleetTrackingWorkspace`, `GeoFilterBar`, `SignatureCapturePad`, `EditorAdapterProvider`, `registerWendoroExtension`, `WENDORO_BUNDLE_BUDGETS` |

---

## Design Tokens & Brand Palette

- **Brand Palette**: Primary Yellow (`#FACC15`), Primary Red (`#DC2626`), Deep Black (`#111111`), White (`#FFFFFF`), Warm White (`#FAFAF7`), Charcoal (`#242424`), Border Gray (`#E5E5E5`), and Muted Gray (`#737373`). Blue, purple, indigo, and teal are excluded.
- **Density Modes**: Switchable `compact`, `comfortable`, and `spacious` modes via `<DensityProvider>` or `[data-density="compact" | "comfortable" | "spacious"]`.
- **Theming & Contrast**: Light, Dark, System, High-Contrast (`[data-contrast="high"]` via `@wendoro/ui/themes/high-contrast.css`), and scoped non-mutating brand overrides via `<ThemeProvider customTheme={...}>` and `createThemeCssVariables()`.
- **Motion & Breakpoints**: Reduced-motion aware CSS transitions (`--wdr-motion-*` + `@media (prefers-reduced-motion: reduce)`) and standardized device-aware breakpoints (`320px`, `375px`, `430px`, `768px`, `1024px`, `1280px`, `1440px`, `1920px`).

---

## Installation & Quick Start

`@wendoro/ui` declares `react` and `react-dom` (`>=18.0.0 <20.0.0`) as peer dependencies and depends solely on `lucide-react` at runtime (zero runtime dependency on heavy external charting libraries):

```bash
npm install @wendoro/ui react react-dom lucide-react
```

> **Pre-publish status**: `@wendoro/ui` remains `"private": true` in `package.json` pending licensing and distribution approval.

```tsx
import '@wendoro/ui/styles.css';
import { ThemeProvider, DensityProvider, ToastProvider, Button } from '@wendoro/ui';
import { LineChart } from '@wendoro/ui/charts';

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <DensityProvider defaultDensity="comfortable">
        <ToastProvider>
          <Button variant="primary">Launch Workflow</Button>
          <LineChart
            title="Sample Output (Demo)"
            data={[
              { month: 'Jan', value: 120 },
              { month: 'Feb', value: 165 },
            ]}
            xKey="month"
            series={[{ key: 'value', label: 'Primary Units' }]}
          />
        </ToastProvider>
      </DensityProvider>
    </ThemeProvider>
  );
}
```

---

## Component & Visualization Inventory

- **Core & Universal Controls**: `Button`, `IconButton`, `Input`, `Textarea`, `Label`, `Select`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider` (horizontal/vertical/marks), `RangeSlider`, `TimelineScrubber`, `LevelControlSlider`, `SegmentedControl`, `ButtonGroup`, `SelectableChipGroup`, `QuantityStepper`
- **Navigation, Scroll & Launchers**: `Tabs`, `Breadcrumb`, `Pagination`, `Sidebar` (collapsible/resizable/`SidebarNestedGroup`), `DropdownMenu`, `NavigationMenu`, `MegaMenu`, `ContextMenu`, `NavigationRail`, `PageTabs`, `CommandPalette`, `CommandMenu`, `CommandDialog`, `SearchCommand`, `QuickActions`, `GlobalSearch`, `RecentItems`, `FavoritesList`, `KeyboardShortcutHint`, `WorkspaceSwitcher`, `QuickCreateMenu`, `NestedMenu`, `MobileCommandBar`, `FullscreenMobileMenu`, `AppLauncher`, `QuickLaunchPanel`, `CommandLauncher`, `ScrollArea`, `ScrollProgressIndicator`, `ScrollToTopButton`, `InfiniteScrollContainer`, `VirtualizedList`
- **Mobile & Touch-First Primitives**: `BottomNavigation`, `BottomSheet`, `FloatingActionButton`, `SwipeActionItem`, `PullToRefresh`, `StickyActionBar`, `MediaCaptureInput`, `MobileFilterSheet`
- **Forms & Inputs**: `FormField`, `DatePicker`, `Calendar`, `MultiSelect`, `Combobox`, `Autocomplete`, `SearchableSelect`, `TagInput`, `DateRangePicker`, `TimePicker`, `Dropzone`, `FileUpload`, `PasswordInput`, `NumberInput`, `CurrencyInput`, `InputOTP`, `FormStepper`, `MultiStepForm`, `FieldGroup`, `FieldDescription`, `FormSection`, `RichTextEditor`, `ValidationSummary`, `RepeatableFieldSection`, `DynamicFormBuilder`, `FormReviewScreen`, `AddressContactFields`
- **Feedback, Loaders, System States & UX Patterns**: `Alert`, `Banner`, `InlineAlert`, `Badge`, `ToastProvider`, `useToast`, `Notification`, `Progress`, `CircularProgress` (indeterminate support), `Skeleton` (shimmer support), `Spinner`, `InlineLoader`, `LoadingOverlay`, `FullScreenLoader`, `MultiStepProgress`, `TransferProgressCard`, `ErrorState`, `RetryState`, `SuccessState`, `ConfirmationDialog`, `Dialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `EmptyState`, `OnboardingChecklist`, `GuidedTour`, `SavedViewsBar`, `UndoBanner`, `ConnectionStatusBanner`, `AutosaveIndicator`, `PermissionDeniedState`, `MaintenanceState`
- **Data Display & Layout**: `Card`, `Separator`, `Container`, `Stack`, `Grid`, `Avatar`, `AvatarGroup`, `Table`, `Accordion`, `Collapsible`
- **Standard Charts (`@wendoro/ui/charts`)**: `LineChart`, `AreaChart`, `StackedAreaChart`, `ComposedChart`, `BarChart`, `HorizontalBarChart`, `GroupedBarChart`, `StackedBarChart`, `ColumnChart`, `DonutChart`, `PieChart`, `RadialProgressChart`, `GaugeChart`, `ScatterChart`, `BubbleChart`, `RadarChart`, `Sparkline`, `ProgressVisualization`, plus `ExternalChart`/`ChartAdapterProvider` vendor bridge
- **Advanced Charts (`@wendoro/ui/charts/advanced`)**: `CandlestickChart`, `NetworkGraphChart`, `FunnelChart`, `WaterfallChart`, `HeatmapChart`, `CalendarHeatmap`, `TreemapChart`, `SankeyChart`, `BoxPlotChart`, `ViolinChart`, `HistogramChart`, `RangeBandChart`, `MultiSeriesTimeSeriesChart`, `MixedAxisChart`, `GeoRegionChart`
- **Enterprise Business, Workspace Windows, Installer UI & Industry Patterns (`@wendoro/ui/business`)**:
  - *Analytics*: `MetricCard`, `KpiCard`, `TrendIndicator`, `MetricComparison`, `MiniChartCard`, `AnalyticsSummaryCard`, `TargetVsActual`, `GoalProgress`, `PerformanceIndicator`, `StatisticalSummary`, `DateRangeSelector`, `ComparisonPeriodSelector`, `AnalyticsFilterToolbar`, `MetricTrendCard`
  - *Shell & Window Management*: `AppShell`, `DashboardLayout`, `DashboardHeader`, `DashboardSidebar`, `SidebarGroup`, `SidebarNavigation`, `TopNavigation`, `PageContainer`, `PageToolbar`, `ContentSection`, `SplitPanel`, `ResizablePanel`, `ResponsiveNavDrawer`, `DashboardGrid`, `PageHeader`, `ContextualDetailPanel`, `AdaptiveWorkspaceLayout`, `WorkspaceModeContainer`, `DockablePanel`, `FloatingWindow`, `MultiPanelWorkspace`
  - *Installer & Setup UI*: `SetupWizard`, `DependencyCheckList`, `InstallationProgressTracker`, `UpdateManagerPanel`
  - *AI-Native, Presence & Extension Contracts*: `PromptComposerBar`, `AssistantResponseCard`, `PresenceAvatarStack`, `LiveActivityPulse`, `WENDORO_MODULE_CONTRACT_VERSION`
  - *Productivity, Data & Workflow*: `DataTable` (summary rows, multi-sort, filter chips, saved views, column reordering, grouping, inline edit, CSV export, virtualization, responsive mobile cards), `SpreadsheetGrid`, `PivotTable`, `QueryBuilder`, `FormulaEditor`, `DataImportMapper`, `DataRelationshipDiagram`, `PresenceIndicator`, `VersionHistoryPanel`, `ConflictResolutionCard`, `ChatLayout`, `SharedInbox`, `AnnouncementPanel`, `NotificationPreferences`, `MeetingLayout`, `WorkflowBuilder`, `KanbanBoard`, `GanttChart`, `ResourceAllocationBoard`, `CommentThread`, `ApprovalQueue`, `CalendarGrid`, `TeamDirectory`, `UserProfile`, `ActivityFeed`, `StatusBadge`
  - *Cross-Industry Blueprints (13 Patterns)*: `AgencyWorkspacePattern`, `SaasAdminPattern`, `CommerceOperationsPattern`, `ProfessionalServicesPattern`, `EnterpriseAdminPattern`, `LogisticsOperationsPattern`, `FinanceOperationsPattern`, `EducationMembershipPattern`, `SupportDeskPattern`, `PeopleHrPattern`, `HealthcareClinicalPattern`, `LegalCompliancePattern`, `CommunityEventsPattern`

---

## Composing `@wendoro/ui` Alongside `@wendoro/sdk`

`@wendoro/ui` has zero coupling to backend clients, databases, or authentication providers. Applications integrate API data from `@wendoro/sdk` into presentation props:

```tsx
import { DataTable, PageHeader, StatusBadge, type DataTableColumn } from '@wendoro/ui';
import { LineChart } from '@wendoro/ui/charts';
// Consumer imports SDK independently: import { createWendoroClient } from '@wendoro/sdk';

interface SampleRecord {
  id: string;
  project: string;
  status: 'active' | 'pending';
}

const columns: DataTableColumn<SampleRecord>[] = [
  { key: 'project', header: 'Example Project', accessor: (r) => r.project, cell: (r) => r.project },
  { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
];

export function HostProductView({
  records,
  trendPoints,
  loading,
  error,
  onRetry,
}: {
  records: SampleRecord[];
  trendPoints: Array<{ period: string; units: number }>;
  loading: boolean;
  error?: string;
  onRetry: () => void;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title="Sample Organization Overview" description="Data fetched by host application." />
      <LineChart
        title="Throughput (Demo)"
        data={trendPoints}
        xKey="period"
        series={[{ key: 'units', label: 'Units' }]}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
      <DataTable data={records} columns={columns} getRowId={(r) => r.id} loading={loading} error={error} onRetry={onRetry} />
    </div>
  );
}
```

---

## Documentation Guides

Additional architectural and usage documentation is maintained under `docs/`:

- [`docs/architecture.md`](docs/architecture.md) — Subpath structure, tree-shaking boundaries, optional dependency policy, and consumer integration
- [`docs/tokens-and-themes.md`](docs/tokens-and-themes.md) — Brand tokens, semantic chart palette, density modes, elevation, motion, and responsive breakpoints
- [`docs/visualization-guide.md`](docs/visualization-guide.md) — Standard & advanced charts, Intl formatters, thresholds, non-color cues, and HTML table fallbacks
- [`docs/components-and-forms.md`](docs/components-and-forms.md) — Dashboard shell, advanced DataTable, Kanban, CalendarGrid, workflow, navigation, forms, and feedback
- [`docs/accessibility-and-security.md`](docs/accessibility-and-security.md) — WCAG 2.2 AA practices, manual assistive-technology notes, URL/SVG hardening, and dependency advisories
- [`docs/module-development-standard.md`](docs/module-development-standard.md) — 12-point governance standard for future Wendoro UI modules and extension contracts
- [`docs/roadmap.md`](docs/roadmap.md) — Ecosystem progression roadmap & implemented vs. planned capability inventory

---

## Development, Storybook & Verification Commands

```bash
npm ci                          # Install dependencies cleanly via package-lock.json
npm run dev                     # Start showcase app on http://localhost:3000
npm run storybook               # Launch interactive Storybook on http://localhost:6006

npm run typecheck               # TypeScript verification across src, stories, tests
npm run lint                    # ESLint verification
npm run test:run                # Unit & component suite (tests/*.test.tsx)
npm run test:integration        # Builds dist/lib, checks external consumer tsc & exports
npm run build                   # Showcase Vite build
npm run build-storybook         # Static Storybook documentation build
npm run test:ci                 # Runs typecheck, lint, test:run, test:integration, build, and build-storybook
npm pack --dry-run              # Inspect package tarball allowlist
```

## Policy Notes

- **Demo Data**: All Storybook examples, showcase views, and test fixtures use clearly labeled synthetic data (`Demo User`, `Sample Organization`, `Example Project`, `Sample Record #01`, `demo@example.invalid`).
- **Licensing Governance**: Currently declared MIT (`LICENSE` and `package.json`) in a public repository; resolve any alignment with Wendoro Community Edition / proprietary licensing separately before public npm distribution.
