import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

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

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}

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
  const triggerRef = React.useRef<HTMLElement>(null);
  const popoverId = useStableId(undefined, 'wdr-popover');

  const setOpen = React.useCallback(
    (next: boolean, restoreFocus = false) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next && restoreFocus) {
        window.setTimeout(() => {
          if (triggerRef.current?.isConnected) {
            triggerRef.current.focus();
          }
        }, 0);
      }
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
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false, true);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, setOpen]);

  const renderTrigger = () => {
    if (React.isValidElement(trigger)) {
      const childProps = trigger.props as {
        onClick?: (e: React.MouseEvent<HTMLElement>) => void;
      };
      const existingRef = (trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref;

      return React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        ref: mergeRefs(existingRef, triggerRef),
        'aria-haspopup': 'dialog',
        'aria-expanded': isOpen,
        'aria-controls': isOpen ? popoverId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(e);
          setOpen(!isOpen);
        },
      });
    }

    return (
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        onClick={() => setOpen(!isOpen)}
        className="inline-flex cursor-pointer items-center rounded-[var(--wdr-radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger}
      </button>
    );
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {renderTrigger()}

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
