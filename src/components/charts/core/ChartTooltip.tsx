import { cn } from '../../../utils/cn';

export interface ChartTooltipRow {
  key: string;
  label: string;
  value: string;
  color: string;
}

export interface ChartTooltipProps {
  title?: string;
  rows: ChartTooltipRow[];
  visible?: boolean;
  className?: string;
}

export function ChartTooltip({
  title,
  rows,
  visible = true,
  className,
}: ChartTooltipProps) {
  if (!visible || rows.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-[var(--wdr-radius-md)] border border-[var(--wdr-chart-tooltip-border)] bg-[var(--wdr-chart-tooltip-bg)] px-3 py-2 text-xs text-[var(--wdr-chart-tooltip-fg)] shadow-[var(--wdr-shadow-md)]',
        className
      )}
    >
      {title && <div className="mb-1.5 font-semibold leading-tight">{title}</div>}
      <dl className="space-y-1">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-1.5 opacity-90">
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: row.color }}
              />
              <span>{row.label}</span>
            </dt>
            <dd className="font-mono font-medium tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
