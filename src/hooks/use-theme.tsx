import * as React from 'react';
import {
  createThemeCssVariables,
  getThemePreset,
  type BrandThemeOverrides,
  type ThemeContrastMode,
} from '../tokens/theming';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  contrast: ThemeContrastMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setContrast: (contrast: ThemeContrastMode) => void;
  toggleContrast: () => void;
  customTheme?: BrandThemeOverrides;
  setCustomTheme: (overrides?: BrandThemeOverrides) => void;
  presetId?: string;
  applyPreset: (presetId: string) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'wendoro-ui-theme';
const CONTRAST_STORAGE_KEY = 'wendoro-ui-contrast';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function getSystemContrast(): ThemeContrastMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'standard';
  }
  try {
    return window.matchMedia('(prefers-contrast: more)').matches ? 'high' : 'standard';
  } catch {
    return 'standard';
  }
}

function getStoredTheme(
  defaultTheme: ThemeMode,
  storageKey: string,
  disableStorage: boolean
): ThemeMode {
  if (disableStorage || typeof window === 'undefined') {
    return defaultTheme;
  }
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // Ignore storage read errors in restricted contexts
  }
  return defaultTheme;
}

function getStoredContrast(
  defaultContrast: ThemeContrastMode | undefined,
  storageKey: string,
  disableStorage: boolean
): ThemeContrastMode {
  if (disableStorage || typeof window === 'undefined') {
    return defaultContrast ?? getSystemContrast();
  }
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'standard' || stored === 'high') {
      return stored;
    }
  } catch {
    // Ignore storage read errors
  }
  return defaultContrast ?? getSystemContrast();
}

/**
 * Generates an inline bootstrap script string consumers can run before hydration
 * to prevent flash of unstyled/incorrect theme on initial render.
 */
