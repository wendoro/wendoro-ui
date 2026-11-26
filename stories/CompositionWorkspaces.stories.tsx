import type { Meta, StoryObj } from '@storybook/react';
import {
  AgencyWorkspacePattern,
  CommerceOperationsPattern,
  EnterpriseAdminPattern,
  SaasAdminPattern,
} from '../src/components/business/patterns';
import { AppShell, DashboardHeader, DashboardSidebar, PageContainer } from '../src/components/business/shell';
import { KanbanBoard } from '../src/components/business/productivity';
import { WorkflowBuilder } from '../src/components/business/workflow-builder';
import { OrderTrackingPanel, SubscriptionOverview } from '../src/components/business/commerce';
import { LineChart } from '../src/components/charts';
import { AiAssistantPanel } from '../src/components/ai';
import { BottomNavigation } from '../src/components/ui/mobile';
import { MetricCard } from '../src/components/business/metric-card';
import { SidebarItem, SidebarSection } from '../src/components/ui/sidebar';
import {
  WENDORO_DEMO_ACTIVITY,
  WENDORO_DEMO_APPROVALS,
  WENDORO_DEMO_FULFILMENT_STAGES,
  WENDORO_DEMO_KANBAN_CARDS,
  WENDORO_DEMO_KANBAN_COLUMNS,
  WENDORO_DEMO_ORDERS,
  WENDORO_DEMO_ORG_TREE,
  WENDORO_DEMO_PRODUCTS,
  WENDORO_DEMO_RESOURCE_PERIODS,
  WENDORO_DEMO_RESOURCES,
  WENDORO_DEMO_ROLES,
  WENDORO_DEMO_SERIES,
  WENDORO_DEMO_WORKFLOW_NODES,
  WENDORO_DEMO_WORKSPACES,
} from '../src/data/wendoro-demo-data';
import { BarChart3, CheckCircle2, Home, Layers } from 'lucide-react';

const meta: Meta = {
  title: 'Wendoro UI/Full Example Compositions',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '11 complete synthetic compositions: Agency workspace, SaaS administration, Enterprise dashboard, E-commerce operations, Customer portal, Project management, Analytics workspace, AI assistant workspace, Mobile dashboard, Tablet workspace, and Workflow studio.',
      },
    },
  },
};

export default meta;

export const AgencyWorkspaceComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <AgencyWorkspacePattern
        clients={WENDORO_DEMO_WORKSPACES}
        activeClientId={WENDORO_DEMO_WORKSPACES[0].id}
        onSelectClient={() => {}}
        kanbanColumns={WENDORO_DEMO_KANBAN_COLUMNS}
        kanbanCards={WENDORO_DEMO_KANBAN_CARDS}
        onMoveCard={() => {}}
        resources={WENDORO_DEMO_RESOURCES}
        resourcePeriods={WENDORO_DEMO_RESOURCE_PERIODS}
        approvals={WENDORO_DEMO_APPROVALS}
        onApprovalDecision={() => {}}
      />
    </PageContainer>
  ),
};

export const SaasAdministrationComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <SaasAdminPattern
        tenants={WENDORO_DEMO_WORKSPACES}
        activeTenantId={WENDORO_DEMO_WORKSPACES[0].id}
        onSelectTenant={() => {}}
        subscriptionPlan="Enterprise Multi-Tenant (Demo)"
        billingCycleLabel="Annual Plan"
        usageMetrics={[{ id: 'u1', label: 'API Requests', used: '720k', limit: '1M', percent: 72, status: 'on_track' }]}
        planSubjects={[{ id: 'pro', title: 'Pro', subtitle: '$149/mo', recommended: true }]}
        planFeatures={[{ id: 'f1', label: 'Custom Branding', values: { pro: true } }]}
        onboardingSteps={[{ id: 's1', title: 'Configure Workspace Tokens', completed: true }]}
        onToggleOnboardingStep={() => {}}
      />
    </PageContainer>
  ),
};

export const EnterpriseDashboardComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <EnterpriseAdminPattern
        orgTree={WENDORO_DEMO_ORG_TREE}
        roles={WENDORO_DEMO_ROLES}
        approvals={WENDORO_DEMO_APPROVALS}
        onApprovalDecision={() => {}}
        auditEvents={WENDORO_DEMO_ACTIVITY}
      />
    </PageContainer>
  ),
};

export const EcommerceOperationsComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <CommerceOperationsPattern
        orders={WENDORO_DEMO_ORDERS}
        products={WENDORO_DEMO_PRODUCTS}
        fulfilmentStages={WENDORO_DEMO_FULFILMENT_STAGES}
      />
    </PageContainer>
  ),
};

