import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  size?: CheckboxSize;
  error?: boolean;
}

const boxSizes: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-[18px] w-[18px]',
  lg: 'h-5 w-5',
};

const iconSizes: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onCheckedChange,
      onChange,
      label,
      description,
      size = 'md',
      error = false,
      disabled = false,
      id,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const inputId = useStableId(id, 'wdr-checkbox');
    const descriptionId = description ? `${inputId}-desc` : undefined;
    const internalRef = React.useRef<HTMLInputElement | null>(null);

    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(Boolean(defaultChecked));
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : uncontrolledChecked;

    React.useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const setRefs = (node: HTMLInputElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked;
      if (!isControlled) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
      onChange?.(event);
    };

    const isActive = isChecked || indeterminate;

    return (
      <div className={cn('inline-flex items-start gap-2.5', disabled && 'opacity-50', className)}>
        <div className="relative flex items-center pt-0.5">
          <input
            ref={setRefs}
            id={inputId}
            type="checkbox"
            checked={isControlled ? checked : undefined}
            defaultChecked={!isControlled ? defaultChecked : undefined}
            disabled={disabled}
            aria-invalid={error || undefined}
            aria-describedby={descriptionId}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={inputId}
            aria-hidden="true"
            className={cn(
              'flex items-center justify-center rounded-[var(--wdr-radius-small,4px)] border transition-colors duration-150',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              boxSizes[size],
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : error
                  ? 'border-destructive bg-surface'
                  : 'border-input bg-surface hover:border-foreground/50'
            )}
          >
            {indeterminate ? (
              <Minus className={cn(iconSizes[size], 'stroke-[2.5]')} />
            ) : isChecked ? (
              <Check className={cn(iconSizes[size], 'stroke-[2.75]')} />
            ) : null}
          </label>
        </div>
        {(label || description) && (
          <div className="grid gap-0.5 leading-snug">
            {label && (
              <label
                htmlFor={inputId}
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

Checkbox.displayName = 'Checkbox';
