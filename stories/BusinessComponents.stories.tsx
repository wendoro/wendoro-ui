import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Search, SlidersHorizontal, Terminal } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import { CommandPalette } from '../src/components/ui/command';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../src/components/ui/accordion';
import { MetricCard } from '../src/components/business/metric-card';
import { KpiCard } from '../src/components/business/kpi-card';
import { StatusBadge } from '../src/components/business/status-badge';
import { UserProfile } from '../src/components/business/user-profile';
import { DataTable, type DataTableColumn } from '../src/components/business/data-table';
import { FilterBar } from '../src/components/business/filter-bar';
import { PageHeader } from '../src/components/business/page-header';
import { DashboardGrid, DashboardGridItem } from '../src/components/business/dashboard-grid';
import { WENDORO_DEMO_MODULES, type EcosystemModuleRow } from '../src/data/wendoro-demo-data';

const columns: DataTableColumn<EcosystemModuleRow>[] = [
  { key: 'id', header: 'Module', sortable: true, accessor: (r) => r.id, cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: 'module', header: 'Product', sortable: true, accessor: (r) => r.module, cell: (r) => <span className="font-medium">{r.module}</span> },
  { key: 'domain', header: 'Scope (Demo)', sortable: true, accessor: (r) => r.domain, cell: (r) => r.domain },
  { key: 'maintainer', header: 'Team Member', sortable: true, accessor: (r) => r.maintainer, cell: (r) => r.maintainer },
  { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} /> },
];

const meta: Meta = {
  title: 'Business/Dashboard Showcase',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wendoro design-system dashboard showcase using Wendoro team data and illustrative demo records.',
      },
    },
  },
};

export default meta;

function EnterpriseWorkspaceDemo() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [commandOpen, setCommandOpen] = React.useState(false);

  const filtered = WENDORO_DEMO_MODULES.filter((row) => {
    const matchesSearch =
      !search ||
      row.module.toLowerCase().includes(search.toLowerCase()) ||
      row.maintainer.toLowerCase().includes(search.toLowerCase()) ||
      row.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wendoro Design System Showcase"
        description="Illustrative business component composition across Wendoro applications (demo data)."
        breadcrumbs={[{ label: 'Wendoro' }, { label: 'Business Components' }]}
        actions={
          <Button
            variant="outline"
            leftIcon={<Terminal className="h-4 w-4" />}
            onClick={() => setCommandOpen(true)}
          >
            Command Palette
          </Button>
        }
      />

      <DashboardGrid>
        <DashboardGridItem span={4}>
          <MetricCard
            label="Ecosystem Products (Demo)"
            value="8"
            delta="Unified UI"
            trend="neutral"
            period="Wendoro suite"
          />
        </DashboardGridItem>
        <DashboardGridItem span={4}>
          <KpiCard
            title="Token Adoption (Demo)"
            actual="96%"
            target="100%"
            completion={96}
            status="on_track"
            period="Sample UI demonstration"
          />
        </DashboardGridItem>
        <DashboardGridItem span={4}>
          <UserProfile
            variant="card"
            name="Ananya Rao"
            role="Principal Systems Lead"
            department="Wendoro Platform"
            email="ananya@wendoro.in"
            status="online"
            statusBadge="completed"
            statusLabel="Verified"
          />
        </DashboardGridItem>
      </DashboardGrid>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search modules or team members…"
        activeFilterCount={statusFilter !== 'all' ? 1 : 0}
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
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'warning', label: 'Review' },
              { value: 'draft', label: 'Draft' },
            ],
          },
        ]}
      />

      <DataTable data={filtered} columns={columns} getRowId={(r) => r.id} selectable pageSize={4} />

      <Accordion defaultValue="faq-1">
        <AccordionItem value="faq-1">
          <AccordionTrigger>How are styles distributed to consuming apps?</AccordionTrigger>
          <AccordionContent>
            Consuming applications import @wendoro/ui and @wendoro/ui/styles.css directly without manual Tailwind scanning paths.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={[
          { id: '1', label: 'Filter active modules', group: 'Showcase', icon: <SlidersHorizontal className="h-4 w-4" />, shortcut: 'F', onSelect: () => setStatusFilter('active') },
          { id: '2', label: 'Reset table filters', group: 'Showcase', icon: <Search className="h-4 w-4" />, shortcut: 'R', onSelect: () => { setSearch(''); setStatusFilter('all'); } },
        ]}
      />
    </div>
  );
}

export const EnterpriseWorkspace: StoryObj = {
  render: () => <EnterpriseWorkspaceDemo />,
};
