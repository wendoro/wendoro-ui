import * as React from 'react';
import {
  Camera,
  FileText,
  Filter,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getFocusableElements } from '../../../utils/focus';
import { useStableId } from '../../../hooks/use-id';
import { Button } from '../button';

/* -------------------------------------------------------------------------- */
/* BottomNavigation                                                           */
/* -------------------------------------------------------------------------- */

export interface BottomNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  'aria-label'?: string;
  fixed?: boolean;
  className?: string;
}

export function BottomNavigation({
  items,
  'aria-label': ariaLabel = 'Mobile bottom navigation',
  fixed = false,
  className,
}: BottomNavigationProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'z-30 flex w-full items-stretch justify-around border-t border-border bg-surface/95 px-1 py-1 backdrop-blur-xs',
        fixed && 'fixed inset-x-0 bottom-0',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          aria-current={item.active ? 'page' : undefined}
          onClick={item.onSelect}
          className={cn(
            'relative flex min-h-[48px] min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[var(--wdr-radius-md)] px-2 py-1.5 text-[11px] font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            item.active
              ? 'bg-primary-subtle text-primary-subtle-foreground font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            item.disabled && 'opacity-45 cursor-not-allowed'
          )}
        >
          {item.active && (
            <span
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary-active"
            />
          )}
          <span className="relative inline-flex items-center justify-center" aria-hidden="true">
            {item.icon}
            {item.badge !== undefined && (
              <span className="absolute -right-2.5 -top-1.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-destructive-foreground tabular-nums">
                {item.badge}
              </span>
            )}
          </span>
          <span className="truncate max-w-full">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* BottomSheet                                                                */
/* -------------------------------------------------------------------------- */

export type BottomSheetSnap = 'auto' | 'half' | 'full';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  snap?: BottomSheetSnap;
  footer?: React.ReactNode;
  'aria-label'?: string;
  children: React.ReactNode;
  className?: string;
}

