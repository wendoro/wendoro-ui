import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';

/* -------------------------------------------------------------------------- */
/* DataComparisonTable (Plans / Vendors / Records Side-by-Side)               */
/* -------------------------------------------------------------------------- */

export interface ComparisonSubject {
  id: string;
  title: string;
  subtitle?: string;
  priceLabel?: string;
  recommended?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ComparisonAttributeRow {
  id: string;
  label: string;
  group?: string;
  values: Record<string, string | boolean | number>;
}

export interface DataComparisonTableProps {
  subjects: ComparisonSubject[];
  rows: ComparisonAttributeRow[];
  highlightDifferences?: boolean;
  className?: string;
}

export function DataComparisonTable({
  subjects,
  rows,
  highlightDifferences: initialDiff = false,
  className,
}: DataComparisonTableProps) {
  const [onlyDifferences, setOnlyDifferences] = React.useState(initialDiff);

  const displayedRows = React.useMemo(() => {
    if (!onlyDifferences) return rows;
    return rows.filter((row) => {
      const vals = subjects.map((s) => String(row.values[s.id] ?? ''));
      return new Set(vals).size > 1;
    });
  }, [onlyDifferences, rows, subjects]);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div className="text-sm font-semibold text-foreground">Side-by-side comparison</div>
        <div className="flex items-center gap-2 text-xs">
          <Switch
            aria-label="Show differences only"
            checked={onlyDifferences}
            onCheckedChange={setOnlyDifferences}
          />
          <span className="text-muted-foreground">Differences only</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="min-w-[180px] p-4 text-xs font-semibold text-muted-foreground">Feature / Metric</th>
              {subjects.map((sub) => (
                <th
                  key={sub.id}
                  className={cn(
                    'min-w-[170px] p-4 align-top',
                    sub.recommended && 'bg-primary-subtle/50'
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{sub.title}</span>
                      {sub.recommended && (
                        <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                          Recommended
                        </span>
                      )}
                    </div>
                    {sub.subtitle && <div className="text-xs font-normal text-muted-foreground">{sub.subtitle}</div>}
                    {sub.priceLabel && <div className="pt-1 text-base font-bold tabular-nums text-foreground">{sub.priceLabel}</div>}
                    {sub.onAction && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          variant={sub.recommended ? 'primary' : 'outline'}
                          onClick={sub.onAction}
                        >
                          {sub.actionLabel ?? 'Select'}
                        </Button>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayedRows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/30">
                <th scope="row" className="px-4 py-3 text-xs font-medium text-foreground">
                  <div>{row.label}</div>
                  {row.group && <div className="text-[11px] font-normal text-muted-foreground">{row.group}</div>}
                </th>
                {subjects.map((sub) => {
                  const val = row.values[sub.id];
                  return (
                    <td
                      key={sub.id}
                      className={cn(
                        'px-4 py-3 text-xs tabular-nums text-foreground',
                        sub.recommended && 'bg-primary-subtle/20'
                      )}
                    >
                      {typeof val === 'boolean' ? (
                        val ? (
                          <span className="inline-flex items-center gap-1 font-medium text-success">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Included</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>—</span>
                          </span>
                        )
                      ) : (
                        <span>{val ?? '—'}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* DetailPanel (Structured Entity Metadata & Actions)                         */
/* -------------------------------------------------------------------------- */

export interface DetailMetadataField {
  label: string;
  value: React.ReactNode;
}

export interface DetailPanelProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: React.ReactNode;
  metadata: DetailMetadataField[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function DetailPanel({
  title,
  subtitle,
  status,
  metadata,
  actions,
  children,
  className,
}: DetailPanelProps) {
  return (
    <Card className={cn('p-5 space-y-5', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {status}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metadata.map((m) => (
          <div key={m.label} className="rounded-[var(--wdr-radius-md)] border border-border bg-muted/30 px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted-foreground">{m.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>

      {children && <div className="border-t border-border pt-4">{children}</div>}
    </Card>
  );
}
