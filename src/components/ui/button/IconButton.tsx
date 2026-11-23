import * as React from 'react';
import { cn } from '@/utils/cn';
import { Button, type ButtonVariant } from './Button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  'aria-label': string;
  icon: React.ReactNode;
  variant?: Exclude<ButtonVariant, 'link'>;
  size?: IconButtonSize;
  loading?: boolean;
}

const iconSizeMap: Record<IconButtonSize, string> = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-11 w-11',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, variant = 'outline', size = 'md', loading = false, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        loading={loading}
        className={cn(iconSizeMap[size], className)}
        {...props}
      >
        <span aria-hidden="true" className="inline-flex items-center justify-center">
          {icon}
        </span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';
