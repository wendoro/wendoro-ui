import * as React from 'react';
import '@wendoro/ui/styles.css';
import {
  ThemeProvider,
  useTheme,
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dialog,
  DialogFooter,
  Sidebar,
  SidebarSection,
  SidebarItem,
  Alert,
  StatusBadge,
  UserProfile,
  TeamDirectory,
  ActivityFeed,
  DataTable,
  BottomSheet,
  RangeSlider,
  SegmentedControl,
  AppLauncher,
  ScrollArea,
  ConnectionStatusBanner,
  AutosaveIndicator,
  type DataTableColumn,
  type TeamMember,
  type ActivityFeedEntry,
  type ThemeMode,
} from '@wendoro/ui';
import {
  brandColors,
  semanticColorTokens,
  typographyScale,
  spacing,
  radius,
  shadows,
  chartPaletteValues,
  densityScales,
  motionDurations,
  touchTargetTokens,
} from '@wendoro/ui/tokens';
import { LineChart, GaugeChart, ExternalChart } from '@wendoro/ui/charts';
import { FunnelChart, GeoRegionChart } from '@wendoro/ui/charts/advanced';
import {
  AnalyticsSummaryCard,
  WorkflowBuilder,
  SetupWizard,
  WorkspaceModeContainer,
  PresenceAvatarStack,
  PromptComposerBar,
  WENDORO_MODULE_CONTRACT_VERSION,
} from '@wendoro/ui/business';
import { DensityProvider, DirectionProvider, useReducedMotion, useBreakpoint } from '@wendoro/ui/hooks';
import { TokenUsageBar } from '@wendoro/ui/ai';
import { DiffViewer } from '@wendoro/ui/editors';
import { MapContainer, WENDORO_BUNDLE_BUDGETS } from '@wendoro/ui/adapters';
import { ButtonGroup, useUndoAction } from '@wendoro/ui/core';
import { SelectableChipGroup } from '@wendoro/ui/forms';
import { WorkspaceSwitcher } from '@wendoro/ui/navigation';
import { VirtualizedList } from '@wendoro/ui/data';
import { MarkdownEditor } from '@wendoro/ui/editor';
import { FileManager } from '@wendoro/ui/workspace';
import { SubscriptionOverview } from '@wendoro/ui/commerce';
import { HelpCenterPanel, SettingsPageLayout, SettingsSection } from '@wendoro/ui/admin';
import { CrmSalesPipelinePattern } from '@wendoro/ui/industry';

interface ServiceRow {
  id: string;
  product: string;
  status: 'active' | 'error';
}

const SERVICE_ROWS: ServiceRow[] = [
  { id: 'svc-1', product: 'Wendoro Desk', status: 'active' },
  { id: 'svc-2', product: 'Wendoro Platform', status: 'error' },
];

const SERVICE_COLUMNS: DataTableColumn<ServiceRow>[] = [
  {
    key: 'product',
    header: 'Product',
    sortable: true,
    accessor: (row) => row.product,
    cell: (row) => row.product,
  },
  {
    key: 'status',
    header: 'State',
    cell: (row) => <StatusBadge status={row.status} />,
  },
];

const TEAM_MEMBERS: TeamMember[] = [
  { id: 'member-a', name: 'Sample Member A', affiliation: 'Demo Workspace · Sample member' },
  { id: 'member-b', name: 'Sample Member B', affiliation: 'Demo Workspace · Sample member' },
];

const ACTIVITY_ITEMS: ActivityFeedEntry[] = [
  {
    id: 'act-1',
    actor: 'Sample Member A',
    actorSubtitle: 'Demo Workspace',
    action: 'reviewed',
    entity: 'Wendoro Desk UI integration',
    timestamp: 'Just now',
  },
];

export function ConsumerApp({ initialTheme = 'light' }: { initialTheme?: ThemeMode }) {
  return (
    <ThemeProvider defaultTheme="light" forcedTheme={initialTheme === 'light' ? undefined : initialTheme} disableStorage={initialTheme !== 'light'}>
      <DensityProvider defaultDensity="comfortable" scoped>
        <DirectionProvider defaultLocale="en-US" scoped>
          <ConsumerWorkspace />
        </DirectionProvider>
      </DensityProvider>
    </ThemeProvider>
  );
}

