import * as React from 'react';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: string;
  trend?: MetricTrend;
  trendPositive?: boolean;
  period?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export function MetricCard({
  label,
  value,
  delta,
  trend = 'neutral',
  trendPositive,
  period,
  icon,
  footer,
  className,
  ...props
}: MetricCardProps) {
  const isPositive = trendPositive ?? trend === 'up';
  const isNegative = trendPositive === false || (trendPositive === undefined && trend === 'down');

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className={cn('p-5', className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] bg-muted text-foreground"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
          {value}
        </div>

        {delta && (
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-[var(--wdr-radius-small,4px)] px-2 py-0.5 text-xs font-medium tabular-nums',
              trend === 'neutral'
                ? 'bg-muted text-muted-foreground'
                : isPositive
                  ? 'bg-success-subtle text-success-subtle-foreground'
                  : isNegative
                    ? 'bg-destructive-subtle text-destructive-subtle-foreground'
                    : 'bg-muted text-muted-foreground'
            )}
          >
            <TrendIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{delta}</span>
          </div>
        )}
      </div>

      {(period || footer) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {period && <span>{period}</span>}
          {footer && <span>{footer}</span>}
        </div>
      )}
    </Card>
  );
}
