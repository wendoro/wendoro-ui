import * as React from 'react';
import { CheckCircle2, MessageSquare, Send, XCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { StatusBadge } from '../status-badge';

/* -------------------------------------------------------------------------- */
/* CommentThread / NotesPanel                                                 */
/* -------------------------------------------------------------------------- */

export interface CommentEntry {
  id: string;
  author: string;
  role?: string;
  timestamp: string;
  body: string;
  resolved?: boolean;
  replies?: Array<{
    id: string;
    author: string;
    timestamp: string;
    body: string;
  }>;
}

export interface CommentThreadProps {
  title?: string;
  comments: CommentEntry[];
  onAddComment?: (body: string) => void;
  onAddReply?: (commentId: string, body: string) => void;
  onToggleResolve?: (commentId: string, resolved: boolean) => void;
  placeholder?: string;
  className?: string;
}

export function CommentThread({
  title = 'Notes & comments',
  comments,
  onAddComment,
  onAddReply,
  onToggleResolve,
  placeholder = 'Add a note or comment…',
  className,
}: CommentThreadProps) {
  const [draft, setDraft] = React.useState('');
  const [replyTarget, setReplyTarget] = React.useState<string | null>(null);
  const [replyDraft, setReplyDraft] = React.useState('');

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{comments.length} threads</span>
      </div>

      {onAddComment && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onAddComment(draft.trim());
            setDraft('');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            aria-label={placeholder}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="h-10 flex-1 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button type="submit" variant="primary" size="sm" leftIcon={<Send className="h-3.5 w-3.5" />}>
            Post
          </Button>
        </form>
      )}

      <ul className="space-y-3">
        {comments.map((c) => (
          <li
            key={c.id}
            className={cn(
              'rounded-[var(--wdr-radius-md)] border border-border p-3.5 space-y-2.5',
              c.resolved ? 'bg-muted/30 opacity-80' : 'bg-surface'
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-foreground">{c.author}</span>
                {c.role && <span className="text-muted-foreground">· {c.role}</span>}
                <span className="text-muted-foreground">{c.timestamp}</span>
              </div>
              <div className="flex items-center gap-2">
                {c.resolved && <StatusBadge status="completed" label="Resolved" />}
                {onToggleResolve && (
                  <button
                    type="button"
                    onClick={() => onToggleResolve(c.id, !c.resolved)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground underline"
                  >
                    {c.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                )}
              </div>
            </div>

            <p className="text-sm text-foreground leading-relaxed">{c.body}</p>

            {c.replies && c.replies.length > 0 && (
              <ul className="ml-4 space-y-2 border-l-2 border-border pl-3">
                {c.replies.map((rep) => (
                  <li key={rep.id} className="text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{rep.author}</span>
                      <span className="text-muted-foreground">{rep.timestamp}</span>
                    </div>
                    <p className="mt-0.5 text-foreground">{rep.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {onAddReply && (
              <div>
                {replyTarget === c.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!replyDraft.trim()) return;
                      onAddReply(c.id, replyDraft.trim());
                      setReplyDraft('');
                      setReplyTarget(null);
                    }}
                    className="flex gap-2 pt-1"
                  >
                    <input
                      type="text"
                      aria-label={`Reply to ${c.author}`}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write a reply…"
                      className="h-8 flex-1 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
                    />
                    <Button type="submit" size="sm" variant="primary">
                      Reply
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setReplyTarget(null)}>
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReplyTarget(c.id)}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Reply
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* ApprovalQueue (Interactive Multi-Item Approval Workflow)                   */
/* -------------------------------------------------------------------------- */

export interface ApprovalRequestItem {
  id: string;
  title: string;
  requester: string;
  category: string;
  submittedAt: string;
  summary: string;
  amountLabel?: string;
  status: 'pending' | 'approved' | 'rejected';
  decisionNote?: string;
}

export interface ApprovalQueueProps {
  title?: string;
  items: ApprovalRequestItem[];
  onDecision: (id: string, decision: 'approved' | 'rejected', note?: string) => void;
  className?: string;
}

export function ApprovalQueue({
  title = 'Approval queue',
  items,
  onDecision,
  className,
}: ApprovalQueueProps) {
  const [notes, setNotes] = React.useState<Record<string, string>>({});

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">
          {items.filter((i) => i.status === 'pending').length} pending
        </span>
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--wdr-radius-md)] border border-border bg-surface p-4 space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  <StatusBadge
                    status={
                      item.status === 'approved'
                        ? 'completed'
                        : item.status === 'rejected'
                          ? 'error'
                          : 'pending'
                    }
                    label={item.status}
                  />
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {item.requester} · {item.category} · {item.submittedAt}
                </div>
              </div>
              {item.amountLabel && (
                <div className="text-sm font-bold tabular-nums text-foreground">{item.amountLabel}</div>
              )}
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>

            {item.status === 'pending' ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <input
                  type="text"
                  aria-label={`Decision note for ${item.title}`}
                  placeholder="Optional approval note…"
                  value={notes[item.id] ?? ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  className="h-8 flex-1 min-w-[160px] rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground"
                />
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<XCircle className="h-3.5 w-3.5 text-destructive" />}
                  onClick={() => onDecision(item.id, 'rejected', notes[item.id])}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                  onClick={() => onDecision(item.id, 'approved', notes[item.id])}
                >
                  Approve
                </Button>
              </div>
            ) : (
              item.decisionNote && (
                <div className="border-t border-border pt-2 text-xs text-muted-foreground">
                  Note: <span className="text-foreground">{item.decisionNote}</span>
                </div>
              )
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
