import * as React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export type AlertVariant = 'neutral' | 'info' | 'success' | 'warning' | 'destructive';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: AlertVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
  neutral: 'bg-surface border-border text-foreground',
  info: 'bg-info-subtle border-border text-info-subtle-foreground',
  success: 'bg-success-subtle border-success/30 text-success-subtle-foreground',
  warning: 'bg-warning-subtle border-warning/35 text-warning-subtle-foreground',
  destructive: 'bg-destructive-subtle border-destructive/35 text-destructive-subtle-foreground',
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  neutral: <Info className="h-4 w-4 shrink-0" />,
  info: <Info className="h-4 w-4 shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
  destructive: <AlertCircle className="h-4 w-4 shrink-0" />,
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'neutral',
      title,
      icon,
      dismissible = false,
      onDismiss,
      action,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const role = variant === 'destructive' || variant === 'warning' ? 'alert' : 'status';

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          'relative flex w-full items-start gap-3 rounded-[var(--wdr-radius-md)] border p-4 text-sm',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span aria-hidden="true" className="mt-0.5 shrink-0">
          {icon ?? defaultIcons[variant]}
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          {title && <div className="font-semibold leading-snug">{title}</div>}
          {children && <div className="text-sm opacity-90 leading-relaxed">{children}</div>}
          {action && <div className="pt-2">{action}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
