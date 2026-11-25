import * as React from 'react';
import { ChartContainer } from '../core/ChartContainer';
import { ChartThresholdsOverlay } from '../core/ChartAnnotation';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { getSeriesColor, getSeriesDash } from '../core/patterns';
import {
  buildBandAreaPath,
  buildLinePath,
  computeNiceDomain,
  generateLinearTicks,
  scaleLinear,
} from '../core/scales';
import type { BaseChartProps, ChartDatum, ChartFormatterConfig, ChartSeriesConfig } from '../core/types';

export interface BoxPlotGroup {
  id: string;
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
}

export interface BoxPlotChartProps extends BaseChartProps {
  groups: BoxPlotGroup[];
}

export function BoxPlotChart({
  groups,
  title,
  subtitle,
  description,
  height = 260,
  showGrid = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: BoxPlotChartProps) {
  const tableColumns = [
    { key: 'group', label: 'Group' },
    { key: 'min', label: 'Min' },
    { key: 'q1', label: 'Q1' },
    { key: 'median', label: 'Median' },
    { key: 'q3', label: 'Q3' },
    { key: 'max', label: 'Max' },
  ];
  const tableRows = groups.map((g) => ({
    group: g.label,
    min: formatChartValue(g.min, valueFormatter),
    q1: formatChartValue(g.q1, valueFormatter),
    median: formatChartValue(g.median, valueFormatter),
    q3: formatChartValue(g.q3, valueFormatter),
    max: formatChartValue(g.max, valueFormatter),
  }));

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? groups.length === 0}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 52 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);
        const allVals = groups.flatMap((g) => [g.min, g.max, ...(g.outliers ?? [])]);
        const domain = computeNiceDomain(allVals, { includeZero: false });
        const ticks = generateLinearTicks(domain, 5);
        const step = plotW / Math.max(1, groups.length);
        const boxW = Math.min(38, Math.max(14, step * 0.45));

        return (
          <svg
            role="img"
            aria-label={title ?? 'Box plot distribution'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            {groups.map((g, idx) => {
              const cx = margin.left + idx * step + step / 2;
              const yMin = scaleLinear(g.min, domain, [margin.top + plotH, margin.top]);
              const yQ1 = scaleLinear(g.q1, domain, [margin.top + plotH, margin.top]);
              const yMed = scaleLinear(g.median, domain, [margin.top + plotH, margin.top]);
              const yQ3 = scaleLinear(g.q3, domain, [margin.top + plotH, margin.top]);
              const yMax = scaleLinear(g.max, domain, [margin.top + plotH, margin.top]);
              const color = getSeriesColor(idx);

              return (
                <g key={g.id}>
                  <line x1={cx} x2={cx} y1={yMax} y2={yMin} stroke={color} strokeWidth="1.5" />
                  <line x1={cx - 8} x2={cx + 8} y1={yMax} y2={yMax} stroke={color} strokeWidth="1.5" />
                  <line x1={cx - 8} x2={cx + 8} y1={yMin} y2={yMin} stroke={color} strokeWidth="1.5" />
                  <rect
                    x={cx - boxW / 2}
                    y={yQ3}
                    width={boxW}
                    height={Math.max(2, yQ1 - yQ3)}
                    fill={color}
                    fillOpacity="0.24"
                    stroke={color}
                    strokeWidth="2"
                    rx="2"
                  />
                  <line
                    x1={cx - boxW / 2}
                    x2={cx + boxW / 2}
                    y1={yMed}
                    y2={yMed}
                    stroke={color}
                    strokeWidth="2.5"
                  />
                  {(g.outliers ?? []).map((o, oi) => (
                    <circle
                      key={oi}
                      cx={cx}
                      cy={scaleLinear(o, domain, [margin.top + plotH, margin.top])}
                      r="3"
                      fill="var(--wdr-surface)"
                      stroke={color}
                      strokeWidth="1.5"
                    />
                  ))}
                  <text x={cx} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="var(--wdr-chart-axis-text)">
                    {g.label}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface ViolinGroup {
  id: string;
  label: string;
  samples: number[];
}

export interface ViolinChartProps extends BaseChartProps {
  groups: ViolinGroup[];
}

function gaussianKde(samples: number[], yValues: number[]): number[] {
  if (samples.length === 0) return yValues.map(() => 0);
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, samples.length);
  const std = Math.sqrt(variance) || 1;
  const bandwidth = Math.max(0.5, 1.06 * std * Math.pow(samples.length, -0.2));

  return yValues.map((y) => {
    const sum = samples.reduce((acc, s) => {
      const z = (y - s) / bandwidth;
      return acc + Math.exp(-0.5 * z * z);
    }, 0);
    return sum / (samples.length * bandwidth * Math.sqrt(2 * Math.PI));
  });
}

export function ViolinChart({
  groups,
  title,
  subtitle,
  description,
  height = 260,
  showGrid = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: ViolinChartProps) {
  const summaries = React.useMemo(
    () =>
      groups.map((g) => {
        const sorted = [...g.samples].sort((a, b) => a - b);
        const mid = sorted.length > 0 ? sorted[Math.floor(sorted.length / 2)] : 0;
        const min = sorted[0] ?? 0;
        const max = sorted[sorted.length - 1] ?? 0;
        return { ...g, median: mid, min, max };
      }),
    [groups]
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? groups.length === 0}
      tableColumns={[
        { key: 'group', label: 'Group' },
        { key: 'count', label: 'Samples' },
        { key: 'median', label: 'Median' },
        { key: 'range', label: 'Range' },
      ]}
      tableRows={summaries.map((s) => ({
        group: s.label,
        count: String(s.samples.length),
        median: formatChartValue(s.median, valueFormatter),
        range: `${formatChartValue(s.min, valueFormatter)}–${formatChartValue(s.max, valueFormatter)}`,
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 52 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);
        const allVals = groups.flatMap((g) => g.samples);
        const domain = computeNiceDomain(allVals, { includeZero: false });
        const ticks = generateLinearTicks(domain, 5);
        const step = plotW / Math.max(1, groups.length);
        const halfW = Math.min(34, Math.max(12, step * 0.34));

        const yGridPts = Array.from({ length: 18 }, (_, i) =>
          domain[0] + ((domain[1] - domain[0]) * i) / 17
        );

        return (
          <svg
            role="img"
            aria-label={title ?? 'Violin density distribution chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            {summaries.map((g, idx) => {
              const cx = margin.left + idx * step + step / 2;
              const densities = gaussianKde(g.samples, yGridPts);
              const maxD = Math.max(0.0001, ...densities);
              const color = getSeriesColor(idx);

              const rightPts = yGridPts.map((yVal, i) => ({
                x: cx + (densities[i] / maxD) * halfW,
                y: scaleLinear(yVal, domain, [margin.top + plotH, margin.top]),
              }));
              const leftPts = [...yGridPts].reverse().map((yVal, i) => {
                const revIdx = yGridPts.length - 1 - i;
                return {
                  x: cx - (densities[revIdx] / maxD) * halfW,
                  y: scaleLinear(yVal, domain, [margin.top + plotH, margin.top]),
                };
              });

              const polyPoints = [...rightPts, ...leftPts]
                .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
                .join(' ');
              const yMed = scaleLinear(g.median, domain, [margin.top + plotH, margin.top]);

              return (
                <g key={g.id}>
                  <polygon points={polyPoints} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.75" />
                  <circle cx={cx} cy={yMed} r="3.5" fill={color} stroke="var(--wdr-surface)" strokeWidth="1.5" />
                  <text x={cx} y={margin.top + plotH + 18} textAnchor="middle" fontSize="11" fill="var(--wdr-chart-axis-text)">
                    {g.label}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface HistogramChartProps extends BaseChartProps {
  values: number[];
  bins?: number;
}

export function HistogramChart({
  values,
  bins = 8,
  title,
  subtitle,
  description,
  height = 240,
  showGrid = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: HistogramChartProps) {
  const computedBins = React.useMemo(() => {
    if (values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const count = Math.max(2, bins);
    const step = max === min ? 1 : (max - min) / count;
    const buckets = Array.from({ length: count }, (_, idx) => ({
      start: min + idx * step,
      end: min + (idx + 1) * step,
      frequency: 0,
    }));
    for (const v of values) {
      const rawIdx = Math.floor((v - min) / step);
      const safeIdx = Math.min(count - 1, Math.max(0, rawIdx));
      buckets[safeIdx].frequency += 1;
    }
    return buckets;
  }, [bins, values]);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? values.length === 0}
      tableColumns={[
        { key: 'range', label: 'Bin Range' },
        { key: 'frequency', label: 'Count' },
      ]}
      tableRows={computedBins.map((b) => ({
        range: `${formatChartValue(b.start, valueFormatter)}–${formatChartValue(b.end, valueFormatter)}`,
        frequency: String(b.frequency),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 18, bottom: 32, left: 48 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(110, height - margin.top - margin.bottom);
        const domain = computeNiceDomain(computedBins.map((b) => b.frequency));
        const ticks = generateLinearTicks(domain, 4);
        const barStep = plotW / Math.max(1, computedBins.length);

        return (
          <svg
            role="img"
            aria-label={title ?? 'Histogram'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                    <text x={margin.left - 6} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {Math.round(tick)}
                    </text>
                  </g>
                );
              })}

            {computedBins.map((b, idx) => {
              const x = margin.left + idx * barStep + 1;
              const y = scaleLinear(b.frequency, domain, [margin.top + plotH, margin.top]);
              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={Math.max(4, barStep - 2)}
                    height={Math.max(1, margin.top + plotH - y)}
                    fill="var(--wdr-chart-2)"
                    stroke="var(--wdr-chart-1)"
                    strokeWidth="1"
                    rx="2"
                  />
                  <text x={x + barStep / 2} y={margin.top + plotH + 16} textAnchor="middle" fontSize="10" fill="var(--wdr-chart-axis-text)">
                    {Math.round(b.start)}
                  </text>
                </g>
              );
            })}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface RangeBandPoint {
  label: string;
  min: number;
  value: number;
  max: number;
}

export interface RangeBandChartProps extends BaseChartProps {
  data: RangeBandPoint[];
}

export function RangeBandChart({
  data,
  title,
  subtitle,
  description,
  height = 250,
  showGrid = true,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: RangeBandChartProps) {
  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? data.length === 0}
      tableColumns={[
        { key: 'label', label: 'Period' },
        { key: 'min', label: 'Lower Bound' },
        { key: 'value', label: 'Observed' },
        { key: 'max', label: 'Upper Bound' },
      ]}
      tableRows={data.map((d) => ({
        label: d.label,
        min: formatChartValue(d.min, valueFormatter),
        value: formatChartValue(d.value, valueFormatter),
        max: formatChartValue(d.max, valueFormatter),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 54 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);
        const domain = computeNiceDomain(data.flatMap((d) => [d.min, d.value, d.max]));
        const ticks = generateLinearTicks(domain, 5);
        const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;

        const upper = data.map((d, i) => ({
          x: margin.left + i * stepX,
          y: scaleLinear(d.max, domain, [margin.top + plotH, margin.top]),
        }));
        const lower = data.map((d, i) => ({
          x: margin.left + i * stepX,
          y: scaleLinear(d.min, domain, [margin.top + plotH, margin.top]),
        }));
        const mid = data.map((d, i) => ({
          x: margin.left + i * stepX,
          y: scaleLinear(d.value, domain, [margin.top + plotH, margin.top]),
        }));

        return (
          <svg
            role="img"
            aria-label={title ?? 'Range and forecast band chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            <path d={buildBandAreaPath(upper, lower)} fill="var(--wdr-chart-2)" fillOpacity="0.22" />
            <path d={buildLinePath(mid)} fill="none" stroke="var(--wdr-chart-1)" strokeWidth="2.5" />
            {data.map((d, idx) => (
              <text
                key={idx}
                x={margin.left + idx * stepX}
                y={margin.top + plotH + 18}
                textAnchor="middle"
                fontSize="11"
                fill="var(--wdr-chart-axis-text)"
              >
                {d.label}
              </text>
            ))}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface MultiSeriesTimeSeriesChartProps extends BaseChartProps {
  data: ChartDatum[];
  dateKey: string;
  series: ChartSeriesConfig[];
  dateFormatter?: ChartFormatterConfig;
}

export function MultiSeriesTimeSeriesChart({
  data,
  dateKey,
  series,
  dateFormatter = { type: 'date', dateStyle: { month: 'short', day: 'numeric' } },
  valueFormatter,
  thresholds,
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
}: MultiSeriesTimeSeriesChartProps) {
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  const toggle = (key: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (series.length - next.size > 1) next.add(key);
      return next;
    });
  };

  const visibleSeries = series.filter((s) => !hidden.has(s.key));

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? (data.length === 0 || series.length === 0)}
      legendItems={
        showLegend
          ? series.map((s, i) => ({
              key: s.key,
              label: s.label,
              color: getSeriesColor(i, s.color),
              dashArray: getSeriesDash(i, s.dashArray),
              active: !hidden.has(s.key),
            }))
          : undefined
      }
      onLegendToggle={toggle}
      tableColumns={[
        { key: dateKey, label: 'Date' },
        ...series.map((s) => ({ key: s.key, label: s.label })),
      ]}
      tableRows={data.map((row) => {
        const out: Record<string, string> = {
          [dateKey]: formatChartValue(row[dateKey], dateFormatter),
        };
        for (const s of series) out[s.key] = formatChartValue(row[s.key], valueFormatter);
        return out;
      })}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeIdx !== null && data[activeIdx] ? (
          <ChartTooltip
            title={formatChartValue(data[activeIdx][dateKey], dateFormatter)}
            rows={visibleSeries.map((s) => {
              const i = series.findIndex((o) => o.key === s.key);
              return {
                key: s.key,
                label: s.label,
                value: formatChartValue(data[activeIdx][s.key], valueFormatter),
                color: getSeriesColor(i, s.color),
              };
            })}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 54 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);

        const allVals = data.flatMap((row) =>
          visibleSeries.map((s) => Number(row[s.key] ?? 0))
        );
        if (thresholds) allVals.push(...thresholds.map((t) => t.value));
        const yDomain = computeNiceDomain(allVals);
        const yTicks = generateLinearTicks(yDomain, 5);
        const stepX = data.length > 1 ? plotW / (data.length - 1) : 0;

        return (
          <svg
            role="img"
            aria-label={title ?? 'Multi-series time series chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {showGrid &&
              yTicks.map((tick, idx) => {
                const y = scaleLinear(tick, yDomain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            {visibleSeries.map((s) => {
              const origIdx = series.findIndex((o) => o.key === s.key);
              const color = getSeriesColor(origIdx, s.color);
              const dash = getSeriesDash(origIdx, s.dashArray);
              const pts = data.map((row, i) => ({
                x: margin.left + i * stepX,
                y: scaleLinear(Number(row[s.key] ?? 0), yDomain, [margin.top + plotH, margin.top]),
              }));
              return (
                <path
                  key={s.key}
                  d={buildLinePath(pts)}
                  fill="none"
                  stroke={color}
                  strokeWidth="2.25"
                  strokeDasharray={dash}
                />
              );
            })}

            <ChartThresholdsOverlay
              thresholds={thresholds}
              yDomain={yDomain}
              plotWidth={plotW}
              plotHeight={plotH}
              margin={margin}
            />

            {data.map((row, idx) => {
              const x = margin.left + idx * stepX;
              const showLbl = idx % Math.max(1, Math.ceil(data.length / 6)) === 0 || idx === data.length - 1;
              return (
                <g key={idx}>
                  {showLbl && (
                    <text x={x} y={margin.top + plotH + 18} textAnchor="middle" fontSize="10" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(row[dateKey], dateFormatter)}
                    </text>
                  )}
                  <rect
                    x={x - Math.max(10, stepX / 2)}
                    y={margin.top}
                    width={Math.max(20, stepX)}
                    height={plotH}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${formatChartValue(row[dateKey], dateFormatter)}: ${visibleSeries
                      .map((s) => `${s.label} ${formatChartValue(row[s.key], valueFormatter)}`)
                      .join(', ')}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onBlur={() => setActiveIdx(null)}
                    className="cursor-pointer focus:outline-none"
                  />
                </g>
              );
            })}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface MixedAxisChartProps extends BaseChartProps {
  data: ChartDatum[];
  categoryKey: string;
  primarySeries: ChartSeriesConfig;
  secondarySeries: ChartSeriesConfig;
}

export function MixedAxisChart({
  data,
  categoryKey,
  primarySeries,
  secondarySeries,
  valueFormatter,
  secondaryValueFormatter,
  title,
  subtitle,
  description,
  height = 260,
  showLegend = true,
  showTableToggle = true,
  loading,
  error,
  onRetry,
  empty,
  className,
}: MixedAxisChartProps) {
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
        showLegend
          ? [
              {
                key: primarySeries.key,
                label: primarySeries.label,
                color: getSeriesColor(0, primarySeries.color),
              },
              {
                key: secondarySeries.key,
                label: secondarySeries.label,
                color: getSeriesColor(2, secondarySeries.color),
              },
            ]
          : undefined
      }
      tableColumns={[
        { key: categoryKey, label: 'Category' },
        { key: primarySeries.key, label: primarySeries.label },
        { key: secondarySeries.key, label: secondarySeries.label },
      ]}
      tableRows={data.map((r) => ({
        [categoryKey]: String(r[categoryKey] ?? ''),
        [primarySeries.key]: formatChartValue(r[primarySeries.key], valueFormatter),
        [secondarySeries.key]: formatChartValue(r[secondarySeries.key], secondaryValueFormatter),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const margin = { top: 20, right: 54, bottom: 32, left: 54 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);

        const leftDom = computeNiceDomain(data.map((r) => Number(r[primarySeries.key] ?? 0)));
        const rightDom = computeNiceDomain(data.map((r) => Number(r[secondarySeries.key] ?? 0)));
        const leftTicks = generateLinearTicks(leftDom, 5);
        const rightTicks = generateLinearTicks(rightDom, 5);
        const stepX = plotW / Math.max(1, data.length);
        const barW = Math.min(36, Math.max(10, stepX * 0.55));
        const leftColor = getSeriesColor(0, primarySeries.color);
        const rightColor = getSeriesColor(2, secondarySeries.color);

        const linePts = data.map((r, i) => ({
          x: margin.left + i * stepX + stepX / 2,
          y: scaleLinear(Number(r[secondarySeries.key] ?? 0), rightDom, [margin.top + plotH, margin.top]),
        }));

        return (
          <svg
            role="img"
            aria-label={title ?? 'Dual-axis mixed chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {leftTicks.map((tick, idx) => {
              const y = scaleLinear(tick, leftDom, [margin.top + plotH, margin.top]);
              return (
                <g key={`l-${idx}`}>
                  <line x1={margin.left} x2={margin.left + plotW} y1={y} y2={y} stroke="var(--wdr-chart-grid)" strokeDasharray="2 3" />
                  <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill="var(--wdr-chart-axis-text)">
                    {formatChartValue(tick, valueFormatter)}
                  </text>
                </g>
              );
            })}

            {rightTicks.map((tick, idx) => {
              const y = scaleLinear(tick, rightDom, [margin.top + plotH, margin.top]);
              return (
                <text key={`r-${idx}`} x={margin.left + plotW + 8} y={y + 3} fontSize="10" fill={rightColor}>
                  {formatChartValue(tick, secondaryValueFormatter)}
                </text>
              );
            })}

            {data.map((r, i) => {
              const cx = margin.left + i * stepX + stepX / 2;
              const y = scaleLinear(Number(r[primarySeries.key] ?? 0), leftDom, [margin.top + plotH, margin.top]);
              return (
                <g key={i}>
                  <rect
                    x={cx - barW / 2}
                    y={y}
                    width={barW}
                    height={Math.max(2, margin.top + plotH - y)}
                    rx="2"
                    fill={leftColor}
                    fillOpacity="0.82"
                  />
                  <text x={cx} y={margin.top + plotH + 18} textAnchor="middle" fontSize="10" fill="var(--wdr-chart-axis-text)">
                    {String(r[categoryKey] ?? '').slice(0, 10)}
                  </text>
                </g>
              );
            })}

            <path d={buildLinePath(linePts)} fill="none" stroke={rightColor} strokeWidth="2.5" strokeDasharray="6 3" />
            {linePts.map((pt, idx) => (
              <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill={rightColor} stroke="var(--wdr-surface)" strokeWidth="1.5" />
            ))}
          </svg>
        );
      }}
    </ChartContainer>
  );
}
