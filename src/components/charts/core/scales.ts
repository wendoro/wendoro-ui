export function computeNiceDomain(
  values: number[],
  options?: { includeZero?: boolean; paddingRatio?: number; minFloor?: number }
): [number, number] {
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return [0, 100];

  let min = Math.min(...finite);
  let max = Math.max(...finite);

  if (options?.includeZero !== false) {
    if (min > 0) min = 0;
    if (max < 0) max = 0;
  }

  if (min === max) {
    const delta = min === 0 ? 10 : Math.abs(min) * 0.2;
    return [min === 0 ? 0 : min - delta, max + delta];
  }

  const span = max - min;
  const pad = span * (options?.paddingRatio ?? 0.08);
  const paddedMin = min < 0 || options?.includeZero === false ? min - pad : Math.max(0, min);
  const paddedMax = max + pad;

  const finalMin = options?.minFloor !== undefined ? Math.max(options.minFloor, paddedMin) : paddedMin;
  return [finalMin, paddedMax];
}

export function generateLinearTicks(domain: [number, number], count = 5): number[] {
  const [min, max] = domain;
  if (count <= 1 || min === max) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, idx) => Number((min + step * idx).toFixed(6)));
}

export function scaleLinear(
  value: number,
  domain: [number, number],
  range: [number, number]
): number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  if (d1 === d0) return (r0 + r1) / 2;
  const ratio = (value - d0) / (d1 - d0);
  return r0 + ratio * (r1 - r0);
}

export function buildLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`)
    .join(' ');
}

export function buildAreaPath(
  points: Array<{ x: number; y: number }>,
  baselineY: number
): string {
  if (points.length === 0) return '';
  const top = buildLinePath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${top} L ${last.x.toFixed(2)} ${baselineY.toFixed(2)} L ${first.x.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

export function buildBandAreaPath(
  upper: Array<{ x: number; y: number }>,
  lower: Array<{ x: number; y: number }>
): string {
  if (upper.length === 0 || lower.length === 0) return '';
  const forward = buildLinePath(upper);
  const back = [...lower]
    .reverse()
    .map((pt) => `L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`)
    .join(' ');
  return `${forward} ${back} Z`;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function describeArcSegment(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const clampedEnd = Math.min(startAngle + 359.999, endAngle);
  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, clampedEnd);
  const largeArc = clampedEnd - startAngle <= 180 ? '0' : '1';

  if (innerRadius <= 0) {
    return [
      `M ${cx.toFixed(2)} ${cy.toFixed(2)}`,
      `L ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
      `A ${outerRadius.toFixed(2)} ${outerRadius.toFixed(2)} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
      'Z',
    ].join(' ');
  }

  const innerEnd = polarToCartesian(cx, cy, innerRadius, clampedEnd);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${outerStart.x.toFixed(2)} ${outerStart.y.toFixed(2)}`,
    `A ${outerRadius.toFixed(2)} ${outerRadius.toFixed(2)} 0 ${largeArc} 1 ${outerEnd.x.toFixed(2)} ${outerEnd.y.toFixed(2)}`,
    `L ${innerEnd.x.toFixed(2)} ${innerEnd.y.toFixed(2)}`,
    `A ${innerRadius.toFixed(2)} ${innerRadius.toFixed(2)} 0 ${largeArc} 0 ${innerStart.x.toFixed(2)} ${innerStart.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export function sanitizeSvgId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '-');
}
