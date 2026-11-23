import * as React from 'react';
import { cn } from '@/utils/cn';
import { Avatar, type AvatarSize } from './Avatar';

export interface AvatarGroupItem {
  id: string;
  src?: string;
  alt: string;
  fallback?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  max?: number;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-xs',
  lg: 'h-12 w-12 text-sm',
  xl: 'h-16 w-16 text-base',
};

export function AvatarGroup({ items, max = 4, size = 'md', className, ...props }: AvatarGroupProps) {
  const visible = items.slice(0, max);
  const overflowCount = Math.max(0, items.length - max);

  return (
    <div
      role="group"
      aria-label={`${items.length} team members`}
      className={cn('flex items-center -space-x-2.5', className)}
      {...props}
    >
      {visible.map((item) => (
        <Avatar
          key={item.id}
          src={item.src}
          alt={item.alt}
          fallback={item.fallback}
          size={size}
          className="ring-2 ring-background rounded-full"
        />
      ))}
      {overflowCount > 0 && (
        <span
          aria-label={`${overflowCount} more members`}
          className={cn(
            'inline-flex items-center justify-center rounded-full border border-border bg-secondary font-semibold text-secondary-foreground ring-2 ring-background tabular-nums',
            sizeClasses[size]
          )}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}
