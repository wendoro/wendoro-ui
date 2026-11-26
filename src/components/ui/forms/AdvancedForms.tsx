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
  const [activeIndex, setActiveIndex] = React.useState(0);
  const selected = controlled ?? internal;
  const listboxId = useStableId(undefined, 'wdr-ms');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const toggleOption = (val: string) => {
    const next = selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val];
    if (controlled === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const moveFocus = (nextIdx: number) => {
    if (options.length === 0) return;
    const bounded = (nextIdx + options.length) % options.length;
    setActiveIndex(bounded);
    optionRefs.current[bounded]?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative space-y-1.5', className)}>
      {label && <div className="text-xs font-medium text-foreground">{label}</div>}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={label ?? placeholder}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
            setActiveIndex(e.key === 'ArrowUp' ? Math.max(0, options.length - 1) : 0);
          }
        }}
        className={cn(
          'flex min-h-10 w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border bg-surface px-3 py-1.5 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 top-full z-40 mt-1 max-h-56 w-full overflow-auto rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-md)]"
        >
          {options.map((opt, idx) => {
            const checked = selected.includes(opt.value);
            return (
              <li key={opt.value}>
                <button
                  ref={(el) => {
                    optionRefs.current[idx] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={checked}
                  disabled={opt.disabled}
                  onClick={() => toggleOption(opt.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      moveFocus(idx + 1);
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      moveFocus(idx - 1);
                    } else if (e.key === 'Home') {
                      e.preventDefault();
                      moveFocus(0);
                    } else if (e.key === 'End') {
                      e.preventDefault();
                      moveFocus(options.length - 1);
                    }
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    checked && 'bg-primary-subtle font-medium text-primary-subtle-foreground',
                    activeIndex === idx && 'ring-1 ring-border'
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
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const selected = controlled ?? internal;
  const listboxId = useStableId(undefined, 'wdr-cb');
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [query, open]);

  const commit = (val: string) => {
    if (controlled === undefined) setInternal(val);
    onValueChange?.(val);
    setQuery('');
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative space-y-1.5', className)}>
      {label && <label className="block text-xs font-medium text-foreground">{label}</label>}
      <div className="relative">
        <input
          type="text"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && filtered[highlightedIndex] ? `${listboxId}-opt-${highlightedIndex}` : undefined
          }
          aria-label={label ?? placeholder}
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              setOpen(false);
              setQuery('');
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!open) setOpen(true);
              else if (filtered.length > 0) setHighlightedIndex((i) => (i + 1) % filtered.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (!open) setOpen(true);
              else if (filtered.length > 0) setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
            } else if (e.key === 'Enter' && open && filtered[highlightedIndex] && !filtered[highlightedIndex].disabled) {
              e.preventDefault();
              commit(filtered[highlightedIndex].value);
            }
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
            filtered.map((opt, idx) => (
              <li key={opt.value}>
                <button
                  id={`${listboxId}-opt-${idx}`}
                  type="button"
                  role="option"
                  disabled={opt.disabled}
                  aria-selected={selected === opt.value}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => commit(opt.value)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-sm hover:bg-muted',
                    selected === opt.value && 'bg-primary text-primary-foreground',
                    selected !== opt.value && highlightedIndex === idx && 'bg-muted'
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

/* -------------------------------------------------------------------------- */
/* ColorInput & MaskedInput (Domain 02 Inputs)                                */
/* -------------------------------------------------------------------------- */

export interface ColorInputProps {
  value: string;
  onValueChange: (hex: string) => void;
  label?: string;
  presets?: string[];
  disabled?: boolean;
  className?: string;
}

export function ColorInput({
  value,
  onValueChange,
  label = 'Color',
  presets = ['#FACC15', '#DC2626', '#111111', '#FFFFFF', '#242424', '#737373'],
  disabled = false,
  className,
}: ColorInputProps) {
  const id = useStableId(undefined, 'wdr-color');
  const safeHex = /^#[0-9A-Fa-f]{6}$/.test(value) ? value : '#111111';

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} swatch`}
          disabled={disabled}
          value={safeHex}
          onChange={(e) => onValueChange(e.target.value.toUpperCase())}
          className="h-10 w-10 shrink-0 cursor-pointer rounded-[var(--wdr-radius-md)] border border-input bg-surface p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <input
          id={id}
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="#FACC15"
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        />
      </div>
      {presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {presets.map((hex) => (
            <button
              key={hex}
              type="button"
              disabled={disabled}
              aria-label={`Select color ${hex}`}
              onClick={() => onValueChange(hex)}
              style={{ backgroundColor: hex }}
              className={cn(
                'h-5 w-5 rounded-[var(--wdr-radius-sm)] border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                value.toUpperCase() === hex.toUpperCase() && 'ring-2 ring-foreground ring-offset-1'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface MaskedInputProps {
  value: string;
  onValueChange: (formatted: string, rawDigits: string) => void;
  /** Mask template using '#' for digits and 'A' for alphanumeric characters, e.g. "(###) ###-####" or "####-####-####" */
  mask: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

function applyInputMask(raw: string, mask: string): { formatted: string; unmasked: string } {
  const cleanChars = raw.replace(/[^a-zA-Z0-9]/g, '');
  let charIdx = 0;
  let formatted = '';
  let unmasked = '';

  for (let i = 0; i < mask.length && charIdx < cleanChars.length; i += 1) {
    const token = mask[i];
    if (token === '#') {
      while (charIdx < cleanChars.length && !/\d/.test(cleanChars[charIdx])) {
        charIdx += 1;
      }
      if (charIdx < cleanChars.length) {
        formatted += cleanChars[charIdx];
        unmasked += cleanChars[charIdx];
        charIdx += 1;
      }
    } else if (token === 'A') {
      formatted += cleanChars[charIdx];
      unmasked += cleanChars[charIdx];
      charIdx += 1;
    } else {
      formatted += token;
    }
  }
  return { formatted, unmasked };
}

export function MaskedInput({
  value,
  onValueChange,
  mask,
  label,
  placeholder,
  disabled = false,
  error,
  className,
}: MaskedInputProps) {
  const id = useStableId(undefined, 'wdr-masked');

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        type="text"
        disabled={disabled}
        value={value}
        placeholder={placeholder ?? mask.replace(/[#A]/g, '_')}
        onChange={(e) => {
          const { formatted, unmasked } = applyInputMask(e.target.value, mask);
          onValueChange(formatted, unmasked);
        }}
        className={cn(
          'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface px-3 font-mono text-sm tabular-nums text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          error ? 'border-destructive' : 'border-input'
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

