/**
 * Wendoro UI Border Radius Tokens
 */

export const radius = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '12px',
  extraLarge: '16px',
  full: '9999px',
} as const;

export type RadiusKey = keyof typeof radius;
