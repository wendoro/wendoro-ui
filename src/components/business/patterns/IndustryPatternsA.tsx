import * as React from 'react';
import { Calendar, Check, Clock, Package, ShieldCheck, Store } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import {
  WorkspaceSwitcher,
  type WorkspaceOption,
} from '../../ui/navigation-ext';
import { OnboardingChecklist, type OnboardingStepItem } from '../../ui/ux-patterns';
import { DataComparisonTable, type ComparisonAttributeRow, type ComparisonSubject } from '../data-comparison';
import { DataTable, type DataTableColumn } from '../data-table';
import { KpiCard } from '../kpi-card';
import { MetricCard } from '../metric-card';
import {
  ApprovalQueue,
  KanbanBoard,
  ResourceAllocationBoard,
  StatusProgression,
  type ApprovalRequestItem,
  type KanbanCardItem,
  type KanbanColumnSpec,
  type ResourceAllocationRow,
  type StatusStage,
} from '../productivity';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* 1. Agency Workspace Pattern                                                */
/* -------------------------------------------------------------------------- */

export interface AgencyWorkspacePatternProps {
  clients: WorkspaceOption[];
  activeClientId: string;
  onSelectClient: (id: string) => void;
  kanbanColumns: KanbanColumnSpec[];
  kanbanCards: KanbanCardItem[];
  onMoveCard?: (cardId: string, toColumnId: string, toIndex: number) => void;
  resources: ResourceAllocationRow[];
  resourcePeriods: string[];
  approvals: ApprovalRequestItem[];
  onApprovalDecision: (id: string, decision: 'approved' | 'rejected', note?: string) => void;
  chartSlot?: React.ReactNode;
  className?: string;
}

