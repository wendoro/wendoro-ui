import type { Meta, StoryObj } from '@storybook/react';
import { TeamDirectory } from '../src/components/business/team-directory';
import { WENDORO_TEAM_MEMBERS } from '../src/data/wendoro-demo-data';

const meta: Meta<typeof TeamDirectory> = {
  title: 'Business/TeamDirectory',
  component: TeamDirectory,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reusable TeamDirectory supporting search, department/status filtering, Grid/List view switching, initials avatars, and partial profile rendering without inventing missing fields.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TeamDirectory>;

export const DefaultGrid: Story = {
  args: {
    members: WENDORO_TEAM_MEMBERS,
    defaultView: 'grid',
    demoNotice: 'Wendoro team showcase — displays only explicitly provided profile attributes.',
  },
};

export const ListView: Story = {
  args: {
    members: WENDORO_TEAM_MEMBERS,
    defaultView: 'list',
  },
};

export const EmptyDirectory: Story = {
  args: {
    members: [],
    emptyTitle: 'No team members assigned',
    emptyDescription: 'Members added to this workspace will appear here.',
  },
};
