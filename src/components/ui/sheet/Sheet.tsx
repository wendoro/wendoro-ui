import * as React from 'react';
import { cn } from '@/utils/cn';
import { Drawer, type DrawerPlacement } from '../drawer';

export type SheetSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: Extract<DrawerPlacement, 'left' | 'right' | 'bottom'>;
  size?: SheetSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const horizontalSizes: Record<SheetSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
  xl: 'max-w-3xl',
};

export function Sheet({
  open,
  onOpenChange,
  side = 'right',
  size = 'md',
  title,
  description,
  footer,
  children,
  className,
}: SheetProps) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement={side}
      title={title}
      description={description}
      className={cn(side !== 'bottom' && horizontalSizes[size], className)}
    >
      <div className="flex h-full flex-col justify-between gap-6">
        <div>{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2.5 border-t border-border pt-4">
            {footer}
          </div>
        )}
      </div>
    </Drawer>
  );
}
