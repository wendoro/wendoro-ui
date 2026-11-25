import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  label?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  size?: SliderSize;
}

const trackHeights: Record<SliderSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
};

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue = 50,
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      label,
      showValue = true,
      formatValue = (v) => String(v),
      size = 'md',
      disabled = false,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const sliderId = useStableId(id, 'wdr-slider');
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const clampedValue = Math.min(max, Math.max(min, currentValue));
    const percentage = max === min ? 0 : ((clampedValue - min) / (max - min)) * 100;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    };

    return (
      <div className={cn('w-full space-y-2', disabled && 'opacity-50', className)}>
        {(label || showValue) && (
          <div className="flex items-center justify-between gap-2 text-sm">
            {label && (
              <label htmlFor={sliderId} className="font-medium text-foreground">
                {label}
              </label>
            )}
            {showValue && (
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {formatValue(clampedValue)}
              </span>
            )}
          </div>
        )}
        <div className="relative flex items-center py-2">
          <div
            aria-hidden="true"
            className={cn(
              'relative w-full overflow-hidden rounded-full bg-muted',
              trackHeights[size]
            )}
          >
            <div
              className="h-full bg-primary transition-[width] duration-75"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <input
            ref={ref}
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={clampedValue}
            aria-valuetext={formatValue(clampedValue)}
            disabled={disabled}
            onChange={handleChange}
            className={cn(
              'peer absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed'
            )}
            {...props}
          />
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-primary shadow-xs transition-transform duration-100',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background'
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
