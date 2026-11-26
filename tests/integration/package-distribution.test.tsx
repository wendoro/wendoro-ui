import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ConsumerApp } from './consumer-fixture/ConsumerApp';

const require = createRequire(import.meta.url);

function collectDtsFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDtsFiles(full));
    } else if (entry.name.endsWith('.d.ts')) {
      results.push(full);
    }
  }
  return results;
}

describe('Package Distribution & External Consumer Integration', () => {
  const distDir = path.resolve(process.cwd(), 'dist/lib');

  it('ships ESM, CJS, all subpaths, tokens, theme CSS, compiled styles.css, and alias-free .d.ts declarations', () => {
    const requiredFiles = [
      'wendoro-ui.js',
      'wendoro-ui.cjs',
      'index.d.ts',
      'styles.css',
      'tokens/index.js',
      'tokens/index.cjs',
      'tokens/index.d.ts',
      'charts/index.js',
      'charts/index.cjs',
      'components/charts/index.d.ts',
      'charts/advanced/index.js',
      'charts/advanced/index.cjs',
      'components/charts/advanced/index.d.ts',
      'business/index.js',
      'business/index.cjs',
      'components/business/index.d.ts',
      'hooks/index.js',
      'hooks/index.cjs',
      'hooks/index.d.ts',
      'ai/index.js',
      'ai/index.cjs',
      'components/ai/index.d.ts',
      'editors/index.js',
      'editors/index.cjs',
      'components/editors/index.d.ts',
      'adapters/index.js',
      'adapters/index.cjs',
      'components/adapters/index.d.ts',
      'core/index.js',
      'core/index.cjs',
      'subpaths/core.d.ts',
      'forms/index.js',
      'forms/index.cjs',
      'subpaths/forms.d.ts',
      'navigation/index.js',
      'navigation/index.cjs',
      'subpaths/navigation.d.ts',
      'data/index.js',
      'data/index.cjs',
      'subpaths/data.d.ts',
      'editor/index.js',
      'editor/index.cjs',
      'subpaths/editor.d.ts',
      'workspace/index.js',
      'workspace/index.cjs',
      'subpaths/workspace.d.ts',
      'commerce/index.js',
      'commerce/index.cjs',
      'subpaths/commerce.d.ts',
      'admin/index.js',
      'admin/index.cjs',
      'subpaths/admin.d.ts',
      'industry/index.js',
      'industry/index.cjs',
      'subpaths/industry.d.ts',
    ];

    for (const rel of requiredFiles) {
      expect(fs.existsSync(path.join(distDir, rel))).toBe(true);
      if (rel.endsWith('.js') || rel.endsWith('.cjs')) {
        const jsContent = fs.readFileSync(path.join(distDir, rel), 'utf-8');
        expect(jsContent).not.toContain('jsxDEV');
        expect(jsContent).not.toContain('/app/applet');
      }
    }
    expect(fs.existsSync(path.resolve(process.cwd(), 'src/themes/light.css'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'src/themes/dark.css'))).toBe(true);
    expect(fs.existsSync(path.resolve(process.cwd(), 'src/themes/high-contrast.css'))).toBe(true);

    const dtsFiles = collectDtsFiles(distDir);
    expect(dtsFiles.length).toBeGreaterThan(25);

    for (const dtsPath of dtsFiles) {
      const content = fs.readFileSync(dtsPath, 'utf-8');
      expect(content).not.toMatch(/from\s+['"]@\//);
      expect(content).not.toMatch(/import\s+['"]\.\/styles\/index\.css['"]/);
    }
  });

  it('compiles dist/lib/styles.css with valid semantic variables, chart tokens, and theme utilities', () => {
    const css = fs.readFileSync(path.join(distDir, 'styles.css'), 'utf-8');

    expect(css).toMatch(/--wdr-background:\s*#fafaf7/i);
    expect(css).toMatch(/--wdr-background:\s*#111(111)?\b/i);
    expect(css).toMatch(/--wdr-primary:\s*#facc15/i);
    expect(css).toMatch(/--wdr-destructive:\s*#dc2626/i);
    expect(css).toMatch(/--wdr-chart-1:/i);
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('high');
    expect(css).toMatch(/--wdr-destructive-subtle-foreground:\s*#991b1b/i);
    expect(css).toMatch(/--wdr-destructive-subtle-foreground:\s*#fca5a5/i);
    expect(css).toContain('--color-destructive-subtle-foreground:var(--wdr-destructive-subtle-foreground)');
    expect(css).not.toMatch(/--wdr-destructive-subtle-foreground:\s*var\(--wdr-destructive-subtle-foreground\)/);

    expect(css).toContain('.text-destructive-subtle-foreground');
    expect(css).toContain('.bg-destructive-subtle');
    expect(css).toContain('.bg-primary');
    expect(css).toContain('.text-primary-foreground');
    expect(css).toContain('.bg-surface');
    expect(css).toContain('.border-input');
    expect(css).toContain('.fixed');
  });

  it('loads CJS and ESM entry points cleanly and keeps charts isolated from main bundle', async () => {
    const cjsMain = require(path.join(distDir, 'wendoro-ui.cjs'));
    const cjsTokens = require(path.join(distDir, 'tokens/index.cjs'));
    const cjsCharts = require(path.join(distDir, 'charts/index.cjs'));
    const cjsAdvCharts = require(path.join(distDir, 'charts/advanced/index.cjs'));
    const cjsBusiness = require(path.join(distDir, 'business/index.cjs'));
    const cjsHooks = require(path.join(distDir, 'hooks/index.cjs'));
    const cjsAi = require(path.join(distDir, 'ai/index.cjs'));
    const cjsEditors = require(path.join(distDir, 'editors/index.cjs'));
    const cjsAdapters = require(path.join(distDir, 'adapters/index.cjs'));
    const cjsCore = require(path.join(distDir, 'core/index.cjs'));
    const cjsForms = require(path.join(distDir, 'forms/index.cjs'));
    const cjsNavigation = require(path.join(distDir, 'navigation/index.cjs'));
    const cjsData = require(path.join(distDir, 'data/index.cjs'));
    const cjsEditor = require(path.join(distDir, 'editor/index.cjs'));
    const cjsWorkspace = require(path.join(distDir, 'workspace/index.cjs'));
    const cjsCommerce = require(path.join(distDir, 'commerce/index.cjs'));
    const cjsAdmin = require(path.join(distDir, 'admin/index.cjs'));
    const cjsIndustry = require(path.join(distDir, 'industry/index.cjs'));

    const esmMain = await import('@wendoro/ui');
    const esmTokens = await import('@wendoro/ui/tokens');
    const esmCharts = await import('@wendoro/ui/charts');
    const esmAdvCharts = await import('@wendoro/ui/charts/advanced');
    const esmBusiness = await import('@wendoro/ui/business');
    const esmHooks = await import('@wendoro/ui/hooks');
    const esmAi = await import('@wendoro/ui/ai');
    const esmEditors = await import('@wendoro/ui/editors');
    const esmAdapters = await import('@wendoro/ui/adapters');
    const esmCore = await import('@wendoro/ui/core');
    const esmForms = await import('@wendoro/ui/forms');
    const esmNavigation = await import('@wendoro/ui/navigation');
    const esmData = await import('@wendoro/ui/data');
    const esmEditor = await import('@wendoro/ui/editor');
    const esmWorkspace = await import('@wendoro/ui/workspace');
    const esmCommerce = await import('@wendoro/ui/commerce');
    const esmAdmin = await import('@wendoro/ui/admin');
    const esmIndustry = await import('@wendoro/ui/industry');

    expect(cjsMain.Button).toBeTruthy();
    expect((cjsMain.Button as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.forward_ref'));
    expect(typeof cjsMain.ButtonGroup).toBe('function');
    expect(typeof cjsMain.TeamDirectory).toBe('function');
    expect('LineChart' in cjsMain).toBe(false);
    expect('FunnelChart' in cjsMain).toBe(false);

    expect(esmMain.Button).toBeTruthy();
    expect((esmMain.Button as { $$typeof?: symbol }).$$typeof).toBe(Symbol.for('react.forward_ref'));
    expect(typeof esmMain.ActivityFeed).toBe('function');
    expect('LineChart' in esmMain).toBe(false);
    expect('FunnelChart' in esmMain).toBe(false);

    expect(typeof cjsCharts.LineChart).toBe('function');
    expect(typeof esmCharts.GaugeChart).toBe('function');
    expect(typeof esmCharts.ExternalChart).toBe('function');
    expect(typeof cjsAdvCharts.FunnelChart).toBe('function');
    expect(typeof esmAdvCharts.ViolinChart).toBe('function');
    expect(typeof esmAdvCharts.GeoRegionChart).toBe('function');
    expect(typeof cjsBusiness.KanbanBoard).toBe('function');
    expect(typeof esmBusiness.AppShell).toBe('function');
    expect(typeof esmBusiness.FileManager).toBe('function');
    expect(typeof esmBusiness.SettingsPageLayout).toBe('function');
    expect(typeof esmBusiness.HelpCenterPanel).toBe('function');
    expect(typeof esmBusiness.WorkflowBuilder).toBe('function');
    expect(typeof esmBusiness.AgencyWorkspacePattern).toBe('function');
    expect(typeof cjsHooks.useDensity).toBe('function');
    expect(typeof esmHooks.useReducedMotion).toBe('function');
    expect(typeof esmHooks.useKeyboardShortcuts).toBe('function');
    expect(typeof cjsMain.BottomSheet).toBe('function');
    expect(typeof esmMain.RichTextEditor).toBe('function');
    expect(typeof esmMain.RangeSlider).toBe('function');
    expect(typeof esmMain.SegmentedControl).toBe('function');
    expect(typeof esmMain.VirtualizedList).toBe('function');
    expect(typeof esmMain.AppLauncher).toBe('function');
    expect(typeof esmMain.ConnectionStatusBanner).toBe('function');
    expect(typeof esmBusiness.SetupWizard).toBe('function');
    expect(typeof esmBusiness.WorkspaceModeContainer).toBe('function');
    expect(typeof esmBusiness.PromptComposerBar).toBe('function');
    expect(esmBusiness.WENDORO_MODULE_CONTRACT_VERSION).toBe('2.0.0');

    expect(typeof cjsAi.AiAssistantPanel).toBe('function');
    expect(typeof esmAi.HumanApprovalCheckpoint).toBe('function');
    expect('LineChart' in esmAi).toBe(false);

    expect(typeof cjsEditors.MarkdownEditor).toBe('function');
    expect(typeof esmEditors.VisualFormBuilder).toBe('function');
    expect('LineChart' in esmEditors).toBe(false);

    expect(typeof cjsAdapters.FleetTrackingWorkspace).toBe('function');
    expect(typeof esmAdapters.SignatureCapturePad).toBe('function');
    expect('LineChart' in esmAdapters).toBe(false);
    expect('CandlestickChart' in esmAdapters).toBe(false);

    expect(typeof cjsCore.ButtonGroup).toBe('function');
    expect(typeof esmCore.useUndoAction).toBe('function');
    expect('LineChart' in esmCore).toBe(false);

    expect(typeof cjsForms.SelectableChipGroup).toBe('function');
    expect(typeof esmForms.DynamicFormBuilder).toBe('function');
    expect('LineChart' in esmForms).toBe(false);

    expect(typeof cjsNavigation.WorkspaceSwitcher).toBe('function');
    expect(typeof esmNavigation.MegaMenu).toBe('function');
    expect('LineChart' in esmNavigation).toBe(false);

    expect(typeof cjsData.VirtualizedList).toBe('function');
    expect(typeof esmData.DataTable).toBe('function');
    expect('LineChart' in esmData).toBe(false);

    expect(typeof cjsEditor.MarkdownEditor).toBe('function');
    expect(typeof esmEditor.WorkflowBuilder).toBe('function');
    expect('LineChart' in esmEditor).toBe(false);

    expect(typeof cjsWorkspace.FileManager).toBe('function');
    expect(typeof esmWorkspace.FloatingWindow).toBe('function');
    expect('LineChart' in esmWorkspace).toBe(false);

    expect(typeof cjsCommerce.SubscriptionOverview).toBe('function');
    expect(typeof esmCommerce.PricingTable).toBe('function');
    expect('LineChart' in esmCommerce).toBe(false);

    expect(typeof cjsAdmin.SettingsPageLayout).toBe('function');
    expect(typeof esmAdmin.HelpCenterPanel).toBe('function');
    expect('LineChart' in esmAdmin).toBe(false);

    expect(typeof cjsIndustry.CrmSalesPipelinePattern).toBe('function');
    expect(typeof esmIndustry.CreatorPublishingPattern).toBe('function');
    expect('LineChart' in esmIndustry).toBe(false);

    expect(typeof cjsAdvCharts.CandlestickChart).toBe('function');
    expect(typeof esmAdvCharts.NetworkGraphChart).toBe('function');

    expect(cjsTokens.brandColors.primaryYellow).toBe('#FACC15');
    expect(esmTokens.semanticColorTokens.destructiveSubtleForeground).toBe(
      'var(--wdr-destructive-subtle-foreground)'
    );
  });

  it('passes external TypeScript typechecking with zero path aliases', () => {
    const tsconfigConsumer = path.resolve(
      process.cwd(),
      'tests/integration/consumer-fixture/tsconfig.consumer.json'
    );
    expect(() =>
      execFileSync('npx', ['tsc', '-p', tsconfigConsumer, '--noEmit'], {
        cwd: process.cwd(),
        stdio: 'pipe',
      })
    ).not.toThrow();
  });

  it('renders a full consumer application with Sidebar, Dialog, Business components, and Light/Dark switching', async () => {
    const user = userEvent.setup();
    window.localStorage.removeItem('wendoro-consumer-fixture-theme');
    render(<ConsumerApp initialTheme="light" />);

    const root = screen.getByTestId('consumer-root');
    expect(root).toHaveAttribute('data-resolved-theme', 'light');
    expect(root).toHaveAttribute('data-brand-yellow', '#FACC15');
    expect(root).toHaveAttribute(
      'data-destructive-subtle-fg',
      'var(--wdr-destructive-subtle-foreground)'
    );
    expect(document.documentElement).toHaveClass('light');

    // Alert destructive subtle foreground renders
    expect(screen.getByRole('alert')).toHaveTextContent('Webhook attention required');

    // DataTable generic consumer rendering
    expect(screen.getByText('Wendoro Desk', { selector: 'td' })).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();

    // Sidebar navigation renders TeamDirectory
    await user.click(screen.getByRole('button', { name: 'Directory' }));
    expect(screen.getByPlaceholderText('Search team members…')).toBeInTheDocument();

    // Input interaction
    const input = screen.getByLabelText('Consumer workspace input');
    await user.type(input, 'Desk');
    expect(input).toHaveValue('Desk');

    // Theme switching
    await user.click(screen.getByRole('button', { name: 'Switch Theme' }));
    expect(root).toHaveAttribute('data-resolved-theme', 'dark');
    expect(document.documentElement).toHaveClass('dark');

    // Dialog open and close
    await user.click(screen.getByRole('button', { name: 'Open Consumer Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
