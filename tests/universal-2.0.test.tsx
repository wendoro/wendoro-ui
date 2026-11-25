import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell, Home } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { DataComparisonTable, DetailPanel } from '@/components/business/data-comparison';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import {
  AgencyWorkspacePattern,
  CommerceOperationsPattern,
  EducationMembershipPattern,
  EnterpriseAdminPattern,
  FinanceOperationsPattern,
  LogisticsOperationsPattern,
  ProfessionalServicesPattern,
  SaasAdminPattern,
} from '@/components/business/patterns';
import {
  ApprovalQueue,
  CommentThread,
  GanttChart,
  KanbanBoard,
  ResourceAllocationBoard,
} from '@/components/business/productivity';
import { WorkflowBuilder } from '@/components/business/workflow-builder';
import { ChartAdapterProvider, ExternalChart, createVendorChartAdapter } from '@/components/charts';
import { GeoRegionChart } from '@/components/charts/advanced';
import {
  AddressContactFields,
  DynamicFormBuilder,
  RepeatableFieldSection,
  RichTextEditor,
} from '@/components/ui/forms';
import {
  BottomNavigation,
  BottomSheet,
  MediaCaptureInput,
  MobileFilterSheet,
  PullToRefresh,
  StickyActionBar,
  SwipeActionItem,
} from '@/components/ui/mobile';
import {
  ContextMenu,
  MobileCommandBar,
  QuickCreateMenu,
  WorkspaceSwitcher,
} from '@/components/ui/navigation-ext';
import {
  GuidedTour,
  OnboardingChecklist,
  SavedViewsBar,
  UndoBanner,
} from '@/components/ui/ux-patterns';
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
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { useUndoAction } from '@/hooks/use-undo';
import { createThemeCssVariables } from '@/tokens/theming';

function ContrastAndBrandProbe() {
  const { contrast, toggleContrast } = useTheme();
  return (
    <div>
      <span data-testid="contrast-val">{contrast}</span>
      <button onClick={toggleContrast}>Toggle Contrast</button>
    </div>
  );
}

function HooksProbe({ onShortcut }: { onShortcut: () => void }) {
  useKeyboardShortcuts([{ key: 'k', ctrlOrMeta: true, handler: onShortcut }]);
  const undo = useUndoAction(0);
  return (
    <div>
      <span data-testid="undo-val">{undo.current}</span>
      <button onClick={() => undo.commit(42, 'Set 42')}>Update</button>
      <button onClick={undo.undo} disabled={!undo.canUndo}>
        Undo Hook
      </button>
    </div>
  );
}

