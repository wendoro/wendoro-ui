import * as React from 'react';
import { cn } from '@/utils/cn';

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;
export type GridGap = 2 | 3 | 4 | 6 | 8;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridColumns;
  gap?: GridGap;
}

const colClasses: Record<GridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-12',
};

const gapClasses: Record<GridGap, string> = {
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 3, gap = 6, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid', colClasses[cols], gapClasses[gap], className)}
        {...props}
      />
    );
  }
);

Grid.displayName = 'Grid';
