import * as React from 'react';
import { Bell, Info, Layers, ShieldAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert } from '@/components/ui/alert';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible } from '@/components/ui/collapsible';
import { Dialog, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu } from '@/components/ui/dropdown';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { Popover } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Sheet } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';

import { WENDORO_TEAM_MEMBERS } from '@/data/wendoro-demo-data';

const TEAM_AVATARS = WENDORO_TEAM_MEMBERS.map((member) => ({
  id: member.id,
  alt: member.name,
}));

export function FeedbackAndNavSection() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);
  const [showDismissedAlert, setShowDismissedAlert] = React.useState(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Badges</CardTitle>
            <CardDescription>Paired iconography and explicit status text for accessibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert variant="neutral" title="Workspace Sync Ready">
              Connected to Wendoro Platform identity provider.
            </Alert>
            <Alert variant="success" title="Validation Sample Passed">
              Sample validation run completed with zero schema issues (demo).
            </Alert>
            <Alert variant="warning" title="Certificate Expiring Soon">
              Sample signing certificate renews in 7 days (illustrative).
            </Alert>
            {showDismissedAlert ? (
              <Alert
                variant="destructive"
                title="Webhook Retry Queued"
                dismissible
                onDismiss={() => setShowDismissedAlert(false)}
              >
                Sample retry queued for Wendoro Commerce demo batch #01.
              </Alert>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowDismissedAlert(true)}>
                Restore Dismissed Alert
              </Button>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toasts, Progress & Loading States</CardTitle>
            <CardDescription>Live aria-live notifications, progress bars, skeletons, and spinners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2.5">
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  toast({
                    title: 'Workflow published',
                    description: 'Version 2.4 is active across Wendoro Flow.',
                    variant: 'success',
                  })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast({
                    title: 'Export queued',
                    description: 'Your ledger CSV will download shortly.',
                    variant: 'default',
                  })
                }
              >
                Neutral Toast
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  toast({
                    title: 'Permission denied',
                    description: 'Administrator role required for token rotation.',
                    variant: 'destructive',
                  })
                }
              >
                Error Toast
              </Button>
            </div>

            <div className="space-y-3">
              <Progress label="Quarterly Ledger Migration" value={68} showValue variant="primary" />
              <Progress label="Accessibility Audit" value={100} showValue variant="success" />
            </div>

            <div className="flex items-center gap-5">
              <Spinner size="sm" />
              <Spinner size="md" variant="primary" />
              <div className="flex-1">
                <Skeleton shape="text" lines={2} />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <AvatarGroup items={TEAM_AVATARS} max={4} />
              <div className="flex items-center gap-2">
                <Tooltip content="View workspace documentation">
                  <Button variant="outline" size="sm" leftIcon={<Info className="h-3.5 w-3.5" />}>
                    Hover / Focus Tooltip
                  </Button>
                </Tooltip>
                <Popover
                  trigger={
                    <Button variant="secondary" size="sm" leftIcon={<Bell className="h-3.5 w-3.5" />}>
                      Popover
                    </Button>
                  }
                >
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">Quick Status</div>
                    <p className="text-xs text-muted-foreground">
                      All 8 Wendoro product tokens are synchronized.
                    </p>
                  </div>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overlays, Navigation & Disclosure</CardTitle>
          <CardDescription>
            Keyboard-accessible Dialog, Sheet, Tabs, Breadcrumb, Pagination, DropdownMenu, and Accordion.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Breadcrumb
              items={[
                { label: 'Wendoro', href: '#foundations' },
                { label: 'Components', href: '#feedback' },
                { label: 'Navigation' },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2.5">
              <Button variant="primary" size="sm" onClick={() => setDialogOpen(true)}>
                Open Dialog
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSheetOpen(true)}>
                Open Sheet
              </Button>
              <DropdownMenu
                trigger={
                  <Button variant="secondary" size="sm" leftIcon={<Layers className="h-3.5 w-3.5" />}>
                    Menu
                  </Button>
                }
                items={[
                  { id: 'copy', label: 'Copy Token Path', shortcut: '⌘C', onSelect: () => {} },
                  { id: 'inspect', label: 'Inspect Contrast', shortcut: '⌘I', onSelect: () => {} },
                  { id: 'div', label: '', separator: true },
                  { id: 'revoke', label: 'Revoke Key', destructive: true, icon: <ShieldAlert className="h-3.5 w-3.5" />, onSelect: () => {} },
                ]}
              />
            </div>
          </div>

          <Tabs defaultValue="segment-a" variant="segment">
            <TabsList aria-label="Preview navigation tabs">
              <TabsTrigger value="segment-a">Design Tokens</TabsTrigger>
              <TabsTrigger value="segment-b">Accessibility</TabsTrigger>
              <TabsTrigger value="segment-c">Pagination</TabsTrigger>
            </TabsList>
            <TabsContent value="segment-a">
              <Accordion defaultValue="acc-1">
                <AccordionItem value="acc-1">
                  <AccordionTrigger>How does Wendoro UI handle Light and Dark themes?</AccordionTrigger>
                  <AccordionContent>
                    ThemeProvider applies `.dark` and `data-theme` to the document root, swapping CSS variables in place without page reload.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="acc-2">
                  <AccordionTrigger>Can teams consume individual components?</AccordionTrigger>
                  <AccordionContent>
                    Yes. Package exports support tree-shakable ESM imports from `@wendoro/ui` and standalone token imports from `@wendoro/ui/tokens`.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="segment-b">
              <Collapsible trigger="WCAG 2.2 AA Verification Checklist">
                Every interactive component provides keyboard navigation, visible focus rings, ARIA roles, and non-color-only state cues.
              </Collapsible>
            </TabsContent>
            <TabsContent value="segment-c">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--wdr-radius-md)] border border-border p-4">
                <span className="text-sm text-muted-foreground tabular-nums">Current Page: {page} of 12</span>
                <Pagination page={page} totalPages={12} onPageChange={setPage} />
              </div>
            </TabsContent>
          </Tabs>

          <EmptyState
            compact
            title="Saved Views Ready"
            description="Create a custom filter preset to pin recurring operational metrics here."
            action={<Button variant="primary" size="sm">Create Saved View</Button>}
          />
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Publish Design Token Release"
        description="Updates semantic variables across connected Wendoro applications."
      >
        <p className="text-sm text-muted-foreground">
          Focus is trapped inside this modal and returns to the trigger button on close. Press Escape to dismiss.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setDialogOpen(false);
              toast({ title: 'Release published', variant: 'success' });
            }}
          >
            Publish Release
          </Button>
        </DialogFooter>
      </Dialog>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Component Inspector"
        description="Runtime token verification"
        footer={
          <Button variant="primary" onClick={() => setSheetOpen(false)}>
            Close Inspector
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar alt="Demo Lead" status="online" />
            <div>
              <div className="text-sm font-semibold">Demo Lead</div>
              <div className="text-xs text-muted-foreground">Sample Systems Lead · Demo Workspace</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sheets slide cleanly from viewport edges for configuration drawers, record detail panels, and audit inspection.
          </p>
        </div>
      </Sheet>
    </div>
  );
}
