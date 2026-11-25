import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AgencyWorkspacePattern,
  CommerceOperationsPattern,
  EducationMembershipPattern,
  EnterpriseAdminPattern,
  FinanceOperationsPattern,
  LogisticsOperationsPattern,
  ProfessionalServicesPattern,
  SaasAdminPattern,
} from '../src/components/business/patterns';
import {
  ApprovalQueue,
  CommentThread,
  GanttChart,
  ResourceAllocationBoard,
} from '../src/components/business/productivity';
import { WorkflowBuilder } from '../src/components/business/workflow-builder';
import { ExternalChart, LineChart, createVendorChartAdapter } from '../src/components/charts';
import { GeoRegionChart } from '../src/components/charts/advanced';
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
} from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/2.0 Industry & Workflow Blueprints',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interactive Workflow Builder, Gantt planning, Resource Allocation, Geo choropleth & ExternalChart adapter integration, plus all 8 synthetic multi-industry application patterns.',
      },
    },
  },
};

export default meta;

function WorkflowBuilderGanttAndResourcesView() {
  const [nodes, setNodes] = React.useState(WENDORO_DEMO_WORKFLOW_NODES);
  const [approvals, setApprovals] = React.useState(WENDORO_DEMO_APPROVALS);
  const [comments, setComments] = React.useState(WENDORO_DEMO_COMMENTS);

  return (
    <div className="space-y-6">
      <WorkflowBuilder
        nodes={nodes}
        onChange={setNodes}
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
                id: `c-${Date.now()}`,
                author: 'Demo User',
                role: 'Reviewer',
                timestamp: 'Now',
                body,
              },
            ])
          }
        />
      </div>
      <ApprovalQueue
        items={approvals}
        onDecision={(id, decision, note) =>
          setApprovals((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: decision, decisionNote: note } : item
            )
          )
        }
      />
    </div>
  );
}

export const WorkflowBuilderGanttAndResources: StoryObj = {
  render: () => <WorkflowBuilderGanttAndResourcesView />,
};

function GeoRegionAndExternalChartView() {
  const [regionId, setRegionId] = React.useState(WENDORO_DEMO_GEO_REGIONS[0].id);
  const customAdapter = createVendorChartAdapter({
    id: 'demo-custom',
    libraryName: 'Custom Host Engine Adapter (Demo)',
    license: 'MIT',
    ssrCompatible: true,
    supportedKinds: ['bar', 'line'],
    renderChart: ({ data, series }) => (
      <div className="rounded-[var(--wdr-radius-md)] border border-dashed border-border p-4 text-xs text-muted-foreground">
        Custom host visualization adapter invoked with {data.length} points across{' '}
        {series?.length ?? 0} series.
      </div>
    ),
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <GeoRegionChart
        title="GeoRegionChart (Demo)"
        regions={WENDORO_DEMO_GEO_REGIONS}
        selectedRegionId={regionId}
        onSelectRegion={(r) => setRegionId(r.id)}
        unitLabel="Sample Units"
      />
      <ExternalChart
        kind="bar"
        title="ExternalChart with Host Adapter"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        series={[{ key: 'primary', label: 'Primary' }]}
        adapter={customAdapter}
      />
    </div>
  );
}

export const GeoRegionAndExternalChartAdapter: StoryObj = {
  render: () => <GeoRegionAndExternalChartView />,
};

export const AgencyClientWorkspace: StoryObj = {
  render: () => (
    <AgencyWorkspacePattern
      clients={WENDORO_DEMO_WORKSPACES}
      activeClientId={WENDORO_DEMO_WORKSPACES[0].id}
      onSelectClient={() => {}}
      kanbanColumns={WENDORO_DEMO_KANBAN_COLUMNS}
      kanbanCards={WENDORO_DEMO_KANBAN_CARDS}
      resources={WENDORO_DEMO_RESOURCES}
      resourcePeriods={WENDORO_DEMO_RESOURCE_PERIODS}
      approvals={WENDORO_DEMO_APPROVALS}
      onApprovalDecision={() => {}}
      chartSlot={
        <LineChart
          title="Client Velocity (Demo)"
          data={WENDORO_DEMO_SERIES}
          xKey="month"
          series={[{ key: 'primary', label: 'Deliverables' }]}
        />
      }
    />
  ),
};

export const SaasTenantAdministration: StoryObj = {
  render: () => (
    <SaasAdminPattern
      tenants={WENDORO_DEMO_WORKSPACES}
      activeTenantId={WENDORO_DEMO_WORKSPACES[1].id}
      onSelectTenant={() => {}}
      subscriptionPlan="Enterprise Multi-Tenant"
      billingCycleLabel="Synthetic Billing Cycle · Demo Only"
      usageMetrics={[
        { id: 'm1', label: 'API Volume', used: '820k', limit: '1M', percent: 82, status: 'on_track' },
        { id: 'm2', label: 'Seats', used: '45', limit: '50', percent: 90, status: 'at_risk' },
        { id: 'm3', label: 'Automations', used: '12k', limit: '20k', percent: 60, status: 'on_track' },
      ]}
      planSubjects={[
        { id: 'pro', title: 'Pro', subtitle: '$99/mo' },
        { id: 'ent', title: 'Enterprise', subtitle: '$299/mo', recommended: true },
      ]}
      planFeatures={[
        { id: 'f1', label: 'Custom Brand Tokens', values: { pro: true, ent: true } },
        { id: 'f2', label: 'Dedicated SSO/RBAC UI', values: { pro: false, ent: true } },
      ]}
    />
  ),
};

export const CommerceMarketplaceOps: StoryObj = {
  render: () => (
    <CommerceOperationsPattern
      orders={WENDORO_DEMO_ORDERS}
      products={WENDORO_DEMO_PRODUCTS}
      fulfilmentStages={WENDORO_DEMO_FULFILMENT_STAGES}
      onRestockProduct={() => {}}
    />
  ),
};

export const ProfessionalServicesPortal: StoryObj = {
  render: () => (
    <ProfessionalServicesPattern
      services={WENDORO_DEMO_SERVICES}
      slots={WENDORO_DEMO_BOOKING_SLOTS}
      selectedServiceId={WENDORO_DEMO_SERVICES[0].id}
      selectedSlotId={WENDORO_DEMO_BOOKING_SLOTS[0].id}
    />
  ),
};

export const EnterpriseGovernanceAdmin: StoryObj = {
  render: () => (
    <EnterpriseAdminPattern
      orgTree={WENDORO_DEMO_ORG_TREE}
      roles={WENDORO_DEMO_ROLES}
      approvals={WENDORO_DEMO_APPROVALS}
      onApprovalDecision={() => {}}
      auditEvents={WENDORO_DEMO_ACTIVITY}
    />
  ),
};

export const LogisticsFleetOperations: StoryObj = {
  render: () => (
    <LogisticsOperationsPattern
      assets={WENDORO_DEMO_LOGISTICS}
      deliveryStages={WENDORO_DEMO_FULFILMENT_STAGES}
    />
  ),
};

export const FinanceReconciliationOps: StoryObj = {
  render: () => (
    <FinanceOperationsPattern
      transactions={WENDORO_DEMO_FINANCE}
      budgetActualLabel="$84,200"
      budgetTargetLabel="$100,000"
      budgetPercent={84}
      onToggleReconcile={() => {}}
    />
  ),
};

export const EducationMembershipPortal: StoryObj = {
  render: () => (
    <EducationMembershipPattern
      courses={WENDORO_DEMO_COURSES}
      communityFeed={WENDORO_DEMO_ACTIVITY}
    />
  ),
};
