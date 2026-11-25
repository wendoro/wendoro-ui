# Wendoro UI — Capability Inventory & Platform Roadmap

This inventory documents every capability across `@wendoro/ui` 2.0 using explicit status tags: **implemented**, **improved**, **existing**, **planned**, or **intentionally excluded**.

## A. Design Foundations & Hooks
| Capability | Module / Location | Status |
| --- | --- | --- |
| Brand, semantic, density, motion & radius tokens | `@wendoro/ui/tokens` | existing |
| Light & Dark theme stylesheets | `./themes/light.css`, `./themes/dark.css` | existing |
| High-Contrast Light & Dark theme | `./themes/high-contrast.css` | implemented |
| Runtime multi-tenant brand theme overrides (`createThemeCssVariables`) | `src/tokens/theming.ts`, `ThemeProvider` | implemented |
| Responsive breakpoints (`320px–1920px`) & `DeviceCategory` | `src/tokens/breakpoints.ts`, `useBreakpoint` | improved |
| Keyboard shortcuts & Undo/Redo state hooks | `useKeyboardShortcuts`, `useUndoAction` | implemented |

## B. Core & Universal Controls
| Capability | Module / Location | Status |
| --- | --- | --- |
| Core inputs (`Button`, `IconButton`, `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`) | `@wendoro/ui` | existing |
| Single-value `Slider` with vertical orientation & step `marks` | `src/components/ui/slider/Slider.tsx` | improved |
| Dual-thumb `RangeSlider`, `TimelineScrubber`, `LevelControlSlider` (volume/brightness) | `src/components/ui/slider/Slider.tsx` | implemented |
| `SegmentedControl`, `ButtonGroup`, `SelectableChipGroup`, `QuantityStepper` | `src/components/ui/controls/UniversalControls.tsx` | implemented |
| `MultiSelect`, `Combobox`, `TagInput`, `CurrencyInput`, `NumberInput`, `InputOTP` | `src/components/ui/forms/AdvancedForms.tsx` | existing |

## C. Scroll, Navigation & Launchers
| Capability | Module / Location | Status |
| --- | --- | --- |
| Native-compatible scrollbar classes (`.wdr-scrollbar`, `.wdr-scrollbar-thin`) & `ScrollArea` (with snap & scroll shadows) | `src/styles/index.css`, `src/components/ui/scroll/` | implemented |
| `ScrollProgressIndicator`, `ScrollToTopButton`, `InfiniteScrollContainer`, `VirtualizedList` | `src/components/ui/scroll/ScrollControls.tsx` | implemented |
| `Sidebar` with icon-only collapse, pointer/keyboard resizing, and `SidebarNestedGroup` | `src/components/ui/sidebar/Sidebar.tsx` | improved |
| `NavigationRail`, `MegaMenu`, `ContextMenu`, `WorkspaceSwitcher`, `QuickCreateMenu`, `NestedMenu`, `MobileCommandBar`, `FullscreenMobileMenu` | `src/components/ui/navigation-ext/NavigationExtras.tsx` | improved |
| `CommandPalette`, `CommandMenu`, `GlobalSearch`, `RecentItems`, `FavoritesList` | `src/components/ui/command/`, `navigation-ext/` | existing |
| `AppLauncher`, `QuickLaunchPanel`, `CommandLauncher` (apps, products, modules, workspaces, favorites, recent) | `src/components/ui/launcher/LauncherSuite.tsx` | implemented |

## D. Loaders, Progress & System States
| Capability | Module / Location | Status |
| --- | --- | --- |
| `Spinner`, `Progress`, `LoadingOverlay`, `ErrorState`, `RetryState`, `SuccessState`, `EmptyState`, `Banner`, `Toast` | `src/components/ui/` | existing |
| `Skeleton` with `shimmer` effect & `CircularProgress` with `indeterminate` mode | `Skeleton.tsx`, `ModernFeedback.tsx` | improved |
| `InlineLoader`, `FullScreenLoader`, `MultiStepProgress`, `TransferProgressCard` (upload/download/install/task) | `src/components/ui/feedback/ModernFeedback.tsx` | implemented |
| `ConnectionStatusBanner` (offline/reconnecting/syncing/sync_error/maintenance), `AutosaveIndicator`, `PermissionDeniedState`, `MaintenanceState` | `src/components/ui/system-states/SystemStates.tsx` | implemented |

