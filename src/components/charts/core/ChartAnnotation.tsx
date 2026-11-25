import { scaleLinear } from './scales';
import type { ChartAnnotation, ChartMargin, ChartThreshold } from './types';

export function ChartThresholdsOverlay({
  thresholds,
  yDomain,
  plotWidth,
  plotHeight,
  margin,
}: {
  thresholds?: ChartThreshold[];
  yDomain: [number, number];
  plotWidth: number;
  plotHeight: number;
  margin: ChartMargin;
}) {
  if (!thresholds || thresholds.length === 0) return null;

  return (
    <g aria-label="Reference threshold lines">
      {thresholds.map((t, idx) => {
        const y = scaleLinear(t.value, yDomain, [margin.top + plotHeight, margin.top]);
        const stroke = t.color ?? 'var(--wdr-chart-threshold)';
        return (
          <g key={`${t.value}-${idx}`}>
            <line
              x1={margin.left}
              x2={margin.left + plotWidth}
              y1={y}
              y2={y}
              stroke={stroke}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {t.label && (
              <text
                x={margin.left + plotWidth - 4}
                y={y - 5}
                textAnchor="end"
                fill={stroke}
                fontSize="10"
                fontWeight="600"
              >
                {t.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export function ChartAnnotationsOverlay({
  annotations,
  xPositions,
  yDomain,
  plotHeight,
  margin,
}: {
  annotations?: ChartAnnotation[];
  xPositions: Map<string, number>;
  yDomain: [number, number];
  plotHeight: number;
  margin: ChartMargin;
}) {
  if (!annotations || annotations.length === 0) return null;

  return (
    <g aria-label="Chart annotations">
      {annotations.map((ann) => {
        const x = ann.xLabel !== undefined ? xPositions.get(ann.xLabel) : undefined;
        if (x === undefined) return null;
        const y = scaleLinear(ann.yValue, yDomain, [margin.top + plotHeight, margin.top]);
        const color = ann.color ?? 'var(--wdr-chart-annotation)';
        return (
          <g key={ann.id}>
            <circle cx={x} cy={y} r="5" fill="var(--wdr-surface)" stroke={color} strokeWidth="2" />
            <text
              x={x}
              y={Math.max(margin.top + 10, y - 10)}
              textAnchor="middle"
              fill={color}
              fontSize="10"
              fontWeight="600"
            >
              {ann.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
