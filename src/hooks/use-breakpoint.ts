import * as React from 'react';
import { breakpoints, resolveBreakpointName, type BreakpointName } from '../tokens/breakpoints';

export function useBreakpoint(): {
  width: number;
  breakpoint: BreakpointName;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const [width, setWidth] = React.useState<number>(() => {
    if (typeof window === 'undefined') return breakpoints.desktop;
    return window.innerWidth || breakpoints.desktop;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleResize = () => {
      setWidth(window.innerWidth || breakpoints.desktop);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const breakpoint = resolveBreakpointName(width);

  return {
    width,
    breakpoint,
    isMobile: width < breakpoints.tablet,
    isTablet: width >= breakpoints.tablet && width < breakpoints.laptop,
    isDesktop: width >= breakpoints.laptop,
  };
}
