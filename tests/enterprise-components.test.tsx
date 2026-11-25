import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppShell, DashboardHeader, DashboardSidebar, ResizablePanel } from '@/components/business/shell';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import { CalendarGrid, KanbanBoard, Stepper, TaskList, TreeView, Wizard } from '@/components/business/productivity';
import { MegaMenu, PageTabs } from '@/components/ui/navigation-ext';
import {
  Combobox,
  InputOTP,
  MultiSelect,
  MultiStepForm,
  NumberInput,
  PasswordInput,
  TagInput,
} from '@/components/ui/forms';
import { Banner, CircularProgress, ConfirmationDialog, ErrorState, LoadingOverlay } from '@/components/ui/feedback';

interface RowItem {
  id: string;
  name: string;
  group: string;
  score: number;
}

const ROWS: RowItem[] = [
  { id: '1', name: 'Sample Alpha', group: 'Core', score: 90 },
  { id: '2', name: 'Sample Beta', group: 'Charts', score: 75 },
  { id: '3', name: 'Sample Gamma', group: 'Core', score: 85 },
];

const COLS: DataTableColumn<RowItem>[] = [
  { key: 'name', header: 'Name', sortable: true, filterable: true, accessor: (r) => r.name, cell: (r) => r.name },
  { key: 'group', header: 'Group', sortable: true, filterable: true, accessor: (r) => r.group, cell: (r) => r.group },
  { key: 'score', header: 'Score', sortable: true, accessor: (r) => r.score, cell: (r) => String(r.score) },
];

