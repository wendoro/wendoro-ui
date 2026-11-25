import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  AssistantResponseCard,
  LiveActivityPulse,
  PresenceAvatarStack,
  PromptComposerBar,
  WENDORO_MODULE_CONTRACT_VERSION,
} from '../src/components/business/future-modules';
import {
  DependencyCheckList,
  InstallationProgressTracker,
  SetupWizard,
  UpdateManagerPanel,
} from '../src/components/business/installer';
import {
  DockablePanel,
  FloatingWindow,
  MultiPanelWorkspace,
  WorkspaceModeContainer,
} from '../src/components/business/workspace';
import {
  ButtonGroup,
  QuantityStepper,
  SegmentedControl,
  SelectableChipGroup,
} from '../src/components/ui/controls';
import {
  CircularProgress,
  FullScreenLoader,
  InlineLoader,
  MultiStepProgress,
  TransferProgressCard,
} from '../src/components/ui/feedback';
import { AppLauncher, CommandLauncher, QuickLaunchPanel } from '../src/components/ui/launcher';
import { FullscreenMobileMenu } from '../src/components/ui/navigation-ext';
import {
  InfiniteScrollContainer,
  ScrollArea,
  ScrollProgressIndicator,
  ScrollToTopButton,
  VirtualizedList,
} from '../src/components/ui/scroll';
import { Sidebar, SidebarItem, SidebarNestedGroup, SidebarSection } from '../src/components/ui/sidebar';
import { Skeleton } from '../src/components/ui/skeleton';
import { LevelControlSlider, RangeSlider, Slider, TimelineScrubber } from '../src/components/ui/slider';
import {
  AutosaveIndicator,
  ConnectionStatusBanner,
  MaintenanceState,
  PermissionDeniedState,
} from '../src/components/ui/system-states';

describe('Sliders & Universal Controls', () => {
  it('supports vertical Slider, marks, dual-thumb RangeSlider, TimelineScrubber, and LevelControlSlider', async () => {
    const user = userEvent.setup();
    const onSingle = vi.fn();
    const onRange = vi.fn();
    const onSeek = vi.fn();
    const onLevel = vi.fn();

    render(
      <div>
        <Slider
          label="Quota"
          defaultValue={25}
          marks={[{ value: 0, label: 'Zero' }, { value: 100, label: 'Max' }]}
          onValueChange={onSingle}
        />
        <Slider orientation="vertical" label="Vertical Gain" defaultValue={60} />
        <RangeSlider label="Budget" value={[20, 80]} min={0} max={100} minGap={5} onValueChange={onRange} />
        <TimelineScrubber currentTime={15} duration={120} onSeek={onSeek} onTogglePlay={vi.fn()} chapters={[{ id: 'c1', time: 60, label: 'Mid' }]} />
        <LevelControlSlider kind="volume" value={50} onValueChange={onLevel} />
      </div>
    );

    expect(screen.getByLabelText('Vertical Gain')).toHaveAttribute('aria-orientation', 'vertical');
    await user.click(screen.getByRole('button', { name: 'Max' }));
    expect(onSingle).toHaveBeenCalledWith(100);

    fireEvent.change(screen.getByLabelText('Budget minimum'), { target: { value: '40' } });
    expect(onRange).toHaveBeenCalledWith([40, 80]);

    await user.click(screen.getByRole('button', { name: /Mid \(01:00\)/ }));
    expect(onSeek).toHaveBeenCalledWith(60);

    await user.click(screen.getByRole('button', { name: 'Mute volume' }));
    expect(onLevel).toHaveBeenCalledWith(0);
  });

  it('supports keyboard navigation on SegmentedControl, chips, ButtonGroup, and QuantityStepper', async () => {
    const user = userEvent.setup();
    const onSegment = vi.fn();
    const onChips = vi.fn();
    const onQty = vi.fn();

    render(
      <div>
        <SegmentedControl
          defaultValue="a"
          onValueChange={onSegment}
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
          ]}
        />
        <SelectableChipGroup
          defaultValue={['one']}
          onValueChange={onChips}
          items={[
            { value: 'one', label: 'One', count: 2 },
            { value: 'two', label: 'Two', count: 5 },
          ]}
        />
        <ButtonGroup>
          <button type="button">First</button>
          <button type="button">Second</button>
        </ButtonGroup>
        <QuantityStepper label="Seats" defaultValue={2} min={1} max={5} onValueChange={onQty} />
      </div>
    );

    const radioA = screen.getByRole('radio', { name: 'Alpha' });
    radioA.focus();
    await user.keyboard('{ArrowRight}');
    expect(onSegment).toHaveBeenCalledWith('b');

    await user.click(screen.getByRole('button', { name: /Two/ }));
    expect(onChips).toHaveBeenCalledWith(['one', 'two']);

    await user.click(screen.getByRole('button', { name: 'Increase Seats' }));
    expect(onQty).toHaveBeenCalledWith(3);

    const spin = screen.getByRole('spinbutton', { name: 'Seats' });
    spin.focus();
    await user.keyboard('{ArrowDown}');
    expect(onQty).toHaveBeenLastCalledWith(2);
  });
});

