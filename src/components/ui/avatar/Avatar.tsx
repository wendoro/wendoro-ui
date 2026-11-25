import * as React from 'react';
import { cn } from '../../../utils/cn';
import { sanitizeImageUrl } from '../../../utils/url';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: AvatarSize;
  status?: 'online' | 'away' | 'busy' | 'offline';
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const statusClasses: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-destructive',
  offline: 'bg-muted-foreground',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, fallback, size = 'md', status, className, ...props }, ref) => {
    const safeSrc = sanitizeImageUrl(src);
    const [imgError, setImgError] = React.useState(false);

    React.useEffect(() => {
      setImgError(false);
    }, [safeSrc]);

    const showImage = Boolean(safeSrc && !imgError);
    const initials = fallback ?? getInitials(alt);

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-full border border-border bg-muted font-semibold text-foreground select-none',
            sizeClasses[size]
          )}
        >
          {showImage ? (
            <img
              src={safeSrc}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-label={alt}>{initials}</span>
          )}
        </div>
        {status && (
          <span
            role="img"
            aria-label={`Status: ${status}`}
            title={status}
            className={cn(
              'absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-surface',
              statusClasses[status]
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