function ConsumerWorkspace() {
  const { resolvedTheme, toggleTheme, contrast, toggleContrast } = useTheme();
  const reducedMotion = useReducedMotion();
  const bp = useBreakpoint();
  const [activeNav, setActiveNav] = React.useState<'overview' | 'team'>('overview');
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const undoState = useUndoAction('initial');

  return (
    <div
      data-testid="consumer-root"
      data-resolved-theme={resolvedTheme}
      data-contrast={contrast}
      data-device-category={bp.deviceCategory}
      data-touch-min={touchTargetTokens.minimum}
      data-brand-yellow={brandColors.primaryYellow}
      data-destructive-subtle-fg={semanticColorTokens.destructiveSubtleForeground}
      data-token-space={spacing[4]}
      data-token-radius={radius.medium}
      data-token-shadow={shadows.small}
      data-token-h1={typographyScale.h1.fontSize}
      data-chart-color={chartPaletteValues.light[0]}
      data-density-pad={densityScales.comfortable.cellPaddingY}
      data-motion-duration={motionDurations.standard}
      data-reduced-motion={String(reducedMotion)}
      className="flex min-h-screen bg-background text-foreground"
    >
      <Sidebar header={<span>Wendoro Desk</span>}>
        <SidebarSection title="Workspace">
          <SidebarItem active={activeNav === 'overview'} onClick={() => setActiveNav('overview')}>
            Overview
          </SidebarItem>
          <SidebarItem active={activeNav === 'team'} onClick={() => setActiveNav('team')}>
            Directory
          </SidebarItem>
        </SidebarSection>
      </Sidebar>

      <main className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <UserProfile variant="inline" name="Demo Lead" affiliation="Demo Workspace" />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={toggleContrast}>
              Toggle Contrast
            </Button>
            <Button variant="outline" onClick={toggleTheme}>
              Switch Theme
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              Open Consumer Dialog
            </Button>
            <Button variant="outline" onClick={() => setSheetOpen(true)}>
              Open Sheet
            </Button>
          </div>
        </div>

        <Alert variant="destructive" title="Webhook attention required">
          Destructive subtle foreground alert verification.
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Consumer App Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              aria-label="Consumer workspace input"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter workspace"
            />
            <DataTable
              aria-label="Service status table"
              data={SERVICE_ROWS}
              columns={SERVICE_COLUMNS}
              getRowId={(r) => r.id}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LineChart
            title="Consumer Sample Chart"
            data={[
              { m: 'Jan', val: 10 },
              { m: 'Feb', val: 20 },
            ]}
            xKey="m"
            series={[{ key: 'val', label: 'Sample Val' }]}
          />
          <GaugeChart title="Consumer Readiness Gauge" value={85} min={0} max={100} />
          <FunnelChart
            title="Consumer Funnel"
            stages={[
              { id: 'f1', label: 'Stage 1', value: 100 },
              { id: 'f2', label: 'Stage 2', value: 50 },
            ]}
          />
          <AnalyticsSummaryCard
            title="Consumer Summary"
            items={[{ id: 's1', label: 'Units', value: '100', direction: 'positive' }]}
          />
          <GeoRegionChart
            title="Consumer Geo"
            regions={[{ id: 'na', code: 'NA', name: 'North America', value: 120 }]}
          />
          <ExternalChart
            kind="bar"
            title="Consumer External Bridge"
            data={[{ m: 'Jan', val: 10 }]}
            xKey="m"
            series={[{ key: 'val', label: 'Val' }]}
          />
        </div>

        <WorkflowBuilder
          nodes={[
            { id: 'n1', kind: 'trigger', title: 'Start', enabled: true, nextNodeIds: ['n2'] },
            { id: 'n2', kind: 'action', title: 'Notify', enabled: true, nextNodeIds: [] },
          ]}
          onChange={() => {}}
        />

        {activeNav === 'team' && <TeamDirectory members={TEAM_MEMBERS} />}

        <ActivityFeed items={ACTIVITY_ITEMS} demoLabel="Consumer fixture demo data" />

        <div data-module-contract={WENDORO_MODULE_CONTRACT_VERSION} className="space-y-3">
          <ConnectionStatusBanner status="online" detail="Consumer sync verified" />
          <div className="flex flex-wrap items-center gap-3">
            <AutosaveIndicator status="saved" savedAtLabel="Now" />
            <SegmentedControl
              defaultValue="grid"
              options={[
                { value: 'grid', label: 'Grid' },
                { value: 'list', label: 'List' },
              ]}
            />
            <AppLauncher
              entries={[{ id: 'desk', name: 'Wendoro Desk', category: 'product', onLaunch: () => {} }]}
            />
            <PresenceAvatarStack collaborators={[{ id: 'c1', name: 'Demo Lead', state: 'editing' }]} />
          </div>
          <RangeSlider label="Consumer range" defaultValue={[10, 90]} />
          <ScrollArea maxHeight={80}>
            <div className="text-xs text-muted-foreground">Scrollable consumer container</div>
          </ScrollArea>
          <WorkspaceModeContainer title="Consumer Workspace Mode">
            <PromptComposerBar value="" onValueChange={() => {}} onSubmit={() => {}} />
          </WorkspaceModeContainer>
          <SetupWizard
            steps={[{ id: 's1', title: 'Confirm', content: <div className="text-xs">Ready</div> }]}
          />
          <TokenUsageBar promptTokens={500} completionTokens={200} budgetTokens={4000} />
          <DiffViewer original="a" modified="b" />
          <MapContainer
            data-budget={WENDORO_BUNDLE_BUDGETS.adaptersMaxGzipKb}
            data-undo-ready={String(!undoState.canUndo)}
            markers={[{ id: 'm1', label: 'Demo Hub', lat: 10, lng: 20, status: 'active' }]}
          />
          <ButtonGroup>
            <Button size="sm" variant="outline" onClick={() => undoState.commit('updated')}>
              Commit Undo
            </Button>
          </ButtonGroup>
          <SelectableChipGroup
            aria-label="Subpath Chips"
            value={['a']}
            onValueChange={() => {}}
            items={[{ value: 'a', label: 'Chip A' }]}
          />
          <WorkspaceSwitcher
            workspaces={[{ id: 'w1', name: 'Sample Organization' }]}
            activeWorkspaceId="w1"
            onSelectWorkspace={() => {}}
          />
          <VirtualizedList
            items={[{ id: 'v1', name: 'Row 1' }]}
            getKey={(r) => r.id}
            renderItem={(r) => <div className="px-2 py-1 text-xs">{r.name}</div>}
            viewportHeight={60}
          />
          <MarkdownEditor value="**Subpath**" onChange={() => {}} />
          <FileManager
            items={[{ id: 'f1', name: 'Repo.pdf', kind: 'document', sizeLabel: '1 MB', updatedAt: 'Now', owner: 'Demo User' }]}
          />
          <SubscriptionOverview planName="Pro" status="active" renewalDateLabel="Dec 2026" seatsLabel="5 / 10 seats" />
          <SettingsPageLayout
            categories={[{ id: 'c1', label: 'General' }]}
            activeCategoryId="c1"
            onCategoryChange={() => {}}
          >
            <SettingsSection title="Subpath Admin">
              <HelpCenterPanel
                articles={[{ id: 'a1', title: 'Guide', category: 'Docs', summary: 'Summary', content: 'Body' }]}
                faqs={[{ id: 'q1', question: 'Q?', answer: 'A.' }]}
              />
            </SettingsSection>
          </SettingsPageLayout>
          <CrmSalesPipelinePattern
            columns={[{ id: 'col1', title: 'Lead' }]}
            deals={[{ id: 'd1', columnId: 'col1', title: 'Deal 1' }]}
            accounts={[{ id: 'ac1', accountName: 'Sample Organization', owner: 'Demo User', stage: 'Lead', dealValueLabel: '$10k', health: 'active' }]}
          />
        </div>

        <BottomSheet open={sheetOpen} onOpenChange={setSheetOpen} title="Consumer Mobile Sheet">
          <p className="text-sm text-muted-foreground">BottomSheet integration verified.</p>
        </BottomSheet>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Consumer Dialog"
          description="Rendered from @wendoro/ui compiled distribution."
        >
          <p className="text-sm text-muted-foreground">Dialog body content.</p>
          <DialogFooter>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      </main>
    </div>
  );
}