export function getThemeInitScript(
  storageKey: string = STORAGE_KEY,
  defaultTheme: ThemeMode = 'system'
): string {
  const safeKey = JSON.stringify(storageKey);
  const safeDefault = JSON.stringify(defaultTheme);
  return `(function(){try{var k=${safeKey};var d=${safeDefault};var s=null;try{s=window.localStorage.getItem(k)}catch(e){}var m=(s==='light'||s==='dark'||s==='system')?s:d;var r=m==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;var el=document.documentElement;el.classList.remove('light','dark');el.classList.add(r);el.setAttribute('data-theme',r);}catch(e){}})();`;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  defaultContrast?: ThemeContrastMode;
  storageKey?: string;
  contrastStorageKey?: string;
  /** Controlled theme override (does not mutate localStorage when provided). */
  forcedTheme?: ThemeMode;
  /** Controlled contrast override. */
  forcedContrast?: ThemeContrastMode;
  /** Scoped or global CSS custom-property brand overrides (white-label / multi-tenant). */
  customTheme?: BrandThemeOverrides;
  /** Optional built-in or registered theme preset identifier. */
  defaultPresetId?: string;
  /** When true, applies theme attributes to a scoped wrapper element instead of document.documentElement. */
  scoped?: boolean;
  /** Disables localStorage reads and writes for isolated previews or multi-consumer trees. */
  disableStorage?: boolean;
  className?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultContrast = 'standard',
  storageKey = STORAGE_KEY,
  contrastStorageKey = CONTRAST_STORAGE_KEY,
  forcedTheme,
  forcedContrast,
  customTheme: controlledCustomTheme,
  defaultPresetId = 'wendoro-default',
  scoped = false,
  disableStorage = false,
  className,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(() =>
    getStoredTheme(defaultTheme, storageKey, disableStorage)
  );
  const [contrast, setContrastState] = React.useState<ThemeContrastMode>(() =>
    getStoredContrast(defaultContrast, contrastStorageKey, disableStorage)
  );
  const [presetId, setPresetId] = React.useState<string | undefined>(defaultPresetId);
  const [internalCustomTheme, setInternalCustomTheme] = React.useState<
    BrandThemeOverrides | undefined
  >(() => controlledCustomTheme ?? getThemePreset(defaultPresetId)?.overrides);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() => getSystemTheme());

  const prevControlledCustomThemeRef = React.useRef<BrandThemeOverrides | undefined>(controlledCustomTheme);
  React.useEffect(() => {
    const prev = prevControlledCustomThemeRef.current;
    prevControlledCustomThemeRef.current = controlledCustomTheme;
    if (controlledCustomTheme !== undefined) {
      setInternalCustomTheme(controlledCustomTheme);
    } else if (prev !== undefined) {
      setInternalCustomTheme(presetId ? getThemePreset(presetId)?.overrides : undefined);
    }
  }, [controlledCustomTheme, presetId]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
    return undefined;
  }, []);

  const activeTheme = forcedTheme ?? theme;
  const resolvedTheme: ResolvedTheme = activeTheme === 'system' ? systemTheme : activeTheme;
  const activeContrast = forcedContrast ?? contrast;
  const activePreset = presetId ? getThemePreset(presetId) : undefined;
  const activeCustomTheme = React.useMemo(() => {
    if (controlledCustomTheme) {
      return controlledCustomTheme;
    }
    if (resolvedTheme === 'dark' && activePreset?.darkOverrides) {
      return { ...activePreset.overrides, ...activePreset.darkOverrides };
    }
    return internalCustomTheme;
  }, [controlledCustomTheme, resolvedTheme, activePreset, internalCustomTheme]);
  const cssVars = React.useMemo(
    () => createThemeCssVariables(activeCustomTheme),
    [activeCustomTheme]
  );

  React.useEffect(() => {
    if (scoped || typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'high-contrast');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-contrast', activeContrast);
    if (activeContrast === 'high') {
      root.classList.add('high-contrast');
    }

    const appliedKeys = Object.keys(cssVars);
    for (const [k, v] of Object.entries(cssVars)) {
      root.style.setProperty(k, v);
    }
    return () => {
      for (const k of appliedKeys) {
        root.style.removeProperty(k);
      }
    };
  }, [resolvedTheme, activeContrast, cssVars, scoped]);

  const setTheme = React.useCallback(
    (nextTheme: ThemeMode) => {
      setThemeState(nextTheme);
      if (!disableStorage && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(storageKey, nextTheme);
        } catch {
          // Ignore storage write errors
        }
      }
    },
    [disableStorage, storageKey]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  const setContrast = React.useCallback(
    (nextContrast: ThemeContrastMode) => {
      setContrastState(nextContrast);
      if (!disableStorage && typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(contrastStorageKey, nextContrast);
        } catch {
          // Ignore storage write errors
        }
      }
    },
    [disableStorage, contrastStorageKey]
  );

  const toggleContrast = React.useCallback(() => {
    setContrast(activeContrast === 'high' ? 'standard' : 'high');
  }, [activeContrast, setContrast]);

  const setCustomTheme = React.useCallback((overrides?: BrandThemeOverrides) => {
    setPresetId(undefined);
    setInternalCustomTheme(overrides);
  }, []);

  const applyPreset = React.useCallback((nextPresetId: string) => {
    const preset = getThemePreset(nextPresetId);
    if (!preset) return;
    setPresetId(preset.id);
    setInternalCustomTheme(preset.overrides);
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme: activeTheme,
      resolvedTheme,
      contrast: activeContrast,
      setTheme,
      toggleTheme,
      setContrast,
      toggleContrast,
      customTheme: activeCustomTheme,
      setCustomTheme,
      presetId,
      applyPreset,
    }),
    [
      activeTheme,
      resolvedTheme,
      activeContrast,
      setTheme,
      toggleTheme,
      setContrast,
      toggleContrast,
      activeCustomTheme,
      setCustomTheme,
      presetId,
      applyPreset,
    ]
  );

  if (scoped) {
    return (
      <ThemeContext.Provider value={value}>
        <div
          data-theme={resolvedTheme}
          data-contrast={activeContrast}
          style={cssVars as React.CSSProperties}
          className={[
            resolvedTheme,
            activeContrast === 'high' ? 'high-contrast' : '',
            'bg-background text-foreground',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
