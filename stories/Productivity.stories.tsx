import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ActivityTimeline,
  CalendarGrid,
  KanbanBoard,
  Milestone,
  StatusProgression,
  Timeline,
  TimelineGroup,
  TimelineItem,
} from '../src/components/business/productivity';
import { WENDORO_DEMO_KANBAN_CARDS, WENDORO_DEMO_KANBAN_COLUMNS } from '../src/data/wendoro-demo-data';

const meta: Meta = {
  title: 'Wendoro UI/Productivity',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Productivity suite: drag-and-keyboard KanbanBoard, Timeline, ActivityTimeline, Milestone, StatusProgression, and Month/Week/Day CalendarGrid.',
      },
    },
  },
};

export default meta;

function KanbanDemo() {
  const [cards, setCards] = React.useState(WENDORO_DEMO_KANBAN_CARDS);

  return (
    <KanbanBoard
      columns={WENDORO_DEMO_KANBAN_COLUMNS}
      cards={cards}
      onMoveCard={(cardId, toCol) =>
        setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, columnId: toCol } : c)))
      }
    />
  );
}

export const KanbanWithKeyboardControls: StoryObj = {
  render: () => <KanbanDemo />,
};

export const TimelinesAndMilestones: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <Timeline>
          <TimelineGroup label="Today (Demo)">
            <TimelineItem
              title="Sample Record #01 Verified"
              description="Approved by Demo User in Example Project."
              timestamp="10:15 AM"
              status="completed"
            />
            <TimelineItem
              title="Queue Spike Check"
              description="Sample Member B reviewed batch threshold."
              timestamp="09:40 AM"
              status="active"
            />
          </TimelineGroup>
        </Timeline>
        <StatusProgression
          stages={[
            { id: 'st1', label: 'Draft', state: 'completed' },
            { id: 'st2', label: 'Review', state: 'current' },
            { id: 'st3', label: 'Published', state: 'upcoming' },
          ]}
        />
      </div>
      <div className="space-y-4">
        <Milestone
          title="Example Project v2.0 Checkpoint"
          date="Nov 28, 2026"
          description="Verify design tokens, charts, and tests."
          status="reached"
        />
        <ActivityTimeline
          items={[
            { id: 'a1', title: 'Updated documentation', actor: 'Demo User', timestamp: '12m ago', status: 'completed' },
            { id: 'a2', title: 'Tested dark mode contrasts', actor: 'Sample Member A', timestamp: '45m ago', status: 'active' },
          ]}
        />
      </div>
    </div>
  ),
};

export const InteractiveCalendarGrid: StoryObj = {
  render: () => (
    <CalendarGrid
      selectedDate={new Date('2026-11-15T12:00:00Z')}
      events={[
        { id: 'c1', title: 'Sample Sprint Planning', date: '2026-11-15', timeLabel: '09:30', tone: 'primary' },
        { id: 'c2', title: 'Token Sync Checkpoint', date: '2026-11-16', timeLabel: '14:00', tone: 'default' },
        { id: 'c3', title: 'Demo Release Dry-Run', date: '2026-11-20', timeLabel: '11:00', tone: 'success' },
      ]}
    />
  ),
};
