import * as React from 'react';
import { AlertCircle, CheckCircle2, Info, RotateCcw, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../button';
import { Card } from '../card';
import { Dialog, DialogFooter } from '../dialog';
import { Spinner } from '../spinner';

export interface BannerProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: 'default' | 'warning' | 'destructive' | 'success';
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const BANNER_CLASSES: Record<NonNullable<BannerProps['variant']>, string> = {
  default: 'border-border bg-surface text-foreground',
  warning: 'border-warning/40 bg-warning-subtle text-warning-subtle-foreground',
  destructive: 'border-destructive/40 bg-destructive-subtle text-destructive-subtle-foreground',
  success: 'border-success/40 bg-success-subtle text-success-subtle-foreground',
};

export function Banner({
  title,
  description,
  variant = 'default',
  action,
  onDismiss,
  className,
}: BannerProps) {
  return (
    <div
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border px-4 py-3 text-sm',
        BANNER_CLASSES[variant],
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          {description && <div className="text-xs opacity-90">{description}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action}
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={onDismiss}
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-background/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export function InlineAlert({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'warning' | 'destructive' | 'success';
  className?: string;
}) {
  return (
    <div
      role={variant === 'destructive' ? 'alert' : 'status'}
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border px-3 py-1.5 text-xs font-medium',
        BANNER_CLASSES[variant],
        className
      )}
    >
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function CircularProgress({
  value = 0,
  indeterminate = false,
  size = 56,
  strokeWidth = 6,
  label,
  className,
}: {
  value?: number;
  indeterminate?: boolean;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = indeterminate ? circ * 0.72 : circ * (1 - clamped / 100);

  return (
    <div
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className={cn('-rotate-90', indeterminate && 'animate-spin')}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--wdr-muted)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--wdr-primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      {!indeterminate && (
        <span className="absolute text-xs font-bold tabular-nums text-foreground">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}

export function InlineLoader({
  label = 'Loading…',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-xs font-medium text-muted-foreground', className)}>
      <Spinner size="xs" />
      <span>{label}</span>
    </span>
  );
}

export function FullScreenLoader({
  open,
  title = 'Preparing workspace…',
  description,
  onCancel,
  cancelLabel = 'Cancel',
}: {
  open: boolean;
  title?: string;
  description?: string;
  onCancel?: () => void;
  cancelLabel?: string;
}) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/92 px-6 text-center backdrop-blur-xs"
    >
      <Spinner size="lg" />
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      </div>
      {onCancel && (
        <Button variant="outline" size="sm" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
    </div>
  );
}

export interface ProgressStepItem {
  id: string;
  label: string;
  detail?: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
}

export function MultiStepProgress({
  steps,
  title = 'Execution progress',
  className,
}: {
  steps: ProgressStepItem[];
  title?: string;
  className?: string;
}) {
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const pct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">{title}</span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {completedCount}/{steps.length} ({pct}%)
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${pct}%` }} />
      </div>
      <ol className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-start gap-2.5 text-xs">
            <span className="mt-0.5 shrink-0">
              {step.status === 'completed' ? (
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
              ) : step.status === 'failed' ? (
                <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
              ) : step.status === 'active' ? (
                <Spinner size="xs" />
              ) : (
                <span className="inline-block h-3.5 w-3.5 rounded-full border border-border bg-muted" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className={cn('font-medium', step.status === 'failed' ? 'text-destructive' : 'text-foreground')}>
                {step.label}
              </div>
              {step.detail && <div className="text-[11px] text-muted-foreground">{step.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export interface TransferProgressCardProps {
  mode?: 'upload' | 'download' | 'install' | 'task';
  title: string;
  subtitle?: string;
  progress: number;
  indeterminate?: boolean;
  status?: 'active' | 'paused' | 'completed' | 'failed';
  metaLabel?: string;
  onPauseToggle?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function TransferProgressCard({
  mode = 'upload',
  title,
  subtitle,
  progress,
  indeterminate = false,
  status = 'active',
  metaLabel,
  onPauseToggle,
  onRetry,
  onCancel,
  className,
}: TransferProgressCardProps) {
  const clamped = Math.max(0, Math.min(100, progress));
  const modeLabel =
    mode === 'download'
      ? 'Download'
      : mode === 'install'
        ? 'Install'
        : mode === 'task'
          ? 'Background task'
          : 'Upload';

  return (
    <Card className={cn('p-4 space-y-2.5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {modeLabel}
            </span>
            <span className="truncate text-sm font-semibold text-foreground">{title}</span>
          </div>
          {subtitle && <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {status === 'failed' && onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry} leftIcon={<RotateCcw className="h-3 w-3" />}>
              Retry
            </Button>
          )}
          {(status === 'active' || status === 'paused') && onPauseToggle && (
            <Button size="sm" variant="outline" onClick={onPauseToggle}>
              {status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
          )}
          {status !== 'completed' && onCancel && (
            <button
              type="button"
              aria-label={`Cancel ${title}`}
              onClick={onCancel}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div
        role="progressbar"
        aria-label={`${modeLabel} ${title}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : clamped}
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-200',
            status === 'failed'
              ? 'bg-destructive'
              : status === 'completed'
                ? 'bg-success'
                : 'bg-primary',
            indeterminate && 'w-2/5 animate-pulse'
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground tabular-nums">
        <span>{metaLabel ?? (status === 'completed' ? 'Completed' : status === 'failed' ? 'Failed' : status === 'paused' ? 'Paused' : 'In progress')}</span>
        {!indeterminate && <span className="font-mono font-semibold text-foreground">{Math.round(clamped)}%</span>}
      </div>
    </Card>
  );
}

export function LoadingOverlay({
  loading,
  label = 'Loading content…',
  children,
  className,
}: {
  loading: boolean;
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div
          role="status"
          aria-label={label}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-[var(--wdr-radius-lg)] bg-background/80 backdrop-blur-[1px]"
        >
          <Spinner size="md" />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Unable to load this section.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return (
    <Card role="alert" className={cn('flex flex-col items-center justify-center gap-3 p-6 text-center', className)}>
      <AlertCircle className="h-7 w-7 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
          {retryLabel}
        </Button>
      )}
    </Card>
  );
}

export function RetryState(props: {
  title?: string;
  description?: string;
  onRetry: () => void;
  retryLabel?: string;
  className?: string;
}) {
  return <ErrorState {...props} />;
}

export function SuccessState({
  title = 'Completed successfully',
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card role="status" className={cn('flex flex-col items-center justify-center gap-3 p-6 text-center', className)}>
      <CheckCircle2 className="h-7 w-7 text-success" aria-hidden="true" />
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </Card>
  );
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          {cancelLabel}
        </Button>
        <Button
          variant={destructive ? 'destructive' : 'primary'}
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
        >
          {confirmLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
