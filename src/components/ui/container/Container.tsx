import * as React from 'react';
import { cn } from '@/utils/cn';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padded?: boolean;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', padded = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full', padded && 'px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';