describe('Scroll, Virtualization & Resizable Nested Navigation', () => {
  it('renders VirtualizedList slices, ScrollArea, ScrollProgressIndicator, InfiniteScrollContainer, and ScrollToTopButton', async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    const items = Array.from({ length: 100 }, (_, idx) => ({ id: `r-${idx}`, label: `Row ${idx}` }));

    render(
      <div>
        <ScrollProgressIndicator />
        <ScrollArea maxHeight={120}>
          <InfiniteScrollContainer hasMore onLoadMore={onLoadMore}>
            <div>Body content</div>
          </InfiniteScrollContainer>
        </ScrollArea>
        <ScrollToTopButton alwaysVisible />
        <VirtualizedList
          items={items}
          itemHeight={40}
          viewportHeight={120}
          overscan={1}
          getKey={(it) => it.id}
          renderItem={(it) => <div>{it.label}</div>}
        />
      </div>
    );

    expect(screen.getByRole('progressbar', { name: 'Reading scroll progress' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Load more items' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Back to top' })).toBeInTheDocument();

    // VirtualizedList only mounts the visible slice + overscan rather than all 100 rows
    const renderedRows = screen.getAllByRole('listitem');
    expect(renderedRows.length).toBeLessThan(20);
    expect(screen.getByText('Row 0')).toBeInTheDocument();
  });

  it('supports resizable Sidebar, SidebarNestedGroup, and FullscreenMobileMenu', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onSelectItem = vi.fn();

    render(
      <div>
        <Sidebar resizable defaultWidth={240} minWidth={180} maxWidth={320}>
          <SidebarSection title="Menu">
            <SidebarNestedGroup label="Platform">
              <SidebarItem>Billing</SidebarItem>
            </SidebarNestedGroup>
          </SidebarSection>
        </Sidebar>
        <FullscreenMobileMenu
          open
          onOpenChange={onOpenChange}
          title="Mobile Nav"
          groups={[
            {
              id: 'g1',
              title: 'Primary',
              items: [
                { id: 'i1', label: 'Analytics', onSelect: onSelectItem },
                { id: 'i2', label: 'Settings', onSelect: vi.fn() },
              ],
            },
          ]}
        />
      </div>
    );

    const separator = screen.getByRole('separator', { name: 'Resize sidebar' });
    separator.focus();
    await user.keyboard('{ArrowRight}');
    expect(separator).toHaveAttribute('aria-valuenow', '256');

    await user.click(screen.getByRole('button', { name: 'Platform' }));
    expect(screen.getByRole('button', { name: 'Billing' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Filter navigation'), 'Anal');
    expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Analytics' }));
    expect(onSelectItem).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('Loaders, Launchers & Installer UI', () => {
  it('renders Shimmer Skeleton, CircularProgress indeterminate, InlineLoader, FullScreenLoader, MultiStepProgress, and TransferProgressCard', () => {
    render(
      <div>
        <Skeleton shimmer data-testid="shimmer-sk" />
        <CircularProgress indeterminate label="Indeterminate ring" />
        <InlineLoader label="Syncing tokens…" />
        <FullScreenLoader open title="Bootstrapping workspace" onCancel={vi.fn()} />
        <MultiStepProgress
          steps={[
            { id: '1', label: 'Check', status: 'completed' },
            { id: '2', label: 'Apply', status: 'active' },
          ]}
        />
        <TransferProgressCard mode="download" title="bundle.zip" progress={45} onCancel={vi.fn()} />
      </div>
    );

    expect(screen.getByTestId('shimmer-sk')).toHaveClass('wdr-shimmer');
    const ring = screen.getByRole('progressbar', { name: 'Indeterminate ring' });
    expect(ring).not.toHaveAttribute('aria-valuenow');
    expect(screen.getByText('Syncing tokens…')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Bootstrapping workspace' })).toBeInTheDocument();
    expect(screen.getByText('1/2 (50%)')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Download bundle.zip' })).toHaveAttribute('aria-valuenow', '45');
  });

  it('filters and launches entries in QuickLaunchPanel, AppLauncher, and CommandLauncher', async () => {
    const user = userEvent.setup();
    const onLaunch = vi.fn();
    const onFav = vi.fn();
    const entries = [
      { id: 'desk', name: 'Wendoro Desk', category: 'product' as const, favorite: true, recent: true, onLaunch },
      { id: 'ops', name: 'Operations', category: 'module' as const, favorite: false, onLaunch: vi.fn() },
    ];

    render(
      <div>
        <AppLauncher entries={entries} onToggleFavorite={onFav} />
        <CommandLauncher entries={entries} />
        <QuickLaunchPanel entries={entries} onToggleFavorite={onFav} />
      </div>
    );

    await user.type(screen.getByLabelText('Search launcher entries'), 'Desk');
    expect(screen.queryByText('Operations')).not.toBeInTheDocument();
    await user.click(screen.getByText('Wendoro Desk').closest('button')!);
    expect(onLaunch).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'App launcher' }));
    expect(screen.getByRole('dialog', { name: 'App launcher' })).toBeInTheDocument();
  });

  it('validates SetupWizard, tracks InstallationProgressTracker, DependencyCheckList, and UpdateManagerPanel', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const onRetry = vi.fn();
    const onRollback = vi.fn();

    function WizardHarness() {
      const [val, setVal] = React.useState('');
      return (
        <SetupWizard
          onComplete={onComplete}
          steps={[
            {
              id: 's1',
              title: 'Step One',
              validate: () => (!val.trim() ? 'Name required' : null),
              content: (
                <input
                  aria-label="Org name"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                />
              ),
            },
            {
              id: 's2',
              title: 'Step Two',
              content: <div>Ready to finalize</div>,
            },
          ]}
        />
      );
    }

    render(
      <div>
        <WizardHarness />
        <DependencyCheckList
          items={[{ id: 'd1', name: 'React', requiredVersion: '>=18', detectedVersion: '19.x', status: 'ready' }]}
        />
        <InstallationProgressTracker
          phase="failed"
          overallProgress={40}
          steps={[{ id: 'i1', label: 'Install', status: 'failed' }]}
          logs={['[err] Checksum mismatch']}
          onRetry={onRetry}
          onRollback={onRollback}
        />
        <UpdateManagerPanel
          currentVersion="1.0.0"
          availableVersion="2.0.0"
          status="update_available"
          releaseNotes={['Performance improvements']}
          onStartUpdate={vi.fn()}
        />
      </div>
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Name required');

    await user.type(screen.getByLabelText('Org name'), 'Sample Org');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await user.click(screen.getByRole('button', { name: 'Finish setup' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Setup complete')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show activity log (1)' }));
    expect(screen.getByText('[err] Checksum mismatch')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry step' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Rollback changes' }));
    expect(onRollback).toHaveBeenCalledTimes(1);
  });
});

describe('Workspace Windowing, System States & AI/Presence', () => {
  it('supports WorkspaceModeContainer focus/escape, DockablePanel, and FloatingWindow keyboard movement', async () => {
    const user = userEvent.setup();
    render(
      <MultiPanelWorkspace
        title="Studio"
        rightPanel={<DockablePanel title="Inspector">{'Inspector body'}</DockablePanel>}
        floatingSlot={
          <FloatingWindow open title="Tool Window" initialPosition={{ x: 20, y: 20 }}>
            Window contents
          </FloatingWindow>
        }
      >
        <WorkspaceModeContainer title="Canvas">
          <div>Canvas content</div>
        </WorkspaceModeContainer>
      </MultiPanelWorkspace>
    );

    const canvasRoot = screen.getByText('Canvas').closest('[data-workspace-mode]')!;
    expect(canvasRoot).toHaveAttribute('data-workspace-mode', 'standard');

    await user.click(screen.getAllByRole('button', { name: 'Focus' })[1]);
    expect(canvasRoot).toHaveAttribute('data-workspace-mode', 'focus');
    await user.keyboard('{Escape}');
    expect(canvasRoot).toHaveAttribute('data-workspace-mode', 'standard');

    const dragHandle = screen.getByLabelText('Tool Window drag handle (use arrow keys to move)');
    dragHandle.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('dialog', { name: 'Tool Window' })).toHaveStyle({ left: '36px' });

    await user.click(screen.getByRole('button', { name: 'Dock bottom' }));
    expect(screen.getByLabelText('Inspector (bottom dock)')).toBeInTheDocument();
  });

  it('renders ConnectionStatusBanner, AutosaveIndicator, PermissionDeniedState, and sanitizes MaintenanceState URLs', () => {
    render(
      <div>
        <ConnectionStatusBanner status="offline" detail="Queued 1 change" onRetry={vi.fn()} />
        <AutosaveIndicator status="unsaved" onSaveNow={vi.fn()} />
        <PermissionDeniedState requiredRole="Admin" onGoBack={vi.fn()} onRequestAccess={vi.fn()} />
        <MaintenanceState windowLabel="02:00 UTC" statusUrl="javascript:alert(1)" />
      </div>
    );

    expect(screen.getByText('You are currently offline')).toBeInTheDocument();
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    expect(screen.getByText('Required role: Admin')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'View status page' })).not.toBeInTheDocument();
  });

  it('renders PromptComposerBar, AssistantResponseCard with sanitized URLs, PresenceAvatarStack, LiveActivityPulse, and contract version', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    function PromptHarness() {
      const [val, setVal] = React.useState('');
      return <PromptComposerBar value={val} onValueChange={setVal} onSubmit={onSubmit} />;
    }

    render(
      <div>
        <PromptHarness />
        <AssistantResponseCard
          body="Synthetic answer."
          citations={[
            { id: 'ok', label: 'Safe Source', href: 'https://wendoro.in' },
            { id: 'bad', label: 'Unsafe Source', href: 'javascript:alert(1)' },
          ]}
        />
        <PresenceAvatarStack
          collaborators={[
            { id: '1', name: 'Demo User', state: 'editing' },
            { id: '2', name: 'Sample Ops', state: 'viewing' },
          ]}
        />
        <LiveActivityPulse />
      </div>
    );

    await user.type(screen.getByLabelText('Describe an action, query, or draft…'), 'Generate summary');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledWith('Generate summary');

    expect(screen.getByRole('link', { name: 'Safe Source' })).toHaveAttribute('href', 'https://wendoro.in');
    expect(screen.queryByRole('link', { name: 'Unsafe Source' })).not.toBeInTheDocument();
    expect(screen.getByText('2 active')).toBeInTheDocument();
    expect(WENDORO_MODULE_CONTRACT_VERSION).toBe('2.0.0');
  });
});
