import * as React from 'react';
import { cn } from '../../../utils/cn';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { ChartMarkerShape, getSeriesColor, getSeriesDash, getSeriesMarker } from '../core/patterns';
import {
  buildAreaPath,
  buildLinePath,
  computeNiceDomain,
  generateLinearTicks,
  scaleLinear,
} from '../core/scales';
import type { BaseChartProps, ChartFormatterConfig } from '../core/types';

export interface ScatterPoint {
  id: string;
  label?: string;
  x: number;
  y: number;
  size?: number;
  series?: string;
}

export interface ScatterChartProps extends BaseChartProps {
  data: ScatterPoint[];
  xLabel?: string;
  yLabel?: string;
  xFormatter?: ChartFormatterConfig;
  bubbleMode?: boolean;
  onPointSelect?: (point: ScatterPoint) => void;
}

export function ScatterChart({
  data,
  xLabel = 'X',
  yLabel = 'Y',
  xFormatter,
  valueFormatter,
  bubbleMode = false,
  title,
  subtitle,
  description,
  height = 260,
  showLegend = true,
  showGrid = true,
  showTableToggle = true,
  loading,
  error,
  onRetry,
  empty,
  className,
  onPointSelect,
}: ScatterChartProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const seriesNames = React.useMemo(
    () => Array.from(new Set(data.map((d) => d.series ?? 'Primary'))),
    [data]
  );

  const tableColumns = [
    { key: 'label', label: 'Point' },
    { key: 'series', label: 'Series' },
    { key: 'x', label: xLabel },
    { key: 'y', label: yLabel },
    ...(bubbleMode ? [{ key: 'size', label: 'Magnitude' }] : []),
  ];
  const tableRows = data.map((p) => ({
    label: p.label ?? p.id,
    series: p.series ?? 'Primary',
    x: formatChartValue(p.x, xFormatter),
    y: formatChartValue(p.y, valueFormatter),
    ...(bubbleMode ? { size: formatChartValue(p.size ?? 1, valueFormatter) } : {}),
  }));

  const activePoint = data.find((d) => d.id === activeId);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? data.length === 0}
      legendItems={
        showLegend && seriesNames.length > 1
          ? seriesNames.map((name, i) => ({
              key: name,
              label: name,
              color: getSeriesColor(i),
              marker: getSeriesMarker(i),
            }))
          : undefined
      }
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activePoint ? (
          <ChartTooltip
            title={activePoint.label ?? activePoint.id}
            rows={[
              {
                key: 'x',
                label: xLabel,
                value: formatChartValue(activePoint.x, xFormatter),
                color: getSeriesColor(seriesNames.indexOf(activePoint.series ?? 'Primary')),
              },
              {
                key: 'y',
                label: yLabel,
                value: formatChartValue(activePoint.y, valueFormatter),
                color: getSeriesColor(seriesNames.indexOf(activePoint.series ?? 'Primary')),
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 24, bottom: 36, left: 54 };
        const plotWidth = Math.max(90, svgWidth - margin.left - margin.right);
        const plotHeight = Math.max(120, height - margin.top - margin.bottom);

        const xDomain = computeNiceDomain(data.map((d) => d.x), { includeZero: false });
        const yDomain = computeNiceDomain(data.map((d) => d.y), { includeZero: false });
        const sizes = data.map((d) => d.size ?? 10);
        const maxS = Math.max(1, ...sizes);

        const xTicks = generateLinearTicks(xDomain, 5);
        const yTicks = generateLinearTicks(yDomain, 5);

        return (
          <svg
            role="img"
            aria-label={title ?? (bubbleMode ? 'Bubble chart' : 'Scatter chart')}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none overflow-visible"
          >
            {showGrid &&
              yTicks.map((tick, idx) => {
                const y = scaleLinear(tick, yDomain, [margin.top + plotHeight, margin.top]);
                return (
                  <g key={`y-${idx}`}>
                    <line
                      x1={margin.left}
                      x2={margin.left + plotWidth}
                      y1={y}
                      y2={y}
                      stroke="var(--wdr-chart-grid)"
                      strokeDasharray="2 3"
                    />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            {xTicks.map((tick, idx) => {
              const x = scaleLinear(tick, xDomain, [margin.left, margin.left + plotWidth]);
              return (
                <text
                  key={`x-${idx}`}
                  x={x}
                  y={margin.top + plotHeight + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="var(--wdr-chart-axis-text)"
                >
                  {formatChartValue(tick, xFormatter)}
                </text>
              );
            })}

            {data.map((pt) => {
              const sIdx = Math.max(0, seriesNames.indexOf(pt.series ?? 'Primary'));
              const color = getSeriesColor(sIdx);
              const marker = getSeriesMarker(sIdx);
              const cx = scaleLinear(pt.x, xDomain, [margin.left, margin.left + plotWidth]);
              const cy = scaleLinear(pt.y, yDomain, [margin.top + plotHeight, margin.top]);
              const r = bubbleMode ? Math.max(5, Math.sqrt((pt.size ?? 1) / maxS) * 20) : 5;

              return (
                <g
                  key={pt.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${pt.label ?? pt.id}: ${xLabel} ${formatChartValue(pt.x, xFormatter)}, ${yLabel} ${formatChartValue(pt.y, valueFormatter)}`}
                  onMouseEnter={() => setActiveId(pt.id)}
                  onFocus={() => setActiveId(pt.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => onPointSelect?.(pt)}
                  className="cursor-pointer focus:outline-none"
                >
                  {bubbleMode ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={color}
                      fillOpacity={activeId === pt.id ? 0.85 : 0.45}
                      stroke={color}
                      strokeWidth="2"
                    />
                  ) : (
                    <ChartMarkerShape kind={marker} cx={cx} cy={cy} size={r} fill={color} />
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export function BubbleChart(props: Omit<ScatterChartProps, 'bubbleMode'>) {
  return <ScatterChart {...props} bubbleMode />;
}

export interface RadarSeries {
  key: string;
  label: string;
  values: number[];
  color?: string;
}

export interface RadarChartProps extends BaseChartProps {
  axes: string[];
  series: RadarSeries[];
  maxValue?: number;
}

export function RadarChart({
  axes,
  series,
  maxValue = 100,
  title,
  subtitle,
  description,
  height = 260,
  showLegend = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: RadarChartProps) {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (series.length - next.size > 1) next.add(key);
      return next;
    });
  };

  const visibleSeries = series.filter((s) => !hidden.has(s.key));
  const tableColumns = [
    { key: 'axis', label: 'Dimension' },
    ...series.map((s) => ({ key: s.key, label: s.label })),
  ];
  const tableRows = axes.map((ax, idx) => {
    const out: Record<string, string> = { axis: ax };
    for (const s of series) {
      out[s.key] = formatChartValue(s.values[idx] ?? 0, valueFormatter);
    }
    return out;
  });

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? (axes.length < 3 || series.length === 0)}
      legendItems={
        showLegend
          ? series.map((s, i) => ({
              key: s.key,
              label: s.label,
              color: getSeriesColor(i, s.color),
              active: !hidden.has(s.key),
            }))
          : undefined
      }
      onLegendToggle={toggle}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {() => {
        const size = 250;
        const cx = size / 2;
        const cy = size / 2;
        const r = 82;
        const levels = [0.25, 0.5, 0.75, 1];

        const pointAt = (axisIdx: number, val: number) => {
          const angle = (Math.PI * 2 * axisIdx) / axes.length - Math.PI / 2;
          const dist = r * Math.max(0, Math.min(1, val / maxValue));
          return {
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
          };
        };

        return (
          <div className="flex justify-center">
            <svg
              role="img"
              aria-label={title ?? 'Radar chart'}
              viewBox={`0 0 ${size} ${size}`}
              className="h-auto w-full max-w-[260px]"
            >
              {levels.map((lvl) => {
                const pts = axes
                  .map((_, i) => {
                    const p = pointAt(i, maxValue * lvl);
                    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={lvl}
                    points={pts}
                    fill="none"
                    stroke="var(--wdr-chart-grid)"
                    strokeWidth="1"
                  />
                );
              })}

              {axes.map((ax, i) => {
                const edge = pointAt(i, maxValue);
                const labelPt = pointAt(i, maxValue * 1.18);
                return (
                  <g key={ax}>
                    <line x1={cx} y1={cy} x2={edge.x} y2={edge.y} stroke="var(--wdr-chart-grid)" />
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--wdr-chart-axis-text)"
                    >
                      {ax}
                    </text>
                  </g>
                );
              })}

              {visibleSeries.map((s) => {
                const origIdx = series.findIndex((o) => o.key === s.key);
                const color = getSeriesColor(origIdx, s.color);
                const dash = getSeriesDash(origIdx);
                const pts = axes
                  .map((_, i) => {
                    const p = pointAt(i, s.values[i] ?? 0);
                    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                  })
                  .join(' ');
                return (
                  <polygon
                    key={s.key}
                    points={pts}
                    fill={color}
                    fillOpacity="0.16"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={dash}
                  />
                );
              })}
            </svg>
          </div>
        );
      }}
    </ChartContainer>
  );
}

export interface SparklineProps {
  data: number[];
  variant?: 'line' | 'area' | 'bar';
  color?: string;
  width?: number;
  height?: number;
  'aria-label': string;
  className?: string;
}

export function Sparkline({
  data,
  variant = 'line',
  color = 'var(--wdr-chart-1)',
  width = 120,
  height = 36,
  'aria-label': ariaLabel,
  className,
}: SparklineProps) {
  if (data.length === 0) return null;
  const domain = computeNiceDomain(data, { includeZero: variant === 'bar' });
  const pad = 3;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const pts = data.map((v, idx) => ({
    x: data.length === 1 ? width / 2 : pad + (idx / (data.length - 1)) * innerW,
    y: scaleLinear(v, domain, [pad + innerH, pad]),
  }));

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block overflow-visible', className)}
      width={width}
      height={height}
    >
      {variant === 'bar' ? (
        data.map((v, idx) => {
          const barW = Math.max(2, innerW / data.length - 2);
          const x = pad + (idx * innerW) / data.length + 1;
          const y = scaleLinear(v, domain, [pad + innerH, pad]);
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barW}
              height={Math.max(2, pad + innerH - y)}
              rx="1.5"
              fill={color}
            />
          );
        })
      ) : (
        <>
          {variant === 'area' && (
            <path d={buildAreaPath(pts, pad + innerH)} fill={color} fillOpacity="0.18" />
          )}
          <path d={buildLinePath(pts)} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="2.5" fill={color} />
        </>
      )}
    </svg>
  );
}

export interface ProgressVizSegment {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface ProgressVisualizationProps {
  title?: string;
  segments: ProgressVizSegment[];
  total?: number;
  valueFormatter?: ChartFormatterConfig;
  className?: string;
}

export function ProgressVisualization({
  title,
  segments,
  total,
  valueFormatter,
  className,
}: ProgressVisualizationProps) {
  const sum = total ?? segments.reduce((acc, s) => acc + Math.max(0, s.value), 0);
  const safeSum = sum > 0 ? sum : 1;

  return (
    <div className={cn('space-y-2.5 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4', className)}>
      {title && <div className="text-sm font-semibold text-foreground">{title}</div>}
      <div
        role="img"
        aria-label={`${title ?? 'Progress allocation'}: ${segments
          .map((s) => `${s.label} ${formatChartValue(s.value, valueFormatter)}`)
          .join(', ')}`}
        className="flex h-3 w-full overflow-hidden rounded-[var(--wdr-radius-full)] bg-muted"
      >
        {segments.map((seg, idx) => {
          const pct = Math.max(0, Math.min(100, (seg.value / safeSum) * 100));
          return (
            <div
              key={seg.id}
              style={{
                width: `${pct}%`,
                backgroundColor: getSeriesColor(idx, seg.color),
              }}
              className="h-full border-r border-surface last:border-r-0"
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        {segments.map((seg, idx) => (
          <div key={seg.id} className="inline-flex items-center gap-1.5 text-foreground tabular-nums">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: getSeriesColor(idx, seg.color) }}
            />
            <span className="text-muted-foreground">{seg.label}:</span>
            <span className="font-medium">{formatChartValue(seg.value, valueFormatter)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
