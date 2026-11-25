import * as React from 'react';
import { Check, ChevronDown, Eye, EyeOff, Minus, Plus, Upload, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';
import { Button } from '../button';
import { Card } from '../card';

export interface SelectOptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export function FieldDescription({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <p id={id} className={cn('text-xs text-muted-foreground leading-relaxed', className)}>
      {children}
    </p>
  );
}

export function FieldGroup({
  legend,
  description,
  children,
  className,
}: {
  legend?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn('space-y-3 border-0 p-0 m-0', className)}>
      {legend && <legend className="text-sm font-semibold text-foreground">{legend}</legend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
}

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="border-b border-border pb-3">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export interface MultiSelectProps {
  options: SelectOptionItem[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function MultiSelect({
  options,
  value: controlled,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select options…',
  label,
  disabled = false,
  error,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const selected = controlled ?? internal;
  const listboxId = useStableId(undefined, 'wdr-ms');

  const toggleOption = (val: string) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn('relative space-y-1.5', className)}>
      {label && <div className="text-xs font-medium text-foreground">{label}</div>}
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label ?? placeholder}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          'flex min-h-10 w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border bg-surface px-3 py-1.5 text-left text-sm',
          error ? 'border-destructive' : 'border-input',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {selected.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selected.map((val) => {
              const lbl = options.find((o) => o.value === val)?.label ?? val;
              return (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-sm)] bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                >
                  {lbl}
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 top-full z-40 mt-1 max-h-56 w-full overflow-auto rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-md)]"
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  disabled={opt.disabled}
                  onClick={() => toggleOption(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-sm hover:bg-muted',
                    checked && 'bg-primary-subtle font-medium text-primary-subtle-foreground'
                  )}
                >
                  <span>{opt.label}</span>
                  {checked && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export interface ComboboxProps {
  options: SelectOptionItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function Combobox({
  options,
  value: controlled,
  defaultValue = '',
  onValueChange,
  placeholder = 'Search and select…',
  label,
  disabled = false,
  error,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [internal, setInternal] = React.useState(defaultValue);
  const selected = controlled ?? internal;
  const listboxId = useStableId(undefined, 'wdr-cb');

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  const commit = (val: string) => {
    if (controlled === undefined) setInternal(val);
    onValueChange?.(val);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className={cn('relative space-y-1.5', className)}>
      {label && <label className="block text-xs font-medium text-foreground">{label}</label>}
      <div className="relative">
        <input
          type="text"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={label ?? placeholder}
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          className={cn(
            'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface pl-3 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            error ? 'border-destructive' : 'border-input',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
        {selected && !disabled && (
          <button
            type="button"
            aria-label="Clear selection"
            onClick={() => commit('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {open && !disabled && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-full z-40 mt-1 max-h-52 w-full overflow-auto rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-md)]"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-xs text-muted-foreground">No matching options</li>
          ) : (
            filtered.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected === opt.value}
                  onClick={() => commit(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-sm hover:bg-muted',
                    selected === opt.value && 'bg-primary text-primary-foreground'
                  )}
                >
                  <span>{opt.label}</span>
                  {selected === opt.value && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Autocomplete(props: ComboboxProps) {
  return <Combobox {...props} />;
}

export function SearchableSelect(props: ComboboxProps) {
  return <Combobox {...props} />;
}

export interface TagInputProps {
  tags?: string[];
  defaultTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function TagInput({
  tags: controlled,
  defaultTags = [],
  onTagsChange,
  placeholder = 'Add tag and press Enter…',
  label,
  disabled = false,
  className,
}: TagInputProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultTags);
  const [draft, setDraft] = React.useState('');
  const current = controlled ?? internal;

  const update = (next: string[]) => {
    if (controlled === undefined) setInternal(next);
    onTagsChange?.(next);
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <div className="text-xs font-medium text-foreground">{label}</div>}
      <div className="flex flex-wrap items-center gap-1.5 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 py-2">
        {current.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-sm)] bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => update(current.filter((t) => t !== tag))}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          disabled={disabled}
          value={draft}
          aria-label={label ?? 'Add tag'}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && draft.trim()) {
              e.preventDefault();
              const trimmed = draft.trim();
              if (!current.includes(trimmed)) update([...current, trimmed]);
              setDraft('');
            }
          }}
          className="min-w-[140px] flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </div>
  );
}

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  disabled = false,
  className,
}: {
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <input
        type="date"
        aria-label="Start date"
        disabled={disabled}
        value={startDate}
        onChange={(e) => onChange({ startDate: e.target.value, endDate })}
        className="h-10 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <span className="text-xs text-muted-foreground">to</span>
      <input
        type="date"
        aria-label="End date"
        disabled={disabled}
        value={endDate}
        onChange={(e) => onChange({ startDate, endDate: e.target.value })}
        className="h-10 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

export function TimePicker({
  value,
  onChange,
  label = 'Select time',
  disabled = false,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type="time"
      aria-label={label}
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-10 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    />
  );
}

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropzone({
  onFilesSelected,
  accept,
  multiple = false,
  label = 'Upload files',
  description = 'Select local files to attach. Processing is handled by your host handler.',
  disabled = false,
  className,
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        if (!disabled) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        const files = Array.from(e.dataTransfer?.files ?? []);
        if (files.length > 0) onFilesSelected(files);
      }}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-[var(--wdr-radius-lg)] border-2 border-dashed p-6 text-center transition-colors',
        dragging ? 'border-primary bg-primary-subtle/40' : 'border-border bg-surface',
        disabled && 'opacity-50',
        className
      )}
    >
      <Upload className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFilesSelected(files);
        }}
        className="sr-only"
      />
      <Button
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        Choose file
      </Button>
    </div>
  );
}

export function FileUpload(props: DropzoneProps) {
  return <Dropzone {...props} />;
}

export function PasswordInput({
  label,
  error,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const [visible, setVisible] = React.useState(false);
  const id = useStableId(props.id, 'wdr-pw');

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          id={id}
          type={visible ? 'text' : 'password'}
          className={cn(
            'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface pl-3 pr-10 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            error ? 'border-destructive' : 'border-input'
          )}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function NumberInput({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  label,
  disabled = false,
  className,
}: {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const id = useStableId(undefined, 'wdr-num');
  const clamp = (n: number) => {
    let next = n;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="inline-flex items-center rounded-[var(--wdr-radius-md)] border border-input bg-surface">
        <button
          type="button"
          disabled={disabled || (min !== undefined && value <= min)}
          aria-label="Decrease value"
          onClick={() => onValueChange(clamp(value - step))}
          className="inline-flex h-10 w-9 items-center justify-center border-r border-input text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
        <input
          id={id}
          type="number"
          disabled={disabled}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const parsed = Number(e.target.value);
            if (Number.isFinite(parsed)) onValueChange(clamp(parsed));
          }}
          className="h-10 w-20 bg-transparent px-2 text-center text-sm tabular-nums text-foreground focus:outline-none"
        />
        <button
          type="button"
          disabled={disabled || (max !== undefined && value >= max)}
          aria-label="Increase value"
          onClick={() => onValueChange(clamp(value + step))}
          className="inline-flex h-10 w-9 items-center justify-center border-l border-input text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function CurrencyInput({
  value,
  onValueChange,
  currencySymbol = '$',
  label,
  disabled = false,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  currencySymbol?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const id = useStableId(undefined, 'wdr-cur');
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span aria-hidden="true" className="pointer-events-none absolute left-3 text-sm font-medium text-muted-foreground">
          {currencySymbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface pl-8 pr-3 text-sm tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

export function InputOTP({
  length = 6,
  value,
  onValueChange,
  label = 'Verification code',
  disabled = false,
  className,
}: {
  length?: number;
  value: string;
  onValueChange: (val: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}) {
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length }, (_, idx) => value[idx] ?? '');

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="text-xs font-medium text-foreground">{label}</div>
      <div role="group" aria-label={label} className="flex items-center gap-2">
        {chars.map((ch, idx) => (
          <input
            key={idx}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            aria-label={`${label} digit ${idx + 1}`}
            value={ch}
            onChange={(e) => {
              const digit = e.target.value.slice(-1);
              const nextChars = [...chars];
              nextChars[idx] = digit;
              onValueChange(nextChars.join(''));
              if (digit && idx < length - 1) refs.current[idx + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !ch && idx > 0) {
                refs.current[idx - 1]?.focus();
              }
            }}
            className="h-10 w-10 rounded-[var(--wdr-radius-md)] border border-input bg-surface text-center font-mono text-base font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        ))}
      </div>
    </div>
  );
}

export interface FormStep {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function FormStepper({
  steps,
  currentStep,
  onStepSelect,
}: {
  steps: FormStep[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border pb-3">
      {steps.map((s, idx) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onStepSelect?.(idx)}
          aria-current={idx === currentStep ? 'step' : undefined}
          className={cn(
            'rounded-[var(--wdr-radius-sm)] px-3 py-1 text-xs font-semibold',
            idx === currentStep
              ? 'bg-primary text-primary-foreground'
              : idx < currentStep
                ? 'bg-success-subtle text-success-subtle-foreground'
                : 'bg-muted text-muted-foreground'
          )}
        >
          {idx + 1}. {s.title}
        </button>
      ))}
    </div>
  );
}

export function MultiStepForm({
  steps,
  onSubmit,
  submitLabel = 'Submit',
  className,
}: {
  steps: FormStep[];
  onSubmit: () => void;
  submitLabel?: string;
  className?: string;
}) {
  const [step, setStep] = React.useState(0);
  const current = steps[step];

  return (
    <Card className={cn('p-5 space-y-5', className)}>
      <FormStepper steps={steps} currentStep={step} onStepSelect={setStep} />
      {current && <div className="space-y-4">{current.content}</div>}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button variant="outline" disabled={step <= 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button variant="primary" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" onClick={onSubmit}>
            {submitLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
