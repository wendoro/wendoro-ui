import * as React from 'react';
import { cn } from '../../../utils/cn';
import { Avatar } from '../../ui/avatar';
import { StatusBadge, type BusinessStatus } from '../status-badge';

export interface ActivityItemProps extends React.HTMLAttributes<HTMLLIElement> {
  actor: string;
  actorSubtitle?: string;
  actorAvatar?: string;
  action: string;
  entity?: string;
  target?: string;
  source?: string;
  timestamp: string;
  dateTime?: string;
  amount?: string;
  status?: BusinessStatus;
  statusLabel?: string;
  metadata?: React.ReactNode;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
}

export function ActivityItem({
  actor,
  actorSubtitle,
  actorAvatar,
  action,
  entity,
  target,
  source,
  timestamp,
  dateTime,
  amount,
  status,
  statusLabel,
  metadata,
  detail,
  icon,
  className,
  ...props
}: ActivityItemProps) {
  const entityLabel = entity ?? target;
  const metaContent = metadata ?? detail;

  return (
    <li className={cn('group relative flex gap-3 pb-5 last:pb-0', className)} {...props}>
      <div className="relative flex flex-col items-center">
        {icon ? (
          <div
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-foreground"
          >
            {icon}
          </div>
        ) : (
          <Avatar src={actorAvatar} alt={actor} size="sm" />
        )}
        <span aria-hidden="true" className="mt-1.5 w-px flex-1 bg-border group-last:hidden" />
      </div>

      <div className="min-w-0 flex-1 space-y-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{actor}</span>{' '}
            <span className="text-muted-foreground">{action}</span>
            {entityLabel && (
              <>
                {' '}
                <span className="font-medium text-foreground">{entityLabel}</span>
              </>
            )}
          </p>
          <time
            dateTime={dateTime}
            className="text-xs text-muted-foreground whitespace-nowrap tabular-nums"
          >
            {timestamp}
          </time>
        </div>

        {(actorSubtitle || source || amount || status) && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
            {actorSubtitle && <span>{actorSubtitle}</span>}
            {actorSubtitle && source && <span aria-hidden="true">·</span>}
            {source && <span className="font-medium text-foreground">{source}</span>}
            {amount && (
              <>
                {(actorSubtitle || source) && <span aria-hidden="true">·</span>}
                <span className="font-mono font-medium text-foreground tabular-nums">{amount}</span>
              </>
            )}
            {status && <StatusBadge status={status} label={statusLabel} />}
          </div>
        )}

        {metaContent && <div className="text-xs text-muted-foreground">{metaContent}</div>}
      </div>
    </li>
  );
}
