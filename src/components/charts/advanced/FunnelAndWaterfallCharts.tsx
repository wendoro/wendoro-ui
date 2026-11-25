import * as React from 'react';
import { useStableId } from '../../../hooks/use-id';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { ChartPatternDefs, getPatternId, getSeriesColor } from '../core/patterns';
import { computeNiceDomain, generateLinearTicks, scaleLinear } from '../core/scales';
import type { BaseChartProps } from '../core/types';

export interface FunnelStage {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps extends BaseChartProps {
  stages: FunnelStage[];
  onStageSelect?: (stage: FunnelStage) => void;
}

export function FunnelChart({
  stages,
  title,
  subtitle,
  description,
  height = 260,
  showTableToggle = true,
  interactiveTooltip = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
  onStageSelect,
}: FunnelChartProps) {
  const patPrefix = useStableId(undefined, 'wdr-funnel');
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const maxVal = Math.max(1, ...stages.map((s) => s.value));
  const firstVal = stages[0]?.value || 1;
  const colors = stages.map((s, i) => getSeriesColor(i, s.color));

  const tableColumns = [
    { key: 'stage', label: 'Stage' },
    { key: 'value', label: 'Count' },
    { key: 'conv', label: 'Cumulative %' },
  ];
  const tableRows = stages.map((s) => ({
    stage: s.label,
    value: formatChartValue(s.value, valueFormatter),
    conv: formatChartValue(s.value / firstVal, { type: 'percent', maximumFractionDigits: 1 }),
  }));

  const activeStage = stages.find((s) => s.id === activeId);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? stages.length === 0}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && activeStage ? (
          <ChartTooltip
            title={activeStage.label}
            rows={[
              {
                key: activeStage.id,
                label: 'Volume',
                value: formatChartValue(activeStage.value, valueFormatter),
                color: getSeriesColor(stages.indexOf(activeStage), activeStage.color),
              },
              {
                key: 'rate',
                label: 'Of stage 1',
                value: formatChartValue(activeStage.value / firstVal, { type: 'percent', maximumFractionDigits: 1 }),
                color: getSeriesColor(stages.indexOf(activeStage), activeStage.color),
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const rowH = Math.max(26, (height - 16) / Math.max(1, stages.length));
        const maxBarW = svgWidth - 200;

        return (
          <svg
            role="img"
            aria-label={title ?? 'Conversion funnel chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            <ChartPatternDefs prefix={patPrefix} seriesColors={colors} />
            {stages.map((stage, idx) => {
              const barW = Math.max(14, (stage.value / maxVal) * maxBarW);
              const x = 132 + (maxBarW - barW) / 2;
              const y = 8 + idx * rowH;
              const convPct = Math.round((stage.value / firstVal) * 100);
              const patId = getPatternId(patPrefix, idx);

              return (
                <g
                  key={stage.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${stage.label}: ${formatChartValue(stage.value, valueFormatter)} (${convPct}%)`}
                  onMouseEnter={() => setActiveId(stage.id)}
                  onFocus={() => setActiveId(stage.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onBlur={() => setActiveId(null)}
                  onClick={() => onStageSelect?.(stage)}
                  className="cursor-pointer focus:outline-none"
                >
                  <text x="122" y={y + rowH / 2 + 4} textAnchor="end" fontSize="11" fill="var(--wdr-foreground)">
                    {stage.label.slice(0, 18)}
                  </text>
                  <rect
                    x={x}
                    y={y + 4}
                    width={barW}
                    height={Math.max(14, rowH - 8)}
                    rx="4"
                    fill={`url(#${patId})`}
                    stroke={colors[idx]}
                    opacity={activeId === null || activeId === stage.id ? 1 : 0.6}
                  />
                  <text
                    x={132 + maxBarW + 10}
                    y={y + rowH / 2 + 4}
                    fontSize="11"
                    fill="var(--wdr-muted-foreground)"
                    className="tabular-nums"
                  >
                    {formatChartValue(stage.value, valueFormatter)} ({convPct}%)
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

export interface WaterfallStep {
  id: string;
  label: string;
  value: number;
  kind?: 'delta' | 'total';
}

export interface WaterfallChartProps extends BaseChartProps {
  steps: WaterfallStep[];
}

export function WaterfallChart({
  steps,
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
}: WaterfallChartProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const computed = React.useMemo(() => {
    let running = 0;
    return steps.map((step) => {
      if (step.kind === 'total') {
        const start = 0;
        const end = step.value;
        running = end;
        return { ...step, start, end };
      }
      const start = running;
      const end = running + step.value;
      running = end;
      return { ...step, start, end };
    });
  }, [steps]);

  const tableColumns = [
    { key: 'step', label: 'Step' },
    { key: 'delta', label: 'Delta' },
    { key: 'total', label: 'Running Total' },
  ];
  const tableRows = computed.map((s) => ({
    step: s.label,
    delta: s.kind === 'total' ? '—' : formatChartValue(s.value, valueFormatter),
    total: formatChartValue(s.end, valueFormatter),
  }));

  const activeStep = computed.find((s) => s.id === activeId);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? steps.length === 0}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeStep ? (
          <ChartTooltip
            title={activeStep.label}
            rows={[
              {
                key: activeStep.id,
                label: activeStep.kind === 'total' ? 'Total' : 'Change',
                value: formatChartValue(activeStep.value, valueFormatter),
                color:
                  activeStep.kind === 'total'
                    ? 'var(--wdr-chart-1)'
                    : activeStep.value >= 0
                      ? 'var(--wdr-success)'
                      : 'var(--wdr-destructive)',
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 56 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);

        const extValues = computed.flatMap((c) => [c.start, c.end]);
        const domain = computeNiceDomain(extValues);
        const ticks = generateLinearTicks(domain, 5);
        const stepW = plotW / Math.max(1, computed.length);
        const barW = Math.min(44, Math.max(12, stepW * 0.62));

        return (
          <svg
            role="img"
            aria-label={title ?? 'Waterfall chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none overflow-visible"
          >
            {showGrid &&
              ticks.map((tick, idx) => {
                const y = scaleLinear(tick, domain, [margin.top + plotH, margin.top]);
                return (
                  <g key={idx}>
                    <line
                      x1={margin.left}
                      x2={margin.left + plotW}
                      y1={y}
                      y2={y}
                      stroke="var(--wdr-chart-grid)"
                      strokeDasharray={idx === 0 ? undefined : '2 3'}
                    />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            {computed.map((step, idx) => {
              const cx = margin.left + idx * stepW + stepW / 2;
              const yStart = scaleLinear(step.start, domain, [margin.top + plotH, margin.top]);
              const yEnd = scaleLinear(step.end, domain, [margin.top + plotH, margin.top]);
              const rectY = Math.min(yStart, yEnd);
              const rectH = Math.max(2, Math.abs(yEnd - yStart));
              const fill =
                step.kind === 'total'
                  ? 'var(--wdr-chart-1)'
                  : step.value >= 0
                    ? 'var(--wdr-success)'
                    : 'var(--wdr-destructive)';

              const next = computed[idx + 1];

              return (
                <g
                  key={step.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${step.label}: ${formatChartValue(step.value, valueFormatter)}`}
                  onMouseEnter={() => setActiveId(step.id)}
                  onFocus={() => setActiveId(step.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onBlur={() => setActiveId(null)}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={cx - barW / 2}
                    y={rectY}
                    width={barW}
                    height={rectH}
                    rx="2"
                    fill={fill}
                    opacity={activeId === null || activeId === step.id ? 1 : 0.65}
                  />
                  {next && (
                    <line
                      x1={cx + barW / 2}
                      x2={cx + stepW - barW / 2}
                      y1={yEnd}
                      y2={yEnd}
                      stroke="var(--wdr-chart-axis)"
                      strokeDasharray="2 2"
                    />
                  )}
                  <text
                    x={cx}
                    y={margin.top + plotH + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--wdr-chart-axis-text)"
                  >
                    {step.label.slice(0, 12)}
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