const SNAP_CLASSES: Record<BottomSheetSnap, string> = {
  auto: 'max-h-[82vh]',
  half: 'h-[55vh]',
  full: 'h-[92vh]',
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  snap = 'auto',
  footer,
  'aria-label': ariaLabel,
  children,
  className,
}: BottomSheetProps) {
  const titleId = useStableId(undefined, 'wdr-bs-title');
  const descId = useStableId(undefined, 'wdr-bs-desc');
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const [dragOffset, setDragOffset] = React.useState(0);
  const startYRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      if (sheetRef.current) {
        const focusables = getFocusableElements(sheetRef.current);
        if (focusables.length > 0) focusables[0].focus();
        else sheetRef.current.focus();
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      setDragOffset(0);
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
        return;
      }
      if (e.key === 'Tab' && sheetRef.current) {
        const focusables = getFocusableElements(sheetRef.current);
        if (focusables.length === 0) {
          e.preventDefault();
          sheetRef.current.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (active === sheetRef.current || !sheetRef.current.contains(active)) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={!title ? ariaLabel ?? 'Bottom sheet' : ariaLabel}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={dragOffset > 0 ? { transform: `translateY(${dragOffset}px)` } : undefined}
        className={cn(
          'relative z-10 flex w-full max-w-2xl flex-col rounded-t-[var(--wdr-radius-xl)] border border-b-0 border-border bg-surface-elevated text-foreground shadow-[var(--wdr-shadow-lg)] focus:outline-none',
          SNAP_CLASSES[snap],
          className
        )}
      >
        {/* Drag handle */}
        <div
          onPointerDown={(e) => {
            startYRef.current = e.clientY;
          }}
          onPointerMove={(e) => {
            if (startYRef.current !== null) {
              const delta = Math.max(0, e.clientY - startYRef.current);
              setDragOffset(delta);
            }
          }}
          onPointerUp={() => {
            if (dragOffset > 90) {
              onOpenChange(false);
            }
            startYRef.current = null;
            setDragOffset(0);
          }}
          className="flex cursor-grab items-center justify-center py-2.5 touch-none"
        >
          <span aria-hidden="true" className="h-1.5 w-10 rounded-full bg-border" />
        </div>

        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 pb-3.5">
            <div className="space-y-0.5 min-w-0">
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
              aria-label="Close bottom sheet"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-surface px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FloatingActionButton                                                       */
/* -------------------------------------------------------------------------- */

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'inline';
  variant?: 'primary' | 'secondary' | 'destructive';
}

export function FloatingActionButton({
  icon,
  label,
  position = 'bottom-right',
  variant = 'primary',
  className,
  ...props
}: FloatingActionButtonProps) {
  const posClass =
    position === 'bottom-right'
      ? 'fixed bottom-20 right-4 z-30 lg:bottom-6 lg:right-6'
      : position === 'bottom-left'
        ? 'fixed bottom-20 left-4 z-30 lg:bottom-6 lg:left-6'
        : 'relative';

  const toneClass =
    variant === 'destructive'
      ? 'bg-destructive text-destructive-foreground hover:bg-destructive-hover'
      : variant === 'secondary'
        ? 'bg-accent text-accent-foreground hover:opacity-95'
        : 'bg-primary text-primary-foreground hover:bg-primary-hover';

  return (
    <button
      type="button"
      aria-label={props['aria-label'] ?? label ?? 'Quick action'}
      className={cn(
        'inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-full border border-border px-4 font-semibold shadow-[var(--wdr-shadow-lg)] transition-transform active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        !label && 'w-12 px-0',
        posClass,
        toneClass,
        className
      )}
      {...props}
    >
      <span aria-hidden="true">{icon}</span>
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* SwipeActionItem                                                            */
/* -------------------------------------------------------------------------- */

export interface SwipeAction {
  id: string;
  label: string;
  tone?: 'default' | 'primary' | 'destructive';
  icon?: React.ReactNode;
  onAction: () => void;
}

export interface SwipeActionItemProps {
  children: React.ReactNode;
  actions: SwipeAction[];
  className?: string;
}

export function SwipeActionItem({ children, actions, className }: SwipeActionItemProps) {
  const [revealed, setRevealed] = React.useState(false);
  const startXRef = React.useRef<number | null>(null);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--wdr-radius-md)] border border-border bg-surface',
        className
      )}
    >
      <div
        onPointerDown={(e) => {
          startXRef.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (startXRef.current !== null) {
            const deltaX = e.clientX - startXRef.current;
            if (deltaX < -36) setRevealed(true);
            else if (deltaX > 36) setRevealed(false);
          }
          startXRef.current = null;
        }}
        className="flex flex-wrap items-center justify-between gap-3 p-3.5 transition-transform"
      >
        <div className="min-w-0 flex-1">{children}</div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            aria-expanded={revealed}
            aria-label={revealed ? 'Hide quick actions' : 'Show quick actions'}
            onClick={() => setRevealed((r) => !r)}
            className="inline-flex min-h-[36px] items-center rounded-[var(--wdr-radius-sm)] border border-border bg-muted px-2.5 text-xs font-medium text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {revealed ? 'Close' : 'Actions'}
          </button>
        </div>
      </div>

      {revealed && (
        <div
          role="group"
          aria-label="Swipe actions"
          className="flex flex-wrap items-center justify-end gap-1.5 border-t border-border bg-muted/60 px-3 py-2"
        >
          {actions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                act.onAction();
                setRevealed(false);
              }}
              className={cn(
                'inline-flex min-h-[40px] items-center gap-1.5 rounded-[var(--wdr-radius-sm)] px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                act.tone === 'destructive'
                  ? 'bg-destructive text-destructive-foreground'
                  : act.tone === 'primary'
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-surface text-foreground hover:bg-muted'
              )}
            >
              {act.icon && <span aria-hidden="true">{act.icon}</span>}
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PullToRefresh                                                              */
/* -------------------------------------------------------------------------- */

export interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>;
  refreshing?: boolean;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({
  onRefresh,
  refreshing = false,
  label = 'Refresh feed',
  children,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = React.useState(0);
  const startYRef = React.useRef<number | null>(null);
  const threshold = 56;

  return (
    <div
      onPointerDown={(e) => {
        startYRef.current = e.clientY;
      }}
      onPointerMove={(e) => {
        if (startYRef.current !== null) {
          const delta = Math.max(0, Math.min(84, e.clientY - startYRef.current));
          if (delta > 12) setPullDistance(delta);
        }
      }}
      onPointerUp={() => {
        if (pullDistance >= threshold && !refreshing) {
          void onRefresh();
        }
        startYRef.current = null;
        setPullDistance(0);
      }}
      className={cn('space-y-3', className)}
    >
      <div className="flex items-center justify-between rounded-[var(--wdr-radius-md)] border border-border bg-muted/40 px-3 py-2 text-xs">
        <span className="text-muted-foreground">
          {refreshing
            ? 'Refreshing…'
            : pullDistance >= threshold
              ? 'Release to refresh'
              : 'Pull down or tap refresh'}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={refreshing}
          onClick={() => void onRefresh()}
          leftIcon={
            <RefreshCw
              className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')}
              aria-hidden="true"
            />
          }
        >
          {label}
        </Button>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* StickyActionBar                                                            */
/* -------------------------------------------------------------------------- */

export interface StickyActionBarProps {
  summary?: React.ReactNode;
  primaryAction: React.ReactNode;
  secondaryAction?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function StickyActionBar({
  summary,
  primaryAction,
  secondaryAction,
  sticky = true,
  className,
}: StickyActionBarProps) {
  return (
    <div
      role="region"
      aria-label="Sticky action bar"
      className={cn(
        'z-20 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface/95 px-4 py-3 shadow-[var(--wdr-shadow-md)] backdrop-blur-xs',
        sticky && 'sticky bottom-0',
        className
      )}
    >
      <div className="min-w-0 text-xs font-medium text-foreground">{summary}</div>
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {secondaryAction}
        {primaryAction}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MediaCaptureInput                                                          */
/* -------------------------------------------------------------------------- */

export interface MediaCaptureFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface MediaCaptureInputProps {
  files: MediaCaptureFile[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove?: (id: string) => void;
  capture?: 'user' | 'environment';
  accept?: string;
  multiple?: boolean;
  label?: string;
  className?: string;
}

export function MediaCaptureInput({
  files,
  onFilesAdd,
  onFileRemove,
  capture = 'environment',
  accept = 'image/*,application/pdf',
  multiple = true,
  label = 'Capture photo or upload document',
  className,
}: MediaCaptureInputProps) {
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className={cn('space-y-3 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-4', className)}>
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="flex flex-wrap gap-2">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture={capture}
          aria-label="Capture with camera"
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length > 0) onFilesAdd(selected);
          }}
          className="sr-only"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-label="Upload local file"
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length > 0) onFilesAdd(selected);
          }}
          className="sr-only"
        />
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="min-h-[44px]"
          leftIcon={<Camera className="h-4 w-4" />}
          onClick={() => cameraInputRef.current?.click()}
        >
          Use camera
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-[44px]"
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => fileInputRef.current?.click()}
        >
          Browse files
        </Button>
      </div>

      {files.length > 0 && (
        <ul className="space-y-2" aria-label="Attached files">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-muted/40 px-3 py-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground">{f.name}</div>
                  <div className="text-muted-foreground tabular-nums">
                    {Math.max(1, Math.round(f.size / 1024))} KB
                  </div>
                </div>
              </div>
              {onFileRemove && (
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => onFileRemove(f.id)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MobileFilterSheet                                                          */
/* -------------------------------------------------------------------------- */

export interface MobileFilterSheetProps {
  activeFilterCount?: number;
  title?: string;
  triggerLabel?: string;
  onClearAll?: () => void;
  onApply?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MobileFilterSheet({
  activeFilterCount = 0,
  title = 'Filters',
  triggerLabel = 'Filters',
  onClearAll,
  onApply,
  children,
  className,
}: MobileFilterSheetProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn('inline-block', className)}>
      <Button
        variant="outline"
        size="sm"
        className="min-h-[44px]"
        leftIcon={<Filter className="h-4 w-4" />}
        onClick={() => setOpen(true)}
      >
        <span>{triggerLabel}</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground tabular-nums">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title={title}
        snap="half"
        footer={
          <>
            {onClearAll && (
              <Button variant="outline" onClick={onClearAll}>
                Clear all
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => {
                onApply?.();
                setOpen(false);
              }}
            >
              Apply filters
            </Button>
          </>
        }
      >
        <div className="space-y-4">{children}</div>
      </BottomSheet>
    </div>
  );
}
