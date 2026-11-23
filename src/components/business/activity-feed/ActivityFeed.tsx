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
}

export function ActivityFeed({
  items,
  emptyTitle = 'No recent activity',
  emptyDescription = 'Events from your connected Wendoro workspace will appear here.',
  className,
  ...props
}: ActivityFeedProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} compact className={className} />;
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      <ul className="space-y-0">
        {items.map((item) => {
          const { id, ...rest } = item;
          return <ActivityItem key={id} {...rest} />;
        })}
      </ul>
    </div>
  );
}
