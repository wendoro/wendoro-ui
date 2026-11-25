import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Activity, Home, Layers, LayoutGrid, Settings } from 'lucide-react';
import {
  AssistantResponseCard,
  LiveActivityPulse,
  PresenceAvatarStack,
  PromptComposerBar,
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
import { Button } from '../src/components/ui/button';
import {
  ButtonGroup,
  QuantityStepper,
  SegmentedControl,
  SelectableChipGroup,
} from '../src/components/ui/controls';
import {
  CircularProgress,
  InlineLoader,
  MultiStepProgress,
  TransferProgressCard,
} from '../src/components/ui/feedback';
import { AppLauncher, CommandLauncher, QuickLaunchPanel, type LauncherEntry } from '../src/components/ui/launcher';
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

const meta: Meta = {
  title: 'Wendoro UI/2.0 Controls, Launchers, Installer & Window Manager',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Universal controls, sliders/scrubbers, scroll virtualization, resizable nested navigation, app/command launchers, presentation-only installer UI, workspace windowing, system states, and AI-native slots.',
      },
    },
  },
};

export default meta;

function SlidersAndControlsView() {
  const [single, setSingle] = React.useState(50);
  const [vertical, setVertical] = React.useState(70);
  const [range, setRange] = React.useState<[number, number]>([20, 80]);
  const [sec, setSec] = React.useState(35);
  const [playing, setPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(68);
  const [segment, setSegment] = React.useState('board');
  const [chips, setChips] = React.useState<string[]>(['ops']);
  const [qty, setQty] = React.useState(5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Stepped Quota"
            value={single}
            onValueChange={setSingle}
            step={25}
            marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]}
          />
          <RangeSlider label="Budget Window" value={range} onValueChange={setRange} />
          <TimelineScrubber
            currentTime={sec}
            duration={120}
            playing={playing}
            onTogglePlay={() => setPlaying((p) => !p)}
            onSeek={setSec}
          />
          <LevelControlSlider kind="volume" value={volume} onValueChange={setVolume} />
        </div>
        <div className="flex flex-col gap-5">
          <Slider orientation="vertical" label="Vertical Gain" value={vertical} onValueChange={setVertical} />
          <SegmentedControl
            value={segment}
            onValueChange={setSegment}
            options={[
              { value: 'board', label: 'Board', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
              { value: 'list', label: 'List', icon: <Layers className="h-3.5 w-3.5" /> },
              { value: 'activity', label: 'Pulse', icon: <Activity className="h-3.5 w-3.5" /> },
            ]}
          />
          <SelectableChipGroup
            value={chips}
            onValueChange={setChips}
            items={[
              { value: 'ops', label: 'Operations', count: 8 },
              { value: 'qa', label: 'Accessibility', count: 5 },
            ]}
          />
          <div className="flex flex-wrap items-end gap-4">
            <QuantityStepper label="Seats" unit="users" value={qty} onValueChange={setQty} />
            <ButtonGroup>
              <Button size="sm" variant="outline">Cancel</Button>
              <Button size="sm" variant="primary">Apply</Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SlidersAndUniversalControls: StoryObj = {
  render: () => <SlidersAndControlsView />,
};

function ScrollAndNavigationView() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [count, setCount] = React.useState(6);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const rows = React.useMemo(
    () => Array.from({ length: 80 }, (_, idx) => ({ id: `v-${idx}`, name: `Sample Row #${idx + 1}` })),
    []
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="h-72 overflow-hidden rounded-[var(--wdr-radius-md)] border border-border">
        <Sidebar
          collapsible
          resizable
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<span className="text-xs font-bold">Resizable Nav</span>}
        >
          <SidebarSection title="Workspace">
            <SidebarItem active icon={<Home className="h-4 w-4" />}>Home</SidebarItem>
            <SidebarNestedGroup label="Settings" icon={<Settings className="h-4 w-4" />} defaultOpen>
              <SidebarItem>Tokens</SidebarItem>
              <SidebarItem>Access</SidebarItem>
            </SidebarNestedGroup>
          </SidebarSection>
        </Sidebar>
      </div>

      <div className="space-y-3">
        <ScrollProgressIndicator targetRef={scrollRef} />
        <ScrollArea ref={scrollRef} maxHeight={180} className="rounded border border-border p-3">
          <InfiniteScrollContainer hasMore={count < 12} onLoadMore={() => setCount((c) => c + 3)}>
            <div className="space-y-2">
              {Array.from({ length: count }, (_, i) => (
                <div key={i} className="rounded border border-border px-2.5 py-1.5 text-xs">
                  Entry #{i + 1}
                </div>
              ))}
            </div>
          </InfiniteScrollContainer>
        </ScrollArea>
        <div className="flex items-center justify-between">
          <Button size="sm" variant="outline" onClick={() => setMenuOpen(true)}>FullscreenMobileMenu</Button>
          <ScrollToTopButton targetRef={scrollRef} alwaysVisible />
        </div>
        <FullscreenMobileMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          groups={[{ id: 'g', title: 'Main', items: [{ id: 'a', label: 'Dashboard', onSelect: () => {} }] }]}
        />
      </div>

      <VirtualizedList
        items={rows}
        itemHeight={42}
        viewportHeight={240}
        getKey={(r) => r.id}
        renderItem={(r) => <div className="px-3 py-2 text-xs">{r.name}</div>}
      />
    </div>
  );
}