describe('Enterprise Components 2.0 (Shell, DataTable, Productivity, Forms, Feedback)', () => {
  it('renders AppShell navigation drawer and keyboard-resizable panel', async () => {
    const user = userEvent.setup();
    const onNavToggle = vi.fn();

    render(
      <AppShell
        sidebar={<DashboardSidebar header={<span>Studio</span>}><div>Nav</div></DashboardSidebar>}
        header={<DashboardHeader title="Shell Header" onOpenMobileNav={() => onNavToggle(true)} />}
        mobileNavOpen={false}
        onMobileNavOpenChange={onNavToggle}
      >
        <ResizablePanel left={<div>Left Pane</div>} right={<div>Right Pane</div>} defaultLeftPercent={50} />
      </AppShell>
    );

    const openMenuBtn = screen.getByRole('button', { name: /Open navigation/i });
    await user.click(openMenuBtn);
    expect(onNavToggle).toHaveBeenCalledWith(true);

    const separator = screen.getByRole('separator', { name: /Resize panel/i });
    fireEvent.keyDown(separator, { key: 'ArrowRight' });
    expect(separator).toHaveAttribute('aria-valuenow', '54');
  });

  it('supports Advanced DataTable global search, filter chips, pagination, bulk actions, and row expansion', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();

    render(
      <DataTable
        aria-label="Enterprise records"
        data={ROWS}
        columns={COLS}
        getRowId={(r) => r.id}
        searchable
        multiSort
        selectable
        columnVisibilityToggle
        pageSize={2}
        bulkActions={[{ id: 'archive', label: 'Archive', onAction: onBulk }]}
        renderExpandedRow={(row) => <div>Expanded: {row.name}</div>}
      />
    );

    expect(screen.getByText('Sample Alpha', { selector: 'td' })).toBeInTheDocument();
    expect(screen.queryByText('Sample Gamma', { selector: 'td' })).not.toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search records/i);
    await user.type(searchInput, 'Gamma');
    expect(screen.getByText('Sample Gamma', { selector: 'td' })).toBeInTheDocument();
    expect(screen.queryByText('Sample Alpha', { selector: 'td' })).not.toBeInTheDocument();
    await user.clear(searchInput);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole('button', { name: 'Archive' }));
    expect(onBulk).toHaveBeenCalledTimes(1);

    const expandBtns = screen.getAllByRole('button', { name: /Expand row/i });
    await user.click(expandBtns[0]);
    expect(screen.getByText('Expanded: Sample Alpha')).toBeInTheDocument();
  });

  it('supports Kanban keyboard movement, CalendarGrid view switching, Wizard, TaskList, and TreeView', async () => {
    const user = userEvent.setup();
    const onMoveCard = vi.fn();
    const onStepChange = vi.fn();
    const onToggleTask = vi.fn();

    render(
      <div>
        <KanbanBoard
          columns={[
            { id: 'c1', title: 'Todo' },
            { id: 'c2', title: 'Done' },
          ]}
          cards={[{ id: 'k1', columnId: 'c1', title: 'Task A' }]}
          onMoveCard={onMoveCard}
        />
        <CalendarGrid
          selectedDate={new Date('2026-11-15T12:00:00Z')}
          events={[{ id: 'e1', title: 'Sample Meeting', date: '2026-11-15', timeLabel: '09:00' }]}
        />
        <Stepper currentStep={0} steps={[{ id: 's1', label: 'One' }, { id: 's2', label: 'Two' }]} />
        <Wizard
          currentStep={0}
          onStepChange={onStepChange}
          steps={[
            { id: 'w1', label: 'Step 1', content: <div>Content 1</div> },
            { id: 'w2', label: 'Step 2', content: <div>Content 2</div> },
          ]}
        />
        <TaskList
          tasks={[{ id: 'tk1', title: 'Check labels', completed: false }]}
          onToggleTask={onToggleTask}
        />
        <TreeView nodes={[{ id: 'root', label: 'Root Node', children: [{ id: 'child', label: 'Leaf Node' }] }]} />
      </div>
    );

    await user.click(screen.getByRole('button', { name: /Move Task A to next column/i }));
    expect(onMoveCard).toHaveBeenCalledWith('k1', 'c2', 0);

    await user.click(screen.getByRole('button', { name: 'Day' }));
    expect(screen.getByText('Sample Meeting')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onStepChange).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('checkbox', { name: /Check labels/i }));
    expect(onToggleTask).toHaveBeenCalledWith('tk1', true);

    await user.click(screen.getByRole('button', { name: /Expand Root Node/i }));
    expect(screen.getByText('Leaf Node')).toBeInTheDocument();
  });

  it('supports Enterprise Navigation, Advanced Forms, and Modern Feedback controls', async () => {
    const user = userEvent.setup();
    const onTagChange = vi.fn();
    const onMultiChange = vi.fn();
    const onOtpChange = vi.fn();

    render(
      <div>
        <MegaMenu
          sections={[
            {
              id: 'explore',
              label: 'Explore',
              groups: [{ title: 'Apps', links: [{ id: 'a1', label: 'Wendoro Desk', href: '#desk' }] }],
            },
          ]}
        />
        <PageTabs
          activeId="t1"
          onTabChange={() => {}}
          tabs={[
            { id: 't1', label: 'Overview' },
            { id: 't2', label: 'Details' },
          ]}
        />
        <MultiSelect
          label="Modules"
          value={['core']}
          onValueChange={onMultiChange}
          options={[
            { value: 'core', label: 'Core' },
            { value: 'charts', label: 'Charts' },
          ]}
        />
        <Combobox
          label="Product"
          value="desk"
          onValueChange={() => {}}
          options={[{ value: 'desk', label: 'Wendoro Desk' }]}
        />
        <TagInput label="Labels" tags={['alpha']} onTagsChange={onTagChange} placeholder="Type tag" />
        <PasswordInput label="Passphrase" />
        <NumberInput label="Count" value={5} onValueChange={() => {}} min={1} max={10} />
        <InputOTP label="Code" length={4} value="12" onValueChange={onOtpChange} />
        <MultiStepForm
          onSubmit={() => {}}
          steps={[{ id: 'f1', title: 'Step A', content: <div>Form A</div> }]}
        />
        <Banner variant="default" title="Info Banner" />
        <CircularProgress value={65} label="Upload" />
        <LoadingOverlay loading label="Working"><div>Content</div></LoadingOverlay>
        <ErrorState title="Broken" onRetry={() => {}} />
        <ConfirmationDialog
          open={false}
          onOpenChange={() => {}}
          title="Confirm"
          description="Confirm sample action."
          onConfirm={() => {}}
        />
      </div>
    );

    await user.click(screen.getByRole('button', { name: /Explore/i }));
    expect(screen.getByRole('link', { name: /Wendoro Desk/i })).toHaveAttribute('href', '#desk');

    const tagInput = screen.getByPlaceholderText('Type tag');
    await user.type(tagInput, 'beta{Enter}');
    expect(onTagChange).toHaveBeenCalledWith(['alpha', 'beta']);

    const togglePwd = screen.getByRole('button', { name: /Show password/i });
    await user.click(togglePwd);
    expect(screen.getByLabelText('Passphrase')).toHaveAttribute('type', 'text');

    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Info Banner')).toBeInTheDocument();
  });
});
