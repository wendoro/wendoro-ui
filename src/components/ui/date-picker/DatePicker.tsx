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
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <Popover
        open={disabled ? false : open}
        onOpenChange={setOpen}
        className="p-0 border-0 shadow-none bg-transparent"
        trigger={
          <button
            id={id}
            type="button"
            disabled={disabled}
            aria-label={ariaLabel ?? placeholder}
            className={cn(
              'flex h-10 min-w-[220px] items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground',
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
          }}
        />
      </Popover>

      {clearable && value && !disabled && (
        <button
          type="button"
          aria-label="Clear selected date"
          onClick={() => onValueChange?.(undefined)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
