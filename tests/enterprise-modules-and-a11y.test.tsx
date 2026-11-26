import * as React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, ButtonGroup } from '@/components/ui';
import { SegmentedControl } from '@/components/ui/controls';
import { DynamicFormBuilder, RichTextEditor } from '@/components/ui/forms';
import {
  FullscreenMobileMenu,
  HamburgerButton,
  MegaMenu,
  WorkspaceSwitcher,
} from '@/components/ui/navigation-ext';
import { ThemeProvider, useTheme } from '@/hooks/use-theme';
import { SignInView } from '@/components/business/identity';
import { ImageAnnotationPanel, MarkdownEditor } from '@/components/editors';
import { MessageComposer } from '@/components/business/communication';
import { AssistantResponseCard } from '@/components/business/future-modules';
import { SplitPanel } from '@/components/business/shell';
import { FloatingWindow } from '@/components/business/workspace';
import { FileManager, type FileManagerItem } from '@/components/business/file-manager';
import {
  HelpCenterPanel,
  SettingsPageLayout,
  SettingsSection,
} from '@/components/business/admin-settings';
import {
  CreatorPublishingPattern,
  CrmSalesPipelinePattern,
  HospitalityBookingPattern,
  InventoryWarehousePattern,
  ProjectDeliveryPattern,
} from '@/components/business/patterns';

function PresetOverrideProbe() {
  const { presetId, resolvedTheme } = useTheme();
  return (
    <div data-testid="preset-probe" data-preset={presetId} data-theme={resolvedTheme}>
      {presetId}
    </div>
  );
}

function FullscreenMenuHarness() {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button type="button">Outside Trigger</button>
      <HamburgerButton open={open} onClick={() => setOpen((prev) => !prev)} />
      <FullscreenMobileMenu
        open={open}
        onOpenChange={setOpen}
        title="Wendoro Menu"
        groups={[
          {
            id: 'main',
            title: 'Navigation',
            items: [
              { id: 'home', label: 'Home', onSelect: () => {} },
              { id: 'settings', label: 'Settings', onSelect: () => {} },
            ],
          },
        ]}
      />
    </div>
  );
}

