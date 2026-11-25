import * as React from 'react';
import { Copy, ExternalLink, Layers, ShieldCheck, Users } from 'lucide-react';
import { ActivityFeed } from '@/components/business/activity-feed';
import { DashboardGrid, DashboardGridItem } from '@/components/business/dashboard-grid';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { FilterBar } from '@/components/business/filter-bar';
import { KpiCard } from '@/components/business/kpi-card';
import { MetricCard } from '@/components/business/metric-card';
import { PageHeader } from '@/components/business/page-header';
import { StatusBadge } from '@/components/business/status-badge';
import { TeamDirectory } from '@/components/business/team-directory';
import { UserProfile } from '@/components/business/user-profile';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import {
  WENDORO_DEMO_ACTIVITY,
  WENDORO_DEMO_MODULES,
  WENDORO_TEAM_MEMBERS,
  type EcosystemModuleRow,
} from '@/data/wendoro-demo-data';

const COLUMNS: DataTableColumn<EcosystemModuleRow>[] = [
  {
    key: 'id',
    header: 'Module ID',
    sortable: true,
    accessor: (r) => r.id,
    cell: (r) => <span className="font-mono text-xs font-medium">{r.id}</span>,
  },
  {
    key: 'module',
    header: 'Product',
    sortable: true,
    accessor: (r) => r.module,
    cell: (r) => <span className="font-medium text-foreground">{r.module}</span>,
  },
  {
    key: 'domain',
    header: 'Scope (Demo)',
    sortable: true,
    accessor: (r) => r.domain,
    cell: (r) => <span className="text-muted-foreground">{r.domain}</span>,
  },
  {
    key: 'maintainer',
    header: 'Team Member',
    sortable: true,
    accessor: (r) => r.maintainer,
    cell: (r) => (
      <div className="flex items-center gap-2">
        <Avatar alt={r.maintainer} size="xs" />
        <span className="text-foreground">{r.maintainer}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} />,
  },
];

export function BusinessShowcaseSection() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedIds, setSelectedIds] = React.useState<string[]>(['MOD-01']);
  const [simulateLoading, setSimulateLoading] = React.useState(false);

  const filteredModules = React.useMemo(() => {
    return WENDORO_DEMO_MODULES.filter((row) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        row.module.toLowerCase().includes(q) ||
        row.domain.toLowerCase().includes(q) ||
        row.maintainer.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const teamWithActions = React.useMemo(
    () =>
      WENDORO_TEAM_MEMBERS.map((member) => ({
        ...member,
        actions: [
          {
            id: 'copy-name',
            label: 'Copy display name',
            icon: <Copy className="h-3.5 w-3.5" />,
            onSelect: () => {
              toast({ title: `Copied ${member.name}`, variant: 'default' });
            },
          },
          ...(member.email
            ? [
                {
                  id: 'view-email',
                  label: `Email ${member.email}`,
                  icon: <ExternalLink className="h-3.5 w-3.5" />,
                  onSelect: () => {
                    toast({ title: `Contact: ${member.email}`, variant: 'default' });
                  },
                },
              ]
            : []),
        ],
      })),
    [toast]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Application Components"
        description="Illustrative design-system demonstration of TeamDirectory, UserProfile, ActivityFeed, DataTable, MetricCard, and KpiCard using synthetic demo data."
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
            label="Ecosystem Products (Demo)"
            value="8"
            delta="Shared UI"
            trend="neutral"
            period="Wendoro design language"
            icon={<Layers className="h-4 w-4" />}
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <MetricCard
            label="Directory Profiles (Demo)"
            value="4"
            delta="Initials avatars"
            trend="neutral"
            period="Wendoro team showcase"
            icon={<Users className="h-4 w-4" />}
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <KpiCard
            title="Token Adoption (Sample)"
            actual="96%"
            target="100%"
            completion={96}
            status="on_track"
            period="Sample UI demonstration"
          />
        </DashboardGridItem>
        <DashboardGridItem span={3}>
          <KpiCard
            title="Pending Audits (Sample)"
            actual="2"
            target="0"
            completion={65}
            status="at_risk"
            period="Sample UI demonstration"
          />
        </DashboardGridItem>

        <DashboardGridItem span={8}>
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Team Directory</CardTitle>
                <CardDescription>
                  Search, filter, and switch between Grid and List layouts. Shows provided details only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeamDirectory
                  members={teamWithActions}
                  demoNotice="Sample team showcase for @wendoro/ui documentation. Only explicitly provided roles and emails are shown."
                  onContactMember={(member) =>
                    toast({
                      title: `Contact ${member.name}`,
                      description: member.email,
                      variant: 'default',
                    })
                  }
                />
              </CardContent>
            </Card>

            <div className="space-y-3">
              <FilterBar
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search product, scope, or team member…"
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
                      { value: 'warning', label: 'Review' },
                      { value: 'draft', label: 'Draft' },
                    ],
                  },
                ]}
              />
              <DataTable
                data={filteredModules}
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
          </div>
        </DashboardGridItem>

        <DashboardGridItem span={4}>
          <div className="space-y-4">
            <UserProfile
              variant="card"
              name="Demo Lead"
              role="Sample Systems Lead"
              department="Demo Workspace"
              email="lead@demo.invalid"
              status="online"
              statusBadge="completed"
              statusLabel="Verified"
              onContact={() =>
                toast({
                  title: 'Contact Demo Lead',
                  description: 'lead@demo.invalid',
                  variant: 'default',
                })
              }
              actions={[
                {
                  id: 'copy-email',
                  label: 'Copy email address',
                  onSelect: () => toast({ title: 'Copied lead@demo.invalid' }),
                },
              ]}
            />

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>Activity Feed</CardTitle>
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <CardDescription>
                  Sample UI demonstration events (not actual company transactions).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityFeed
                  items={WENDORO_DEMO_ACTIVITY}
                  demoLabel="Demo data — illustrative component preview only."
                />
              </CardContent>
            </Card>
          </div>
        </DashboardGridItem>
      </DashboardGrid>
    </div>
  );
}
