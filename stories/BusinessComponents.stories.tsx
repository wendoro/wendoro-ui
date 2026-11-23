import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Search, SlidersHorizontal, Terminal } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import { DatePicker } from '../src/components/ui/date-picker';
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

interface InvoiceRow {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'active' | 'pending' | 'warning' | 'completed';
}

const sampleRows: InvoiceRow[] = [
  { id: 'INV-1041', customer: 'Aravind Textiles', product: 'Wendoro Commerce', amount: 4280, status: 'completed' },
  { id: 'INV-1042', customer: 'Kaveri Logistics', product: 'Wendoro Flow', amount: 1950, status: 'pending' },
  { id: 'INV-1043', customer: 'Narmada Retail', product: 'Wendoro Desk', amount: 3120, status: 'active' },
  { id: 'INV-1044', customer: 'Surya Precision', product: 'Wendoro Insights', amount: 6400, status: 'warning' },
];

const columns: DataTableColumn<InvoiceRow>[] = [
  { key: 'id', header: 'Invoice', sortable: true, accessor: (r) => r.id, cell: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: 'customer', header: 'Customer', sortable: true, accessor: (r) => r.customer, cell: (r) => <span className="font-medium">{r.customer}</span> },
  { key: 'product', header: 'Product', sortable: true, accessor: (r) => r.product, cell: (r) => r.product },
  { key: 'status', header: 'Status', cell: (r) => <StatusBadge status={r.status} /> },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    sortable: true,
    accessor: (r) => r.amount,
    cell: (r) => <span className="font-mono">${r.amount.toLocaleString()}</span>,
  },
];

const meta: Meta = {
  title: 'Business/Ecosystem Patterns',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Product-agnostic business patterns designed for Wendoro Desk, Flow, Commerce, Insights, and People.',
      },
    },
  },
};

export default meta;

function EnterpriseWorkspaceDemo() {
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [commandOpen, setCommandOpen] = React.useState(false);

  const filtered = sampleRows.filter((row) => {
      const matchesSearch =
        !search ||
        row.customer.toLowerCase().includes(search.toLowerCase()) ||
        row.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        <PageHeader
          title="Revenue Operations"
          description="Shared business application patterns across Wendoro products."
          breadcrumbs={[{ label: 'Wendoro' }, { label: 'Business Components' }]}
          actions={
            <>
              <DatePicker value={selectedDate} onValueChange={setSelectedDate} />
              <Button
                variant="outline"
                leftIcon={<Terminal className="h-4 w-4" />}
                onClick={() => setCommandOpen(true)}
              >
                Command Palette
              </Button>
            </>
          }
        />

        <DashboardGrid>
          <DashboardGridItem span={4}>
            <MetricCard
              label="Monthly Recurring Revenue"
              value="$148,920"
              delta="+12.4%"
              trend="up"
              period="vs. previous 30 days"
            />
          </DashboardGridItem>
          <DashboardGridItem span={4}>
            <KpiCard
              title="Q4 Onboarding Target"
              actual="84"
              target="100"
              completion={84}
              status="on_track"
              period="Wendoro Desk & Flow"
            />
          </DashboardGridItem>
          <DashboardGridItem span={4}>
            <UserProfile
              variant="card"
              name="Ananya Rao"
              role="Principal Engineer"
              department="Wendoro Platform"
              email="ananya@wendoro.in"
              status="online"
            />
          </DashboardGridItem>
        </DashboardGrid>

        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search invoices…"
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
                { value: 'warning', label: 'Attention' },
              ],
            },
          ]}
        />

        <DataTable data={filtered} columns={columns} getRowId={(r) => r.id} selectable />

        <Accordion defaultValue="faq-1">
          <AccordionItem value="faq-1">
            <AccordionTrigger>How are tokens shared across Wendoro products?</AccordionTrigger>
            <AccordionContent>
              Applications import @wendoro/ui/styles.css once and wrap their root with ThemeProvider.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <CommandPalette
          open={commandOpen}
          onOpenChange={setCommandOpen}
          items={[
            { id: '1', label: 'Filter pending invoices', group: 'Billing', icon: <SlidersHorizontal className="h-4 w-4" />, shortcut: 'F', onSelect: () => setStatusFilter('pending') },
            { id: '2', label: 'Reset table filters', group: 'Billing', icon: <Search className="h-4 w-4" />, shortcut: 'R', onSelect: () => { setSearch(''); setStatusFilter('all'); } },
          ]}
        />
      </div>
  );
}

export const EnterpriseWorkspace: StoryObj = {
  render: () => <EnterpriseWorkspaceDemo />,
};
