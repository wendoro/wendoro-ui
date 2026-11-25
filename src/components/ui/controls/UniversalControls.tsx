import * as React from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { cn } from '../../../utils/cn';

/* -------------------------------------------------------------------------- */
/* SegmentedControl                                                           */
/* -------------------------------------------------------------------------- */

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  'aria-label'?: string;
  className?: string;
}

export function SegmentedControl({
  options,
  value: controlled,
  defaultValue,
  onValueChange,
  size = 'md',
  fullWidth = false,
  'aria-label': ariaLabel = 'Segmented options',
  className,
}: SegmentedControlProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value ?? '');
  const activeValue = controlled ?? internal;

  const selectValue = (next: string) => {
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = options.filter((o) => !o.disabled);
    if (enabled.length === 0) return;
    const idx = enabled.findIndex((o) => o.value === activeValue);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = enabled[(idx + 1) % enabled.length];
      selectValue(next.value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = enabled[(idx - 1 + enabled.length) % enabled.length];
      selectValue(next.value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center rounded-[var(--wdr-radius-md)] border border-border bg-muted p-1',
        fullWidth && 'flex w-full',
        className
      )}
    >
      {options.map((opt) => {
        const selected = opt.value === activeValue;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={opt.disabled}
            onClick={() => selectValue(opt.value)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-[var(--wdr-radius-sm)] font-medium transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-45',
              size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3.5 text-xs',
              fullWidth && 'flex-1',
              selected
                ? 'bg-surface text-foreground shadow-[var(--wdr-shadow-sm)]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {opt.icon && <span aria-hidden="true" className="shrink-0">{opt.icon}</span>}
            <span className="truncate">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ButtonGroup                                                                */
/* -------------------------------------------------------------------------- */

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  attached?: boolean;
  orientation?: 'horizontal' | 'vertical';
  'aria-label'?: string;
}

export function ButtonGroup({
  attached = true,
  orientation = 'horizontal',
  'aria-label': ariaLabel = 'Button group',
  className,
  children,
  ...props
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
        !attached && 'gap-2',
        attached &&
          orientation === 'horizontal' &&
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px',
        attached &&
          orientation === 'vertical' &&
          '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SelectableChipGroup                                                        */
/* -------------------------------------------------------------------------- */

export interface SelectableChipItem {
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectableChipGroupProps {
  items: SelectableChipItem[];
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (values: string[]) => void;
  'aria-label'?: string;
  className?: string;
}

export function SelectableChipGroup({
  items,
  multiple = true,
  value: controlled,
  defaultValue = [],
  onValueChange,
  'aria-label': ariaLabel = 'Filter chips',
  className,
}: SelectableChipGroupProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const selected = controlled ?? internal;

  const toggle = (val: string) => {
    const next = multiple
      ? selected.includes(val)
        ? selected.filter((item) => item !== val)
        : [...selected, val]
      : selected.includes(val)
        ? []
        : [val];
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {items.map((item) => {
        const active = selected.includes(item.value);
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={active}
            disabled={item.disabled}
            onClick={() => toggle(item.value)}
            className={cn(
              'inline-flex min-h-[36px] items-center gap-1.5 rounded-[var(--wdr-radius-md)] border px-3 py-1 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-45',
              active
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-border bg-surface text-foreground hover:bg-muted'
            )}
          >
            {active && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            {!active && item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span
                className={cn(
                  'rounded px-1.5 py-0.2 text-[10px] tabular-nums',
                  active ? 'bg-foreground/15 text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* QuantityStepper                                                            */
/* -------------------------------------------------------------------------- */

export interface QuantityStepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  label?: string;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export function QuantityStepper({
  value: controlled,
  defaultValue = 1,
  min = 0,
  max = 999,
  step = 1,
  onValueChange,
  label,
  unit,
  disabled = false,
  className,
}: QuantityStepperProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = Math.max(min, Math.min(max, controlled ?? internal));

  const commit = (next: number) => {
    const clamped = Math.max(min, Math.min(max, next));
    if (controlled === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  };

  return (
    <div className={cn('inline-flex flex-col gap-1.5', className)}>
      {label && <span className="text-xs font-medium text-foreground">{label}</span>}
      <div className="inline-flex items-center rounded-[var(--wdr-radius-md)] border border-border bg-surface">
        <button
          type="button"
          disabled={disabled || current <= min}
          aria-label={`Decrease ${label ?? 'value'}`}
          onClick={() => commit(current - step)}
          className="inline-flex h-9 w-9 items-center justify-center border-r border-border text-foreground hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <div
          role="spinbutton"
          aria-label={label ?? 'Quantity stepper'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
              e.preventDefault();
              commit(current + step);
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
              e.preventDefault();
              commit(current - step);
            }
          }}
          className="min-w-[56px] px-3 text-center font-mono text-sm font-semibold tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {current}
          {unit ? <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span> : null}
        </div>
        <button
          type="button"
          disabled={disabled || current >= max}
          aria-label={`Increase ${label ?? 'value'}`}
          onClick={() => commit(current + step)}
          className="inline-flex h-9 w-9 items-center justify-center border-l border-border text-foreground hover:bg-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
