import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ConsumerFixture } from './fixtures/consumer-app/ConsumerFixture';

describe('CSS Distribution & Package Consumer Integration', () => {
  it('ships compiled dist/lib/styles.css containing Button, Card, Input, Dialog, Light & Dark theme rules', () => {
    const cssPath = path.resolve(process.cwd(), 'dist/lib/styles.css');
    expect(fs.existsSync(cssPath)).toBe(true);

    const css = fs.readFileSync(cssPath, 'utf-8');

    // Light & Dark theme semantic variables (lightningcss normalizes hex case and shorthand)
    expect(css).toMatch(/--wdr-background:\s*#fafaf7/i);
    expect(css).toMatch(/--wdr-background:\s*#111(111)?\b/i);
    expect(css).toMatch(/--wdr-primary:\s*#facc15/i);
    expect(css).toMatch(/--wdr-destructive:\s*#dc2626/i);
    expect(css).toContain('.dark');

    // Compiled utility classes used by Button, Card, Input, Dialog
    expect(css).toContain('.bg-primary');
    expect(css).toContain('.text-primary-foreground');
    expect(css).toContain('.bg-surface');
    expect(css).toContain('.border-input');
    expect(css).toContain('.fixed');
    expect(css).toContain('.inset-0');
  });

  it('renders a consuming application from the compiled dist/lib/wendoro-ui.js bundle with Light/Dark theme and Dialog', async () => {
    const user = userEvent.setup();
    render(<ConsumerFixture />);

    expect(screen.getByTestId('consumer-root')).toHaveAttribute('data-resolved-theme', 'light');
    expect(document.documentElement).toHaveClass('light');

    const input = screen.getByLabelText('Consumer input');
    await user.type(input, 'Wendoro');
    expect(input).toHaveValue('Wendoro');

    await user.click(screen.getByRole('button', { name: 'Switch Theme' }));
    expect(screen.getByTestId('consumer-root')).toHaveAttribute('data-resolved-theme', 'dark');
    expect(document.documentElement).toHaveClass('dark');

    await user.click(screen.getByRole('button', { name: 'Open Consumer Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Consumer Dialog')).toBeInTheDocument();
  });
});
