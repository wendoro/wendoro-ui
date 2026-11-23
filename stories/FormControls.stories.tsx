import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Mail } from 'lucide-react';
import { Input } from '../src/components/ui/input';
import { Textarea } from '../src/components/ui/textarea';
import { Select } from '../src/components/ui/select';
import { Checkbox } from '../src/components/ui/checkbox';
import { RadioGroup } from '../src/components/ui/radio';
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
            placeholder="ops@wendoro.in"
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
      </div>
  );
}

export const AllControls: StoryObj = {
  render: () => <AllControlsDemo />,
};
