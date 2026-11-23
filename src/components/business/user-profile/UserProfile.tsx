import * as React from 'react';
import { cn } from '@/utils/cn';
import { Avatar, type AvatarProps } from '@/components/ui/avatar';

export interface UserProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  email?: string;
  department?: string;
  avatarSrc?: string;
  status?: AvatarProps['status'];
  variant?: 'inline' | 'card';
  action?: React.ReactNode;
}

export function UserProfile({
  name,
  role,
  email,
  department,
  avatarSrc,
  status,
  variant = 'inline',
  action,
  className,
  ...props
}: UserProfileProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3',
        variant === 'card' && 'rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          src={avatarSrc}
          alt={name}
          size={variant === 'card' ? 'lg' : 'md'}
          status={status}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">{name}</div>
          {(role || department) && (
            <div className="truncate text-xs text-muted-foreground">
              {[role, department].filter(Boolean).join(' · ')}
            </div>
          )}
          {email && <div className="truncate text-xs text-muted-foreground">{email}</div>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
