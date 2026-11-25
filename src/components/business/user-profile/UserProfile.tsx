import * as React from 'react';
import { Mail, MoreVertical } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { Avatar, type AvatarProps } from '../../ui/avatar';
import { Button, IconButton } from '../../ui/button';
import { DropdownMenu, type DropdownMenuItem } from '../../ui/dropdown';
import { StatusBadge, type BusinessStatus } from '../status-badge';

export interface UserProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  affiliation?: string;
  role?: string;
  email?: string;
  department?: string;
  avatarSrc?: string;
  status?: AvatarProps['status'];
  statusBadge?: BusinessStatus;
  statusLabel?: string;
  variant?: 'inline' | 'card';
  actions?: DropdownMenuItem[];
  onContact?: () => void;
  contactLabel?: string;
  contactHref?: string;
  action?: React.ReactNode;
}

export function UserProfile({
  name,
  affiliation,
  role,
  email,
  department,
  avatarSrc,
  status,
  statusBadge,
  statusLabel,
  variant = 'inline',
  actions,
  onContact,
  contactLabel = 'Contact',
  contactHref,
  action,
  className,
  ...props
}: UserProfileProps) {
  const roleLine = [role, department].filter(Boolean).join(' · ');
  const secondaryLine = roleLine || affiliation;
  const safeContactHref = contactHref ? sanitizeUrl(contactHref) : undefined;
  const hasContact = Boolean(onContact || safeContactHref);

  return (
    <div
      className={cn(
        'flex items-start justify-between gap-3',
        variant === 'card' && 'rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-3">
        <Avatar
          src={avatarSrc}
          alt={name}
          size={variant === 'card' ? 'lg' : 'md'}
          status={status}
        />
        <div className="min-w-0 space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-foreground">{name}</span>
            {statusBadge && <StatusBadge status={statusBadge} label={statusLabel} />}
          </div>
          {secondaryLine && (
            <div className="truncate text-xs text-muted-foreground">{secondaryLine}</div>
          )}
          {affiliation && roleLine && (
            <div className="truncate text-xs text-muted-foreground">{affiliation}</div>
          )}
          {email && (
            <div className="truncate text-xs text-muted-foreground">{email}</div>
          )}
          {hasContact && (
            <div className="pt-2">
              {safeContactHref ? (
                <a
                  href={safeContactHref}
                  onClick={onContact}
                  className="inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{contactLabel}</span>
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onContact}
                  leftIcon={<Mail className="h-3.5 w-3.5" />}
                >
                  {contactLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {(action || (actions && actions.length > 0)) && (
        <div className="flex shrink-0 items-center gap-1.5">
          {action}
          {actions && actions.length > 0 && (
            <DropdownMenu
              align="end"
              items={actions}
              trigger={
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label={`Actions for ${name}`}
                  icon={<MoreVertical className="h-4 w-4" />}
                />
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
