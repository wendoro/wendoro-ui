import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CommandPalette } from '@/components/ui/command';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function DialogHarness() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Launch Modal</button>
      <Dialog open={open} onOpenChange={setOpen} title="Security Notice">
        <p>Confirm token rotation.</p>
      </Dialog>
    </div>
  );
}

describe('Overlays, Navigation & Advanced Components', () => {
  it('opens Dialog, traps focus, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    await user.click(screen.getByRole('button', { name: 'Launch Modal' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Security Notice')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates Tabs with ArrowRight keyboard input', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="a">
        <TabsList aria-label="Sections">
          <TabsTrigger value="a">First</TabsTrigger>
          <TabsTrigger value="b">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Panel A</TabsContent>
        <TabsContent value="b">Panel B</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByRole('tab', { name: 'First' });
    firstTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel B')).toBeInTheDocument();
  });

  it('toggles Accordion panels accessibly', async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: 'Question 1' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Answer 1')).toBeInTheDocument();
  });

  it('filters and executes actions in CommandPalette', async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CommandPalette
        open={true}
        onOpenChange={onOpenChange}
        items={[
          { id: '1', label: 'Create Invoice', onSelect: onRun },
          { id: '2', label: 'Open Settings', onSelect: vi.fn() },
        ]}
      />
    );

    const input = screen.getByLabelText('Filter commands');
    await user.type(input, 'Invoice');
    expect(screen.queryByText('Open Settings')).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onRun).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