export const CustomerPortalComposition: StoryObj = {
  render: () => (
    <PageContainer className="space-y-6 py-6">
      <SubscriptionOverview
        planName="Business Connect (Demo)"
        status="active"
        renewalDateLabel="Dec 31, 2026"
        seatsLabel="8 / 15 seats"
      />
      <OrderTrackingPanel
        orderNumber="ORD-2026-881"
        carrierLabel="Demo Express"
        etaLabel="Nov 27, 2026"
        checkpoints={[
          { id: 's1', label: 'Confirmed', timestamp: '09:00 AM', completed: true },
          { id: 's2', label: 'Shipped', timestamp: '02:30 PM', completed: true },
        ]}
      />
    </PageContainer>
  ),
};

export const ProjectManagementComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <KanbanBoard columns={WENDORO_DEMO_KANBAN_COLUMNS} cards={WENDORO_DEMO_KANBAN_CARDS} onMoveCard={() => {}} />
    </PageContainer>
  ),
};

export const AnalyticsWorkspaceComposition: StoryObj = {
  render: () => (
    <PageContainer className="space-y-6 py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Sample Throughput" value="2,160" delta="+14.2%" trend="up" />
        <MetricCard label="Target Coverage" value="94%" delta="+2.1%" trend="up" />
        <MetricCard label="Queue Latency" value="42 ms" delta="-6 ms" trend="up" />
      </div>
      <LineChart
        title="Throughput Trajectory (Demo)"
        data={WENDORO_DEMO_SERIES}
        xKey="month"
        zoomable
        series={[
          { key: 'primary', label: 'Observed' },
          { key: 'target', label: 'Target' },
        ]}
      />
    </PageContainer>
  ),
};

export const AiAssistantWorkspaceComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <AiAssistantPanel
        models={[{ id: 'fast', name: 'Wendoro Fast', provider: 'Adapter', contextWindow: '128k', latencyTier: 'fast' }]}
        selectedModelId="fast"
        onSelectModel={() => {}}
        messages={[{ id: 'm1', role: 'assistant', content: 'Ready for synthetic task review.', timestamp: '09:00' }]}
        promptValue=""
        onPromptChange={() => {}}
        onSubmitPrompt={() => {}}
      />
    </PageContainer>
  ),
};

export const MobileDashboardComposition: StoryObj = {
  render: () => (
    <div className="mx-auto max-w-[375px] border border-border bg-background min-h-[540px] flex flex-col justify-between">
      <div className="p-4 space-y-4">
        <DashboardHeader title="Mobile Dashboard" />
        <MetricCard label="Today's Records" value="48" delta="+6" trend="up" />
        <MetricCard label="Pending Tasks" value="5" delta="On track" trend="neutral" />
      </div>
      <BottomNavigation
        items={[
          { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: true, onSelect: () => {} },
          { id: 'stats', label: 'Metrics', icon: <BarChart3 className="h-4 w-4" />, onSelect: () => {} },
          { id: 'tasks', label: 'Tasks', icon: <CheckCircle2 className="h-4 w-4" />, onSelect: () => {} },
        ]}
      />
    </div>
  ),
};

export const TabletWorkspaceComposition: StoryObj = {
  render: () => (
    <div className="mx-auto max-w-[820px] border border-border">
      <AppShell
        sidebar={
          <DashboardSidebar collapsed variant="mini" header={<span>W</span>}>
            <SidebarSection title="Tablet">
              <SidebarItem active icon={<Layers className="h-4 w-4" />}>Workspace</SidebarItem>
            </SidebarSection>
          </DashboardSidebar>
        }
        header={<DashboardHeader title="Tablet Split Workspace (820px)" />}
      >
        <PageContainer className="py-4 space-y-4">
          <MetricCard label="Tablet Density Card" value="1,240" delta="+8.4%" trend="up" />
        </PageContainer>
      </AppShell>
    </div>
  ),
};

export const WorkflowStudioComposition: StoryObj = {
  render: () => (
    <PageContainer className="py-6">
      <WorkflowBuilder
        nodes={WENDORO_DEMO_WORKFLOW_NODES}
        onChange={() => {}}
        templates={[
          { id: 'tpl-1', name: 'Triage + SLA Escalation', nodes: WENDORO_DEMO_WORKFLOW_NODES },
        ]}
        executionTimeline={[
          { id: 'ex-1', nodeId: 'wf-1', stepTitle: 'Inbound Webhook Trigger', status: 'completed', durationLabel: '18 ms', timestamp: '10:00:01' },
          { id: 'ex-2', nodeId: 'wf-2', stepTitle: 'Evaluate Threshold', status: 'running', durationLabel: '42 ms', timestamp: '10:00:02' },
        ]}
      />
    </PageContainer>
  ),
};
