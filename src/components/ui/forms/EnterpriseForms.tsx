import * as React from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bold,
  Code,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { useStableId } from '../../../hooks/use-id';
import { Button } from '../button';
import { Card } from '../card';

/* -------------------------------------------------------------------------- */
/* RichTextEditor (XSS-safe markdown/structured editor with toolbar)          */
/* -------------------------------------------------------------------------- */

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  error?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Write structured notes, updates, or specifications…',
  rows = 5,
  error,
  className,
}: RichTextEditorProps) {
  const [mode, setMode] = React.useState<'write' | 'preview'>('write');
  const [linkDraftOpen, setLinkDraftOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState('');
  const [linkText, setLinkText] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const id = useStableId(undefined, 'wdr-rte');
  const errorId = `${id}-error`;

  const wrapSelection = (prefix: string, suffix = prefix, fallbackText = 'text') => {
    const el = textareaRef.current;
    if (!el) {
      onChange(`${value}${prefix}${fallbackText}${suffix}`);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || fallbackText;
    const next = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
    onChange(next);
  };

  const renderInlineContent = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let partKey = 0;

    while ((match = linkPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      const labelText = match[1];
      const safeHref = sanitizeUrl(match[2]);
      if (safeHref) {
        parts.push(
          <a
            key={`lnk-${partKey++}`}
            href={safeHref}
            rel="noopener noreferrer"
            className="font-medium underline text-foreground hover:opacity-80"
          >
            {labelText}
          </a>
        );
      } else {
        parts.push(`${labelText}`);
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts;
  };

  const renderPreviewLines = (src: string) => {
    const lines = src.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('## ')) {
        return (
          <h4 key={idx} className="text-sm font-bold text-foreground mt-2 first:mt-0">
            {renderInlineContent(line.slice(3))}
          </h4>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-foreground">
            {renderInlineContent(line.slice(2))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm text-foreground leading-relaxed">
          {renderInlineContent(line)}
        </p>
      );
    });
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-foreground">
          {label}
        </label>
      )}
      <div
        className={cn(
          'overflow-hidden rounded-[var(--wdr-radius-md)] border bg-surface',
          error ? 'border-destructive' : 'border-input'
        )}
      >
        <div
          role="toolbar"
          aria-label="Formatting options"
          className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-2.5 py-1.5"
        >
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              aria-label="Bold"
              onClick={() => wrapSelection('**', '**', 'bold text')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Bold className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Italic"
              onClick={() => wrapSelection('_', '_', 'italic text')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Italic className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Heading"
              onClick={() => wrapSelection('\n## ', '', 'Section heading')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Heading2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Bullet list"
              onClick={() => wrapSelection('\n- ', '', 'List item')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Code"
              onClick={() => wrapSelection('`', '`', 'code')}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Code className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Insert safe link"
              aria-expanded={linkDraftOpen}
              onClick={() => setLinkDraftOpen((o) => !o)}
              className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-muted text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LinkIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="inline-flex rounded-[var(--wdr-radius-sm)] border border-border bg-surface p-0.5 text-xs">
            <button
              type="button"
              aria-pressed={mode === 'write'}
              onClick={() => setMode('write')}
              className={cn(
                'rounded px-2 py-0.5 font-medium',
                mode === 'write' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              Write
            </button>
            <button
              type="button"
              aria-pressed={mode === 'preview'}
              onClick={() => setMode('preview')}
              className={cn(
                'rounded px-2 py-0.5 font-medium',
                mode === 'preview' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              Preview
            </button>
          </div>
        </div>

        {linkDraftOpen && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
            <input
              type="text"
              aria-label="Link label"
              placeholder="Label"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              className="h-8 rounded border border-input bg-surface px-2 text-xs text-foreground"
            />
            <input
              type="url"
              aria-label="Link URL"
              placeholder="https://example.invalid"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="h-8 flex-1 min-w-[160px] rounded border border-input bg-surface px-2 text-xs text-foreground"
            />
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => {
                const safe = sanitizeUrl(linkUrl);
                if (safe) {
                  wrapSelection(`[${linkText || safe}](`, ')', safe);
                  setLinkText('');
                  setLinkUrl('');
                  setLinkDraftOpen(false);
                }
              }}
            >
              Insert
            </Button>
          </div>
        )}

        {mode === 'write' ? (
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            value={value}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-y bg-surface p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        ) : (
          <div className="min-h-[120px] space-y-1 p-3" aria-label="Formatted preview">
            {value.trim() ? (
              renderPreviewLines(value)
            ) : (
              <p className="text-xs text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ValidationSummary                                                          */
/* -------------------------------------------------------------------------- */

export interface ValidationErrorEntry {
  field: string;
  label: string;
  message: string;
}

export function ValidationSummary({
  errors,
  title = 'Please review the highlighted fields',
  onFocusField,
  className,
}: {
  errors: ValidationErrorEntry[];
  title?: string;
  onFocusField?: (field: string) => void;
  className?: string;
}) {
  if (errors.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'rounded-[var(--wdr-radius-md)] border border-destructive/40 bg-destructive-subtle p-4 text-destructive-subtle-foreground',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {title} ({errors.length})
        </span>
      </div>
      <ul className="mt-2 space-y-1 text-xs">
        {errors.map((err) => (
          <li key={err.field}>
            {onFocusField ? (
              <button
                type="button"
                onClick={() => onFocusField(err.field)}
                className="underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {err.label}: {err.message}
              </button>
            ) : (
              <span>
                <strong>{err.label}:</strong> {err.message}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* RepeatableFieldSection                                                     */
/* -------------------------------------------------------------------------- */

export function RepeatableFieldSection<T>({
  title,
  description,
  items,
  onAdd,
  onRemove,
  onMove,
  addLabel = 'Add item',
  renderItem,
  minItems = 0,
  className,
}: {
  title: string;
  description?: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMove?: (fromIndex: number, toIndex: number) => void;
  addLabel?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  minItems?: number;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          leftIcon={<Plus className="h-3.5 w-3.5" />}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No items added yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[var(--wdr-radius-md)] border border-border bg-muted/25 p-3.5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                  Item #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  {onMove && (
                    <>
                      <button
                        type="button"
                        disabled={idx === 0}
                        aria-label={`Move item ${idx + 1} up`}
                        onClick={() => onMove(idx, idx - 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        aria-label={`Move item ${idx + 1} down`}
                        onClick={() => onMove(idx, idx + 1)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={items.length <= minItems}
                    aria-label={`Remove item ${idx + 1}`}
                    onClick={() => onRemove(idx)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-border bg-surface text-muted-foreground hover:text-destructive disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* DynamicFormBuilder & FormReviewScreen                                      */
/* -------------------------------------------------------------------------- */

export type DynamicFieldType = 'text' | 'email' | 'number' | 'select' | 'checkbox' | 'textarea';

export interface DynamicFormFieldSchema {
  name: string;
  label: string;
  type: DynamicFieldType;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  columns?: 1 | 2;
  /** Conditional visibility predicate evaluated against current form values */
  when?: (values: Record<string, unknown>) => boolean;
  validate?: (value: unknown, values: Record<string, unknown>) => string | undefined;
}

export interface DynamicFormBuilderProps {
  fields: DynamicFormFieldSchema[];
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  submitLabel?: string;
  showReviewStep?: boolean;
  className?: string;
}

export function FormReviewScreen({
  title = 'Review & confirm submission',
  entries,
  onEdit,
  onConfirm,
  confirmLabel = 'Confirm & submit',
  className,
}: {
  title?: string;
  entries: Array<{ label: string; value: string }>;
  onEdit: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <dl className="divide-y divide-border rounded-[var(--wdr-radius-md)] border border-border">
        {entries.map((entry) => (
          <div key={entry.label} className="grid grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-3">
            <dt className="text-xs font-medium text-muted-foreground">{entry.label}</dt>
            <dd className="text-sm font-medium text-foreground sm:col-span-2">{entry.value || '—'}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onEdit}>
          Back to edit
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Card>
  );
}

export function DynamicFormBuilder({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  showReviewStep = true,
  className,
}: DynamicFormBuilderProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = React.useState<ValidationErrorEntry[]>([]);
  const [reviewing, setReviewing] = React.useState(false);

  const visibleFields = fields.filter((f) => (f.when ? f.when(values) : true));

  const validateAll = (): ValidationErrorEntry[] => {
    const nextErrors: ValidationErrorEntry[] = [];
    for (const f of visibleFields) {
      const val = values[f.name];
      if (f.required) {
        const empty =
          val === undefined || val === null || val === '' || (f.type === 'checkbox' && val !== true);
        if (empty) {
          nextErrors.push({ field: f.name, label: f.label, message: 'This field is required.' });
          continue;
        }
      }
      if (f.validate) {
        const customMsg = f.validate(val, values);
        if (customMsg) {
          nextErrors.push({ field: f.name, label: f.label, message: customMsg });
        }
      }
    }
    return nextErrors;
  };

  if (reviewing) {
    return (
      <FormReviewScreen
        entries={visibleFields.map((f) => ({
          label: f.label,
          value:
            typeof values[f.name] === 'boolean'
              ? values[f.name]
                ? 'Yes'
                : 'No'
              : String(values[f.name] ?? ''),
        }))}
        onEdit={() => setReviewing(false)}
        onConfirm={() => onSubmit(values)}
        confirmLabel={submitLabel}
        className={className}
      />
    );
  }

  const errorMap = new Map(errors.map((e) => [e.field, e.message]));

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const found = validateAll();
        setErrors(found);
        if (found.length === 0) {
          if (showReviewStep) setReviewing(true);
          else onSubmit(values);
        }
      }}
      className={cn('space-y-4', className)}
    >
      <ValidationSummary
        errors={errors}
        onFocusField={(field) => {
          const el = document.getElementById(`wdr-dyn-${field}`);
          el?.focus();
        }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {visibleFields.map((field) => {
          const fieldId = `wdr-dyn-${field.name}`;
          const errMsg = errorMap.get(field.name);
          const errId = `${fieldId}-error`;
          const spanClass = field.columns === 2 ? 'md:col-span-2' : '';

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={cn('space-y-1', spanClass)}>
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input
                    id={fieldId}
                    type="checkbox"
                    checked={Boolean(values[field.name])}
                    aria-invalid={Boolean(errMsg)}
                    aria-describedby={errMsg ? errId : undefined}
                    onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.checked }))}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span>{field.label}</span>
                </label>
                {errMsg && <p id={errId} className="text-xs text-destructive">{errMsg}</p>}
              </div>
            );
          }

          return (
            <div key={field.name} className={cn('space-y-1.5', spanClass)}>
              <label htmlFor={fieldId} className="block text-xs font-medium text-foreground">
                {field.label}
                {field.required && <span className="ml-0.5 text-destructive">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  id={fieldId}
                  value={String(values[field.name] ?? '')}
                  aria-invalid={Boolean(errMsg)}
                  aria-describedby={errMsg ? errId : undefined}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  className={cn(
                    'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    errMsg ? 'border-destructive' : 'border-input'
                  )}
                >
                  <option value="">{field.placeholder ?? 'Select…'}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={fieldId}
                  rows={3}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? '')}
                  aria-invalid={Boolean(errMsg)}
                  aria-describedby={errMsg ? errId : undefined}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  className={cn(
                    'w-full rounded-[var(--wdr-radius-md)] border bg-surface p-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    errMsg ? 'border-destructive' : 'border-input'
                  )}
                />
              ) : (
                <input
                  id={fieldId}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={String(values[field.name] ?? '')}
                  aria-invalid={Boolean(errMsg)}
                  aria-describedby={errMsg ? errId : undefined}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  className={cn(
                    'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    errMsg ? 'border-destructive' : 'border-input'
                  )}
                />
              )}

              {errMsg && <p id={errId} className="text-xs text-destructive">{errMsg}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          {showReviewStep ? 'Review submission' : submitLabel}
        </Button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* AddressContactFields                                                       */
/* -------------------------------------------------------------------------- */

export interface AddressContactValue {
  contactName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export function AddressContactFields({
  value,
  onChange,
  errors = {},
  className,
}: {
  value: AddressContactValue;
  onChange: (next: AddressContactValue) => void;
  errors?: Partial<Record<keyof AddressContactValue, string>>;
  className?: string;
}) {
  const update = (key: keyof AddressContactValue, v: string) =>
    onChange({ ...value, [key]: v });

  return (
    <fieldset className={cn('grid grid-cols-1 gap-4 border-0 p-0 m-0 sm:grid-cols-2', className)}>
      <legend className="mb-2 text-sm font-semibold text-foreground">Contact & Address</legend>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-name" className="block text-xs font-medium text-foreground">
          Contact name
        </label>
        <input
          id="wdr-addr-name"
          type="text"
          value={value.contactName}
          aria-invalid={Boolean(errors.contactName)}
          aria-describedby={errors.contactName ? 'wdr-addr-name-error' : undefined}
          onChange={(e) => update('contactName', e.target.value)}
          className={cn(
            'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface px-3 text-sm text-foreground',
            errors.contactName ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.contactName && <p id="wdr-addr-name-error" className="text-xs text-destructive">{errors.contactName}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-email" className="block text-xs font-medium text-foreground">
          Email address
        </label>
        <input
          id="wdr-addr-email"
          type="email"
          value={value.email}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'wdr-addr-email-error' : undefined}
          onChange={(e) => update('email', e.target.value)}
          className={cn(
            'h-10 w-full rounded-[var(--wdr-radius-md)] border bg-surface px-3 text-sm text-foreground',
            errors.email ? 'border-destructive' : 'border-input'
          )}
        />
        {errors.email && <p id="wdr-addr-email-error" className="text-xs text-destructive">{errors.email}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-phone" className="block text-xs font-medium text-foreground">
          Phone number
        </label>
        <input
          id="wdr-addr-phone"
          type="tel"
          value={value.phone}
          onChange={(e) => update('phone', e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-country" className="block text-xs font-medium text-foreground">
          Country / Region
        </label>
        <input
          id="wdr-addr-country"
          type="text"
          value={value.country}
          onChange={(e) => update('country', e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <label htmlFor="wdr-addr-street" className="block text-xs font-medium text-foreground">
          Street address
        </label>
        <input
          id="wdr-addr-street"
          type="text"
          value={value.street}
          onChange={(e) => update('street', e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-city" className="block text-xs font-medium text-foreground">
          City
        </label>
        <input
          id="wdr-addr-city"
          type="text"
          value={value.city}
          onChange={(e) => update('city', e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="wdr-addr-postal" className="block text-xs font-medium text-foreground">
          Postal code
        </label>
        <input
          id="wdr-addr-postal"
          type="text"
          value={value.postalCode}
          onChange={(e) => update('postalCode', e.target.value)}
          className="h-10 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground"
        />
      </div>
    </fieldset>
  );
}
