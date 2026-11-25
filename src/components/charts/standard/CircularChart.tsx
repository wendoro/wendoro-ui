import * as React from 'react';
import { useStableId } from '../../../hooks/use-id';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { ChartPatternDefs, getPatternId, getSeriesColor } from '../core/patterns';
import { describeArcSegment } from '../core/scales';
import type { BaseChartProps } from '../core/types';

export interface CircularSliceDatum {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface CircularSliceChartProps extends BaseChartProps {
  data: CircularSliceDatum[];
  centerLabel?: string;
  centerValue?: string;
  onSliceSelect?: (slice: CircularSliceDatum) => void;
}

function CircularSliceChart({
  data,
  innerRatio,
  centerLabel,
  centerValue,
  title,
  subtitle,
  description,
  summary,
  height = 240,
  showLegend = true,
  showTableToggle = true,
  interactiveTooltip = true,
  valueFormatter,
  loading,
  error,
  errorTitle,
  onRetry,
  empty,
  emptyTitle,
  emptyDescription,
  actions,
  footer,
  'aria-label': ariaLabel,
  className,
  onSliceSelect,
}: CircularSliceChartProps & { innerRatio: number }) {
  const patPrefix = useStableId(undefined, 'wdr-pie');
  const [hiddenIds, setHiddenIds] = React.useState<Set<string>>(new Set());
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const toggleSlice = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (data.length - next.size > 1) next.add(id);
      return next;
    });
  };

  const visibleData = data.filter((d) => !hiddenIds.has(d.id) && d.value > 0);
  const total = visibleData.reduce((acc, item) => acc + item.value, 0);
  const colors = data.map((d, i) => getSeriesColor(i, d.color));

  const tableColumns = [
    { key: 'label', label: 'Segment' },
    { key: 'value', label: 'Value' },
    { key: 'share', label: 'Share' },
  ];

  const tableRows = data.map((d) => ({
    label: d.label,
    value: formatChartValue(d.value, valueFormatter),
    share: total > 0 ? formatChartValue(d.value / total, { type: 'percent', maximumFractionDigits: 1 }) : '0%',
  }));

  const legendItems = data.map((d, i) => ({
    key: d.id,
    label: d.label,
    color: getSeriesColor(i, d.color),
    active: !hiddenIds.has(d.id),
  }));

  const activeSlice = visibleData.find((d) => d.id === activeId);
  const activeOrigIdx = activeSlice ? data.findIndex((d) => d.id === activeSlice.id) : 0;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      summary={summary ?? `${title ?? 'Distribution chart'} with ${visibleData.length} segments summing to ${formatChartValue(total, valueFormatter)}.`}
      loading={loading}
      error={error}
      errorTitle={errorTitle}
      onRetry={onRetry}
      empty={empty ?? data.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      legendItems={showLegend ? legendItems : undefined}
      onLegendToggle={toggleSlice}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      actions={actions}
      footer={footer}
      aria-label={ariaLabel}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && activeSlice ? (
          <ChartTooltip
            title={activeSlice.label}
            rows={[
              {
                key: activeSlice.id,
                label: 'Value',
                value: `${formatChartValue(activeSlice.value, valueFormatter)} (${total > 0 ? Math.round((activeSlice.value / total) * 100) : 0}%)`,
                color: getSeriesColor(activeOrigIdx, activeSlice.color),
              },
            ]}
          />
        ) : undefined
      }
    >
      {() => {
        const size = Math.max(200, Math.min(280, height));
        const cx = size / 2;
        const cy = size / 2;
        const outerR = size * 0.42;
        const innerR = outerR * innerRatio;
        let currentAngle = 0;

        return (
          <div className="flex justify-center">
            <svg
              role="img"
              aria-label={title ?? ariaLabel ?? (innerRatio > 0 ? 'Donut chart' : 'Pie chart')}
              viewBox={`0 0 ${size} ${size}`}
              className="h-auto w-full max-w-[260px] select-none"
            >
              <ChartPatternDefs prefix={patPrefix} seriesColors={colors} />
              {visibleData.map((slice) => {
                const origIdx = data.findIndex((d) => d.id === slice.id);
                const sweep = total > 0 ? (slice.value / total) * 360 : 0;
                const pathD = describeArcSegment(cx, cy, outerR, innerR, currentAngle, currentAngle + sweep);
                currentAngle += sweep;
                const patId = getPatternId(patPrefix, origIdx);
                const pct = total > 0 ? Math.round((slice.value / total) * 100) : 0;

                return (
                  <path
                    key={slice.id}
                    d={pathD}
                    fill={`url(#${patId})`}
                    stroke="var(--wdr-surface)"
                    strokeWidth="2"
                    tabIndex={0}
                    role="button"
                    aria-label={`${slice.label}: ${formatChartValue(slice.value, valueFormatter)} (${pct}%)`}
                    opacity={activeId === null || activeId === slice.id ? 1 : 0.65}
                    onMouseEnter={() => setActiveId(slice.id)}
                    onFocus={() => setActiveId(slice.id)}
                    onMouseLeave={() => setActiveId(null)}
                    onBlur={() => setActiveId(null)}
                    onClick={() => onSliceSelect?.(slice)}
                    className="cursor-pointer focus:outline-none"
                  />
                );
              })}
              {innerRatio > 0 && (
                <g aria-hidden="true">
                  <text
                    x={cx}
                    y={cy - (centerLabel ? 4 : -5)}
                    textAnchor="middle"
                    fill="var(--wdr-foreground)"
                    fontSize="18"
                    fontWeight="700"
                    className="tabular-nums"
                  >
                    {centerValue ?? formatChartValue(total, valueFormatter)}
                  </text>
                  {centerLabel && (
                    <text
                      x={cx}
                      y={cy + 14}
                      textAnchor="middle"
                      fill="var(--wdr-muted-foreground)"
                      fontSize="11"
                    >
                      {centerLabel}
                    </text>
                  )}
                </g>
              )}
            </svg>
          </div>
        );
      }}
    </ChartContainer>
  );
}

