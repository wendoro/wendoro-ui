import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Spinner } from '../spinner';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
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
  tertiary:
    'bg-muted/70 text-foreground border border-border/70 hover:bg-muted active:bg-secondary',
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

/* -------------------------------------------------------------------------- */
/* Toggle (Pressed State Button)                                              */
/* -------------------------------------------------------------------------- */

export interface ToggleProps extends Omit<ButtonProps, 'variant'> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ pressed: controlledPressed, defaultPressed = false, onPressedChange, onClick, className, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const pressed = controlledPressed ?? internalPressed;

    return (
      <Button
        ref={ref}
        variant={pressed ? 'primary' : 'outline'}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        onClick={(e) => {
          const next = !pressed;
          if (controlledPressed === undefined) setInternalPressed(next);
          onPressedChange?.(next);
          onClick?.(e);
        }}
        className={cn(pressed && 'font-semibold', className)}
        {...props}
      />
    );
  }
);

Toggle.displayName = 'Toggle';

/* -------------------------------------------------------------------------- */
/* ButtonGroup & SplitButton                                                  */
/* -------------------------------------------------------------------------- */

export function ButtonGroup({
  children,
  'aria-label': ariaLabel = 'Button group',
  className,
}: {
  children: React.ReactNode;
  'aria-label'?: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex flex-wrap items-center [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none',
        className
      )}
    >
      {children}
    </div>
  );
}

export interface SplitButtonOption {
  id: string;
  label: string;
  disabled?: boolean;
  onSelect: () => void;
}

export interface SplitButtonProps {
  label: string;
  onPrimaryClick: () => void;
  options: SplitButtonOption[];
  variant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'outline'>;
  size?: Extract<ButtonSize, 'sm' | 'md' | 'lg'>;
  disabled?: boolean;
  loading?: boolean;
  menuLabel?: string;
  className?: string;
}

export function SplitButton({
  label,
  onPrimaryClick,
  options,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  menuLabel = 'More actions',
  className,
}: SplitButtonProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        onClick={onPrimaryClick}
        className="rounded-r-none"
      >
        {label}
      </Button>
      <Button
        variant={variant}
        size={size}
        disabled={disabled || loading}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={menuLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="-ml-px rounded-l-none border-l border-l-border/40 px-2.5"
      >
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </Button>

      {open && (
        <div
          role="menu"
          aria-label={menuLabel}
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[180px] rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-lg)]"
        >
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="menuitem"
              disabled={opt.disabled}
              onClick={() => {
                opt.onSelect();
                setOpen(false);
              }}
              className="flex w-full items-center rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

