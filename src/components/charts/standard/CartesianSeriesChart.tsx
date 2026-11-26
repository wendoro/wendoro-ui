import * as React from 'react';
import { useStableId } from '../../../hooks/use-id';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip, type ChartTooltipRow } from '../core/ChartTooltip';
import { ChartAnnotationsOverlay, ChartThresholdsOverlay } from '../core/ChartAnnotation';
import { formatChartValue } from '../core/formatters';
import {
  ChartMarkerShape,
  ChartPatternDefs,
  getPatternId,
  getSeriesColor,
  getSeriesDash,
  getSeriesMarker,
} from '../core/patterns';
import {
  buildAreaPath,
  buildLinePath,
  computeNiceDomain,
  generateLinearTicks,
  scaleLinear,
} from '../core/scales';
import type { BaseChartProps, ChartDatum, ChartSeriesConfig } from '../core/types';

export interface CartesianChartProps extends BaseChartProps {
  data: ChartDatum[];
  xKey: string;
  series: ChartSeriesConfig[];
  stacked?: boolean;
  area?: boolean;
  zoomable?: boolean;
  onPointSelect?: (datum: ChartDatum, index: number) => void;
}

function CartesianSeriesChart({
  data,
  xKey,
  series,
  stacked = false,
  area = false,
  zoomable = false,
  mode = 'cartesian',
  title,
  subtitle,
  description,
  summary,
  height = 260,
  showLegend = true,
  showGrid = true,
  showTableToggle = true,
  interactiveTooltip = true,
  valueFormatter,
  thresholds,
  annotations,
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
  onPointSelect,
}: CartesianChartProps & { mode?: 'cartesian' | 'composed' }) {
  const patPrefix = useStableId(undefined, 'wdr-cart');
  const [hiddenKeys, setHiddenKeys] = React.useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [zoomWindow, setZoomWindow] = React.useState<[number, number]>([0, data.length]);

  React.useEffect(() => {
    setZoomWindow([0, data.length]);
  }, [data.length]);

  const slicedData = React.useMemo(() => {
    if (!zoomable || data.length <= 2) return data;
    const start = Math.max(0, Math.min(data.length - 2, zoomWindow[0]));
    const end = Math.max(start + 2, Math.min(data.length, zoomWindow[1]));
    return data.slice(start, end);
  }, [data, zoomWindow, zoomable]);

  const zoomControls = zoomable && data.length > 2 ? (
    <div className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-0.5 text-[11px]">
      <button
        type="button"
        aria-label="Pan left"
        disabled={zoomWindow[0] <= 0}
        onClick={() => {
          const span = zoomWindow[1] - zoomWindow[0];
          const nextStart = Math.max(0, zoomWindow[0] - 1);
          setZoomWindow([nextStart, nextStart + span]);
        }}
        className="rounded px-1.5 py-0.5 text-foreground hover:bg-muted disabled:opacity-40"
      >
        ←
      </button>
      <button
        type="button"
        aria-label="Zoom in"
        disabled={zoomWindow[1] - zoomWindow[0] <= 2}
        onClick={() => {
          const span = zoomWindow[1] - zoomWindow[0];
          if (span <= 2) return;
          setZoomWindow([zoomWindow[0] + 1, Math.max(zoomWindow[0] + 2, zoomWindow[1] - 1)]);
        }}
        className="rounded px-1.5 py-0.5 font-semibold text-foreground hover:bg-muted disabled:opacity-40"
      >
        +
      </button>
      <button
        type="button"
        aria-label="Zoom out"
        disabled={zoomWindow[0] === 0 && zoomWindow[1] >= data.length}
        onClick={() => {
          setZoomWindow([Math.max(0, zoomWindow[0] - 1), Math.min(data.length, zoomWindow[1] + 1)]);
        }}
        className="rounded px-1.5 py-0.5 font-semibold text-foreground hover:bg-muted disabled:opacity-40"
      >
        −
      </button>
      <button
        type="button"
        aria-label="Pan right"
        disabled={zoomWindow[1] >= data.length}
        onClick={() => {
          const span = zoomWindow[1] - zoomWindow[0];
          const nextEnd = Math.min(data.length, zoomWindow[1] + 1);
          setZoomWindow([Math.max(0, nextEnd - span), nextEnd]);
        }}
        className="rounded px-1.5 py-0.5 text-foreground hover:bg-muted disabled:opacity-40"
      >
        →
      </button>
      {(zoomWindow[0] !== 0 || zoomWindow[1] !== data.length) && (
        <button
          type="button"
          onClick={() => setZoomWindow([0, data.length])}
          className="rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Reset
        </button>
      )}
    </div>
  ) : null;

  const toggleSeries = (key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (series.length - next.size > 1) next.add(key);
      return next;
    });
  };

  const visibleSeries = series.filter((s) => !hiddenKeys.has(s.key));
  const seriesColors = series.map((s, idx) => getSeriesColor(idx, s.color));

  const tableColumns = React.useMemo(
    () => [
      { key: xKey, label: xKey.toUpperCase() },
      ...series.map((s) => ({ key: s.key, label: s.label })),
    ],
    [series, xKey]
  );

  const tableRows = React.useMemo(
    () =>
      slicedData.map((row) => {
        const out: Record<string, string> = { [xKey]: String(row[xKey] ?? '') };
        for (const s of series) {
          out[s.key] = formatChartValue(row[s.key], valueFormatter);
        }
        return out;
      }),
    [slicedData, series, valueFormatter, xKey]
  );

  const legendItems = series.map((s, idx) => ({
    key: s.key,
    label: s.label,
    color: getSeriesColor(idx, s.color),
    marker: getSeriesMarker(idx, s.marker),
    dashArray: getSeriesDash(idx, s.dashArray),
    active: !hiddenKeys.has(s.key),
  }));

  const isEmpty = empty ?? (slicedData.length === 0 || series.length === 0);

  const tooltipDatum = activeIndex !== null ? slicedData[activeIndex] : undefined;
  const tooltipRows: ChartTooltipRow[] = tooltipDatum
    ? visibleSeries.map((s) => {
        const origIdx = series.findIndex((orig) => orig.key === s.key);
        return {
          key: s.key,
          label: s.label,
          value: formatChartValue(tooltipDatum[s.key], valueFormatter),
          color: getSeriesColor(origIdx, s.color),
        };
      })
    : [];

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      summary={summary ?? `${title ?? 'Series chart'} across ${slicedData.length} points and ${visibleSeries.length} visible series.`}
      loading={loading}
      error={error}
      errorTitle={errorTitle}
      onRetry={onRetry}
      empty={isEmpty}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      legendItems={showLegend ? legendItems : undefined}
      onLegendToggle={toggleSeries}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      actions={
        zoomControls || actions ? (
          <div className="flex flex-wrap items-center gap-2">
            {zoomControls}
            {actions}
          </div>
        ) : undefined
      }
      footer={footer}
      aria-label={ariaLabel}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && tooltipDatum ? (
          <ChartTooltip title={String(tooltipDatum[xKey] ?? '')} rows={tooltipRows} />
        ) : undefined
      }
    >
      {(width) => {
        const margin = { top: 20, right: 20, bottom: 32, left: 54 };
        const svgWidth = Math.max(280, width);
        const plotWidth = Math.max(80, svgWidth - margin.left - margin.right);
        const plotHeight = Math.max(120, height - margin.top - margin.bottom);

        const allValues: number[] = [];
        if (stacked) {
          for (const row of slicedData) {
            let sum = 0;
            for (const s of visibleSeries) {
              const v = Number(row[s.key] ?? 0);
              if (Number.isFinite(v)) sum += Math.max(0, v);
            }
            allValues.push(sum);
          }
        } else {
          for (const row of slicedData) {
            for (const s of visibleSeries) {
              const v = Number(row[s.key]);
              if (Number.isFinite(v)) allValues.push(v);
            }
          }
        }
        if (thresholds) {
          for (const t of thresholds) allValues.push(t.value);
        }

        const yDomain = computeNiceDomain(allValues);
        const yTicks = generateLinearTicks(yDomain, 5);
        const baselineY = scaleLinear(Math.max(yDomain[0], 0), yDomain, [margin.top + plotHeight, margin.top]);

        const barSeries =
          mode === 'composed' ? visibleSeries.filter((s) => (s.type ?? 'line') === 'bar') : [];
        const hasBars = barSeries.length > 0;
        const stepX = hasBars
          ? plotWidth / Math.max(1, slicedData.length)
          : slicedData.length > 1
            ? plotWidth / (slicedData.length - 1)
            : 0;

        const getX = (idx: number) =>
          hasBars
            ? margin.left + stepX * idx + stepX / 2
            : slicedData.length === 1
              ? margin.left + plotWidth / 2
              : margin.left + stepX * idx;

        const xPositions = new Map<string, number>();
        slicedData.forEach((row, idx) => {
          xPositions.set(String(row[xKey] ?? idx), getX(idx));
        });

        const cumulativeBaseline = slicedData.map(() => 0);
        const xTickStep = Math.max(1, Math.ceil(slicedData.length / 7));

        return (
          <svg
            role="img"
            aria-label={title ?? ariaLabel ?? 'Cartesian series chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none overflow-visible"
          >
            <ChartPatternDefs prefix={patPrefix} seriesColors={seriesColors} />

            {showGrid &&
              yTicks.map((tick, idx) => {
                const y = scaleLinear(tick, yDomain, [margin.top + plotHeight, margin.top]);
                return (
                  <g key={idx}>
                    <line
                      x1={margin.left}
                      x2={margin.left + plotWidth}
                      y1={y}
                      y2={y}
                      stroke="var(--wdr-chart-grid)"
                      strokeWidth="1"
                      strokeDasharray={idx === 0 ? undefined : '2 3'}
                    />
                    <text
                      x={margin.left - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="var(--wdr-chart-axis-text)"
                      fontSize="11"
                      className="tabular-nums"
                    >
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            <line
              x1={margin.left}
              x2={margin.left + plotWidth}
              y1={margin.top + plotHeight}
              y2={margin.top + plotHeight}
              stroke="var(--wdr-chart-axis)"
              strokeWidth="1"
            />

            {/* Composed Bars */}
            {barSeries.map((s) => {
              const origIdx = series.findIndex((orig) => orig.key === s.key);
              const barIdx = barSeries.findIndex((b) => b.key === s.key);
              const groupW = Math.min(48, Math.max(12, stepX * 0.65));
              const singleW = groupW / Math.max(1, barSeries.length);
              const patId = getPatternId(patPrefix, origIdx);

              return (
                <g key={s.key}>
                  {slicedData.map((row, idx) => {
                    const val = Number(row[s.key] ?? 0);
                    const y = scaleLinear(val, yDomain, [margin.top + plotHeight, margin.top]);
                    const rectY = Math.min(y, baselineY);
                    const rectH = Math.max(1, Math.abs(baselineY - y));
                    const x = getX(idx) - groupW / 2 + barIdx * singleW;
                    return (
                      <rect
                        key={idx}
                        x={x}
                        y={rectY}
                        width={Math.max(4, singleW - 2)}
                        height={rectH}
                        rx="2"
                        fill={`url(#${patId})`}
                        stroke={getSeriesColor(origIdx, s.color)}
                        strokeWidth="1"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Lines & Areas */}
            {visibleSeries
              .filter((s) => mode !== 'composed' || (s.type ?? 'line') !== 'bar')
              .map((s) => {
                const origIdx = series.findIndex((orig) => orig.key === s.key);
                const color = getSeriesColor(origIdx, s.color);
                const dash = getSeriesDash(origIdx, s.dashArray);
                const marker = getSeriesMarker(origIdx, s.marker);
                const patId = getPatternId(patPrefix, origIdx);
                const isArea = area || s.type === 'area';

                const pts = slicedData.map((row, idx) => {
                  const val = Number(row[s.key] ?? 0);
                  const topVal = stacked ? cumulativeBaseline[idx] + Math.max(0, val) : val;
                  const bottomVal = stacked ? cumulativeBaseline[idx] : 0;
                  if (stacked) cumulativeBaseline[idx] = topVal;
                  return {
                    x: getX(idx),
                    y: scaleLinear(topVal, yDomain, [margin.top + plotHeight, margin.top]),
                    bottomY: scaleLinear(bottomVal, yDomain, [margin.top + plotHeight, margin.top]),
                  };
                });

                let areaD = '';
                if (isArea && pts.length > 0) {
                  if (stacked) {
                    const topCmd = buildLinePath(pts);
                    const backCmd = [...pts]
                      .reverse()
                      .map((p) => `L ${p.x.toFixed(2)} ${p.bottomY.toFixed(2)}`)
                      .join(' ');
                    areaD = `${topCmd} ${backCmd} Z`;
                  } else {
                    areaD = buildAreaPath(pts, baselineY);
                  }
                }

                return (
                  <g key={s.key}>
                    {isArea && areaD && (
                      <path d={areaD} fill={`url(#${patId})`} fillOpacity="0.28" stroke="none" />
                    )}
                    <path
                      d={buildLinePath(pts)}
                      fill="none"
                      stroke={color}
                      strokeWidth="2.25"
                      strokeDasharray={dash}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {pts.map((pt, idx) => (
                      <ChartMarkerShape
                        key={idx}
                        kind={marker}
                        cx={pt.x}
                        cy={pt.y}
                        size={activeIndex === idx ? 5 : 3.5}
                        fill={color}
                      />
                    ))}
                  </g>
                );
              })}

            <ChartThresholdsOverlay
              thresholds={thresholds}
              yDomain={yDomain}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              margin={margin}
            />
            <ChartAnnotationsOverlay
              annotations={annotations}
              xPositions={xPositions}
              yDomain={yDomain}
              plotHeight={plotHeight}
              margin={margin}
            />

            {/* Interactive focus/hover columns + X labels */}
            {slicedData.map((row, idx) => {
              const x = getX(idx);
              const showLabel = idx % xTickStep === 0 || idx === slicedData.length - 1;
              return (
                <g key={idx}>
                  {showLabel && (
                    <text
                      x={x}
                      y={margin.top + plotHeight + 18}
                      textAnchor="middle"
                      fill="var(--wdr-chart-axis-text)"
                      fontSize="11"
                    >
                      {String(row[xKey] ?? '')}
                    </text>
                  )}
                  {activeIndex === idx && (
                    <line
                      x1={x}
                      x2={x}
                      y1={margin.top}
                      y2={margin.top + plotHeight}
                      stroke="var(--wdr-chart-crosshair)"
                      strokeOpacity="0.35"
                      strokeDasharray="3 3"
                    />
                  )}
                  <rect
                    x={x - Math.max(12, stepX / 2)}
                    y={margin.top}
                    width={Math.max(24, stepX)}
                    height={plotHeight}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${String(row[xKey] ?? '')}: ${visibleSeries
                      .map((s) => `${s.label} ${formatChartValue(row[s.key], valueFormatter)}`)
                      .join(', ')}`}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onFocus={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onBlur={() => setActiveIndex(null)}
                    onClick={() => onPointSelect?.(row, idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onPointSelect?.(row, idx);
                      }
                    }}
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

export function LineChart(props: CartesianChartProps) {
  return <CartesianSeriesChart {...props} area={false} stacked={false} mode="cartesian" />;
}

export function AreaChart(props: CartesianChartProps) {
  return <CartesianSeriesChart {...props} area stacked={false} mode="cartesian" />;
}

export function StackedAreaChart(props: CartesianChartProps) {
  return <CartesianSeriesChart {...props} area stacked mode="cartesian" />;
}

export function ComposedChart(props: CartesianChartProps) {
  return <CartesianSeriesChart {...props} mode="composed" />;
}
