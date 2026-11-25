import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Bell, Compass, Home, Layers, Plus, Settings } from 'lucide-react';
import {
  ContextMenu,
  FavoritesList,
  GlobalSearch,
  KeyboardShortcutHint,
  MegaMenu,
  NavigationRail,
  PageTabs,
  QuickActions,
  RecentItems,
} from '../src/components/ui/navigation-ext';
import { CommandMenu, SearchCommand } from '../src/components/ui/command';
import {
  Combobox,
  CurrencyInput,
  DateRangePicker,
  Dropzone,
  FieldGroup,
  FormSection,
  InputOTP,
  MultiSelect,
  MultiStepForm,
  NumberInput,
  PasswordInput,
  TagInput,
  TimePicker,
} from '../src/components/ui/forms';
import {
  Banner,
  CircularProgress,
  ConfirmationDialog,
  ErrorState,
  InlineAlert,
  LoadingOverlay,
  RetryState,
  SuccessState,
} from '../src/components/ui/feedback';
import { Button } from '../src/components/ui/button';

const meta: Meta = {
  title: 'Wendoro UI/Enterprise UI Modules',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Enterprise Navigation (MegaMenu, ContextMenu, NavigationRail, PageTabs, CommandMenu, QuickActions, GlobalSearch), Advanced Forms, and Modern Feedback components.',
      },
    },
  },
};

export default meta;

function EnterpriseNavigationDemo() {
  const [tab, setTab] = React.useState('overview');
  const [rail, setRail] = React.useState('home');
  const [search, setSearch] = React.useState('');
  const [cmdOpen, setCmdOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3">
        <MegaMenu
          sections={[
            {
              id: 'products',
              label: 'Products',
              groups: [
                {
                  title: 'Wendoro Ecosystem',
                  links: [
                    { id: 'desk', label: 'Wendoro Desk', description: 'Operations workspace (Demo)', href: '#desk' },
                    { id: 'flow', label: 'Wendoro Flow', description: 'Workflow automation (Demo)', href: '#flow' },
                  ],
                },
              ],
            },
          ]}
        />
        <GlobalSearch value={search} onValueChange={setSearch} onOpenCommand={() => setCmdOpen(true)} />
        <QuickActions
          actions={[
            { id: 'qa1', label: 'New Record', icon: <Plus className="h-3.5 w-3.5" />, onClick: () => {} },
            { id: 'qa2', label: 'Alerts', icon: <Bell className="h-3.5 w-3.5" />, onClick: () => {} },
          ]}
        />
      </div>

      <PageTabs
        activeId={tab}
        onTabChange={setTab}
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'records', label: 'Sample Records', badge: 6 },
          { id: 'audit', label: 'Audit Trail' },
        ]}
      />

      <div className="flex flex-wrap gap-6">
        <NavigationRail
          items={[
            { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: rail === 'home', onSelect: () => setRail('home') },
            { id: 'explore', label: 'Explore', icon: <Compass className="h-4 w-4" />, active: rail === 'explore', onSelect: () => setRail('explore') },
            { id: 'layers', label: 'Tokens', icon: <Layers className="h-4 w-4" />, active: rail === 'layers', onSelect: () => setRail('layers') },
            { id: 'settings', label: 'Config', icon: <Settings className="h-4 w-4" />, active: rail === 'settings', onSelect: () => setRail('settings') },
          ]}
        />

        <div className="flex-1 space-y-4">
          <ContextMenu
            items={[
              { id: 'copy', label: 'Copy Sample ID', onSelect: () => {} },
              { id: 'inspect', label: 'Inspect Element', onSelect: () => {} },
            ]}
          >
            <div className="rounded-[var(--wdr-radius-md)] border border-dashed border-border p-4 text-xs text-muted-foreground">
              Right-click or press Shift+F10 / Menu button here for ContextMenu
            </div>
          </ContextMenu>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RecentItems items={[{ id: 'r1', label: 'Example Project Alpha', category: '2m ago', onSelect: () => {} }]} />
            <FavoritesList items={[{ id: 'f1', label: 'Sample Record #01', category: 'Pinned', onSelect: () => {} }]} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Open quick commands:</span>
            <KeyboardShortcutHint keys={['⌘', 'K']} />
            <SearchCommand open={false} onOpenChange={() => {}} items={[]} />
          </div>
        </div>
      </div>

      <CommandMenu
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        items={[{ id: 'c1', label: 'Go to Overview', group: 'Nav', onSelect: () => setTab('overview') }]}
      />
    </div>
  );
}

