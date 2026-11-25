import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Mail } from 'lucide-react';
import { Input } from '../src/components/ui/input';
import { Label } from '../src/components/ui/label';
import { Textarea } from '../src/components/ui/textarea';
import { Select } from '../src/components/ui/select';
import { Checkbox } from '../src/components/ui/checkbox';
import { Radio, RadioGroup } from '../src/components/ui/radio';
import { Switch } from '../src/components/ui/switch';
import { Slider } from '../src/components/ui/slider';
import { FormField } from '../src/components/ui/form-field';

const meta: Meta = {
  title: 'Core/Form Controls',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Accessible form controls (Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, FormField) bound to Wendoro semantic tokens.',
      },
    },
  },
};

export default meta;

function AllControlsDemo() {
  const [product, setProduct] = React.useState('desk');
  const [agreed, setAgreed] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [slaTarget, setSlaTarget] = React.useState(95);

  return (
      <div className="max-w-xl space-y-6">
        <FormField label="Workspace Email" required hint="Used for audit alerts and SSO routing.">
          <Input
            type="email"
            placeholder="member@demo.invalid"
            leftAdornment={<Mail className="h-4 w-4" />}
          />
        </FormField>

        <FormField label="Invalid Input Example" error="Domain verification is required.">
          <Input defaultValue="invalid-domain" />
        </FormField>

        <FormField label="Target Application">
          <Select
            value={product}
            onValueChange={setProduct}
            options={[
              { value: 'desk', label: 'Wendoro Desk', description: 'Ticketing & customer ops' },
              { value: 'flow', label: 'Wendoro Flow', description: 'Workflow automation' },
              { value: 'commerce', label: 'Wendoro Commerce', description: 'Orders & billing' },
            ]}
          />
        </FormField>

        <FormField label="Release Notes" optional>
          <Textarea placeholder="Summarize deployment notes…" />
        </FormField>

        <Checkbox
          checked={agreed}
          onCheckedChange={setAgreed}
          label="Enforce SSO across all workspaces"
          description="Applies immediately to new member invitations."
        />

        <RadioGroup
          defaultValue="standard"
          aria-label="Approval policy"
          options={[
            { value: 'standard', label: 'Standard Approval', description: 'Single manager sign-off' },
            { value: 'strict', label: 'Dual Control', description: 'Requires two independent reviewers' },
          ]}
        />

        <Switch
          checked={notifications}
          onCheckedChange={setNotifications}
          label="Real-time SLA escalations"
          description="Notify team leads 15 minutes before breach."
        />

        <Slider
          label="SLA Attainment Target"
          value={slaTarget}
          onValueChange={setSlaTarget}
          formatValue={(v) => `${v}%`}
        />

        <FormField label="Read-only / Disabled Control" hint="Locked by workspace policy.">
          <Input defaultValue="demo-workspace-01" disabled />
        </FormField>

        <div className="space-y-2 border-t border-border pt-4">
          <Label htmlFor="standalone-radio-opt" optional>
            Standalone Label &amp; Radio
          </Label>
          <Radio
            id="standalone-radio-opt"
            name="standalone-demo"
            value="demo"
            label="Use illustrative defaults"
            defaultChecked
          />
        </div>
      </div>
  );
}

export const AllControls: StoryObj = {
  render: () => <AllControlsDemo />,
};

export const ValidationAndDisabled: StoryObj = {
  render: () => (
    <div className="max-w-xl space-y-5">
      <FormField label="Workspace Domain" required error="Enter a valid domain (e.g. demo.invalid).">
        <Input defaultValue="invalid" />
      </FormField>
      <FormField label="Locked Workspace ID" hint="Managed by demo workspace policy.">
        <Input defaultValue="wdr-demo-workspace" disabled />
      </FormField>
      <Select
        disabled
        value="desk"
        options={[{ value: 'desk', label: 'Wendoro Desk (Locked)' }]}
      />
      <Checkbox disabled checked label="Audit logging enforced" />
      <Switch disabled checked label="Strict TLS policy" />
    </div>
  ),
};

export const DarkTheme: StoryObj = {
  render: () => (
    <div
      className="dark rounded-[var(--wdr-radius-lg)] border border-border bg-background p-6 text-foreground"
      data-theme="dark"
    >
      <AllControlsDemo />
    </div>
  ),
};
