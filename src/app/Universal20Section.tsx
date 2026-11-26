import * as React from 'react';
import {
  Activity,
  Bell,
  Compass,
  FolderKanban,
  Home,
  Layers,
  LayoutGrid,
  Settings,
  Terminal,
  Users,
} from 'lucide-react';
import { DataComparisonTable } from '@/components/business/data-comparison';
import { AiAssistantPanel, TokenUsageBar } from '@/components/ai';
import { CodeEditor, MarkdownEditor, VisualFormBuilder } from '@/components/editors';
import { FleetTrackingWorkspace, SignatureCapturePad } from '@/components/adapters';
import { ChatLayout } from '@/components/business/communication';
import { SubscriptionOverview } from '@/components/business/commerce';
import { ActiveSessionsList } from '@/components/business/identity';
import { CandlestickChart, NetworkGraphChart } from '@/components/charts/advanced';
import {
  AssistantResponseCard,
  LiveActivityPulse,
  PresenceAvatarStack,
  PromptComposerBar,
} from '@/components/business/future-modules';
import {
  DependencyCheckList,
  InstallationProgressTracker,
  SetupWizard,
  UpdateManagerPanel,
} from '@/components/business/installer';
import {
  HelpCenterPanel,
  SettingsPageLayout,
  SettingsSection,
} from '@/components/business/admin-settings';
import { FileManager, type FileManagerItem } from '@/components/business/file-manager';
import {
  AgencyWorkspacePattern,
  CommerceOperationsPattern,
  CreatorPublishingPattern,
  CrmSalesPipelinePattern,
  EducationMembershipPattern,
  EnterpriseAdminPattern,
  FinanceOperationsPattern,
  HospitalityBookingPattern,
  InventoryWarehousePattern,
  LogisticsOperationsPattern,
  ProfessionalServicesPattern,
  ProjectDeliveryPattern,
  SaasAdminPattern,
} from '@/components/business/patterns';
import {
  ApprovalQueue,
  CommentThread,
  GanttChart,
  ResourceAllocationBoard,
} from '@/components/business/productivity';
import { WorkflowBuilder } from '@/components/business/workflow-builder';
import {
  DockablePanel,
  FloatingWindow,
  MultiPanelWorkspace,
  WorkspaceModeContainer,
} from '@/components/business/workspace';
import { ExternalChart } from '@/components/charts';
import { GeoRegionChart } from '@/components/charts/advanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ButtonGroup,
  QuantityStepper,
  SegmentedControl,
  SelectableChipGroup,
} from '@/components/ui/controls';
import {
  Banner,
  CircularProgress,
  InlineLoader,
  MultiStepProgress,
  TransferProgressCard,
} from '@/components/ui/feedback';
import { DynamicFormBuilder, RichTextEditor } from '@/components/ui/forms';
import { AppLauncher, CommandLauncher, QuickLaunchPanel, type LauncherEntry } from '@/components/ui/launcher';
import {
  BottomNavigation,
  BottomSheet,
  FloatingActionButton,
  MediaCaptureInput,
  MobileFilterSheet,
  PullToRefresh,
  StickyActionBar,
  SwipeActionItem,
  type MediaCaptureFile,
} from '@/components/ui/mobile';
import { FullscreenMobileMenu, WorkspaceSwitcher } from '@/components/ui/navigation-ext';
import {
  InfiniteScrollContainer,
  ScrollArea,
  ScrollProgressIndicator,
  ScrollToTopButton,
  VirtualizedList,
} from '@/components/ui/scroll';
import { Sidebar, SidebarItem, SidebarNestedGroup, SidebarSection } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { LevelControlSlider, RangeSlider, Slider, TimelineScrubber } from '@/components/ui/slider';
import {
  AutosaveIndicator,
  ConnectionStatusBanner,
  MaintenanceState,
  PermissionDeniedState,
  type ConnectionState,
  type SaveStatus,
} from '@/components/ui/system-states';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnboardingChecklist, SavedViewsBar, UndoBanner } from '@/components/ui/ux-patterns';
import {
  WENDORO_DEMO_ACTIVITY,
  WENDORO_DEMO_APPROVALS,
  WENDORO_DEMO_BOOKING_SLOTS,
  WENDORO_DEMO_COMMENTS,
  WENDORO_DEMO_COURSES,
  WENDORO_DEMO_FINANCE,
  WENDORO_DEMO_FULFILMENT_STAGES,
  WENDORO_DEMO_GANTT_PERIODS,
  WENDORO_DEMO_GANTT_TASKS,
  WENDORO_DEMO_GEO_REGIONS,
  WENDORO_DEMO_KANBAN_CARDS,
  WENDORO_DEMO_KANBAN_COLUMNS,
  WENDORO_DEMO_LOGISTICS,
  WENDORO_DEMO_ORDERS,
  WENDORO_DEMO_ORG_TREE,
  WENDORO_DEMO_PRODUCTS,
  WENDORO_DEMO_RESOURCE_PERIODS,
  WENDORO_DEMO_RESOURCES,
  WENDORO_DEMO_ROLES,
  WENDORO_DEMO_SERIES,
  WENDORO_DEMO_SERVICES,
  WENDORO_DEMO_WORKFLOW_NODES,
  WENDORO_DEMO_WORKSPACES,
} from '@/data/wendoro-demo-data';

type IndustryKey =
  | 'agency'
  | 'saas'
  | 'commerce'
  | 'services'
  | 'enterprise'
  | 'logistics'
  | 'finance'
  | 'education'
  | 'crm'
  | 'inventory'
  | 'delivery'
  | 'hospitality'
  | 'creator';

const DEMO_FILES: FileManagerItem[] = [
  {
    id: 'fm-1',
    name: 'Brand Guidelines & Tokens',
    kind: 'folder',
    sizeLabel: '14 items',
    updatedAt: 'Today, 09:40',
    owner: 'Demo User',
    shared: true,
    tags: ['design-system', 'tokens'],
    path: '/workspace/brand-tokens',
  },
  {
    id: 'fm-2',
    name: 'Q4-Governance-Audit.pdf',
    kind: 'document',
    sizeBytes: 2450000,
    sizeLabel: '2.4 MB',
    updatedAt: 'Yesterday',
    owner: 'Sample Member A',
    mimeType: 'application/pdf',
    shared: true,
    tags: ['audit', 'compliance'],
    path: '/workspace/reports/q4-governance.pdf',
  },
  {
    id: 'fm-3',
    name: 'Workspace-Hero-Banner.png',
    kind: 'image',
    sizeBytes: 1180000,
    sizeLabel: '1.1 MB',
    updatedAt: 'Nov 22',
    owner: 'Sample Member B',
    mimeType: 'image/png',
    tags: ['marketing'],
    path: '/workspace/media/hero.png',
  },
  {
    id: 'fm-4',
    name: 'Product-Walkthrough.mp4',
    kind: 'media',
    sizeBytes: 18400000,
    sizeLabel: '18.4 MB',
    updatedAt: 'Nov 20',
    owner: 'Sample Member C',
    mimeType: 'video/mp4',
    path: '/workspace/media/walkthrough.mp4',
  },
];