describe('Wendoro UI 2.0 — Theming, Mobile, Forms, Productivity, Workflow & Industry Suite', () => {
  it('supports High Contrast mode and scoped BrandThemeOverrides via ThemeProvider', async () => {
    const user = userEvent.setup();
    const vars = createThemeCssVariables({ primary: '#111111', surface: '#FAFAF7' });
    expect(vars['--wdr-primary']).toBe('#111111');

    const { container } = render(
      <ThemeProvider
        scoped
        disableStorage
        defaultTheme="light"
        defaultContrast="standard"
        customTheme={{ primary: '#B45309' }}
      >
        <ContrastAndBrandProbe />
      </ThemeProvider>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveAttribute('data-contrast', 'standard');
    expect(wrapper.style.getPropertyValue('--wdr-primary')).toBe('#B45309');

    await user.click(screen.getByRole('button', { name: 'Toggle Contrast' }));
    expect(wrapper).toHaveAttribute('data-contrast', 'high');
    expect(wrapper).toHaveClass('high-contrast');
  });

  it('supports useKeyboardShortcuts and useUndoAction hooks', async () => {
    const user = userEvent.setup();
    const onShortcut = vi.fn();
    render(<HooksProbe onShortcut={onShortcut} />);

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(onShortcut).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect(screen.getByTestId('undo-val')).toHaveTextContent('42');

    await user.click(screen.getByRole('button', { name: 'Undo Hook' }));
    expect(screen.getByTestId('undo-val')).toHaveTextContent('0');
  });

  it('renders and operates Mobile primitives cleanly with keyboard-accessible fallbacks', async () => {
    const user = userEvent.setup();
    const onAlertsSelect = vi.fn();
    const onSwipeArchive = vi.fn();
    const onRefresh = vi.fn();
    const onSheetChange = vi.fn();

    render(
      <div>
        <MobileCommandBar items={[{ id: 'cmd-1', label: 'Jump to Home', onSelect: () => {} }]} />
        <PullToRefresh onRefresh={onRefresh}>
          <SwipeActionItem
            actions={[{ id: 'arch', label: 'Archive Item', tone: 'destructive', onAction: onSwipeArchive }]}
          >
            <div>Swipeable Content</div>
          </SwipeActionItem>
        </PullToRefresh>
        <MediaCaptureInput label="Camera Input" files={[]} onFilesAdd={() => {}} />
        <StickyActionBar summary="2 selected" primaryAction={<button type="button">Apply</button>} />
        <BottomNavigation
          items={[
            { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: true, onSelect: () => {} },
            { id: 'alerts', label: 'Alerts', icon: <Bell className="h-4 w-4" />, badge: 5, onSelect: onAlertsSelect },
          ]}
        />
        <BottomSheet open onOpenChange={onSheetChange} title="Mobile Action Sheet">
          <p>Sheet content</p>
        </BottomSheet>
        <MobileFilterSheet>
          <p>Filters</p>
        </MobileFilterSheet>
      </div>
    );

    await user.click(screen.getByRole('button', { name: /Alerts/ }));
    expect(onAlertsSelect).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Refresh feed' }));
    expect(onRefresh).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Show quick actions' }));
    await user.click(screen.getByRole('button', { name: 'Archive Item' }));
    expect(onSwipeArchive).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Close bottom sheet' }));
    expect(onSheetChange).toHaveBeenCalledWith(false);
  });

  it('renders UX adoption patterns and navigation extras interactively', async () => {
    const user = userEvent.setup();
    const onToggleStep = vi.fn();
    const onTourClose = vi.fn();
    const onUndo = vi.fn();
    const onSelectWorkspace = vi.fn();

    render(
      <div>
        <WorkspaceSwitcher
          workspaces={WENDORO_DEMO_WORKSPACES}
          activeWorkspaceId={WENDORO_DEMO_WORKSPACES[0].id}
          onSelectWorkspace={onSelectWorkspace}
        />
        <QuickCreateMenu items={[{ id: 'qc1', label: 'Create Project', onSelect: () => {} }]} />
        <ContextMenu items={[{ id: 'cm1', label: 'Copy Record', onSelect: () => {} }]}>
          <div>Context Zone</div>
        </ContextMenu>
        <SavedViewsBar
          views={[{ id: 'v1', label: 'All Items', count: 10 }, { id: 'v2', label: 'Open', count: 3 }]}
          activeViewId="v1"
          onSelectView={() => {}}
        />
        <OnboardingChecklist
          steps={[{ id: 's1', title: 'Step One', completed: false }]}
          onToggleStep={onToggleStep}
        />
        <UndoBanner message="Record deleted" canUndo onUndo={onUndo} />
        <GuidedTour
          open
          onOpenChange={onTourClose}
          steps={[
            { id: 't1', title: 'Welcome', description: 'First step' },
            { id: 't2', title: 'Complete', description: 'Second step' },
          ]}
        />
      </div>
    );

    await user.click(screen.getByRole('button', { name: /Mark Step One/ }));
    expect(onToggleStep).toHaveBeenCalledWith('s1', true);

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('validates XSS-safe RichTextEditor preview and DynamicFormBuilder conditional & review flow', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <div>
        <RichTextEditor
          label="Notes"
          value="Safe link [click](https://wendoro.in) and bad [xss](javascript:alert(1))"
          onChange={() => {}}
        />
        <RepeatableFieldSection
          title="Members"
          items={[{ name: 'Demo User' }]}
          onAdd={() => {}}
          onRemove={() => {}}
          renderItem={(i) => <span>{i.name}</span>}
        />
        <AddressContactFields
          value={{
            contactName: 'Demo User',
            email: 'demo@example.invalid',
            phone: '',
            street: '',
            city: 'Bengaluru',
            postalCode: '',
            country: '',
          }}
          onChange={() => {}}
        />
        <DynamicFormBuilder
          showReviewStep
          fields={[
            { name: 'name', label: 'Project Name', type: 'text', required: true },
            {
              name: 'mode',
              label: 'Mode',
              type: 'select',
              options: [
                { label: 'Standard', value: 'std' },
                { label: 'Custom', value: 'custom' },
              ],
            },
            { name: 'code', label: 'Custom Code', type: 'text', when: (v) => v.mode === 'custom' },
          ]}
          initialValues={{ mode: 'custom' }}
          onSubmit={onSubmit}
        />
      </div>
    );

    expect(screen.getByLabelText('Custom Code')).toBeInTheDocument();

    // Preview sanitizes javascript: URLs while keeping safe links
    await user.click(screen.getByRole('button', { name: 'Preview' }));
    const safeLink = screen.getByRole('link', { name: 'click' });
    expect(safeLink).toHaveAttribute('href', 'https://wendoro.in');
    expect(screen.queryByRole('link', { name: 'xss' })).not.toBeInTheDocument();

    // Validation summary blocks empty required field
    await user.click(screen.getByRole('button', { name: 'Review submission' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Project Name: This field is required.');

    // Fill required field -> enter review -> submit
    await user.type(screen.getByLabelText(/Project Name/), 'Example App');
    await user.click(screen.getByRole('button', { name: 'Review submission' }));
    expect(screen.getByText('Review & confirm submission')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('supports DataTable 2.0 inline edit, grouping, export, comparison, Gantt, Kanban, Resources, Approvals, and WorkflowBuilder', async () => {
    const user = userEvent.setup();
    const onCellEdit = vi.fn();
    const onExport = vi.fn();
    const onApprovalDecision = vi.fn();
    const onAddComment = vi.fn();
    const onNodesChange = vi.fn();

    interface Row {
      id: string;
      name: string;
      group: string;
    }

    const columns: DataTableColumn<Row>[] = [
      { key: 'name', header: 'Name', editable: true, accessor: (r) => r.name, cell: (r) => r.name },
      { key: 'group', header: 'Group', accessor: (r) => r.group, cell: (r) => r.group },
    ];

    render(
      <div>
        <DataTable
          aria-label="2.0 Table"
          data={[
            { id: '1', name: 'Alpha', group: 'Core' },
            { id: '2', name: 'Beta', group: 'Charts' },
          ]}
          columns={columns}
          getRowId={(r) => r.id}
          groupBy="group"
          columnReorderable
          enableExport
          onExport={onExport}
          onCellEdit={onCellEdit}
          savedViews={[{ id: 'all', label: 'All Rows' }]}
          activeViewId="all"
          onSelectView={() => {}}
        />
        <DataComparisonTable
          subjects={[{ id: 'a', title: 'Plan A' }, { id: 'b', title: 'Plan B' }]}
          rows={[
            { id: 'same', label: 'Shared', values: { a: true, b: true } },
            { id: 'diff', label: 'Extra', values: { a: false, b: true } },
          ]}
        />
        <DetailPanel title="Record" metadata={[{ label: 'Owner', value: 'Demo User' }]} />
        <KanbanBoard
          columns={WENDORO_DEMO_KANBAN_COLUMNS}
          cards={WENDORO_DEMO_KANBAN_CARDS}
          onAddCard={() => {}}
        />
        <GanttChart periods={WENDORO_DEMO_GANTT_PERIODS} tasks={WENDORO_DEMO_GANTT_TASKS} />
        <ResourceAllocationBoard periods={WENDORO_DEMO_RESOURCE_PERIODS} resources={WENDORO_DEMO_RESOURCES} />
        <ApprovalQueue items={WENDORO_DEMO_APPROVALS} onDecision={onApprovalDecision} />
        <CommentThread comments={WENDORO_DEMO_COMMENTS} onAddComment={onAddComment} />
        <WorkflowBuilder
          nodes={WENDORO_DEMO_WORKFLOW_NODES}
          onChange={onNodesChange}
        />
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    expect(onExport).toHaveBeenCalledTimes(1);

    const editBtns = screen.getAllByRole('button', { name: /Edit Name/i });
    await user.click(editBtns[0]);
    const editInput = screen.getByLabelText('Edit Name for 1');
    await user.clear(editInput);
    await user.type(editInput, 'Alpha Updated{Enter}');
    expect(onCellEdit).toHaveBeenCalledWith('1', 'name', 'Alpha Updated');

    await user.click(screen.getByRole('button', { name: 'Approve' }));
    expect(onApprovalDecision).toHaveBeenCalledWith('apr-1', 'approved', undefined);

    await user.type(screen.getByLabelText('Add a note or comment…'), 'Verified workflow');
    await user.click(screen.getByRole('button', { name: 'Post' }));
    expect(onAddComment).toHaveBeenCalledWith('Verified workflow');

    await user.click(screen.getByRole('button', { name: 'Delay' }));
    expect(onNodesChange).toHaveBeenCalled();
  });

  it('renders GeoRegionChart and ExternalChart adapters with native fallback', async () => {
    const user = userEvent.setup();
    const onSelectRegion = vi.fn();

    const customAdapter = createVendorChartAdapter({
      id: 'unit-adapter',
      libraryName: 'Mock Host Chart',
      license: 'MIT',
      ssrCompatible: true,
      supportedKinds: ['bar'],
      renderChart: ({ title }) => <div data-testid="custom-adapter-node">Rendered {title}</div>,
    });

    render(
      <ChartAdapterProvider adapters={[customAdapter]}>
        <GeoRegionChart
          title="Geo Sample"
          regions={WENDORO_DEMO_GEO_REGIONS}
          onSelectRegion={onSelectRegion}
        />
        <ExternalChart
          kind="bar"
          title="Adapted Bar"
          data={WENDORO_DEMO_SERIES}
          xKey="month"
          series={[{ key: 'primary', label: 'Primary' }]}
        />
        <ExternalChart
          kind="donut"
          title="Fallback Donut"
          data={[
            { label: 'Cat A', value: 60 },
            { label: 'Cat B', value: 40 },
          ]}
        />
      </ChartAdapterProvider>
    );

    expect(screen.getByTestId('custom-adapter-node')).toHaveTextContent('Rendered Adapted Bar');
    expect(screen.getByText('Fallback Donut')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /North America/i }));
    expect(onSelectRegion).toHaveBeenCalledWith(expect.objectContaining({ id: 'reg-na' }));
  });

  it('renders all 8 cross-industry workspace patterns cleanly', () => {
    render(
      <div>
        <AgencyWorkspacePattern
          clients={WENDORO_DEMO_WORKSPACES}
          activeClientId="ws-alpha"
          onSelectClient={() => {}}
          kanbanColumns={WENDORO_DEMO_KANBAN_COLUMNS}
          kanbanCards={WENDORO_DEMO_KANBAN_CARDS}
          resources={WENDORO_DEMO_RESOURCES}
          resourcePeriods={WENDORO_DEMO_RESOURCE_PERIODS}
          approvals={WENDORO_DEMO_APPROVALS}
          onApprovalDecision={() => {}}
        />
        <SaasAdminPattern
          tenants={WENDORO_DEMO_WORKSPACES}
          activeTenantId="ws-beta"
          onSelectTenant={() => {}}
          subscriptionPlan="Pro"
          billingCycleLabel="Monthly"
          usageMetrics={[{ id: 'u1', label: 'API', used: '10', limit: '100', percent: 10, status: 'on_track' }]}
          planSubjects={[{ id: 'p1', title: 'Pro' }]}
          planFeatures={[{ id: 'f1', label: 'SSO', values: { p1: true } }]}
        />
        <CommerceOperationsPattern
          orders={WENDORO_DEMO_ORDERS}
          products={WENDORO_DEMO_PRODUCTS}
          fulfilmentStages={WENDORO_DEMO_FULFILMENT_STAGES}
        />
        <ProfessionalServicesPattern
          services={WENDORO_DEMO_SERVICES}
          slots={WENDORO_DEMO_BOOKING_SLOTS}
        />
        <EnterpriseAdminPattern
          orgTree={WENDORO_DEMO_ORG_TREE}
          roles={WENDORO_DEMO_ROLES}
          approvals={WENDORO_DEMO_APPROVALS}
          onApprovalDecision={() => {}}
          auditEvents={WENDORO_DEMO_ACTIVITY}
        />
        <LogisticsOperationsPattern
          assets={WENDORO_DEMO_LOGISTICS}
          deliveryStages={WENDORO_DEMO_FULFILMENT_STAGES}
        />
        <FinanceOperationsPattern
          transactions={WENDORO_DEMO_FINANCE}
          budgetActualLabel="$80k"
          budgetTargetLabel="$100k"
          budgetPercent={80}
        />
        <EducationMembershipPattern
          courses={WENDORO_DEMO_COURSES}
          communityFeed={WENDORO_DEMO_ACTIVITY}
        />
      </div>
    );

    expect(screen.getByText('Agency client workspace')).toBeInTheDocument();
    expect(screen.getByText('Subscription: Pro')).toBeInTheDocument();
    expect(screen.getByText('Order & Return Fulfilment Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Service Catalogue')).toBeInTheDocument();
    expect(screen.getByText('Roles & Permissions Matrix')).toBeInTheDocument();
    expect(screen.getByText('Dispatch & Delivery Lifecycle')).toBeInTheDocument();
    expect(screen.getAllByText('Quarterly Budget Utilization').length).toBeGreaterThan(0);
    expect(screen.getByText('Course & Curriculum Progress')).toBeInTheDocument();
  });
});
