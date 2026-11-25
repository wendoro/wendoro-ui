import * as React from 'react';
import { densityScales, type DensityMode, type DensityScaleSpec } from '../tokens/spacing';

export interface DensityContextValue {
  density: DensityMode;
  scale: DensityScaleSpec;
  setDensity: (density: DensityMode) => void;
}

const DensityContext = React.createContext<DensityContextValue | undefined>(undefined);

export interface DensityProviderProps {
  children: React.ReactNode;
  defaultDensity?: DensityMode;
  density?: DensityMode;
  onDensityChange?: (density: DensityMode) => void;
  scoped?: boolean;
  className?: string;
}

export function DensityProvider({
  children,
  defaultDensity = 'comfortable',
  density: controlledDensity,
  onDensityChange,
  scoped = true,
  className,
}: DensityProviderProps) {
  const [internalDensity, setInternalDensity] = React.useState<DensityMode>(defaultDensity);
  const density = controlledDensity ?? internalDensity;

  const setDensity = React.useCallback(
    (next: DensityMode) => {
      if (controlledDensity === undefined) {
        setInternalDensity(next);
      }
      onDensityChange?.(next);
    },
    [controlledDensity, onDensityChange]
  );

  React.useEffect(() => {
    if (scoped || typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-density', density);
  }, [density, scoped]);

  const value = React.useMemo<DensityContextValue>(
    () => ({
      density,
      scale: densityScales[density],
      setDensity,
    }),
    [density, setDensity]
  );

  if (scoped) {
    return (
      <DensityContext.Provider value={value}>
        <div data-density={density} className={className}>
          {children}
        </div>
      </DensityContext.Provider>
    );
  }

  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

export function useDensity(): DensityContextValue {
  const ctx = React.useContext(DensityContext);
  if (!ctx) {
    return {
      density: 'comfortable',
      scale: densityScales.comfortable,
      setDensity: () => undefined,
    };
  }
  return ctx;
}
