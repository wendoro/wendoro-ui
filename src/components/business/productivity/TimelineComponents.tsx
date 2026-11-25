import * as React from 'react';
import { Check, Circle, Clock, Flag } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Card } from '../../ui/card';

export interface TimelineItemProps {
  title: React.ReactNode;
  timestamp?: string;
  description?: React.ReactNode;
  actor?: string;
  status?: 'completed' | 'active' | 'pending' | 'error';
  badge?: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

const DOT_STYLES: Record<NonNullable<TimelineItemProps['status']>, string> = {
  completed: 'bg-success text-success-foreground border-success',
  active: 'bg-primary text-primary-foreground border-primary',
  pending: 'bg-surface text-muted-foreground border-border',
  error: 'bg-destructive text-destructive-foreground border-destructive',
};

export function TimelineItem({
  title,
  timestamp,
  description,
  actor,
  status = 'completed',
  badge,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <li className={cn('relative flex gap-3.5 pb-5 last:pb-0', className)}>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-3.5 top-7 bottom-0 w-px bg-border"
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          'relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
          DOT_STYLES[status]
        )}
      >
        {status === 'completed' ? (
          <Check className="h-3.5 w-3.5" />
        ) : status === 'active' ? (
          <Clock className="h-3.5 w-3.5" />
        ) : (
          <Circle className="h-2.5 w-2.5" />
        )}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
            {badge}
            {timestamp && <time>{timestamp}</time>}
          </div>
        </div>
        {actor && <div className="mt-0.5 text-xs text-muted-foreground">{actor}</div>}
        {description && <div className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{description}</div>}
      </div>
    </li>
  );
}

export function Timeline({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ol className={cn('m-0 list-none p-0', className)}>{children}</ol>;
}

export function TimelineGroup({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <Timeline>{children}</Timeline>
    </div>
  );
}

export interface ActivityTimelineEntry {
  id: string;
  title: string;
  actor?: string;
  timestamp: string;
  description?: string;
  status?: TimelineItemProps['status'];
}

export function ActivityTimeline({
  items,
  title = 'Activity timeline',
  className,
}: {
  items: ActivityTimelineEntry[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-5', className)}>
      <h3 className="mb-4 text-base font-semibold text-foreground">{title}</h3>
      <Timeline>
        {items.map((item, idx) => (
          <TimelineItem
            key={item.id}
            title={item.title}
            actor={item.actor}
            timestamp={item.timestamp}
            description={item.description}
            status={item.status}
            isLast={idx === items.length - 1}
          />
        ))}
      </Timeline>
    </Card>
  );
}

export function Milestone({
  title,
  date,
  status = 'upcoming',
  description,
  className,
}: {
  title: string;
  date: string;
  status?: 'reached' | 'current' | 'upcoming';
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3.5', className)}>
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)]',
          status === 'reached'
            ? 'bg-success-subtle text-success-subtle-foreground'
            : status === 'current'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
        )}
      >
        <Flag className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <span className="text-xs font-medium text-muted-foreground tabular-nums">{date}</span>
        </div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export interface StatusStage {
  id: string;
  label: string;
  state: 'completed' | 'current' | 'upcoming' | 'blocked';
}

export function StatusProgression({ stages, className }: { stages: StatusStage[]; className?: string }) {
  return (
    <ol aria-label="Status progression" className={cn('flex flex-wrap items-center gap-2', className)}>
      {stages.map((st, idx) => (
        <li key={st.id} className="flex items-center gap-2">
          <span
            aria-current={st.state === 'current' ? 'step' : undefined}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-sm)] border px-2.5 py-1 text-xs font-medium',
              st.state === 'completed'
                ? 'border-success/30 bg-success-subtle text-success-subtle-foreground'
                : st.state === 'current'
                  ? 'border-primary bg-primary text-primary-foreground'
                  : st.state === 'blocked'
                    ? 'border-destructive/30 bg-destructive-subtle text-destructive-subtle-foreground'
                    : 'border-border bg-muted text-muted-foreground'
            )}
          >
            <span>{idx + 1}.</span>
            <span>{st.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
