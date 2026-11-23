import * as React from 'react';
import { cn } from '@/utils/cn';
import { ActivityItem, type ActivityItemProps } from './ActivityItem';
import { EmptyState } from '@/components/ui/empty-state';

export interface ActivityFeedEntry extends Omit<ActivityItemProps, 'className'> {
  id: string;
}

export interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ActivityFeedEntry[];
  emptyTitle?: string;
  emptyDescription?: string;
  demoLabel?: string;
}

export function ActivityFeed({
  items,
  emptyTitle = 'No recent activity',
  emptyDescription = 'Events from your connected Wendoro workspace will appear here.',
  demoLabel,
  className,
  ...props
}: ActivityFeedProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} compact className={className} />;
  }

  return (
    <div className={cn('w-full space-y-3', className)} {...props}>
      {demoLabel && (
        <p className="rounded-[var(--wdr-radius-small,4px)] border border-border bg-muted/60 px-2.5 py-1.5 text-xs text-muted-foreground">
          {demoLabel}
        </p>
      )}
      <ul className="space-y-0">
        {items.map((item) => {
          const { id, ...rest } = item;
          return <ActivityItem key={id} {...rest} />;
        })}
      </ul>
    </div>
  );
}
