import * as React from 'react';
import {
  breakpoints,
  resolveBreakpointName,
  resolveDeviceCategory,
  type BreakpointName,
  type DeviceCategory,
} from '../tokens/breakpoints';

export type ViewportOrientation = 'portrait' | 'landscape';

export interface BreakpointState {
  width: number;
  height: number;
  breakpoint: BreakpointName;
  deviceCategory: DeviceCategory;
  orientation: ViewportOrientation;
  isSmallMobile: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
}

function readViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: breakpoints.desktop, height: 800 };
  }
  return {
    width: window.innerWidth || breakpoints.desktop,
    height: window.innerHeight || 800,
  };
}

export function useBreakpoint(): BreakpointState {
  const [size, setSize] = React.useState<{ width: number; height: number }>(() =>
    readViewportSize()
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      setSize(readViewportSize());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width, height } = size;
  const breakpoint = resolveBreakpointName(width);
  const deviceCategory = resolveDeviceCategory(width);

  return {
    width,
    height,
    breakpoint,
    deviceCategory,
    orientation: height > width ? 'portrait' : 'landscape',
    isSmallMobile: width < breakpoints.mobile,
    isMobile: width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet && width < breakpoints.laptop,
    isDesktop: width >= breakpoints.laptop,
    isLargeDesktop: width >= breakpoints.wideDesktop,
  };
}
