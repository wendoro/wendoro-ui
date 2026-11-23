import * as React from 'react';
import { cn } from '@/utils/cn';
import { useStableId } from '@/hooks/use-id';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'center' | 'end';
  side?: 'bottom' | 'top';
  className?: string;
}

const alignClasses: Record<NonNullable<PopoverProps['align']>, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

export function Popover({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  align = 'start',
  side = 'bottom',
  className,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const popoverId = useStableId(undefined, 'wdr-popover');

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, setOpen]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(!isOpen);
          }
        }}
        className="inline-flex cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-md)]"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          className={cn(
            'absolute z-50 min-w-[240px] rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-4 text-foreground shadow-[var(--wdr-shadow-md)]',
            side === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
            alignClasses[align],
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
