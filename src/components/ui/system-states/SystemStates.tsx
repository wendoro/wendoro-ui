import * as React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CloudOff,
  Lock,
  RefreshCw,
  Save,
  Wrench,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { Button } from '../button';
import { Card } from '../card';
import { Spinner } from '../spinner';

/* -------------------------------------------------------------------------- */
/* ConnectionStatusBanner (Offline, Reconnecting, Syncing, Maintenance)       */
/* -------------------------------------------------------------------------- */

export type ConnectionState =
  | 'online'
  | 'offline'
  | 'reconnecting'
  | 'syncing'
  | 'sync_error'
  | 'maintenance';

export interface ConnectionStatusBannerProps {
  status: ConnectionState;
  detail?: string;
  lastSyncedLabel?: string;
  onRetry?: () => void;
  className?: string;
}

const CONNECTION_META: Record<
  ConnectionState,
  { title: string; classes: string; icon: React.ReactNode }
> = {
  online: {
    title: 'Connected & synchronized',
    classes: 'border-success/40 bg-success-subtle text-success-subtle-foreground',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
  },
  offline: {
    title: 'You are currently offline',
    classes: 'border-warning/40 bg-warning-subtle text-warning-subtle-foreground',
    icon: <CloudOff className="h-4 w-4 shrink-0" aria-hidden="true" />,
  },
  reconnecting: {
    title: 'Reconnecting to workspace…',
    classes: 'border-border bg-surface text-foreground',
    icon: <Spinner size="xs" />,
  },
  syncing: {
    title: 'Synchronizing pending changes…',
    classes: 'border-border bg-surface text-foreground',
    icon: <RefreshCw className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />,
  },
  sync_error: {
    title: 'Connection or synchronization error',
    classes: 'border-destructive/40 bg-destructive-subtle text-destructive-subtle-foreground',
    icon: <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />,
  },
  maintenance: {
    title: 'Scheduled maintenance active',
    classes: 'border-warning/40 bg-warning-subtle text-warning-subtle-foreground',
    icon: <Wrench className="h-4 w-4 shrink-0" aria-hidden="true" />,
  },
};

export function ConnectionStatusBanner({
  status,
  detail,
  lastSyncedLabel,
  onRetry,
  className,
}: ConnectionStatusBannerProps) {
  const cfg = CONNECTION_META[status];
  return (
    <div
      role={status === 'sync_error' ? 'alert' : 'status'}
      aria-live="polite"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border px-3.5 py-2.5 text-xs',
        cfg.classes,
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {cfg.icon}
        <div className="min-w-0">
          <div className="font-semibold">{cfg.title}</div>
          {(detail || lastSyncedLabel) && (
            <div className="opacity-90">
              {[detail, lastSyncedLabel].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      </div>
      {onRetry && (status === 'offline' || status === 'sync_error') && (
        <Button size="sm" variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="h-3 w-3" />}>
          Reconnect
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AutosaveIndicator                                                          */
/* -------------------------------------------------------------------------- */

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved' | 'error';

export function AutosaveIndicator({
  status,
  savedAtLabel,
  onSaveNow,
  className,
}: {
  status: SaveStatus;
  savedAtLabel?: string;
  onSaveNow?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border border-border bg-surface px-2.5 py-1 text-xs',
        className
      )}
    >
      {status === 'saving' && (
        <>
          <Spinner size="xs" />
          <span className="text-muted-foreground">Autosaving…</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          <span className="text-foreground">Saved{savedAtLabel ? ` · ${savedAtLabel}` : ''}</span>
        </>
      )}
      {status === 'unsaved' && (
        <>
          <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
          <span className="font-medium text-foreground">Unsaved changes</span>
          {onSaveNow && (
            <button
              type="button"
              onClick={onSaveNow}
              className="inline-flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover"
            >
              <Save className="h-3 w-3" aria-hidden="true" />
              Save
            </button>
          )}
        </>
      )}
      {status === 'error' && (
        <>
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
          <span className="text-destructive">Save failed</span>
          {onSaveNow && (
            <button
              type="button"
              onClick={onSaveNow}
              className="underline font-medium text-foreground"
            >
              Retry
            </button>
          )}
        </>
      )}
      {status === 'idle' && <span className="text-muted-foreground">All changes synced</span>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PermissionDeniedState                                                      */
/* -------------------------------------------------------------------------- */

export function PermissionDeniedState({
  title = 'Access restricted',
  description = 'Your current workspace role does not include permission for this interface.',
  requiredRole,
  onGoBack,
  onRequestAccess,
  className,
}: {
  title?: string;
  description?: string;
  requiredRole?: string;
  onGoBack?: () => void;
  onRequestAccess?: () => void;
  className?: string;
}) {
  return (
    <Card role="alert" className={cn('flex flex-col items-center justify-center gap-3 p-8 text-center', className)}>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-destructive-subtle text-destructive-subtle-foreground">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-xs text-muted-foreground">{description}</p>
        {requiredRole && (
          <div className="pt-1">
            <span className="rounded border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
              Required role: {requiredRole}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onGoBack && (
          <Button variant="outline" size="sm" onClick={onGoBack} leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
            Go back
          </Button>
        )}
        {onRequestAccess && (
          <Button variant="primary" size="sm" onClick={onRequestAccess}>
            Request access
          </Button>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* MaintenanceState                                                           */
/* -------------------------------------------------------------------------- */

export function MaintenanceState({
  title = 'Scheduled system maintenance',
  description = 'This module is temporarily read-only while platform updates complete.',
  windowLabel,
  statusUrl,
  onRefresh,
  className,
}: {
  title?: string;
  description?: string;
  windowLabel?: string;
  statusUrl?: string;
  onRefresh?: () => void;
  className?: string;
}) {
  const safeHref = statusUrl ? sanitizeUrl(statusUrl) : undefined;
  return (
    <Card role="status" className={cn('flex flex-col items-center justify-center gap-3 p-8 text-center', className)}>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-warning-subtle text-warning-subtle-foreground">
        <Wrench className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-xs text-muted-foreground">{description}</p>
        {windowLabel && (
          <div className="text-[11px] font-medium text-foreground tabular-nums">
            Maintenance window: {windowLabel}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Check status
          </Button>
        )}
        {safeHref && (
          <a
            href={safeHref}
            className="inline-flex h-8 items-center rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-muted"
          >
            View status page
          </a>
        )}
      </div>
    </Card>
  );
}
