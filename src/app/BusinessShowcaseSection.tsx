import * as React from 'react';
import { CreditCard, GitPullRequest, ShieldCheck, Users } from 'lucide-react';
import { ActivityFeed, type ActivityFeedEntry } from '@/components/business/activity-feed';
import { DashboardGrid, DashboardGridItem } from '@/components/business/dashboard-grid';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { FilterBar } from '@/components/business/filter-bar';
import { KpiCard } from '@/components/business/kpi-card';
import { MetricCard } from '@/components/business/metric-card';
import { PageHeader } from '@/components/business/page-header';
import { StatusBadge, type BusinessStatus } from '@/components/business/status-badge';
import { UserProfile } from '@/components/business/user-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountRecord {
  id: string;
  organization: string;
  product: string;
  owner: string;
  seats: number;
  mrr: number;
  status: BusinessStatus;
}

const ACCOUNTS: AccountRecord[] = [
  { id: 'WDR-201', organization: 'Aravind Textiles', product: 'Wendoro Commerce', owner: 'Ananya Rao', seats: 42, mrr: 3200, status: 'active' },
  { id: 'WDR-202', organization: 'Kaveri Logistics', product: 'Wendoro Flow', owner: 'Rohan Mehta', seats: 18, mrr: 1450, status: 'pending' },
  { id: 'WDR-203', organization: 'Narmada Retail', product: 'Wendoro Desk', owner: 'Clara Lindqvist', seats: 64, mrr: 4800, status: 'completed' },
  { id: 'WDR-204', organization: 'Surya Precision', product: 'Wendoro Insights', owner: 'Ananya Rao', seats: 29, mrr: 2350, status: 'warning' },
  { id: 'WDR-205', organization: 'Malabar Spices', product: 'Wendoro People', owner: 'Rohan Mehta', seats: 55, mrr: 3900, status: 'active' },
  { id: 'WDR-206', organization: 'Deccan Energy', product: 'Wendoro Platform', owner: 'Clara Lindqvist', seats: 12, mrr: 980, status: 'draft' },
];

const ACTIVITY_ITEMS: ActivityFeedEntry[] = [
  {
    id: 'a1',
    actor: 'Ananya Rao',
    actorAvatar: '/src/assets/images/avatar_product_lead_1795446315491.jpg',
    action: 'approved settlement batch',
    target: '#SL-4092',
    timestamp: '6m ago',
    detail: 'Wendoro Commerce · $48,200 cleared',
  },
  {
    id: 'a2',
    actor: 'Rohan Mehta',
    actorAvatar: '/src/assets/images/avatar_systems_architect_1795446316565.jpg',
    action: 'updated routing rule in',
    target: 'Wendoro Flow',
    timestamp: '34m ago',
    detail: 'Dual-control sign-off enabled for payouts > $10,000',
  },
  {
    id: 'a3',
    actor: 'Clara Lindqvist',
    actorAvatar: '/src/assets/images/avatar_design_director_1795446316268.jpg',
    action: 'published UI token audit',
    target: '@wendoro/ui v0.1.0',
    timestamp: '2h ago',
    icon: <GitPullRequest className="h-4 w-4" />,
  },
];

const COLUMNS: DataTableColumn<AccountRecord>[] = [
  {
    key: 'id',
    header: 'Account ID',
    sortable: true,
    accessor: (r) => r.id,
    cell: (r) => <span className="font-mono text-xs font-medium">{r.id}</span>,
  },
  {
    key: 'organization',
    header: 'Organization',
    sortable: true,
    accessor: (r) => r.organization,
    cell: (r) => <span className="font-medium text-foreground">{r.organization}</span>,
  },
  {
    key: 'product',
    header: 'Product',
    sortable: true,
    accessor: (r) => r.product,
    cell: (r) => <span className="text-muted-foreground">{r.product}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => <StatusBadge status={r.status} />,
  },
  {
    key: 'seats',
    header: 'Seats',
    align: 'right',
    sortable: true,
    accessor: (r) => r.seats,
    cell: (r) => <span className="tabular-nums">{r.seats}</span>,
  },
  {
    key: 'mrr',
    header: 'MRR',
    align: 'right',
    sortable: true,
    accessor: (r) => r.mrr,
    cell: (r) => <span className="font-mono tabular-nums">${r.mrr.toLocaleString()}</span>,
  },
];

export function BusinessShowcaseSection() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState<string[]>(['WDR-201']);
  const [simulateLoading, setSimulateLoading] = React.useState(false);

  const filteredAccounts = React.useMemo(() => {
    return ACCOUNTS.filter((acc) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        acc.organization.toLowerCase().includes(q) ||
        acc.product.toLowerCase().includes(q) ||
        acc.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ecosystem Operations"
        description="Composed business patterns combining PageHeader, DashboardGrid, MetricCard, KpiCard, FilterBar, DataTable, UserProfile, and ActivityFeed."
        breadcrumbs={[{ label: 'Wendoro' }, { label: 'Business Patterns' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSimulateLoading(true);
              window.setTimeout(() => setSimulateLoading(false), 900);
            }}
          >
            Test Table Skeleton
          </Button>
        }
      />

      <DashboardGrid>
        <DashboardGridItem span={3}>
          <MetricCard
            label="Active Workspaces"
            value="1,284"
            delta="+8.4%"
            trend="up"
            period="Last 30 days"
            icon={<Users className="h-4 w-4" />}
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <MetricCard
            label="Monthly Volume"
            value="$412,900"
            delta="+14.2%"
            trend="up"
            period="Across Wendoro Commerce"
            icon={<CreditCard className="h-4 w-4" />}
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <KpiCard
            title="SLA Compliance"
            actual="98.4%"
            target="99.0%"
            completion={98}
            status="on_track"
            period="Wendoro Support"
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <KpiCard
            title="Pending Reviews"
            actual="14"
            target="5"
            completion={42}
            status="at_risk"
            period="Wendoro Flow"
          />
        </DashboardGridItem>

        <DashboardGridItem span={8}>
          <div className="space-y-3">
            <FilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search organization, product, or ID…"
              activeFilterCount={(search ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0)}
              onReset={() => {
                setSearch('');
                setStatusFilter('all');
              }}
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
                    { value: 'warning', label: 'Attention' },
                    { value: 'draft', label: 'Draft' },
                  ],
                },
              ]}
            />
            <DataTable
              data={filteredAccounts}
              columns={COLUMNS}
              getRowId={(r) => r.id}
              loading={simulateLoading}
              selectable
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              pageSize={4}
              emptyAction={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          </div>
        </DashboardGridItem>

        <DashboardGridItem span={4}>
          <div className="space-y-4">
            <UserProfile
              variant="card"
              name="Ananya Rao"
              role="Principal Systems Lead"
              department="Wendoro Platform"
              email="ananya@wendoro.in"
              avatarSrc="/src/assets/images/avatar_product_lead_1795446315491.jpg"
              status="online"
              action={<StatusBadge status="active" label="Verified" />}
            />

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Activity Feed</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <CardDescription>Recent cross-product audit trail.</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed items={ACTIVITY_ITEMS} />
              </CardContent>
            </Card>
          </div>
        </DashboardGridItem>
      </DashboardGrid>
    </div>
  );
}
