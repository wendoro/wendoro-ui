import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, FolderKanban, Home, Plus, Users } from 'lucide-react';
import { DataComparisonTable, DetailPanel } from '../src/components/business/data-comparison';
import { DataTable, type DataTableColumn } from '../src/components/business/data-table';
import {
  AdaptiveWorkspaceLayout,
  ContextualDetailPanel,
  DashboardHeader,
  DashboardSidebar,
  SplitPanel,
} from '../src/components/business/shell';
import { StatusBadge } from '../src/components/business/status-badge';
import { Button } from '../src/components/ui/button';
import {
  AddressContactFields,
  DynamicFormBuilder,
  RepeatableFieldSection,
  RichTextEditor,
  type AddressContactValue,
} from '../src/components/ui/forms';
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
} from '../src/components/ui/mobile';
import { MobileCommandBar, NavigationRail, WorkspaceSwitcher } from '../src/components/ui/navigation-ext';
import { SidebarItem, SidebarSection } from '../src/components/ui/sidebar';
import { GuidedTour, OnboardingChecklist, SavedViewsBar, UndoBanner } from '../src/components/ui/ux-patterns';
import { ThemeProvider } from '../src/hooks/use-theme';
import {
  WENDORO_DEMO_MODULES,
  WENDORO_DEMO_WORKSPACES,
  type EcosystemModuleRow,
} from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/2.0 Multi-Device & Forms',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wendoro UI 2.0 mobile touch-first primitives, tablet/desktop adaptive shells, DataTable 2.0, Forms 2.0, UX adoption patterns, and high-contrast/multi-tenant brand theming (100% synthetic demo data).',
      },
    },
  },
};

export default meta;

function MobileTouchWorkspaceView() {
  const [tab, setTab] = React.useState('home');
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [archived, setArchived] = React.useState(false);
  const [files, setFiles] = React.useState<MediaCaptureFile[]>([]);

  return (
    <div className="mx-auto max-w-[390px] overflow-hidden rounded-[var(--wdr-radius-lg)] border-2 border-border bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface p-3">
        <MobileCommandBar
          items={[
            { id: 'c1', label: 'Create Sample Task', group: 'Actions', onSelect: () => setSheetOpen(true) },
            { id: 'c2', label: 'Go to Alerts', group: 'Navigate', onSelect: () => setTab('alerts') },
          ]}
        />
        <MobileFilterSheet activeFilterCount={1} onClearAll={() => {}}>
          <p className="text-xs text-muted-foreground">Synthetic mobile filter controls.</p>
        </MobileFilterSheet>
      </div>

      <div className="p-3 space-y-3">
        <PullToRefresh
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            setTimeout(() => setRefreshing(false), 300);
          }}
        >
          <div className="space-y-2">
            {!archived && (
              <SwipeActionItem
                actions={[
                  { id: 'arch', label: 'Archive', tone: 'destructive', onAction: () => setArchived(true) },
                ]}
              >
                <div className="text-xs">
                  <div className="font-semibold text-foreground">Sample Mobile Task #01</div>
                  <div className="text-muted-foreground">Swipe left or press Actions to archive (demo).</div>
                </div>
              </SwipeActionItem>
            )}
            {archived && (
              <UndoBanner
                message="Sample Mobile Task #01 archived."
                canUndo
                onUndo={() => setArchived(false)}
                onDismiss={() => setArchived(false)}
              />
            )}
          </div>
        </PullToRefresh>

        <MediaCaptureInput
          label="Mobile Field Capture"
          files={files}
          onFilesAdd={(added) =>
            setFiles((prev) => [
              ...prev,
              ...added.map((f, i) => ({ id: `f-${i}-${Date.now()}`, name: f.name, size: f.size, type: f.type })),
            ])
          }
        />

        <StickyActionBar
          summary="1 pending update"
          primaryAction={
            <Button size="sm" variant="primary" onClick={() => setSheetOpen(true)}>
              Open Sheet
            </Button>
          }
        />
      </div>

      <BottomNavigation
        items={[
          { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: tab === 'home', onSelect: () => setTab('home') },
          { id: 'board', label: 'Tasks', icon: <FolderKanban className="h-4 w-4" />, badge: 2, active: tab === 'board', onSelect: () => setTab('board') },
          { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" />, active: tab === 'team', onSelect: () => setTab('team') },
          { id: 'alerts', label: 'Alerts', icon: <Bell className="h-4 w-4" />, active: tab === 'alerts', onSelect: () => setTab('alerts') },
        ]}
      />

      <BottomSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Mobile Action Sheet (Demo)"
        description="Touch-friendly half/full modal sheet."
      >
        <div className="space-y-3 text-xs text-muted-foreground">
          <p>Review illustrative item properties and confirm update.</p>
          <Button variant="primary" className="w-full" onClick={() => setSheetOpen(false)}>
            Done
          </Button>
        </div>
      </BottomSheet>

      <FloatingActionButton
        label="Quick Create"
        position="inline"
        icon={<Plus className="h-5 w-5" />}
        onClick={() => setSheetOpen(true)}
        className="mt-3 ml-auto mr-3 mb-3 flex"
      />
    </div>
  );
}

