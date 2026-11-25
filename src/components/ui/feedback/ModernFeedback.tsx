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
  value,
  size = 56,
  strokeWidth = 6,
  label,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - clamped / 100);

  return (
    <div
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
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
      <span className="absolute text-xs font-bold tabular-nums text-foreground">{Math.round(clamped)}%</span>
    </div>
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
