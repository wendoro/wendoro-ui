import * as React from 'react';
import { cn } from '../../../utils/cn';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: TextareaSize;
  error?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: 'min-h-[76px] p-2.5 text-xs',
  md: 'min-h-[96px] p-3 text-sm',
  lg: 'min-h-[124px] p-3.5 text-base',
};

const resizeClasses: Record<NonNullable<TextareaProps['resize']>, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size = 'md', error = false, resize = 'vertical', disabled, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
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
          resizeClasses[resize],
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