describe('Wendoro UI 2.0 Enterprise Modules, Subpaths & A11y Hardening', () => {
  it('preserves defaultPresetId overrides on mount when customTheme prop is omitted', () => {
    render(
      <ThemeProvider defaultTheme="light" defaultPresetId="wendoro-editorial" disableStorage scoped>
        <PresetOverrideProbe />
      </ThemeProvider>
    );

    const probe = screen.getByTestId('preset-probe');
    expect(probe).toHaveAttribute('data-preset', 'wendoro-editorial');
    const wrapper = probe.parentElement as HTMLElement;
    expect(wrapper.style.getPropertyValue('--wdr-primary')).toBe('#EAB308');
  });

  it('ships complete semantic and interaction CSS custom properties in high-contrast.css', () => {
    const hcCss = fs.readFileSync(
      path.resolve(process.cwd(), 'src/themes/high-contrast.css'),
      'utf-8'
    );
    expect(hcCss).toContain('--wdr-primary-hover:');
    expect(hcCss).toContain('--wdr-primary-active:');
    expect(hcCss).toContain('--wdr-destructive-subtle-foreground:');
    expect(hcCss).toContain('--wdr-selected:');
    expect(hcCss).toContain('--wdr-disabled-foreground:');
  });

  it('exports ButtonGroup from @/components/ui and moves DOM focus with roving tabIndex in SegmentedControl', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <ButtonGroup>
          <Button variant="primary">First</Button>
          <Button variant="outline">Second</Button>
        </ButtonGroup>
        <SegmentedControl
          defaultValue="grid"
          options={[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'board', label: 'Board' },
          ]}
        />
      </div>
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    const gridRadio = screen.getByRole('radio', { name: 'Grid' });
    const listRadio = screen.getByRole('radio', { name: 'List' });
    const boardRadio = screen.getByRole('radio', { name: 'Board' });

    expect(gridRadio).toHaveAttribute('tabindex', '0');
    expect(listRadio).toHaveAttribute('tabindex', '-1');

    gridRadio.focus();
    await user.keyboard('{ArrowRight}');
    expect(listRadio).toHaveFocus();
    expect(listRadio).toHaveAttribute('aria-checked', 'true');

    await user.keyboard('{End}');
    expect(boardRadio).toHaveFocus();
    await user.keyboard('{Home}');
    expect(gridRadio).toHaveFocus();
  });

  it('traps focus, locks body overflow, and restores focus on Escape in FullscreenMobileMenu', async () => {
    const user = userEvent.setup();
    render(<FullscreenMenuHarness />);

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(menuButton);

    const dialog = screen.getByRole('dialog', { name: 'Wendoro Menu' });
    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    const closeBtn = screen.getByRole('button', { name: /close fullscreen menu/i });
    const settingsBtn = screen.getByRole('button', { name: /Settings/i });

    settingsBtn.focus();
    await user.keyboard('{Tab}');
    expect(closeBtn).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(menuButton).toHaveFocus();
  });

  it('supports keyboard navigation in MegaMenu and WorkspaceSwitcher', async () => {
    const user = userEvent.setup();
    const onSelectWs = vi.fn();

    render(
      <div>
        <MegaMenu
          sections={[
            {
              id: 'products',
              label: 'Products',
              groups: [{ title: 'Core', links: [{ id: 'desk', label: 'Desk', href: '#desk' }] }],
            },
            {
              id: 'platform',
              label: 'Platform',
              groups: [{ title: 'Infra', links: [{ id: 'tokens', label: 'Tokens', href: '#tokens' }] }],
            },
          ]}
        />
        <WorkspaceSwitcher
          workspaces={[
            { id: 'w1', name: 'Sample Org Alpha' },
            { id: 'w2', name: 'Sample Org Beta' },
          ]}
          activeWorkspaceId="w1"
          onSelectWorkspace={onSelectWs}
        />
      </div>
    );

    const productsBtn = screen.getByRole('button', { name: 'Products' });
    productsBtn.focus();
    await user.keyboard('{ArrowRight}');
    const platformBtn = screen.getByRole('button', { name: 'Platform' });
    expect(platformBtn).toHaveFocus();
    await user.click(platformBtn);
    expect(screen.getByRole('link', { name: 'Tokens' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(platformBtn).toHaveFocus();

    const wsBtn = screen.getByRole('button', { name: /switch workspace/i });
    await user.click(wsBtn);
    const searchInput = screen.getByLabelText('Filter workspaces');
    expect(searchInput).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onSelectWs).toHaveBeenCalledWith('w1');
    expect(wsBtn).toHaveFocus();
  });

  it('links aria-invalid and aria-describedby error messages across DynamicFormBuilder, RichTextEditor, and SignInView', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <RichTextEditor label="Notes" value="" onChange={() => {}} error="Notes are required" />
        <DynamicFormBuilder
          fields={[{ name: 'org', label: 'Organization', type: 'text', required: true }]}
          onSubmit={() => {}}
        />
        <SignInView error="Invalid demo credentials" onSubmit={() => {}} />
      </div>
    );

    const richArea = screen.getByLabelText('Notes');
    expect(richArea).toHaveAttribute('aria-invalid', 'true');
    const richErrId = richArea.getAttribute('aria-describedby');
    expect(richErrId).toBeTruthy();
    expect(document.getElementById(richErrId!)).toHaveTextContent('Notes are required');

    await user.click(screen.getByRole('button', { name: 'Review submission' }));
    const orgInput = screen.getByLabelText(/Organization/i);
    expect(orgInput).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById(orgInput.getAttribute('aria-describedby')!)).toHaveTextContent(
      'This field is required.'
    );

    expect(screen.getAllByRole('alert').some((el) => el.textContent?.includes('Invalid demo credentials'))).toBe(true);
    const signInEmail = screen.getByLabelText('Work email');
    expect(signInEmail).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders XSS-safe links, bold/code markdown, and supports annotation removal, real file attach, and safe unmounts', async () => {
    const user = userEvent.setup();
    const onRemovePin = vi.fn();
    const onSend = vi.fn();

    const { unmount } = render(
      <div>
        <MarkdownEditor
          value={'**Release** `v2.0` [Unsafe](javascript:alert(1)) [Wendoro](https://wendoro.in)'}
          onChange={() => {}}
        />
        <ImageAnnotationPanel
          src="/assets/sample.png"
          alt="Screenshot Review"
          annotations={[{ id: 'a1', xPercent: 20, yPercent: 30, note: 'Check contrast' }]}
          onAddAnnotation={() => {}}
          onRemoveAnnotation={onRemovePin}
        />
        <MessageComposer onSend={onSend} />
        <AssistantResponseCard body="Synthetic response" />
        <SplitPanel resizable left={<div>Left</div>} right={<div>Right</div>} />
        <FloatingWindow open title="Floating">
          <div>Window Body</div>
        </FloatingWindow>
      </div>
    );

    const safeLink = screen.getByRole('link', { name: 'Wendoro' });
    expect(safeLink).toHaveAttribute('href', 'https://wendoro.in');
    expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument();
    expect(screen.getByText('Release').tagName).toBe('STRONG');

    await user.click(screen.getByRole('button', { name: 'Remove pin 1' }));
    expect(onRemovePin).toHaveBeenCalledWith('a1');

    const fileInput = screen.getByLabelText('Select files to attach') as HTMLInputElement;
    const sampleFile = new File(['hello'], 'specs.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [sampleFile] } });
    expect(screen.getByText('specs.pdf')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSend).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Copy response text' }));
    const splitter = screen.getByRole('separator', { name: 'Resize panel' });
    fireEvent.pointerDown(splitter, { clientX: 200 });
    expect(() => unmount()).not.toThrow();
  });

  it('supports FileManager search, filter, view toggle, bulk select, upload, inspector, and error/loading states', async () => {
    const user = userEvent.setup();
    const onBulk = vi.fn();
    const onUpload = vi.fn();
    const onRetry = vi.fn();
    const items: FileManagerItem[] = [
      { id: '1', name: 'Design Docs', kind: 'folder', sizeLabel: '4 items', updatedAt: 'Today', owner: 'Demo User' },
      { id: '2', name: 'Audit.pdf', kind: 'document', sizeBytes: 2048, sizeLabel: '2 KB', updatedAt: 'Yesterday', owner: 'Sample Member A', mimeType: 'application/pdf' },
    ];

    const { rerender } = render(
      <FileManager items={items} onBulkAction={onBulk} onUploadFiles={onUpload} onRetry={onRetry} />
    );

    await user.click(screen.getByText('Audit.pdf'));
    expect(screen.getByText('application/pdf')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Select Audit.pdf'));
    expect(screen.getByText('1 selected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onBulk).toHaveBeenCalledWith('delete', ['2']);

    await user.click(screen.getByRole('radio', { name: /List/i }));
    expect(screen.getByRole('table')).toBeInTheDocument();

    const uploadInput = screen.getByLabelText('Upload files') as HTMLInputElement;
    fireEvent.change(uploadInput, { target: { files: [new File(['x'], 'new.txt', { type: 'text/plain' })] } });
    expect(onUpload).toHaveBeenCalled();

    rerender(<FileManager items={[]} loading />);
    expect(screen.getByLabelText('Loading files')).toBeInTheDocument();

    rerender(<FileManager items={[]} error="Connection lost" onRetry={onRetry} />);
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders SettingsPageLayout, HelpCenterPanel, and all 5 new Layer E industry patterns cleanly', async () => {
    const user = userEvent.setup();
    const onCategory = vi.fn();
    const onSave = vi.fn();
    const onTicket = vi.fn();

    render(
      <div>
        <SettingsPageLayout
          categories={[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
          ]}
          activeCategoryId="profile"
          onCategoryChange={onCategory}
          dirty
          onSave={onSave}
        >
          <SettingsSection title="Profile Settings">
            <div>Section body</div>
          </SettingsSection>
        </SettingsPageLayout>

        <HelpCenterPanel
          articles={[
            { id: 'a1', title: 'Tokens Guide', category: 'Tokens', summary: 'Overview', content: 'Detailed token notes.' },
          ]}
          faqs={[{ id: 'q1', question: 'Is it SSR-safe?', answer: 'Yes.' }]}
          onSubmitTicket={onTicket}
        />

        <CrmSalesPipelinePattern
          columns={[{ id: 's1', title: 'Qualified' }]}
          deals={[{ id: 'd1', columnId: 's1', title: 'Sample Deal' }]}
          accounts={[{ id: 'ac1', accountName: 'Sample Organization', owner: 'Demo User', stage: 'Qualified', dealValueLabel: '$50,000', health: 'active' }]}
        />
        <InventoryWarehousePattern
          zones={[{ id: 'z1', zoneName: 'Zone A', occupancyPercent: 60, skuCount: 25 }]}
          skus={[{ id: 'sk1', sku: 'SKU-1', itemName: 'Item 1', zone: 'Zone A', onHand: 4, reorderPoint: 10, status: 'warning' }]}
          onReorderSku={() => {}}
        />
        <ProjectDeliveryPattern
          kanbanColumns={[{ id: 'c1', title: 'Todo' }]}
          kanbanCards={[{ id: 'k1', columnId: 'c1', title: 'Task 1' }]}
          resources={[{ id: 'r1', name: 'Demo User', role: 'Lead', capacityHours: 40, allocations: { W1: 30 } }]}
          periods={['W1']}
        />
        <HospitalityBookingPattern
          units={[{ id: 'u1', unitCode: 'STE-100', category: 'Suite', guestOrTenant: 'Demo Guest', windowLabel: 'Today', status: 'pending', statusLabel: 'Ready' }]}
          onCheckIn={() => {}}
        />
        <CreatorPublishingPattern
          editorialStages={[{ id: 'e1', label: 'Draft', state: 'completed' }]}
          drafts={[{ id: 'p1', title: 'Release Note', channel: 'Blog', author: 'Demo User', scheduledFor: 'Tomorrow', stage: 'scheduled' }]}
          onPublishDraft={() => {}}
        />
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Security' }));
    expect(onCategory).toHaveBeenCalledWith('security');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(onSave).toHaveBeenCalledTimes(1);

    await user.type(screen.getByLabelText('Subject'), 'Need help');
    await user.type(screen.getByLabelText('Details'), 'Synthetic ticket body');
    await user.click(screen.getByRole('button', { name: 'Submit request' }));
    expect(onTicket).toHaveBeenCalledTimes(1);

    expect(screen.getByText('Deal Stage Board')).toBeInTheDocument();
    expect(screen.getAllByText('Zone A').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Delivery Board')).toBeInTheDocument();
    expect(screen.getByText('STE-100')).toBeInTheDocument();
    expect(screen.getByText('Release Note')).toBeInTheDocument();
  });
});