export const ScrollAndResizableNavigation: StoryObj = {
  render: () => <ScrollAndNavigationView />,
};

function LaunchersLoadersAndInstallerView() {
  const [favs, setFavs] = React.useState<string[]>(['desk']);
  const [org, setOrg] = React.useState('Sample Organization');

  const entries: LauncherEntry[] = [
    { id: 'desk', name: 'Wendoro Desk', category: 'product', favorite: favs.includes('desk'), recent: true, onLaunch: () => {} },
    { id: 'studio', name: 'Workflow Studio', category: 'module', favorite: favs.includes('studio'), onLaunch: () => {} },
  ];

  const toggleFav = (id: string) =>
    setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <AppLauncher entries={entries} onToggleFavorite={toggleFav} />
        <CommandLauncher entries={entries} onToggleFavorite={toggleFav} />
        <InlineLoader label="Verifying assets…" />
        <CircularProgress indeterminate size={36} />
      </div>
      <QuickLaunchPanel entries={entries} onToggleFavorite={toggleFav} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton shimmer height="16px" className="w-1/2" />
          <TransferProgressCard mode="install" title="Sample Module Bundle" progress={65} />
          <MultiStepProgress
            steps={[
              { id: '1', label: 'Inspect dependencies', status: 'completed' },
              { id: '2', label: 'Apply theme contract', status: 'active' },
            ]}
          />
          <InstallationProgressTracker
            phase="installing"
            overallProgress={70}
            steps={[{ id: 'st1', label: 'Verify tokens', status: 'completed' }]}
            logs={['[demo] Token check passed']}
          />
        </div>
        <div className="space-y-4">
          <SetupWizard
            steps={[
              {
                id: 's1',
                title: 'Workspace Name',
                validate: () => (!org.trim() ? 'Required' : null),
                content: (
                  <input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    aria-label="Workspace name"
                    className="h-9 w-full rounded border border-input bg-surface px-3 text-sm"
                  />
                ),
              },
              {
                id: 's2',
                title: 'Prerequisites',
                content: (
                  <DependencyCheckList
                    items={[{ id: 'p1', name: 'React', requiredVersion: '>=18', detectedVersion: '19.x', status: 'ready' }]}
                  />
                ),
              },
            ]}
          />
          <UpdateManagerPanel
            currentVersion="2.0.0-beta"
            availableVersion="2.0.0"
            status="update_available"
            releaseNotes={['Added universal controls and window manager.']}
            onStartUpdate={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export const LaunchersLoadersAndInstallerUI: StoryObj = {
  render: () => <LaunchersLoadersAndInstallerView />,
};

function WindowManagerStatesAndAiView() {
  const [floatingOpen, setFloatingOpen] = React.useState(true);
  const [prompt, setPrompt] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PresenceAvatarStack
          collaborators={[
            { id: '1', name: 'Demo User', state: 'editing' },
            { id: '2', name: 'Sample Ops', state: 'viewing' },
          ]}
        />
        <div className="flex items-center gap-2">
          <LiveActivityPulse />
          <AutosaveIndicator status="saved" savedAtLabel="Just now" />
        </div>
      </div>
      <ConnectionStatusBanner status="offline" detail="Queued 2 updates" onRetry={() => {}} />
      <MultiPanelWorkspace
        leftPanel={<div className="p-2 text-xs">Navigation Slot</div>}
        rightPanel={<DockablePanel title="Inspector">{'Dockable inspector content'}</DockablePanel>}
        floatingSlot={
          <FloatingWindow open={floatingOpen} onClose={() => setFloatingOpen(false)} title="Floating Palette">
            Drag or use arrow keys to reposition.
          </FloatingWindow>
        }
      >
        <WorkspaceModeContainer title="Canvas Stage" className="border-0">
          <p className="text-xs text-muted-foreground">Focus, presentation, and fullscreen canvas container.</p>
        </WorkspaceModeContainer>
      </MultiPanelWorkspace>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <PromptComposerBar value={prompt} onValueChange={setPrompt} onSubmit={() => setPrompt('')} />
          <AssistantResponseCard
            body="Host-provided response preview with sanitized citations."
            citations={[{ id: 'c1', label: 'Wendoro Docs', href: 'https://wendoro.in' }]}
          />
        </div>
        <div className="space-y-3">
          <PermissionDeniedState requiredRole="Admin" onGoBack={() => {}} onRequestAccess={() => {}} />
          <MaintenanceState windowLabel="Sunday 02:00 UTC" statusUrl="https://wendoro.in" />
        </div>
      </div>
    </div>
  );
}

export const WindowManagerSystemStatesAndAI: StoryObj = {
  render: () => <WindowManagerStatesAndAiView />,
};
