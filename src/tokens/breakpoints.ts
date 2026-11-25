/**
 * Wendoro UI Responsive Breakpoint System
 * Unified breakpoint scale aligned with mobile (320/375/430), tablet (768/1024),
 * and desktop (1280/1440/1920) device targets.
 */

export const breakpoints = {
  smallMobile: 320,
  mobile: 375,
  largeMobile: 430,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wideDesktop: 1440,
  ultraWide: 1920,
} as const;

export const breakpointQueries = {
  smallMobile: `(min-width: ${breakpoints.smallMobile}px)`,
  mobile: `(min-width: ${breakpoints.mobile}px)`,
  largeMobile: `(min-width: ${breakpoints.largeMobile}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  laptop: `(min-width: ${breakpoints.laptop}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wideDesktop: `(min-width: ${breakpoints.wideDesktop}px)`,
  ultraWide: `(min-width: ${breakpoints.ultraWide}px)`,
} as const;

export const responsiveGridColumns = {
  smallMobile: 1,
  mobile: 2,
  largeMobile: 2,
  tablet: 6,
  laptop: 12,
  desktop: 12,
  wideDesktop: 12,
  ultraWide: 12,
} as const;

export type BreakpointName = keyof typeof breakpoints;
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export function resolveBreakpointName(width: number): BreakpointName {
  if (width >= breakpoints.ultraWide) return 'ultraWide';
  if (width >= breakpoints.wideDesktop) return 'wideDesktop';
  if (width >= breakpoints.desktop) return 'desktop';
  if (width >= breakpoints.laptop) return 'laptop';
  if (width >= breakpoints.tablet) return 'tablet';
  if (width >= breakpoints.largeMobile) return 'largeMobile';
  if (width >= breakpoints.mobile) return 'mobile';
  return 'smallMobile';
}

export function resolveDeviceCategory(width: number): DeviceCategory {
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.laptop) return 'tablet';
  return 'desktop';
}
