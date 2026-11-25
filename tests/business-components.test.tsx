import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActivityFeed } from '@/components/business/activity-feed';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { KpiCard } from '@/components/business/kpi-card';
import { MetricCard } from '@/components/business/metric-card';
import { NotificationCenter } from '@/components/business/notification-center';
import { SearchBar } from '@/components/business/search-bar';
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

const paginatedRows: RowItem[] = [
  { id: 'r1', name: 'Item 1', total: 10 },
  { id: 'r2', name: 'Item 2', total: 20 },
  { id: 'r3', name: 'Item 3', total: 30 },
];

const columns: DataTableColumn<RowItem>[] = [
  { key: 'name', header: 'Name', sortable: true, accessor: (r) => r.name, cell: (r) => r.name },
  { key: 'total', header: 'Total', sortable: true, accessor: (r) => r.total, cell: (r) => `${r.total} units` },
];

describe('Business Components & Wendoro Demo Showcase', () => {
  it('renders MetricCard, KpiCard, and StatusBadge with explicit labels', () => {
    render(
      <div>
        <MetricCard label="Sample Metric" value="1,240" delta="+10%" trend="up" />
        <KpiCard title="Onboarding" actual="8" target="10" completion={80} status="on_track" />
        <StatusBadge status="pending" />
      </div>
    );

    expect(screen.getByText('Sample Metric')).toBeInTheDocument();
    expect(screen.getByText('1,240')).toBeInTheDocument();
    expect(screen.getByText('On track')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('renders TeamDirectory with synthetic demo members, search, and grid/list views without inventing missing details', async () => {
    const user = userEvent.setup();
    render(
      <TeamDirectory
        members={WENDORO_TEAM_MEMBERS}
        demoNotice="Sample team directory"
      />
    );

    expect(screen.getByText('Demo User')).toBeInTheDocument();
    expect(screen.getByText('Sample Systems Lead · Example Project (Demo)')).toBeInTheDocument();
    expect(screen.getByText('demo@example.invalid')).toBeInTheDocument();
    expect(screen.getByText('Sample Member A')).toBeInTheDocument();
    expect(screen.getByText('Sample Member B')).toBeInTheDocument();
    expect(screen.getByText('Sample Member C')).toBeInTheDocument();

    // Verify demo records avoid personal/real email patterns
    expect(WENDORO_TEAM_MEMBERS.every((m) => !m.email || m.email.endsWith('.invalid'))).toBe(true);

    // Switch to List view
    const listBtn = screen.getByRole('button', { name: 'List view' });
    await user.click(listBtn);
    expect(listBtn).toHaveAttribute('aria-pressed', 'true');

    // Search filter
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Member A');
    expect(screen.getByText('Sample Member A')).toBeInTheDocument();
    expect(screen.queryByText('Demo User')).not.toBeInTheDocument();
  });

  it('renders UserProfile with contact and dropdown actions', async () => {
    const user = userEvent.setup();
    const onContact = vi.fn();
    const onCopy = vi.fn();

    render(
      <UserProfile
        variant="card"
        name="Demo Lead"
        role="Sample Systems Lead"
        department="Demo Workspace"
        email="lead@demo.invalid"
        statusBadge="completed"
        statusLabel="Verified"
        onContact={onContact}
        actions={[{ id: 'copy', label: 'Copy email', onSelect: onCopy }]}
      />
    );

    expect(screen.getByText('Verified')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Contact' }));
    expect(onContact).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Actions for Demo Lead' }));
    await user.click(screen.getByRole('menuitem', { name: 'Copy email' }));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it('renders ActivityFeed with sample demonstration label and provided synthetic events', () => {
    render(
      <ActivityFeed
        items={WENDORO_DEMO_ACTIVITY}
        demoLabel="Demo data — illustrative component preview only."
      />
    );

    expect(screen.getByText('Demo data — illustrative component preview only.')).toBeInTheDocument();
    expect(screen.getAllByText('Sample Member B').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sample Member A').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sample Organization Lead')).toBeInTheDocument();
    expect(screen.getByText('Sample Record #01')).toBeInTheDocument();
    expect(screen.getByText('120 sample units')).toBeInTheDocument();
  });

  it('sorts DataTable columns, selects rows, paginates safely, and renders empty/error states', async () => {
    const user = userEvent.setup();
    const onSelected = vi.fn();
    const onRetry = vi.fn();
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

    // Pagination + pageSize <= 0 guard
    rerender(
      <DataTable
        data={paginatedRows}
        columns={columns}
        getRowId={(r) => r.id}
        pageSize={0}
      />
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('Item 2')).toBeInTheDocument();

    // Error state with Retry callback
    rerender(
      <DataTable
        data={[]}
        columns={columns}
        getRowId={(r) => r.id}
        error="Failed to load sample records"
        onRetry={onRetry}
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to load sample records');
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    // Empty state
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

  it('preserves className, container props, and demoLabel when ActivityFeed is empty', () => {
    render(
      <ActivityFeed
        items={[]}
        className="custom-feed-class"
        data-testid="empty-activity-feed"
        aria-label="Sample activity feed"
        demoLabel="Demo data — empty preview"
        emptyTitle="Nothing yet"
      />
    );

    const container = screen.getByTestId('empty-activity-feed');
    expect(container).toHaveClass('custom-feed-class');
    expect(container).toHaveAttribute('aria-label', 'Sample activity feed');
    expect(screen.getByText('Demo data — empty preview')).toBeInTheDocument();
    expect(screen.getByText('Nothing yet')).toBeInTheDocument();
  });

  it('filters TeamDirectory by department and status and resets empty search', async () => {
    const user = userEvent.setup();
    render(<TeamDirectory members={WENDORO_TEAM_MEMBERS} />);

    const statusTrigger = screen.getByRole('combobox', { name: 'Status' });
    await user.click(statusTrigger);
    await user.click(screen.getByRole('option', { name: 'Completed' }));
    expect(screen.getByText('Demo User')).toBeInTheDocument();
    expect(screen.queryByText('Sample Member A')).not.toBeInTheDocument();

    await user.type(screen.getByRole('searchbox'), 'NoSuchMember');
    expect(screen.getByText('No matching team members')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(screen.getByText('Sample Member B')).toBeInTheDocument();
    expect(screen.getByText('Demo User')).toBeInTheDocument();
  });

  it('supports DataTable loading status, select-all rows, SearchBar disabled, and NotificationCenter dismissal', async () => {
    const user = userEvent.setup();
    const onSelected = vi.fn();
    const onDismiss = vi.fn();
    const onSearch = vi.fn();

    const { rerender } = render(
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(r) => r.id}
        loading
      />
    );
    expect(screen.getByRole('status', { name: 'Loading table data' })).toBeInTheDocument();

    rerender(
      <div>
        <SearchBar value="locked" onChange={onSearch} disabled aria-label="Disabled search" />
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(r) => r.id}
          selectable
          selectedIds={[]}
          onSelectedIdsChange={onSelected}
        />
        <NotificationCenter
          onDismiss={onDismiss}
          items={[{ id: 'n1', title: 'Alert 1', timestamp: '1m ago', unread: true }]}
        />
      </div>
    );

    expect(screen.getByLabelText('Disabled search')).toBeDisabled();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Select all rows on page'));
    expect(onSelected).toHaveBeenCalledWith(['1', '2']);

    await user.click(screen.getByRole('button', { name: /Notifications, 1 unread/i }));
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledWith('n1');
  });
});
