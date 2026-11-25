/**
 * Wendoro UI Responsive Breakpoint System
 * Single unified breakpoint scale aligned with Tailwind CSS v4 and dashboard targets.
 */

export const breakpoints = {
  smallMobile: 320,
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wideDesktop: 1440,
} as const;

export const breakpointQueries = {
  smallMobile: `(min-width: ${breakpoints.smallMobile}px)`,
  mobile: `(min-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  laptop: `(min-width: ${breakpoints.laptop}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wideDesktop: `(min-width: ${breakpoints.wideDesktop}px)`,
} as const;

export const responsiveGridColumns = {
  smallMobile: 1,
  mobile: 2,
  tablet: 6,
  laptop: 12,
  desktop: 12,
  wideDesktop: 12,
} as const;

export type BreakpointName = keyof typeof breakpoints;

export function resolveBreakpointName(width: number): BreakpointName {
  if (width >= breakpoints.wideDesktop) return 'wideDesktop';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.laptop) return 'laptop';
  if (width >= breakpoints.tablet) return 'tablet';
  if (width >= breakpoints.mobile) return 'mobile';
  return 'smallMobile';
}
