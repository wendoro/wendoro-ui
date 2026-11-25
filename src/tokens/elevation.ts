/**
 * Wendoro UI Elevation, Surface, Border, Focus Ring, and Z-Index Tokens
 * Single-elevation discipline anchored by crisp borders and semantic overlays.
 */

export const elevationTokens = {
  surfaceBase: 'var(--wdr-background)',
  surfaceLevel1: 'var(--wdr-surface)',
  surfaceLevel2: 'var(--wdr-surface-elevated)',
  surfaceMuted: 'var(--wdr-muted)',
  cardElevation: 'var(--wdr-shadow-sm)',
  dropdownElevation: 'var(--wdr-shadow-md)',
  popoverElevation: 'var(--wdr-shadow-md)',
  dialogElevation: 'var(--wdr-shadow-lg)',
  tooltipElevation: 'var(--wdr-shadow-md)',
  borderSubtle: 'var(--wdr-border)',
  borderStrong: 'var(--wdr-input)',
  borderFocus: 'var(--wdr-ring)',
  focusRing: 'var(--wdr-shadow-focus)',
} as const;

export const borderTokens = {
  none: '0px',
  thin: '1px',
  medium: '2px',
  thick: '3px',
  default: '1px solid var(--wdr-border)',
  strong: '1px solid var(--wdr-input)',
  focus: '2px solid var(--wdr-ring)',
  highContrast: '2px solid var(--wdr-border)',
} as const;

export const focusRingTokens = {
  width: '2px',
  offset: '2px',
  color: 'var(--wdr-ring)',
  shadow: 'var(--wdr-shadow-focus)',
  highContrastWidth: '3px',
} as const;

export const zIndexTokens = {
  base: 0,
  sticky: 20,
  header: 30,
  bottomNav: 35,
  dropdown: 40,
  popover: 45,
  overlay: 50,
  dialog: 50,
  sheet: 52,
  toast: 60,
  tour: 65,
  tooltip: 70,
} as const;

export type ElevationTokenKey = keyof typeof elevationTokens;
export type BorderTokenKey = keyof typeof borderTokens;
export type FocusRingTokenKey = keyof typeof focusRingTokens;
export type ZIndexTokenKey = keyof typeof zIndexTokens;
