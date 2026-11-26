import { BedDouble, Boxes, Briefcase, FileEdit, Layers, Sparkles } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { DataTable, type DataTableColumn } from '../data-table';
import { KpiCard } from '../kpi-card';
import { MetricCard } from '../metric-card';
import {
  KanbanBoard,
  ResourceAllocationBoard,
  StatusProgression,
  type KanbanCardItem,
  type KanbanColumnSpec,
  type ResourceAllocationRow,
  type StatusStage,
} from '../productivity';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* 9. CRM & Sales Pipeline Pattern                                            */
/* -------------------------------------------------------------------------- */

export interface CrmAccountRow {
  id: string;
  accountName: string;
  owner: string;
  stage: string;
  dealValueLabel: string;
  health: 'active' | 'pending' | 'warning';
}

const CRM_COLUMNS: DataTableColumn<CrmAccountRow>[] = [
  {
    key: 'accountName',
    header: 'Account (Demo)',
    sortable: true,
    accessor: (r) => r.accountName,
    cell: (r) => <span className="font-semibold text-foreground">{r.accountName}</span>,
  },
  {
    key: 'owner',
    header: 'Account Lead',
    accessor: (r) => r.owner,
    cell: (r) => r.owner,
  },
  {
    key: 'stage',
    header: 'Stage',
    filterable: true,
    accessor: (r) => r.stage,
    cell: (r) => r.stage,
  },
  {
    key: 'dealValueLabel',
    header: 'Value',
    align: 'right',
    accessor: (r) => r.dealValueLabel,
    cell: (r) => <span className="font-semibold tabular-nums">{r.dealValueLabel}</span>,
  },
  {
    key: 'health',
    header: 'Health',
    cell: (r) => <StatusBadge status={r.health} label={r.health} />,
  },
];

