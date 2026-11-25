import * as React from 'react';
import { AlertTriangle, Flame, Minus, ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';

/* -------------------------------------------------------------------------- */
/* PriorityIndicator                                                          */
/* -------------------------------------------------------------------------- */

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

const PRIORITY_STYLES: Record<PriorityLevel, { label: string; classes: string; icon: React.ReactNode }> = {
  low: {
    label: 'Low',
    classes: 'bg-muted text-muted-foreground border-border',
    icon: <ArrowDown className="h-3 w-3" aria-hidden="true" />,
  },
  medium: {
    label: 'Medium',
    classes: 'bg-primary-subtle text-primary-subtle-foreground border-primary/40',
    icon: <Minus className="h-3 w-3" aria-hidden="true" />,
  },
  high: {
    label: 'High',
    classes: 'bg-warning-subtle text-warning-subtle-foreground border-warning/40',
    icon: <ArrowUp className="h-3 w-3" aria-hidden="true" />,
  },
  urgent: {
    label: 'Urgent',
    classes: 'bg-destructive-subtle text-destructive-subtle-foreground border-destructive/40',
    icon: <Flame className="h-3 w-3" aria-hidden="true" />,
  },
};

export function PriorityIndicator({
  priority,
  label,
  className,
}: {
  priority: PriorityLevel;
  label?: string;
  className?: string;
}) {
  const cfg = PRIORITY_STYLES[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--wdr-radius-sm)] border px-2 py-0.5 text-xs font-semibold',
        cfg.classes,
        className
      )}
    >
      {cfg.icon}
      <span>{label ?? cfg.label}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* WorkloadIndicator                                                          */
/* -------------------------------------------------------------------------- */

export function WorkloadIndicator({
  utilizationPercent,
  label,
  allocatedHours,
  capacityHours,
  className,
}: {
  utilizationPercent: number;
  label?: string;
  allocatedHours?: number;
  capacityHours?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.round(utilizationPercent));
  const variant =
    pct > 100 ? 'destructive' : pct >= 85 ? 'warning' : pct >= 50 ? 'success' : 'primary';
  const statusLabel =
    pct > 100 ? 'Overallocated' : pct >= 85 ? 'Near capacity' : pct >= 40 ? 'Balanced' : 'Available';

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
        <span className="font-medium text-foreground">{label ?? statusLabel}</span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          {pct > 100 && <AlertTriangle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />}
          {allocatedHours !== undefined && capacityHours !== undefined
            ? `${allocatedHours}h / ${capacityHours}h (${pct}%)`
            : `${pct}%`}
        </span>
      </div>
      <Progress value={Math.min(100, pct)} variant={variant} size="sm" label={label ?? 'Workload'} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ResourceAllocationBoard                                                    */
/* -------------------------------------------------------------------------- */

export interface ResourceAllocationRow {
  id: string;
  name: string;
  role: string;
  capacityHours: number;
  allocations: Record<string, number>; // period -> hours
}

export interface ResourceAllocationBoardProps {
  title?: string;
  periods: string[];
  resources: ResourceAllocationRow[];
  onAllocationChange?: (resourceId: string, period: string, hours: number) => void;
  className?: string;
}

export function ResourceAllocationBoard({
  title = 'Resource capacity & allocation',
  periods,
  resources,
  onAllocationChange,
  className,
}: ResourceAllocationBoardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-border px-5 py-3.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">
          Monitor utilization across sprints or weeks and adjust hour commitments.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground">
              <th className="min-w-[180px] px-4 py-2.5 font-semibold">Resource</th>
              {periods.map((p) => (
                <th key={p} className="min-w-[110px] px-3 py-2.5 font-semibold text-center tabular-nums">
                  {p}
                </th>
              ))}
              <th className="min-w-[180px] px-4 py-2.5 font-semibold">Average Utilization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {resources.map((res) => {
              const totalAlloc = periods.reduce((sum, p) => sum + (res.allocations[p] ?? 0), 0);
              const totalCap = Math.max(1, res.capacityHours * periods.length);
              const avgPct = Math.round((totalAlloc / totalCap) * 100);

              return (
                <tr key={res.id} className="hover:bg-muted/25">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{res.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {res.role} · {res.capacityHours}h/wk
                    </div>
                  </td>
                  {periods.map((p) => {
                    const hrs = res.allocations[p] ?? 0;
                    const pct = Math.round((hrs / Math.max(1, res.capacityHours)) * 100);
                    return (
                      <td key={p} className="px-3 py-2.5 text-center tabular-nums">
                        {onAllocationChange ? (
                          <input
                            type="number"
                            min={0}
                            max={res.capacityHours * 2}
                            aria-label={`${res.name} hours for ${p}`}
                            value={hrs}
                            onChange={(e) => {
                              const next = Number(e.target.value);
                              if (Number.isFinite(next) && next >= 0) {
                                onAllocationChange(res.id, p, next);
                              }
                            }}
                            className={cn(
                              'h-8 w-16 rounded border px-1.5 text-center text-xs font-semibold tabular-nums',
                              pct > 100
                                ? 'border-destructive bg-destructive-subtle text-destructive-subtle-foreground'
                                : 'border-input bg-surface text-foreground'
                            )}
                          />
                        ) : (
                          <span
                            className={cn(
                              'inline-block rounded px-2 py-1 font-semibold',
                              pct > 100
                                ? 'bg-destructive-subtle text-destructive-subtle-foreground'
                                : pct >= 85
                                  ? 'bg-warning-subtle text-warning-subtle-foreground'
                                  : 'bg-muted text-foreground'
                            )}
                          >
                            {hrs}h ({pct}%)
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3">
                    <WorkloadIndicator
                      utilizationPercent={avgPct}
                      allocatedHours={totalAlloc}
                      capacityHours={totalCap}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
