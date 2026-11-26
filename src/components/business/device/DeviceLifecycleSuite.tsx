import * as React from 'react';
import {
  Camera,
  Check,
  Copy,
  Download,
  MapPin,
  Mic,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useClipboard } from '../../../hooks/use-clipboard';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* PWA Install & Application Update Prompts                                   */
/* -------------------------------------------------------------------------- */

export function PwaInstallPrompt({
  appName = 'Wendoro Workspace',
  description = 'Install the web application for quicker desktop or mobile launch.',
  onInstall,
  onDismiss,
  className,
}: {
  appName?: string;
  description?: string;
  onInstall: () => void;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] bg-primary text-primary-foreground">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <div className="text-sm font-semibold text-foreground">Install {appName}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Later
            </Button>
          )}
          <Button size="sm" variant="primary" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={onInstall}>
            Install app
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function PwaUpdatePrompt({
  versionLabel,
  notes,
  onReloadToUpdate,
  onDismiss,
  className,
}: {
  versionLabel: string;
  notes?: string;
  onReloadToUpdate: () => void;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Card role="status" className={cn('border-primary/50 bg-primary-subtle/30 p-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-foreground">Update ready ({versionLabel})</div>
          {notes && <div className="text-xs text-muted-foreground">{notes}</div>}
        </div>
        <div className="flex items-center gap-2">
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
          <Button size="sm" variant="primary" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={onReloadToUpdate}>
            Reload & apply
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* DevicePermissionPrompt (Camera, Microphone, Location)                      */
/* -------------------------------------------------------------------------- */

export type DeviceCapability = 'camera' | 'microphone' | 'location';

const DEVICE_META: Record<
  DeviceCapability,
  { title: string; detail: string; icon: React.ReactNode }
> = {
  camera: {
    title: 'Camera access',
    detail: 'Allow your browser to capture video or scan visual inputs when you start a session.',
    icon: <Camera className="h-4 w-4" aria-hidden="true" />,
  },
  microphone: {
    title: 'Microphone access',
    detail: 'Allow audio input during voice dictation or meeting calls.',
    icon: <Mic className="h-4 w-4" aria-hidden="true" />,
  },
  location: {
    title: 'Location access',
    detail: 'Share approximate region coordinates with your active geospatial workspace.',
    icon: <MapPin className="h-4 w-4" aria-hidden="true" />,
  },
};

export function DevicePermissionPrompt({
  capability,
  status = 'prompt',
  onRequestPermission,
  className,
}: {
  capability: DeviceCapability;
  status?: 'prompt' | 'granted' | 'denied';
  onRequestPermission: () => void;
  className?: string;
}) {
  const meta = DEVICE_META[capability];

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {meta.icon}
          <span>{meta.title}</span>
        </div>
        <StatusBadge
          status={status === 'granted' ? 'completed' : status === 'denied' ? 'error' : 'pending'}
          label={status}
        />
      </div>
      <p className="text-xs text-muted-foreground">{meta.detail}</p>
      {status !== 'granted' && (
        <Button size="sm" variant="outline" onClick={onRequestPermission}>
          {status === 'denied' ? 'Retry permission check' : `Request ${capability} permission`}
        </Button>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* ClipboardCopyButton, BackgroundTaskStatus, RecordingIndicator              */
/* -------------------------------------------------------------------------- */

export function ClipboardCopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}) {
  const { copied, copy } = useClipboard(2000);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => void copy(value)}
      leftIcon={copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
      className={className}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}

export interface BackgroundTaskEntry {
  id: string;
  label: string;
  progress: number;
  status: 'running' | 'completed' | 'failed';
  detail?: string;
}

export function BackgroundTaskStatus({
  tasks,
  onRetryTask,
  title = 'Background tasks',
  className,
}: {
  tasks: BackgroundTaskEntry[];
  onRetryTask?: (taskId: string) => void;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center justify-between text-xs font-semibold text-foreground">
        <span>{title}</span>
        <span className="tabular-nums text-muted-foreground">{tasks.length} items</span>
      </div>
      <ul className="space-y-2.5">
        {tasks.map((task) => (
          <li key={task.id} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-foreground">{task.label}</span>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={
                    task.status === 'completed'
                      ? 'completed'
                      : task.status === 'failed'
                        ? 'error'
                        : 'active'
                  }
                  label={task.status}
                />
                {task.status === 'failed' && onRetryTask && (
                  <Button size="sm" variant="outline" onClick={() => onRetryTask(task.id)}>
                    Retry
                  </Button>
                )}
              </div>
            </div>
            <Progress
              value={task.progress}
              variant={task.status === 'failed' ? 'destructive' : 'primary'}
              size="sm"
            />
            {task.detail && <div className="text-[11px] text-muted-foreground">{task.detail}</div>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RecordingIndicator({
  recording,
  durationLabel = '00:00',
  onToggle,
  className,
}: {
  recording: boolean;
  durationLabel?: string;
  onToggle?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 py-1.5 text-xs',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-2.5 w-2.5 rounded-full', recording ? 'bg-destructive' : 'bg-muted-foreground')}
      />
      <span className="font-semibold text-foreground">{recording ? 'Recording' : 'Ready to record'}</span>
      <span className="font-mono tabular-nums text-muted-foreground">{durationLabel}</span>
      {onToggle && (
        <Button size="sm" variant={recording ? 'destructive' : 'outline'} onClick={onToggle}>
          {recording ? 'Stop' : 'Start'}
        </Button>
      )}
    </div>
  );
}
