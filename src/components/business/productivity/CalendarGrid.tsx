import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

export type CalendarGridView = 'month' | 'week' | 'day';

export interface CalendarGridEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  timeLabel?: string;
  tone?: 'default' | 'primary' | 'warning' | 'destructive' | 'success';
}

export interface CalendarGridProps {
  events?: CalendarGridEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onSelectEvent?: (event: CalendarGridEvent) => void;
  defaultView?: CalendarGridView;
  className?: string;
}

function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENT_TONE_CLASSES: Record<NonNullable<CalendarGridEvent['tone']>, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary-subtle text-primary-subtle-foreground',
  success: 'bg-success-subtle text-success-subtle-foreground',
  warning: 'bg-warning-subtle text-warning-subtle-foreground',
  destructive: 'bg-destructive-subtle text-destructive-subtle-foreground',
};

export function CalendarGrid({
  events = [],
  selectedDate,
  onSelectDate,
  onSelectEvent,
  defaultView = 'month',
  className,
}: CalendarGridProps) {
  const [view, setView] = React.useState<CalendarGridView>(defaultView);
  const [cursor, setCursor] = React.useState<Date>(() => selectedDate ?? new Date(2026, 10, 1));
  const [internalSelected, setInternalSelected] = React.useState<Date>(() => selectedDate ?? new Date(2026, 10, 1));

  const activeSelected = selectedDate ?? internalSelected;

  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarGridEvent[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [events]);

  const navigate = (dir: -1 | 1) => {
    setCursor((prev) => {
      if (view === 'month') return new Date(prev.getFullYear(), prev.getMonth() + dir, 1);
      if (view === 'week') return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + dir * 7);
      return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + dir);
    });
  };

  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const monthDays = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const leadingEmpty = monthStart.getDay();

  const monthCells: Array<Date | null> = [];
  for (let i = 0; i < leadingEmpty; i++) monthCells.push(null);
  for (let d = 1; d <= monthDays; d++) monthCells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));

  const weekStart = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - cursor.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i));

  const selectDay = (d: Date) => {
    if (!selectedDate) setInternalSelected(d);
    setCursor(d);
    onSelectDate?.(d);
  };

  const selectedIso = toIsoDate(activeSelected);
  const selectedDayEvents = eventsByDate.get(selectedIso) ?? [];

  return (
    <Card className={cn('p-4 space-y-4', className)} aria-label="Schedule calendar grid">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" aria-label="Previous period" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <h3 className="min-w-[150px] text-center text-sm font-semibold text-foreground tabular-nums">
            {cursor.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
              ...(view === 'day' ? { day: 'numeric' } : {}),
            })}
          </h3>
          <Button variant="outline" size="sm" aria-label="Next period" onClick={() => navigate(1)}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div role="group" aria-label="Calendar view mode" className="inline-flex rounded-[var(--wdr-radius-md)] border border-border bg-muted p-0.5">
          {(
            [
              { id: 'month', label: 'Month' },
              { id: 'week', label: 'Week' },
              { id: 'day', label: 'Day' },
            ] as const
          ).map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => setView(v.id)}
              className={cn(
                'rounded-[var(--wdr-radius-small,4px)] px-2.5 py-1 text-xs font-medium',
                view === v.id ? 'bg-surface text-foreground shadow-[var(--wdr-shadow-sm)]' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'month' && (
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_NAMES.map((wd) => (
            <div key={wd} className="py-1 text-center text-[11px] font-semibold text-muted-foreground">
              {wd}
            </div>
          ))}
          {monthCells.map((date, idx) => {
            if (!date) return <div key={`e-${idx}`} className="min-h-[68px]" aria-hidden="true" />;
            const iso = toIsoDate(date);
            const dayEvents = eventsByDate.get(iso) ?? [];
            const isSelected = iso === selectedIso;

            return (
              <div
                key={iso}
                className={cn(
                  'min-h-[68px] rounded-[var(--wdr-radius-sm)] border p-1.5',
                  isSelected ? 'border-foreground bg-primary-subtle/50' : 'border-border bg-surface'
                )}
              >
                <button
                  type="button"
                  aria-label={`${date.toDateString()}, ${dayEvents.length} events`}
                  aria-pressed={isSelected}
                  onClick={() => selectDay(date)}
                  className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded text-xs font-semibold tabular-nums text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {date.getDate()}
                </button>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelectEvent?.(ev)}
                      className={cn(
                        'block w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium',
                        EVENT_TONE_CLASSES[ev.tone ?? 'default']
                      )}
                    >
                      {ev.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'week' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
          {weekDays.map((d) => {
            const iso = toIsoDate(d);
            const dayEvents = eventsByDate.get(iso) ?? [];
            const isSelected = iso === selectedIso;
            return (
              <div
                key={iso}
                className={cn(
                  'rounded-[var(--wdr-radius-md)] border p-2.5 space-y-2',
                  isSelected ? 'border-foreground bg-primary-subtle/40' : 'border-border bg-surface'
                )}
              >
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectDay(d)}
                  className="w-full text-left text-xs font-semibold text-foreground"
                >
                  {WEEKDAY_NAMES[d.getDay()]} {d.getDate()}
                </button>
                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelectEvent?.(ev)}
                      className={cn(
                        'block w-full rounded px-1.5 py-1 text-left text-xs font-medium',
                        EVENT_TONE_CLASSES[ev.tone ?? 'default']
                      )}
                    >
                      {ev.timeLabel ? `${ev.timeLabel} · ` : ''}
                      {ev.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'day' && (
        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground">
            Events on {selectedIso} ({selectedDayEvents.length})
          </div>
          {selectedDayEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scheduled events for this day.</p>
          ) : (
            <ul className="space-y-2">
              {selectedDayEvents.map((ev) => (
                <li key={ev.id}>
                  <button
                    type="button"
                    onClick={() => onSelectEvent?.(ev)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-3 py-2 text-left text-sm font-medium',
                      EVENT_TONE_CLASSES[ev.tone ?? 'default']
                    )}
                  >
                    <span>{ev.title}</span>
                    {ev.timeLabel && <span className="font-mono text-xs">{ev.timeLabel}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
