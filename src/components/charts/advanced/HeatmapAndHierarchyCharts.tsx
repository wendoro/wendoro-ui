import * as React from 'react';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import { getSeriesColor } from '../core/patterns';
import type { BaseChartProps } from '../core/types';

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
}

export interface HeatmapChartProps extends BaseChartProps {
  xLabels: string[];
  yLabels: string[];
  cells: HeatmapCell[];
}

export function HeatmapChart({
  xLabels,
  yLabels,
  cells,
  title,
  subtitle,
  description,
  height = 260,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: HeatmapChartProps) {
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const values = cells.map((c) => c.value);
  const maxVal = Math.max(1, ...values);
  const minVal = Math.min(0, ...values);

  const cellMap = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const c of cells) m.set(`${c.x}::${c.y}`, c.value);
    return m;
  }, [cells]);

  const tableColumns = [
    { key: 'y', label: 'Row' },
    ...xLabels.map((x) => ({ key: x, label: x })),
  ];
  const tableRows = yLabels.map((y) => {
    const row: Record<string, string> = { y };
    for (const x of xLabels) {
      const val = cellMap.get(`${x}::${y}`);
      row[x] = val === undefined ? '0' : formatChartValue(val, valueFormatter);
    }
    return row;
  });

  const activeCell = activeKey
    ? (() => {
        const [x, y] = activeKey.split('::');
        return { x, y, value: cellMap.get(activeKey) ?? 0 };
      })()
    : undefined;

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? (xLabels.length === 0 || yLabels.length === 0)}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeCell ? (
          <ChartTooltip
            title={`${activeCell.y} · ${activeCell.x}`}
            rows={[
              {
                key: 'v',
                label: 'Value',
                value: formatChartValue(activeCell.value, valueFormatter),
                color: 'var(--wdr-chart-2)',
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const margin = { top: 24, right: 16, bottom: 28, left: 76 };
        const plotW = Math.max(80, svgWidth - margin.left - margin.right);
        const plotH = Math.max(100, height - margin.top - margin.bottom);
        const cellW = plotW / Math.max(1, xLabels.length);
        const cellH = plotH / Math.max(1, yLabels.length);

        return (
          <svg
            role="img"
            aria-label={title ?? 'Heatmap matrix'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {xLabels.map((x, xi) => (
              <text
                key={x}
                x={margin.left + xi * cellW + cellW / 2}
                y={14}
                textAnchor="middle"
                fontSize="10"
                fill="var(--wdr-chart-axis-text)"
              >
                {x}
              </text>
            ))}

            {yLabels.map((y, yi) => (
              <g key={y}>
                <text
                  x={margin.left - 8}
                  y={margin.top + yi * cellH + cellH / 2 + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--wdr-chart-axis-text)"
                >
                  {y}
                </text>
                {xLabels.map((x, xi) => {
                  const key = `${x}::${y}`;
                  const v = cellMap.get(key) ?? 0;
                  const ratio = maxVal > minVal ? (v - minVal) / (maxVal - minVal) : 0;
                  const rx = margin.left + xi * cellW + 1.5;
                  const ry = margin.top + yi * cellH + 1.5;
                  return (
                    <g
                      key={key}
                      tabIndex={0}
                      role="button"
                      aria-label={`${y}, ${x}: ${formatChartValue(v, valueFormatter)}`}
                      onMouseEnter={() => setActiveKey(key)}
                      onFocus={() => setActiveKey(key)}
                      onMouseLeave={() => setActiveKey(null)}
                      onBlur={() => setActiveKey(null)}
                      className="cursor-pointer focus:outline-none"
                    >
                      <rect
                        x={rx}
                        y={ry}
                        width={Math.max(4, cellW - 3)}
                        height={Math.max(4, cellH - 3)}
                        rx="3"
                        fill={ratio >= 0.72 ? 'var(--wdr-chart-3)' : 'var(--wdr-chart-2)'}
                        fillOpacity={Math.max(0.12, ratio * 0.92)}
                        stroke={activeKey === key ? 'var(--wdr-foreground)' : 'var(--wdr-border)'}
                        strokeWidth={activeKey === key ? 1.5 : 0.5}
                      />
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface CalendarHeatmapDay {
  date: string;
  value: number;
}

export interface CalendarHeatmapProps extends BaseChartProps {
  days: CalendarHeatmapDay[];
}

export function CalendarHeatmap({
  days,
  title,
  subtitle,
  description,
  height = 170,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: CalendarHeatmapProps) {
  const [activeDay, setActiveDay] = React.useState<CalendarHeatmapDay | null>(null);
  const maxVal = Math.max(1, ...days.map((d) => d.value));

  const weeks = React.useMemo(() => {
    const chunks: CalendarHeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [days]);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? days.length === 0}
      tableColumns={[
        { key: 'date', label: 'Date' },
        { key: 'value', label: 'Activity' },
      ]}
      tableRows={days.map((d) => ({
        date: d.date,
        value: formatChartValue(d.value, valueFormatter),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeDay ? (
          <ChartTooltip
            title={activeDay.date}
            rows={[
              {
                key: activeDay.date,
                label: 'Activity',
                value: formatChartValue(activeDay.value, valueFormatter),
                color: 'var(--wdr-chart-2)',
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const colCount = Math.max(1, weeks.length);
        const svgWidth = Math.max(300, width);
        const marginLeft = 34;
        const cellSize = Math.min(18, Math.max(8, (svgWidth - marginLeft - 16) / colCount - 2));
        const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

        return (
          <svg
            role="img"
            aria-label={title ?? 'Calendar activity heatmap'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {dayLabels.map((lbl, idx) => (
              <text
                key={idx}
                x={12}
                y={16 + idx * (cellSize + 3) + cellSize * 0.72}
                fontSize="9"
                fill="var(--wdr-chart-axis-text)"
              >
                {lbl}
              </text>
            ))}

            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => {
                const ratio = day.value / maxVal;
                return (
                  <rect
                    key={day.date}
                    x={marginLeft + wIdx * (cellSize + 3)}
                    y={12 + dIdx * (cellSize + 3)}
                    width={cellSize}
                    height={cellSize}
                    rx="2"
                    fill={day.value <= 0 ? 'var(--wdr-muted)' : 'var(--wdr-chart-2)'}
                    fillOpacity={day.value <= 0 ? 0.65 : Math.max(0.25, ratio)}
                    stroke={activeDay?.date === day.date ? 'var(--wdr-foreground)' : 'var(--wdr-border)'}
                    strokeWidth={activeDay?.date === day.date ? 1.5 : 0.5}
                    tabIndex={0}
                    role="button"
                    aria-label={`${day.date}: ${formatChartValue(day.value, valueFormatter)}`}
                    onMouseEnter={() => setActiveDay(day)}
                    onFocus={() => setActiveDay(day)}
                    onMouseLeave={() => setActiveDay(null)}
                    onBlur={() => setActiveDay(null)}
                    className="cursor-pointer focus:outline-none"
                  />
                );
              })
            )}
          </svg>
        );
      }}
    </ChartContainer>
  );
}

export interface TreemapNode {
  id: string;
  label: string;
  value: number;
  color?: string;
}

export interface TreemapChartProps extends BaseChartProps {
  nodes: TreemapNode[];
}

export function TreemapChart({
  nodes,
  title,
  subtitle,
  description,
  height = 250,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: TreemapChartProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sorted = React.useMemo(
    () => [...nodes].filter((n) => n.value > 0).sort((a, b) => b.value - a.value),
    [nodes]
  );

  const activeNode = sorted.find((n) => n.id === activeId);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? sorted.length === 0}
      tableColumns={[
        { key: 'label', label: 'Node' },
        { key: 'value', label: 'Weight' },
      ]}
      tableRows={sorted.map((n) => ({
        label: n.label,
        value: formatChartValue(n.value, valueFormatter),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeNode ? (
          <ChartTooltip
            title={activeNode.label}
            rows={[
              {
                key: activeNode.id,
                label: 'Value',
                value: formatChartValue(activeNode.value, valueFormatter),
                color: getSeriesColor(sorted.indexOf(activeNode), activeNode.color),
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(300, width);
        const total = sorted.reduce((acc, n) => acc + n.value, 0) || 1;
        // Slice-and-dice recursive partition for clean, overlap-free treemap rectangles
        const rects: Array<{ node: TreemapNode; x: number; y: number; w: number; h: number; idx: number }> = [];
        let rx = 0;
        let ry = 0;
        let rw = svgWidth;
        let rh = height;
        let remaining = total;

        sorted.forEach((node, idx) => {
          const share = node.value / Math.max(1, remaining);
          if (rw >= rh) {
            const w = rw * share;
            rects.push({ node, x: rx, y: ry, w, h: rh, idx });
            rx += w;
            rw -= w;
          } else {
            const h = rh * share;
            rects.push({ node, x: rx, y: ry, w: rw, h, idx });
            ry += h;
            rh -= h;
          }
          remaining -= node.value;
        });

        return (
          <svg
            role="img"
            aria-label={title ?? 'Treemap chart'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none"
          >
            {rects.map(({ node, x, y, w, h, idx }) => {
              const color = getSeriesColor(idx, node.color);
              return (
                <g
                  key={node.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}: ${formatChartValue(node.value, valueFormatter)}`}
                  onMouseEnter={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onBlur={() => setActiveId(null)}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={x + 1.5}
                    y={y + 1.5}
                    width={Math.max(4, w - 3)}
                    height={Math.max(4, h - 3)}
                    rx="4"
                    fill={color}
                    fillOpacity={activeId === null || activeId === node.id ? 0.85 : 0.55}
                    stroke="var(--wdr-surface)"
                    strokeWidth="2"
                  />
                  {w > 64 && h > 36 && (
                    <text x={x + 10} y={y + 20} fontSize="11" fontWeight="600" fill="var(--wdr-surface)">
                      {node.label.slice(0, 14)}
                    </text>
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

export interface SankeyNode {
  id: string;
  label: string;
  column: number;
  color?: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartProps extends BaseChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export function SankeyChart({
  nodes,
  links,
  title,
  subtitle,
  description,
  height = 260,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: SankeyChartProps) {
  const [activeLinkIdx, setActiveLinkIdx] = React.useState<number | null>(null);
  const nodeMap = React.useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const maxCol = Math.max(1, ...nodes.map((n) => n.column));

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? (nodes.length === 0 || links.length === 0)}
      tableColumns={[
        { key: 'source', label: 'Source' },
        { key: 'target', label: 'Target' },
        { key: 'value', label: 'Flow' },
      ]}
      tableRows={links.map((l) => ({
        source: nodeMap.get(l.source)?.label ?? l.source,
        target: nodeMap.get(l.target)?.label ?? l.target,
        value: formatChartValue(l.value, valueFormatter),
      }))}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeLinkIdx !== null && links[activeLinkIdx] ? (
          <ChartTooltip
            title={`${nodeMap.get(links[activeLinkIdx].source)?.label ?? links[activeLinkIdx].source} -> ${nodeMap.get(links[activeLinkIdx].target)?.label ?? links[activeLinkIdx].target}`}
            rows={[
              {
                key: 'flow',
                label: 'Flow volume',
                value: formatChartValue(links[activeLinkIdx].value, valueFormatter),
                color: 'var(--wdr-chart-2)',
              },
            ]}
          />
        ) : undefined
      }
    >
      {(width) => {
        const svgWidth = Math.max(320, width);
        const padX = 24;
        const padY = 18;
        const nodeW = 14;
        const colSpan = (svgWidth - padX * 2 - nodeW) / Math.max(1, maxCol);

        // Compute node totals and vertical layout per column
        const nodePositions = new Map<string, { x: number; y: number; h: number; color: string; label: string }>();
        const cols = Array.from({ length: maxCol + 1 }, (_, c) => nodes.filter((n) => n.column === c));

        cols.forEach((colNodes, cIdx) => {
          const weights = colNodes.map((n) => {
            const outSum = links.filter((l) => l.source === n.id).reduce((a, b) => a + b.value, 0);
            const inSum = links.filter((l) => l.target === n.id).reduce((a, b) => a + b.value, 0);
            return Math.max(1, outSum, inSum);
          });
          const totalW = weights.reduce((a, b) => a + b, 0) || 1;
          const availH = height - padY * 2 - Math.max(0, colNodes.length - 1) * 12;
          let curY = padY;

          colNodes.forEach((node, nIdx) => {
            const h = Math.max(18, (weights[nIdx] / totalW) * availH);
            const x = padX + cIdx * colSpan;
            nodePositions.set(node.id, {
              x,
              y: curY,
              h,
              color: getSeriesColor(cIdx + nIdx, node.color),
              label: node.label,
            });
            curY += h + 12;
          });
        });

        const totalFlowMax = Math.max(1, ...links.map((l) => l.value));

        return (
          <svg
            role="img"
            aria-label={title ?? 'Sankey flow diagram'}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="h-auto w-full select-none overflow-visible"
          >
            {links.map((link, idx) => {
              const s = nodePositions.get(link.source);
              const t = nodePositions.get(link.target);
              if (!s || !t) return null;
              const x0 = s.x + nodeW;
              const y0 = s.y + s.h / 2;
              const x1 = t.x;
              const y1 = t.y + t.h / 2;
              const midX = (x0 + x1) / 2;
              const strokeW = Math.max(3, (link.value / totalFlowMax) * 20);

              return (
                <path
                  key={`${link.source}-${link.target}-${idx}`}
                  d={`M ${x0} ${y0} C ${midX} ${y0}, ${midX} ${y1}, ${x1} ${y1}`}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={strokeW}
                  strokeOpacity={activeLinkIdx === null || activeLinkIdx === idx ? 0.35 : 0.14}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.label} to ${t.label}: ${formatChartValue(link.value, valueFormatter)}`}
                  onMouseEnter={() => setActiveLinkIdx(idx)}
                  onFocus={() => setActiveLinkIdx(idx)}
                  onMouseLeave={() => setActiveLinkIdx(null)}
                  onBlur={() => setActiveLinkIdx(null)}
                  className="cursor-pointer focus:outline-none"
                />
              );
            })}

            {Array.from(nodePositions.entries()).map(([id, pos]) => {
              const isRight = pos.x > svgWidth * 0.65;
              return (
                <g key={id}>
                  <rect x={pos.x} y={pos.y} width={nodeW} height={pos.h} rx="2" fill={pos.color} />
                  <text
                    x={isRight ? pos.x - 6 : pos.x + nodeW + 6}
                    y={pos.y + pos.h / 2 + 3}
                    textAnchor={isRight ? 'end' : 'start'}
                    fontSize="11"
                    fill="var(--wdr-foreground)"
                  >
                    {pos.label}
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
