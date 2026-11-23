import * as React from 'react';
import { cn } from '@/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, optional = false, disabled = false, className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 text-[13px] font-medium leading-snug text-foreground select-none',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {required && (
          <span aria-hidden="true" className="text-destructive font-semibold">
            *
          </span>
        )}
        {!required && optional && (
          <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
        )}
      </label>
    );
  }
);

Label.displayName = 'Label';
