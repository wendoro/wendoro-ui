# Package Architecture & Consumer Compatibility

## 5-Layer Hybrid Modular Architecture

`@wendoro/ui` separates its design foundation, core UI, business suites, optional complex editors/AI studios, and external adapters so consumers bundle only what they import:

1. **Layer 1 — Design Foundation (`@wendoro/ui/tokens`, `./styles.css`, `./themes/*`)**:
   - Colors, typography, spacing, density (`compact | comfortable | spacious`), borders, radii, elevation shadows, motion durations/easings, breakpoints (`320px–1920px+`), z-index/layering, focus rings, theme preset registry (`WENDORO_BUILTIN_PRESETS`), custom token registry, and RTL/locale formatting utilities.
2. **Layer 2 — Core Components (`@wendoro/ui`)**:
   - Buttons (`primary`, `secondary`, `tertiary`, `ghost`, `destructive`, `icon`, `Toggle`, `ButtonGroup`, `SplitButton`), Inputs (`text`, `password`, `email`, `number`, `search`, `textarea`, `url`, `date`, `time`, `date-range`, `color`, `file`, `masked`), Selection controls, Sliders (single, dual-thumb range, vertical, stepped, scrubber, volume/brightness), Cards, Badges, Dialogs, Drawers, Popovers, Menus, Tabs, Navigation (`Sidebar` default/mini/icon/resizable, `MegaMenu`, `ContextMenu`, `NavigationRail`, `HamburgerButton`, `WorkspaceSwitcher`, `OrganizationSwitcher`), Feedback (`ErrorBoundary`, `RecoveryScreen`, loaders, progress).
3. **Layer 3 — Standard Modules (`@wendoro/ui/business`)**:
   - Independently importable business suites (strictly zero chart imports): Data grids (`DataTable` with summary footer rows, `SpreadsheetGrid`, `PivotTable`, `QueryBuilder`, `FormulaEditor`, `DataImportMapper`, `DataRelationshipDiagram`), Analytics (`MetricCard`, `KpiCard`, `AnalyticsSummaryCard`, `TargetVsActual`), Collaboration (`PresenceIndicator`, `VersionHistoryPanel`, `ConflictResolutionCard`, `CommentThread`, `ApprovalQueue`), Communication (`ChatLayout`, `ConversationList`, `MessageThread`, `MessageComposer`, `SharedInbox`, `AnnouncementPanel`, `NotificationPreferences`, `MeetingLayout`), Commerce & Billing UI, Identity & Security UX, Device & PWA Lifecycle, Admin (`SystemHealthPanel`, `FeatureFlagsPanel`, `WorkspaceSettingsPanel`), Workflow (`WorkflowBuilder`), Scheduling (`CalendarGrid`, `GanttChart`, `KanbanBoard`, `ResourceAllocationBoard`), and 13 Industry Blueprints.
4. **Layer 4 — Optional Advanced Modules**:
   - **`@wendoro/ui/charts`** & **`@wendoro/ui/charts/advanced`**: 18 standard SVG charts (including zoom/pan window support on Cartesian series) + 15 advanced charts (including `CandlestickChart`, `NetworkGraphChart`, and `GeoRegionChart`) + `ExternalChart` / `ChartAdapterProvider`.
   - **`@wendoro/ui/ai`**: Optional AI & Agent presentation workspace (`AiAssistantPanel`, `ConversationStreamView`, `PromptEditor`, `PromptLibrary`, `PromptTemplatePicker`, `ModelSelector`, `ModelComparisonTable`, `AgentLauncher`, `AgentDirectory`, `AgentActivityTimeline`, `ToolExecutionCard`, `HumanApprovalCheckpoint`, `GeneratedContentPreview`, `SourceCitationsPanel`, `TokenUsageBar`, `AiEvaluationControls`, `MultimodalInputBar`).
   - **`@wendoro/ui/editors`**: Optional interactive editors & builders (`MarkdownEditor`, `CodeEditor`, `JsonViewer`, `YamlViewer`, `XmlViewer`, `DiffViewer`, `ColorPicker`, `GradientEditor`, `MediaGallery`, `ImageAnnotationPanel`, `AudioWaveformPreview`, `VideoTimelineScrubber`, `DocumentPreviewCard`, `VisualFormBuilder`, `DashboardBuilder`, `ReportBuilder`).
5. **Layer 5 — Adapters & Extension Platform (`@wendoro/ui/adapters`)**:
   - External engine slots & contracts (`MapAdapterProvider`, `MapContainer`, `LocationSearchBar`, `TerritorySelector`, `GeoFilterBar`, `RouteOverlaySummary`, `FleetTrackingWorkspace`, `EditorAdapterProvider`, `SignatureCapturePad`, `CanvasDiagramAdapterSlot`), plus `registerWendoroExtension`, `WENDORO_BUNDLE_BUDGETS`, and `MODULE_CREATION_CHECKLIST`.

## Entry Point Outputs

Every TypeScript entry compiles to ESM (`.js`), CommonJS (`.cjs`), and alias-free `.d.ts`:

| Subpath | Source | Output |
| --- | --- | --- |
| `@wendoro/ui` | `src/index.ts` | `dist/lib/wendoro-ui.{js,cjs}`, `dist/lib/index.d.ts` |
| `@wendoro/ui/styles.css` | `src/styles/index.css` | `dist/lib/styles.css` |
| `@wendoro/ui/themes/*` | `src/themes/{light,dark,high-contrast}.css` | `src/themes/*.css` |
| `@wendoro/ui/tokens` | `src/tokens/index.ts` | `dist/lib/tokens/index.{js,cjs,d.ts}` |
| `@wendoro/ui/charts` | `src/components/charts/index.ts` | `dist/lib/charts/index.{js,cjs}` + `dist/lib/components/charts/index.d.ts` |
| `@wendoro/ui/charts/advanced` | `src/components/charts/advanced/index.ts` | `dist/lib/charts/advanced/index.{js,cjs}` + `dist/lib/components/charts/advanced/index.d.ts` |
| `@wendoro/ui/business` | `src/components/business/index.ts` | `dist/lib/business/index.{js,cjs}` + `dist/lib/components/business/index.d.ts` |
| `@wendoro/ui/hooks` | `src/hooks/index.ts` | `dist/lib/hooks/index.{js,cjs,d.ts}` |
| `@wendoro/ui/ai` | `src/components/ai/index.ts` | `dist/lib/ai/index.{js,cjs}` + `dist/lib/components/ai/index.d.ts` |
| `@wendoro/ui/editors` | `src/components/editors/index.ts` | `dist/lib/editors/index.{js,cjs}` + `dist/lib/components/editors/index.d.ts` |
| `@wendoro/ui/adapters` | `src/components/adapters/index.ts` | `dist/lib/adapters/index.{js,cjs}` + `dist/lib/components/adapters/index.d.ts` |

## Dependency & Tree-Shaking Guarantees

- **Runtime Dependencies**: Only `lucide-react` alongside React `18.x`/`19.x` peers.
- **Zero Cross-Contamination**: `@wendoro/ui`, `@wendoro/ui/business`, and `@wendoro/ui/adapters` never import `src/components/charts/*`.
- **Presentation-Only Boundaries**: UI modules contain zero backend database connections, API SDKs, LLM runtime clients, or payment processors.
