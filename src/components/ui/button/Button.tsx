import * as React from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from '../spinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground border border-primary hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active shadow-xs',
  secondary:
    'bg-secondary text-secondary-foreground border border-transparent hover:bg-secondary-hover active:opacity-90',
  outline:
    'bg-surface text-foreground border border-border hover:bg-muted active:bg-secondary',
  ghost:
    'bg-transparent text-foreground border border-transparent hover:bg-muted active:bg-secondary',
  destructive:
    'bg-destructive text-destructive-foreground border border-destructive hover:bg-destructive-hover hover:border-destructive-hover active:opacity-95 shadow-xs',
  link:
    'bg-transparent text-foreground border border-transparent underline-offset-4 hover:underline p-0 h-auto',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--wdr-radius-md)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--wdr-radius-md)]',
  lg: 'h-11 px-6 text-base gap-2.5 rounded-[var(--wdr-radius-md)]',
  icon: 'h-10 w-10 p-0 rounded-[var(--wdr-radius-md)]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        data-variant={variant}
        data-size={size}
        className={cn(
          'inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 select-none',
          'transition-[background-color,border-color,color,transform,opacity] duration-150 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.985]',
          variantStyles[variant],
          variant !== 'link' ? sizeStyles[size] : 'gap-1.5 text-sm',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={size === 'sm' ? 'xs' : 'sm'} variant="current" label="Loading" />
            {size !== 'icon' && (loadingText ?? children)}
          </>
        ) : (
          <>
            {leftIcon && (
              <span aria-hidden="true" className="inline-flex shrink-0 items-center">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span aria-hidden="true" className="inline-flex shrink-0 items-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
