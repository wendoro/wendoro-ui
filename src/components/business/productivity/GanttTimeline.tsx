import * as React from 'react';
import { Diamond, Link2 } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';

export interface GanttTaskItem {
  id: string;
  title: string;
  owner?: string;
  startSlot: number; // 0-indexed slot across periods
  durationSlots: number;
  progress?: number; // 0..100
  status?: 'on_track' | 'at_risk' | 'completed' | 'blocked';
  milestone?: boolean;
  dependencies?: string[];
}

export interface GanttChartProps {
  title?: string;
  periods: string[];
  tasks: GanttTaskItem[];
  onSelectTask?: (task: GanttTaskItem) => void;
  className?: string;
}

const STATUS_BAR_CLASSES: Record<NonNullable<GanttTaskItem['status']>, string> = {
  on_track: 'bg-primary text-primary-foreground border-primary-active',
  completed: 'bg-success text-success-foreground border-success',
  at_risk: 'bg-warning text-warning-foreground border-warning',
  blocked: 'bg-destructive text-destructive-foreground border-destructive',
};

export function GanttChart({
  title = 'Project delivery timeline',
  periods,
  tasks,
  onSelectTask,
  className,
}: GanttChartProps) {
  const [ownerFilter, setOwnerFilter] = React.useState('all');
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null);

  const owners = React.useMemo(
    () => Array.from(new Set(tasks.map((t) => t.owner).filter((o): o is string => Boolean(o)))),
    [tasks]
  );

  const visibleTasks = React.useMemo(
    () => (ownerFilter === 'all' ? tasks : tasks.filter((t) => t.owner === ownerFilter)),
    [ownerFilter, tasks]
  );

  const taskMap = React.useMemo(() => new Map(tasks.map((t) => [t.id, t])), [tasks]);
  const slotCount = Math.max(1, periods.length);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">
            Interactive schedule bars, progress tracking, milestones, and task dependencies
          </p>
        </div>
        {owners.length > 0 && (
          <select
            aria-label="Filter timeline by owner"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-8 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
          >
            <option value="all">All assignees</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[680px]">
          {/* Header Row */}
          <div className="grid grid-cols-12 border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground">
            <div className="col-span-4 border-r border-border px-4 py-2.5">Task / Deliverable</div>
            <div
              className="col-span-8 grid"
              style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}
            >
              {periods.map((p) => (
                <div key={p} className="border-r border-border last:border-r-0 px-2 py-2.5 text-center tabular-nums">
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Task Rows */}
          <div className="divide-y divide-border">
            {visibleTasks.map((task) => {
              const clampedStart = Math.max(0, Math.min(slotCount - 1, task.startSlot));
              const clampedSpan = Math.max(1, Math.min(slotCount - clampedStart, task.durationSlots));
              const leftPct = (clampedStart / slotCount) * 100;
              const widthPct = (clampedSpan / slotCount) * 100;
              const isSelected = selectedTaskId === task.id;
              const depNames = (task.dependencies ?? [])
                .map((id) => taskMap.get(id)?.title)
                .filter(Boolean);

              return (
                <div
                  key={task.id}
                  className={cn(
                    'grid grid-cols-12 items-center transition-colors',
                    isSelected ? 'bg-primary-subtle/30' : 'hover:bg-muted/30'
                  )}
                >
                  <div className="col-span-4 border-r border-border px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        onSelectTask?.(task);
                      }}
                      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        {task.milestone && <Diamond className="h-3.5 w-3.5 shrink-0 text-primary-active" aria-hidden="true" />}
                        <span className="truncate">{task.title}</span>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {task.owner && <span>{task.owner}</span>}
                        {depNames.length > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Link2 className="h-3 w-3" aria-hidden="true" />
                            <span>Depends on: {depNames.join(', ')}</span>
                          </span>
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="col-span-8 relative h-12 px-1">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 grid pointer-events-none"
                      style={{ gridTemplateColumns: `repeat(${slotCount}, minmax(0, 1fr))` }}
                    >
                      {periods.map((p) => (
                        <div key={p} className="border-r border-border/50 last:border-r-0" />
                      ))}
                    </div>

                    <button
                      type="button"
                      aria-label={`${task.title}, starts ${periods[clampedStart]}, ${task.progress ?? 0}% complete`}
                      onClick={() => {
                        setSelectedTaskId(task.id);
                        onSelectTask?.(task);
                      }}
                      style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      className={cn(
                        'absolute top-2.5 flex h-7 items-center justify-between overflow-hidden rounded-[var(--wdr-radius-sm)] border px-2 text-[11px] font-semibold tabular-nums shadow-[var(--wdr-shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        STATUS_BAR_CLASSES[task.status ?? 'on_track']
                      )}
                    >
                      <span className="truncate">{task.milestone ? 'Milestone' : `${task.progress ?? 0}%`}</span>
                      {!task.milestone && task.progress !== undefined && (
                        <span
                          aria-hidden="true"
                          style={{ width: `${Math.min(100, Math.max(0, task.progress))}%` }}
                          className="absolute bottom-0 left-0 h-1 bg-foreground/30"
                        />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
