import * as React from 'react';
import { useStableId } from '../../../hooks/use-id';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip, type ChartTooltipRow } from '../core/ChartTooltip';
import { ChartThresholdsOverlay } from '../core/ChartAnnotation';
import { formatChartValue } from '../core/formatters';
import { ChartPatternDefs, getPatternId, getSeriesColor } from '../core/patterns';
import { computeNiceDomain, generateLinearTicks, scaleLinear } from '../core/scales';
import type { BaseChartProps, ChartDatum, ChartSeriesConfig } from '../core/types';

export interface BarSeriesChartProps extends BaseChartProps {
  data: ChartDatum[];
  categoryKey: string;
  series: ChartSeriesConfig[];
  orientation?: 'vertical' | 'horizontal';
  layout?: 'single' | 'grouped' | 'stacked';
  showValues?: boolean;
  onBarSelect?: (datum: ChartDatum, index: number) => void;
}

function BaseBarChart({
  data,
  categoryKey,
  series,
  orientation = 'vertical',
  layout = 'grouped',
  showValues = false,
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
  onBarSelect,
}: BarSeriesChartProps) {
  const patPrefix = useStableId(undefined, 'wdr-bar');
  const [hiddenKeys, setHiddenKeys] = React.useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

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
      { key: categoryKey, label: 'Category' },
      ...series.map((s) => ({ key: s.key, label: s.label })),
    ],
    [categoryKey, series]
  );

  const tableRows = React.useMemo(
    () =>
      data.map((row) => {
        const out: Record<string, string> = { [categoryKey]: String(row[categoryKey] ?? '') };
        for (const s of series) out[s.key] = formatChartValue(row[s.key], valueFormatter);
        return out;
      }),
    [categoryKey, data, series, valueFormatter]
  );

  const legendItems = series.map((s, idx) => ({
    key: s.key,
    label: s.label,
    color: getSeriesColor(idx, s.color),
    active: !hiddenKeys.has(s.key),
  }));

  const isEmpty = empty ?? (data.length === 0 || series.length === 0);
  const tooltipDatum = activeIndex !== null ? data[activeIndex] : undefined;
  const tooltipRows: ChartTooltipRow[] = tooltipDatum
    ? visibleSeries.map((s) => {
        const origIdx = series.findIndex((o) => o.key === s.key);
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
      summary={summary ?? `${title ?? 'Bar chart'} showing ${data.length} categories across ${visibleSeries.length} series.`}
      loading={loading}
      error={error}
      errorTitle={errorTitle}
      onRetry={onRetry}
      empty={isEmpty}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      legendItems={showLegend && series.length > 1 ? legendItems : undefined}
      onLegendToggle={toggleSeries}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      actions={actions}
      footer={footer}
      aria-label={ariaLabel}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && tooltipDatum ? (
          <ChartTooltip title={String(tooltipDatum[categoryKey] ?? '')} rows={tooltipRows} />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const allValues: number[] = [];
        if (layout === 'stacked') {
          for (const row of data) {
            const sum = visibleSeries.reduce((acc, s) => acc + Math.max(0, Number(row[s.key] ?? 0)), 0);
            allValues.push(sum);
          }
        } else {
          for (const row of data) {
            for (const s of visibleSeries) {
              const v = Number(row[s.key]);
              if (Number.isFinite(v)) allValues.push(v);
            }
          }
        }
        if (thresholds) for (const t of thresholds) allValues.push(t.value);

        const domain = computeNiceDomain(allValues);
        const ticks = generateLinearTicks(domain, 5);

        if (orientation === 'horizontal') {
          const margin = { top: 14, right: 44, bottom: 28, left: 108 };
          const plotWidth = Math.max(90, svgWidth - margin.left - margin.right);
          const plotHeight = Math.max(120, height - margin.top - margin.bottom);
          const rowStep = plotHeight / Math.max(1, data.length);
          const barThickness = Math.min(26, Math.max(10, rowStep * 0.62));

          return (
            <svg
              role="img"
              aria-label={title ?? ariaLabel ?? 'Horizontal bar chart'}
              viewBox={`0 0 ${svgWidth} ${height}`}
              className="h-auto w-full select-none overflow-visible"
            >
              <ChartPatternDefs prefix={patPrefix} seriesColors={seriesColors} />
              {showGrid &&
                ticks.map((tick, idx) => {
                  const x = scaleLinear(tick, domain, [margin.left, margin.left + plotWidth]);
                  return (
                    <g key={idx}>
                      <line
                        x1={x}
                        x2={x}
                        y1={margin.top}
                        y2={margin.top + plotHeight}
                        stroke="var(--wdr-chart-grid)"
                        strokeDasharray={idx === 0 ? undefined : '2 3'}
                      />
                      <text
                        x={x}
                        y={margin.top + plotHeight + 16}
                        textAnchor="middle"
                        fill="var(--wdr-chart-axis-text)"
                        fontSize="11"
                        className="tabular-nums"
                      >
                        {formatChartValue(tick, valueFormatter)}
                      </text>
                    </g>
                  );
                })}

              {data.map((row, rIdx) => {
                const yCenter = margin.top + rIdx * rowStep + rowStep / 2;
                let accum = 0;

                return (
                  <g
                    key={rIdx}
                    tabIndex={0}
                    role="button"
                    aria-label={`${String(row[categoryKey] ?? '')}: ${visibleSeries
                      .map((s) => `${s.label} ${formatChartValue(row[s.key], valueFormatter)}`)
                      .join(', ')}`}
                    onMouseEnter={() => setActiveIndex(rIdx)}
                    onFocus={() => setActiveIndex(rIdx)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onBlur={() => setActiveIndex(null)}
                    onClick={() => onBarSelect?.(row, rIdx)}
                    className="cursor-pointer focus:outline-none"
                  >
                    <text
                      x={margin.left - 8}
                      y={yCenter + 4}
                      textAnchor="end"
                      fill="var(--wdr-chart-axis-text)"
                      fontSize="11"
                    >
                      {String(row[categoryKey] ?? '').slice(0, 16)}
                    </text>

                    {visibleSeries.map((s, sIdx) => {
                      const origIdx = series.findIndex((o) => o.key === s.key);
                      const patId = getPatternId(patPrefix, origIdx);
                      const val = Number(row[s.key] ?? 0);

                      if (layout === 'stacked') {
                        const x0 = scaleLinear(accum, domain, [margin.left, margin.left + plotWidth]);
                        const x1 = scaleLinear(accum + Math.max(0, val), domain, [margin.left, margin.left + plotWidth]);
                        accum += Math.max(0, val);
                        return (
                          <rect
                            key={s.key}
                            x={x0}
                            y={yCenter - barThickness / 2}
                            width={Math.max(1, x1 - x0)}
                            height={barThickness}
                            rx="2"
                            fill={`url(#${patId})`}
                            stroke={getSeriesColor(origIdx, s.color)}
                            opacity={activeIndex === null || activeIndex === rIdx ? 1 : 0.6}
                          />
                        );
                      }

                      const subH = barThickness / Math.max(1, visibleSeries.length);
                      const yPos = yCenter - barThickness / 2 + sIdx * subH;
                      const xEnd = scaleLinear(val, domain, [margin.left, margin.left + plotWidth]);
                      return (
                        <g key={s.key}>
                          <rect
                            x={margin.left}
                            y={yPos}
                            width={Math.max(2, xEnd - margin.left)}
                            height={Math.max(4, subH - 1)}
                            rx="3"
                            fill={`url(#${patId})`}
                            stroke={getSeriesColor(origIdx, s.color)}
                            opacity={activeIndex === null || activeIndex === rIdx ? 1 : 0.6}
                          />
                          {showValues && visibleSeries.length === 1 && (
                            <text
                              x={xEnd + 6}
                              y={yPos + subH / 2 + 3}
                              fill="var(--wdr-foreground)"
                              fontSize="11"
                              className="tabular-nums"
                            >
                              {formatChartValue(val, valueFormatter)}
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </svg>
          );
        }

        // Vertical Bar / Column / Grouped / Stacked
        const margin = { top: 20, right: 20, bottom: 32, left: 54 };
        const plotWidth = Math.max(80, svgWidth - margin.left - margin.right);
        const plotHeight = Math.max(120, height - margin.top - margin.bottom);
        const catStep = plotWidth / Math.max(1, data.length);
        const clusterW = Math.min(52, Math.max(14, catStep * 0.66));
        const baselineY = scaleLinear(Math.max(domain[0], 0), domain, [margin.top + plotHeight, margin.top]);

        return (
          <svg
            role="img"
            aria-label={title ?? ariaLabel ?? 'Bar chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none overflow-visible"
          >
            <ChartPatternDefs prefix={patPrefix} seriesColors={seriesColors} />
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotHeight, margin.top]);
                return (
                  <g key={idx}>
                    <line
                      x1={margin.left}
                      x2={margin.left + plotWidth}
                      y1={y}
                      y2={y}
                      stroke="var(--wdr-chart-grid)"
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

            {data.map((row, rIdx) => {
              const centerX = margin.left + rIdx * catStep + catStep / 2;
              let accum = 0;

              return (
                <g
                  key={rIdx}
                  tabIndex={0}
                  role="button"
                  aria-label={`${String(row[categoryKey] ?? '')}: ${visibleSeries
                    .map((s) => `${s.label} ${formatChartValue(row[s.key], valueFormatter)}`)
                    .join(', ')}`}
                  onMouseEnter={() => setActiveIndex(rIdx)}
                  onFocus={() => setActiveIndex(rIdx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onBlur={() => setActiveIndex(null)}
                  onClick={() => onBarSelect?.(row, rIdx)}
                  className="cursor-pointer focus:outline-none"
                >
                  {visibleSeries.map((s, sIdx) => {
                    const origIdx = series.findIndex((o) => o.key === s.key);
                    const patId = getPatternId(patPrefix, origIdx);
                    const val = Number(row[s.key] ?? 0);

                    if (layout === 'stacked') {
                      const nextAccum = accum + Math.max(0, val);
                      const yTop = scaleLinear(nextAccum, domain, [margin.top + plotHeight, margin.top]);
                      const yBot = scaleLinear(accum, domain, [margin.top + plotHeight, margin.top]);
                      accum = nextAccum;
                      return (
                        <rect
                          key={s.key}
                          x={centerX - clusterW / 2}
                          y={yTop}
                          width={clusterW}
                          height={Math.max(1, yBot - yTop)}
                          rx="2"
                          fill={`url(#${patId})`}
                          stroke={getSeriesColor(origIdx, s.color)}
                          opacity={activeIndex === null || activeIndex === rIdx ? 1 : 0.6}
                        />
                      );
                    }

                    const singleW = clusterW / Math.max(1, visibleSeries.length);
                    const x = centerX - clusterW / 2 + sIdx * singleW;
                    const y = scaleLinear(val, domain, [margin.top + plotHeight, margin.top]);
                    const rectY = Math.min(y, baselineY);
                    const rectH = Math.max(1, Math.abs(baselineY - y));
                    return (
                      <g key={s.key}>
                        <rect
                          x={x}
                          y={rectY}
                          width={Math.max(4, singleW - 2)}
                          height={rectH}
                          rx="3"
                          fill={`url(#${patId})`}
                          stroke={getSeriesColor(origIdx, s.color)}
                          opacity={activeIndex === null || activeIndex === rIdx ? 1 : 0.6}
                        />
                        {showValues && visibleSeries.length === 1 && (
                          <text
                            x={x + singleW / 2}
                            y={rectY - 5}
                            textAnchor="middle"
                            fill="var(--wdr-foreground)"
                            fontSize="10"
                            className="tabular-nums"
                          >
                            {formatChartValue(val, valueFormatter)}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  <text
                    x={centerX}
                    y={margin.top + plotHeight + 18}
                    textAnchor="middle"
                    fill="var(--wdr-chart-axis-text)"
                    fontSize="11"
                  >
                    {String(row[categoryKey] ?? '').slice(0, 12)}
                  </text>
                </g>
              );
            })}

            <ChartThresholdsOverlay
              thresholds={thresholds}
              yDomain={domain}
              plotWidth={plotWidth}
              plotHeight={plotHeight}
              margin={margin}
            />
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export function BarChart(props: BarSeriesChartProps) {
  return <BaseBarChart {...props} />;
}

export function HorizontalBarChart(props: Omit<BarSeriesChartProps, 'orientation'>) {
  return <BaseBarChart {...props} orientation="horizontal" />;
}

export function GroupedBarChart(props: Omit<BarSeriesChartProps, 'layout'>) {
  return <BaseBarChart {...props} layout="grouped" />;
}

export function StackedBarChart(props: Omit<BarSeriesChartProps, 'layout'>) {
  return <BaseBarChart {...props} layout="stacked" />;
}

export function ColumnChart(props: Omit<BarSeriesChartProps, 'orientation'>) {
  return <BaseBarChart {...props} orientation="vertical" layout={props.layout ?? 'single'} showValues={props.showValues ?? true} />;
}
