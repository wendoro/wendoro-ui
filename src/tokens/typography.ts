/**
 * Wendoro UI Typography Tokens
 * Primary font: Inter | Monospace: JetBrains Mono
 * Includes semantic roles and tabular numeric display presets.
 */

export const fontFamilies = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export interface TypographyScaleToken {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  fontWeight: number;
  fontVariantNumeric?: string;
  fontFamily?: string;
}

export const typographyScale = {
  display: {
    fontSize: 'clamp(2.25rem, 3.6vw, 3.25rem)',
    lineHeight: '1.1',
    letterSpacing: '-0.03em',
    fontWeight: fontWeights.bold,
  },
  pageTitle: {
    fontSize: 'clamp(1.5rem, 2.2vw, 1.875rem)',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    fontWeight: fontWeights.bold,
  },
  sectionTitle: {
    fontSize: '1.25rem',
    lineHeight: '1.3',
    letterSpacing: '-0.018em',
    fontWeight: fontWeights.semibold,
  },
  cardTitle: {
    fontSize: '1rem',
    lineHeight: '1.35',
    letterSpacing: '-0.01em',
    fontWeight: fontWeights.semibold,
  },
  h1: {
    fontSize: '2rem',
    lineHeight: '1.2',
    letterSpacing: '-0.025em',
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontSize: '1.5rem',
    lineHeight: '1.25',
    letterSpacing: '-0.02em',
    fontWeight: fontWeights.semibold,
  },
  h3: {
    fontSize: '1.25rem',
    lineHeight: '1.35',
    letterSpacing: '-0.015em',
    fontWeight: fontWeights.semibold,
  },
  h4: {
    fontSize: '1.0625rem',
    lineHeight: '1.4',
    letterSpacing: '-0.01em',
    fontWeight: fontWeights.semibold,
  },
  body: {
    fontSize: '0.9375rem',
    lineHeight: '1.6',
    letterSpacing: '0em',
    fontWeight: fontWeights.regular,
  },
  bodySmall: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontWeight: fontWeights.regular,
  },
  small: {
    fontSize: '0.875rem',
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: fontWeights.regular,
  },
  label: {
    fontSize: '0.8125rem',
    lineHeight: '1.35',
    letterSpacing: '0.005em',
    fontWeight: fontWeights.medium,
  },
  numeric: {
    fontSize: '0.875rem',
    lineHeight: '1.4',
    letterSpacing: '-0.005em',
    fontWeight: fontWeights.medium,
    fontVariantNumeric: 'tabular-nums',
  },
  metric: {
    fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
    lineHeight: '1.15',
    letterSpacing: '-0.025em',
    fontWeight: fontWeights.bold,
    fontVariantNumeric: 'tabular-nums',
  },
  mono: {
    fontSize: '0.8125rem',
    lineHeight: '1.5',
    letterSpacing: '0em',
    fontWeight: fontWeights.regular,
    fontFamily: fontFamilies.mono,
    fontVariantNumeric: 'tabular-nums',
  },
} as const satisfies Record<string, TypographyScaleToken>;

export const tabularNumeralsStyle = {
  fontVariantNumeric: 'tabular-nums',
} as const;

export type TypographyRole = keyof typeof typographyScale;
export type FontWeightKey = keyof typeof fontWeights;