const DEMO_VIRTUAL_ROWS = Array.from({ length: 120 }, (_, idx) => ({
  id: `row-${idx + 1}`,
  title: `Sample Record #${String(idx + 1).padStart(3, '0')}`,
  category: idx % 3 === 0 ? 'Operations' : idx % 3 === 1 ? 'Analytics' : 'Compliance',
}));

export function Universal20Section() {
  const [industry, setIndustry] = React.useState<IndustryKey>('agency');
  const [settingsCategory, setSettingsCategory] = React.useState('workspace');
  const [settingsDirty, setSettingsDirty] = React.useState(false);
  const [workspaceDisplayName, setWorkspaceDisplayName] = React.useState('Sample Organization');
  const [repoFiles, setRepoFiles] = React.useState<FileManagerItem[]>(DEMO_FILES);
  const [workspaceId, setWorkspaceId] = React.useState(WENDORO_DEMO_WORKSPACES[0].id);
  const [mobileNavTab, setMobileNavTab] = React.useState('home');
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [undoVisible, setUndoVisible] = React.useState(false);
  const [selectedRegion, setSelectedRegion] = React.useState(WENDORO_DEMO_GEO_REGIONS[0].id);
  const [richNote, setRichNote] = React.useState('Summary note for [Sample Organization](https://wendoro.in) QA review.');
  const [approvals, setApprovals] = React.useState(WENDORO_DEMO_APPROVALS);
  const [comments, setComments] = React.useState(WENDORO_DEMO_COMMENTS);
  const [kanbanCards, setKanbanCards] = React.useState(WENDORO_DEMO_KANBAN_CARDS);
  const [wfNodes, setWfNodes] = React.useState(WENDORO_DEMO_WORKFLOW_NODES);
  const [financeTx, setFinanceTx] = React.useState(WENDORO_DEMO_FINANCE);
  const [selectedServiceId, setSelectedServiceId] = React.useState(WENDORO_DEMO_SERVICES[0].id);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string | undefined>(undefined);
  const [activeView, setActiveView] = React.useState('all');
  const [capturedFiles, setCapturedFiles] = React.useState<MediaCaptureFile[]>([
    { id: 'f1', name: 'sample-receipt-demo.pdf', size: 48200, type: 'application/pdf' },
  ]);
  const [onboardingSteps, setOnboardingSteps] = React.useState([
    { id: 'ob-1', title: 'Configure workspace contrast tokens', completed: true },
    { id: 'ob-2', title: 'Connect responsive mobile drawer & bottom bar', completed: false, description: 'Verify 44px touch targets.' },
    { id: 'ob-3', title: 'Review automated workflow rules', completed: false },
  ]);

  // Final Scope Override interactive showcase state
  const [rangeVal, setRangeVal] = React.useState<[number, number]>([25, 75]);
  const [steppedVal, setSteppedVal] = React.useState(50);
  const [verticalVal, setVerticalVal] = React.useState(65);
  const [timelineSec, setTimelineSec] = React.useState(42);
  const [timelinePlaying, setTimelinePlaying] = React.useState(false);
  const [volumeLevel, setVolumeLevel] = React.useState(72);
  const [brightnessLevel, setBrightnessLevel] = React.useState(85);
  const [segmentView, setSegmentView] = React.useState('board');
  const [chipValues, setChipValues] = React.useState<string[]>(['enterprise', 'accessible']);
  const [seatQuantity, setSeatQuantity] = React.useState(12);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [fullscreenMenuOpen, setFullscreenMenuOpen] = React.useState(false);
  const [infiniteCount, setInfiniteCount] = React.useState(8);
  const [floatingOpen, setFloatingOpen] = React.useState(true);
  const [dockPos, setDockPos] = React.useState<'left' | 'right' | 'bottom' | 'floating' | 'collapsed'>('right');
  const [connStatus, setConnStatus] = React.useState<ConnectionState>('online');
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('saved');
  const [installPhase, setInstallPhase] = React.useState<'installing' | 'failed' | 'completed' | 'rolled_back'>('installing');
  const [updateStatus, setUpdateStatus] = React.useState<'update_available' | 'downloading' | 'completed' | 'failed'>('update_available');
  const [wizardOrg, setWizardOrg] = React.useState('Sample Organization');
  const [promptInput, setPromptInput] = React.useState('');
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = React.useState('Summarize active throughput metrics for Sample Organization.');
  const [favoriteLauncherIds, setFavoriteLauncherIds] = React.useState<string[]>(['desk', 'analytics']);
  const [launchedNotice, setLaunchedNotice] = React.useState<string | null>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const toggleFavorite = (id: string) => {
    setFavoriteLauncherIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const launcherEntries: LauncherEntry[] = [
    {
      id: 'desk',
      name: 'Wendoro Desk',
      description: 'Unified service & ticket workspace',
      category: 'product',
      shortcut: 'G D',
      recent: true,
      favorite: favoriteLauncherIds.includes('desk'),
      onLaunch: () => setLaunchedNotice('Opened Wendoro Desk (Demo)'),
    },
    {
      id: 'analytics',
      name: 'Telemetry & BI',
      description: 'Charts, funnels, and regional insights',
      category: 'module',
      badge: '2.0',
      recent: true,
      favorite: favoriteLauncherIds.includes('analytics'),
      onLaunch: () => setLaunchedNotice('Opened Telemetry & BI (Demo)'),
    },
    {
      id: 'ops',
      name: 'Operations Console',
      description: 'Logistics & workflow automation',
      category: 'app',
      favorite: favoriteLauncherIds.includes('ops'),
      onLaunch: () => setLaunchedNotice('Opened Operations Console (Demo)'),
    },
    {
      id: 'sample-ws',
      name: 'Sample Organization',
      description: 'Primary synthetic tenant',
      category: 'workspace',
      favorite: favoriteLauncherIds.includes('sample-ws'),
      onLaunch: () => setLaunchedNotice('Switched to Sample Organization'),
    },
  ];

  const handleApprovalDecision = (id: string, decision: 'approved' | 'rejected', note?: string) => {
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: decision, decisionNote: note } : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <Banner
        variant="default"
        title="Wendoro UI 2.0 — Cross-Industry, Multi-Device & Universal Controls Showcase (Demo)"
        description="Explore sliders, segmented controls, scroll virtualization, resizable nested navigation, launchers, installer UI, workspace windowing, system states, AI-native slots, and 8 multi-industry workspace blueprints."
      />

      <Tabs defaultValue="controls-scroll" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="controls-scroll">Controls, Sliders & Scroll</TabsTrigger>
          <TabsTrigger value="launchers-installer">Launchers, Loaders & Installer UI</TabsTrigger>
          <TabsTrigger value="workspace-ai">Window Manager, States & AI</TabsTrigger>
          <TabsTrigger value="industry">13 Industry Blueprints</TabsTrigger>
          <TabsTrigger value="files-settings">File Manager, Settings & Help</TabsTrigger>
          <TabsTrigger value="workflow">Workflow, Gantt & Collaboration</TabsTrigger>
          <TabsTrigger value="mobile">Mobile & Touch Primitives</TabsTrigger>
          <TabsTrigger value="forms-geo">Forms 2.0 & Geo / Adapters</TabsTrigger>
          <TabsTrigger value="ai-editors-platform">AI, Editors & Platform 2.0</TabsTrigger>
        </TabsList>

        <TabsContent value="controls-scroll" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sliders, Scrubbers & Level Controls</CardTitle>
                <CardDescription>
                  Single stepped slider with marks, vertical mixer slider, dual-thumb range, media timeline scrubber, and volume/brightness level bars.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex-1 space-y-4">
                    <Slider
                      label="Throughput Allocation"
                      value={steppedVal}
                      onValueChange={setSteppedVal}
                      step={25}
                      formatValue={(v) => `${v}%`}
                      marks={[
                        { value: 0, label: '0%' },
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 75, label: '75%' },
                        { value: 100, label: '100%' },
                      ]}
                    />

                    <RangeSlider
                      label="Budget Guardrail Range"
                      value={rangeVal}
                      onValueChange={setRangeVal}
                      formatValue={(v) => `$${v}k`}
                    />
                  </div>

                  <div className="flex justify-center border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                    <Slider
                      orientation="vertical"
                      label="Gain"
                      value={verticalVal}
                      onValueChange={setVerticalVal}
                      formatValue={(v) => `${v}%`}
                      verticalHeight={132}
                    />
                  </div>
                </div>

                <TimelineScrubber
                  label="Playback timeline"
                  currentTime={timelineSec}
                  duration={180}
                  playing={timelinePlaying}
                  onTogglePlay={() => setTimelinePlaying((p) => !p)}
                  onSeek={setTimelineSec}
                  chapters={[
                    { id: 'c1', time: 0, label: 'Intro' },
                    { id: 'c2', time: 60, label: 'KPI Review' },
                    { id: 'c3', time: 135, label: 'Sign-off' },
                  ]}
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <LevelControlSlider
                    kind="volume"
                    value={volumeLevel}
                    onValueChange={setVolumeLevel}
                  />
                  <LevelControlSlider
                    kind="brightness"
                    value={brightnessLevel}
                    onValueChange={setBrightnessLevel}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmented Controls, Chips, ButtonGroup & Stepper</CardTitle>
                <CardDescription>
                  Keyboard-navigable controls for view switching, multi-select filter chips, grouped toolbars, and numeric steppers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">Segmented View Switcher</div>
                  <SegmentedControl
                    aria-label="Workspace layout mode"
                    value={segmentView}
                    onValueChange={setSegmentView}
                    options={[
                      { value: 'board', label: 'Board', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
                      { value: 'list', label: 'List', icon: <Layers className="h-3.5 w-3.5" /> },
                      { value: 'metrics', label: 'Metrics', icon: <Activity className="h-3.5 w-3.5" /> },
                    ]}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">Selectable Filter Chips</div>
                  <SelectableChipGroup
                    aria-label="Capability tags"
                    value={chipValues}
                    onValueChange={setChipValues}
                    items={[
                      { value: 'enterprise', label: 'Enterprise', count: 14 },
                      { value: 'accessible', label: 'WCAG 2.2 AA', count: 9 },
                      { value: 'mobile', label: 'Touch First', count: 11 },
                      { value: 'dark', label: 'High Contrast', count: 4 },
                    ]}
                  />
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <QuantityStepper
                    label="Workspace seats"
                    unit="seats"
                    min={1}
                    max={100}
                    value={seatQuantity}
                    onValueChange={setSeatQuantity}
                  />

                  <div className="space-y-1.5">
                    <div className="text-xs font-medium text-muted-foreground">Attached Button Group</div>
                    <ButtonGroup aria-label="Document actions">
                      <Button size="sm" variant="outline">Duplicate</Button>
                      <Button size="sm" variant="outline">Export</Button>
                      <Button size="sm" variant="primary">Publish</Button>
                    </ButtonGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Resizable Nested Sidebar & Mobile Menu</CardTitle>
                <CardDescription>
                  Drag separator or use Arrow keys to resize; supports icon-only collapse and nested groups.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-[260px] overflow-hidden rounded-[var(--wdr-radius-md)] border border-border">
                  <Sidebar
                    collapsible
                    resizable
                    collapsed={sidebarCollapsed}
                    onCollapsedChange={setSidebarCollapsed}
                    defaultWidth={220}
                    minWidth={170}
                    maxWidth={280}
                    header={<span className="text-xs font-bold">Sample Org</span>}
                  >
                    <SidebarSection title="Core">
                      <SidebarItem active icon={<Home className="h-4 w-4" />}>
                        Overview
                      </SidebarItem>
                      <SidebarNestedGroup label="Modules" icon={<Layers className="h-4 w-4" />} defaultOpen>
                        <SidebarItem>Billing UI</SidebarItem>
                        <SidebarItem>Directory</SidebarItem>
                      </SidebarNestedGroup>
                    </SidebarSection>
                  </Sidebar>
                </div>
                <Button size="sm" variant="outline" onClick={() => setFullscreenMenuOpen(true)}>
                  Open FullscreenMobileMenu
                </Button>
                <FullscreenMobileMenu
                  open={fullscreenMenuOpen}
                  onOpenChange={setFullscreenMenuOpen}
                  title="Wendoro Workspace Menu"
                  groups={[
                    {
                      id: 'g1',
                      title: 'Primary',
                      items: [
                        { id: 'm1', label: 'Operations Dashboard', description: 'KPIs & status', active: true, onSelect: () => {} },
                        { id: 'm2', label: 'Workflow Automation', description: 'Triggers & approvals', onSelect: () => {} },
                      ],
                    },
                    {
                      id: 'g2',
                      title: 'Administration',
                      items: [
                        { id: 'm3', label: 'Tenant Settings', icon: <Settings className="h-4 w-4" />, onSelect: () => {} },
                      ],
                    },
                  ]}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ScrollArea, Progress & Back-to-Top</CardTitle>
                <CardDescription>
                  Native-compatible custom scrollbar, reading progress, and incremental loading.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ScrollProgressIndicator targetRef={scrollAreaRef} />
                <ScrollArea ref={scrollAreaRef} maxHeight={180} className="rounded-[var(--wdr-radius-md)] border border-border p-3">
                  <InfiniteScrollContainer
                    hasMore={infiniteCount < 16}
                    onLoadMore={() => setInfiniteCount((c) => Math.min(16, c + 4))}
                  >
                    <div className="space-y-2">
                      {Array.from({ length: infiniteCount }, (_, i) => (
                        <div key={i} className="rounded border border-border bg-muted/30 px-2.5 py-1.5 text-xs">
                          Activity Log Entry #{i + 1} — Sample Organization
                        </div>
                      ))}
                    </div>
                  </InfiniteScrollContainer>
                </ScrollArea>
                <div className="flex justify-end">
                  <ScrollToTopButton targetRef={scrollAreaRef} alwaysVisible />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>VirtualizedList (120 Synthetic Rows)</CardTitle>
                <CardDescription>
                  Windowed DOM slice rendering for smooth large-dataset scrolling.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VirtualizedList
                  items={DEMO_VIRTUAL_ROWS}
                  itemHeight={46}
                  viewportHeight={235}
                  getKey={(item) => item.id}
                  renderItem={(item) => (
                    <div className="flex items-center justify-between px-3 py-2.5 text-xs">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {item.category}
                      </span>
                    </div>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="launchers-installer" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
            <div className="flex flex-wrap items-center gap-3">
              <AppLauncher entries={launcherEntries} onToggleFavorite={toggleFavorite} />
              <CommandLauncher entries={launcherEntries} onToggleFavorite={toggleFavorite} />
            </div>
            {launchedNotice && (
              <span className="rounded bg-primary-subtle px-2.5 py-1 text-xs font-medium text-primary-subtle-foreground">
                {launchedNotice}
              </span>
            )}
          </div>

          <QuickLaunchPanel entries={launcherEntries} onToggleFavorite={toggleFavorite} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Loaders, Shimmer Skeleton & Transfer Progress</CardTitle>
                <CardDescription>
                  Deterministic & indeterminate progress rings, inline loaders, multi-step status, and upload/download/install cards.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-6">
                  <CircularProgress value={78} label="Sync progress" />
                  <CircularProgress indeterminate label="Background indexing" />
                  <InlineLoader label="Validating schema tokens…" />
                </div>

                <div className="space-y-2">
                  <Skeleton shimmer height="18px" className="w-2/3" />
                  <Skeleton shimmer height="14px" className="w-full" />
                </div>

                <TransferProgressCard
                  mode="upload"
                  title="quarterly-export-demo.csv"
                  subtitle="4.2 MB of 6.0 MB uploaded"
                  progress={70}
                  onPauseToggle={() => {}}
                  onCancel={() => {}}
                />

                <MultiStepProgress
                  title="Bundle Verification Stages"
                  steps={[
                    { id: 's1', label: 'Validate theme variables', status: 'completed' },
                    { id: 's2', label: 'Check tree-shaken entry points', status: 'active', detail: 'Analyzing @wendoro/ui' },
                    { id: 's3', label: 'Finalize build artifacts', status: 'pending' },
                  ]}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <SetupWizard
                title="First-Run Workspace Setup (UI Only)"
                steps={[
                  {
                    id: 'org',
                    title: 'Workspace Identity',
                    description: 'Assign a display name for synthetic tenant setup.',
                    validate: () => (!wizardOrg.trim() ? 'Workspace name is required.' : null),
                    content: (
                      <label className="block space-y-1 text-xs">
                        <span className="font-medium text-foreground">Display name</span>
                        <input
                          type="text"
                          value={wizardOrg}
                          onChange={(e) => setWizardOrg(e.target.value)}
                          className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
                        />
                      </label>
                    ),
                  },
                  {
                    id: 'deps',
                    title: 'Environment Checks',
                    content: (
                      <DependencyCheckList
                        items={[
                          { id: 'd1', name: 'React Peer Runtime', requiredVersion: '>=18', detectedVersion: '19.x', status: 'ready' },
                          { id: 'd2', name: 'Lucide Icon Set', requiredVersion: '>=0.400', detectedVersion: 'Verified', status: 'ready' },
                          { id: 'd3', name: 'Optional Chart Adapter', note: 'Lazy loaded only when imported', status: 'warning' },
                        ]}
                      />
                    ),
                  },
                ]}
                nextSteps={[
                  { id: 'open', label: 'Open Workspace', onSelect: () => setLaunchedNotice('Setup finished (Demo)') },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InstallationProgressTracker
              title="Module Installation Tracker (UI Simulation)"
              phase={installPhase}
              overallProgress={installPhase === 'completed' ? 100 : installPhase === 'failed' ? 62 : 74}
              statusMessage="Presentation-only installer telemetry (no OS/shell execution)."
              steps={[
                { id: 'i1', label: 'Fetch module manifest', status: 'completed' },
                { id: 'i2', label: 'Verify design token compatibility', status: installPhase === 'failed' ? 'failed' : 'completed' },
                { id: 'i3', label: 'Register workspace routes', status: installPhase === 'completed' ? 'completed' : 'active' },
              ]}
              logs={[
                '[info] Checking @wendoro/ui contract v2.0.0',
                '[info] Verified CSS custom properties and high-contrast tokens',
              ]}
              onRetry={() => setInstallPhase('completed')}
              onRollback={() => setInstallPhase('rolled_back')}
              onCompleteNext={() => setInstallPhase('installing')}
              completeNextLabel="Reset simulation"
            />

            <div className="space-y-4">
              <UpdateManagerPanel
                currentVersion="2.0.0-beta.1"
                availableVersion="2.0.0"
                status={updateStatus}
                progress={68}
                releaseNotes={[
                  'Added dual-thumb RangeSlider, VirtualizedList, and Window Manager.',
                  'Added presentation-only SetupWizard and ConnectionStatusBanner.',
                ]}
                onStartUpdate={() => setUpdateStatus('completed')}
                onCheckUpdates={() => setUpdateStatus('update_available')}
                onRetry={() => setUpdateStatus('downloading')}
                onRollback={() => setUpdateStatus('update_available')}
              />
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setInstallPhase('failed')}>
                  Simulate Install Failure
                </Button>
                <Button size="sm" variant="outline" onClick={() => setInstallPhase('completed')}>
                  Simulate Install Complete
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workspace-ai" className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {(['online', 'offline', 'reconnecting', 'syncing', 'sync_error', 'maintenance'] as ConnectionState[]).map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    variant={connStatus === st ? 'primary' : 'outline'}
                    onClick={() => setConnStatus(st)}
                  >
                    {st}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <AutosaveIndicator
                  status={saveStatus}
                  savedAtLabel="12:04 PM"
                  onSaveNow={() => setSaveStatus('saved')}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSaveStatus((s) => (s === 'saved' ? 'unsaved' : s === 'unsaved' ? 'saving' : 'saved'))}
                >
                  Cycle Save State
                </Button>
              </div>
            </div>

            <ConnectionStatusBanner
              status={connStatus}
              detail="Sync channel: Sample Organization"
              lastSyncedLabel="Last check 1m ago"
              onRetry={() => setConnStatus('online')}
            />
          </div>

          <MultiPanelWorkspace
            title="Multi-Panel Studio & Dockable Workspace"
            leftPanel={
              <div className="rounded-[var(--wdr-radius-md)] border border-border bg-background p-3 text-xs space-y-2">
                <div className="font-semibold text-foreground">Explorer Slot</div>
                <p className="text-muted-foreground">Supports Focus, Presentation, and Fullscreen modes via toolbar.</p>
                <Button size="sm" variant="outline" onClick={() => setFloatingOpen((o) => !o)}>
                  {floatingOpen ? 'Hide Floating Inspector' : 'Show Floating Inspector'}
                </Button>
              </div>
            }
            rightPanel={
              <DockablePanel title="Properties Dock" position={dockPos} onPositionChange={setDockPos}>
                <p className="text-muted-foreground">
                  Dockable panel supports left, right, bottom, floating sheet, or collapsed states.
                </p>
              </DockablePanel>
            }
            floatingSlot={
              <FloatingWindow
                open={floatingOpen}
                onClose={() => setFloatingOpen(false)}
                title="Floating Tool Window"
                initialPosition={{ x: 28, y: 84 }}
                width={260}
              >
                <div className="space-y-1.5">
                  <div className="font-medium">Draggable & Arrow-Key Movable</div>
                  <p className="text-muted-foreground">Drag header or focus header and press Arrow keys.</p>
                </div>
              </FloatingWindow>
            }
          >
            <WorkspaceModeContainer title="Canvas Stage" className="border-0">
              <div className="space-y-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <PresenceAvatarStack
                    collaborators={[
                      { id: 'c1', name: 'Demo Lead', role: 'Admin', state: 'editing' },
                      { id: 'c2', name: 'Sample Ops', role: 'Analyst', state: 'viewing' },
                      { id: 'c3', name: 'QA Reviewer', role: 'Editor', state: 'idle' },
                    ]}
                  />
                  <LiveActivityPulse label="3 teammates viewing (synthetic)" />
                </div>
                <p>
                  This inner container demonstrates Focus, Presentation, and Fullscreen viewport toggles with Escape recovery.
                </p>
              </div>
            </WorkspaceModeContainer>
          </MultiPanelWorkspace>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <PromptComposerBar
                value={promptInput}
                onValueChange={setPromptInput}
                onSubmit={(text) => {
                  setLastSubmittedPrompt(text);
                  setPromptInput('');
                }}
                attachments={[{ id: 'att-1', label: 'q4-metrics-demo.csv' }]}
                modeSelector={
                  <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    <Terminal className="h-3 w-3" aria-hidden="true" /> Presentation UI
                  </span>
                }
              />
              <AssistantResponseCard
                title="Structured Assistant Output (Host-Supplied)"
                confidenceLabel="Verified UI Slot"
                body={`Prompt received by host handler: "${lastSubmittedPrompt}"`}
                citations={[
                  { id: 'src-1', label: 'Sample Organization Report', href: 'https://wendoro.in' },
                ]}
                onFeedback={() => {}}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <PermissionDeniedState
                requiredRole="Workspace Owner"
                onGoBack={() => {}}
                onRequestAccess={() => setLaunchedNotice('Access request event triggered (Demo)')}
              />
              <MaintenanceState
                windowLabel="Sunday 02:00 – 02:30 UTC"
                statusUrl="https://wendoro.in"
                onRefresh={() => {}}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="industry" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['agency', 'Agency'],
                  ['saas', 'SaaS Admin'],
                  ['commerce', 'E-Commerce'],
                  ['services', 'Prof. Services'],
                  ['enterprise', 'Enterprise Admin'],
                  ['logistics', 'Logistics'],
                  ['finance', 'Finance'],
                  ['education', 'Education'],
                  ['crm', 'CRM Pipeline'],
                  ['inventory', 'Inventory & Warehouse'],
                  ['delivery', 'Project Delivery'],
                  ['hospitality', 'Hospitality'],
                  ['creator', 'Creator & Publishing'],
                ] as const
              ).map(([key, label]) => (
                <Button
                  key={key}
                  size="sm"
                  variant={industry === key ? 'primary' : 'outline'}
                  onClick={() => setIndustry(key)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <WorkspaceSwitcher
              workspaces={WENDORO_DEMO_WORKSPACES}
              activeWorkspaceId={workspaceId}
              onSelectWorkspace={setWorkspaceId}
            />
          </div>

          {industry === 'agency' && (
            <AgencyWorkspacePattern
              clients={WENDORO_DEMO_WORKSPACES}
              activeClientId={workspaceId}
              onSelectClient={setWorkspaceId}
              kanbanColumns={WENDORO_DEMO_KANBAN_COLUMNS}
              kanbanCards={kanbanCards}
              onMoveCard={(cardId, toCol) =>
                setKanbanCards((prev) =>
                  prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c))
                )
              }
              resources={WENDORO_DEMO_RESOURCES}
              resourcePeriods={WENDORO_DEMO_RESOURCE_PERIODS}
              approvals={approvals}
              onApprovalDecision={handleApprovalDecision}
            />
          )}

          {industry === 'saas' && (
            <SaasAdminPattern
              tenants={WENDORO_DEMO_WORKSPACES}
              activeTenantId={workspaceId}
              onSelectTenant={setWorkspaceId}
              subscriptionPlan="Enterprise Multi-Tenant"
              billingCycleLabel="Synthetic Annual Plan · Next invoice Dec 1, 2026"
              usageMetrics={[
                { id: 'u1', label: 'API Requests (Demo)', used: '820k', limit: '1M', percent: 82, status: 'on_track' },
                { id: 'u2', label: 'Active Seats', used: '48', limit: '50', percent: 96, status: 'at_risk' },
                { id: 'u3', label: 'Workflow Runs', used: '14.2k', limit: '25k', percent: 57, status: 'on_track' },
              ]}
              planSubjects={[
                { id: 'starter', title: 'Starter', subtitle: '$49/mo' },
                { id: 'pro', title: 'Pro Agency', subtitle: '$149/mo', recommended: true },
                { id: 'ent', title: 'Enterprise', subtitle: 'Custom' },
              ]}
              planFeatures={[
                { id: 'f1', label: 'Workspaces', values: { starter: '3', pro: '25', ent: 'Unlimited' } },
                { id: 'f2', label: 'Custom Brand Tokens', values: { starter: false, pro: true, ent: true } },
                { id: 'f3', label: 'Audit Log Retention', values: { starter: '30 days', pro: '1 year', ent: '7 years' } },
              ]}
              onboardingSteps={onboardingSteps}
              onToggleOnboardingStep={(id, completed) =>
                setOnboardingSteps((prev) =>
                  prev.map((s) => (s.id === id ? { ...s, completed } : s))
                )
              }
            />
          )}

          {industry === 'commerce' && (
            <CommerceOperationsPattern
              orders={WENDORO_DEMO_ORDERS}
              products={WENDORO_DEMO_PRODUCTS}
              fulfilmentStages={WENDORO_DEMO_FULFILMENT_STAGES}
            />
          )}

          {industry === 'services' && (
            <ProfessionalServicesPattern
              services={WENDORO_DEMO_SERVICES}
              slots={WENDORO_DEMO_BOOKING_SLOTS}
              selectedServiceId={selectedServiceId}
              selectedSlotId={selectedSlotId}
              onSelectService={setSelectedServiceId}
              onBookSlot={(id) => setSelectedSlotId((prev) => (prev === id ? undefined : id))}
            />
          )}

          {industry === 'enterprise' && (
            <EnterpriseAdminPattern
              orgTree={WENDORO_DEMO_ORG_TREE}
              roles={WENDORO_DEMO_ROLES}
              approvals={approvals}
              onApprovalDecision={handleApprovalDecision}
              auditEvents={WENDORO_DEMO_ACTIVITY}
            />
          )}

          {industry === 'logistics' && (
            <LogisticsOperationsPattern
              assets={WENDORO_DEMO_LOGISTICS}
              deliveryStages={WENDORO_DEMO_FULFILMENT_STAGES}
            />
          )}

          {industry === 'finance' && (
            <FinanceOperationsPattern
              transactions={financeTx}
              onToggleReconcile={(id) =>
                setFinanceTx((prev) =>
                  prev.map((tx) => (tx.id === id ? { ...tx, reconciled: !tx.reconciled } : tx))
                )
              }
              budgetActualLabel="$84,200"
              budgetTargetLabel="$100,000"
              budgetPercent={84}
            />
          )}

          {industry === 'education' && (
            <EducationMembershipPattern
              courses={WENDORO_DEMO_COURSES}
              communityFeed={WENDORO_DEMO_ACTIVITY}
            />
          )}

          {industry === 'crm' && (
            <CrmSalesPipelinePattern
              columns={WENDORO_DEMO_KANBAN_COLUMNS}
              deals={kanbanCards}
              onMoveDeal={(cardId, toCol) =>
                setKanbanCards((prev) =>
                  prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c))
                )
              }
              accounts={[
                {
                  id: 'crm-1',
                  accountName: 'Sample Organization',
                  owner: 'Demo User',
                  stage: 'Proposal',
                  dealValueLabel: '$120,000',
                  health: 'active',
                },
                {
                  id: 'crm-2',
                  accountName: 'Northwind Holdings (Demo)',
                  owner: 'Sample Member A',
                  stage: 'Security Review',
                  dealValueLabel: '$85,000',
                  health: 'pending',
                },
              ]}
            />
          )}

          {industry === 'inventory' && (
            <InventoryWarehousePattern
              zones={[
                { id: 'z1', zoneName: 'Zone A · High-Velocity', occupancyPercent: 72, skuCount: 148 },
                { id: 'z2', zoneName: 'Zone B · Cold Storage', occupancyPercent: 91, skuCount: 64 },
                { id: 'z3', zoneName: 'Zone C · Bulk Pallets', occupancyPercent: 54, skuCount: 92 },
              ]}
              skus={[
                { id: 'sku-1', sku: 'WDR-104', itemName: 'Modular Terminal Stand', zone: 'Zone A', onHand: 42, reorderPoint: 20, status: 'active' },
                { id: 'sku-2', sku: 'WDR-209', itemName: 'Thermal Label Cartridge', zone: 'Zone B', onHand: 8, reorderPoint: 15, status: 'warning' },
              ]}
              onReorderSku={(skuId) => setLaunchedNotice(`Reorder queued for ${skuId} (Demo)`)}
            />
          )}

          {industry === 'delivery' && (
            <ProjectDeliveryPattern
              kanbanColumns={WENDORO_DEMO_KANBAN_COLUMNS}
              kanbanCards={kanbanCards}
              onMoveCard={(cardId, toCol) =>
                setKanbanCards((prev) =>
                  prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c))
                )
              }
              resources={WENDORO_DEMO_RESOURCES}
              periods={WENDORO_DEMO_RESOURCE_PERIODS}
            />
          )}

          {industry === 'hospitality' && (
            <HospitalityBookingPattern
              units={[
                { id: 'u-1', unitCode: 'STE-402', category: 'Executive Suite', guestOrTenant: 'Demo Guest A', windowLabel: 'Nov 26 – Nov 29', status: 'pending', statusLabel: 'Arrival Ready' },
                { id: 'u-2', unitCode: 'STD-118', category: 'Standard Queen', guestOrTenant: 'Demo Guest B', windowLabel: 'Nov 25 – Nov 27', status: 'active', statusLabel: 'Occupied' },
                { id: 'u-3', unitCode: 'CNF-02', category: 'Boardroom Hall', guestOrTenant: 'Sample Organization', windowLabel: '14:00 – 17:00', status: 'completed', statusLabel: 'Prepared' },
              ]}
              onCheckIn={(id) => setLaunchedNotice(`Checked in unit ${id} (Demo)`)}
            />
          )}

          {industry === 'creator' && (
            <CreatorPublishingPattern
              editorialStages={[
                { id: 'ed-1', label: 'Drafting', state: 'completed' },
                { id: 'ed-2', label: 'Editorial QA', state: 'current' },
                { id: 'ed-3', label: 'Scheduled', state: 'upcoming' },
                { id: 'ed-4', label: 'Published', state: 'upcoming' },
              ]}
              drafts={[
                { id: 'dr-1', title: 'Wendoro UI 2.0 Release Briefing', channel: 'Engineering Digest', author: 'Demo User', scheduledFor: 'Nov 28 · 09:00 UTC', stage: 'scheduled' },
                { id: 'dr-2', title: 'WCAG 2.2 Contrast Token Guide', channel: 'Design Notes', author: 'Sample Member A', scheduledFor: 'Dec 02 · 14:00 UTC', stage: 'review' },
              ]}
              onPublishDraft={(id) => setLaunchedNotice(`Published draft ${id} (Demo)`)}
            />
          )}
        </TabsContent>

        <TabsContent value="files-settings" className="space-y-8">
          <FileManager
            items={repoFiles}
            breadcrumbs={[
              { label: 'Sample Organization', href: '#root' },
              { label: 'Shared Repository' },
            ]}
            onUploadFiles={(files) =>
              setRepoFiles((prev) => [
                ...prev,
                ...files.map((f, idx) => ({
                  id: `up-${Date.now()}-${idx}`,
                  name: f.name,
                  kind: 'document' as const,
                  sizeBytes: f.size,
                  sizeLabel: `${Math.max(1, Math.round(f.size / 1024))} KB`,
                  updatedAt: 'Just now',
                  owner: 'Demo User',
                  mimeType: f.type || 'application/octet-stream',
                })),
              ])
            }
            onBulkAction={(action, ids) => {
              if (action === 'delete') {
                setRepoFiles((prev) => prev.filter((item) => !ids.includes(item.id)));
              }
            }}
          />

          <SettingsPageLayout
            categories={[
              { id: 'workspace', label: 'Workspace Profile', badge: 'Core' },
              { id: 'security', label: 'Governance & Access', badge: '2.0' },
              { id: 'notifications', label: 'Alert Channels' },
            ]}
            activeCategoryId={settingsCategory}
            onCategoryChange={setSettingsCategory}
            dirty={settingsDirty}
            onSave={() => setSettingsDirty(false)}
            onDiscard={() => {
              setWorkspaceDisplayName('Sample Organization');
              setSettingsDirty(false);
            }}
          >
            <SettingsSection
              title={
                settingsCategory === 'workspace'
                  ? 'Workspace Identity'
                  : settingsCategory === 'security'
                    ? 'Governance Policies'
                    : 'Alert Routing'
              }
              description="Synthetic workspace configuration section using Wendoro semantic tokens."
              badge={settingsDirty ? 'Modified' : 'Synced'}
            >
              <div className="space-y-2 text-xs">
                <label htmlFor="u20-ws-name" className="block font-medium text-foreground">
                  Organization Display Name
                </label>
                <input
                  id="u20-ws-name"
                  type="text"
                  value={workspaceDisplayName}
                  onChange={(e) => {
                    setWorkspaceDisplayName(e.target.value);
                    setSettingsDirty(true);
                  }}
                  className="h-9 w-full max-w-md rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
                />
              </div>
            </SettingsSection>
          </SettingsPageLayout>

          <HelpCenterPanel
            articles={[
              {
                id: 'ha-1',
                title: 'Importing @wendoro/ui subpath bundles',
                category: 'Architecture',
                summary: 'Use modular entry points such as @wendoro/ui/core, /forms, /data, and /workspace.',
                content:
                  'Each Wendoro UI subpath ships ESM, CJS, and alias-free TypeScript declarations so host apps bundle only the components they import.',
                updatedLabel: 'Nov 2026',
              },
              {
                id: 'ha-2',
                title: 'Configuring High-Contrast & Custom Theme Presets',
                category: 'Theming',
                summary: 'Wrap your app in ThemeProvider with defaultPresetId or runtime contrast toggles.',
                content:
                  'Wendoro preserves light, dark, and high-contrast semantic tokens without leaking global CSS variables when scoped is enabled.',
                updatedLabel: 'Nov 2026',
              },
            ]}
            faqs={[
              {
                id: 'faq-1',
                question: 'Does @wendoro/ui include any backend API clients?',
                answer: 'No. All components are strictly presentational and delegate persistence to host callbacks.',
              },
              {
                id: 'faq-2',
                question: 'Are SVG charts bundled into @wendoro/ui or @wendoro/ui/business?',
                answer: 'No. Charts live strictly under @wendoro/ui/charts and @wendoro/ui/charts/advanced.',
              },
            ]}
            onSubmitTicket={() => setLaunchedNotice('Support request captured by demo handler.')}
          />
        </TabsContent>

        <TabsContent value="workflow" className="space-y-6">
          <WorkflowBuilder
            nodes={wfNodes}
            onChange={setWfNodes}
          />

          <GanttChart periods={WENDORO_DEMO_GANTT_PERIODS} tasks={WENDORO_DEMO_GANTT_TASKS} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ResourceAllocationBoard
              periods={WENDORO_DEMO_RESOURCE_PERIODS}
              resources={WENDORO_DEMO_RESOURCES}
            />
            <CommentThread
              comments={comments}
              onAddComment={(body) =>
                setComments((prev) => [
                  ...prev,
                  {
                    id: `cmt-${Date.now()}`,
                    author: 'Demo User',
                    role: 'Reviewer',
                    timestamp: 'Just now',
                    body,
                  },
                ])
              }
            />
          </div>

          <ApprovalQueue items={approvals} onDecision={handleApprovalDecision} />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mobile Frame & Touch Controls (375px Simulation)</CardTitle>
                <CardDescription>
                  Swipe items, pull-to-refresh, bottom navigation, bottom sheet, and sticky bar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mx-auto max-w-[375px] overflow-hidden rounded-[var(--wdr-radius-lg)] border-2 border-border bg-background">
                  <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
                    <span className="text-sm font-bold">Mobile Workspace</span>
                    <MobileFilterSheet activeFilterCount={2} onClearAll={() => {}}>
                      <div className="text-sm text-muted-foreground">
                        Synthetic filter criteria panel (Status, Priority, Tenant).
                      </div>
                    </MobileFilterSheet>
                  </div>

                  <div className="p-3 space-y-3">
                    <PullToRefresh
                      refreshing={refreshing}
                      onRefresh={() => {
                        setRefreshing(true);
                        setTimeout(() => setRefreshing(false), 600);
                      }}
                    >
                      <div className="space-y-2">
                        <SwipeActionItem
                          actions={[
                            {
                              id: 'archive',
                              label: 'Archive',
                              tone: 'destructive',
                              onAction: () => setUndoVisible(true),
                            },
                          ]}
                        >
                          <div className="text-xs">
                            <div className="font-semibold text-foreground">Sample Record #01 (Swipeable)</div>
                            <div className="text-muted-foreground">Use Actions button or swipe left to reveal Archive.</div>
                          </div>
                        </SwipeActionItem>
                      </div>
                    </PullToRefresh>

                    {undoVisible && (
                      <UndoBanner
                        message="Sample Record #01 archived."
                        canUndo
                        onUndo={() => setUndoVisible(false)}
                        onDismiss={() => setUndoVisible(false)}
                      />
                    )}

                    <Button className="w-full" variant="primary" onClick={() => setSheetOpen(true)}>
                      Open Mobile BottomSheet
                    </Button>

                    <StickyActionBar
                      summary="2 items selected"
                      primaryAction={
                        <Button size="sm" variant="primary" onClick={() => setSheetOpen(true)}>
                          Confirm
                        </Button>
                      }
                    />
                  </div>

                  <BottomNavigation
                    items={[
                      { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: mobileNavTab === 'home', onSelect: () => setMobileNavTab('home') },
                      { id: 'tasks', label: 'Board', icon: <FolderKanban className="h-4 w-4" />, badge: 3, active: mobileNavTab === 'tasks', onSelect: () => setMobileNavTab('tasks') },
                      { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" />, active: mobileNavTab === 'team', onSelect: () => setMobileNavTab('team') },
                      { id: 'alerts', label: 'Alerts', icon: <Bell className="h-4 w-4" />, active: mobileNavTab === 'alerts', onSelect: () => setMobileNavTab('alerts') },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Capture, Saved Views & Onboarding</CardTitle>
                <CardDescription>
                  Touch-friendly file/camera picker, saved workspace filter views, and onboarding checklist.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <SavedViewsBar
                  views={[
                    { id: 'all', label: 'All Records', count: 24 },
                    { id: 'assigned', label: 'Assigned to Me', count: 8 },
                    { id: 'pending', label: 'Needs Review', count: 4 },
                  ]}
                  activeViewId={activeView}
                  onSelectView={setActiveView}
                />

                <MediaCaptureInput
                  label="Receipt or Field Photo Capture"
                  files={capturedFiles}
                  onFilesAdd={(newFiles) =>
                    setCapturedFiles((prev) => [
                      ...prev,
                      ...newFiles.map((f, idx) => ({
                        id: `f-${Date.now()}-${idx}`,
                        name: f.name,
                        size: f.size,
                        type: f.type,
                      })),
                    ])
                  }
                  onFileRemove={(id) =>
                    setCapturedFiles((prev) => prev.filter((f) => f.id !== id))
                  }
                />

                <OnboardingChecklist
                  steps={onboardingSteps}
                  onToggleStep={(id, completed) =>
                    setOnboardingSteps((prev) =>
                      prev.map((s) => (s.id === id ? { ...s, completed } : s))
                    )
                  }
                />
              </CardContent>
            </Card>
          </div>

          <BottomSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            title="Mobile Contextual Action Sheet"
            description="Accessible bottom drawer for touch devices."
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Confirm bulk update for Sample Organization records.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSheetOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setSheetOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </BottomSheet>

          <FloatingActionButton
            label="Quick create record"
            icon={<Compass className="h-5 w-5" />}
            onClick={() => setSheetOpen(true)}
            className="hidden lg:inline-flex"
          />
        </TabsContent>

        <TabsContent value="forms-geo" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <GeoRegionChart
              title="Regional Throughput Choropleth (Demo)"
              subtitle="Click or keyboard-select any region tile"
              regions={WENDORO_DEMO_GEO_REGIONS}
              selectedRegionId={selectedRegion}
              onSelectRegion={(r) => setSelectedRegion(r.id)}
              unitLabel="Sample Units"
              valueFormatter={{ type: 'integer' }}
            />

            <ExternalChart
              kind="bar"
              title="ExternalChart Adapter Bridge (Demo)"
              subtitle="Zero-bloat native SVG fallback when no third-party adapter is registered"
              data={WENDORO_DEMO_SERIES}
              xKey="month"
              series={[
                { key: 'primary', label: 'Primary' },
                { key: 'target', label: 'Target' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Form Builder (Conditional + Review Step)</CardTitle>
                <CardDescription>
                  Declarative schema-driven form with conditional visibility and summary validation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicFormBuilder
                  showReviewStep
                  fields={[
                    { name: 'orgName', label: 'Organization Name', type: 'text', required: true, placeholder: 'Sample Organization' },
                    {
                      name: 'model',
                      label: 'Business Model',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Multi-Tenant SaaS', value: 'saas' },
                        { label: 'Multi-Client Agency', value: 'agency' },
                        { label: 'Marketplace', value: 'marketplace' },
                      ],
                    },
                    {
                      name: 'seatLimit',
                      label: 'Estimated Seats',
                      type: 'number',
                      when: (vals) => vals.model === 'saas' || vals.model === 'agency',
                    },
                    { name: 'enableHc', label: 'Enable High-Contrast Default', type: 'checkbox' },
                  ]}
                  initialValues={{ model: 'saas', orgName: 'Sample Organization' }}
                  onSubmit={() => setUndoVisible(true)}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <RichTextEditor
                label="Release & Governance Notes (XSS-Safe)"
                value={richNote}
                onChange={setRichNote}
              />

              <DataComparisonTable
                subjects={[
                  { id: 'core', title: 'Native SVG Charts', subtitle: '0 external deps' },
                  { id: 'adapter', title: 'ChartAdapter Bridge', subtitle: 'Lazy optional engine', recommended: true },
                ]}
                rows={[
                  { id: 'ssr', label: 'SSR Friendly', values: { core: true, adapter: 'Adapter-dependent' } },
                  { id: 'a11y', label: 'HTML Table Toggle', values: { core: true, adapter: true } },
                  { id: 'bundle', label: 'Core Bundle Impact', values: { core: '0 KB on @wendoro/ui', adapter: 'Lazy loaded' } },
                ]}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-editors-platform" className="space-y-6">
          <AiAssistantPanel
            models={[
              { id: 'fast', name: 'Wendoro Fast', provider: 'Host Adapter', contextWindow: '128k', latencyTier: 'fast' },
              { id: 'reason', name: 'Wendoro Reasoner', provider: 'Host Adapter', contextWindow: '256k', latencyTier: 'reasoning' },
            ]}
            selectedModelId="fast"
            onSelectModel={() => {}}
            messages={[
              { id: 'ai-m1', role: 'assistant', content: 'Ready for host-driven prompt workflows across Sample Organization.', timestamp: '09:30' },
            ]}
            promptValue={promptInput}
            onPromptChange={setPromptInput}
            onSubmitPrompt={(text) => {
              setLastSubmittedPrompt(text);
              setPromptInput('');
            }}
          />

          <TokenUsageBar promptTokens={1200} completionTokens={450} budgetTokens={8000} estimatedCostLabel="$0.01 est." />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MarkdownEditor value={richNote} onChange={setRichNote} />
            <CodeEditor
              value={"import { Button } from '@wendoro/ui';\nimport { AiAssistantPanel } from '@wendoro/ui/ai';"}
              language="tsx"
              readOnly
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <VisualFormBuilder
              initialFields={[
                { id: 'vf-1', label: 'Organization Name', type: 'text', required: true },
                { id: 'vf-2', label: 'Primary Contact', type: 'email', required: true },
              ]}
            />
            <SignatureCapturePad signerName="Demo User" />
          </div>

          <FleetTrackingWorkspace
            markers={[
              { id: 'mk1', label: 'North Hub (Demo)', lat: 37.774, lng: -122.419, status: 'active', category: 'Dispatch' },
              { id: 'mk2', label: 'East Hub (Demo)', lat: 40.712, lng: -74.006, status: 'pending', category: 'Transit' },
            ]}
            routes={[{ id: 'rt1', origin: 'North Hub', destination: 'East Hub', distanceLabel: '420 km', etaLabel: '4h 15m' }]}
            geofences={[{ id: 'gf1', name: 'Zone A', radiusLabel: '25 km', active: true }]}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CandlestickChart
              title="Asset Index OHLC (Demo)"
              data={[
                { label: 'Mon', open: 100, high: 112, low: 96, close: 108 },
                { label: 'Tue', open: 108, high: 116, low: 102, close: 104 },
                { label: 'Wed', open: 104, high: 120, low: 103, close: 118 },
              ]}
            />
            <NetworkGraphChart
              title="Hybrid Architecture Topology"
              nodes={[
                { id: 'tokens', label: '@wendoro/ui/tokens', group: 'Layer 1', weight: 4 },
                { id: 'core', label: '@wendoro/ui', group: 'Layer 2', weight: 5 },
                { id: 'ai', label: '@wendoro/ui/ai', group: 'Layer 4', weight: 3 },
                { id: 'adapters', label: '@wendoro/ui/adapters', group: 'Layer 5', weight: 3 },
              ]}
              edges={[
                { source: 'core', target: 'tokens', label: 'tokens' },
                { source: 'ai', target: 'core', label: 'ui' },
                { source: 'adapters', target: 'core', label: 'slots' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SubscriptionOverview
              planName="Enterprise Multi-Tenant (Demo)"
              status="active"
              renewalDateLabel="Dec 31, 2026"
              seatsLabel="18 / 25 seats"
            />
            <ActiveSessionsList
              sessions={[
                { id: 'ses-1', deviceName: 'Workstation Browser', locationLabel: 'Primary Office (Demo)', lastActiveLabel: 'Now', current: true },
              ]}
              onRevoke={() => {}}
            />
          </div>

          <ChatLayout
            conversations={[
              { id: 'c1', title: 'Sample Organization Ops', preview: 'Ready for review.', timestamp: '10:00 AM', unreadCount: 1, status: 'active' },
            ]}
            activeConversationId="c1"
            onSelectConversation={() => {}}
            messages={[{ id: 'm1', sender: 'Demo User', timestamp: '10:00 AM', body: 'All Wendoro UI 2.0 checks verified.' }]}
            onSendMessage={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
