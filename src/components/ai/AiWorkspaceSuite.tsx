import * as React from 'react';
import {
  Activity,
  Bot,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  History,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Play,
  Send,
  ShieldAlert,
  Sparkles,
  Square,
  ThumbsDown,
  ThumbsUp,
  Wrench,
  XCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { sanitizeUrl } from '../../utils/url';
import { useClipboard } from '../../hooks/use-clipboard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { StatusBadge } from '../business/status-badge';

/* -------------------------------------------------------------------------- */
/* Domain 13 — Optional AI & Agent Experience Suite (@wendoro/ui/ai)          */
/* Backend-agnostic presentation UI: zero hardcoded LLM SDKs or API calls.    */
/* -------------------------------------------------------------------------- */

export interface AiModelOption {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  latencyTier: 'fast' | 'balanced' | 'reasoning';
  costTier?: string;
  strengths?: string[];
}

export function ModelSelector({
  models,
  selectedModelId,
  onSelectModel,
  label = 'Model',
  className,
}: {
  models: AiModelOption[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  label?: string;
  className?: string;
}) {
  const selectId = React.useId();
  const active = models.find((m) => m.id === selectedModelId);

  return (
    <div className={cn('inline-flex flex-wrap items-center gap-2', className)}>
      <label htmlFor={selectId} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <select
        id={selectId}
        value={selectedModelId}
        onChange={(e) => onSelectModel(e.target.value)}
        className="h-9 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.provider} · {m.contextWindow})
          </option>
        ))}
      </select>
      {active && (
        <Badge variant="outline" size="sm">
          {active.latencyTier}
        </Badge>
      )}
    </div>
  );
}

