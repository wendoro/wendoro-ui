import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Activity, BarChart3, CheckCircle2, FolderKanban, Layers } from 'lucide-react';
import { KpiCard } from '../src/components/business/kpi-card';
import { MetricCard } from '../src/components/business/metric-card';
import { StatusBadge } from '../src/components/business/status-badge';
import { DataTable, type DataTableColumn } from '../src/components/business/data-table';
import { FilterBar } from '../src/components/business/filter-bar';
import { ActivityTimeline, CalendarGrid, KanbanBoard, TaskList } from '../src/components/business/productivity';
import { AppShell, DashboardHeader, DashboardSidebar, PageContainer } from '../src/components/business/shell';
import { TargetVsActual } from '../src/components/business/analytics';
import { BarChart, DonutChart, LineChart, Sparkline } from '../src/components/charts';
import { FunnelChart, HeatmapChart } from '../src/components/charts/advanced';
import { Banner } from '../src/components/ui/feedback';
import { Button } from '../src/components/ui/button';
import { SidebarItem, SidebarSection } from '../src/components/ui/sidebar';
import {
  WENDORO_DEMO_DISTRIBUTION,
  WENDORO_DEMO_KANBAN_CARDS,
  WENDORO_DEMO_KANBAN_COLUMNS,
  WENDORO_DEMO_MODULES,
  WENDORO_DEMO_SERIES,
  type EcosystemModuleRow,
} from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/Dashboard Showcases',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Three complete integrated dashboard scenarios (Executive Analytics, Operations & Activity, Project & Workflow) combining AppShell, Sidebar, Header, KPI cards, Charts, DataTable, ActivityTimeline, and Filters using 100% synthetic demo data.',
      },
    },
  },
};

export default meta;

const tableColumns: DataTableColumn<EcosystemModuleRow>[] = [
  { key: 'id', header: 'Record ID', sortable: true, accessor: (r) => r.id, cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: 'module', header: 'Example Project', sortable: true, accessor: (r) => r.module, cell: (r) => <span className="font-medium">{r.module}</span> },
  { key: 'maintainer', header: 'Assignee (Demo)', sortable: true, accessor: (r) => r.maintainer, cell: (r) => r.maintainer },
  { key: 'throughput', header: 'Sample Units', sortable: true, align: 'right', accessor: (r) => r.throughput, cell: (r) => r.throughput.toLocaleString() },
  { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} /> },
];

function ExecutiveAnalyticsDashboardView() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const rows = WENDORO_DEMO_MODULES.filter((r) => {
    const matchSearch = !search || r.module.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppShell
      sidebar={
        <DashboardSidebar header={<span className="font-bold">Wendoro Insights</span>}>
          <SidebarSection title="Executive">
            <SidebarItem icon={<BarChart3 className="h-4 w-4" />} active>Executive Overview</SidebarItem>
            <SidebarItem icon={<Layers className="h-4 w-4" />}>Sample Portfolios</SidebarItem>
          </SidebarSection>
        </DashboardSidebar>
      }
      header={
        <DashboardHeader
          title="Executive Analytics Dashboard (Demo)"
          breadcrumbs={[{ label: 'Sample Organization' }, { label: 'Executive Analytics' }]}
          actions={<Button size="sm" variant="primary">Export Summary</Button>}
        />
      }
    >
      <PageContainer className="space-y-6 py-6">
        <Banner variant="default" title="Synthetic Showcase Data" description="Sample Organization & Demo User figures shown below are illustrative only." />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <MetricCard label="Sample Throughput" value="2,160" delta="+14.2%" trend="up" sparkline={<Sparkline data={[120, 148, 162, 155, 194, 218]} variant="area" aria-label="Sample sparkline" />} />
          <KpiCard title="Target Attainment" actual="88%" target="95%" completion={88} status="on_track" />
          <MetricCard label="Active Demo Tracks" value="6" delta="100% synced" trend="neutral" />
          <TargetVsActual title="Sample Audit Coverage" actualLabel="92" targetLabel="100" percentage={92} variant="success" />
        </div>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Filter Sample Records…"
          filters={[
            {
              id: 'status',
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'all', label: 'All statuses' },
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' },
              ],
            },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LineChart
              title="Illustrative Growth Trajectory"
              data={WENDORO_DEMO_SERIES}
              xKey="month"
              series={[
                { key: 'primary', label: 'Observed (Demo)', marker: 'circle' },
                { key: 'target', label: 'Target (Demo)', dashArray: '4 3', marker: 'square' },
              ]}
              thresholds={[{ value: 180, label: 'Baseline Goal' }]}
            />
          </div>
          <DonutChart
            title="Portfolio Share (Demo)"
            data={WENDORO_DEMO_DISTRIBUTION}
            centerLabel="Units"
            centerValue="1,000"
          />
        </div>

        <DataTable
          aria-label="Sample executive records"
          data={rows}
          columns={tableColumns}
          getRowId={(r) => r.id}
          pageSize={4}
        />
      </PageContainer>
    </AppShell>
  );
}

export const ExecutiveAnalyticsDashboard: StoryObj = {
  render: () => <ExecutiveAnalyticsDashboardView />,
};

