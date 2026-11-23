import * as React from 'react';
import { cn } from '@/utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  error?: boolean;
  leftAdornment?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  containerClassName?: string;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 text-xs px-2.5',
  md: 'h-10 text-sm px-3',
  lg: 'h-11 text-base px-3.5',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      leftAdornment,
      rightAdornment,
      disabled,
      className,
      containerClassName,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const hasAdornment = Boolean(leftAdornment || rightAdornment);

    if (!hasAdornment) {
      return (
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(
            'w-full rounded-[var(--wdr-radius-md)] border bg-surface text-foreground placeholder:text-muted-foreground',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input hover:border-foreground/40',
            sizeClasses[size],
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          'flex w-full items-center rounded-[var(--wdr-radius-md)] border bg-surface text-foreground transition-colors duration-150',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 focus-within:ring-offset-background',
          disabled && 'cursor-not-allowed opacity-50 bg-muted',
          error
            ? 'border-destructive focus-within:ring-destructive'
            : 'border-input hover:border-foreground/40',
          containerClassName
        )}
      >
        {leftAdornment && (
          <span className="inline-flex shrink-0 items-center pl-3 text-muted-foreground">
            {leftAdornment}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          aria-invalid={error || undefined}
          className={cn(
            'w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed',
            sizeClasses[size],
            leftAdornment && 'pl-2',
            rightAdornment && 'pr-2',
            className
          )}
          {...props}
        />
        {rightAdornment && (
          <span className="inline-flex shrink-0 items-center pr-3 text-muted-foreground">
            {rightAdornment}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
