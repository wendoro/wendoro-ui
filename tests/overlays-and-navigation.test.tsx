import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CommandPalette } from '@/components/ui/command';
import { Dialog } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import { DropdownMenu } from '@/components/ui/dropdown';
import { Pagination } from '@/components/ui/pagination';
import { Popover } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToastProvider, useToast } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';

function DialogHarness() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Launch Modal</button>
      <Dialog open={open} onOpenChange={setOpen} title="Security Notice">
        <p>Confirm token rotation.</p>
        <button type="button" onClick={() => setOpen(false)}>
          Confirm Action
        </button>
      </Dialog>
    </div>
  );
}

function DrawerHarness() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Launch Drawer</button>
      <Drawer open={open} onOpenChange={setOpen} title="Inspector Drawer">
        <p>Drawer details</p>
      </Drawer>
    </div>
  );
}

function ToastHarness() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast({ title: 'Saved changes', description: 'Token updated.', variant: 'success' })}>
      Show Toast
    </button>
  );
}

describe('Overlays, Navigation & Feedback Components', () => {
  it('opens Dialog, traps Tab focus, and restores focus on Escape', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    const launchBtn = screen.getByRole('button', { name: 'Launch Modal' });
    await user.click(launchBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Security Notice')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    const confirmBtn = screen.getByRole('button', { name: 'Confirm Action' });
    closeBtn.focus();
    await user.tab();
    expect(confirmBtn).toHaveFocus();
    await user.tab();
    expect(closeBtn).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(launchBtn).toHaveFocus());
  });

  it('opens Drawer, closes on Escape, and exposes dialog semantics', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    const launchBtn = screen.getByRole('button', { name: 'Launch Drawer' });
    await user.click(launchBtn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Inspector Drawer')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(launchBtn).toHaveFocus());
  });

  it('navigates Tabs with ArrowRight, ArrowLeft, Home, and End keyboard input', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">First</TabsTrigger>
          <TabsTrigger value="b">Second</TabsTrigger>
          <TabsTrigger value="c">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
        <TabsContent value="c">Panel C</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByRole('tab', { name: 'First' });
    firstTab.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel B')).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel C')).toBeInTheDocument();

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(firstTab).toHaveAttribute('aria-selected', 'true');
  });

  it('opens DropdownMenu with keyboard, avoids nested buttons, triggers item, and restores focus on Escape', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <DropdownMenu
        trigger={<button type="button">Open Menu</button>}
        items={[
          { id: '1', label: 'Duplicate', onSelect },
          { id: '2', label: 'Disabled Item', disabled: true, onSelect: vi.fn() },
          { id: '3', label: 'Archive', onSelect: vi.fn() },
        ]}
      />
    );

    const triggerBtns = screen.getAllByRole('button', { name: 'Open Menu' });
    expect(triggerBtns).toHaveLength(1);
    const triggerBtn = triggerBtns[0];

    triggerBtn.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Disabled Item' })).toBeDisabled();

    const duplicateItem = screen.getByRole('menuitem', { name: 'Duplicate' });
    const archiveItem = screen.getByRole('menuitem', { name: 'Archive' });
    await vi.waitFor(() => expect(duplicateItem).toHaveFocus());

    await user.keyboard('{ArrowDown}');
    expect(archiveItem).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(triggerBtn).toHaveFocus());

    await user.click(triggerBtn);
    await user.click(screen.getByRole('menuitem', { name: 'Duplicate' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('shows Tooltip on focus and Popover on click', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Tooltip content="Helpful info">
          <button type="button">Hover target</button>
        </Tooltip>
        <Popover trigger={<button type="button">Open Popover</button>}>
          <p>Popover body</p>
        </Popover>
      </div>
    );

    const tipTarget = screen.getByRole('button', { name: 'Hover target' });
    await user.tab();
    expect(tipTarget).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful info');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    const popoverBtns = screen.getAllByRole('button', { name: 'Open Popover' });
    expect(popoverBtns).toHaveLength(1);
    await user.click(popoverBtns[0]);
    expect(screen.getByText('Popover body')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover body')).not.toBeInTheDocument();
    await vi.waitFor(() => expect(popoverBtns[0]).toHaveFocus());
  });

  it('handles Pagination boundaries and page selection', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={1} totalPages={8} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('renders and dismisses Toast announcements via ToastProvider', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Show Toast' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved changes');
    await user.click(screen.getByRole('button', { name: 'Close notification' }));
    expect(screen.queryByText('Saved changes')).not.toBeInTheDocument();
  });

  it('toggles Accordion panels and filters CommandPalette actions', async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <div>
        <Accordion>
          <AccordionItem value="item-1">
            <AccordionTrigger>Question 1</AccordionTrigger>
            <AccordionContent>Answer 1</AccordionContent>
          </AccordionItem>
        </Accordion>
        <CommandPalette
          open={true}
          onOpenChange={onOpenChange}
          items={[
            { id: '1', label: 'Create Invoice', onSelect: onRun },
            { id: '2', label: 'Open Settings', onSelect: vi.fn() },
          ]}
        />
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Question 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Answer 1')).toBeInTheDocument();

    const input = screen.getByLabelText('Filter commands');
    await user.type(input, 'Invoice');
    expect(screen.queryByText('Open Settings')).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onRun).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
