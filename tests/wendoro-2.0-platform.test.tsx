import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  ButtonGroup,
  SplitButton,
  Toggle,
} from '@/components/ui/button';
import { ErrorBoundary, RecoveryScreen } from '@/components/ui/error-boundary';
import { ColorInput, Combobox, MaskedInput, MultiSelect } from '@/components/ui/forms';
import { Sidebar, SidebarItem } from '@/components/ui/sidebar';
import {
  listThemePresets,
  registerDesignTokenSet,
  getRegisteredTokenSets,
  registerThemePreset,
} from '@/tokens/theming';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { DirectionProvider } from '@/hooks/use-direction';
import { useClipboard } from '@/hooks/use-clipboard';
import {
  formatLocaleCurrency,
  formatLocaleDate,
  formatLocaleNumber,
  isRtlLocale,
} from '@/utils/i18n';
import { DataImportMapper, FormulaEditor, PivotTable, QueryBuilder, SpreadsheetGrid } from '@/components/business/data-tools';
import { ChatLayout, SharedInbox } from '@/components/business/communication';
import { BillingHistoryTable, CheckoutSummary, PricingTable, ProductCatalog } from '@/components/business/commerce';
import { MfaVerificationView, PermissionMatrix, PrivacyConsentSettings, SignInView } from '@/components/business/identity';
import { ClipboardCopyButton, DevicePermissionPrompt, PwaInstallPrompt } from '@/components/business/device';
import { CandlestickChart, NetworkGraphChart } from '@/components/charts/advanced';
import { LineChart } from '@/components/charts';
import { AiAssistantPanel, HumanApprovalCheckpoint, SourceCitationsPanel } from '@/components/ai';
import { ImageAnnotationPanel, MarkdownEditor, VisualFormBuilder } from '@/components/editors';
import {
  FleetTrackingWorkspace,
  MapAdapterProvider,
  SignatureCapturePad,
  WENDORO_BUNDLE_BUDGETS,
  listWendoroExtensions,
  registerWendoroExtension,
} from '@/components/adapters';

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Simulated UI failure');
  return <div>Recovered safely</div>;
}

function ThemePresetProbe() {
  const { presetId, applyPreset } = useTheme();
  return (
    <div>
      <span data-testid="active-preset">{presetId}</span>
      <button type="button" onClick={() => applyPreset('wendoro-editorial')}>
        Switch Preset
      </button>
    </div>
  );
}

