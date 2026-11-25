/**
 * Wendoro UI Elevation, Surface, and Border Tokens
 * Single-elevation discipline anchored by crisp 1px borders and semantic overlays.
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

export const zIndexTokens = {
  base: 0,
  sticky: 20,
  header: 30,
  dropdown: 40,
  popover: 45,
  overlay: 50,
  dialog: 50,
  toast: 60,
  tooltip: 70,
} as const;

export type ElevationTokenKey = keyof typeof elevationTokens;
export type ZIndexTokenKey = keyof typeof zIndexTokens;
