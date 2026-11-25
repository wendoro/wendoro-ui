import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Calendar } from '../calendar';
import { Popover } from '../popover';

export interface DatePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  id?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  className?: string;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  clearable = true,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-required': ariaRequired,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className={cn('inline-flex max-w-full items-center gap-1.5', className)}>
      <Popover
        open={disabled ? false : open}
        onOpenChange={setOpen}
        aria-label={ariaLabel ?? placeholder}
        className="p-0 border-0 shadow-none bg-transparent"
        trigger={
          <button
            ref={triggerRef}
            id={id}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel ?? placeholder}
            aria-describedby={ariaDescribedBy}
            aria-required={ariaRequired}
            className={cn(
              'flex h-10 w-full sm:min-w-[220px] items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground',
              'hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted'
            )}
          >
            <span className={cn('truncate tabular-nums', !value && 'text-muted-foreground')}>
              {value ? formatDate(value) : placeholder}
            </span>
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        }
      >
        <Calendar
          selected={value}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={(date) => {
            onValueChange?.(date);
            setOpen(false);
            if (typeof window !== 'undefined') {
              window.setTimeout(() => {
                if (triggerRef.current?.isConnected) {
                  triggerRef.current.focus();
                }
              }, 0);
            }
          }}
        />
      </Popover>

      {clearable && value && !disabled && (
        <button
          type="button"
          aria-label="Clear selected date"
          onClick={() => onValueChange?.(undefined)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
