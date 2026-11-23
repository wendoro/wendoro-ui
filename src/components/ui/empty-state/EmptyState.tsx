import * as React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, secondaryAction, compact = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-[var(--wdr-radius-lg)] border border-dashed border-border bg-surface text-center',
          compact ? 'px-4 py-8' : 'px-6 py-12',
          className
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--wdr-radius-md)] bg-muted text-muted-foreground"
        >
          {icon ?? <Inbox className="h-5 w-5" />}
        </div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        {(action || secondaryAction) && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
