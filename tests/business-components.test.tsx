import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { KpiCard } from '@/components/business/kpi-card';
import { MetricCard } from '@/components/business/metric-card';
import { NotificationCenter } from '@/components/business/notification-center';
import { StatusBadge } from '@/components/business/status-badge';

interface RowItem {
  id: string;
  name: string;
  total: number;
}

const rows: RowItem[] = [
  { id: '1', name: 'Beta Corp', total: 200 },
  { id: '2', name: 'Alpha Corp', total: 500 },
];

const columns: DataTableColumn<RowItem>[] = [
  { key: 'name', header: 'Name', sortable: true, accessor: (r) => r.name, cell: (r) => r.name },
  { key: 'total', header: 'Total', sortable: true, accessor: (r) => r.total, cell: (r) => `$${r.total}` },
];

describe('Business Components', () => {
  it('renders MetricCard, KpiCard, and StatusBadge with explicit labels', () => {
    render(
      <div>
        <MetricCard label="Revenue" value="$12,400" delta="+10%" trend="up" />
        <KpiCard title="Onboarding" actual="8" target="10" completion={80} status="on_track" />
        <StatusBadge status="pending" />
      </div>
    );

    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,400')).toBeInTheDocument();
    expect(screen.getByText('On track')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('sorts DataTable columns and handles empty state', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DataTable data={rows} columns={columns} getRowId={(r) => r.id} />);

    const sortBtn = screen.getByRole('button', { name: 'Name' });
    await user.click(sortBtn);

    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Alpha Corp');

    rerender(<DataTable data={[]} columns={columns} getRowId={(r) => r.id} emptyTitle="No entries" />);
    expect(screen.getByText('No entries')).toBeInTheDocument();
  });

  it('opens NotificationCenter and marks all as read', async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();

    render(
      <NotificationCenter
        onMarkAllRead={onMarkAllRead}
        items={[
          {
            id: '1',
            title: 'Alert 1',
            timestamp: '1m ago',
            unread: true,
          },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /Notifications, 1 unread/i }));
    expect(screen.getByText('Alert 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Mark all read/i }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });
});
