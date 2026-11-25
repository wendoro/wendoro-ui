import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart3, FolderKanban, Home, Settings } from 'lucide-react';
import {
  AppShell,
  ContentSection,
  DashboardHeader,
  DashboardSidebar,
  PageContainer,
  PageToolbar,
  ResizablePanel,
  SidebarNavigation,
  SplitPanel,
  TopNavigation,
} from '../src/components/business/shell';
import { Button } from '../src/components/ui/button';
import { SidebarItem, SidebarSection } from '../src/components/ui/sidebar';

const meta: Meta = {
  title: 'Wendoro UI/Dashboard Components',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application shell, dashboard header, sidebar navigation, split panel, keyboard-accessible resizable panel, and responsive drawer.',
      },
    },
  },
};

export default meta;

function ShellAndNavigationDemo() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <AppShell
      mobileNavOpen={mobileOpen}
      onMobileNavOpenChange={setMobileOpen}
      mobileNavTitle="Sample Organization"
      sidebar={
        <DashboardSidebar
          header={<span className="font-bold">Wendoro Studio</span>}
          footer={<span className="text-xs text-muted-foreground">Sample Organization (Demo)</span>}
        >
          <SidebarSection title="Core">
            <SidebarItem icon={<Home className="h-4 w-4" />} active>
              Overview
            </SidebarItem>
            <SidebarItem icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </SidebarItem>
            <SidebarItem icon={<FolderKanban className="h-4 w-4" />}>
              Workflows
            </SidebarItem>
          </SidebarSection>
        </DashboardSidebar>
      }
      header={
        <DashboardHeader
          title="Example Project Shell"
          breadcrumbs={[{ label: 'Demo' }, { label: 'Shell' }]}
          onOpenMobileNav={() => setMobileOpen(true)}
          actions={<Button size="sm" variant="primary">New Item</Button>}
        />
      }
      footer={<span>Wendoro UI Presentation Shell · Synthetic Demo</span>}
    >
      <PageContainer className="space-y-6 py-6">
        <PageToolbar
          left={<span className="text-sm font-semibold">Workspace Toolbar</span>}
          right={<Button size="sm" variant="outline">Export</Button>}
        />
        <ContentSection title="Resizable & Split Panels" description="Drag handle or press ArrowLeft/ArrowRight keys.">
          <ResizablePanel
            left={
              <div className="p-4 text-sm">
                <div className="font-semibold">Primary Inspector</div>
                <p className="mt-1 text-xs text-muted-foreground">Keyboard-adjustable left pane.</p>
              </div>
            }
            right={
              <div className="p-4 text-sm">
                <div className="font-semibold">Details Pane</div>
                <p className="mt-1 text-xs text-muted-foreground">Adapts automatically as split ratio changes.</p>
              </div>
            }
          />
        </ContentSection>
        <SplitPanel
          left={<div className="p-4 text-xs">Split Primary Column</div>}
          right={<div className="p-4 text-xs">Split Secondary Column</div>}
        />
        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface">
          <TopNavigation
            brand="Product Top Nav"
            items={[
              { id: 't1', label: 'Summary', active: true },
              { id: 't2', label: 'Reports' },
              { id: 't3', label: 'Settings' },
            ]}
            actions={<Button size="sm" variant="ghost" aria-label="Settings"><Settings className="h-4 w-4" /></Button>}
          />
          <div className="border-t border-border p-4">
            <SidebarNavigation
              groups={[
                {
                  id: 'g1',
                  title: 'Standalone SidebarNavigation',
                  items: [
                    { id: 's1', label: 'Overview', active: true },
                    { id: 's2', label: 'Team (Demo)', badge: '4' },
                  ],
                },
              ]}
            />
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}

export const ShellAndNavigation: StoryObj = {
  render: () => <ShellAndNavigationDemo />,
};
