import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  brandColors,
  breakpoints,
  chartPaletteTokens,
  chartPaletteValues,
  densityScales,
  elevationTokens,
  motionDurations,
} from '@/tokens';
import { DensityProvider, useDensity } from '@/hooks/use-density';
import { ThemeProvider, getThemeInitScript } from '@/hooks/use-theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useBreakpoint } from '@/hooks/use-breakpoint';

function DensityConsumer() {
  const { density, scale, setDensity } = useDensity();
  return (
    <div>
      <span data-testid="density-value">{density}</span>
      <span data-testid="density-pad">{scale.controlHeight}</span>
      <button type="button" onClick={() => setDensity('compact')}>Compact</button>
      <button type="button" onClick={() => setDensity('spacious')}>Spacious</button>
    </div>
  );
}

function HooksConsumer() {
  const reduced = useReducedMotion();
  const bp = useBreakpoint();
  return (
    <div>
      <span data-testid="reduced-motion">{String(reduced)}</span>
      <span data-testid="bp-name">{bp.breakpoint}</span>
    </div>
  );
}

describe('Design Foundations 2.0, Density & Hooks', () => {
  it('excludes blue, purple, indigo, and teal hues from brand & chart palettes', () => {
    const forbiddenHexes = ['#0000ff', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#14b8a6', '#0d9488'];
    const allColors = [...Object.values(brandColors), ...chartPaletteValues.light, ...chartPaletteValues.dark].map((c) =>
      c.toLowerCase()
    );
    for (const forbidden of forbiddenHexes) {
      expect(allColors).not.toContain(forbidden);
    }
    expect(chartPaletteTokens.series1).toBe('var(--wdr-chart-1)');
    expect(elevationTokens.dialogElevation).toContain('var(--wdr-shadow-lg)');
    expect(motionDurations.standard).toContain('180ms');
  });

  it('supports scoped DensityProvider switching across compact, comfortable, and spacious modes', async () => {
    const user = userEvent.setup();
    render(
      <DensityProvider defaultDensity="comfortable" scoped>
        <DensityConsumer />
      </DensityProvider>
    );

    const wrapper = screen.getByTestId('density-value').closest('[data-density]');
    expect(wrapper).toHaveAttribute('data-density', 'comfortable');
    expect(screen.getByTestId('density-pad')).toHaveTextContent(densityScales.comfortable.controlHeight);

    await user.click(screen.getByRole('button', { name: 'Compact' }));
    expect(wrapper).toHaveAttribute('data-density', 'compact');
    expect(screen.getByTestId('density-pad')).toHaveTextContent(densityScales.compact.controlHeight);

    await user.click(screen.getByRole('button', { name: 'Spacious' }));
    expect(wrapper).toHaveAttribute('data-density', 'spacious');
    expect(screen.getByTestId('density-pad')).toHaveTextContent(densityScales.spacious.controlHeight);
  });

  it('resolves reduced-motion and responsive breakpoints safely', () => {
    const origMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('reduce'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: breakpoints.mobile });
    render(<HooksConsumer />);
    expect(screen.getByTestId('reduced-motion')).toHaveTextContent('true');
    expect(screen.getByTestId('bp-name')).toHaveTextContent('mobile');

    window.matchMedia = origMatchMedia;
  });

  it('generates safe theme init script and SSR markup', () => {
    const script = getThemeInitScript('wendoro-ui-theme', 'system');
    expect(script).toContain('matchMedia');
    const html = renderToString(
      <ThemeProvider scoped defaultTheme="dark">
        <DensityProvider scoped defaultDensity="compact">
          <div>SSR Workspace</div>
        </DensityProvider>
      </ThemeProvider>
    );
    expect(html).toContain('data-theme="dark"');
    expect(html).toContain('data-density="compact"');
  });
});
