import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from '../src/components/business/user-profile';

const meta: Meta<typeof UserProfile> = {
  title: 'Business/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable profile component supporting initials avatars, role, department, email, status badge, dropdown actions, and optional contact action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UserProfile>;

export const PopulatedProfile: Story = {
  render: () => (
    <div className="max-w-md">
      <UserProfile
        variant="card"
        name="Ananya Rao"
        role="Principal Systems Lead"
        department="Wendoro Platform"
        email="ananya@wendoro.in"
        status="online"
        statusBadge="completed"
        statusLabel="Verified"
        contactHref="mailto:ananya@wendoro.in"
        actions={[
          { id: 'copy', label: 'Copy email', onSelect: () => {} },
          { id: 'audit', label: 'View permissions', onSelect: () => {} },
        ]}
      />
    </div>
  ),
};

export const NameOnlyProfiles: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <UserProfile variant="card" name="Sumita Singh" affiliation="Wendoro · Team member" />
      <UserProfile variant="card" name="Suraj Singh" affiliation="Wendoro · Team member" />
      <UserProfile variant="card" name="Rohan Mehta" affiliation="Wendoro · Team member" />
    </div>
  ),
};

export const InlineVariant: Story = {
  render: () => (
    <div className="max-w-md rounded-[var(--wdr-radius-md)] border border-border p-3">
      <UserProfile
        variant="inline"
        name="Ananya Rao"
        role="Principal Systems Lead"
        department="Wendoro Platform"
        statusBadge="completed"
        statusLabel="Verified"
      />
    </div>
  ),
};

export const DarkTheme: Story = {
  render: () => (
    <div
      className="dark max-w-md rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <UserProfile
        variant="card"
        name="Ananya Rao"
        role="Principal Systems Lead"
        department="Wendoro Platform"
        email="ananya@wendoro.in"
        status="online"
        statusBadge="completed"
        statusLabel="Verified"
        contactHref="mailto:ananya@wendoro.in"
      />
    </div>
  ),
};
