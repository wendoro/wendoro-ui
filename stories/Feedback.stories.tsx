import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from '../src/components/ui/alert';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
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
          'Feedback primitives: Alert, Badge, Toast, Notification, Progress, Skeleton, and Spinner. Never conveys state by color alone.',
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
            title: 'Deployment queued',
            description: 'Wendoro Flow pipeline #482 has started.',
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
            title: 'Sync failed',
            description: 'Check ERP webhook credentials in Settings.',
            variant: 'destructive',
          })
        }
      >
        Trigger Error Toast
      </Button>
    </div>
  );
}

export const FeedbackShowcase: StoryObj = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div className="space-y-3">
        <Alert variant="neutral" title="Scheduled Maintenance">
          Wendoro Platform ledger indexing runs Sunday 02:00 UTC.
        </Alert>
        <Alert variant="success" title="Invoice Batch Settled">
          142 payouts cleared without exceptions.
        </Alert>
        <Alert variant="warning" title="API Rate Limit Approaching">
          84% of hourly quota consumed for workspace wdr-prod.
        </Alert>
        <Alert variant="destructive" title="Webhook Signature Mismatch" dismissible>
          Incoming Commerce events were rejected due to an expired secret.
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
        title="New escalation assigned"
        description="Enterprise ticket #WDR-904 requires tier-2 review."
        source="Wendoro Support"
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
  ),
};
