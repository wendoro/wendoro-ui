import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../src/components/ui/alert';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { EmptyState } from '../src/components/ui/empty-state';
import { Notification } from '../src/components/ui/notification';
import { Progress } from '../src/components/ui/progress';
import { Skeleton } from '../src/components/ui/skeleton';
import { Spinner } from '../src/components/ui/spinner';
import { useToast } from '../src/components/ui/toast';

const meta: Meta = {
  title: 'Feedback/Overview',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Feedback primitives: Alert, Badge, Toast, Notification, Progress, Skeleton, Spinner, and EmptyState. Never conveys state by color alone.',
      },
    },
  },
};

export default meta;

function ToastTriggerDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="primary"
        size="sm"
        onClick={() =>
          toast({
            title: 'Sample workflow queued',
            description: 'Demo Wendoro Flow run #01 has started.',
            variant: 'success',
          })
        }
      >
        Trigger Success Toast
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() =>
          toast({
            title: 'Sample sync failed',
            description: 'Check demo webhook settings in workspace configuration.',
            variant: 'destructive',
          })
        }
      >
        Trigger Error Toast
      </Button>
    </div>
  );
}

function FeedbackShowcaseContent() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-3">
        <Alert variant="neutral" title="Scheduled Maintenance (Demo)">
          Sample Wendoro Platform indexing notice (illustrative).
        </Alert>
        <Alert variant="success" title="Validation Sample Settled">
          Sample batch verification passed in demo preview.
        </Alert>
        <Alert variant="warning" title="Quota Threshold Approaching (Demo)">
          84% of sample quota consumed in demo workspace.
        </Alert>
        <Alert variant="destructive" title="Webhook Signature Mismatch (Demo)" dismissible>
          Sample Commerce events were rejected in this illustrative scenario.
        </Alert>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="success">Verified</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="destructive">Blocked</Badge>
      </div>

      <ToastTriggerDemo />

      <Notification
        title="Sample escalation assigned"
        description="Illustrative ticket #DEMO-01 requires reviewer attention."
        source="Wendoro Support (Demo)"
        timestamp="4m ago"
        tone="warning"
        unread
      />

      <div className="space-y-3">
        <Progress label="Catalog Sync" value={72} showValue variant="primary" />
        <Progress label="Verification Passed" value={100} showValue variant="success" />
      </div>

      <div className="flex items-center gap-6">
        <Spinner size="sm" />
        <Spinner size="md" variant="primary" />
        <div className="flex-1 space-y-2">
          <Skeleton shape="text" lines={2} />
        </div>
      </div>
    </div>
  );
}

export const FeedbackShowcase: StoryObj = {
  render: () => <FeedbackShowcaseContent />,
};

export const LoadingAndEmpty: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-6 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4">
        <Spinner size="md" variant="primary" />
        <div className="flex-1 space-y-2">
          <Skeleton shape="text" lines={3} />
        </div>
      </div>
      <EmptyState
        title="No alerts recorded"
        description="All Wendoro Platform and Desk pipelines are operating normally."
        action={<Button variant="outline" size="sm">Refresh Status</Button>}
      />
    </div>
  ),
};

export const DarkTheme: StoryObj = {
  render: () => (
    <div
      className="dark rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <FeedbackShowcaseContent />
    </div>
  ),
};
