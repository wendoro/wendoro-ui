import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { Button, IconButton } from '../src/components/ui/button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Primary action trigger for Wendoro applications. Primary uses Wendoro Yellow (#FACC15) with black text; Destructive uses Wendoro Red (#DC2626) with white text. Includes full keyboard focus-visible indicators and aria-busy loading state.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Create Invoice',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link Action</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <IconButton aria-label="Add record" icon={<Plus className="h-4 w-4" />} variant="primary" />
      <IconButton aria-label="Delete record" icon={<Trash2 className="h-4 w-4" />} variant="destructive" />
    </div>
  ),
};

export const DisabledAndLoading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
        With Icon
      </Button>
      <Button variant="primary" loading loadingText="Saving…">
        Save
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
      <Button variant="destructive" disabled>
        Disabled Destructive
      </Button>
    </div>
  ),
};

function InteractiveButtonDemo() {
  const [saving, setSaving] = React.useState(false);
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        variant="primary"
        loading={saving}
        loadingText="Processing…"
        onClick={() => {
          setSaving(true);
          setCount((c) => c + 1);
          setTimeout(() => setSaving(false), 600);
        }}
      >
        Trigger Action
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums">
        Triggered {count} {count === 1 ? 'time' : 'times'}
      </span>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveButtonDemo />,
};

export const DarkTheme: Story = {
  render: () => (
    <div
      className="dark flex flex-wrap items-center gap-3 rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="primary" loading loadingText="Syncing…">
        Sync
      </Button>
      <Button variant="outline" disabled>
        Disabled
      </Button>
    </div>
  ),
};
