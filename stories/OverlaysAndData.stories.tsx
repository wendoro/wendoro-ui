import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Info, Terminal } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import { Calendar } from '../src/components/ui/calendar';
import { CommandPalette } from '../src/components/ui/command';
import { DatePicker } from '../src/components/ui/date-picker';
import { Dialog, DialogFooter } from '../src/components/ui/dialog';
import { Drawer } from '../src/components/ui/drawer';
import { Popover } from '../src/components/ui/popover';
import { Tooltip } from '../src/components/ui/tooltip';

const meta: Meta = {
  title: 'Overlays & Data/Interactive Primitives',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible overlay and date/command primitives: Dialog, Drawer, Popover, Tooltip, Calendar, DatePicker, and CommandPalette.',
      },
    },
  },
};

export default meta;

function OverlaysInteractiveDemo() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          Open Dialog
        </Button>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>
          Open Drawer
        </Button>
        <Button
          variant="secondary"
          leftIcon={<Terminal className="h-4 w-4" />}
          onClick={() => setCommandOpen(true)}
        >
          Command Palette
        </Button>
        <Tooltip content="Keyboard-accessible tooltip">
          <Button variant="ghost" leftIcon={<Info className="h-4 w-4" />}>
            Focus or Hover
          </Button>
        </Tooltip>
        <Popover trigger={<Button variant="outline">Open Popover</Button>}>
          <p className="text-xs text-muted-foreground">Popover content dismisses on Escape or outside click.</p>
        </Popover>
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <DatePicker value={date} onValueChange={setDate} />
        <Calendar selected={date} onSelect={setDate} />
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Token Audit Confirmation"
        description="Focus traps inside the dialog and restores on Escape."
      >
        <p className="text-sm text-muted-foreground">Verify contrast tokens before publishing.</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setDialogOpen(false)}>
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Workspace Drawer"
        description="Includes focus trap and Escape dismissal."
      >
        <p className="text-sm text-muted-foreground">Drawer body content.</p>
      </Drawer>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={[
          { id: '1', label: 'Open Dialog', group: 'Overlays', onSelect: () => setDialogOpen(true) },
          { id: '2', label: 'Open Drawer', group: 'Overlays', onSelect: () => setDrawerOpen(true) },
        ]}
      />
    </div>
  );
}

export const InteractiveOverlays: StoryObj = {
  render: () => <OverlaysInteractiveDemo />,
};
