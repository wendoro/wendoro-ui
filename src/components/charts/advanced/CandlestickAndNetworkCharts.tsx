import * as React from 'react';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { getSeriesColor } from '../core/patterns';
import { computeNiceDomain, generateLinearTicks, scaleLinear } from '../core/scales';
import type { BaseChartProps } from '../core/types';

/* -------------------------------------------------------------------------- */
/* CandlestickChart (OHLC Financial / Telemetry Volatility)                   */
/* -------------------------------------------------------------------------- */

export interface CandlestickPoint {
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface CandlestickChartProps extends BaseChartProps {
  data: CandlestickPoint[];
  onCandleSelect?: (point: CandlestickPoint, index: number) => void;
}

export function CandlestickChart({
  data,
  title,
  subtitle,
  description,
  summary,
  height = 280,
  showGrid = true,
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
  onCandleSelect,
}: CandlestickChartProps) {
  const [activeIdx, setActiveIdx] = React.useState<number | null>(null);

  const tableColumns = [
    { key: 'label', label: 'Period' },
    { key: 'open', label: 'Open' },
    { key: 'high', label: 'High' },
    { key: 'low', label: 'Low' },
    { key: 'close', label: 'Close' },
  ];

  const tableRows = data.map((d) => ({
    label: d.label,
    open: formatChartValue(d.open, valueFormatter),
    high: formatChartValue(d.high, valueFormatter),
    low: formatChartValue(d.low, valueFormatter),
    close: formatChartValue(d.close, valueFormatter),
  }));

  const activePoint = activeIdx !== null ? data[activeIdx] : undefined;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      summary={summary ?? `${title ?? 'Candlestick chart'} across ${data.length} OHLC intervals.`}
      loading={loading}
      error={error}
      errorTitle={errorTitle}
      onRetry={onRetry}
      empty={empty ?? data.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      legendItems={[
        { key: 'bullish', label: 'Bullish (Close >= Open)', color: 'var(--wdr-success)', active: true },
        { key: 'bearish', label: 'Bearish (Close < Open)', color: 'var(--wdr-destructive)', active: true },
      ]}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      actions={actions}
      footer={footer}
      aria-label={ariaLabel}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && activePoint ? (
          <ChartTooltip
            title={activePoint.label}
            rows={[
              { key: 'open', label: 'Open', value: formatChartValue(activePoint.open, valueFormatter), color: 'var(--wdr-chart-1)' },
              { key: 'high', label: 'High', value: formatChartValue(activePoint.high, valueFormatter), color: 'var(--wdr-success)' },
              { key: 'low', label: 'Low', value: formatChartValue(activePoint.low, valueFormatter), color: 'var(--wdr-destructive)' },
              { key: 'close', label: 'Close', value: formatChartValue(activePoint.close, valueFormatter), color: 'var(--wdr-chart-2)' },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(280, width);
        const margin = { top: 20, right: 20, bottom: 32, left: 56 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(120, height - margin.top - margin.bottom);
        const allPrices = data.flatMap((d) => [d.open, d.high, d.low, d.close]);
        const domain = computeNiceDomain(allPrices, { includeZero: false });
        const ticks = generateLinearTicks(domain, 5);
        const step = plotW / Math.max(1, data.length);
        const bodyW = Math.min(28, Math.max(6, step * 0.55));
        const labelEvery = Math.max(1, Math.ceil(data.length / 7));

        return (
          <svg
            role="img"
            aria-label={title ?? ariaLabel ?? 'Candlestick OHLC chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
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
                      strokeDasharray="2 3"
                    />
                    <text x={margin.left - 8} y={y + 3} textAnchor="end" fontSize="11" fill="var(--wdr-chart-axis-text)" className="tabular-nums">
                      {formatChartValue(tick, valueFormatter)}
                    </text>
                  </g>
                );
              })}

            <line
              x1={margin.left}
              x2={margin.left + plotW}
              y1={margin.top + plotH}
              y2={margin.top + plotH}
              stroke="var(--wdr-chart-axis)"
              strokeWidth="1"
            />

            {data.map((d, idx) => {
              const cx = margin.left + idx * step + step / 2;
              const yHigh = scaleLinear(d.high, domain, [margin.top + plotH, margin.top]);
              const yLow = scaleLinear(d.low, domain, [margin.top + plotH, margin.top]);
              const yOpen = scaleLinear(d.open, domain, [margin.top + plotH, margin.top]);
              const yClose = scaleLinear(d.close, domain, [margin.top + plotH, margin.top]);
              const bullish = d.close >= d.open;
              const strokeColor = bullish ? 'var(--wdr-success)' : 'var(--wdr-destructive)';
              const fillColor = bullish ? 'var(--wdr-success)' : 'var(--wdr-destructive)';
              const rectY = Math.min(yOpen, yClose);
              const rectH = Math.max(2, Math.abs(yOpen - yClose));
              const showLabel = idx % labelEvery === 0 || idx === data.length - 1;

              return (
                <g key={`${d.label}-${idx}`}>
                  <line x1={cx} x2={cx} y1={yHigh} y2={yLow} stroke={strokeColor} strokeWidth="1.75" />
                  <rect
                    x={cx - bodyW / 2}
                    y={rectY}
                    width={bodyW}
                    height={rectH}
                    rx="1.5"
                    fill={fillColor}
                    fillOpacity={bullish ? '0.3' : '0.88'}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                  />
                  {showLabel && (
                    <text x={cx} y={margin.top + plotH + 18} textAnchor="middle" fontSize="10" fill="var(--wdr-chart-axis-text)">
                      {d.label}
                    </text>
                  )}
                  <rect
                    x={cx - Math.max(10, step / 2)}
                    y={margin.top}
                    width={Math.max(20, step)}
                    height={plotH}
                    fill="transparent"
                    tabIndex={0}
                    role="button"
                    aria-label={`${d.label}: Open ${formatChartValue(d.open, valueFormatter)}, High ${formatChartValue(d.high, valueFormatter)}, Low ${formatChartValue(d.low, valueFormatter)}, Close ${formatChartValue(d.close, valueFormatter)}`}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onFocus={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(null)}
                    onBlur={() => setActiveIdx(null)}
                    onClick={() => onCandleSelect?.(d, idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onCandleSelect?.(d, idx);
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

/* -------------------------------------------------------------------------- */
/* NetworkGraphChart (Topology & Dependency Relationship Graph)               */
/* -------------------------------------------------------------------------- */

export interface NetworkGraphNode {
  id: string;
  label: string;
  group?: string;
  weight?: number;
  x?: number; // optional normalized 0..100
  y?: number; // optional normalized 0..100
}

export interface NetworkGraphEdge {
  source: string;
  target: string;
  label?: string;
  strength?: number;
}

export interface NetworkGraphChartProps extends BaseChartProps {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
  onNodeSelect?: (node: NetworkGraphNode) => void;
}

export function NetworkGraphChart({
  nodes,
  edges,
  title,
  subtitle,
  description,
  summary,
  height = 300,
  showTableToggle = true,
  interactiveTooltip = true,
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
  onNodeSelect,
}: NetworkGraphChartProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const groups = React.useMemo(
    () => Array.from(new Set(nodes.map((n) => n.group ?? 'default'))),
    [nodes]
  );

  const selectedNode = nodes.find((n) => n.id === selectedId);
  const connectedCount = selectedNode
    ? edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length
    : 0;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      summary={summary ?? `${title ?? 'Network graph'} with ${nodes.length} nodes and ${edges.length} links.`}
      loading={loading}
      error={error}
      errorTitle={errorTitle}
      onRetry={onRetry}
      empty={empty ?? nodes.length === 0}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      legendItems={
        groups.length > 1
          ? groups.map((g, idx) => ({
              key: g,
              label: g,
              color: getSeriesColor(idx),
              active: true,
            }))
          : undefined
      }
      tableColumns={[
        { key: 'node', label: 'Node' },
        { key: 'group', label: 'Group' },
        { key: 'degree', label: 'Connections' },
      ]}
      tableRows={nodes.map((n) => ({
        node: n.label,
        group: n.group ?? 'default',
        degree: String(edges.filter((e) => e.source === n.id || e.target === n.id).length),
      }))}
      showTableToggle={showTableToggle}
      actions={actions}
      footer={footer}
      aria-label={ariaLabel}
      className={className}
      minHeight={height}
      tooltipContent={
        interactiveTooltip && selectedNode ? (
          <ChartTooltip
            title={selectedNode.label}
            rows={[
              { key: 'group', label: 'Group', value: selectedNode.group ?? 'default', color: getSeriesColor(groups.indexOf(selectedNode.group ?? 'default')) },
              { key: 'links', label: 'Edges', value: String(connectedCount), color: 'var(--wdr-chart-1)' },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const cx = svgWidth / 2;
        const cy = height / 2;
        const rx = Math.max(80, svgWidth * 0.36);
        const ry = Math.max(70, height * 0.34);

        const positioned = new Map<string, { x: number; y: number; node: NetworkGraphNode; color: string; r: number }>();
        nodes.forEach((n, idx) => {
          const angle = (2 * Math.PI * idx) / Math.max(1, nodes.length) - Math.PI / 2;
          const px =
            typeof n.x === 'number'
              ? 44 + (Math.max(0, Math.min(100, n.x)) / 100) * (svgWidth - 88)
              : cx + Math.cos(angle) * rx;
          const py =
            typeof n.y === 'number'
              ? 36 + (Math.max(0, Math.min(100, n.y)) / 100) * (height - 72)
              : cy + Math.sin(angle) * ry;
          const gIdx = Math.max(0, groups.indexOf(n.group ?? 'default'));
          const r = Math.min(22, Math.max(11, 10 + (n.weight ?? 1) * 2.2));
          positioned.set(n.id, { x: px, y: py, node: n, color: getSeriesColor(gIdx), r });
        });

        return (
          <svg
            role="img"
            aria-label={title ?? ariaLabel ?? 'Network dependency graph'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {edges.map((edge, idx) => {
              const s = positioned.get(edge.source);
              const t = positioned.get(edge.target);
              if (!s || !t) return null;
              const isHighlighted =
                selectedId === null || selectedId === edge.source || selectedId === edge.target;
              const midX = (s.x + t.x) / 2;
              const midY = (s.y + t.y) / 2;
              return (
                <g key={`${edge.source}-${edge.target}-${idx}`} opacity={isHighlighted ? 1 : 0.2}>
                  <line
                    x1={s.x}
                    y1={s.y}
                    x2={t.x}
                    y2={t.y}
                    stroke="var(--wdr-chart-axis)"
                    strokeWidth={Math.max(1.2, Math.min(4, edge.strength ?? 1.5))}
                    strokeOpacity={isHighlighted ? 0.65 : 0.3}
                  />
                  {edge.label && (
                    <text
                      x={midX}
                      y={midY - 4}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill="var(--wdr-chart-axis-text)"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {Array.from(positioned.values()).map(({ x, y, node, color, r }) => {
              const isSelected = selectedId === node.id;
              const isAdjacent =
                selectedId === null ||
                isSelected ||
                edges.some(
                  (e) =>
                    (e.source === selectedId && e.target === node.id) ||
                    (e.target === selectedId && e.source === node.id)
                );

              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}${node.group ? `, group ${node.group}` : ''}`}
                  opacity={isAdjacent ? 1 : 0.35}
                  onMouseEnter={() => setSelectedId(node.id)}
                  onFocus={() => setSelectedId(node.id)}
                  onMouseLeave={() => setSelectedId(null)}
                  onBlur={() => setSelectedId(null)}
                  onClick={() => {
                    setSelectedId(node.id);
                    onNodeSelect?.(node);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(node.id);
                      onNodeSelect?.(node);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? r + 3 : r}
                    fill={color}
                    fillOpacity="0.88"
                    stroke={isSelected ? 'var(--wdr-foreground)' : 'var(--wdr-surface)'}
                    strokeWidth={isSelected ? '2.5' : '2'}
                  />
                  <text
                    x={x}
                    y={y + r + 13}
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fill="var(--wdr-chart-axis-text)"
                  >
                    {node.label}
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