export const MobileTouchWorkspace: StoryObj = {
  render: () => <MobileTouchWorkspaceView />,
};

function TabletAndDesktopAdaptiveShellView() {
  const [activeNav, setActiveNav] = React.useState('overview');
  const [detailOpen, setDetailOpen] = React.useState(true);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [ws, setWs] = React.useState(WENDORO_DEMO_WORKSPACES[0].id);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Home className="h-4 w-4" />, active: activeNav === 'overview', onSelect: () => setActiveNav('overview') },
    { id: 'tasks', label: 'Board', icon: <FolderKanban className="h-4 w-4" />, badge: 4, active: activeNav === 'tasks', onSelect: () => setActiveNav('tasks') },
    { id: 'team', label: 'Directory', icon: <Users className="h-4 w-4" />, active: activeNav === 'team', onSelect: () => setActiveNav('team') },
  ];

  return (
    <AdaptiveWorkspaceLayout
      mobileNavOpen={mobileNavOpen}
      onMobileNavOpenChange={setMobileNavOpen}
      sidebar={
        <DashboardSidebar header={<span className="font-bold text-sm">Wendoro 2.0</span>}>
          <SidebarSection title="Workspace">
            {navItems.map((item) => (
              <SidebarItem key={item.id} icon={item.icon} active={item.active} onClick={item.onSelect}>
                {item.label}
              </SidebarItem>
            ))}
          </SidebarSection>
        </DashboardSidebar>
      }
      tabletRail={<NavigationRail items={navItems} />}
      header={
        <DashboardHeader
          title="Adaptive Workspace Shell (Demo)"
          onOpenMobileNav={() => setMobileNavOpen(true)}
          actions={
            <WorkspaceSwitcher
              workspaces={WENDORO_DEMO_WORKSPACES}
              activeWorkspaceId={ws}
              onSelectWorkspace={setWs}
            />
          }
        />
      }
      bottomNavItems={navItems}
      detailPanel={
        <ContextualDetailPanel
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="Contextual Inspector"
          subtitle="Docks on tablet/desktop, renders as BottomSheet on mobile"
        >
          <DetailPanel
            title="Sample Record #01"
            subtitle="Synthetic details"
            metadata={[
              { label: 'Workspace', value: ws },
              { label: 'Status', value: <StatusBadge status="active" label="Active" /> },
            ]}
          />
        </ContextualDetailPanel>
      }
    >
      <div className="p-4">
        <SplitPanel
          collapsibleLeft
          left={
            <div className="p-2 text-xs">
              <div className="font-semibold">Collapsible Left Pane</div>
              <p className="mt-1 text-muted-foreground">Navigation or filter tree pane.</p>
            </div>
          }
          right={
            <div className="p-2 space-y-3 text-xs">
              <div className="font-semibold">Primary Canvas</div>
              <p className="text-muted-foreground">Adapts seamlessly from desktop split panes to tablet rail and mobile bottom bar.</p>
              <Button size="sm" variant="outline" onClick={() => setDetailOpen((p) => !p)}>
                {detailOpen ? 'Hide Inspector' : 'Show Inspector'}
              </Button>
            </div>
          }
        />
      </div>
    </AdaptiveWorkspaceLayout>
  );
}

export const TabletAndDesktopAdaptiveShell: StoryObj = {
  render: () => <TabletAndDesktopAdaptiveShellView />,
};

function DataTable20AndComparisonView() {
  const [rows, setRows] = React.useState<EcosystemModuleRow[]>(WENDORO_DEMO_MODULES);
  const [activeView, setActiveView] = React.useState('all');

  const columns: DataTableColumn<EcosystemModuleRow>[] = [
    { key: 'id', header: 'ID', sortable: true, accessor: (r) => r.id, cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: 'module', header: 'Project (Editable)', sortable: true, editable: true, accessor: (r) => r.module, cell: (r) => r.module },
    { key: 'domain', header: 'Domain', filterable: true, accessor: (r) => r.domain, cell: (r) => r.domain },
    { key: 'throughput', header: 'Units', align: 'right', sortable: true, accessor: (r) => r.throughput, cell: (r) => r.throughput },
    { key: 'status', header: 'Status', accessor: (r) => r.status, cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} /> },
  ];

  return (
    <div className="space-y-6">
      <DataTable
        aria-label="Enterprise DataTable 2.0"
        data={rows}
        columns={columns}
        getRowId={(r) => r.id}
        searchable
        columnReorderable
        enableExport
        responsiveCardMode="auto"
        groupBy="status"
        groupSummary={(groupKey, grpRows) => `${groupKey} (${grpRows.length} items)`}
        savedViews={[
          { id: 'all', label: 'All Modules' },
          { id: 'active', label: 'Active Only' },
        ]}
        activeViewId={activeView}
        onSelectView={(view) => setActiveView(view.id)}
        onCellEdit={(rowId, colKey, newValue) => {
          if (colKey === 'module') {
            setRows((prev) => prev.map((r) => (r.id === rowId ? { ...r, module: newValue } : r)));
          }
        }}
      />

      <DataComparisonTable
        subjects={[
          { id: 'core', title: 'Standard Tier', subtitle: '$49/mo' },
          { id: 'scale', title: 'Enterprise Tier', subtitle: '$199/mo', recommended: true },
        ]}
        rows={[
          { id: 'r1', label: 'Saved Filter Views', values: { core: true, scale: true } },
          { id: 'r2', label: 'Scoped Custom Branding', values: { core: false, scale: true } },
          { id: 'r3', label: 'SLA Guarantee', values: { core: '99.5%', scale: '99.95%' } },
        ]}
      />
    </div>
  );
}

