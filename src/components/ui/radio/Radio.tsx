import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  onSelect: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  orientation = 'vertical',
  disabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  className,
  children,
}: RadioGroupProps) {
  const generatedName = useStableId(name, 'wdr-radio-group');
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  const handleSelect = React.useCallback(
    (nextValue: string) => {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [onValueChange, value]
  );

  return (
    <RadioGroupContext.Provider
      value={{
        name: generatedName,
        value: currentValue,
        disabled,
        onSelect: handleSelect,
      }}
    >
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-orientation={orientation}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-5',
          className
        )}
      >
        {options
          ? options.map((opt) => (
              <Radio
                key={opt.value}
                value={opt.value}
                label={opt.label}
                description={opt.description}
                disabled={opt.disabled}
              />
            ))
          : children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ value, label, description, disabled = false, id, className, onChange, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext);
    const inputId = useStableId(id, 'wdr-radio');
    const descriptionId = description ? `${inputId}-desc` : undefined;

    const isDisabled = Boolean(disabled || ctx?.disabled);
    const isChecked = ctx ? ctx.value === value : props.checked;
    const groupName = ctx?.name ?? props.name;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (ctx) {
        ctx.onSelect(value);
      }
      onChange?.(event);
    };

    return (
      <div className={cn('inline-flex items-start gap-2.5', isDisabled && 'opacity-50', className)}>
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            id={inputId}
            type="radio"
            name={groupName}
            value={value}
            checked={isChecked}
            disabled={isDisabled}
            aria-describedby={descriptionId}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <label
            htmlFor={inputId}
            aria-hidden="true"
            className={cn(
              'flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors duration-150',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
              isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
              isChecked
                ? 'border-foreground bg-primary'
                : 'border-input bg-surface hover:border-foreground/50'
            )}
          >
            {isChecked && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
          </label>
        </div>
        {(label || description) && (
          <div className="grid gap-0.5 leading-snug">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'text-sm font-medium text-foreground select-none',
                  isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
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

Radio.displayName = 'Radio';
