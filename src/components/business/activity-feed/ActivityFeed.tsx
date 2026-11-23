import * as React from 'react';
import { cn } from '../../../utils/cn';
import { ActivityItem, type ActivityItemProps } from './ActivityItem';
import { EmptyState } from '../../ui/empty-state';

export interface ActivityFeedEntry extends Omit<ActivityItemProps, 'className'> {
  id: string;
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityFeedEntry[];
  emptyTitle?: string;
  emptyDescription?: string;
  demoLabel?: string;
  listLabel?: string;
}

export function ActivityFeed({
  items,
  emptyTitle = 'No recent activity',
  emptyDescription = 'Events from your connected Wendoro workspace will appear here.',
  demoLabel,
  listLabel = 'Activity feed',
  className,
  ...props
}: ActivityFeedProps) {
  return (
    <div className={cn('w-full space-y-3', className)} {...props}>
      {demoLabel && (
        <p className="rounded-[var(--wdr-radius-sm)] border border-border bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground">
          {demoLabel}
        </p>
      )}
      {items.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} compact />
      ) : (
        <ul aria-label={listLabel} className="space-y-0">
          {items.map((item) => {
            const { id, ...rest } = item;
            return <ActivityItem key={id} {...rest} />;
          })}
        </ul>
      )}
    </div>
  );
}