export function DonutChart(props: CircularSliceChartProps) {
  return <CircularSliceChart {...props} innerRatio={0.62} />;
}

export function PieChart(props: CircularSliceChartProps) {
  return <CircularSliceChart {...props} innerRatio={0} />;
}

export interface RadialProgressRing {
  id: string;
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export interface RadialProgressChartProps extends BaseChartProps {
  rings: RadialProgressRing[];
}

export function RadialProgressChart({
  rings,
  title,
  subtitle,
  description,
  height = 220,
  showLegend = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: RadialProgressChartProps) {
  const tableColumns = [
    { key: 'label', label: 'Metric' },
    { key: 'value', label: 'Value' },
    { key: 'pct', label: 'Completion' },
  ];
  const tableRows = rings.map((r) => {
    const max = r.max ?? 100;
    const pct = max > 0 ? Math.min(100, Math.round((r.value / max) * 100)) : 0;
    return {
      label: r.label,
      value: formatChartValue(r.value, valueFormatter),
      pct: `${pct}%`,
    };
  });

  const legendItems = rings.map((r, i) => ({
    key: r.id,
    label: `${r.label} (${Math.min(100, Math.round((r.value / (r.max ?? 100)) * 100))}%)`,
    color: getSeriesColor(i, r.color),
  }));

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? rings.length === 0}
      legendItems={showLegend ? legendItems : undefined}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {() => {
        const size = 210;
        const cx = size / 2;
        const cy = size / 2;

        return (
          <div className="flex justify-center">
            <svg
              role="img"
              aria-label={title ?? 'Radial progress chart'}
              viewBox={`0 0 ${size} ${size}`}
              className="h-auto w-full max-w-[210px]"
            >
              {rings.map((ring, idx) => {
                const radius = Math.max(24, 86 - idx * 18);
                const max = ring.max ?? 100;
                const ratio = max > 0 ? Math.max(0, Math.min(1, ring.value / max)) : 0;
                const circumference = 2 * Math.PI * radius;
                const dashOffset = circumference * (1 - ratio);
                const color = getSeriesColor(idx, ring.color);

                return (
                  <g key={ring.id} transform={`rotate(-90 ${cx} ${cy})`}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="none"
                      stroke="var(--wdr-chart-grid)"
                      strokeWidth="10"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="none"
                      stroke={color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                    />
                  </g>
                );
              })}
              {rings.length === 1 && (
                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  fill="var(--wdr-foreground)"
                  fontSize="22"
                  fontWeight="700"
                  className="tabular-nums"
                >
                  {Math.min(100, Math.round((rings[0].value / (rings[0].max ?? 100)) * 100))}%
                </text>
              )}
            </svg>
          </div>
        );
      }}
    </ChartContainer>
  );
}

export interface GaugeSegment {
  label: string;
  max: number;
  color: string;
}

export interface GaugeChartProps extends BaseChartProps {
  value: number;
  min?: number;
  max?: number;
  unitLabel?: string;
  segments?: GaugeSegment[];
}

export function GaugeChart({
  value,
  min = 0,
  max = 100,
  unitLabel,
  segments,
  title,
  subtitle,
  description,
  valueFormatter,
  loading,
  error,
  onRetry,
  className,
}: GaugeChartProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = max > min ? (clamped - min) / (max - min) : 0;
  const formattedVal = formatChartValue(clamped, valueFormatter);

  const defaultSegments: GaugeSegment[] = segments ?? [
    { label: 'Low', max: min + (max - min) * 0.4, color: 'var(--wdr-destructive)' },
    { label: 'Moderate', max: min + (max - min) * 0.75, color: 'var(--wdr-warning)' },
    { label: 'Optimal', max, color: 'var(--wdr-success)' },
  ];

  const activeSegment =
    defaultSegments.find((seg) => clamped <= seg.max) ?? defaultSegments[defaultSegments.length - 1];

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      summary={`${title ?? 'Gauge'}: ${formattedVal}${unitLabel ? ` ${unitLabel}` : ''} (${activeSegment.label}, range ${min} to ${max}).`}
      loading={loading}
      error={error}
      onRetry={onRetry}
      showTableToggle
      tableColumns={[
        { key: 'metric', label: 'Metric' },
        { key: 'reading', label: 'Reading' },
        { key: 'status', label: 'Band' },
      ]}
      tableRows={[
        {
          metric: title ?? 'Current value',
          reading: `${formattedVal}${unitLabel ? ` ${unitLabel}` : ''}`,
          status: activeSegment.label,
        },
      ]}
      className={className}
      minHeight={180}
    >
      {() => {
        const w = 240;
        const h = 148;
        const cx = 120;
        const cy = 122;
        const r = 88;
        const innerR = 66;
        let prevAngle = -90;

        return (
          <div className="flex flex-col items-center">
            <div
              role="meter"
              aria-label={title ?? 'Performance gauge'}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={clamped}
              aria-valuetext={`${formattedVal} (${activeSegment.label})`}
              className="w-full max-w-[260px]"
            >
              <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full select-none">
                {defaultSegments.map((seg, idx) => {
                  const segRatio = max > min ? (seg.max - min) / (max - min) : 1;
                  const targetAngle = -90 + Math.min(1, Math.max(0, segRatio)) * 180;
                  const d = describeArcSegment(cx, cy, r, innerR, prevAngle, targetAngle);
                  prevAngle = targetAngle;
                  return <path key={idx} d={d} fill={seg.color} opacity="0.28" />;
                })}

                <path
                  d={describeArcSegment(cx, cy, r, innerR, -90, -90 + ratio * 180)}
                  fill={activeSegment.color}
                />

                <text
                  x={cx}
                  y={cy - 14}
                  textAnchor="middle"
                  fill="var(--wdr-foreground)"
                  fontSize="24"
                  fontWeight="700"
                  className="tabular-nums"
                >
                  {formattedVal}
                </text>
                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  fill="var(--wdr-muted-foreground)"
                  fontSize="11"
                >
                  {unitLabel ?? activeSegment.label}
                </text>
                <text x={cx - r + 6} y={cy + 18} fontSize="10" fill="var(--wdr-muted-foreground)">
                  {formatChartValue(min, valueFormatter)}
                </text>
                <text x={cx + r - 6} y={cy + 18} textAnchor="end" fontSize="10" fill="var(--wdr-muted-foreground)">
                  {formatChartValue(max, valueFormatter)}
                </text>
              </svg>
            </div>
          </div>
        );
      }}
    </ChartContainer>
  );
}
