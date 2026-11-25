import * as React from 'react';
import { cn } from '../../../utils/cn';
import type { ChartMarkerKind } from '../../../tokens/colors';

export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
  marker?: ChartMarkerKind;
  dashArray?: string;
  active?: boolean;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  onToggle?: (key: string) => void;
  interactive?: boolean;
  className?: string;
}

export function ChartLegend({
  items,
  onToggle,
  interactive = true,
  className,
}: ChartLegendProps) {
  if (items.length === 0) return null;

  return (
    <div
      role="group"
      aria-label="Chart series legend"
      className={cn('flex flex-wrap items-center gap-2 pt-2', className)}
    >
      {items.map((item) => {
        const isActive = item.active !== false;
        const swatchStyle: React.CSSProperties = {
          backgroundColor: item.color,
        };

        if (interactive && onToggle) {
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(item.key)}
              className={cn(
                'inline-flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border px-2.5 py-1 text-xs font-medium transition-opacity',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'border-border bg-surface text-foreground hover:bg-muted'
                  : 'border-dashed border-border bg-muted/40 text-muted-foreground opacity-60 line-through'
              )}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] border border-foreground/20"
                style={swatchStyle}
              />
              <span>{item.label}</span>
            </button>
          );
        }

        return (
          <div
            key={item.key}
            className="inline-flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border border-border bg-surface px-2 py-1 text-xs text-foreground"
          >
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-[2px] border border-foreground/20"
              style={swatchStyle}
            />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
