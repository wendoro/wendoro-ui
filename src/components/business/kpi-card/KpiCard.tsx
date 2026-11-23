import * as React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';

export type KpiStatus = 'on_track' | 'at_risk' | 'off_track';

export interface KpiCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  actual: string | number;
  target: string | number;
  completion: number;
  status?: KpiStatus;
  period?: string;
}

const statusConfig: Record<
  KpiStatus,
  { label: string; icon: React.ReactNode; badgeClass: string; progressVariant: 'success' | 'warning' | 'destructive' }
> = {
  on_track: {
    label: 'On track',
    icon: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-success-subtle text-success-subtle-foreground',
    progressVariant: 'success',
  },
  at_risk: {
    label: 'At risk',
    icon: <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-warning-subtle text-warning-subtle-foreground',
    progressVariant: 'warning',
  },
  off_track: {
    label: 'Off track',
    icon: <XCircle className="h-3.5 w-3.5" aria-hidden="true" />,
    badgeClass: 'bg-destructive-subtle text-destructive-subtle-foreground',
    progressVariant: 'destructive',
  },
};

export function KpiCard({
  title,
  actual,
  target,
  completion,
  status = 'on_track',
  period,
  className,
  ...props
}: KpiCardProps) {
  const cfg = statusConfig[status];

  return (
    <Card className={cn('p-5', className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {period && <p className="mt-0.5 text-xs text-muted-foreground">{period}</p>}
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-small,4px)] px-2 py-0.5 text-xs font-medium whitespace-nowrap',
            cfg.badgeClass
          )}
        >
          {cfg.icon}
          <span>{cfg.label}</span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-2 tabular-nums">
        <span className="text-2xl font-bold text-foreground">{actual}</span>
        <span className="text-xs text-muted-foreground">/ {target} target</span>
      </div>

      <div className="mt-3">
        <Progress value={completion} variant={cfg.progressVariant} size="sm" showValue label="Target attainment" />
      </div>
    </Card>
  );
}
