import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: SwitchSize;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const trackSizes: Record<SwitchSize, string> = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
  lg: 'h-7 w-13',
};

const thumbSizes: Record<SwitchSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4.5 w-4.5',
  lg: 'h-5.5 w-5.5',
};

const thumbTranslations: Record<SwitchSize, { on: string; off: string }> = {
  sm: { on: 'translate-x-4', off: 'translate-x-0.5' },
  md: { on: 'translate-x-5.5', off: 'translate-x-0.5' },
  lg: { on: 'translate-x-6.5', off: 'translate-x-0.5' },
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      label,
      description,
      disabled = false,
      id,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const switchId = useStableId(id, 'wdr-switch');
    const descriptionId = description ? `${switchId}-desc` : undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : internalChecked;

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isChecked;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onCheckedChange?.(next);
      onClick?.(event);
    };

    return (
      <div className={cn('inline-flex items-start gap-3', disabled && 'opacity-50', className)}>
        <button
          ref={ref}
          id={switchId}
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-describedby={descriptionId}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'relative inline-flex shrink-0 items-center rounded-full border transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            trackSizes[size],
            isChecked
              ? 'border-primary bg-primary'
              : 'border-input bg-muted hover:border-foreground/40'
          )}
          {...props}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none inline-block rounded-full shadow-xs transition-transform duration-150',
              thumbSizes[size],
              isChecked
                ? `${thumbTranslations[size].on} bg-primary-foreground`
                : `${thumbTranslations[size].off} bg-foreground`
            )}
          />
        </button>
        {(label || description) && (
          <div className="grid gap-0.5 leading-snug">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'text-sm font-medium text-foreground select-none',
                  disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p id={descriptionId} className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