export const NavigationSuite: StoryObj = {
  render: () => <EnterpriseNavigationDemo />,
};

function AdvancedFormsDemo() {
  const [multi, setMulti] = React.useState<string[]>(['tokens']);
  const [combo, setCombo] = React.useState('desk');
  const [tags, setTags] = React.useState(['enterprise', 'ui']);
  const [range, setRange] = React.useState({ startDate: '2026-11-01', endDate: '2026-11-30' });
  const [time, setTime] = React.useState('09:30');
  const [num, setNum] = React.useState(42);
  const [currency, setCurrency] = React.useState('1200');
  const [otp, setOtp] = React.useState('1234');

  return (
    <div className="space-y-6">
      <FormSection title="Enterprise Controls (Demo)" description="Controlled and accessible input modules.">
        <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <MultiSelect
            label="Enabled Subpaths"
            value={multi}
            onValueChange={setMulti}
            options={[
              { value: 'tokens', label: 'Tokens' },
              { value: 'charts', label: 'Charts' },
              { value: 'business', label: 'Business' },
            ]}
          />
          <Combobox
            label="Target Product"
            value={combo}
            onValueChange={setCombo}
            options={[
              { value: 'desk', label: 'Wendoro Desk' },
              { value: 'flow', label: 'Wendoro Flow' },
              { value: 'insights', label: 'Wendoro Insights' },
            ]}
          />
          <TagInput label="Tags" tags={tags} onTagsChange={setTags} />
          <PasswordInput label="Sample Secret Input" placeholder="Enter passphrase" />
          <NumberInput label="Sample Batch Size" value={num} onValueChange={setNum} min={1} max={100} />
          <CurrencyInput label="Sample Allocation" currencySymbol="$" value={currency} onValueChange={setCurrency} />
          <DateRangePicker startDate={range.startDate} endDate={range.endDate} onChange={setRange} />
          <TimePicker label="Schedule Time" value={time} onChange={setTime} />
        </FieldGroup>
      </FormSection>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputOTP label="Verification Code" length={4} value={otp} onValueChange={setOtp} />
        <Dropzone label="Sample Upload Area" onFilesSelected={() => {}} />
      </div>

      <MultiStepForm
        onSubmit={() => {}}
        steps={[
          { id: 'fs1', title: 'Details', content: <p className="text-xs text-muted-foreground">Step 1: Enter Example Project info.</p> },
          { id: 'fs2', title: 'Review', content: <p className="text-xs text-muted-foreground">Step 2: Confirm Demo User settings.</p> },
        ]}
      />
    </div>
  );
}

export const AdvancedFormsSuite: StoryObj = {
  render: () => <AdvancedFormsDemo />,
};

function FeedbackDemo() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <Banner variant="warning" title="Demo Environment Notice" description="All feedback banners and states below use synthetic data." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InlineAlert variant="success">Tokens synced cleanly.</InlineAlert>
        <InlineAlert variant="destructive">Sample validation check failed.</InlineAlert>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <CircularProgress value={76} label="Progress" />
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Open ConfirmationDialog
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <LoadingOverlay loading label="Loading sample…" className="h-32 rounded border border-border">
          <div className="p-4 text-xs">Underlying content</div>
        </LoadingOverlay>
        <ErrorState title="Sample Error" description="Illustrative retryable error." onRetry={() => {}} />
        <SuccessState title="Completed" description="Example action succeeded." />
      </div>
      <RetryState description="Connection interrupted in demo preview." onRetry={() => {}} />
      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Demo Action"
        description="Are you sure you want to proceed with this illustrative confirmation?"
        destructive
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  );
}

export const ModernFeedbackSuite: StoryObj = {
  render: () => <FeedbackDemo />,
};
