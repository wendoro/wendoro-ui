import * as React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Code2,
  Copy,
  FileText,
  Film,
  LayoutDashboard,
  Palette,
  Pin,
  Plus,
  Trash2,
  Volume2,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { sanitizeImageUrl } from '../../utils/url';
import { useClipboard } from '../../hooks/use-clipboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

/* -------------------------------------------------------------------------- */
/* Domain 07 / 08 / 23 — Optional Editors & Builders (@wendoro/ui/editors)    */
/* Pure React/SVG implementations with safe React node rendering only.       */
/* -------------------------------------------------------------------------- */

function renderMarkdownSafe(markdown: string): React.ReactNode[] {
  const lines = markdown.split('\n');
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('### ')) {
      nodes.push(<h3 key={i} className="text-sm font-bold text-foreground mt-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('## ')) {
      nodes.push(<h2 key={i} className="text-base font-bold text-foreground mt-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('# ')) {
      nodes.push(<h1 key={i} className="text-lg font-bold text-foreground mt-1">{line.slice(2)}</h1>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      nodes.push(
        <li key={i} className="ml-4 list-disc text-sm text-foreground">
          {line.slice(2)}
        </li>
      );
    } else if (line.startsWith('> ')) {
      nodes.push(
        <blockquote key={i} className="border-l-2 border-primary pl-3 text-sm italic text-muted-foreground">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(<p key={i} className="text-sm leading-relaxed text-foreground">{line}</p>);
    }
  }
  return nodes;
}

export function MarkdownEditor({
  value,
  onChange,
  label = 'Markdown document',
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}) {
  const [mode, setMode] = React.useState<'split' | 'write' | 'preview'>('split');

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <div className="inline-flex rounded-[var(--wdr-radius-sm)] border border-border bg-surface p-0.5 text-xs">
          {(['write', 'split', 'preview'] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                'rounded px-2 py-0.5 capitalize',
                mode === m ? 'bg-primary text-primary-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className={cn('grid grid-cols-1', mode === 'split' && 'md:grid-cols-2')}>
        {mode !== 'preview' && (
          <textarea
            aria-label={label}
            rows={8}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-y border-b border-border bg-background p-3 font-mono text-xs text-foreground focus-visible:outline-none md:border-b-0 md:border-r"
          />
        )}
        {mode !== 'write' && (
          <div className="min-h-[180px] space-y-1 bg-surface p-3" aria-label="Markdown preview">
            {renderMarkdownSafe(value)}
          </div>
        )}
      </div>
    </Card>
  );
}

export function CodeEditor({
  value,
  onChange,
  language = 'typescript',
  readOnly = false,
  title = 'Code editor',
  className,
}: {
  value: string;
  onChange?: (val: string) => void;
  language?: string;
  readOnly?: boolean;
  title?: string;
  className?: string;
}) {
  const { copied, copy } = useClipboard();
  const lines = value.split('\n');

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{title}</span>
          <Badge variant="outline" size="sm">{language}</Badge>
        </div>
        <Button size="sm" variant="ghost" onClick={() => void copy(value)}>
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="flex bg-background font-mono text-xs">
        <div aria-hidden="true" className="select-none border-r border-border bg-muted/30 px-2.5 py-2.5 text-right text-muted-foreground tabular-nums">
          {lines.map((_, i) => (
            <div key={i} className="leading-5">{i + 1}</div>
          ))}
        </div>
        <textarea
          aria-label={title}
          readOnly={readOnly}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={Math.max(5, Math.min(18, lines.length))}
          spellCheck={false}
          className="w-full resize-y bg-transparent px-3 py-2.5 leading-5 text-foreground focus-visible:outline-none"
        />
      </div>
    </Card>
  );
}

export function StructuredDataViewer({
  data,
  format = 'json',
  title,
  className,
}: {
  data: unknown;
  format?: 'json' | 'yaml' | 'xml';
  title?: string;
  className?: string;
}) {
  const serialized = React.useMemo(() => {
    if (typeof data === 'string') return data;
    if (format === 'json') return JSON.stringify(data, null, 2);
    if (format === 'yaml' && typeof data === 'object' && data !== null) {
      return Object.entries(data as Record<string, unknown>)
        .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
        .join('\n');
    }
    return String(data);
  }, [data, format]);

  return (
    <CodeEditor
      value={serialized}
      language={format}
      readOnly
      title={title ?? `${format.toUpperCase()} viewer`}
      className={className}
    />
  );
}

export function JsonViewer({ data, title = 'JSON viewer', className }: { data: unknown; title?: string; className?: string }) {
  return <StructuredDataViewer data={data} format="json" title={title} className={className} />;
}

export function YamlViewer({ data, title = 'YAML viewer', className }: { data: unknown; title?: string; className?: string }) {
  return <StructuredDataViewer data={data} format="yaml" title={title} className={className} />;
}

export function XmlViewer({ data, title = 'XML viewer', className }: { data: string; title?: string; className?: string }) {
  return <StructuredDataViewer data={data} format="xml" title={title} className={className} />;
}

export function DiffViewer({
  original,
  modified,
  title = 'Diff comparison',
  className,
}: {
  original: string;
  modified: string;
  title?: string;
  className?: string;
}) {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const max = Math.max(origLines.length, modLines.length);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground">
        {title}
      </div>
      <div className="max-h-72 overflow-auto font-mono text-xs">
        {Array.from({ length: max }).map((_, idx) => {
          const left = origLines[idx];
          const right = modLines[idx];
          if (left === right) {
            return (
              <div key={idx} className="flex gap-3 px-3 py-0.5 text-muted-foreground">
                <span className="w-5 shrink-0 select-none text-right tabular-nums">{idx + 1}</span>
                <span className="whitespace-pre-wrap">{left ?? ''}</span>
              </div>
            );
          }
          return (
            <React.Fragment key={idx}>
              {left !== undefined && (
                <div className="flex gap-3 bg-destructive-subtle/50 px-3 py-0.5 text-destructive-subtle-foreground">
                  <span className="w-5 shrink-0 select-none text-right font-bold">−</span>
                  <span className="whitespace-pre-wrap">{left}</span>
                </div>
              )}
              {right !== undefined && (
                <div className="flex gap-3 bg-success-subtle/50 px-3 py-0.5 text-success-subtle-foreground">
                  <span className="w-5 shrink-0 select-none text-right font-bold">+</span>
                  <span className="whitespace-pre-wrap">{right}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
}

const DEFAULT_SWATCHES = ['#FACC15', '#DC2626', '#111111', '#242424', '#737373', '#E5E5E5', '#FFFFFF'];

export function ColorPicker({
  value,
  onChange,
  swatches = DEFAULT_SWATCHES,
  label = 'Color picker',
  className,
}: {
  value: string;
  onChange: (hex: string) => void;
  swatches?: string[];
  label?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{label}</span>
        </span>
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {swatches.map((hex) => (
          <button
            key={hex}
            type="button"
            aria-label={`Select color ${hex}`}
            aria-pressed={value.toLowerCase() === hex.toLowerCase()}
            onClick={() => onChange(hex)}
            className={cn(
              'h-7 w-7 rounded-[var(--wdr-radius-sm)] border',
              value.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-ring border-foreground' : 'border-border'
            )}
            style={{ backgroundColor: hex }}
          />
        ))}
        <input
          type="color"
          aria-label="Custom color input"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#111111'}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-border bg-surface p-0.5"
        />
      </div>
    </Card>
  );
}

export function GradientEditor({
  startColor,
  endColor,
  angle,
  onChange,
  className,
}: {
  startColor: string;
  endColor: string;
  angle: number;
  onChange: (next: { startColor: string; endColor: string; angle: number }) => void;
  className?: string;
}) {
  const safeStart = /^#[0-9a-f]{3,8}$/i.test(startColor) ? startColor : '#FACC15';
  const safeEnd = /^#[0-9a-f]{3,8}$/i.test(endColor) ? endColor : '#111111';
  const gradientCss = `linear-gradient(${angle}deg, ${safeStart}, ${safeEnd})`;

  return (
    <Card className={cn('p-3.5 space-y-3', className)}>
      <div className="text-xs font-semibold text-foreground">Gradient editor</div>
      <div
        aria-label="Gradient preview"
        className="h-14 w-full rounded-[var(--wdr-radius-md)] border border-border"
        style={{ background: gradientCss }}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
        <label className="space-y-1">
          <span className="text-muted-foreground">Start</span>
          <input
            type="color"
            value={safeStart}
            onChange={(e) => onChange({ startColor: e.target.value, endColor: safeEnd, angle })}
            className="block h-8 w-full rounded border border-input bg-surface"
          />
        </label>
        <label className="space-y-1">
          <span className="text-muted-foreground">End</span>
          <input
            type="color"
            value={safeEnd}
            onChange={(e) => onChange({ startColor: safeStart, endColor: e.target.value, angle })}
            className="block h-8 w-full rounded border border-input bg-surface"
          />
        </label>
        <label className="space-y-1">
          <span className="text-muted-foreground">Angle ({angle}°)</span>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => onChange({ startColor: safeStart, endColor: safeEnd, angle: Number(e.target.value) })}
            className="block w-full"
          />
        </label>
      </div>
    </Card>
  );
}

export interface MediaAssetItem {
  id: string;
  title: string;
  src?: string;
  kind: 'image' | 'video' | 'audio' | 'document';
  meta?: string;
}

export function MediaGallery({
  items,
  selectedId,
  onSelect,
  className,
}: {
  items: MediaAssetItem[];
  selectedId?: string;
  onSelect?: (item: MediaAssetItem) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {items.map((item) => {
        const safeSrc = item.src ? sanitizeImageUrl(item.src) : undefined;
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect?.(item)}
            className={cn(
              'overflow-hidden rounded-[var(--wdr-radius-md)] border bg-surface text-left transition-colors',
              selected ? 'border-foreground ring-2 ring-ring' : 'border-border hover:border-foreground/40'
            )}
          >
            <div className="flex h-24 items-center justify-center bg-muted/50">
              {safeSrc && item.kind === 'image' ? (
                <img src={safeSrc} alt={item.title} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold uppercase text-muted-foreground">{item.kind}</span>
              )}
            </div>
            <div className="p-2">
              <div className="truncate text-xs font-semibold text-foreground">{item.title}</div>
              {item.meta && <div className="truncate text-[10px] text-muted-foreground">{item.meta}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export interface ImageAnnotationPin {
  id: string;
  xPercent: number;
  yPercent: number;
  note: string;
}

export function ImageAnnotationPanel({
  src,
  alt,
  annotations,
  onAddAnnotation,
  className,
}: {
  src: string;
  alt: string;
  annotations: ImageAnnotationPin[];
  onAddAnnotation?: (pin: ImageAnnotationPin) => void;
  className?: string;
}) {
  const safeSrc = sanitizeImageUrl(src);
  const [draftNote, setDraftNote] = React.useState('');

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">Image annotation</span>
        {onAddAnnotation && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Annotation label…"
              aria-label="New annotation label"
              className="h-8 rounded-[var(--wdr-radius-sm)] border border-input bg-background px-2 text-xs text-foreground"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={!draftNote.trim()}
              onClick={() => {
                onAddAnnotation({
                  id: `pin-${Date.now()}`,
                  xPercent: 50,
                  yPercent: 50,
                  note: draftNote.trim(),
                });
                setDraftNote('');
              }}
            >
              Add pin
            </Button>
          </div>
        )}
      </div>

      <div
        className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-[var(--wdr-radius-md)] border border-border bg-muted/40"
        onClick={(e) => {
          if (!onAddAnnotation || !draftNote.trim()) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const xPercent = Math.round(((e.clientX - rect.left) / Math.max(1, rect.width)) * 100);
          const yPercent = Math.round(((e.clientY - rect.top) / Math.max(1, rect.height)) * 100);
          onAddAnnotation({
            id: `pin-${Date.now()}`,
            xPercent,
            yPercent,
            note: draftNote.trim(),
          });
          setDraftNote('');
        }}
      >
        {safeSrc ? (
          <img src={safeSrc} alt={alt} className="max-h-64 w-full object-contain" />
        ) : (
          <span className="text-xs text-muted-foreground">Preview unavailable for unverified image URL</span>
        )}
        {annotations.map((pin, idx) => (
          <span
            key={pin.id}
            title={pin.note}
            className="absolute inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground shadow"
            style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
          >
            {idx + 1}
          </span>
        ))}
      </div>

      {annotations.length > 0 && (
        <ul className="space-y-1 text-xs">
          {annotations.map((pin, idx) => (
            <li key={pin.id} className="flex items-center gap-2 text-foreground">
              <Pin className="h-3 w-3 text-primary-active" aria-hidden="true" />
              <span className="font-semibold">#{idx + 1}</span>
              <span>{pin.note}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function AudioWaveformPreview({
  title,
  peaks,
  progressRatio = 0.35,
  durationLabel = '02:14',
  className,
}: {
  title: string;
  peaks: number[];
  progressRatio?: number;
  durationLabel?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{title}</span>
        </span>
        <span className="tabular-nums text-muted-foreground">{durationLabel}</span>
      </div>
      <div className="flex h-12 items-end gap-1" role="img" aria-label={`Audio waveform for ${title}`}>
        {peaks.map((amp, i) => {
          const played = i / Math.max(1, peaks.length) <= progressRatio;
          return (
            <span
              key={i}
              className={cn('flex-1 rounded-sm', played ? 'bg-primary' : 'bg-muted-foreground/30')}
              style={{ height: `${Math.max(15, Math.min(100, amp))}%` }}
            />
          );
        })}
      </div>
    </Card>
  );
}

export function VideoTimelineScrubber({
  title,
  durationSeconds,
  currentSeconds,
  onSeek,
  markers = [],
  className,
}: {
  title: string;
  durationSeconds: number;
  currentSeconds: number;
  onSeek: (sec: number) => void;
  markers?: Array<{ id: string; label: string; second: number }>;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2.5', className)}>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 font-semibold text-foreground">
          <Film className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{title}</span>
        </span>
        <span className="tabular-nums text-muted-foreground">
          {currentSeconds}s / {durationSeconds}s
        </span>
      </div>
      <input
        type="range"
        aria-label={`Timeline position for ${title}`}
        min={0}
        max={durationSeconds}
        value={currentSeconds}
        onChange={(e) => onSeek(Number(e.target.value))}
        className="w-full accent-primary"
      />
      {markers.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {markers.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSeek(m.second)}
              className="rounded border border-border bg-surface px-2 py-0.5 text-[11px] text-foreground hover:bg-muted"
            >
              {m.label} ({m.second}s)
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

export function DocumentPreviewCard({
  fileName,
  pageCount,
  currentPage = 1,
  onPageChange,
  excerpt,
  className,
}: {
  fileName: string;
  pageCount: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  excerpt?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span>{fileName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            Prev
          </Button>
          <span className="tabular-nums text-muted-foreground">
            Page {currentPage} of {pageCount}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={currentPage >= pageCount}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="min-h-[120px] rounded-[var(--wdr-radius-md)] border border-border bg-muted/20 p-3 text-xs leading-relaxed text-foreground">
        {excerpt ?? `Document page ${currentPage} preview frame ready for external PDF renderer adapter.`}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Visual Form Builder, Dashboard Builder & Report Builder                    */
/* -------------------------------------------------------------------------- */

export interface BuilderFormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  conditionalRule?: string;
}

export function VisualFormBuilder({
  initialFields,
  onChange,
  className,
}: {
  initialFields: BuilderFormField[];
  onChange?: (fields: BuilderFormField[]) => void;
  className?: string;
}) {
  const [fields, setFields] = React.useState<BuilderFormField[]>(initialFields);
  const [preview, setPreview] = React.useState(false);

  const commit = (next: BuilderFormField[]) => {
    setFields(next);
    onChange?.(next);
  };

  const addField = () => {
    const id = `field-${fields.length + 1}`;
    commit([...fields, { id, label: `Custom Field ${fields.length + 1}`, type: 'text', required: false }]);
  };

  const moveField = (idx: number, delta: number) => {
    const target = idx + delta;
    if (target < 0 || target >= fields.length) return;
    const copy = [...fields];
    const [removed] = copy.splice(idx, 1);
    copy.splice(target, 0, removed);
    commit(copy);
  };

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <div className="text-sm font-semibold text-foreground">Visual form builder</div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPreview((p) => !p)}>
            {preview ? 'Edit fields' : 'Preview form'}
          </Button>
          {!preview && (
            <Button size="sm" variant="primary" onClick={addField} leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Add field
            </Button>
          )}
        </div>
      </div>

      {preview ? (
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {fields.map((f) => (
            <div key={f.id} className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                {f.label} {f.required && <span className="text-destructive">*</span>}
              </label>
              {f.type === 'checkbox' ? (
                <input type="checkbox" aria-label={f.label} className="h-4 w-4" />
              ) : (
                <input
                  type={f.type === 'select' ? 'text' : f.type}
                  placeholder={`Enter ${f.label.toLowerCase()}…`}
                  className="h-9 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-xs text-foreground"
                />
              )}
            </div>
          ))}
        </form>
      ) : (
        <div className="space-y-2">
          {fields.map((f, idx) => (
            <div key={f.id} className="flex flex-wrap items-center gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-2.5 text-xs">
              <input
                type="text"
                aria-label={`Label for ${f.id}`}
                value={f.label}
                onChange={(e) => commit(fields.map((item) => (item.id === f.id ? { ...item, label: e.target.value } : item)))}
                className="h-8 flex-1 min-w-[140px] rounded border border-input bg-background px-2 text-xs text-foreground"
              />
              <select
                aria-label={`Type for ${f.label}`}
                value={f.type}
                onChange={(e) =>
                  commit(fields.map((item) => (item.id === f.id ? { ...item, type: e.target.value as BuilderFormField['type'] } : item)))
                }
                className="h-8 rounded border border-input bg-background px-2 text-xs text-foreground"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="select">Select</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date</option>
              </select>
              <label className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(f.required)}
                  onChange={(e) =>
                    commit(fields.map((item) => (item.id === f.id ? { ...item, required: e.target.checked } : item)))
                  }
                />
                Required
              </label>
              <div className="flex items-center gap-1">
                <button type="button" aria-label="Move field up" onClick={() => moveField(idx, -1)} className="rounded p-1 hover:bg-muted">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" aria-label="Move field down" onClick={() => moveField(idx, 1)} className="rounded p-1 hover:bg-muted">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${f.label}`}
                  onClick={() => commit(fields.filter((item) => item.id !== f.id))}
                  className="rounded p-1 text-destructive hover:bg-destructive-subtle"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export interface DashboardWidgetConfig {
  id: string;
  title: string;
  kind: 'kpi' | 'chart' | 'table' | 'activity';
  span: 1 | 2 | 3;
}

export function DashboardBuilder({
  initialWidgets,
  onChange,
  className,
}: {
  initialWidgets: DashboardWidgetConfig[];
  onChange?: (widgets: DashboardWidgetConfig[]) => void;
  className?: string;
}) {
  const [widgets, setWidgets] = React.useState(initialWidgets);

  const commit = (next: DashboardWidgetConfig[]) => {
    setWidgets(next);
    onChange?.(next);
  };

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <LayoutDashboard className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <span>Dashboard builder</span>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={() =>
            commit([
              ...widgets,
              { id: `w-${widgets.length + 1}`, title: `Widget ${widgets.length + 1}`, kind: 'kpi', span: 1 },
            ])
          }
          leftIcon={<Plus className="h-3.5 w-3.5" />}
        >
          Add widget
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {widgets.map((w) => (
          <div
            key={w.id}
            className={cn(
              'rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 space-y-2',
              w.span === 2 && 'md:col-span-2',
              w.span === 3 && 'md:col-span-3'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">{w.title}</span>
              <Badge variant="secondary" size="sm">{w.kind}</Badge>
            </div>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <button
                type="button"
                onClick={() =>
                  commit(
                    widgets.map((item) =>
                      item.id === w.id ? { ...item, span: ((item.span % 3) + 1) as 1 | 2 | 3 } : item
                    )
                  )
                }
                className="rounded border border-border px-2 py-0.5 text-foreground hover:bg-muted"
              >
                Span: {w.span} col
              </button>
              <button
                type="button"
                aria-label={`Remove ${w.title}`}
                onClick={() => commit(widgets.filter((item) => item.id !== w.id))}
                className="text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export interface ReportSectionBlock {
  id: string;
  heading: string;
  summary: string;
}

export function ReportBuilder({
  title = 'Quarterly Executive Report',
  sections,
  onAddSection,
  onExport,
  className,
}: {
  title?: string;
  sections: ReportSectionBlock[];
  onAddSection?: (block: ReportSectionBlock) => void;
  onExport?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <div className="flex items-center gap-2">
          {onAddSection && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                onAddSection({
                  id: `sec-${sections.length + 1}`,
                  heading: `Section ${sections.length + 1}`,
                  summary: 'Key metric and narrative summary block.',
                })
              }
            >
              Add section
            </Button>
          )}
          {onExport && (
            <Button size="sm" variant="primary" onClick={onExport}>
              Export summary
            </Button>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {sections.map((sec, i) => (
          <div key={sec.id} className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3">
            <div className="text-xs font-semibold text-foreground">
              {i + 1}. {sec.heading}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{sec.summary}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
