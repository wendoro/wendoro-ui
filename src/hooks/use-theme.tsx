import * as React from 'react';
import {
  createThemeCssVariables,
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
  const [internalCustomTheme, setInternalCustomTheme] = React.useState<
    BrandThemeOverrides | undefined
  >(controlledCustomTheme);
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() => getSystemTheme());

  React.useEffect(() => {
    setInternalCustomTheme(controlledCustomTheme);
  }, [controlledCustomTheme]);

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
  const activeCustomTheme = controlledCustomTheme ?? internalCustomTheme;
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
    setInternalCustomTheme(overrides);
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
