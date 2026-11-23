import * as React from 'react';
import { cn } from '../../../utils/cn';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'current' | 'primary' | 'muted';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3.5 w-3.5 border-[1.75px]',
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-7 w-7 border-[2.5px]',
};

const variantClasses: Record<SpinnerVariant, string> = {
  current: 'border-current border-t-transparent',
  primary: 'border-primary border-t-transparent',
  muted: 'border-muted-foreground border-t-transparent',
};

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ size = 'md', variant = 'current', label = 'Loading', className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        role="status"
        aria-label={label}
        className={cn('inline-flex items-center justify-center shrink-0', className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block rounded-full animate-spin',
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        <span className="sr-only">{label}</span>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
