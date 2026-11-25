import * as React from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'wendoro-ui-theme';

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
  storageKey?: string;
  /** Controlled theme override (does not mutate localStorage when provided). */
  forcedTheme?: ThemeMode;
  /** When true, applies theme attributes to a scoped wrapper element instead of document.documentElement. */
  scoped?: boolean;
  /** Disables localStorage reads and writes for isolated previews or multi-consumer trees. */
  disableStorage?: boolean;
  className?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = STORAGE_KEY,
  forcedTheme,
  scoped = false,
  disableStorage = false,
  className,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(() =>
    getStoredTheme(defaultTheme, storageKey, disableStorage)
  );
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() => getSystemTheme());

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

  React.useEffect(() => {
    if (scoped || typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    root.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme, scoped]);

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

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme: activeTheme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [activeTheme, resolvedTheme, setTheme, toggleTheme]
  );

  if (scoped) {
    return (
      <ThemeContext.Provider value={value}>
        <div
          data-theme={resolvedTheme}
          className={[resolvedTheme, 'bg-background text-foreground', className]
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
