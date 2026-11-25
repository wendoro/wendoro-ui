import * as React from 'react';
import { AlertCircle, ArrowDownRight, ArrowUpRight, Calendar, HelpCircle, Minus, RotateCcw } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Select } from '../../ui/select';
import { Skeleton } from '../../ui/skeleton';

export type AnalyticsTrendDirection = 'positive' | 'negative' | 'neutral' | 'unavailable';

export interface TrendIndicatorProps {
  direction: AnalyticsTrendDirection;
  value?: string;
  label?: string;
  className?: string;
}

export function TrendIndicator({ direction, value, label, className }: TrendIndicatorProps) {
  const Icon =
    direction === 'positive'
      ? ArrowUpRight
      : direction === 'negative'
        ? ArrowDownRight
        : direction === 'unavailable'
          ? HelpCircle
          : Minus;

  const badgeStyles: Record<AnalyticsTrendDirection, string> = {
    positive: 'bg-success-subtle text-success-subtle-foreground',
    negative: 'bg-destructive-subtle text-destructive-subtle-foreground',
    neutral: 'bg-muted text-muted-foreground',
    unavailable: 'bg-muted text-muted-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[var(--wdr-radius-small,4px)] px-2 py-0.5 text-xs font-medium tabular-nums whitespace-nowrap',
        badgeStyles[direction],
        className
      )}
      aria-label={label ?? `${direction} trend${value ? `: ${value}` : ''}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{value ?? (direction === 'unavailable' ? 'Unavailable' : '0%')}</span>
    </span>
  );
}

export interface MetricComparisonProps {
  label: string;
  currentValue: string;
  previousValue: string;
  currentPeriodLabel?: string;
  previousPeriodLabel?: string;
  absoluteChange?: string;
  percentChange?: string;
  direction?: AnalyticsTrendDirection;
  className?: string;
}

export function MetricComparison({
  label,
  currentValue,
  previousValue,
  currentPeriodLabel = 'Current',
  previousPeriodLabel = 'Previous',
  absoluteChange,
  percentChange,
  direction = 'neutral',
  className,
}: MetricComparisonProps) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {(percentChange || direction === 'unavailable') && (
          <TrendIndicator direction={direction} value={percentChange} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 tabular-nums">
        <div>
          <div className="text-xs text-muted-foreground">{currentPeriodLabel}</div>
          <div className="mt-0.5 text-xl font-bold text-foreground">{currentValue}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{previousPeriodLabel}</div>
          <div className="mt-0.5 text-lg font-semibold text-muted-foreground">{previousValue}</div>
        </div>
      </div>
      {absoluteChange && (
        <div className="border-t border-border pt-2 text-xs text-muted-foreground tabular-nums">
          Net variance: <span className="font-medium text-foreground">{absoluteChange}</span>
        </div>
      )}
    </Card>
  );
}

export interface MiniChartCardProps {
  title: string;
  value: string;
  delta?: string;
  direction?: AnalyticsTrendDirection;
  chart: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function MiniChartCard({
  title,
  value,
  delta,
  direction = 'neutral',
  chart,
  subtitle,
  className,
}: MiniChartCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-foreground">{value}</div>
          {subtitle && <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        {delta && <TrendIndicator direction={direction} value={delta} />}
      </div>
      <div className="mt-4 flex items-center justify-end">{chart}</div>
    </Card>
  );
}

export interface AnalyticsSummaryItem {
  id: string;
  label: string;
  value: string;
  delta?: string;
  direction?: AnalyticsTrendDirection;
}

export interface AnalyticsSummaryCardProps {
  title: string;
  description?: string;
  items: AnalyticsSummaryItem[];
  loading?: boolean;
  error?: React.ReactNode;
  onRetry?: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export function AnalyticsSummaryCard({
  title,
  description,
  items,
  loading = false,
  error,
  onRetry,
  footer,
  className,
}: AnalyticsSummaryCardProps) {
  if (loading) {
    return (
      <Card className={cn('p-5 space-y-3', className)}>
        <Skeleton height={20} width="45%" />
        <Skeleton height={52} />
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        title={title}
        icon={<AlertCircle className="h-4 w-4 shrink-0" />}
        action={
          onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
              Retry
            </Button>
          ) : undefined
        }
        className={className}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="space-y-1 border-t border-border pt-3 sm:border-t-0 sm:border-l sm:pl-4 sm:pt-0 first:border-l-0 first:pl-0">
            <div className="text-xs text-muted-foreground">{item.label}</div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold tabular-nums text-foreground">{item.value}</span>
              {item.delta && (
                <TrendIndicator direction={item.direction ?? 'neutral'} value={item.delta} />
              )}
            </div>
          </div>
        ))}
      </div>
      {footer && <div className="border-t border-border pt-3 text-xs text-muted-foreground">{footer}</div>}
    </Card>
  );
}

export interface TargetVsActualProps {
  title: string;
  actualLabel: string;
  targetLabel: string;
  percentage: number;
  statusText?: string;
  variant?: 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function TargetVsActual({
  title,
  actualLabel,
  targetLabel,
  percentage,
  statusText,
  variant = 'primary',
  className,
}: TargetVsActualProps) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {statusText && <span className="text-xs font-medium text-muted-foreground">{statusText}</span>}
      </div>
      <div className="flex items-baseline justify-between gap-2 tabular-nums">
        <span className="text-xl font-bold text-foreground">{actualLabel}</span>
        <span className="text-xs text-muted-foreground">Target: {targetLabel}</span>
      </div>
      <Progress value={percentage} variant={variant} showValue label={title} />
    </Card>
  );
}

export function GoalProgress(props: TargetVsActualProps) {
  return <TargetVsActual {...props} />;
}

export interface PerformanceIndicatorProps {
  label: string;
  score: string;
  rating: 'optimal' | 'nominal' | 'warning' | 'critical' | 'unavailable';
  detail?: string;
  className?: string;
}

const RATING_CONFIG: Record<PerformanceIndicatorProps['rating'], { label: string; badgeClass: string }> = {
  optimal: { label: 'Optimal', badgeClass: 'bg-success-subtle text-success-subtle-foreground' },
  nominal: { label: 'On target', badgeClass: 'bg-primary-subtle text-primary-subtle-foreground' },
  warning: { label: 'Attention', badgeClass: 'bg-warning-subtle text-warning-subtle-foreground' },
  critical: { label: 'Critical', badgeClass: 'bg-destructive-subtle text-destructive-subtle-foreground' },
  unavailable: { label: 'Unavailable', badgeClass: 'bg-muted text-muted-foreground' },
};

export function PerformanceIndicator({
  label,
  score,
  rating,
  detail,
  className,
}: PerformanceIndicatorProps) {
  const cfg = RATING_CONFIG[rating];
  return (
    <div className={cn('flex items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5', className)}>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        {detail && <div className="text-xs text-muted-foreground">{detail}</div>}
      </div>
      <div className="flex items-center gap-2.5 shrink-0 tabular-nums">
        <span className="text-base font-bold text-foreground">{score}</span>
        <span className={cn('rounded-[var(--wdr-radius-small,4px)] px-2 py-0.5 text-xs font-medium', cfg.badgeClass)}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

export interface StatisticalSummaryItem {
  label: string;
  value: string;
}

export interface StatisticalSummaryProps {
  title?: string;
  stats: StatisticalSummaryItem[];
  className?: string;
}

export function StatisticalSummary({ title = 'Distribution summary', stats, className }: StatisticalSummaryProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-3 text-xs font-semibold text-muted-foreground">{title}</div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--wdr-radius-sm)] bg-muted/50 px-3 py-2">
            <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
            <dd className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

export interface DateRangeOption {
  value: string;
  label: string;
}

export interface DateRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: DateRangeOption[];
  'aria-label'?: string;
  className?: string;
}

const DEFAULT_RANGES: DateRangeOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
];

export function DateRangeSelector({
  value,
  onChange,
  options = DEFAULT_RANGES,
  'aria-label': ariaLabel = 'Select date range',
  className,
}: DateRangeSelectorProps) {
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <Select
        aria-label={ariaLabel}
        value={value}
        onValueChange={onChange}
        options={options}
        className="w-40"
      />
    </div>
  );
}

export interface ComparisonPeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: DateRangeOption[];
  className?: string;
}

const DEFAULT_COMPARE_OPTIONS: DateRangeOption[] = [
  { value: 'previous_period', label: 'vs. Previous period' },
  { value: 'previous_year', label: 'vs. Same period last year' },
  { value: 'none', label: 'No comparison' },
];

export function ComparisonPeriodSelector({
  value,
  onChange,
  options = DEFAULT_COMPARE_OPTIONS,
  className,
}: ComparisonPeriodSelectorProps) {
  return (
    <Select
      aria-label="Select comparison period"
      value={value}
      onValueChange={onChange}
      options={options}
      className={cn('w-48', className)}
    />
  );
}

export interface AnalyticsFilterToolbarProps {
  dateRange?: string;
  onDateRangeChange?: (val: string) => void;
  dateRangeOptions?: DateRangeOption[];
  comparisonPeriod?: string;
  onComparisonPeriodChange?: (val: string) => void;
  extraControls?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AnalyticsFilterToolbar({
  dateRange,
  onDateRangeChange,
  dateRangeOptions,
  comparisonPeriod,
  onComparisonPeriodChange,
  extraControls,
  actions,
  className,
}: AnalyticsFilterToolbarProps) {
  return (
    <div
      role="region"
      aria-label="Analytics filters"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-3.5',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        {dateRange !== undefined && onDateRangeChange && (
          <DateRangeSelector
            value={dateRange}
            onChange={onDateRangeChange}
            options={dateRangeOptions}
          />
        )}
        {comparisonPeriod !== undefined && onComparisonPeriodChange && (
          <ComparisonPeriodSelector
            value={comparisonPeriod}
            onChange={onComparisonPeriodChange}
          />
        )}
        {extraControls}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export interface MetricTrendCardProps {
  title: string;
  value: string;
  changeLabel: string;
  direction?: AnalyticsTrendDirection;
  period?: string;
  className?: string;
}

export function MetricTrendCard({
  title,
  value,
  changeLabel,
  direction = 'neutral',
  period,
  className,
}: MetricTrendCardProps) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <div className="flex items-baseline justify-between gap-2 tabular-nums">
        <span className="text-xl font-bold text-foreground">{value}</span>
        <TrendIndicator direction={direction} value={changeLabel} />
      </div>
      {period && <div className="text-xs text-muted-foreground">{period}</div>}
    </Card>
  );
}
