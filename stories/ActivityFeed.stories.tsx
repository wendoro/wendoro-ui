import type { Meta, StoryObj } from '@storybook/react';
import { ActivityFeed } from '../src/components/business/activity-feed';
import { WENDORO_DEMO_ACTIVITY } from '../src/data/wendoro-demo-data';

const meta: Meta<typeof ActivityFeed> = {
  title: 'Business/ActivityFeed',
  component: ActivityFeed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chronological activity feed supporting avatar, user name, action, entity, product/source, timestamp, amount, status badge, and metadata. Clearly separates UI demo events from live records.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActivityFeed>;

export const DemoFeed: Story = {
  args: {
    items: WENDORO_DEMO_ACTIVITY,
    demoLabel: 'Sample UI demonstration data — illustrative component preview only.',
  },
  render: (args) => (
    <div className="max-w-xl rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-5">
      <ActivityFeed {...args} />
    </div>
  ),
};

export const EmptyFeed: Story = {
  args: {
    items: [],
    demoLabel: 'Sample UI demonstration data — illustrative empty-state preview.',
  },
  render: (args) => (
    <div className="max-w-xl">
      <ActivityFeed {...args} />
    </div>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div
      className="dark max-w-xl rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <ActivityFeed
        items={WENDORO_DEMO_ACTIVITY}
        demoLabel="Sample UI demonstration data — dark theme preview."
      />
    </div>
  ),
};
