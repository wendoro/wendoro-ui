import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  HelpCenterPanel,
  SettingsPageLayout,
  SettingsSection,
} from '../src/components/business/admin-settings';
import { FileManager, type FileManagerItem } from '../src/components/business/file-manager';

const meta: Meta = {
  title: 'Wendoro UI/2.0 File Manager, Settings & Help',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Modular FileManager repository browser, SettingsPageLayout with responsive section navigation and dirty-state sticky bar, and HelpCenterPanel documentation/support portal using synthetic demo data.',
      },
    },
  },
};

export default meta;

const DEMO_REPO_ITEMS: FileManagerItem[] = [
  {
    id: 'fm-1',
    name: 'Brand Guidelines',
    kind: 'folder',
    sizeLabel: '12 items',
    updatedAt: 'Today, 09:30',
    owner: 'Demo User',
    shared: true,
    tags: ['tokens', 'guidelines'],
    path: '/demo/brand',
  },
  {
    id: 'fm-2',
    name: 'Quarterly-Audit-Summary.pdf',
    kind: 'document',
    sizeBytes: 1840000,
    sizeLabel: '1.8 MB',
    updatedAt: 'Yesterday',
    owner: 'Sample Member A',
    mimeType: 'application/pdf',
    shared: true,
    tags: ['compliance'],
    path: '/demo/reports/quarterly-audit.pdf',
  },
  {
    id: 'fm-3',
    name: 'Product-Preview-Tile.png',
    kind: 'image',
    sizeBytes: 940000,
    sizeLabel: '940 KB',
    updatedAt: 'Nov 20',
    owner: 'Sample Member B',
    mimeType: 'image/png',
    tags: ['media'],
    path: '/demo/media/tile.png',
  },
];

function FileManagerDemo() {
  const [items, setItems] = React.useState(DEMO_REPO_ITEMS);
  return (
    <FileManager
      items={items}
      breadcrumbs={[{ label: 'Sample Organization', href: '#org' }, { label: 'Assets' }]}
      onUploadFiles={(files) =>
        setItems((prev) => [
          ...prev,
          ...files.map((f, idx) => ({
            id: `up-${idx}-${f.name}`,
            name: f.name,
            kind: 'document' as const,
            sizeBytes: f.size,
            sizeLabel: `${Math.max(1, Math.round(f.size / 1024))} KB`,
            updatedAt: 'Just now',
            owner: 'Demo User',
            mimeType: f.type || 'application/octet-stream',
          })),
        ])
      }
      onBulkAction={(action, ids) => {
        if (action === 'delete') {
          setItems((prev) => prev.filter((item) => !ids.includes(item.id)));
        }
      }}
    />
  );
}

export const FileRepositoryBrowser: StoryObj = {
  render: () => <FileManagerDemo />,
};

export const FileRepositoryStates: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <FileManager items={[]} loading title="Loading Repository State" />
      <FileManager items={[]} error="Synthetic network timeout loading repository." onRetry={() => {}} />
    </div>
  ),
};

function SettingsWorkspaceDemo() {
  const [categoryId, setCategoryId] = React.useState('general');
  const [dirty, setDirty] = React.useState(true);
  const [orgName, setOrgName] = React.useState('Sample Organization');

  return (
    <SettingsPageLayout
      categories={[
        { id: 'general', label: 'Workspace Profile', badge: 'Core' },
        { id: 'security', label: 'Security & RBAC', badge: '2.0' },
        { id: 'billing', label: 'Billing Contacts' },
      ]}
      activeCategoryId={categoryId}
      onCategoryChange={setCategoryId}
      dirty={dirty}
      onSave={() => setDirty(false)}
      onDiscard={() => {
        setOrgName('Sample Organization');
        setDirty(false);
      }}
    >
      <SettingsSection
        title="Organization Details"
        description="Presentational settings section with dirty-state StickyActionBar."
        badge={dirty ? 'Unsaved' : 'Saved'}
      >
        <div className="space-y-1.5 text-xs">
          <label htmlFor="sb-org-name" className="block font-medium text-foreground">
            Organization Name
          </label>
          <input
            id="sb-org-name"
            type="text"
            value={orgName}
            onChange={(e) => {
              setOrgName(e.target.value);
              setDirty(true);
            }}
            className="h-9 w-full max-w-md rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
          />
        </div>
      </SettingsSection>
    </SettingsPageLayout>
  );
}

export const SettingsWorkspaceLayout: StoryObj = {
  render: () => <SettingsWorkspaceDemo />,
};

export const HelpAndSupportPortal: StoryObj = {
  render: () => (
    <HelpCenterPanel
      articles={[
        {
          id: 'g1',
          title: 'Getting Started with Modular Subpaths',
          category: 'Architecture',
          summary: 'Import @wendoro/ui/core, /forms, /data, /workspace, /commerce, /admin, and /industry cleanly.',
          content: 'Modular subpaths reduce bundle footprint for consumer applications.',
          updatedLabel: 'Nov 2026',
        },
        {
          id: 'g2',
          title: 'Accessibility & Keyboard Navigation',
          category: 'Accessibility',
          summary: 'Roving focus, trapped dialogs/menus, and WCAG 2.2 AA contrast tokens.',
          content: 'All interactive Wendoro modules preserve keyboard operability and screen-reader semantics.',
          updatedLabel: 'Nov 2026',
        },
      ]}
      faqs={[
        {
          id: 'q1',
          question: 'Can ThemeProvider run with custom brand overrides?',
          answer: 'Yes. Pass customTheme or defaultPresetId to customize semantic CSS variables.',
        },
      ]}
      onSubmitTicket={() => {}}
    />
  ),
};
