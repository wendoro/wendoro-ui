import type { Meta, StoryObj } from '@storybook/react';
import { DataTable, type DataTableColumn } from '../src/components/business/data-table';
import { StatusBadge } from '../src/components/business/status-badge';
import { Button } from '../src/components/ui/button';
import { WENDORO_DEMO_MODULES, type EcosystemModuleRow } from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/Advanced Tables',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise DataTable supporting multi-sort, global search, per-column filters with removable chips, column visibility, pinned columns, row expansion, bulk actions, row actions, and accessible status announcements.',
      },
    },
  },
};

export default meta;

const columns: DataTableColumn<EcosystemModuleRow>[] = [
  {
    key: 'id',
    header: 'Record',
    sortable: true,
    pin: 'left',
    accessor: (r) => r.id,
    cell: (r) => <span className="font-mono text-xs">{r.id}</span>,
  },
  {
    key: 'module',
    header: 'Example Project',
    sortable: true,
    filterable: true,
    accessor: (r) => r.module,
    cell: (r) => <span className="font-medium">{r.module}</span>,
  },
  {
    key: 'domain',
    header: 'Domain (Demo)',
    sortable: true,
    accessor: (r) => r.domain,
    cell: (r) => r.domain,
  },
  {
    key: 'maintainer',
    header: 'Assignee',
    sortable: true,
    filterable: true,
    accessor: (r) => r.maintainer,
    cell: (r) => r.maintainer,
  },
  {
    key: 'throughput',
    header: 'Units',
    sortable: true,
    align: 'right',
    accessor: (r) => r.throughput,
    cell: (r) => r.throughput.toLocaleString(),
  },
  {
    key: 'status',
    header: 'Status',
    filterable: true,
    accessor: (r) => r.status,
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
      { label: 'Completed', value: 'completed' },
      { label: 'Warning', value: 'warning' },
      { label: 'Draft', value: 'draft' },
    ],
    cell: (r) => <StatusBadge status={r.status} label={r.statusLabel} />,
  },
];

export const FullFeaturedDataTable: StoryObj = {
  render: () => (
    <DataTable
      aria-label="Enterprise demo records table"
      data={WENDORO_DEMO_MODULES}
      columns={columns}
      getRowId={(r) => r.id}
      searchable
      multiSort
      selectable
      columnVisibilityToggle
      columnResizable
      stickyHeader
      pageSize={4}
      pageSizeOptions={[2, 4, 6]}
      bulkActions={[{ id: 'archive', label: 'Archive Selected (Demo)', onAction: () => {} }]}
      rowActions={(row) => (
        <Button size="sm" variant="ghost" aria-label={`Inspect ${row.id}`}>
          Inspect
        </Button>
      )}
      renderExpandedRow={(row) => (
        <div className="text-xs text-muted-foreground">
          Expanded details for <strong className="text-foreground">{row.module}</strong> maintained by {row.maintainer} (synthetic demo record).
        </div>
      )}
    />
  ),
};
