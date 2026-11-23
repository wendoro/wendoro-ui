import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Plus } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

describe('Core Components', () => {
  it('renders Button variants, disabled state, and loading state properly', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { rerender } = render(
      <Button variant="primary" size="lg" onClick={onClick}>
        Save Record
      </Button>
    );

    const btn = screen.getByRole('button', { name: 'Save Record' });
    expect(btn).toHaveAttribute('data-variant', 'primary');
    expect(btn).toHaveAttribute('data-size', 'lg');

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <Button variant="destructive" loading loadingText="Deleting…" onClick={onClick}>
        Delete
      </Button>
    );

    const loadingBtn = screen.getByRole('button', { name: /Deleting/i });
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute('aria-busy', 'true');
    await user.click(loadingBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders IconButton with accessible label', () => {
    render(<IconButton aria-label="Add workspace" icon={<Plus />} />);
    expect(screen.getByRole('button', { name: 'Add workspace' })).toBeInTheDocument();
  });

  it('wires FormField label and error alert to Input', () => {
    render(
      <FormField label="Work Email" required error="Invalid corporate domain">
        <Input placeholder="name@wendoro.in" />
      </FormField>
    );

    const input = screen.getByLabelText(/Work Email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid corporate domain');
  });

  it('supports keyboard navigation and selection on Select', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="Product"
        onValueChange={onValueChange}
        options={[
          { value: 'desk', label: 'Wendoro Desk' },
          { value: 'flow', label: 'Wendoro Flow' },
        ]}
      />
    );

    const trigger = screen.getByRole('combobox', { name: 'Product' });
    trigger.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('flow');
  });

  it('toggles Checkbox, Switch, and RadioGroup accessibly', async () => {
    const user = userEvent.setup();
    const onCheck = vi.fn();
    const onSwitch = vi.fn();
    const onRadio = vi.fn();

    render(
      <div>
        <Checkbox label="Accept terms" onCheckedChange={onCheck} />
        <Switch label="Enable alerts" onCheckedChange={onSwitch} />
        <RadioGroup
          aria-label="Tier"
          onValueChange={onRadio}
          options={[
            { value: 'core', label: 'Core' },
            { value: 'pro', label: 'Pro' },
          ]}
        />
      </div>
    );

    await user.click(screen.getByLabelText('Accept terms'));
    expect(onCheck).toHaveBeenCalledWith(true);

    const toggle = screen.getByRole('switch', { name: 'Enable alerts' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onSwitch).toHaveBeenCalledWith(true);

    await user.click(screen.getByLabelText('Pro'));
    expect(onRadio).toHaveBeenCalledWith('pro');
  });
});
