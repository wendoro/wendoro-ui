import * as React from 'react';
import { cn } from '@/utils/cn';
import { Avatar } from '@/components/ui/avatar';

export interface ActivityItemProps extends React.HTMLAttributes<HTMLLIElement> {
  actor: string;
  actorAvatar?: string;
  action: string;
  target?: string;
  timestamp: string;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
}

export function ActivityItem({
  actor,
  actorAvatar,
  action,
  target,
  timestamp,
  detail,
  icon,
  className,
  ...props
}: ActivityItemProps) {
  return (
    <li className={cn('relative flex gap-3 pb-5 last:pb-0', className)} {...props}>
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
        <span aria-hidden="true" className="mt-1.5 w-px flex-1 bg-border" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{actor}</span>{' '}
            <span className="text-muted-foreground">{action}</span>
            {target && (
              <>
                {' '}
                <span className="font-medium text-foreground">{target}</span>
              </>
            )}
          </p>
          <time className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
            {timestamp}
          </time>
        </div>
        {detail && <div className="mt-1.5 text-xs text-muted-foreground">{detail}</div>}
      </div>
    </li>
  );
}
