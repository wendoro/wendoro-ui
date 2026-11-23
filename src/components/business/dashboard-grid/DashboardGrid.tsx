import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'sm' | 'md' | 'lg';
}

const gapMap: Record<NonNullable<DashboardGridProps['gap']>, string> = {
  sm: 'gap-3',
  md: 'gap-5',
  lg: 'gap-6',
};

export function DashboardGrid({ gap = 'md', className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12', gapMap[gap], className)}
      {...props}
    />
  );
}

export type DashboardSpan = 3 | 4 | 6 | 8 | 12;

export interface DashboardGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: DashboardSpan;
}

const spanClasses: Record<DashboardSpan, string> = {
  3: 'md:col-span-3 lg:col-span-3',
  4: 'md:col-span-3 lg:col-span-4',
  6: 'md:col-span-6 lg:col-span-6',
  8: 'md:col-span-6 lg:col-span-8',
  12: 'md:col-span-6 lg:col-span-12',
};

export function DashboardGridItem({ span = 4, className, ...props }: DashboardGridItemProps) {
  return <div className={cn(spanClasses[span], className)} {...props} />;
}
