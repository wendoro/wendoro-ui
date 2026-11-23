import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFeed } from '@/components/business/activity-feed';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { KpiCard } from '@/components/business/kpi-card';
import { MetricCard } from '@/components/business/metric-card';
import { NotificationCenter } from '@/components/business/notification-center';
import { StatusBadge } from '@/components/business/status-badge';
import { TeamDirectory } from '@/components/business/team-directory';
import { UserProfile } from '@/components/business/user-profile';
import { WENDORO_DEMO_ACTIVITY, WENDORO_TEAM_MEMBERS } from '@/data/wendoro-demo-data';

interface RowItem {
  id: string;
  name: string;
  total: number;
}

const rows: RowItem[] = [
  { id: '1', name: 'Beta Module', total: 200 },
  { id: '2', name: 'Alpha Module', total: 500 },
];

const columns: DataTableColumn<RowItem>[] = [
  { key: 'name', header: 'Name', sortable: true, accessor: (r) => r.name, cell: (r) => r.name },
  { key: 'total', header: 'Total', sortable: true, accessor: (r) => r.total, cell: (r) => `$${r.total}` },
];

describe('Business Components & Wendoro Team Showcase', () => {
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

  it('renders TeamDirectory with Wendoro team members, search, and grid/list views without inventing missing details', async () => {
    const user = userEvent.setup();
    render(
      <TeamDirectory
        members={WENDORO_TEAM_MEMBERS}
        demoNotice="Sample team directory"
      />
    );

    expect(screen.getByText('Ananya Rao')).toBeInTheDocument();
    expect(screen.getByText('Principal Systems Lead · Wendoro Platform')).toBeInTheDocument();
    expect(screen.getByText('ananya@wendoro.in')).toBeInTheDocument();
    expect(screen.getByText('Sumita Singh')).toBeInTheDocument();
    expect(screen.getByText('Suraj Singh')).toBeInTheDocument();
    expect(screen.getByText('Rohan Mehta')).toBeInTheDocument();

    // Switch to List view
    const listBtn = screen.getByRole('button', { name: 'List view' });
    await user.click(listBtn);
    expect(listBtn).toHaveAttribute('aria-pressed', 'true');

    // Search filter
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Sumita');
    expect(screen.getByText('Sumita Singh')).toBeInTheDocument();
    expect(screen.queryByText('Ananya Rao')).not.toBeInTheDocument();
  });

  it('renders UserProfile with contact and dropdown actions', async () => {
    const user = userEvent.setup();
    const onContact = vi.fn();
    const onCopy = vi.fn();

    render(
      <UserProfile
        variant="card"
        name="Ananya Rao"
        role="Principal Systems Lead"
        department="Wendoro Platform"
        email="ananya@wendoro.in"
        statusBadge="completed"
        statusLabel="Verified"
        onContact={onContact}
        actions={[{ id: 'copy', label: 'Copy email', onSelect: onCopy }]}
      />
    );

    expect(screen.getByText('Verified')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Contact' }));
    expect(onContact).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Actions for Ananya Rao' }));
    await user.click(screen.getByRole('menuitem', { name: 'Copy email' }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('renders ActivityFeed with sample demonstration label and provided events', () => {
    render(
      <ActivityFeed
        items={WENDORO_DEMO_ACTIVITY}
        demoLabel="Demo data — illustrative component preview only."
      />
    );

    expect(screen.getByText('Demo data — illustrative component preview only.')).toBeInTheDocument();
    expect(screen.getAllByText('Suraj Singh').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sumita Singh').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Founder · Wendoro')).toHaveLength(2);
    expect(screen.getByText('#SL-4092')).toBeInTheDocument();
    expect(screen.getByText('$48,200 cleared')).toBeInTheDocument();
  });

  it('sorts DataTable columns, selects rows, and handles empty state', async () => {
    const user = userEvent.setup();
    const onSelected = vi.fn();
    const { rerender } = render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(r) => r.id}
        selectable
        selectedIds={[]}
        onSelectedIdsChange={onSelected}
      />
    );

    const sortBtn = screen.getByRole('button', { name: 'Name' });
    await user.click(sortBtn);

    const cells = screen.getAllByRole('cell');
    expect(cells[1]).toHaveTextContent('Alpha Module');

    await user.click(screen.getByLabelText('Select row 2'));
    expect(onSelected).toHaveBeenCalledWith(['2']);

    rerender(<DataTable data={[]} columns={columns} getRowId={(r) => r.id} emptyTitle="No entries" />);
    expect(screen.getByText('No entries')).toBeInTheDocument();
  });

  it('opens NotificationCenter, filters unread, and marks all as read', async () => {
    const user = userEvent.setup();
    const onMarkAllRead = vi.fn();

    render(
      <NotificationCenter
        onMarkAllRead={onMarkAllRead}
        items={[
          { id: '1', title: 'Alert 1', timestamp: '1m ago', unread: true },
          { id: '2', title: 'Alert 2', timestamp: '10m ago', unread: false },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /Notifications, 1 unread/i }));
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Unread \(1\)/i }));
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.queryByText('Alert 2')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Mark all read/i }));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });
});
