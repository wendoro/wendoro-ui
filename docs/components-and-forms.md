# Enterprise Components, Mobile Primitives & Multi-Industry Patterns

## Adaptive Device Shells & Mobile Touch-First Primitives

- **`AdaptiveWorkspaceLayout` & `ContextualDetailPanel` (`@wendoro/ui/business`)**: Unifies Desktop (`Sidebar` + split panes + contextual right panel), Tablet (compact navigation rail + adaptive panels), and Mobile (`ResponsiveNavDrawer` + `BottomNavigation` + `BottomSheet` detail overlays).
- **Mobile Primitives (`@wendoro/ui`)**:
  - `BottomNavigation`: Fixed/embedded touch tab bar (`48px–64px` targets) with badge counters.
  - `BottomSheet`: Accessible mobile drawer (`auto | half | full` sizes) with backdrop dismissal, Escape handling, and focus management.
  - `SwipeActionItem`: Touch pointer swipe reveal paired with an accessible keyboard/button action toggle.
  - `PullToRefresh`: Pointer pull gesture wrapper plus an accessible fallback refresh trigger.
  - `FloatingActionButton`, `StickyActionBar`, `MediaCaptureInput` (supports mobile camera `capture` + desktop file drop), and `MobileFilterSheet`.

## Advanced `DataTable` 2.0 & Information Comparison

Preserves v0.1 API compatibility while adding:
- **Saved Views (`savedViews`, `onSelectView`, `onSaveView`)** and **Column Reordering (`columnReorderable`)**
- **Grouping & Summaries (`groupBy`, `groupSummary`)** and **Inline Cell Editing (`column.editable`, `onCellEdit`)**
- **CSV Export (`enableExport`, `onExport`)**, **Mobile Card Mode (`renderMobileCard`, `responsiveCardMode`)**, and **Windowed Virtualization (`virtualized`, `rowHeight`, `virtualViewportHeight`)**
- **`DataComparisonTable` & `DetailPanel`**: Side-by-side feature/plan comparisons (with difference-only filter toggle) and structured key-value inspection panels.

## Productivity, Resource Planning & Workflow Builder (`@wendoro/ui/business`)

- **`WorkflowBuilder`**: Interactive node palette (`trigger | condition | action | approval | delay`), SVG connector canvas, outgoing edge wiring, rule condition editor, step inspector, reorder/delete, and graph validation checks.
- **`GanttChart`**: Interactive project timeline with owner filtering, progress fill indicators, milestone markers, and dependency badges.
- **`ResourceAllocationBoard`, `WorkloadIndicator`, `PriorityIndicator`**: Team capacity vs allocated hours per period with over-allocation detection.
- **`CommentThread` & `ApprovalQueue`**: Collaborative discussion composer and approve/reject review queue with decision notes.
- **`KanbanBoard`**: Supports WIP limits, tags, inline card creation (`onAddCard`), pointer drag-and-drop, and keyboard move controls.

## Forms 2.0, Navigation & UX Patterns (`@wendoro/ui`)

- **Forms 2.0**: `RichTextEditor` (XSS-safe toolbar + Preview using `sanitizeUrl`), `ValidationSummary`, `RepeatableFieldSection`, `DynamicFormBuilder` (conditional `when` rules + validation + confirmation screen), `FormReviewScreen`, and `AddressContactFields`.
- **Navigation Extras**: `WorkspaceSwitcher`, `QuickCreateMenu`, `NestedMenu`, `MobileCommandBar`, `ContextMenu` (pointer coordinates + click-outside + keyboard `Shift+F10`), `MegaMenu`, `NavigationRail`, `PageTabs`, and `CommandPalette`.
- **UX Adoption Patterns**: `OnboardingChecklist`, `GuidedTour`, `SavedViewsBar`, and `UndoBanner`.

## 8 Multi-Industry Workspace Blueprints (`@wendoro/ui/business`)

`AgencyWorkspacePattern`, `SaasAdminPattern`, `CommerceOperationsPattern`, `ProfessionalServicesPattern`, `EnterpriseAdminPattern`, `LogisticsOperationsPattern`, `FinanceOperationsPattern`, and `EducationMembershipPattern`.
