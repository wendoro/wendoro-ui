/**
 * Wendoro UI Color Tokens
 * Brand palette + semantic CSS variable mappings + accessible chart tokens.
 * Strictly excludes blue, purple, indigo, and teal from the brand theme.
 */

export const brandColors = {
  primaryYellow: '#FACC15',
  primaryRed: '#DC2626',
  deepBlack: '#111111',
  white: '#FFFFFF',
  warmWhite: '#FAFAF7',
  charcoal: '#242424',
  borderGray: '#E5E5E5',
  mutedGray: '#737373',
} as const;

export const semanticColorTokens = {
  background: 'var(--wdr-background)',
  foreground: 'var(--wdr-foreground)',
  primary: 'var(--wdr-primary)',
  primaryHover: 'var(--wdr-primary-hover)',
  primaryActive: 'var(--wdr-primary-active)',
  primaryForeground: 'var(--wdr-primary-foreground)',
  primarySubtle: 'var(--wdr-primary-subtle)',
  primarySubtleForeground: 'var(--wdr-primary-subtle-foreground)',
  secondary: 'var(--wdr-secondary)',
  secondaryHover: 'var(--wdr-secondary-hover)',
  secondaryForeground: 'var(--wdr-secondary-foreground)',
  accent: 'var(--wdr-accent)',
  accentForeground: 'var(--wdr-accent-foreground)',
  destructive: 'var(--wdr-destructive)',
  destructiveHover: 'var(--wdr-destructive-hover)',
  destructiveForeground: 'var(--wdr-destructive-foreground)',
  destructiveSubtle: 'var(--wdr-destructive-subtle)',
  destructiveSubtleForeground: 'var(--wdr-destructive-subtle-foreground)',
  muted: 'var(--wdr-muted)',
  mutedForeground: 'var(--wdr-muted-foreground)',
  border: 'var(--wdr-border)',
  input: 'var(--wdr-input)',
  ring: 'var(--wdr-ring)',
  success: 'var(--wdr-success)',
  successForeground: 'var(--wdr-success-foreground)',
  successSubtle: 'var(--wdr-success-subtle)',
  successSubtleForeground: 'var(--wdr-success-subtle-foreground)',
  warning: 'var(--wdr-warning)',
  warningForeground: 'var(--wdr-warning-foreground)',
  warningSubtle: 'var(--wdr-warning-subtle)',
  warningSubtleForeground: 'var(--wdr-warning-subtle-foreground)',
  info: 'var(--wdr-info)',
  infoForeground: 'var(--wdr-info-foreground)',
  infoSubtle: 'var(--wdr-info-subtle)',
  infoSubtleForeground: 'var(--wdr-info-subtle-foreground)',
  surface: 'var(--wdr-surface)',
  surfaceElevated: 'var(--wdr-surface-elevated)',
  surfaceSunken: 'var(--wdr-muted)',
  disabled: 'var(--wdr-disabled)',
  disabledForeground: 'var(--wdr-disabled-foreground)',
  focus: 'var(--wdr-focus)',
  hover: 'var(--wdr-hover)',
  selected: 'var(--wdr-selected)',
  selectedForeground: 'var(--wdr-selected-foreground)',
  active: 'var(--wdr-active)',
} as const;

export const chartPaletteTokens = {
  series1: 'var(--wdr-chart-1)',
  series2: 'var(--wdr-chart-2)',
  series3: 'var(--wdr-chart-3)',
  series4: 'var(--wdr-chart-4)',
  series5: 'var(--wdr-chart-5)',
  series6: 'var(--wdr-chart-6)',
  series7: 'var(--wdr-chart-7)',
  series8: 'var(--wdr-chart-8)',
} as const;

export const chartPaletteValues = {
  light: [
    '#111111',
    '#EAB308',
    '#DC2626',
    '#15803D',
    '#B45309',
    '#737373',
    '#52524E',
    '#991B1B',
  ],
  dark: [
    '#FACC15',
    '#FAFAF7',
    '#EF4444',
    '#22C55E',
    '#F59E0B',
    '#A3A3A0',
    '#D4D4D0',
    '#FCA5A5',
  ],
} as const;

export const chartSurfaceTokens = {
  gridline: 'var(--wdr-chart-grid)',
  axis: 'var(--wdr-chart-axis)',
  axisLabel: 'var(--wdr-chart-axis-text)',
  crosshair: 'var(--wdr-chart-crosshair)',
  tooltipBackground: 'var(--wdr-chart-tooltip-bg)',
  tooltipBorder: 'var(--wdr-chart-tooltip-border)',
  tooltipForeground: 'var(--wdr-chart-tooltip-fg)',
  annotation: 'var(--wdr-chart-annotation)',
  threshold: 'var(--wdr-chart-threshold)',
  positive: 'var(--wdr-success)',
  negative: 'var(--wdr-destructive)',
  warning: 'var(--wdr-warning)',
  neutral: 'var(--wdr-muted-foreground)',
} as const;

export const chartPatternSequence = [
  'solid',
  'diagonal-stripe',
  'dot-matrix',
  'crosshatch',
  'vertical-stripe',
  'horizontal-stripe',
  'sparse-diagonal',
  'ring-grid',
] as const;

export const chartLineDashSequence = [
  'none',
  '6 3',
  '2 3',
  '10 3 2 3',
  '12 4',
  '4 4',
  '8 2 2 2 2 2',
  '1 4',
] as const;

export const chartMarkerSequence = [
  'circle',
  'square',
  'triangle',
  'diamond',
  'cross',
  'circle',
  'square',
  'triangle',
] as const;

export type BrandColorKey = keyof typeof brandColors;
export type SemanticColorKey = keyof typeof semanticColorTokens;
export type ChartPaletteKey = keyof typeof chartPaletteTokens;
export type ChartSurfaceKey = keyof typeof chartSurfaceTokens;
export type ChartPatternKind = (typeof chartPatternSequence)[number];
export type ChartMarkerKind = (typeof chartMarkerSequence)[number];
