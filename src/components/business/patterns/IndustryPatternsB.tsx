import * as React from 'react';
import { BookOpen, Building, CreditCard, Shield, Truck } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { ActivityFeed, type ActivityFeedEntry } from '../activity-feed';
import { TargetVsActual } from '../analytics';
import { DataTable, type DataTableColumn } from '../data-table';
import { KpiCard } from '../kpi-card';
import { MetricCard } from '../metric-card';
import {
  ApprovalQueue,
  HierarchyView,
  StatusProgression,
  type ApprovalRequestItem,
  type StatusStage,
  type TreeNode,
} from '../productivity';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* 5. Enterprise Administration Pattern (Org Chart, Roles, Approvals, Audit)  */
/* -------------------------------------------------------------------------- */

export interface RolePermissionEntry {
  id: string;
  role: string;
  scope: string;
  membersCount: number;
  permissionsSummary: string;
}

export interface EnterpriseAdminPatternProps {
  orgTree: TreeNode[];
  roles: RolePermissionEntry[];
  approvals: ApprovalRequestItem[];
  onApprovalDecision: (id: string, decision: 'approved' | 'rejected', note?: string) => void;
  auditEvents: ActivityFeedEntry[];
  className?: string;
}

export function EnterpriseAdminPattern({
  orgTree,
  roles,
  approvals,
  onApprovalDecision,
  auditEvents,
  className,
}: EnterpriseAdminPatternProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Departments" value={String(orgTree.length)} delta="Global org" trend="neutral" />
        <MetricCard label="Role Definitions" value={String(roles.length)} delta="RBAC active" trend="up" />
        <MetricCard
          label="Pending Approvals"
          value={String(approvals.filter((a) => a.status === 'pending').length)}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <HierarchyView title="Organization Structure" nodes={orgTree} defaultExpandedIds={orgTree.map((n) => n.id)} />

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Roles & Permissions Matrix</span>
          </div>
          <ul className="space-y-2">
            {roles.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3.5 py-2.5 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{r.role}</div>
                  <div className="text-muted-foreground">{r.permissionsSummary}</div>
                </div>
                <div className="text-right tabular-nums">
                  <div className="font-medium text-foreground">{r.scope}</div>
                  <div className="text-muted-foreground">{r.membersCount} members</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ApprovalQueue title="Governance Approval Queue" items={approvals} onDecision={onApprovalDecision} />
        <ActivityFeed title="Enterprise Audit Trail" items={auditEvents} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Operations & Logistics Pattern                                          */
/* -------------------------------------------------------------------------- */

export interface LogisticsAssetRow {
  id: string;
  assetCode: string;
  route: string;
  operator: string;
  etaLabel: string;
  status: 'active' | 'pending' | 'completed' | 'warning';
  statusLabel: string;
}

const LOGISTICS_COLUMNS: DataTableColumn<LogisticsAssetRow>[] = [
  {
    key: 'assetCode',
    header: 'Asset / Fleet ID',
    sortable: true,
    accessor: (r) => r.assetCode,
    cell: (r) => <span className="font-mono text-xs font-semibold">{r.assetCode}</span>,
  },
  {
    key: 'route',
    header: 'Route / Zone',
    sortable: true,
    accessor: (r) => r.route,
    cell: (r) => r.route,
  },
  {
    key: 'operator',
    header: 'Operator (Demo)',
    accessor: (r) => r.operator,
    cell: (r) => r.operator,
  },
  {
    key: 'etaLabel',
    header: 'ETA / Window',
    accessor: (r) => r.etaLabel,
    cell: (r) => <span className="tabular-nums">{r.etaLabel}</span>,
  },
  {
    key: 'statusLabel',
    header: 'Dispatch Status',
    filterable: true,
    accessor: (r) => r.statusLabel,
    cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} />,
  },
];

export function LogisticsOperationsPattern({
  assets,
  deliveryStages,
  chartSlot,
  className,
}: {
  assets: LogisticsAssetRow[];
  deliveryStages: StatusStage[];
  chartSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Truck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Dispatch & Delivery Lifecycle</span>
        </div>
        <StatusProgression stages={deliveryStages} />
      </Card>

      {chartSlot}

      <DataTable
        aria-label="Fleet and logistics tracking"
        data={assets}
        columns={LOGISTICS_COLUMNS}
        getRowId={(r) => r.id}
        searchable
        pageSize={5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Finance & Reconciliation Pattern                                        */
/* -------------------------------------------------------------------------- */

export interface FinanceTransactionRow {
  id: string;
  reference: string;
  counterparty: string;
  category: string;
  amountLabel: string;
  reconciled: boolean;
  status: 'completed' | 'pending' | 'warning';
}

export interface FinanceOperationsPatternProps {
  transactions: FinanceTransactionRow[];
  onToggleReconcile?: (id: string) => void;
  budgetActualLabel: string;
  budgetTargetLabel: string;
  budgetPercent: number;
  className?: string;
}

export function FinanceOperationsPattern({
  transactions,
  onToggleReconcile,
  budgetActualLabel,
  budgetTargetLabel,
  budgetPercent,
  className,
}: FinanceOperationsPatternProps) {
  const columns: DataTableColumn<FinanceTransactionRow>[] = [
    {
      key: 'reference',
      header: 'Invoice / Ref',
      sortable: true,
      accessor: (r) => r.reference,
      cell: (r) => <span className="font-mono text-xs font-semibold">{r.reference}</span>,
    },
    {
      key: 'counterparty',
      header: 'Counterparty (Demo)',
      sortable: true,
      accessor: (r) => r.counterparty,
      cell: (r) => r.counterparty,
    },
    {
      key: 'category',
      header: 'Category',
      filterable: true,
      accessor: (r) => r.category,
      cell: (r) => r.category,
    },
    {
      key: 'amountLabel',
      header: 'Amount',
      align: 'right',
      accessor: (r) => r.amountLabel,
      cell: (r) => <span className="font-semibold tabular-nums">{r.amountLabel}</span>,
    },
    {
      key: 'reconciled',
      header: 'Reconciliation',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <StatusBadge
            status={r.reconciled ? 'completed' : 'pending'}
            label={r.reconciled ? 'Reconciled' : 'Unmatched'}
          />
          {onToggleReconcile && (
            <Button size="sm" variant="outline" onClick={() => onToggleReconcile(r.id)}>
              {r.reconciled ? 'Unmatch' : 'Match'}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title="Matched Transactions"
          actual={String(transactions.filter((t) => t.reconciled).length)}
          target={String(transactions.length)}
          completion={
            transactions.length > 0
              ? Math.round((transactions.filter((t) => t.reconciled).length / transactions.length) * 100)
              : 0
          }
          status="on_track"
        />
        <TargetVsActual
          title="Quarterly Budget Utilization"
          actualLabel={budgetActualLabel}
          targetLabel={budgetTargetLabel}
          percentage={budgetPercent}
          variant={budgetPercent > 90 ? 'warning' : 'primary'}
        />
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CreditCard className="h-4 w-4" aria-hidden="true" />
            <span>Payment Settlement Mode</span>
          </div>
          <div className="mt-2 text-xl font-bold text-foreground">Automated Batch</div>
          <div className="mt-1 text-xs text-muted-foreground">Synthetic ledger view</div>
        </Card>
      </div>

      <DataTable
        aria-label="Financial transactions and reconciliation"
        data={transactions}
        columns={columns}
        getRowId={(r) => r.id}
        searchable
        enableExport
        pageSize={5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Education & Membership Pattern                                          */
/* -------------------------------------------------------------------------- */

export interface CourseModuleItem {
  id: string;
  title: string;
  lessonsCount: number;
  completionPercent: number;
  tier: string;
}

export function EducationMembershipPattern({
  courses,
  communityFeed,
  activeMemberCount = 1280,
  onOpenCourse,
  className,
}: {
  courses: CourseModuleItem[];
  communityFeed: ActivityFeedEntry[];
  activeMemberCount?: number;
  onOpenCourse?: (courseId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Active Members" value={activeMemberCount.toLocaleString()} delta="+6.4%" trend="up" />
        <MetricCard label="Published Modules" value={String(courses.length)} trend="neutral" />
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Building className="h-4 w-4" aria-hidden="true" />
            <span>Membership Cohorts</span>
          </div>
          <div className="mt-2 text-xl font-bold text-foreground">Open & Pro Tiers</div>
          <div className="mt-1 text-xs text-muted-foreground">Self-paced curriculum</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Course & Curriculum Progress</span>
          </div>
          <ul className="space-y-3">
            {courses.map((course) => (
              <li
                key={course.id}
                className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5 space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{course.title}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {course.lessonsCount} lessons · {course.tier}
                    </div>
                  </div>
                  {onOpenCourse && (
                    <Button size="sm" variant="outline" onClick={() => onOpenCourse(course.id)}>
                      Resume
                    </Button>
                  )}
                </div>
                <Progress value={course.completionPercent} variant="primary" showValue size="sm" />
              </li>
            ))}
          </ul>
        </Card>

        <ActivityFeed title="Community Activity" items={communityFeed} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Domain 17: Administration Panels (Health, Feature Flags, Settings)         */
/* -------------------------------------------------------------------------- */

export interface SystemHealthServiceItem {
  id: string;
  service: string;
  region: string;
  latencyLabel: string;
  status: 'operational' | 'degraded' | 'incident';
}

export function SystemHealthPanel({
  services,
  title = 'System health presentation',
  className,
}: {
  services: SystemHealthServiceItem[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <StatusBadge
          status={services.every((s) => s.status === 'operational') ? 'completed' : 'warning'}
          label={services.every((s) => s.status === 'operational') ? 'All systems nominal' : 'Attention needed'}
        />
      </div>
      <ul className="divide-y divide-border/70 text-xs">
        {services.map((svc) => (
          <li key={svc.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <div>
              <div className="font-semibold text-foreground">{svc.service}</div>
              <div className="text-[11px] text-muted-foreground">{svc.region}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono tabular-nums text-muted-foreground">{svc.latencyLabel}</span>
              <StatusBadge
                status={
                  svc.status === 'operational'
                    ? 'completed'
                    : svc.status === 'degraded'
                      ? 'warning'
                      : 'error'
                }
                label={svc.status}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export interface FeatureFlagEntry {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  environment?: string;
}

export function FeatureFlagsPanel({
  flags,
  onToggleFlag,
  title = 'Feature configuration',
  className,
}: {
  flags: FeatureFlagEntry[];
  onToggleFlag: (id: string, enabled: boolean) => void;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <ul className="divide-y divide-border/70">
        {flags.map((flag) => (
          <li key={flag.id} className="flex items-center justify-between gap-4 py-2.5 text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{flag.label}</span>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {flag.key}
                </code>
              </div>
              <div className="text-[11px] text-muted-foreground">{flag.description}</div>
            </div>
            <Button
              size="sm"
              variant={flag.enabled ? 'primary' : 'outline'}
              aria-pressed={flag.enabled}
              onClick={() => onToggleFlag(flag.id, !flag.enabled)}
            >
              {flag.enabled ? 'Enabled' : 'Disabled'}
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function WorkspaceSettingsPanel({
  workspaceName,
  defaultLocale,
  onSave,
  className,
}: {
  workspaceName: string;
  defaultLocale: string;
  onSave: (next: { workspaceName: string; defaultLocale: string }) => void;
  className?: string;
}) {
  const [nameDraft, setNameDraft] = React.useState(workspaceName);
  const [localeDraft, setLocaleDraft] = React.useState(defaultLocale);

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <h3 className="text-base font-semibold text-foreground">Workspace settings</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="wdr-ws-name" className="block text-xs font-medium text-foreground">
            Workspace name
          </label>
          <input
            id="wdr-ws-name"
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="wdr-ws-locale" className="block text-xs font-medium text-foreground">
            Default locale
          </label>
          <select
            id="wdr-ws-locale"
            value={localeDraft}
            onChange={(e) => setLocaleDraft(e.target.value)}
            className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
          >
            <option value="en-US">English (en-US)</option>
            <option value="en-GB">English (en-GB)</option>
            <option value="ar-SA">Arabic (ar-SA · RTL)</option>
            <option value="de-DE">German (de-DE)</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <Button size="sm" variant="primary" onClick={() => onSave({ workspaceName: nameDraft, defaultLocale: localeDraft })}>
          Save preferences
        </Button>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Domain 18 Additional Industry Patterns (Support, HR, Clinical, Legal)      */
/* -------------------------------------------------------------------------- */

export interface SupportTicketItem {
  id: string;
  ticketCode: string;
  subject: string;
  requester: string;
  slaRemaining: string;
  status: 'active' | 'pending' | 'completed' | 'warning';
  statusLabel: string;
}

export function SupportDeskPattern({
  tickets,
  onSelectTicket,
  className,
}: {
  tickets: SupportTicketItem[];
  onSelectTicket?: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Open Tickets" value={String(tickets.filter((t) => t.status !== 'completed').length)} trend="neutral" />
        <MetricCard label="SLA Compliance" value="97.4%" delta="+1.2%" trend="up" />
        <MetricCard label="Median First Response" value="14m" trend="up" />
      </div>
      <Card className="p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Customer Support & Triage Queue</h4>
        <ul className="divide-y divide-border/70">
          {tickets.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs">
              <div>
                <div className="font-semibold text-foreground">
                  <span className="font-mono text-muted-foreground mr-2">{t.ticketCode}</span>
                  {t.subject}
                </div>
                <div className="text-muted-foreground">
                  Requester: {t.requester} · SLA window: {t.slaRemaining}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={t.status} label={t.statusLabel} />
                {onSelectTicket && (
                  <Button size="sm" variant="outline" onClick={() => onSelectTicket(t.id)}>
                    Inspect
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function PeopleHrPattern({
  headcountLabel = '142',
  openRolesCount = 7,
  timeOffRequests,
  onDecision,
  className,
}: {
  headcountLabel?: string;
  openRolesCount?: number;
  timeOffRequests: ApprovalRequestItem[];
  onDecision: (id: string, decision: 'approved' | 'rejected', note?: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Active Workforce" value={headcountLabel} trend="neutral" />
        <MetricCard label="Open Requisitions" value={String(openRolesCount)} trend="up" />
        <MetricCard label="Onboarding Completion" value="92%" trend="up" />
      </div>
      <ApprovalQueue title="People & Time-Off Approvals" items={timeOffRequests} onDecision={onDecision} />
    </div>
  );
}

export function HealthcareClinicalPattern({
  appointments,
  complianceChecklist,
  className,
}: {
  appointments: Array<{ id: string; slotLabel: string; patientAlias: string; clinician: string; room: string; status: 'active' | 'pending' | 'completed' }>;
  complianceChecklist: Array<{ id: string; label: string; verified: boolean }>;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 lg:grid-cols-2', className)}>
      <Card className="p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Clinical Scheduling Queue (Synthetic)</h4>
        <ul className="divide-y divide-border/70 text-xs">
          {appointments.map((apt) => (
            <li key={apt.id} className="flex items-center justify-between gap-2 py-2">
              <div>
                <div className="font-semibold text-foreground">{apt.patientAlias} · {apt.slotLabel}</div>
                <div className="text-muted-foreground">{apt.clinician} · {apt.room}</div>
              </div>
              <StatusBadge status={apt.status} label={apt.status} />
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-5 space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Intake & Safety Verification</h4>
        <ul className="space-y-2 text-xs">
          {complianceChecklist.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded border border-border px-3 py-2">
              <span className="text-foreground">{item.label}</span>
              <StatusBadge status={item.verified ? 'completed' : 'pending'} label={item.verified ? 'Verified' : 'Required'} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function LegalCompliancePattern({
  contracts,
  className,
}: {
  contracts: Array<{ id: string; contractCode: string; title: string; counterparty: string; renewalDate: string; status: 'active' | 'pending' | 'warning' }>;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <h4 className="text-sm font-semibold text-foreground">Legal Contracts & Compliance Review</h4>
      <ul className="divide-y divide-border/70 text-xs">
        {contracts.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <div>
              <div className="font-semibold text-foreground">
                <span className="font-mono text-muted-foreground mr-2">{c.contractCode}</span>
                {c.title}
              </div>
              <div className="text-muted-foreground">
                {c.counterparty} · Renewal {c.renewalDate}
              </div>
            </div>
            <StatusBadge status={c.status} label={c.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function CommunityEventsPattern({
  events,
  onRsvp,
  className,
}: {
  events: Array<{ id: string; title: string; dateLabel: string; attendeesCount: number; rsvped?: boolean }>;
  onRsvp?: (id: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <h4 className="text-sm font-semibold text-foreground">Community & Events Schedule</h4>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5 space-y-2 text-xs">
            <div className="font-semibold text-foreground">{ev.title}</div>
            <div className="text-muted-foreground tabular-nums">
              {ev.dateLabel} · {ev.attendeesCount} attendees
            </div>
            {onRsvp && (
              <Button size="sm" variant={ev.rsvped ? 'primary' : 'outline'} onClick={() => onRsvp(ev.id)}>
                {ev.rsvped ? 'Registered' : 'RSVP'}
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

