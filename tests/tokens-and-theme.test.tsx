import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, getThemeInitScript, useTheme } from '@/hooks/use-theme';
import { brandColors, radius, semanticColorTokens, spacing, typographyScale } from '@/tokens';
import { cn } from '@/utils/cn';

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-mode">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('Design Tokens & Theming', () => {
  it('defines all Wendoro brand colors accurately without forbidden hues', () => {
    expect(brandColors.primaryYellow).toBe('#FACC15');
    expect(brandColors.primaryRed).toBe('#DC2626');
    expect(brandColors.deepBlack).toBe('#111111');
    expect(brandColors.white).toBe('#FFFFFF');
    expect(brandColors.warmWhite).toBe('#FAFAF7');
    expect(brandColors.charcoal).toBe('#242424');
    expect(brandColors.borderGray).toBe('#E5E5E5');
    expect(brandColors.mutedGray).toBe('#737373');
  });

  it('defines interactive state semantic tokens alongside core tokens', () => {
    expect(semanticColorTokens.disabled).toBe('var(--wdr-disabled)');
    expect(semanticColorTokens.disabledForeground).toBe('var(--wdr-disabled-foreground)');
    expect(semanticColorTokens.focus).toBe('var(--wdr-focus)');
    expect(semanticColorTokens.hover).toBe('var(--wdr-hover)');
    expect(semanticColorTokens.selected).toBe('var(--wdr-selected)');
    expect(semanticColorTokens.selectedForeground).toBe('var(--wdr-selected-foreground)');
    expect(semanticColorTokens.active).toBe('var(--wdr-active)');
  });

  it('provides full typography, spacing, and radius token scales', () => {
    expect(Object.keys(typographyScale)).toEqual([
      'display',
      'h1',
      'h2',
      'h3',
      'h4',
      'body',
      'small',
      'caption',
      'label',
    ]);
    expect(spacing[1]).toBe('4px');
    expect(spacing[4]).toBe('16px');
    expect(Object.keys(radius)).toEqual([
      'none',
      'small',
      'medium',
      'large',
      'extraLarge',
      'full',
    ]);
  });

  it('merges class names cleanly via cn utility', () => {
    const disabled = false;
    expect(cn('px-2', disabled && 'opacity-50', undefined, 'text-sm')).toBe('px-2 text-sm');
  });

  it('switches between light and dark themes and persists under a custom storageKey', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('custom-wdr-theme');

    render(
      <ThemeProvider defaultTheme="light" storageKey="custom-wdr-theme">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(window.localStorage.getItem('custom-wdr-theme')).toBe('dark');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    expect(window.localStorage.getItem('custom-wdr-theme')).toBe('light');
  });

  it('reacts to OS system preference changes in system mode including legacy addListener fallback', () => {
    let modernHandler: ((event: MediaQueryListEvent) => void) | undefined;
    let legacyHandler: ((event: MediaQueryListEvent) => void) | undefined;
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        modernHandler = cb;
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.localStorage.removeItem('system-test-key');
    const { unmount } = render(
      <ThemeProvider defaultTheme="system" storageKey="system-test-key">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

    act(() => {
      modernHandler?.({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
    unmount();

    // Legacy browser MediaQueryList without addEventListener
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (cb: (e: MediaQueryListEvent) => void) => {
        legacyHandler = cb;
      },
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(
      <ThemeProvider defaultTheme="system" storageKey="system-test-key-legacy">
        <ThemeProbe />
      </ThemeProvider>
    );

    act(() => {
      legacyHandler?.({ matches: true } as MediaQueryListEvent);
    });
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');

    window.matchMedia = originalMatchMedia;
  });

  it('hydrates persisted theme from localStorage on initial mount', () => {
    window.localStorage.setItem('hydrated-wdr-theme', 'dark');
    render(
      <ThemeProvider defaultTheme="light" storageKey="hydrated-wdr-theme">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');
    window.localStorage.removeItem('hydrated-wdr-theme');
  });

  it('survives localStorage read/write failures without throwing', async () => {
    const user = userEvent.setup();
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError: storage blocked');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    render(
      <ThemeProvider defaultTheme="light" storageKey="blocked-key">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });

  it('isolates scoped ThemeProvider consumers from document.documentElement', async () => {
    const user = userEvent.setup();
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');

    const { container } = render(
      <ThemeProvider scoped disableStorage defaultTheme="light">
        <ThemeProbe />
      </ThemeProvider>
    );

    const scopedWrapper = container.firstElementChild as HTMLElement;
    expect(scopedWrapper).toHaveAttribute('data-theme', 'light');
    expect(scopedWrapper).toHaveClass('light');

    await user.click(screen.getByRole('button', { name: 'Set Dark' }));
    expect(scopedWrapper).toHaveAttribute('data-theme', 'dark');
    expect(scopedWrapper).toHaveClass('dark');
    // Global document root remains untouched
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('generates safe bootstrap init script string for SSR pre-hydration', () => {
    const script = getThemeInitScript('custom-key', 'dark');
    expect(script).toContain('"custom-key"');
    expect(script).toContain('"dark"');
    expect(script).toContain('data-theme');
  });
});
