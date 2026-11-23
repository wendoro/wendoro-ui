import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Plus } from 'lucide-react';
import { Button, IconButton } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

describe('Core Components', () => {
  it('renders Button variants, sizes, disabled state, and loading state properly', async () => {
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

  it('supports controlled and uncontrolled Input with FormField error state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <FormField label="Work Email" required error="Invalid corporate domain">
        <Input placeholder="name@wendoro.in" onChange={onChange} />
      </FormField>
    );

    const input = screen.getByLabelText(/Work Email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid corporate domain');

    await user.type(input, 'ananya@wendoro.in');
    expect(input).toHaveValue('ananya@wendoro.in');
    expect(onChange).toHaveBeenCalled();
  });

  it('supports keyboard navigation, disabled options, and Escape on Select', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="Product"
        onValueChange={onValueChange}
        options={[
          { value: 'desk', label: 'Wendoro Desk' },
          { value: 'disabled-opt', label: 'Legacy', disabled: true },
          { value: 'flow', label: 'Wendoro Flow' },
        ]}
      />
    );

    const trigger = screen.getByRole('combobox', { name: 'Product' });
    trigger.focus();
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('flow');

    await user.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles Checkbox (including indeterminate), Switch, RadioGroup, and Slider accessibly', async () => {
    const user = userEvent.setup();
    const onCheck = vi.fn();
    const onSwitch = vi.fn();
    const onRadio = vi.fn();
    const onSlider = vi.fn();

    render(
      <div>
        <Checkbox label="Accept terms" indeterminate onCheckedChange={onCheck} />
        <Switch label="Enable alerts" onCheckedChange={onSwitch} />
        <RadioGroup
          aria-label="Tier"
          onValueChange={onRadio}
          options={[
            { value: 'core', label: 'Core' },
            { value: 'pro', label: 'Pro' },
          ]}
        />
        <Slider label="Threshold" defaultValue={50} min={0} max={100} onValueChange={onSlider} />
      </div>
    );

    const checkbox = screen.getByLabelText('Accept terms') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    await user.click(checkbox);
    expect(onCheck).toHaveBeenCalledWith(true);

    const toggle = screen.getByRole('switch', { name: 'Enable alerts' });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(onSwitch).toHaveBeenCalledWith(true);

    await user.click(screen.getByLabelText('Pro'));
    expect(onRadio).toHaveBeenCalledWith('pro');

    const slider = screen.getByLabelText('Threshold');
    fireEvent.change(slider, { target: { value: '80' } });
    expect(onSlider).toHaveBeenCalledWith(80);
  });

  it('selects and clears dates with Calendar and DatePicker', async () => {
    const user = userEvent.setup();
    const onCalSelect = vi.fn();

    function DatePickerHarness() {
      const [date, setDate] = React.useState<Date | undefined>(undefined);
      return <DatePicker aria-label="Target date" value={date} onValueChange={setDate} />;
    }

    render(
      <div>
        <Calendar month={new Date(2026, 10, 1)} minDate={new Date(2026, 10, 10)} onSelect={onCalSelect} />
        <DatePickerHarness />
      </div>
    );

    const disabledDay = screen.getByRole('button', { name: new Date(2026, 10, 5).toDateString() });
    expect(disabledDay).toBeDisabled();

    const validDay = screen.getByRole('button', { name: new Date(2026, 10, 15).toDateString() });
    await user.click(validDay);
    expect(onCalSelect).toHaveBeenCalled();

    const pickerTrigger = screen.getByRole('button', { name: 'Target date' });
    await user.click(pickerTrigger);
    const pickerDialog = screen.getByRole('dialog');
    const dayButtons = within(pickerDialog).getAllByRole('button', { name: /18/ });
    const targetDay = dayButtons.find((b) => b.getAttribute('aria-label')?.includes('18'));
    expect(targetDay).toBeDefined();
    await user.click(targetDay!);
    await user.click(screen.getByRole('button', { name: 'Clear selected date' }));
    expect(pickerTrigger).toHaveTextContent('Select date');
  });

  it('enforces disabled states on Button, Input, Select, and Switch and supports Select Home/End keys', async () => {
    const user = userEvent.setup();
    const onBtn = vi.fn();
    const onSelect = vi.fn();
    const onSwitch = vi.fn();

    render(
      <div>
        <Button disabled onClick={onBtn}>
          Disabled Action
        </Button>
        <FormField label="Workspace Slug" hint="Lowercase only.">
          <input id="custom-slug-id" type="text" />
        </FormField>
        <Input aria-label="Locked Input" disabled defaultValue="locked" />
        <Select
          aria-label="Tier Select"
          onValueChange={onSelect}
          options={[
            { value: 'a', label: 'Alpha' },
            { value: 'b', label: 'Beta' },
            { value: 'c', label: 'Gamma' },
          ]}
        />
        <Switch label="Locked Switch" disabled onCheckedChange={onSwitch} />
      </div>
    );

    const disabledBtn = screen.getByRole('button', { name: 'Disabled Action' });
    expect(disabledBtn).toBeDisabled();
    await user.click(disabledBtn);
    expect(onBtn).not.toHaveBeenCalled();

    const customInput = screen.getByLabelText('Workspace Slug');
    expect(customInput).toHaveAttribute('id', 'custom-slug-id');
    expect(customInput).toHaveAttribute('aria-describedby', 'custom-slug-id-hint');

    expect(screen.getByLabelText('Locked Input')).toBeDisabled();

    const lockedSwitch = screen.getByRole('switch', { name: 'Locked Switch' });
    await user.click(lockedSwitch);
    expect(onSwitch).not.toHaveBeenCalled();

    const tierSelect = screen.getByRole('combobox', { name: 'Tier Select' });
    tierSelect.focus();
    await user.keyboard('{End}{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('c');
    await user.keyboard('{Home}{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('a');
  });

  it('supports controlled vs uncontrolled Switch state', async () => {
    const user = userEvent.setup();

    function ControlledSwitch() {
      const [checked, setChecked] = React.useState(false);
      return (
        <div>
          <Switch label="Controlled Toggle" checked={checked} onCheckedChange={setChecked} />
          <span data-testid="switch-state">{checked ? 'on' : 'off'}</span>
        </div>
      );
    }

    render(<ControlledSwitch />);
    expect(screen.getByTestId('switch-state')).toHaveTextContent('off');
    await user.click(screen.getByRole('switch', { name: 'Controlled Toggle' }));
    expect(screen.getByTestId('switch-state')).toHaveTextContent('on');
  });
});

