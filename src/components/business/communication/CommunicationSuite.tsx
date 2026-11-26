import * as React from 'react';
import {
  Bell,
  Hand,
  Inbox,
  Megaphone,
  Mic,
  MicOff,
  MonitorUp,
  Paperclip,
  PhoneOff,
  Search,
  Send,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* ChatLayout, ConversationList, MessageThread, MessageComposer               */
/* -------------------------------------------------------------------------- */

export interface ConversationSummary {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  unreadCount?: number;
  status?: 'active' | 'pending' | 'completed';
}

export interface ChatMessageItem {
  id: string;
  sender: string;
  timestamp: string;
  body: string;
  own?: boolean;
  attachments?: Array<{ id: string; name: string; sizeLabel?: string }>;
  reactions?: Array<{ label: string; count: number }>;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  className,
}: {
  conversations: ConversationSummary[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const [query, setQuery] = React.useState('');
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const filtered = conversations.filter((c) =>
    `${c.title} ${c.preview}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const focusOption = (idx: number) => {
    if (filtered.length === 0) return;
    const target = (idx + filtered.length) % filtered.length;
    optionRefs.current[target]?.focus();
  };

  return (
    <div className={cn('flex flex-col border-r border-border bg-surface', className)}>
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            aria-label="Filter conversations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter threads…"
            className="h-8 w-full rounded-[var(--wdr-radius-sm)] border border-input bg-background pl-8 pr-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <ul role="listbox" aria-label="Conversations" className="flex-1 divide-y divide-border/60 overflow-y-auto">
        {filtered.map((conv, idx) => {
          const active = conv.id === activeId;
          return (
            <li key={conv.id}>
              <button
                ref={(el) => {
                  optionRefs.current[idx] = el;
                }}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => onSelect(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusOption(idx + 1);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusOption(idx - 1);
                  } else if (e.key === 'Home') {
                    e.preventDefault();
                    focusOption(0);
                  } else if (e.key === 'End') {
                    e.preventDefault();
                    focusOption(filtered.length - 1);
                  }
                }}
                className={cn(
                  'w-full px-3.5 py-3 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active && 'bg-primary-subtle/40'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold text-foreground">{conv.title}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground tabular-nums">{conv.timestamp}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-muted-foreground">{conv.preview}</span>
                  {conv.unreadCount && conv.unreadCount > 0 ? (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground tabular-nums">
                      {conv.unreadCount}
                    </span>
                  ) : null}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MessageThread({
  messages,
  onReact,
  className,
}: {
  messages: ChatMessageItem[];
  onReact?: (messageId: string, label: string) => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3 p-4 overflow-y-auto', className)}>
      {messages.map((msg) => (
        <div key={msg.id} className={cn('flex flex-col gap-1', msg.own ? 'items-end' : 'items-start')}>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">{msg.sender}</span>
            <span>{msg.timestamp}</span>
          </div>
          <div
            className={cn(
              'max-w-lg rounded-[var(--wdr-radius-lg)] border px-3.5 py-2.5 text-xs leading-relaxed',
              msg.own
                ? 'border-foreground bg-primary text-primary-foreground'
                : 'border-border bg-surface text-foreground'
            )}
          >
            <p>{msg.body}</p>
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {msg.attachments.map((att) => (
                  <span
                    key={att.id}
                    className="inline-flex items-center gap-1 rounded border border-border/50 bg-background/80 px-2 py-0.5 text-[11px] text-foreground"
                  >
                    <Paperclip className="h-3 w-3" aria-hidden="true" />
                    <span>{att.name}</span>
                    {att.sizeLabel && <span className="text-muted-foreground">({att.sizeLabel})</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {msg.reactions.map((rx) => (
                <button
                  key={rx.label}
                  type="button"
                  onClick={() => onReact?.(msg.id, rx.label)}
                  className="inline-flex items-center gap-1 rounded border border-border bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-foreground hover:bg-muted tabular-nums"
                >
                  <span>{rx.label}</span>
                  <span>{rx.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function MessageComposer({
  onSend,
  placeholder = 'Write a message…',
  className,
}: {
  onSend: (text: string, attachmentNames: string[]) => void;
  placeholder?: string;
  className?: string;
}) {
  const [text, setText] = React.useState('');
  const [attachments, setAttachments] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim() && attachments.length === 0) return;
        onSend(text.trim(), attachments);
        setText('');
        setAttachments([]);
      }}
      className={cn('border-t border-border bg-surface p-3 space-y-2', className)}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        aria-label="Select files to attach"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []).map((f) => f.name);
          if (files.length > 0) {
            setAttachments((prev) => Array.from(new Set([...prev, ...files])));
          }
          e.target.value = '';
        }}
      />
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-xs">
          {attachments.map((name) => (
            <span key={name} className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-foreground">
              <Paperclip className="h-3 w-3" aria-hidden="true" />
              <span>{name}</span>
              <button
                type="button"
                aria-label={`Remove ${name}`}
                onClick={() => setAttachments((prev) => prev.filter((item) => item !== name))}
                className="ml-0.5 rounded px-1 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          aria-label="Attach files"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
        </Button>
        <input
          type="text"
          aria-label={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="h-9 flex-1 rounded-[var(--wdr-radius-md)] border border-input bg-background px-3 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" size="sm" variant="primary" leftIcon={<Send className="h-3.5 w-3.5" />}>
          Send
        </Button>
      </div>
    </form>
  );
}

export function ChatLayout({
  conversations,
  activeConversationId,
  onSelectConversation,
  messages,
  onSendMessage,
  className,
}: {
  conversations: ConversationSummary[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  messages: ChatMessageItem[];
  onSendMessage: (text: string, attachments: string[]) => void;
  className?: string;
}) {
  const active = conversations.find((c) => c.id === activeConversationId);
  return (
    <Card className={cn('grid grid-cols-1 overflow-hidden md:grid-cols-12 min-h-[380px]', className)}>
      <ConversationList
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={onSelectConversation}
        className="md:col-span-4"
      />
      <div className="flex flex-col md:col-span-8">
        <div className="border-b border-border bg-muted/20 px-4 py-3 text-sm font-semibold text-foreground">
          {active?.title ?? 'Conversation'}
        </div>
        <MessageThread messages={messages} className="flex-1 bg-background/40" />
        <MessageComposer onSend={onSendMessage} />
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* SharedInbox, AnnouncementPanel, NotificationPreferences                    */
/* -------------------------------------------------------------------------- */

export interface SharedInboxItem {
  id: string;
  subject: string;
  sender: string;
  assignee?: string;
  priority: 'high' | 'normal';
  unread?: boolean;
  status: 'open' | 'pending' | 'resolved';
}

export function SharedInbox({
  items,
  onSelectItem,
  title = 'Shared team inbox',
  className,
}: {
  items: SharedInboxItem[];
  onSelectItem?: (id: string) => void;
  title?: string;
  className?: string;
}) {
  const [filter, setFilter] = React.useState<'all' | 'open' | 'pending'>('all');
  const visible = items.filter((item) => (filter === 'all' ? true : item.status === filter));

  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Inbox className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'open', 'pending'] as const).map((tab) => (
            <Button
              key={tab}
              size="sm"
              variant={filter === tab ? 'primary' : 'outline'}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-border/70">
        {visible.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelectItem?.(item.id)}
              className="flex w-full flex-wrap items-center justify-between gap-2 py-2.5 text-left hover:bg-muted/40 px-2 rounded"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  {item.unread && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
                  <span className="font-semibold text-foreground">{item.subject}</span>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {item.sender} {item.assignee ? `· Assigned to ${item.assignee}` : '· Unassigned'}
                </div>
              </div>
              <StatusBadge
                status={item.status === 'resolved' ? 'completed' : item.status === 'pending' ? 'pending' : 'active'}
                label={item.status}
              />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AnnouncementPanel({
  title,
  message,
  publishedAt,
  actionLabel,
  onAction,
  className,
}: {
  title: string;
  message: string;
  publishedAt?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('border-primary/50 bg-primary-subtle/30 p-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] bg-primary text-primary-foreground">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <p className="text-xs text-muted-foreground">{message}</p>
            {publishedAt && <div className="text-[11px] text-muted-foreground">Posted {publishedAt}</div>}
          </div>
        </div>
        {actionLabel && onAction && (
          <Button size="sm" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export interface NotificationPreferenceItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationPreferences({
  preferences,
  onToggle,
  title = 'Notification preferences',
  className,
}: {
  preferences: NotificationPreferenceItem[];
  onToggle: (id: string, enabled: boolean) => void;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5 space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Bell className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="divide-y divide-border/70">
        {preferences.map((pref) => (
          <li key={pref.id} className="flex items-center justify-between gap-4 py-2.5">
            <div>
              <div className="text-xs font-semibold text-foreground">{pref.label}</div>
              <div className="text-[11px] text-muted-foreground">{pref.description}</div>
            </div>
            <Switch
              aria-label={`Toggle ${pref.label}`}
              checked={pref.enabled}
              onCheckedChange={(checked) => onToggle(pref.id, checked)}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* MeetingControls & ParticipantGrid (Audio/Video Presentation UI)            */
/* -------------------------------------------------------------------------- */

export interface MeetingParticipant {
  id: string;
  name: string;
  role?: string;
  muted: boolean;
  videoEnabled: boolean;
  speaking?: boolean;
  handRaised?: boolean;
}

export function MeetingLayout({
  roomTitle,
  participants,
  muted,
  videoEnabled,
  screenSharing = false,
  handRaised = false,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onToggleHand,
  onLeave,
  className,
}: {
  roomTitle: string;
  participants: MeetingParticipant[];
  muted: boolean;
  videoEnabled: boolean;
  screenSharing?: boolean;
  handRaised?: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare?: () => void;
  onToggleHand?: () => void;
  onLeave?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span>{roomTitle}</span>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {participants.length} participants
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants.map((p) => (
          <div
            key={p.id}
            className={cn(
              'flex flex-col justify-between rounded-[var(--wdr-radius-md)] border bg-surface p-3 min-h-[112px]',
              p.speaking ? 'border-primary ring-1 ring-primary' : 'border-border'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
                {p.videoEnabled ? 'Camera ready' : 'Audio only'}
              </span>
              {p.handRaised && (
                <span className="inline-flex items-center gap-1 rounded bg-primary-subtle px-1.5 py-0.5 text-[10px] font-semibold text-primary-subtle-foreground">
                  <Hand className="h-3 w-3" aria-hidden="true" />
                  Raised
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 pt-4">
              <div>
                <div className="text-xs font-semibold text-foreground">{p.name}</div>
                {p.role && <div className="text-[11px] text-muted-foreground">{p.role}</div>}
              </div>
              {p.muted ? (
                <MicOff className="h-3.5 w-3.5 text-destructive" aria-label="Muted" />
              ) : (
                <Mic className="h-3.5 w-3.5 text-success" aria-label="Unmuted" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 border-t border-border bg-muted/20 px-4 py-3">
        <Button
          size="sm"
          variant={muted ? 'destructive' : 'outline'}
          onClick={onToggleMute}
          leftIcon={muted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
        >
          {muted ? 'Unmute' : 'Mute'}
        </Button>
        <Button
          size="sm"
          variant={!videoEnabled ? 'destructive' : 'outline'}
          onClick={onToggleVideo}
          leftIcon={videoEnabled ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
        >
          {videoEnabled ? 'Stop video' : 'Start video'}
        </Button>
        {onToggleScreenShare && (
          <Button
            size="sm"
            variant={screenSharing ? 'primary' : 'outline'}
            onClick={onToggleScreenShare}
            leftIcon={<MonitorUp className="h-3.5 w-3.5" />}
          >
            {screenSharing ? 'Stop sharing' : 'Share screen'}
          </Button>
        )}
        {onToggleHand && (
          <Button
            size="sm"
            variant={handRaised ? 'primary' : 'outline'}
            onClick={onToggleHand}
            leftIcon={<Hand className="h-3.5 w-3.5" />}
          >
            {handRaised ? 'Lower hand' : 'Raise hand'}
          </Button>
        )}
        {onLeave && (
          <Button size="sm" variant="destructive" onClick={onLeave} leftIcon={<PhoneOff className="h-3.5 w-3.5" />}>
            Leave
          </Button>
        )}
      </div>
    </Card>
  );
}