export const DataTable20AndComparison: StoryObj = {
  render: () => <DataTable20AndComparisonView />,
};

export const HighContrastAndScopedBrandTheme: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ThemeProvider defaultTheme="light" defaultContrast="high" scoped disableStorage>
        <div className="rounded-[var(--wdr-radius-lg)] border border-border bg-background p-5 text-foreground space-y-3">
          <div className="text-sm font-bold">High-Contrast Accessibility Mode (Scoped Light)</div>
          <p className="text-xs text-muted-foreground">Pure black ink, strong 1px/2px borders, and crisp yellow focus tokens.</p>
          <div className="flex gap-2">
            <Button variant="primary">Primary Action</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
      </ThemeProvider>

      <ThemeProvider
        defaultTheme="light"
        scoped
        disableStorage
        customTheme={{ primary: '#B45309', primaryForeground: '#FFFFFF', surface: '#FFFBEB' }}
      >
        <div className="rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-5 text-foreground space-y-3">
          <div className="text-sm font-bold">Multi-Tenant Scoped Brand Override (Demo)</div>
          <p className="text-xs text-muted-foreground">Customized via createThemeCssVariables() without polluting root CSS.</p>
          <Button variant="primary">Tenant Branded CTA</Button>
        </div>
      </ThemeProvider>
    </div>
  ),
};

function Forms20AndUxAdoptionView() {
  const [note, setNote] = React.useState('Hello [Wendoro 2.0](https://wendoro.in) reviewer.');
  const [contacts, setContacts] = React.useState([{ id: 'c1', role: 'Primary', email: 'demo@example.invalid' }]);
  const [tourOpen, setTourOpen] = React.useState(false);
  const [address, setAddress] = React.useState<AddressContactValue>({
    contactName: 'Demo User',
    email: 'demo@example.invalid',
    phone: '+1 555 0100',
    street: '100 Sample Ave',
    city: 'Sample City',
    postalCode: '10001',
    country: 'Example Country',
  });

  return (
    <div className="space-y-6">
      <SavedViewsBar
        views={[
          { id: 'v1', label: 'Default View', count: 12 },
          { id: 'v2', label: 'Flagged Items', count: 3 },
        ]}
        activeViewId="v1"
        onSelectView={() => {}}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DynamicFormBuilder
          showReviewStep
          fields={[
            { name: 'title', label: 'Engagement Title', type: 'text', required: true },
            {
              name: 'tier',
              label: 'Service Tier',
              type: 'select',
              options: [
                { label: 'Standard', value: 'std' },
                { label: 'Enterprise', value: 'ent' },
              ],
            },
            { name: 'complianceCode', label: 'Compliance Code', type: 'text', when: (v) => v.tier === 'ent' },
          ]}
          initialValues={{ title: 'Example Engagement', tier: 'ent' }}
          onSubmit={() => {}}
        />

        <div className="space-y-4">
          <RichTextEditor label="XSS-Safe Rich Text Notes" value={note} onChange={setNote} />
          <AddressContactFields value={address} onChange={setAddress} />
        </div>
      </div>

      <RepeatableFieldSection
        title="Escalation Contacts"
        items={contacts}
        onAdd={() => setContacts((p) => [...p, { id: `c-${p.length + 1}`, role: 'Backup', email: '' }])}
        onRemove={(idx) => setContacts((p) => p.filter((_, i) => i !== idx))}
        renderItem={(item) => (
          <div className="text-xs text-foreground">
            {item.role}: {item.email || 'Pending email'}
          </div>
        )}
      />

      <div className="flex flex-wrap items-start gap-4">
        <Button variant="outline" onClick={() => setTourOpen(true)}>
          Launch GuidedTour
        </Button>
        <OnboardingChecklist
          steps={[
            { id: 's1', title: 'Review Accessibility tokens', completed: true },
            { id: 's2', title: 'Confirm Mobile Sheet gestures', completed: false },
          ]}
        />
      </div>

      <GuidedTour
        open={tourOpen}
        onOpenChange={setTourOpen}
        steps={[
          { id: 'gt1', title: 'Adaptive Layout', description: 'Supports 320px mobile to 1920px desktop workspaces.' },
          { id: 'gt2', title: 'High Contrast', description: 'Toggle [data-contrast="high"] cleanly at runtime.' },
        ]}
      />
    </div>
  );
}

export const Forms20AndUxAdoption: StoryObj = {
  render: () => <Forms20AndUxAdoptionView />,
};
