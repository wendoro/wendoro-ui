import * as React from 'react';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type NotificationTone = 'neutral' | 'success' | 'warning' | 'destructive';

export interface NotificationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: string;
  source?: string;
  tone?: NotificationTone;
  unread?: boolean;
  onMarkRead?: () => void;
  onDismiss?: () => void;
  action?: React.ReactNode;
}

const toneIcons: Record<NotificationTone, React.ReactNode> = {
  neutral: <Bell className="h-4 w-4 text-foreground" />,
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  destructive: <AlertCircle className="h-4 w-4 text-destructive" />,
};

export const Notification = React.forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      title,
      description,
      timestamp,
      source,
      tone = 'neutral',
      unread = false,
      onMarkRead,
      onDismiss,
      action,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 rounded-[var(--wdr-radius-md)] border p-3.5 transition-colors',
          unread ? 'border-foreground/25 bg-surface' : 'border-border bg-surface/60',
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] bg-muted"
        >
          {toneIcons[tone]}
        </span>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">{title}</span>
              {unread && (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-subtle-foreground bg-primary-subtle px-1.5 py-0.5 rounded-[var(--wdr-radius-small,4px)] shrink-0">
                  New
                </span>
              )}
            </div>
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Dismiss notification"
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {description && <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>}

          {(source || timestamp || onMarkRead || action) && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {source && <span>{source}</span>}
                {source && timestamp && <span aria-hidden="true">·</span>}
                {timestamp && <time>{timestamp}</time>}
              </div>
              <div className="flex items-center gap-3">
                {action}
                {unread && onMarkRead && (
                  <button
                    type="button"
                    onClick={onMarkRead}
                    className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Notification.displayName = 'Notification';
