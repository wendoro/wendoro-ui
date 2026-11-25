# Enterprise Components, Tables & Forms Guide

## Dashboard Shell & Layout

- **`AppShell` / `DashboardLayout`**: Responsive layout container uniting persistent desktop `DashboardSidebar`, `DashboardHeader`, footer slot, and mobile `ResponsiveNavDrawer`.
- **`SplitPanel` & `ResizablePanel`**: Adjustable multi-pane workspaces supporting pointer dragging and keyboard `ArrowLeft`/`ArrowRight` adjustment (`role="separator"` with `aria-valuenow`).
- **`PageContainer`, `PageToolbar`, `ContentSection`, `TopNavigation`, `SidebarNavigation`**: Composable primitives with customizable slots.

## Advanced `DataTable`

Preserves v0.1 backwards compatibility while supporting:
- Global search (`searchable`), multi-column sorting (`multiSort`), per-column filter menus with removable filter chips (`filterable`, `filterOptions`)
- Column visibility toggle (`columnVisibilityToggle`), sticky headers (`stickyHeader`), pinned columns (`pin: 'left' | 'right'`), resizable widths (`columnResizable`)
- Expandable detail drawers (`renderExpandedRow`), row action slots (`rowActions`), row selection + `bulkActions`, and `aria-live="polite"` sort/filter/page status announcements.

## Productivity & Workflow (`@wendoro/ui/business`)

- **`KanbanBoard`**: Supports pointer drag-and-drop AND accessible keyboard arrow movement buttons on every card (`Move left/right/up/down`).
- **`CalendarGrid`**: Interactive `Month`, `Week`, and `Day` views with event chips and date selection callbacks.
- **`Timeline`, `TimelineGroup`, `TimelineItem`, `ActivityTimeline`, `Milestone`, `StatusProgression`**
- **`Stepper`, `Wizard`, `WorkflowProgress`, `TaskList`, `Checklist`, `ApprovalSteps`, `ProgressTimeline`**
- **`TreeView`, `NestedList`, `HierarchyView`**: Keyboard-expandable hierarchical node browsers.

## Forms, Navigation & Modern Feedback (`@wendoro/ui`)

- **Forms**: `MultiSelect`, `Combobox` (`Autocomplete`, `SearchableSelect`), `TagInput`, `DateRangePicker`, `TimePicker`, `Dropzone` (`FileUpload`), `PasswordInput`, `NumberInput`, `CurrencyInput`, `InputOTP`, `FormStepper`, `MultiStepForm`, `FieldGroup`, `FieldDescription`, `FormSection`.
- **Navigation**: `MegaMenu`, `ContextMenu`, `NavigationRail`, `PageTabs`, `CommandMenu`, `CommandDialog`, `SearchCommand`, `QuickActions`, `GlobalSearch`, `RecentItems`, `FavoritesList`, `KeyboardShortcutHint`.
- **Feedback**: `Banner`, `InlineAlert`, `CircularProgress`, `LoadingOverlay`, `ErrorState`, `RetryState`, `SuccessState`, `ConfirmationDialog`.
