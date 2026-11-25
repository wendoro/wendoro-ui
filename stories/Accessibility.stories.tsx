import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, GaugeChart } from '../src/components/charts';
import { StatusBadge } from '../src/components/business/status-badge';
import { KanbanBoard } from '../src/components/business/productivity';
import { Dialog, DialogFooter } from '../src/components/ui/dialog';
import { Button } from '../src/components/ui/button';
import { useReducedMotion } from '../src/hooks/use-reduced-motion';
import { WENDORO_DEMO_KANBAN_CARDS, WENDORO_DEMO_KANBAN_COLUMNS, WENDORO_DEMO_SERIES } from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/Accessibility Examples',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates WCAG 2.2 AA design patterns: non-color status badges, chart accessible HTML table alternatives, keyboard Kanban controls, Dialog focus trapping, and prefers-reduced-motion support.',
      },
    },
  },
};

export default meta;

function AccessibilityShowcase() {
  const reducedMotion = useReducedMotion();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [cards, setCards] = React.useState(WENDORO_DEMO_KANBAN_CARDS.slice(0, 2));

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4 text-xs">
        <div className="font-semibold text-foreground">Reduced Motion Status</div>
        <div className="mt-1 text-muted-foreground">
          <code>prefers-reduced-motion</code> detected as: <strong>{reducedMotion ? 'reduce' : 'no-preference'}</strong>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Non-Color-Only Status Indicators</h3>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="completed" />
          <StatusBadge status="warning" />
          <StatusBadge status="error" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LineChart
          title="Chart with Built-In Data Table & Pattern/Dash Cues"
          subtitle="Click 'Table' button above chart to toggle accessible HTML table fallback."
          data={WENDORO_DEMO_SERIES}
          xKey="month"
          series={[
            { key: 'primary', label: 'Observed', marker: 'circle' },
            { key: 'target', label: 'Target', dashArray: '4 3', marker: 'square' },
          ]}
          showTableToggle
        />
        <GaugeChart
          title="Meter Role Example"
          subtitle="Uses role='meter' with aria-valuemin, aria-valuemax, aria-valuenow."
          value={84}
          min={0}
          max={100}
          unitLabel="%"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Keyboard-Accessible Kanban (No Pointer Required)</h3>
        <KanbanBoard
          columns={WENDORO_DEMO_KANBAN_COLUMNS}
          cards={cards}
          onMoveCard={(cardId, toCol) =>
            setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c)))
          }
        />
      </div>

      <div>
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          Test Dialog Focus Trap & Restoration
        </Button>
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Focus Trap Demo"
          description="Press Tab to cycle inside dialog and Escape to restore focus to the triggering button."
        >
          <p className="text-sm text-muted-foreground">Accessible modal container.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close Dialog</Button>
          </DialogFooter>
        </Dialog>
      </div>
    </div>
  );
}

export const AccessibilityPatterns: StoryObj = {
  render: () => <AccessibilityShowcase />,
};
