import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useStableId } from '@/hooks/use-id';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: DrawerPlacement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const placementClasses: Record<DrawerPlacement, string> = {
  right: 'inset-y-0 right-0 h-full w-full max-w-md border-l',
  left: 'inset-y-0 left-0 h-full w-full max-w-md border-r',
  top: 'inset-x-0 top-0 w-full max-h-[85vh] border-b',
  bottom: 'inset-x-0 bottom-0 w-full max-h-[85vh] border-t',
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute('disabled')
  );
}

export function Drawer({
  open,
  onOpenChange,
  placement = 'right',
  title,
  description,
  children,
  className,
}: DrawerProps) {
  const titleId = useStableId(undefined, 'wdr-drawer-title');
  const descId = useStableId(undefined, 'wdr-drawer-desc');
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      if (drawerRef.current) {
        const focusables = getFocusableElements(drawerRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          drawerRef.current.focus();
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      previousFocusRef.current?.focus();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = getFocusableElements(drawerRef.current);
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'fixed z-10 flex flex-col border-border bg-surface-elevated text-foreground shadow-[var(--wdr-shadow-lg)] focus:outline-none',
          placementClasses[placement],
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="space-y-1">
            {title && (
              <h2 id={titleId} className="text-base font-semibold leading-snug">
                {title}
              </h2>
            )}
            {description && (
              <p id={descId} className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