export function ModelComparisonTable({
  models,
  selectedModelId,
  onSelectModel,
  className,
}: {
  models: AiModelOption[];
  selectedModelId?: string;
  onSelectModel?: (id: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Model comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th scope="col" className="border-b border-border px-3 py-2 font-semibold">Model</th>
              <th scope="col" className="border-b border-border px-3 py-2 font-semibold">Provider</th>
              <th scope="col" className="border-b border-border px-3 py-2 font-semibold">Context</th>
              <th scope="col" className="border-b border-border px-3 py-2 font-semibold">Tier</th>
              <th scope="col" className="border-b border-border px-3 py-2 font-semibold">Strengths</th>
              {onSelectModel && <th scope="col" className="border-b border-border px-3 py-2 font-semibold text-right">Select</th>}
            </tr>
          </thead>
          <tbody>
            {models.map((m) => {
              const selected = m.id === selectedModelId;
              return (
                <tr key={m.id} className={cn('border-b border-border last:border-b-0', selected && 'bg-primary-subtle/40')}>
                  <td className="px-3 py-2.5 font-semibold text-foreground">{m.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{m.provider}</td>
                  <td className="px-3 py-2.5 tabular-nums text-foreground">{m.contextWindow}</td>
                  <td className="px-3 py-2.5">
                    <Badge variant={m.latencyTier === 'reasoning' ? 'primary' : 'secondary'} size="sm">
                      {m.latencyTier}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{(m.strengths ?? []).join(', ') || '—'}</td>
                  {onSelectModel && (
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        size="sm"
                        variant={selected ? 'primary' : 'outline'}
                        onClick={() => onSelectModel(m.id)}
                      >
                        {selected ? 'Active' : 'Use'}
                      </Button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export interface PromptTemplateItem {
  id: string;
  title: string;
  category: string;
  template: string;
  variables?: string[];
}

export function PromptTemplatePicker({
  templates,
  onSelectTemplate,
  className,
}: {
  templates: PromptTemplateItem[];
  onSelectTemplate: (template: PromptTemplateItem) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2', className)}>
      {templates.map((tpl) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onSelectTemplate(tpl)}
          className="flex flex-col items-start gap-1 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-left transition-colors hover:border-foreground/40 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <div className="flex w-full items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground">{tpl.title}</span>
            <Badge variant="outline" size="sm">{tpl.category}</Badge>
          </div>
          <p className="line-clamp-2 text-[11px] text-muted-foreground">{tpl.template}</p>
        </button>
      ))}
    </div>
  );
}

export function PromptLibrary({
  templates,
  onInsert,
  className,
}: {
  templates: PromptTemplateItem[];
  onInsert: (template: PromptTemplateItem) => void;
  className?: string;
}) {
  const [query, setQuery] = React.useState('');
  const filtered = templates.filter((t) =>
    `${t.title} ${t.category} ${t.template}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-foreground">Prompt library</div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search templates…"
          aria-label="Search prompt library"
          className="h-8 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="py-6 text-center text-xs text-muted-foreground">No prompt templates match your query.</div>
      ) : (
        <PromptTemplatePicker templates={filtered} onSelectTemplate={onInsert} />
      )}
    </Card>
  );
}

export function PromptEditor({
  value,
  onValueChange,
  systemInstruction,
  onSystemInstructionChange,
  variables = [],
  onInsertVariable,
  onRun,
  running = false,
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  systemInstruction?: string;
  onSystemInstructionChange?: (val: string) => void;
  variables?: string[];
  onInsertVariable?: (variable: string) => void;
  onRun?: () => void;
  running?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary-active" aria-hidden="true" />
          <span>Prompt editor</span>
        </div>
        {onRun && (
          <Button size="sm" variant="primary" loading={running} onClick={onRun} leftIcon={<Play className="h-3.5 w-3.5" />}>
            Run prompt
          </Button>
        )}
      </div>
      {onSystemInstructionChange && (
        <div className="space-y-1">
          <label className="block text-[11px] font-medium text-muted-foreground">System instruction</label>
          <input
            type="text"
            value={systemInstruction ?? ''}
            onChange={(e) => onSystemInstructionChange(e.target.value)}
            placeholder="Role, tone, or policy constraints…"
            className="h-8 w-full rounded-[var(--wdr-radius-md)] border border-input bg-background px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      )}
      <div className="space-y-1">
        <label className="block text-[11px] font-medium text-muted-foreground">User prompt</label>
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Compose prompt with {{variables}}…"
          className="w-full rounded-[var(--wdr-radius-md)] border border-input bg-background p-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {variables.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">Variables:</span>
          {variables.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => (onInsertVariable ? onInsertVariable(v) : onValueChange(`${value} {{${v}}}`))}
              className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground hover:bg-accent"
            >
              {`{{${v}}}`}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

export interface SourceCitationItem {
  id: string;
  title: string;
  excerpt?: string;
  href?: string;
  confidence?: string;
}

export function SourceCitationsPanel({
  citations,
  title = 'Grounded sources & citations',
  className,
}: {
  citations: SourceCitationItem[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2', className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <FileText className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <div className="space-y-1.5">
        {citations.map((cit, idx) => {
          const safeHref = cit.href ? sanitizeUrl(cit.href) : undefined;
          return (
            <div key={cit.id} className="rounded-[var(--wdr-radius-sm)] border border-border bg-muted/30 p-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                {safeHref ? (
                  <a
                    href={safeHref}
                    className="font-semibold text-foreground underline underline-offset-2 hover:text-primary-active"
                  >
                    [{idx + 1}] {cit.title}
                  </a>
                ) : (
                  <span className="font-semibold text-foreground">[{idx + 1}] {cit.title}</span>
                )}
                {cit.confidence && (
                  <span className="text-[11px] tabular-nums text-muted-foreground">{cit.confidence}</span>
                )}
              </div>
              {cit.excerpt && <p className="mt-1 text-[11px] text-muted-foreground">{cit.excerpt}</p>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export interface ToolExecutionCardProps {
  toolName: string;
  status: 'running' | 'completed' | 'failed' | 'queued';
  inputSummary: string;
  outputSummary?: string;
  durationMs?: number;
  className?: string;
}

export function ToolExecutionCard({
  toolName,
  status,
  inputSummary,
  outputSummary,
  durationMs,
  className,
}: ToolExecutionCardProps) {
  const statusMap = {
    running: 'pending',
    completed: 'completed',
    failed: 'error',
    queued: 'draft',
  } as const;

  return (
    <div className={cn('rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3 text-xs space-y-1.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Wrench className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          <span className="font-mono">{toolName}</span>
        </div>
        <div className="flex items-center gap-2">
          {durationMs !== undefined && (
            <span className="text-[11px] tabular-nums text-muted-foreground">{durationMs} ms</span>
          )}
          <StatusBadge status={statusMap[status]} label={status} />
        </div>
      </div>
      <div className="text-[11px] text-muted-foreground">Input: {inputSummary}</div>
      {outputSummary && <div className="rounded bg-muted/50 px-2 py-1 text-[11px] text-foreground">{outputSummary}</div>}
    </div>
  );
}

export function HumanApprovalCheckpoint({
  actionTitle,
  description,
  riskLevel = 'medium',
  onApprove,
  onReject,
  decision,
  className,
}: {
  actionTitle: string;
  description: string;
  riskLevel?: 'low' | 'medium' | 'high';
  onApprove: () => void;
  onReject: () => void;
  decision?: 'approved' | 'rejected' | 'pending';
  className?: string;
}) {
  return (
    <Card className={cn('border-warning/40 bg-warning-subtle/30 p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
          <div>
            <div className="text-xs font-semibold text-foreground">{actionTitle}</div>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <Badge variant={riskLevel === 'high' ? 'destructive' : 'warning'} size="sm">
          {riskLevel} risk
        </Badge>
      </div>
      {decision === 'approved' ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          <span>Approved for execution</span>
        </div>
      ) : decision === 'rejected' ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
          <XCircle className="h-4 w-4" aria-hidden="true" />
          <span>Rejected by reviewer</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="primary" onClick={onApprove} leftIcon={<Check className="h-3.5 w-3.5" />}>
            Approve action
          </Button>
          <Button size="sm" variant="outline" onClick={onReject}>
            Decline
          </Button>
        </div>
      )}
    </Card>
  );
}

export interface AiConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  streaming?: boolean;
  timestamp?: string;
  toolCalls?: ToolExecutionCardProps[];
  citations?: SourceCitationItem[];
}

export function ConversationStreamView({
  messages,
  onFeedback,
  className,
}: {
  messages: AiConversationMessage[];
  onFeedback?: (messageId: string, helpful: boolean) => void;
  className?: string;
}) {
  const { copied, copy } = useClipboard();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  return (
    <div className={cn('space-y-3', className)} aria-live="polite">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={cn(
              'rounded-[var(--wdr-radius-lg)] border p-3.5 space-y-2',
              isUser ? 'ml-auto max-w-[85%] border-border bg-primary-subtle/40' : 'border-border bg-surface'
            )}
          >
            <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
              <span className="font-semibold capitalize text-foreground">
                {msg.role === 'assistant' ? 'Assistant' : msg.role}
              </span>
              <div className="flex items-center gap-1">
                {msg.timestamp && <span>{msg.timestamp}</span>}
                {msg.role === 'assistant' && !msg.streaming && (
                  <>
                    <button
                      type="button"
                      aria-label="Copy assistant response"
                      onClick={() => {
                        setCopiedId(msg.id);
                        void copy(msg.content);
                      }}
                      className="rounded p-1 hover:bg-muted hover:text-foreground"
                    >
                      {copied && copiedId === msg.id ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    </button>
                    {onFeedback && (
                      <>
                        <button
                          type="button"
                          aria-label="Rate helpful"
                          onClick={() => onFeedback(msg.id, true)}
                          className="rounded p-1 hover:bg-muted hover:text-foreground"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          aria-label="Rate unhelpful"
                          onClick={() => onFeedback(msg.id, false)}
                          className="rounded p-1 hover:bg-muted hover:text-foreground"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {msg.content}
              {msg.streaming && (
                <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-foreground align-middle" aria-label="Streaming" />
              )}
            </div>

            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {msg.toolCalls.map((tc, idx) => (
                  <ToolExecutionCard key={`${msg.id}-tc-${idx}`} {...tc} />
                ))}
              </div>
            )}

            {msg.citations && msg.citations.length > 0 && (
              <SourceCitationsPanel citations={msg.citations} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export interface MultimodalAttachmentItem {
  id: string;
  kind: 'file' | 'image' | 'audio';
  label: string;
}

export function MultimodalInputBar({
  value,
  onValueChange,
  onSubmit,
  generating = false,
  onStop,
  attachments = [],
  onAttachKind,
  onRemoveAttachment,
  placeholder = 'Ask a question or attach files, images, or audio…',
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  onSubmit: (prompt: string) => void;
  generating?: boolean;
  onStop?: () => void;
  attachments?: MultimodalAttachmentItem[];
  onAttachKind?: (kind: 'file' | 'image' | 'audio') => void;
  onRemoveAttachment?: (id: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-3 space-y-2', className)}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attachments.map((att) => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-sm)] border border-border bg-muted px-2 py-0.5 text-xs text-foreground"
            >
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
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full resize-y rounded-[var(--wdr-radius-md)] border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {onAttachKind && (
            <>
              <Button size="sm" variant="ghost" aria-label="Attach document" onClick={() => onAttachKind('file')}>
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Attach image" onClick={() => onAttachKind('image')}>
                <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <Button size="sm" variant="ghost" aria-label="Record audio note" onClick={() => onAttachKind('audio')}>
                <Mic className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
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
    </Card>
  );
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'paused';
  capabilities: string[];
}

export function AgentDirectory({
  agents,
  onLaunchAgent,
  className,
}: {
  agents: AgentProfile[];
  onLaunchAgent?: (agent: AgentProfile) => void;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-3 md:grid-cols-2', className)}>
      {agents.map((ag) => (
        <Card key={ag.id} className="p-4 space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-md)] bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">{ag.name}</div>
                <div className="text-xs text-muted-foreground">{ag.role}</div>
              </div>
            </div>
            <StatusBadge
              status={ag.status === 'active' ? 'active' : ag.status === 'paused' ? 'warning' : 'draft'}
              label={ag.status}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {ag.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" size="sm">
                {cap}
              </Badge>
            ))}
          </div>
          {onLaunchAgent && (
            <Button size="sm" variant="outline" className="w-full" onClick={() => onLaunchAgent(ag)}>
              Launch agent
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
}

export function AgentLauncher({
  agents,
  onRunGoal,
  className,
}: {
  agents: AgentProfile[];
  onRunGoal: (agentId: string, goal: string) => void;
  className?: string;
}) {
  const [selectedId, setSelectedId] = React.useState(agents[0]?.id ?? '');
  const [goal, setGoal] = React.useState('');

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Bot className="h-4 w-4 text-primary-active" aria-hidden="true" />
        <span>Agent launcher</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <select
          aria-label="Select agent"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="h-9 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-2.5 text-xs text-foreground"
        >
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Specify autonomous task goal…"
          aria-label="Agent task goal"
          className="h-9 sm:col-span-2 rounded-[var(--wdr-radius-md)] border border-input bg-background px-3 text-xs text-foreground"
        />
      </div>
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="primary"
          disabled={!selectedId || !goal.trim()}
          onClick={() => {
            onRunGoal(selectedId, goal.trim());
            setGoal('');
          }}
        >
          Start run
        </Button>
      </div>
    </Card>
  );
}

export interface AgentTimelineStep {
  id: string;
  label: string;
  timestamp: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  detail?: string;
}

export function AgentActivityTimeline({
  steps,
  title = 'Agent activity timeline',
  className,
}: {
  steps: AgentTimelineStep[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Activity className="h-4 w-4 text-primary-active" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ol className="space-y-2.5">
        {steps.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-3 rounded-[var(--wdr-radius-sm)] border border-border bg-surface p-2.5 text-xs">
            <div className="min-w-0">
              <div className="font-semibold text-foreground">{s.label}</div>
              {s.detail && <div className="mt-0.5 text-[11px] text-muted-foreground">{s.detail}</div>}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[11px] text-muted-foreground">{s.timestamp}</span>
              <StatusBadge
                status={s.status === 'failed' ? 'error' : s.status === 'completed' ? 'completed' : s.status === 'active' ? 'active' : 'draft'}
                label={s.status}
              />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function GeneratedContentPreview({
  title,
  format = 'text',
  content,
  onAccept,
  onDiscard,
  className,
}: {
  title: string;
  format?: 'text' | 'markdown' | 'json';
  content: string;
  onAccept?: () => void;
  onDiscard?: () => void;
  className?: string;
}) {
  const { copied, copy } = useClipboard();
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{title}</span>
          <Badge variant="outline" size="sm">{format}</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => void copy(content)}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          {onDiscard && <Button size="sm" variant="outline" onClick={onDiscard}>Discard</Button>}
          {onAccept && <Button size="sm" variant="primary" onClick={onAccept}>Insert</Button>}
        </div>
      </div>
      <pre className="max-h-64 overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
        {content}
      </pre>
    </Card>
  );
}

export function TokenUsageBar({
  promptTokens,
  completionTokens,
  budgetTokens,
  estimatedCostLabel,
  className,
}: {
  promptTokens: number;
  completionTokens: number;
  budgetTokens: number;
  estimatedCostLabel?: string;
  className?: string;
}) {
  const used = promptTokens + completionTokens;
  const pct = Math.min(100, Math.round((used / Math.max(1, budgetTokens)) * 100));

  return (
    <Card className={cn('p-3.5 space-y-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-foreground">Context & token usage</span>
        <span className="tabular-nums text-muted-foreground">
          {used.toLocaleString()} / {budgetTokens.toLocaleString()} ({pct}%)
          {estimatedCostLabel ? ` · ${estimatedCostLabel}` : ''}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full transition-all', pct >= 90 ? 'bg-destructive' : 'bg-primary')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-[11px] tabular-nums text-muted-foreground">
        <span>Prompt: {promptTokens.toLocaleString()}</span>
        <span>Completion: {completionTokens.toLocaleString()}</span>
      </div>
    </Card>
  );
}

export function AiEvaluationControls({
  rating,
  onRate,
  notes,
  onNotesChange,
  onSubmitEvaluation,
  className,
}: {
  rating?: number;
  onRate: (score: number) => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  onSubmitEvaluation?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('p-3.5 space-y-2.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">Output evaluation</span>
        <div className="flex items-center gap-1" role="group" aria-label="Score 1 to 5">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              aria-pressed={rating === score}
              onClick={() => onRate(score)}
              className={cn(
                'h-7 w-7 rounded-[var(--wdr-radius-sm)] border text-xs font-semibold tabular-nums',
                rating === score
                  ? 'border-foreground bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-foreground hover:bg-muted'
              )}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
      {onNotesChange && (
        <textarea
          rows={2}
          value={notes ?? ''}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Optional rubric notes (groundedness, tone, format)…"
          className="w-full rounded-[var(--wdr-radius-md)] border border-input bg-background p-2 text-xs text-foreground"
        />
      )}
      {onSubmitEvaluation && (
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={onSubmitEvaluation}>
            Record evaluation
          </Button>
        </div>
      )}
    </Card>
  );
}

export interface AiTaskHistoryEntry {
  id: string;
  title: string;
  timestamp: string;
  modelName: string;
  status: 'completed' | 'running' | 'failed';
}

export function AiAssistantPanel({
  title = 'Wendoro AI Workspace',
  models,
  selectedModelId,
  onSelectModel,
  messages,
  promptValue,
  onPromptChange,
  onSubmitPrompt,
  generating = false,
  onStop,
  taskHistory = [],
  onSelectTask,
  className,
}: {
  title?: string;
  models: AiModelOption[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  messages: AiConversationMessage[];
  promptValue: string;
  onPromptChange: (val: string) => void;
  onSubmitPrompt: (prompt: string) => void;
  generating?: boolean;
  onStop?: () => void;
  taskHistory?: AiTaskHistoryEntry[];
  onSelectTask?: (task: AiTaskHistoryEntry) => void;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <ModelSelector models={models} selectedModelId={selectedModelId} onSelectModel={onSelectModel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {taskHistory.length > 0 && (
          <aside className="border-b border-border bg-muted/20 p-3 lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Task history</span>
            </div>
            <ul className="space-y-1">
              {taskHistory.map((task) => (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => onSelectTask?.(task)}
                    className="flex w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs hover:bg-muted"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">{task.title}</div>
                      <div className="text-[10px] text-muted-foreground">{task.modelName} · {task.timestamp}</div>
                    </div>
                    <StatusBadge
                      status={task.status === 'failed' ? 'error' : task.status === 'completed' ? 'completed' : 'pending'}
                      label={task.status}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className={cn('flex flex-col justify-between gap-3 p-4', taskHistory.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12')}>
          <ConversationStreamView messages={messages} />
          <MultimodalInputBar
            value={promptValue}
            onValueChange={onPromptChange}
            onSubmit={onSubmitPrompt}
            generating={generating}
            onStop={onStop}
          />
        </div>
      </div>
    </Card>
  );
}