export function CrmSalesPipelinePattern({
  pipelineValueLabel = '$420,000',
  winRateLabel = '32.4%',
  activeDealsCount = 24,
  columns,
  deals,
  onMoveDeal,
  accounts,
  className,
}: {
  pipelineValueLabel?: string;
  winRateLabel?: string;
  activeDealsCount?: number;
  columns: KanbanColumnSpec[];
  deals: KanbanCardItem[];
  onMoveDeal?: (cardId: string, toColumnId: string, toIndex: number) => void;
  accounts: CrmAccountRow[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Weighted Pipeline" value={pipelineValueLabel} delta="+11.2%" trend="up" />
        <MetricCard label="Win Rate" value={winRateLabel} delta="+2.1%" trend="up" />
        <MetricCard label="Active Opportunities" value={String(activeDealsCount)} trend="neutral" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Deal Stage Board</span>
        </div>
        <KanbanBoard columns={columns} cards={deals} onMoveCard={onMoveDeal} />
      </Card>

      <DataTable
        aria-label="CRM active accounts table"
        data={accounts}
        columns={CRM_COLUMNS}
        getRowId={(r) => r.id}
        searchable
        pageSize={5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. Inventory & Warehouse Pattern                                          */
/* -------------------------------------------------------------------------- */

export interface WarehouseZoneItem {
  id: string;
  zoneName: string;
  occupancyPercent: number;
  skuCount: number;
}

export interface InventorySkuRow {
  id: string;
  sku: string;
  itemName: string;
  zone: string;
  onHand: number;
  reorderPoint: number;
  status: 'active' | 'warning' | 'error';
}

export function InventoryWarehousePattern({
  zones,
  skus,
  onReorderSku,
  className,
}: {
  zones: WarehouseZoneItem[];
  skus: InventorySkuRow[];
  onReorderSku?: (skuId: string) => void;
  className?: string;
}) {
  const columns: DataTableColumn<InventorySkuRow>[] = [
    {
      key: 'sku',
      header: 'SKU',
      sortable: true,
      accessor: (r) => r.sku,
      cell: (r) => <span className="font-mono text-xs font-semibold">{r.sku}</span>,
    },
    {
      key: 'itemName',
      header: 'Item',
      sortable: true,
      accessor: (r) => r.itemName,
      cell: (r) => r.itemName,
    },
    {
      key: 'zone',
      header: 'Zone',
      filterable: true,
      accessor: (r) => r.zone,
      cell: (r) => r.zone,
    },
    {
      key: 'onHand',
      header: 'On Hand',
      align: 'right',
      accessor: (r) => String(r.onHand),
      cell: (r) => <span className="tabular-nums font-semibold">{r.onHand}</span>,
    },
    {
      key: 'status',
      header: 'Stock Status',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <StatusBadge
            status={r.status}
            label={r.onHand <= r.reorderPoint ? 'Reorder needed' : 'Healthy'}
          />
          {onReorderSku && r.onHand <= r.reorderPoint && (
            <Button size="sm" variant="outline" onClick={() => onReorderSku(r.id)}>
              Reorder
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {zones.map((z) => (
          <Card key={z.id} className="p-4 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Boxes className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span>{z.zoneName}</span>
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">{z.skuCount} SKUs</span>
            </div>
            <Progress value={z.occupancyPercent} variant={z.occupancyPercent > 85 ? 'warning' : 'primary'} showValue size="sm" />
          </Card>
        ))}
      </div>

      <DataTable
        aria-label="Warehouse inventory table"
        data={skus}
        columns={columns}
        getRowId={(r) => r.id}
        searchable
        pageSize={5}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. Project Delivery & Engineering Pattern                                 */
/* -------------------------------------------------------------------------- */

export function ProjectDeliveryPattern({
  sprintName = 'Release Cycle Q4-S2',
  completionPercent = 76,
  kanbanColumns,
  kanbanCards,
  onMoveCard,
  resources,
  periods,
  className,
}: {
  sprintName?: string;
  completionPercent?: number;
  kanbanColumns: KanbanColumnSpec[];
  kanbanCards: KanbanCardItem[];
  onMoveCard?: (cardId: string, toColumnId: string, toIndex: number) => void;
  resources: ResourceAllocationRow[];
  periods: string[];
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard
          title={sprintName}
          actual={`${completionPercent}%`}
          target="100%"
          completion={completionPercent}
          status="on_track"
        />
        <MetricCard label="Open Deliverables" value={String(kanbanCards.length)} trend="neutral" />
        <MetricCard label="Team Capacity" value={`${resources.length} contributors`} trend="up" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Delivery Board</span>
        </div>
        <KanbanBoard columns={kanbanColumns} cards={kanbanCards} onMoveCard={onMoveCard} />
      </Card>

      <ResourceAllocationBoard periods={periods} resources={resources} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 12. Hospitality, Real Estate & Property Booking Pattern                    */
/* -------------------------------------------------------------------------- */

export interface HospitalityUnitItem {
  id: string;
  unitCode: string;
  category: string;
  guestOrTenant: string;
  windowLabel: string;
  status: 'active' | 'pending' | 'completed' | 'warning';
  statusLabel: string;
}

export function HospitalityBookingPattern({
  occupancyLabel = '88%',
  adrLabel = '$215',
  checkInsToday = 14,
  units,
  onCheckIn,
  className,
}: {
  occupancyLabel?: string;
  adrLabel?: string;
  checkInsToday?: number;
  units: HospitalityUnitItem[];
  onCheckIn?: (unitId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Occupancy Rate" value={occupancyLabel} delta="+4.2%" trend="up" />
        <MetricCard label="Average Daily Rate" value={adrLabel} delta="+3.1%" trend="up" />
        <MetricCard label="Arrivals Today" value={String(checkInsToday)} trend="neutral" />
      </div>

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BedDouble className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Unit Availability & Arrivals Queue</span>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {units.map((u) => (
            <div key={u.id} className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-foreground">{u.unitCode}</span>
                <StatusBadge status={u.status} label={u.statusLabel} />
              </div>
              <div className="font-medium text-foreground">{u.category}</div>
              <div className="text-muted-foreground">
                {u.guestOrTenant} · {u.windowLabel}
              </div>
              {onCheckIn && u.status === 'pending' && (
                <Button size="sm" variant="primary" onClick={() => onCheckIn(u.id)}>
                  Check in
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 13. Creator, Media & Publishing Pipeline Pattern                           */
/* -------------------------------------------------------------------------- */

export interface PublishingDraftItem {
  id: string;
  title: string;
  channel: string;
  author: string;
  scheduledFor: string;
  stage: 'draft' | 'review' | 'scheduled' | 'published';
}

export function CreatorPublishingPattern({
  subscribersLabel = '48.2K',
  openRateLabel = '46.5%',
  editorialStages,
  drafts,
  onPublishDraft,
  className,
}: {
  subscribersLabel?: string;
  openRateLabel?: string;
  editorialStages: StatusStage[];
  drafts: PublishingDraftItem[];
  onPublishDraft?: (draftId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Active Subscribers" value={subscribersLabel} delta="+1,140" trend="up" />
        <MetricCard label="Engagement Rate" value={openRateLabel} delta="+1.8%" trend="up" />
        <MetricCard label="Scheduled Releases" value={String(drafts.length)} trend="neutral" />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <span>Editorial Workflow</span>
        </div>
        <StatusProgression stages={editorialStages} />
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileEdit className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>Upcoming Editions & Assets</span>
        </div>
        <ul className="divide-y divide-border/70 text-xs">
          {drafts.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div>
                <div className="font-semibold text-foreground">{d.title}</div>
                <div className="text-muted-foreground">
                  {d.channel} · {d.author} · {d.scheduledFor}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={
                    d.stage === 'published'
                      ? 'completed'
                      : d.stage === 'scheduled'
                        ? 'active'
                        : 'pending'
                  }
                  label={d.stage}
                />
                {onPublishDraft && d.stage !== 'published' && (
                  <Button size="sm" variant="outline" onClick={() => onPublishDraft(d.id)}>
                    Publish
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
