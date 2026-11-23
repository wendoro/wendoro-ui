import * as React from 'react';
import { cn } from '../../../utils/cn';

export type SkeletonShape = 'rectangular' | 'circular' | 'text';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = 'rectangular', width, height, lines = 1, className, style, ...props }, ref) => {
    if (shape === 'text' && lines > 1) {
      return (
        <div ref={ref} aria-hidden="true" className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'h-3.5 animate-pulse rounded-[var(--wdr-radius-small,4px)] bg-muted',
                idx === lines - 1 ? 'w-3/4' : 'w-full'
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          'animate-pulse bg-muted',
          shape === 'circular' && 'rounded-full',
          shape === 'rectangular' && 'rounded-[var(--wdr-radius-md)]',
          shape === 'text' && 'h-3.5 w-full rounded-[var(--wdr-radius-small,4px)]',
          className
        )}
        style={{ width, height, ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
