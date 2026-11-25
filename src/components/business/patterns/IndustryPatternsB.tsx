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
