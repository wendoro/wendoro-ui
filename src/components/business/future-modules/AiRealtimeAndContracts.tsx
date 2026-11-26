import * as React from 'react';
import { Check, Copy, Paperclip, Send, Sparkles, Square, ThumbsDown, ThumbsUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';

/* -------------------------------------------------------------------------- */
/* AI-Native Presentation Interfaces (Zero Embedded LLM / API Calls)          */
/* -------------------------------------------------------------------------- */

export interface PromptAttachment {
  id: string;
  label: string;
}

export interface PromptComposerBarProps {
  value: string;
  onValueChange: (val: string) => void;
  onSubmit: (prompt: string) => void;
  generating?: boolean;
  onStop?: () => void;
  attachments?: PromptAttachment[];
  onRemoveAttachment?: (id: string) => void;
  modeSelector?: React.ReactNode;
  placeholder?: string;
  className?: string;
}

export function PromptComposerBar({
  value,
  onValueChange,
  onSubmit,
  generating = false,
  onStop,
  attachments,
  onRemoveAttachment,
  modeSelector,
  placeholder = 'Describe an action, query, or draft…',
  className,
}: PromptComposerBarProps) {
  return (
    <Card className={cn('p-3 space-y-2.5', className)}>
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {attachments.map((att) => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-sm)] border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <span>{att.label}</span>
              {onRemoveAttachment && (
                <button
                  type="button"
                  aria-label={`Remove ${att.label}`}
                  onClick={() => onRemoveAttachment(att.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && value.trim() && !generating) {
              e.preventDefault();
              onSubmit(value.trim());
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full resize-y rounded-[var(--wdr-radius-md)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <div className="flex items-center justify-between gap-2 shrink-0">
          {modeSelector}
          {generating && onStop ? (
            <Button size="sm" variant="destructive" onClick={onStop} leftIcon={<Square className="h-3.5 w-3.5" />}>
              Stop
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              disabled={!value.trim()}
              onClick={() => onSubmit(value.trim())}
              leftIcon={<Send className="h-3.5 w-3.5" />}
            >
              Send
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export interface AssistantCitation {
  id: string;
  label: string;
  href?: string;
}

export function AssistantResponseCard({
  title = 'Structured summary',
  body,
  confidenceLabel,
  citations,
  onFeedback,
  className,
}: {
  title?: string;
  body: string;
  confidenceLabel?: string;
  citations?: AssistantCitation[];
  onFeedback?: (helpful: boolean) => void;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(body).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">{title}</span>
          {confidenceLabel && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {confidenceLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Copy response text"
            onClick={handleCopy}
            className="inline-flex h-7 items-center gap-1 rounded px-2 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-success" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {onFeedback && (
            <>
              <button
                type="button"
                aria-label="Mark helpful"
                onClick={() => onFeedback(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ThumbsUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Mark unhelpful"
                onClick={() => onFeedback(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ThumbsDown className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{body}</p>

      {citations && citations.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-medium text-muted-foreground">Sources:</span>
          {citations.map((cit) => {
            const safe = cit.href ? sanitizeUrl(cit.href) : undefined;
            if (safe) {
              return (
                <a
                  key={cit.id}
                  href={safe}
                  className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground underline underline-offset-2 hover:bg-muted"
                >
                  {cit.label}
                </a>
              );
            }
            return (
              <span key={cit.id} className="rounded border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-foreground">
                {cit.label}
              </span>
            );
          })}
        </div>
      )}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Real-Time Presence & Collaboration Indicators                              */
/* -------------------------------------------------------------------------- */

export interface PresenceAvatarMember {
  id: string;
  name: string;
  role?: string;
  state: 'viewing' | 'editing' | 'idle';
}

export function PresenceAvatarStack({
  collaborators,
  maxVisible = 4,
  className,
}: {
  collaborators: PresenceAvatarMember[];
  maxVisible?: number;
  className?: string;
}) {
  const shown = collaborators.slice(0, maxVisible);
  const overflow = Math.max(0, collaborators.length - shown.length);

  return (
    <div className={cn('inline-flex items-center gap-2', className)} aria-label="Active collaborators">
      <div className="flex -space-x-2">
        {shown.map((col) => (
          <span
            key={col.id}
            title={`${col.name}${col.role ? ` (${col.role})` : ''} — ${col.state}`}
            className={cn(
              'relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-xs font-bold',
              col.state === 'editing'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            )}
          >
            {col.name.slice(0, 2).toUpperCase()}
            <span
              aria-hidden="true"
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background',
                col.state === 'editing'
                  ? 'bg-success'
                  : col.state === 'viewing'
                    ? 'bg-primary'
                    : 'bg-muted-foreground'
              )}
            />
          </span>
        ))}
        {overflow > 0 && (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-foreground tabular-nums">
            +{overflow}
          </span>
        )}
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {collaborators.length} active
      </span>
    </div>
  );
}

export function LiveActivityPulse({
  label = 'Live updates active',
  active = true,
  className,
}: {
  label?: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--wdr-radius-sm)] border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'h-2 w-2 rounded-full',
          active ? 'bg-success animate-pulse' : 'bg-muted-foreground'
        )}
      />
      <span>{label}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Documented Future Module Extension Contracts (Architecture Only)           */
/* -------------------------------------------------------------------------- */

export const WENDORO_MODULE_CONTRACT_VERSION = '2.0.0';

export interface WendoroModuleManifest {
  id: string;
  name: string;
  version: string;
  contractVersion: typeof WENDORO_MODULE_CONTRACT_VERSION;
  category: 'studio' | 'healthcare' | 'commerce' | 'automation' | 'analytics' | 'custom';
  supportsDarkAndHighContrast: boolean;
  supportsMobileTabletDesktop: boolean;
  requiredSubpaths: Array<'@wendoro/ui' | '@wendoro/ui/tokens' | '@wendoro/ui/business' | '@wendoro/ui/charts'>;
}

export interface VisualStudioExtensionContract {
  manifest: WendoroModuleManifest;
  renderToolbar?: () => React.ReactNode;
  renderLayersPanel?: () => React.ReactNode;
  renderCanvasStage: (ctx: { zoom: number; gridVisible: boolean }) => React.ReactNode;
  renderInspectorPanel?: () => React.ReactNode;
}

export interface HealthcareClinicalExtensionContract {
  manifest: WendoroModuleManifest;
  patientBannerSlot?: React.ReactNode;
  triageSeverityScale: Array<'routine' | 'urgent' | 'critical'>;
  renderTimelineOrChart?: () => React.ReactNode;
}
