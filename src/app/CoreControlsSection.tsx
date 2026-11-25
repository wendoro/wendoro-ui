import * as React from 'react';
import { ArrowRight, Mail, Plus, Search, Trash2 } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export function CoreControlsSection() {
  const [loadingDemo, setLoadingDemo] = React.useState(false);
  const [workspaceApp, setWorkspaceApp] = React.useState('flow');
  const [requireSso, setRequireSso] = React.useState(true);
  const [partialCheck, setPartialCheck] = React.useState(false);
  const [approvalMode, setApprovalMode] = React.useState('dual');
  const [autoEscalation, setAutoEscalation] = React.useState(true);
  const [quotaLimit, setQuotaLimit] = React.useState(75);
  const [targetDate, setTargetDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Button System</CardTitle>
          <CardDescription>
            Six semantic variants, four sizes, icon support, and accessible focus & loading states.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Variants</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link Action</Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Sizes & Icon Buttons</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <IconButton aria-label="Create item" icon={<Plus className="h-4 w-4" />} variant="primary" />
              <IconButton aria-label="Search records" icon={<Search className="h-4 w-4" />} variant="outline" />
              <IconButton aria-label="Delete record" icon={<Trash2 className="h-4 w-4" />} variant="destructive" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">States & Icons</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Continue Setup
              </Button>
              <Button
                variant="primary"
                loading={loadingDemo}
                loadingText="Syncing…"
                onClick={() => {
                  setLoadingDemo(true);
                  window.setTimeout(() => setLoadingDemo(false), 1200);
                }}
              >
                Click to Test Loading
              </Button>
              <Button variant="outline" disabled>
                Disabled Outline
              </Button>
              <Button variant="destructive" disabled>
                Disabled Destructive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Text Inputs, Select & Date Picker</CardTitle>
            <CardDescription>Full keyboard navigation, validation errors, and adornments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Work Email" required hint="Notifications route to this address.">
              <Input
                type="email"
                placeholder="member@demo.invalid"
                leftAdornment={<Mail className="h-4 w-4" />}
              />
            </FormField>

            <FormField label="API Endpoint" error="Must begin with https://">
              <Input defaultValue="http://insecure.local" />
            </FormField>

            <FormField label="Connected Wendoro Product">
              <Select
                value={workspaceApp}
                onValueChange={setWorkspaceApp}
                options={[
                  { value: 'desk', label: 'Wendoro Desk', description: 'Operations & ticketing' },
                  { value: 'flow', label: 'Wendoro Flow', description: 'Workflow automation' },
                  { value: 'commerce', label: 'Wendoro Commerce', description: 'Billing & orders' },
                  { value: 'people', label: 'Wendoro People', description: 'HR & org directory' },
                ]}
              />
            </FormField>

            <FormField label="Effective Date">
              <DatePicker value={targetDate} onValueChange={setTargetDate} />
            </FormField>

            <FormField label="Deployment Notes" optional>
              <Textarea placeholder="Add rollout context for reviewers…" />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selection & Range Controls</CardTitle>
            <CardDescription>Checkboxes, RadioGroup, Switch, and accessible Slider.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Checkbox
                checked={requireSso}
                onCheckedChange={setRequireSso}
                label="Require SAML SSO sign-in"
                description="Blocks password-only login for organization members."
              />
              <Checkbox
                checked={partialCheck}
                indeterminate={!partialCheck}
                onCheckedChange={setPartialCheck}
                label="Select regional hubs (indeterminate demo)"
                description="Click to toggle between indeterminate and checked."
              />
            </div>

            <RadioGroup
              value={approvalMode}
              onValueChange={setApprovalMode}
              aria-label="Approval requirement"
              options={[
                { value: 'single', label: 'Single reviewer', description: 'Fast sign-off for standard tasks' },
                { value: 'dual', label: 'Dual control', description: 'Requires finance + operations approval' },
              ]}
            />

            <Switch
              checked={autoEscalation}
              onCheckedChange={setAutoEscalation}
              label="Automated SLA escalation"
              description="Route unacknowledged tickets after 30 minutes."
            />

            <Slider
              label="Monthly Alert Threshold"
              value={quotaLimit}
              onValueChange={setQuotaLimit}
              formatValue={(v) => `${v}%`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
