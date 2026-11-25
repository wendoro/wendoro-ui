import {
  chartLineDashSequence,
  chartMarkerSequence,
  chartPaletteTokens,
  chartPatternSequence,
  type ChartMarkerKind,
  type ChartPatternKind,
} from '../../../tokens/colors';
import { sanitizeSvgId } from './scales';

const SERIES_VAR_LIST = [
  chartPaletteTokens.series1,
  chartPaletteTokens.series2,
  chartPaletteTokens.series3,
  chartPaletteTokens.series4,
  chartPaletteTokens.series5,
  chartPaletteTokens.series6,
  chartPaletteTokens.series7,
  chartPaletteTokens.series8,
];

export function getSeriesColor(index: number, customColor?: string): string {
  return customColor ?? SERIES_VAR_LIST[index % SERIES_VAR_LIST.length];
}

export function getSeriesPattern(index: number, custom?: ChartPatternKind): ChartPatternKind {
  return custom ?? chartPatternSequence[index % chartPatternSequence.length];
}

export function getSeriesDash(index: number, custom?: string): string | undefined {
  if (custom) return custom === 'none' ? undefined : custom;
  const dash = chartLineDashSequence[index % chartLineDashSequence.length];
  return dash === 'none' ? undefined : dash;
}

export function getSeriesMarker(index: number, custom?: ChartMarkerKind): ChartMarkerKind {
  return custom ?? chartMarkerSequence[index % chartMarkerSequence.length];
}

export function getPatternId(prefix: string, index: number): string {
  return sanitizeSvgId(`${prefix}-pat-${index}`);
}

export function ChartPatternDefs({
  prefix,
  seriesColors,
}: {
  prefix: string;
  seriesColors: string[];
}) {
  return (
    <defs>
      {seriesColors.map((color, idx) => {
        const id = getPatternId(prefix, idx);
        const kind = getSeriesPattern(idx);

        if (kind === 'solid') {
          return (
            <pattern key={id} id={id} width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={color} />
            </pattern>
          );
        }

        if (kind === 'diagonal-stripe') {
          return (
            <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill={color} fillOpacity="0.82" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="var(--wdr-surface)" strokeWidth="2.5" strokeOpacity="0.55" />
            </pattern>
          );
        }

        if (kind === 'dot-matrix') {
          return (
            <pattern key={id} id={id} width="7" height="7" patternUnits="userSpaceOnUse">
              <rect width="7" height="7" fill={color} fillOpacity="0.88" />
              <circle cx="3.5" cy="3.5" r="1.3" fill="var(--wdr-surface)" fillOpacity="0.65" />
            </pattern>
          );
        }

        if (kind === 'crosshatch') {
          return (
            <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill={color} fillOpacity="0.86" />
              <path d="M0 0L8 8M8 0L0 8" stroke="var(--wdr-surface)" strokeWidth="1.2" strokeOpacity="0.5" />
            </pattern>
          );
        }

        if (kind === 'vertical-stripe') {
          return (
            <pattern key={id} id={id} width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={color} fillOpacity="0.88" />
              <line x1="3" y1="0" x2="3" y2="6" stroke="var(--wdr-surface)" strokeWidth="1.8" strokeOpacity="0.55" />
            </pattern>
          );
        }

        if (kind === 'horizontal-stripe') {
          return (
            <pattern key={id} id={id} width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill={color} fillOpacity="0.88" />
              <line x1="0" y1="3" x2="6" y2="3" stroke="var(--wdr-surface)" strokeWidth="1.8" strokeOpacity="0.55" />
            </pattern>
          );
        }

        return (
          <pattern key={id} id={id} width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill={color} fillOpacity="0.84" />
            <rect x="2" y="2" width="2.5" height="2.5" fill="var(--wdr-surface)" fillOpacity="0.6" />
          </pattern>
        );
      })}
    </defs>
  );
}

export function ChartMarkerShape({
  kind,
  cx,
  cy,
  size = 4,
  fill,
  stroke = 'var(--wdr-surface)',
}: {
  kind: ChartMarkerKind;
  cx: number;
  cy: number;
  size?: number;
  fill: string;
  stroke?: string;
}) {
  if (kind === 'square') {
    return (
      <rect
        x={cx - size}
        y={cy - size}
        width={size * 2}
        height={size * 2}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
    );
  }
  if (kind === 'triangle') {
    const h = size * 1.2;
    const points = `${cx},${cy - h} ${cx + h},${cy + h} ${cx - h},${cy + h}`;
    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1.5" />;
  }
  if (kind === 'diamond') {
    const d = size * 1.25;
    const points = `${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`;
    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth="1.5" />;
  }
  if (kind === 'cross') {
    return (
      <path
        d={`M${cx - size} ${cy - size}L${cx + size} ${cy + size}M${cx + size} ${cy - size}L${cx - size} ${cy + size}`}
        stroke={fill}
        strokeWidth="2"
        strokeLinecap="round"
      />
    );
  }
  return <circle cx={cx} cy={cy} r={size} fill={fill} stroke={stroke} strokeWidth="1.5" />;
}
