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
} from '@wendoro/ui/tokens';
import { LineChart, GaugeChart } from '@wendoro/ui/charts';
import { FunnelChart } from '@wendoro/ui/charts/advanced';
import { AnalyticsSummaryCard } from '@wendoro/ui/business';
import { DensityProvider, useReducedMotion } from '@wendoro/ui/hooks';

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
        <ConsumerWorkspace />
      </DensityProvider>
    </ThemeProvider>
  );
}

function ConsumerWorkspace() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const [activeNav, setActiveNav] = React.useState<'overview' | 'team'>('overview');
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div
      data-testid="consumer-root"
      data-resolved-theme={resolvedTheme}
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
            <Button variant="outline" onClick={toggleTheme}>
              Switch Theme
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(true)}>
              Open Consumer Dialog
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
        </div>

        {activeNav === 'team' && <TeamDirectory members={TEAM_MEMBERS} />}

        <ActivityFeed items={ACTIVITY_ITEMS} demoLabel="Consumer fixture demo data" />

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
