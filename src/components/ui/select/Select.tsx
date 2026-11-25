import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  size?: SelectSize;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  className?: string;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-11 px-3.5 text-base',
};

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue = '',
    onValueChange,
    placeholder = 'Select an option',
    disabled = false,
    error = false,
    size = 'md',
    id,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    'aria-required': ariaRequired,
    className,
  },
  forwardedRef
) {
  const triggerId = useStableId(id, 'wdr-select');
  const listboxId = `${triggerId}-listbox`;

  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const optionRefs = React.useRef<Array<HTMLLIElement | null>>([]);

  const setTriggerRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef]
  );

  const selectedOption = options.find((opt) => opt.value === currentValue);

  const selectIndex = React.useCallback(
    (index: number) => {
      const option = options[index];
      if (!option || option.disabled) return;
      if (value === undefined) {
        setInternalValue(option.value);
      }
      onValueChange?.(option.value);
      setOpen(false);
      triggerRef.current?.focus();
    },
    [onValueChange, options, value]
  );

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const handleOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  React.useEffect(() => {
    if (open && highlightedIndex >= 0) {
      const el = optionRefs.current[highlightedIndex];
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, open]);

  const findNextEnabledIndex = (start: number, direction: 1 | -1): number => {
    if (options.length === 0) return -1;
    let idx = start;
    for (let i = 0; i < options.length; i++) {
      idx = (idx + direction + options.length) % options.length;
      if (!options[idx].disabled) return idx;
    }
    return -1;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === currentValue && !o.disabled);
        setHighlightedIndex(currentIdx >= 0 ? currentIdx : findNextEnabledIndex(-1, 1));
      } else {
        setHighlightedIndex((prev) => findNextEnabledIndex(prev, 1));
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === currentValue && !o.disabled);
        setHighlightedIndex(currentIdx >= 0 ? currentIdx : findNextEnabledIndex(0, -1));
      } else {
        setHighlightedIndex((prev) => findNextEnabledIndex(prev < 0 ? 0 : prev, -1));
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        const currentIdx = options.findIndex((o) => o.value === currentValue && !o.disabled);
        setHighlightedIndex(currentIdx >= 0 ? currentIdx : findNextEnabledIndex(-1, 1));
      } else if (highlightedIndex >= 0) {
        selectIndex(highlightedIndex);
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      if (!open) setOpen(true);
      setHighlightedIndex(findNextEnabledIndex(-1, 1));
    } else if (event.key === 'End') {
      event.preventDefault();
      if (!open) setOpen(true);
      setHighlightedIndex(findNextEnabledIndex(0, -1));
    } else if (event.key === 'Escape') {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {name && <input type="hidden" name={name} value={currentValue} />}
      <button
        ref={setTriggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-invalid={error || undefined}
        aria-activedescendant={
          open && highlightedIndex >= 0 ? `${listboxId}-opt-${highlightedIndex}` : undefined
        }
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              const currentIdx = options.findIndex((o) => o.value === currentValue && !o.disabled);
              setHighlightedIndex(currentIdx >= 0 ? currentIdx : findNextEnabledIndex(-1, 1));
            }
            return next;
          });
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border bg-surface text-left text-foreground',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
          error ? 'border-destructive focus-visible:ring-destructive' : 'border-input hover:border-foreground/40',
          sizeClasses[size]
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={!ariaLabelledBy ? ariaLabel : undefined}
          aria-labelledby={ariaLabelledBy ?? (!ariaLabel ? triggerId : undefined)}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-auto rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1',
            'shadow-[var(--wdr-shadow-md)]'
          )}
        >
          {options.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">No options available</li>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === currentValue;
              const isHighlighted = index === highlightedIndex;
              return (
                <li
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  id={`${listboxId}-opt-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => {
                    if (!option.disabled) setHighlightedIndex(index);
                  }}
                  onClick={() => selectIndex(index)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2.5 py-2 text-sm select-none',
                    isHighlighted && 'bg-muted',
                    isSelected && 'font-medium text-foreground',
                    option.disabled && 'cursor-not-allowed opacity-45'
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate">{option.label}</div>
                    {option.description && (
                      <div className="truncate text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {isSelected && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground" />}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
});

Select.displayName = 'Select';