export function AgencyWorkspacePattern({
  clients,
  activeClientId,
  onSelectClient,
  kanbanColumns,
  kanbanCards,
  onMoveCard,
  resources,
  resourcePeriods,
  approvals,
  onApprovalDecision,
  chartSlot,
  className,
}: AgencyWorkspacePatternProps) {
  const activeClient = clients.find((c) => c.id === activeClientId) ?? clients[0];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Agency client workspace</div>
          <h3 className="text-base font-semibold text-foreground">{activeClient?.name ?? 'Client Portal'}</h3>
        </div>
        <WorkspaceSwitcher
          workspaces={clients}
          activeWorkspaceId={activeClientId}
          onSelectWorkspace={onSelectClient}
          label="Switch client workspace"
        />
      </div>

      <KanbanBoard columns={kanbanColumns} cards={kanbanCards} onMoveCard={onMoveCard} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResourceAllocationBoard periods={resourcePeriods} resources={resources} />
        <ApprovalQueue title="Client Deliverable Approvals" items={approvals} onDecision={onApprovalDecision} />
      </div>

      {chartSlot}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. SaaS Administration Pattern                                             */
/* -------------------------------------------------------------------------- */

export interface SaasUsageMetric {
  id: string;
  label: string;
  used: string;
  limit: string;
  percent: number;
  status: 'on_track' | 'at_risk' | 'off_track';
}

export interface SaasAdminPatternProps {
  tenants: WorkspaceOption[];
  activeTenantId: string;
  onSelectTenant: (id: string) => void;
  subscriptionPlan: string;
  billingCycleLabel: string;
  usageMetrics: SaasUsageMetric[];
  planSubjects: ComparisonSubject[];
  planFeatures: ComparisonAttributeRow[];
  onboardingSteps?: OnboardingStepItem[];
  onToggleOnboardingStep?: (id: string, completed: boolean) => void;
  chartSlot?: React.ReactNode;
  className?: string;
}

export function SaasAdminPattern({
  tenants,
  activeTenantId,
  onSelectTenant,
  subscriptionPlan,
  billingCycleLabel,
  usageMetrics,
  planSubjects,
  planFeatures,
  onboardingSteps,
  onToggleOnboardingStep,
  chartSlot,
  className,
}: SaasAdminPatternProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Subscription: {subscriptionPlan}</h3>
            <StatusBadge status="active" label="Active" />
          </div>
          <p className="text-xs text-muted-foreground">{billingCycleLabel}</p>
        </div>
        <WorkspaceSwitcher
          workspaces={tenants}
          activeWorkspaceId={activeTenantId}
          onSelectWorkspace={onSelectTenant}
          label="Switch tenant"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {usageMetrics.map((m) => (
          <KpiCard
            key={m.id}
            title={m.label}
            actual={m.used}
            target={m.limit}
            completion={m.percent}
            status={m.status}
          />
        ))}
      </div>

      {onboardingSteps && onboardingSteps.length > 0 && (
        <OnboardingChecklist
          title="Tenant launch checklist"
          steps={onboardingSteps}
          onToggleStep={onToggleOnboardingStep}
        />
      )}

      {chartSlot}

      <DataComparisonTable subjects={planSubjects} rows={planFeatures} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. E-Commerce & Marketplace Operations Pattern                             */
/* -------------------------------------------------------------------------- */

export interface CommerceOrderRow {
  id: string;
  orderNumber: string;
  customer: string;
  vendor: string;
  itemsCount: number;
  totalLabel: string;
  status: 'active' | 'pending' | 'completed' | 'error';
  statusLabel: string;
}

export interface CommerceProductCard {
  id: string;
  sku: string;
  name: string;
  vendor: string;
  priceLabel: string;
  stockCount: number;
  lowStockThreshold?: number;
}

export interface CommerceOperationsPatternProps {
  orders: CommerceOrderRow[];
  products: CommerceProductCard[];
  fulfilmentStages: StatusStage[];
  onRestockProduct?: (productId: string) => void;
  className?: string;
}

const ORDER_COLUMNS: DataTableColumn<CommerceOrderRow>[] = [
  {
    key: 'orderNumber',
    header: 'Order #',
    sortable: true,
    accessor: (r) => r.orderNumber,
    cell: (r) => <span className="font-mono text-xs font-semibold">{r.orderNumber}</span>,
  },
  {
    key: 'customer',
    header: 'Customer (Demo)',
    sortable: true,
    accessor: (r) => r.customer,
    cell: (r) => r.customer,
  },
  {
    key: 'vendor',
    header: 'Vendor',
    filterable: true,
    accessor: (r) => r.vendor,
    cell: (r) => r.vendor,
  },
  {
    key: 'totalLabel',
    header: 'Total',
    align: 'right',
    accessor: (r) => r.totalLabel,
    cell: (r) => <span className="font-semibold tabular-nums">{r.totalLabel}</span>,
  },
  {
    key: 'statusLabel',
    header: 'Fulfilment',
    filterable: true,
    accessor: (r) => r.statusLabel,
    cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} />,
  },
];

export function CommerceOperationsPattern({
  orders,
  products,
  fulfilmentStages,
  onRestockProduct,
  className,
}: CommerceOperationsPatternProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Order & Return Fulfilment Pipeline</span>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{orders.length} active orders</span>
        </div>
        <StatusProgression stages={fulfilmentStages} />
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {products.map((prod) => {
          const low = prod.stockCount <= (prod.lowStockThreshold ?? 10);
          return (
            <Card key={prod.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] text-muted-foreground">{prod.sku}</div>
                  <h4 className="text-sm font-semibold text-foreground">{prod.name}</h4>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Store className="h-3 w-3" aria-hidden="true" />
                    <span>{prod.vendor}</span>
                  </div>
                </div>
                <span className="text-sm font-bold tabular-nums text-foreground">{prod.priceLabel}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-2.5 text-xs">
                <StatusBadge
                  status={low ? 'warning' : 'completed'}
                  label={low ? `Low stock: ${prod.stockCount}` : `In stock: ${prod.stockCount}`}
                />
                {onRestockProduct && (
                  <Button size="sm" variant="outline" onClick={() => onRestockProduct(prod.id)}>
                    Restock
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <DataTable
        aria-label="Marketplace orders table"
        data={orders}
        columns={ORDER_COLUMNS}
        getRowId={(r) => r.id}
        searchable
        enableExport
        pageSize={5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Professional Services Pattern (Services, Booking, Proposals)            */
/* -------------------------------------------------------------------------- */

export interface ServiceCatalogItem {
  id: string;
  name: string;
  durationLabel: string;
  rateLabel: string;
  description: string;
}

export interface BookingSlot {
  id: string;
  dateLabel: string;
  timeLabel: string;
  specialist: string;
  available: boolean;
}

export interface ProfessionalServicesPatternProps {
  services: ServiceCatalogItem[];
  slots: BookingSlot[];
  selectedServiceId?: string;
  selectedSlotId?: string;
  onSelectService?: (id: string) => void;
  onBookSlot?: (slotId: string) => void;
  proposalStatusLabel?: string;
  className?: string;
}

export function ProfessionalServicesPattern({
  services,
  slots,
  selectedServiceId,
  selectedSlotId,
  onSelectService,
  onBookSlot,
  proposalStatusLabel = 'Proposal Awaiting Client Signature',
  className,
}: ProfessionalServicesPatternProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Active Engagements" value="18" delta="+3 this month" trend="up" />
        <MetricCard label="Proposal Status" value={proposalStatusLabel} trend="neutral" />
        <MetricCard label="Billable Utilization" value="84%" delta="On target" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Service Catalogue</span>
          </div>
          <ul className="space-y-2.5">
            {services.map((svc) => {
              const selected = svc.id === selectedServiceId;
              return (
                <li key={svc.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onSelectService?.(svc.id)}
                    className={cn(
                      'w-full rounded-[var(--wdr-radius-md)] border p-3.5 text-left transition-colors',
                      selected
                        ? 'border-foreground bg-primary-subtle/40'
                        : 'border-border bg-surface hover:bg-muted/40'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{svc.name}</span>
                      <span className="text-xs font-bold tabular-nums text-foreground">{svc.rateLabel}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{svc.description}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>{svc.durationLabel}</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span>Appointment Booking Slots</span>
          </div>
          <ul className="space-y-2">
            {slots.map((slot) => {
              const booked = slot.id === selectedSlotId;
              return (
                <li
                  key={slot.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3.5 py-2.5"
                >
                  <div>
                    <div className="text-xs font-semibold text-foreground tabular-nums">
                      {slot.dateLabel} · {slot.timeLabel}
                    </div>
                    <div className="text-[11px] text-muted-foreground">With {slot.specialist}</div>
                  </div>
                  <Button
                    size="sm"
                    variant={booked ? 'primary' : 'outline'}
                    disabled={!slot.available && !booked}
                    leftIcon={booked ? <Check className="h-3.5 w-3.5" /> : undefined}
                    onClick={() => onBookSlot?.(slot.id)}
                  >
                    {booked ? 'Booked' : slot.available ? 'Book slot' : 'Unavailable'}
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
