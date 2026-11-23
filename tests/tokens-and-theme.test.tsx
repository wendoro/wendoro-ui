import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { brandColors, radius, spacing, typographyScale } from '@/tokens';

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

  it('reacts to OS system preference changes in system mode', () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;
    const originalMatchMedia = window.matchMedia;

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: (_event: string, cb: (e: MediaQueryListEvent) => void) => {
        changeHandler = cb;
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    window.localStorage.removeItem('system-test-key');
    render(
      <ThemeProvider defaultTheme="system" storageKey="system-test-key">
        <ThemeProbe />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

    act(() => {
      changeHandler?.({ matches: true } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    expect(document.documentElement).toHaveClass('dark');

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
});

