import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Home, Layers, Settings } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../src/components/ui/card';
import { Container } from '../src/components/ui/container';
import { Dialog, DialogFooter } from '../src/components/ui/dialog';
import { Grid } from '../src/components/ui/grid';
import { Separator } from '../src/components/ui/separator';
import { Sheet } from '../src/components/ui/sheet';
import { Stack } from '../src/components/ui/stack';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/components/ui/tabs';
import { Breadcrumb } from '../src/components/ui/breadcrumb';
import { Pagination } from '../src/components/ui/pagination';
import { DropdownMenu } from '../src/components/ui/dropdown';
import { NavigationMenu } from '../src/components/ui/navigation-menu';
import { Sidebar, SidebarItem, SidebarSection } from '../src/components/ui/sidebar';

const meta: Meta = {
  title: 'Layout & Navigation/Overview',
  tags: ['autodocs'],
};

export default meta;

function InteractiveLayoutAndNavDemo() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
      <div className="space-y-8">
        <NavigationMenu
          items={[
            { id: 'overview', label: 'Overview', active: true, onClick: () => {} },
            {
              id: 'products',
              label: 'Ecosystem',
              items: [
                { label: 'Wendoro Desk', description: 'Customer operations & ticketing' },
                { label: 'Wendoro Platform', description: 'Identity & shared tokens' },
              ],
            },
          ]}
        />

        <Breadcrumb
          items={[
            { label: 'Wendoro Platform', href: '#platform' },
            { label: 'Design System', href: '#ds' },
            { label: 'Navigation' },
          ]}
        />

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open Dialog
          </Button>
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            Open Sheet
          </Button>
          <DropdownMenu
            trigger={<Button variant="secondary">Actions Menu</Button>}
            items={[
              { id: 'dup', label: 'Duplicate View', shortcut: '⌘D', onSelect: () => {} },
              { id: 'exp', label: 'Export CSV', shortcut: '⌘E', onSelect: () => {} },
              { id: 'sep', label: '', separator: true },
              { id: 'del', label: 'Archive Workspace', destructive: true, onSelect: () => {} },
            ]}
          />
        </div>

        <Tabs defaultValue="overview" variant="segment">
          <TabsList aria-label="Workspace views">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="audit" disabled>Audit Log (Disabled)</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Wendoro Workspace</CardTitle>
                <CardDescription>Unified surface container with single-elevation border.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Panels adapt cleanly between Warm White and Deep Black themes.
                </p>
              </CardContent>
              <CardFooter>
                <Pagination page={page} totalPages={8} onPageChange={setPage} />
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="tokens">
            <p className="text-sm text-muted-foreground">CSS variables power all color and shadow tokens.</p>
          </TabsContent>
          <TabsContent value="audit">
            <p className="text-sm text-muted-foreground">Audit events are tracked with tabular timestamps.</p>
          </TabsContent>
        </Tabs>

        <Container size="lg" className="px-0">
          <Stack gap={4}>
            <Separator label="Layout Primitives" />
            <Grid cols={3} gap={3}>
              <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-xs">Grid Cell 1</div>
              <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-xs">Grid Cell 2</div>
              <div className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-xs">Grid Cell 3</div>
            </Grid>
          </Stack>
        </Container>

        <div className="h-64 overflow-hidden rounded-[var(--wdr-radius-lg)] border border-border">
          <Sidebar
            collapsible
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            header={<span className="text-sm font-bold">Wendoro Studio</span>}
          >
            <SidebarSection title="Workspace">
              <SidebarItem icon={<Home className="h-4 w-4" />} active>
                Overview
              </SidebarItem>
              <SidebarItem icon={<Layers className="h-4 w-4" />}>Components</SidebarItem>
              <SidebarItem icon={<Settings className="h-4 w-4" />}>Settings</SidebarItem>
            </SidebarSection>
          </Sidebar>
        </div>

        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Confirm Policy Update"
          description="Applies updated retention policies across Wendoro Desk and Support."
        >
          <p className="text-sm text-muted-foreground">
            Active user sessions will remain uninterrupted.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setDialogOpen(false)}>
              Confirm Update
            </Button>
          </DialogFooter>
        </Dialog>

        <Sheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          title="Inspector"
          description="Configuration summary"
          footer={
            <Button variant="primary" onClick={() => setSheetOpen(false)}>
              Done
            </Button>
          }
        >
          <p className="text-sm text-muted-foreground">Sheet drawer content with Escape key support.</p>
        </Sheet>
      </div>
  );
}

export const InteractiveLayoutAndNav: StoryObj = {
  render: () => <InteractiveLayoutAndNavDemo />,
};

export const DarkTheme: StoryObj = {
  render: () => (
    <div
      className="dark rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <InteractiveLayoutAndNavDemo />
    </div>
  ),
};
