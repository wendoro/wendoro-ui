import * as React from 'react';
import { REDUCED_MOTION_MEDIA_QUERY } from '../tokens/motion';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState<boolean>(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }
    try {
      return window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches;
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(REDUCED_MOTION_MEDIA_QUERY);
    } catch {
      return undefined;
    }
    const update = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mql.matches);
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    if (typeof mql.addListener === 'function') {
      mql.addListener(update);
      return () => mql.removeListener(update);
    }
    return undefined;
  }, []);

  return reduced;
}
