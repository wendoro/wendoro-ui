import * as React from 'react';
import { ChartContainer } from '../core/ChartContainer';
import { ChartTooltip } from '../core/ChartTooltip';
import { formatChartValue } from '../core/formatters';
import type { BaseChartProps } from '../core/types';

export interface GeoRegionDatum {
  id: string;
  name: string;
  code: string;
  value: number;
  category?: string;
  /** Optional custom SVG path for true geographic vector map integration */
  path?: string;
  /** Grid coordinates (0-indexed) used when rendering the responsive regional tile map */
  col?: number;
  row?: number;
}

export interface GeoRegionChartProps extends BaseChartProps {
  regions: GeoRegionDatum[];
  viewBox?: string;
  selectedRegionId?: string;
  onSelectRegion?: (region: GeoRegionDatum) => void;
  unitLabel?: string;
}

export function GeoRegionChart({
  regions,
  viewBox,
  selectedRegionId,
  onSelectRegion,
  unitLabel = 'Value',
  title,
  subtitle,
  description,
  height = 280,
  showTableToggle = true,
  valueFormatter,
  loading,
  error,
  onRetry,
  empty,
  className,
}: GeoRegionChartProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const values = regions.map((r) => r.value);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(1, ...values) : 1;

  const activeRegion =
    regions.find((r) => r.id === hoveredId) ??
    regions.find((r) => r.id === selectedRegionId);

  const hasVectorPaths = regions.length > 0 && regions.every((r) => Boolean(r.path));

  const tableColumns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Region' },
    { key: 'category', label: 'Zone' },
    { key: 'value', label: unitLabel },
  ];

  const tableRows = regions.map((r) => ({
    code: r.code,
    name: r.name,
    category: r.category ?? '—',
    value: formatChartValue(r.value, valueFormatter),
  }));

  const getRegionTone = (value: number) => {
    const ratio = maxVal > minVal ? (value - minVal) / (maxVal - minVal) : 0.5;
    if (ratio >= 0.78) {
      return { fill: 'var(--wdr-chart-3)', opacity: 0.9, tier: 'High' };
    }
    if (ratio >= 0.4) {
      return { fill: 'var(--wdr-chart-2)', opacity: 0.55 + ratio * 0.4, tier: 'Medium' };
    }
    return { fill: 'var(--wdr-chart-1)', opacity: 0.25 + ratio * 0.5, tier: 'Baseline' };
  };

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      description={description}
      loading={loading}
      error={error}
      onRetry={onRetry}
      empty={empty ?? regions.length === 0}
      tableColumns={tableColumns}
      tableRows={tableRows}
      showTableToggle={showTableToggle}
      className={className}
      minHeight={height}
      tooltipContent={
        activeRegion ? (
          <ChartTooltip
            title={`${activeRegion.name} (${activeRegion.code})`}
            rows={[
              {
                key: activeRegion.id,
                label: unitLabel,
                value: formatChartValue(activeRegion.value, valueFormatter),
                color: getRegionTone(activeRegion.value).fill,
              },
            ]}
          />
        ) : undefined
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span>
            Range: {formatChartValue(minVal, valueFormatter)} – {formatChartValue(maxVal, valueFormatter)}
          </span>
          <span className="text-muted-foreground">
            {hasVectorPaths ? 'Vector choropleth mode' : 'Accessible regional tile-grid mode'}
          </span>
        </div>
      }
    >
      {(width) => {
        const svgWidth = Math.max(320, width);

        if (hasVectorPaths) {
          return (
            <svg
              role="img"
              aria-label={title ?? 'Geographic region map'}
              viewBox={viewBox ?? '0 0 600 300'}
              className="h-auto w-full select-none"
            >
              {regions.map((region) => {
                const tone = getRegionTone(region.value);
                const isSelected = region.id === selectedRegionId || region.id === hoveredId;
                return (
                  <path
                    key={region.id}
                    d={region.path}
                    fill={tone.fill}
                    fillOpacity={tone.opacity}
                    stroke={isSelected ? 'var(--wdr-foreground)' : 'var(--wdr-border)'}
                    strokeWidth={isSelected ? 2 : 1}
                    tabIndex={0}
                    role="button"
                    aria-pressed={region.id === selectedRegionId}
                    aria-label={`${region.name}: ${formatChartValue(region.value, valueFormatter)}`}
                    onMouseEnter={() => setHoveredId(region.id)}
                    onFocus={() => setHoveredId(region.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => onSelectRegion?.(region)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectRegion?.(region);
                      }
                    }}
                    className="cursor-pointer transition-opacity focus:outline-none"
                  />
                );
              })}
            </svg>
          );
        }

        // Compute deterministic grid coordinates when explicit vector paths aren't provided
        const autoCols = Math.max(3, Math.min(6, Math.ceil(Math.sqrt(regions.length * 1.5))));
        const positioned = regions.map((r, idx) => ({
          region: r,
          col: r.col ?? idx % autoCols,
          row: r.row ?? Math.floor(idx / autoCols),
        }));
        const maxCol = Math.max(1, ...positioned.map((p) => p.col + 1));
        const maxRow = Math.max(1, ...positioned.map((p) => p.row + 1));
        const pad = 12;
        const gap = 8;
        const cellW = Math.max(52, (svgWidth - pad * 2 - gap * (maxCol - 1)) / maxCol);
        const cellH = Math.max(46, Math.min(72, (height - pad * 2 - gap * (maxRow - 1)) / maxRow));
        const svgHeight = pad * 2 + maxRow * cellH + (maxRow - 1) * gap;

        return (
          <svg
            role="img"
            aria-label={title ?? 'Regional choropleth tile map'}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="h-auto w-full select-none"
          >
            {positioned.map(({ region, col, row }) => {
              const x = pad + col * (cellW + gap);
              const y = pad + row * (cellH + gap);
              const tone = getRegionTone(region.value);
              const isSelected = region.id === selectedRegionId || region.id === hoveredId;

              return (
                <g
                  key={region.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={region.id === selectedRegionId}
                  aria-label={`${region.name} (${region.code}): ${formatChartValue(region.value, valueFormatter)}`}
                  onMouseEnter={() => setHoveredId(region.id)}
                  onFocus={() => setHoveredId(region.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => onSelectRegion?.(region)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectRegion?.(region);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                >
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    rx="6"
                    fill={tone.fill}
                    fillOpacity={tone.opacity}
                    stroke={isSelected ? 'var(--wdr-foreground)' : 'var(--wdr-border)'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 - 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--wdr-foreground)"
                  >
                    {region.code}
                  </text>
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 + 12}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--wdr-foreground)"
                  >
                    {formatChartValue(region.value, valueFormatter)}
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