function ClipboardProbe() {
  const { copied, copy } = useClipboard(50);
  return (
    <button type="button" onClick={() => void copy('hello-wendoro')}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

describe('Wendoro UI 2.0 Comprehensive Platform Capabilities', () => {
  it('supports tertiary Button, Toggle, SplitButton, ColorInput, MaskedInput, and MultiSelect keyboard controls', async () => {
    const user = userEvent.setup();
    const onPrimary = vi.fn();
    const onMask = vi.fn();

    render(
      <div>
        <ButtonGroup>
          <Button variant="tertiary">Tertiary Action</Button>
          <Toggle pressed={false} onPressedChange={() => {}}>Pin</Toggle>
        </ButtonGroup>
        <SplitButton
          label="Save Draft"
          onPrimaryClick={onPrimary}
          options={[{ id: 'pub', label: 'Publish Now', onSelect: () => {} }]}
        />
        <ColorInput label="Accent" value="#FACC15" onValueChange={() => {}} />
        <MaskedInput label="Phone" mask="(###) ###-####" value="" onValueChange={onMask} />
        <MultiSelect
          label="Modules"
          value={[]}
          onValueChange={() => {}}
          options={[
            { value: 'desk', label: 'Desk' },
            { value: 'flow', label: 'Flow' },
          ]}
        />
        <Combobox
          label="Region"
          value=""
          onValueChange={() => {}}
          options={[
            { value: 'na', label: 'North America' },
            { value: 'eu', label: 'Europe' },
          ]}
        />
      </div>
    );

    expect(screen.getByRole('button', { name: 'Tertiary Action' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Save Draft' }));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    const maskField = screen.getByLabelText('Phone');
    fireEvent.change(maskField, { target: { value: '5551234567' } });
    expect(onMask).toHaveBeenCalledWith('(555) 123-4567', '5551234567');

    await user.click(screen.getByRole('button', { name: 'Modules' }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('catches runtime crashes in ErrorBoundary and renders RecoveryScreen', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary
        fallbackRender={({ error, reset }) => (
          <RecoveryScreen title="Boundary Active" description={error.message} onRetry={reset} />
        )}
      >
        <Bomb shouldThrow />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Boundary Active');
    expect(screen.getByText('Simulated UI failure')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    spy.mockRestore();
  });

  it('registers theme presets, custom token sets, RTL direction, and locale formatters cleanly', async () => {
    const user = userEvent.setup();
    registerThemePreset({
      id: 'partner-gold',
      name: 'Partner Gold',
      description: 'Custom test preset',
      overrides: { primary: '#FACC15' },
    });
    expect(listThemePresets().some((p) => p.id === 'partner-gold')).toBe(true);

    registerDesignTokenSet({
      namespace: 'partner-tokens',
      version: '1.0.0',
      tokens: { '--wdr-radius-sm': '4px' },
    });
    expect(getRegisteredTokenSets().some((s) => s.namespace === 'partner-tokens')).toBe(true);

    expect(isRtlLocale('ar-EG')).toBe(true);
    expect(isRtlLocale('en-US')).toBe(false);
    expect(formatLocaleNumber(1234.5, undefined, 'en-US')).toContain('1,234');
    expect(formatLocaleCurrency(99, 'USD', 'en-US')).toContain('99');
    expect(formatLocaleDate('2026-11-15T12:00:00Z', undefined, 'en-US').length).toBeGreaterThan(3);

    render(
      <DirectionProvider defaultLocale="he-IL" scoped>
        <ThemeProvider defaultTheme="light" disableStorage>
          <ThemePresetProbe />
          <Sidebar variant="icon" header={<span>W</span>}>
            <SidebarItem active>Home</SidebarItem>
          </Sidebar>
        </ThemeProvider>
      </DirectionProvider>
    );

    expect(screen.getByTestId('active-preset')).toHaveTextContent('wendoro-default');
    await user.click(screen.getByRole('button', { name: 'Switch Preset' }));
    expect(screen.getByTestId('active-preset')).toHaveTextContent('wendoro-editorial');
  });

  it('renders DataTools, Communication, Commerce, Identity, and Device modules cleanly', () => {
    const onCellChange = vi.fn();
    render(
      <div>
        <SpreadsheetGrid
          columns={[{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }]}
          rows={[{ a: '10', b: '20' }]}
          onCellChange={onCellChange}
        />
        <PivotTable
          data={[{ group: 'Core', quarter: 'Q1', amount: 42 }]}
          rowField="group"
          columnField="quarter"
          valueField="amount"
        />
        <QueryBuilder
          fields={['status']}
          combinator="AND"
          onCombinatorChange={() => {}}
          conditions={[]}
          onChange={() => {}}
        />
        <FormulaEditor value="=SUM(amount)" onChange={() => {}} />
        <DataImportMapper
          mappings={[{ sourceColumn: 'org', sampleValue: 'Sample Org', targetField: 'name' }]}
          targetFields={['name']}
          onChangeMapping={() => {}}
        />
        <ChatLayout
          conversations={[{ id: 'c1', title: 'Team Sync', preview: 'Ready', timestamp: 'Now' }]}
          activeConversationId="c1"
          onSelectConversation={() => {}}
          messages={[{ id: 'm1', sender: 'Demo User', timestamp: 'Now', body: 'Hello' }]}
          onSendMessage={() => {}}
        />
        <SharedInbox items={[{ id: 'i1', subject: 'Invoice Question', sender: 'demo@example.invalid', priority: 'normal', status: 'open' }]} />
        <ProductCatalog products={[{ id: 'p1', sku: 'SKU-1', name: 'Starter Kit', category: 'POS', priceLabel: '$99', numericPrice: 99, stockCount: 10 }]} />
        <PricingTable
          plans={[{ id: 't1', name: 'Starter', priceLabel: '$49', periodLabel: 'mo', description: 'Starter', features: ['3 workspaces'] }]}
        />
        <CheckoutSummary subtotalLabel="$99" shippingLabel="$0" taxLabel="$0" totalLabel="$99" />
        <BillingHistoryTable invoices={[{ id: 'b1', invoiceNumber: 'INV-1', dateLabel: 'Nov 1', amountLabel: '$49', status: 'paid' }]} />
        <SignInView onSubmit={() => {}} />
        <MfaVerificationView onVerify={() => {}} />
        <PermissionMatrix roleNames={['Admin']} rows={[{ capability: 'Billing', roles: { Admin: true } }]} />
        <PrivacyConsentSettings consents={[{ id: 'p1', title: 'Essential', description: 'Required', enabled: true }]} onToggle={() => {}} />
        <PwaInstallPrompt onInstall={() => {}} />
        <DevicePermissionPrompt capability="camera" onRequestPermission={() => {}} />
        <ClipboardCopyButton value="WENDORO-20" />
      </div>
    );

    expect(screen.getByRole('grid', { name: 'Spreadsheet grid' })).toBeInTheDocument();
    expect(screen.getAllByText('Team Sync').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Starter Kit')).toBeInTheDocument();
    expect(screen.getByText('Two-factor verification')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
  });

  it('renders CandlestickChart, NetworkGraphChart, LineChart zoom, AI, Editors, and Adapters safely', async () => {
    const user = userEvent.setup();
    registerWendoroExtension({
      id: 'ext-geo',
      name: 'Geo Extension',
      subpath: '@wendoro/ui/adapters',
      contractVersion: '2.0.0',
      category: 'geospatial',
    });
    expect(listWendoroExtensions().some((e) => e.id === 'ext-geo')).toBe(true);
    expect(WENDORO_BUNDLE_BUDGETS.coreMaxGzipKb).toBeGreaterThan(0);

    const { unmount } = render(
      <div>
        <ClipboardProbe />
        <LineChart
          title="Zoomable Trend"
          zoomable
          data={[
            { m: 'Jan', v: 10 },
            { m: 'Feb', v: 20 },
            { m: 'Mar', v: 30 },
            { m: 'Apr', v: 40 },
          ]}
          xKey="m"
          series={[{ key: 'v', label: 'Units' }]}
        />
        <CandlestickChart
          title="OHLC Test"
          data={[{ label: 'Day 1', open: 10, high: 15, low: 8, close: 13 }]}
        />
        <NetworkGraphChart
          title="Graph Test"
          nodes={[{ id: 'a', label: 'Node A' }, { id: 'b', label: 'Node B' }]}
          edges={[{ source: 'a', target: 'b' }]}
        />
        <AiAssistantPanel
          models={[{ id: 'm1', name: 'Fast', provider: 'Host', contextWindow: '128k', latencyTier: 'fast' }]}
          selectedModelId="m1"
          onSelectModel={() => {}}
          messages={[{ id: '1', role: 'assistant', content: 'Hello from host' }]}
          promptValue=""
          onPromptChange={() => {}}
          onSubmitPrompt={() => {}}
        />
        <HumanApprovalCheckpoint
          actionTitle="Run action"
          description="Confirm"
          onApprove={() => {}}
          onReject={() => {}}
        />
        <SourceCitationsPanel
          citations={[
            { id: 'bad', title: 'Bad Link', href: 'javascript:alert(1)' },
            { id: 'ok', title: 'Safe Link', href: 'https://wendoro.in' },
          ]}
        />
        <MarkdownEditor value={'# Title\nBody <script>alert(1)</script>'} onChange={() => {}} />
        <ImageAnnotationPanel src="javascript:alert(1)" alt="Blocked" annotations={[]} />
        <VisualFormBuilder initialFields={[{ id: 'f1', label: 'Name', type: 'text' }]} />
        <MapAdapterProvider adapter={null}>
          <FleetTrackingWorkspace
            markers={[{ id: 'mk1', label: 'Hub 1', lat: 12.9, lng: 77.5, status: 'active' }]}
            routes={[{ id: 'r1', origin: 'A', destination: 'B', distanceLabel: '10km', etaLabel: '15m' }]}
          />
        </MapAdapterProvider>
        <SignatureCapturePad signerName="Demo User" />
      </div>
    );

    const links = screen.queryAllByRole('link');
    expect(links.some((a) => (a.getAttribute('href') ?? '').includes('javascript:'))).toBe(false);
    expect(screen.getByText('Preview unavailable for unverified image URL')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    unmount();
  });
});
