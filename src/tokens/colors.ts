/**
 * Wendoro UI Color Tokens
 * Brand palette + semantic CSS variable mappings.
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
} as const;

export type BrandColorKey = keyof typeof brandColors;
export type SemanticColorKey = keyof typeof semanticColorTokens;
