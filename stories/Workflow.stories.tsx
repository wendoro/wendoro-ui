import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ApprovalSteps,
  Checklist,
  HierarchyView,
  ProgressTimeline,
  Stepper,
  TaskList,
  TreeView,
  Wizard,
  WorkflowProgress,
} from '../src/components/business/productivity';

const meta: Meta = {
  title: 'Wendoro UI/Workflow',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Workflow progression and hierarchy components: Stepper, Wizard, WorkflowProgress, TaskList, Checklist, ApprovalSteps, ProgressTimeline, TreeView, and HierarchyView.',
      },
    },
  },
};

export default meta;

function WorkflowSuiteDemo() {
  const [step, setStep] = React.useState(1);
  const [tasks, setTasks] = React.useState([
    { id: 't1', title: 'Audit Brand Tokens (Demo)', completed: true, assignee: 'Demo User' },
    { id: 't2', title: 'Verify Accessible Tables', completed: false, assignee: 'Sample Member A' },
  ]);

  return (
    <div className="space-y-8">
      <Stepper
        currentStep={step}
        onStepSelect={setStep}
        steps={[
          { id: 's1', label: 'Initialize' },
          { id: 's2', label: 'Configure' },
          { id: 's3', label: 'Review' },
        ]}
      />

      <WorkflowProgress completedSteps={step + 1} totalSteps={3} label="Sample Workflow Progress" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Wizard
          currentStep={step}
          onStepChange={setStep}
          steps={[
            { id: 'w1', label: 'Workspace', content: <p className="text-sm text-muted-foreground">Select Sample Organization parameters.</p> },
            { id: 'w2', label: 'Rules', content: <p className="text-sm text-muted-foreground">Verify presentation workflow rules.</p> },
            { id: 'w3', label: 'Confirm', content: <p className="text-sm text-muted-foreground">Confirm Example Project configuration.</p> },
          ]}
        />

        <div className="space-y-4">
          <TaskList
            tasks={tasks}
            onToggleTask={(id, completed) =>
              setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
            }
          />
          <Checklist
            title="Demo Release Checklist"
            tasks={tasks}
            onToggleTask={(id, completed) =>
              setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ApprovalSteps
          steps={[
            { id: 'a1', role: 'Design Review', approver: 'Demo User', status: 'approved', timestamp: 'Yesterday' },
            { id: 'a2', role: 'Accessibility Sign-off', approver: 'Sample Member A', status: 'pending' },
          ]}
        />
        <ProgressTimeline
          currentStep={1}
          steps={[
            { id: 'p1', label: 'Draft Created' },
            { id: 'p2', label: 'Validation Running' },
            { id: 'p3', label: 'Ready for Review' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TreeView
          defaultExpandedIds={['org']}
          nodes={[
            {
              id: 'org',
              label: 'Sample Organization',
              children: [
                { id: 'proj-a', label: 'Example Project Alpha' },
                { id: 'proj-b', label: 'Example Project Beta' },
              ],
            },
          ]}
        />
        <HierarchyView
          title="Sample Org Hierarchy"
          nodes={[
            {
              id: 'root',
              label: 'Wendoro Design System',
              meta: 'v0.1.0',
              children: [{ id: 'child', label: 'Charts Subpath (Demo)' }],
            },
          ]}
        />
      </div>
    </div>
  );
}

export const AllWorkflowAndHierarchy: StoryObj = {
  render: () => <WorkflowSuiteDemo />,
};
