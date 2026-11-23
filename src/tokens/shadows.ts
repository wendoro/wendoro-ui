/**
 * Wendoro UI Shadow Tokens
 */

export const shadows = {
  small: 'var(--wdr-shadow-sm)',
  medium: 'var(--wdr-shadow-md)',
  large: 'var(--wdr-shadow-lg)',
  focus: 'var(--wdr-shadow-focus)',
} as const;

export type ShadowKey = keyof typeof shadows;