export const OperationsAndActivityDashboard: StoryObj = {
  render: () => (
    <AppShell
      sidebar={
        <DashboardSidebar header={<span className="font-bold">Wendoro Desk</span>}>
          <SidebarSection title="Operations">
            <SidebarItem icon={<Activity className="h-4 w-4" />} active>Activity & Load</SidebarItem>
            <SidebarItem icon={<CheckCircle2 className="h-4 w-4" />}>Review Queue</SidebarItem>
          </SidebarSection>
        </DashboardSidebar>
      }
      header={
        <DashboardHeader
          title="Operations & Activity Dashboard (Demo)"
          breadcrumbs={[{ label: 'Sample Organization' }, { label: 'Operations' }]}
          actions={<StatusBadge status="active" label="Demo Live View" />}
        />
      }
    >
      <PageContainer className="space-y-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BarChart
            title="Operations Volume by Month (Demo)"
            data={WENDORO_DEMO_SERIES}
            categoryKey="month"
            layout="grouped"
            series={[
              { key: 'primary', label: 'Resolved' },
              { key: 'secondary', label: 'Incoming' },
            ]}
          />
          <HeatmapChart
            title="Weekly Queue Intensity (Demo)"
            xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            yLabels={['Desk', 'Flow', 'Support']}
            cells={[
              { x: 'Mon', y: 'Desk', value: 4 }, { x: 'Tue', y: 'Desk', value: 7 }, { x: 'Wed', y: 'Desk', value: 6 }, { x: 'Thu', y: 'Desk', value: 9 }, { x: 'Fri', y: 'Desk', value: 5 },
              { x: 'Mon', y: 'Flow', value: 3 }, { x: 'Tue', y: 'Flow', value: 8 }, { x: 'Wed', y: 'Flow', value: 5 }, { x: 'Thu', y: 'Flow', value: 6 }, { x: 'Fri', y: 'Flow', value: 4 },
              { x: 'Mon', y: 'Support', value: 7 }, { x: 'Tue', y: 'Support', value: 5 }, { x: 'Wed', y: 'Support', value: 8 }, { x: 'Thu', y: 'Support', value: 4 }, { x: 'Fri', y: 'Support', value: 3 },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DataTable
              aria-label="Operations queue"
              data={WENDORO_DEMO_MODULES}
              columns={tableColumns}
              getRowId={(r) => r.id}
              searchable
              multiSort
              pageSize={4}
            />
          </div>
          <div className="rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
            <ActivityTimeline
              title="Recent Sample Activity"
              items={[
                { id: 't1', title: 'Verified Sample Record #01', actor: 'Demo User', timestamp: '5m ago', status: 'completed' },
                { id: 't2', title: 'Updated Example Project rule', actor: 'Sample Member A', timestamp: '28m ago', status: 'active' },
                { id: 't3', title: 'Flagged review checkpoint', actor: 'Sample Member B', timestamp: '1h ago', status: 'pending' },
              ]}
            />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  ),
};

function ProjectAndWorkflowDashboardView() {
  const [cards, setCards] = React.useState(WENDORO_DEMO_KANBAN_CARDS);
  const [tasks, setTasks] = React.useState([
    { id: 'tk-1', title: 'Sample Record #01: Review token mapping', completed: true, assignee: 'Demo User' },
    { id: 'tk-2', title: 'Sample Record #02: Verify keyboard Kanban buttons', completed: false, assignee: 'Sample Member A' },
    { id: 'tk-3', title: 'Sample Record #03: Confirm chart table fallback', completed: false, assignee: 'Sample Member B' },
  ]);

  return (
    <AppShell
      sidebar={
        <DashboardSidebar header={<span className="font-bold">Wendoro Flow</span>}>
          <SidebarSection title="Workflow">
            <SidebarItem icon={<FolderKanban className="h-4 w-4" />} active>Project Board</SidebarItem>
            <SidebarItem icon={<Layers className="h-4 w-4" />}>Milestones</SidebarItem>
          </SidebarSection>
        </DashboardSidebar>
      }
      header={
        <DashboardHeader
          title="Project & Workflow Dashboard (Demo)"
          breadcrumbs={[{ label: 'Example Project' }, { label: 'Sprint Board' }]}
          actions={<Button size="sm" variant="primary">Add Task</Button>}
        />
      }
    >
      <PageContainer className="space-y-6 py-6">
        <KanbanBoard
          columns={WENDORO_DEMO_KANBAN_COLUMNS}
          cards={cards}
          onMoveCard={(cardId, toCol) =>
            setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c)))
          }
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FunnelChart
            title="Workflow Stage Conversion (Demo)"
            stages={[
              { id: 'p1', label: 'Drafted', value: 120 },
              { id: 'p2', label: 'In Review', value: 84 },
              { id: 'p3', label: 'Approved', value: 62 },
              { id: 'p4', label: 'Released', value: 48 },
            ]}
          />
          <TaskList
            tasks={tasks}
            onToggleTask={(id, completed) =>
              setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
            }
          />
        </div>

        <CalendarGrid
          selectedDate={new Date('2026-11-15T12:00:00Z')}
          events={[
            { id: 'ev1', title: 'Sample Design Review', date: '2026-11-15', timeLabel: '10:00 AM', tone: 'primary' },
            { id: 'ev2', title: 'Demo Accessibility Audit', date: '2026-11-18', timeLabel: '02:00 PM', tone: 'success' },
          ]}
        />
      </PageContainer>
    </AppShell>
  );
}

export const ProjectAndWorkflowDashboard: StoryObj = {
  render: () => <ProjectAndWorkflowDashboardView />,
};
