import * as React from 'react';
import { AlertCircle, BarChart3, RotateCcw, Table as TableIcon } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';
import { Alert } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { EmptyState } from '../../ui/empty-state';
import { Skeleton } from '../../ui/skeleton';
import { ChartLegend, type ChartLegendItem } from './ChartLegend';
import type { ChartStateProps, ChartTableColumn } from './types';

export interface ChartContainerProps extends ChartStateProps {
  title?: string;
  subtitle?: string;
  description?: string;
  summary?: string;
  legendItems?: ChartLegendItem[];
  onLegendToggle?: (key: string) => void;
  tableColumns?: ChartTableColumn[];
  tableRows?: Array<Record<string, string>>;
  showTableToggle?: boolean;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tooltipContent?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  minHeight?: number;
  children: (width: number) => React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  description,
  summary,
  loading = false,
  error = false,
  errorTitle = 'Unable to load chart',
  onRetry,
  empty = false,
  emptyTitle = 'No data available',
  emptyDescription = 'Adjust filters or date range to populate this visualization.',
  legendItems,
  onLegendToggle,
  tableColumns,
  tableRows,
  showTableToggle = true,
  actions,
  footer,
  tooltipContent,
  'aria-label': ariaLabel,
  className,
  minHeight = 240,
  children,
}: ChartContainerProps) {
  const titleId = useStableId(undefined, 'wdr-chart-title');
  const descId = useStableId(undefined, 'wdr-chart-desc');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [measuredWidth, setMeasuredWidth] = React.useState(640);
  const [showTableView, setShowTableView] = React.useState(false);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;

    const updateWidth = () => {
      const next = Math.round(el.getBoundingClientRect().width);
      if (next > 0) setMeasuredWidth(next);
    };

    updateWidth();
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.round(entry.contentRect.width);
        if (w > 0) setMeasuredWidth(w);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hasTableAlternative = Boolean(showTableToggle && tableColumns?.length && tableRows?.length);

  return (
    <Card className={cn('overflow-hidden p-5', className)}>
      {(title || subtitle || actions || hasTableAlternative) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            {title && (
              <h3 id={titleId} className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {actions}
            {hasTableAlternative && (
              <Button
                variant="outline"
                size="sm"
                aria-pressed={showTableView}
                onClick={() => setShowTableView((prev) => !prev)}
                leftIcon={
                  showTableView ? (
                    <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <TableIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  )
                }
              >
                {showTableView ? 'Chart view' : 'Data table'}
              </Button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div role="status" aria-label="Loading chart data" className="space-y-3" style={{ minHeight }}>
          <Skeleton height={minHeight - 36} className="w-full" />
          <div className="flex gap-2">
            <Skeleton height={20} width={88} />
            <Skeleton height={20} width={88} />
          </div>
        </div>
      ) : error ? (
        <Alert
          variant="destructive"
          title={errorTitle}
          icon={<AlertCircle className="h-4 w-4 shrink-0" />}
          action={
            onRetry ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              >
                Retry
              </Button>
            ) : undefined
          }
        >
          {typeof error === 'boolean' ? 'An unexpected error occurred while rendering chart data.' : error}
        </Alert>
      ) : empty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <figure
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description || summary ? descId : undefined}
          aria-label={!title ? ariaLabel : undefined}
          className="m-0 space-y-3"
        >
          {(description || summary) && (
            <figcaption id={descId} className="sr-only">
              {[description, summary].filter(Boolean).join(' ')}
            </figcaption>
          )}

          {showTableView && tableColumns && tableRows ? (
            <div className="max-h-72 overflow-auto rounded-[var(--wdr-radius-md)] border border-border">
              <table className="w-full border-collapse text-left text-xs">
                <thead className="sticky top-0 bg-muted text-muted-foreground">
                  <tr>
                    {tableColumns.map((col) => (
                      <th key={col.key} scope="col" className="border-b border-border px-3 py-2 font-semibold">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                      {tableColumns.map((col) => (
                        <td key={col.key} className="px-3 py-2 tabular-nums text-foreground">
                          {row[col.key] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div ref={containerRef} className="relative w-full min-w-0">
              {children(Math.max(240, measuredWidth))}
              {tooltipContent && (
                <div className="mt-2 flex justify-end">{tooltipContent}</div>
              )}
            </div>
          )}

          {legendItems && legendItems.length > 0 && !showTableView && (
            <ChartLegend
              items={legendItems}
              onToggle={onLegendToggle}
              interactive={Boolean(onLegendToggle)}
            />
          )}
        </figure>
      )}

      {footer && <div className="mt-3 border-t border-border pt-2.5 text-xs text-muted-foreground">{footer}</div>}
    </Card>
  );
}