## E. Mobile, Forms 2.0, UX Patterns & Installer UI
| Capability | Module / Location | Status |
| --- | --- | --- |
| `BottomNavigation`, `BottomSheet`, `FloatingActionButton`, `SwipeActionItem`, `PullToRefresh`, `StickyActionBar`, `MediaCaptureInput`, `MobileFilterSheet` | `src/components/ui/mobile/MobilePrimitives.tsx` | implemented |
| `OnboardingChecklist`, `GuidedTour`, `SavedViewsBar`, `UndoBanner` | `src/components/ui/ux-patterns/UxPatterns.tsx` | implemented |
| `RichTextEditor` (XSS-safe preview), `ValidationSummary`, `RepeatableFieldSection`, `DynamicFormBuilder`, `FormReviewScreen`, `AddressContactFields` | `src/components/ui/forms/EnterpriseForms.tsx` | implemented |
| `SetupWizard`, `DependencyCheckList`, `InstallationProgressTracker`, `UpdateManagerPanel` (presentation-only) | `src/components/business/installer/InstallerExperience.tsx` | implemented |

## F. Enterprise Business, Workspace Windows, Charts & Industry Patterns
| Capability | Module / Location | Status |
| --- | --- | --- |
| `DataTable` 2.0 (saved views, column reorder, grouping, inline edit, CSV export, virtualization, responsive mobile cards) | `src/components/business/data-table/DataTable.tsx` | improved |
| `SplitPanel` (collapsible/resizable), `ContextualDetailPanel`, `AdaptiveWorkspaceLayout` | `src/components/business/shell/ShellComponents.tsx` | improved |
| `WorkspaceModeContainer` (standard/focus/presentation/fullscreen), `DockablePanel`, `FloatingWindow`, `MultiPanelWorkspace` | `src/components/business/workspace/WorkspaceWindowManager.tsx` | implemented |
| `KanbanBoard` (WIP limits/tags), `GanttChart`, `ResourceAllocationBoard`, `CommentThread`, `ApprovalQueue`, `WorkflowBuilder`, `DataComparisonTable`, `DetailPanel` | `src/components/business/` | implemented |
| 8 Cross-Industry Blueprints (`Agency`, `SaaS`, `Commerce`, `ProfessionalServices`, `EnterpriseAdmin`, `Logistics`, `Finance`, `Education`) | `src/components/business/patterns/` | implemented |
| 18 Standard Charts + 13 Advanced Charts (including `GeoRegionChart`) + `ExternalChart` / `ChartAdapterProvider` | `@wendoro/ui/charts`, `@wendoro/ui/charts/advanced` | implemented |
| `PromptComposerBar`, `AssistantResponseCard`, `PresenceAvatarStack`, `LiveActivityPulse` | `src/components/business/future-modules/AiRealtimeAndContracts.tsx` | implemented |

## G. Planned Extension Contracts & Intentionally Excluded Scope
| Capability | Target / Contract | Status |
| --- | --- | --- |
| Visual canvas & node-diagram studio engines (freehand vector canvas, WebGL) | `VisualStudioExtensionContract` (`WendoroModuleManifest` v2.0.0) | planned |
| Clinical/Healthcare EHR banner, vitals timeline & triage specialization | `HealthcareClinicalExtensionContract` (`WendoroModuleManifest` v2.0.0) | planned |
| Native WebSocket transport, CRDT sync, and live LLM inference clients | Delegated to host app / `@wendoro/sdk` | intentionally excluded |
| OS package managers, filesystem installers, executable downloaders & DB/Auth SDKs | Violates backend-agnostic library boundary | intentionally excluded |
| Heavy external chart libraries bundled in core `@wendoro/ui` dependencies | Integrated only via optional host adapters (`ChartAdapterProvider`) | intentionally excluded |
