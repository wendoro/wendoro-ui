import * as React from 'react';
import { getLocaleDirection, type TextDirection } from '../utils/i18n';

export interface DirectionContextValue {
  dir: TextDirection;
  locale: string;
  setLocale: (locale: string) => void;
  setDirection: (dir: TextDirection) => void;
}

const DirectionContext = React.createContext<DirectionContextValue>({
  dir: 'ltr',
  locale: 'en-US',
  setLocale: () => {},
  setDirection: () => {},
});

export interface DirectionProviderProps {
  children: React.ReactNode;
  defaultLocale?: string;
  defaultDirection?: TextDirection;
  scoped?: boolean;
  className?: string;
}

export function DirectionProvider({
  children,
  defaultLocale = 'en-US',
  defaultDirection,
  scoped = true,
  className,
}: DirectionProviderProps) {
  const [locale, setLocaleState] = React.useState(defaultLocale);
  const [dir, setDir] = React.useState<TextDirection>(
    () => defaultDirection ?? getLocaleDirection(defaultLocale)
  );

  const setLocale = React.useCallback((nextLocale: string) => {
    setLocaleState(nextLocale);
    setDir(getLocaleDirection(nextLocale));
  }, []);

  React.useEffect(() => {
    if (scoped || typeof document === 'undefined') return undefined;
    const prevDir = document.documentElement.getAttribute('dir');
    const prevLang = document.documentElement.getAttribute('lang');
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
    return () => {
      if (prevDir !== null) document.documentElement.setAttribute('dir', prevDir);
      else document.documentElement.removeAttribute('dir');
      if (prevLang !== null) document.documentElement.setAttribute('lang', prevLang);
      else document.documentElement.removeAttribute('lang');
    };
  }, [dir, locale, scoped]);

  const value = React.useMemo<DirectionContextValue>(
    () => ({ dir, locale, setLocale, setDirection: setDir }),
    [dir, locale, setLocale]
  );

  return (
    <DirectionContext.Provider value={value}>
      {scoped ? (
        <div dir={dir} lang={locale} className={className}>
          {children}
        </div>
      ) : (
        children
      )}
    </DirectionContext.Provider>
  );
}

export function useDirection(): DirectionContextValue {
  return React.useContext(DirectionContext);
}
