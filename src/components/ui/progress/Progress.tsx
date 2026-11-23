import * as React from 'react';
import { cn } from '@/utils/cn';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'success' | 'warning' | 'destructive';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: ProgressSize;
  variant?: ProgressVariant;
  label?: string;
  showValue?: boolean;
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

const variantClasses: Record<ProgressVariant, string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value = 0,
      max = 100,
      indeterminate = false,
      size = 'md',
      variant = 'primary',
      label,
      showValue = false,
      className,
      ...props
    },
    ref
  ) => {
    const safeMax = max <= 0 ? 100 : max;
    const clamped = Math.min(safeMax, Math.max(0, value));
    const percent = Math.round((clamped / safeMax) * 100);

    return (
      <div ref={ref} className={cn('w-full space-y-1.5', className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-2 text-xs">
            {label && <span className="font-medium text-foreground">{label}</span>}
            {showValue && !indeterminate && (
              <span className="font-mono tabular-nums text-muted-foreground">{percent}%</span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-label={label ?? 'Progress'}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={indeterminate ? undefined : clamped}
          className={cn('w-full overflow-hidden rounded-full bg-muted', sizeClasses[size])}
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-200 ease-out',
              variantClasses[variant],
              indeterminate && 'w-2/5 animate-pulse'
            )}
            style={indeterminate ? undefined : { width: `${percent}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
