import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getFocusableElements } from '../../../utils/focus';
import { useStableId } from '../../../hooks/use-id';

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  'aria-label'?: string;
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  'aria-label': ariaLabel,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  children,
  className,
}: DialogProps) {
  const titleId = useStableId(undefined, 'wdr-dialog-title');
  const descId = useStableId(undefined, 'wdr-dialog-desc');
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      if (dialogRef.current) {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length > 0) {
          focusables[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key === 'Tab' && dialogRef.current) {
        const focusables = getFocusableElements(dialogRef.current);
        if (focusables.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (active === dialogRef.current || !dialogRef.current.contains(active)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={() => closeOnOverlayClick && onOpenChange(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={!title ? ariaLabel ?? 'Dialog' : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-6 text-foreground shadow-[var(--wdr-shadow-lg)]',
          'focus:outline-none',
          sizeClasses[size],
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 pb-4">
            <div className="space-y-1">
              {title && (
                <h2 id={titleId} className="text-lg font-semibold leading-snug tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close dialog"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-6 flex flex-wrap items-center justify-end gap-2.5 pt-2', className)}
      {...props}
    />
  );
}
