import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  className?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function isSameDay(a?: Date, b?: Date): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  month: controlledMonth,
  onMonthChange,
  className,
}: CalendarProps) {
  const today = React.useMemo(() => new Date(), []);
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    () => selected ?? controlledMonth ?? new Date()
  );

  const viewDate = controlledMonth ?? internalMonth;
  const year = viewDate.getFullYear();
  const monthIdx = viewDate.getMonth();

  const setViewDate = (next: Date) => {
    if (!controlledMonth) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const firstDayOfMonth = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIdx, d));

  const isDisabled = (date: Date): boolean => {
    const normalized = startOfDay(date).getTime();
    if (minDate && normalized < startOfDay(minDate).getTime()) return true;
    if (maxDate && normalized > startOfDay(maxDate).getTime()) return true;
    return false;
  };

  const gridRef = React.useRef<HTMLDivElement>(null);

  const handleDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, dayNumber: number) => {
    const deltaMap: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const delta = deltaMap[event.key];
    if (!delta || !gridRef.current) return;

    const targetDay = dayNumber + delta;
    const buttons = Array.from(
      gridRef.current.querySelectorAll<HTMLButtonElement>('button[data-day]:not([disabled])')
    );
    const nextBtn = buttons.find((b) => Number(b.dataset.day) === targetDay);
    if (nextBtn) {
      event.preventDefault();
      nextBtn.focus();
    }
  };

  return (
    <div
      role="region"
      aria-label={`Calendar, ${MONTHS[monthIdx]} ${year}`}
      className={cn(
        'w-72 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-3.5 text-foreground',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewDate(new Date(year, monthIdx - 1, 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-md)] border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div aria-live="polite" className="text-sm font-semibold tabular-nums">
          {MONTHS[monthIdx]} {year}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewDate(new Date(year, monthIdx + 1, 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-md)] border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div ref={gridRef} className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-1 text-[11px] font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} aria-hidden="true" />;
          }
          const disabled = isDisabled(date);
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          const dayNum = date.getDate();

          return (
            <button
              key={date.toISOString()}
              type="button"
              data-day={dayNum}
              disabled={disabled}
              aria-label={date.toDateString()}
              aria-pressed={isSelected}
              onClick={() => onSelect?.(date)}
              onKeyDown={(e) => handleDayKeyDown(e, dayNum)}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-md)] text-xs font-medium tabular-nums transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-35',
                isSelected
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : isToday
                    ? 'border border-foreground/40 bg-muted text-foreground'
                    : 'text-foreground hover:bg-muted'
              )}
            >
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
