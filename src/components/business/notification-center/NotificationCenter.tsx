import * as React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { EmptyState } from '../../ui/empty-state';
import { Notification, type NotificationTone } from '../../ui/notification';
import { Popover } from '../../ui/popover';

export interface NotificationCenterItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  source?: string;
  tone?: NotificationTone;
  unread: boolean;
}

export interface NotificationCenterProps {
  items: NotificationCenterItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function NotificationCenter({
  items,
  onMarkRead,
  onMarkAllRead,
  onDismiss,
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');
  const unreadCount = items.filter((i) => i.unread).length;
  const visibleItems = filter === 'unread' ? items.filter((i) => i.unread) : items;

  return (
    <Popover
      align="end"
      className={cn('w-[380px] max-w-[calc(100vw-2rem)] p-0', className)}
      trigger={
        <Button
          variant="outline"
          size="md"
          aria-label={`Notifications, ${unreadCount} unread`}
          leftIcon={<Bell className="h-4 w-4" />}
        >
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground tabular-nums">
              {unreadCount}
            </span>
          )}
        </Button>
      }
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
          <p className="text-xs text-muted-foreground tabular-nums">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && onMarkAllRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
          >
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1 border-b border-border px-4 py-2 bg-muted/40">
        <button
          type="button"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
          className={cn(
            'rounded-[var(--wdr-radius-small,4px)] px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            filter === 'all' ? 'bg-surface text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          All ({items.length})
        </button>
        <button
          type="button"
          aria-pressed={filter === 'unread'}
          onClick={() => setFilter('unread')}
          className={cn(
            'rounded-[var(--wdr-radius-small,4px)] px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            filter === 'unread' ? 'bg-surface text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="max-h-96 space-y-2 overflow-y-auto p-3">
        {visibleItems.length === 0 ? (
          <EmptyState
            compact
            title={filter === 'unread' ? 'All caught up' : 'No notifications'}
            description={
              filter === 'unread'
                ? 'You have no unread alerts across Wendoro apps.'
                : 'Workspace alerts and updates will appear here.'
            }
          />
        ) : (
          visibleItems.map((item) => (
            <Notification
              key={item.id}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              source={item.source}
              tone={item.tone}
              unread={item.unread}
              onMarkRead={onMarkRead ? () => onMarkRead(item.id) : undefined}
              onDismiss={onDismiss ? () => onDismiss(item.id) : undefined}
            />
          ))
        )}
      </div>
    </Popover>
  );
}
