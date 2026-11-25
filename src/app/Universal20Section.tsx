import * as React from 'react';
import {
  Bell,
  Compass,
  FolderKanban,
  Home,
  Users,
} from 'lucide-react';
import { DataComparisonTable } from '@/components/business/data-comparison';
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
  ResourceAllocationBoard,
} from '@/components/business/productivity';
import { WorkflowBuilder } from '@/components/business/workflow-builder';
import { ExternalChart } from '@/components/charts';
import { GeoRegionChart } from '@/components/charts/advanced';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banner } from '@/components/ui/feedback';
import { DynamicFormBuilder, RichTextEditor } from '@/components/ui/forms';
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
import { WorkspaceSwitcher } from '@/components/ui/navigation-ext';
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
  | 'education';

export function Universal20Section() {
  const [industry, setIndustry] = React.useState<IndustryKey>('agency');
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
        title="Wendoro UI 2.0 — Cross-Industry, Multi-Device Expansion (Demo)"
        description="Explore mobile touch-first primitives, workflow automation, Gantt planning, geo analytics, enterprise forms, and 8 multi-industry workspace blueprints using synthetic data."
      />

      <Tabs defaultValue="industry" className="space-y-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="industry">8 Industry Blueprints</TabsTrigger>
          <TabsTrigger value="workflow">Workflow, Gantt & Collaboration</TabsTrigger>
          <TabsTrigger value="mobile">Mobile & Touch Primitives</TabsTrigger>
          <TabsTrigger value="forms-geo">Forms 2.0 & Geo / Adapters</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
}
