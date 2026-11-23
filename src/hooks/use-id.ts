import * as React from 'react';

export function useStableId(providedId?: string, prefix = 'wdr'): string {
  const generated = React.useId();
  return providedId ?? `${prefix}-${generated.replace(/:/g, '')}`;
}
