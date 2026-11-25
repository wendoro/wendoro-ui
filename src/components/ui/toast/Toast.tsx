import * as React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type ToastVariant = 'default' | 'success' | 'warning' | 'destructive';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastContextValue {
  toasts: ToastItem[];
  toast: (item: Omit<ToastItem, 'id'>) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-surface-elevated border-border text-foreground',
  success: 'bg-surface-elevated border-success/40 text-foreground',
  warning: 'bg-surface-elevated border-warning/45 text-foreground',
  destructive: 'bg-destructive text-destructive-foreground border-destructive',
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4 text-foreground shrink-0" />,
  success: <CheckCircle2 className="h-4 w-4 text-success shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning shrink-0" />,
  destructive: <AlertCircle className="h-4 w-4 text-destructive-foreground shrink-0" />,
};

export interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const counterRef = React.useRef(0);
  const timersRef = React.useRef<Map<string, number>>(new Map());
  const safeMaxToasts = Math.max(1, maxToasts);

  const clearTimer = React.useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer !== undefined && typeof window !== 'undefined') {
      window.clearTimeout(timer);
    }
    timersRef.current.delete(id);
  }, []);

  React.useEffect(() => {
    const activeTimers = timersRef.current;
    return () => {
      if (typeof window !== 'undefined') {
        activeTimers.forEach((timer) => window.clearTimeout(timer));
      }
      activeTimers.clear();
    };
  }, []);

  const dismiss = React.useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((item) => item.id !== id));
    },
    [clearTimer]
  );

  const dismissAll = React.useCallback(() => {
    if (typeof window !== 'undefined') {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    }
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const toast = React.useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      counterRef.current += 1;
      const id = `wdr-toast-${counterRef.current}`;
      const duration = item.duration ?? 5000;

      setToasts((prev) => {
        const next = [{ ...item, id }, ...prev];
        if (next.length > safeMaxToasts) {
          for (const evicted of next.slice(safeMaxToasts)) {
            clearTimer(evicted.id);
          }
          return next.slice(0, safeMaxToasts);
        }
        return next;
      });

      if (duration > 0 && typeof window !== 'undefined') {
        const timerId = window.setTimeout(() => {
          dismiss(id);
        }, duration);
        timersRef.current.set(id, timerId);
      }
      return id;
    },
    [clearTimer, dismiss, safeMaxToasts]
  );

  const value = React.useMemo<ToastContextValue>(
    () => ({ toasts, toast, dismiss, dismissAll }),
    [toasts, toast, dismiss, dismissAll]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-label="Notifications"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2.5 p-2 sm:p-0"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export interface ToastCardProps {
  item: ToastItem;
  onDismiss: () => void;
}

export function ToastCard({ item, onDismiss }: ToastCardProps) {
  const variant = item.variant ?? 'default';
  const liveMode = variant === 'destructive' ? 'assertive' : 'polite';

  return (
    <div
      role={variant === 'destructive' ? 'alert' : 'status'}
      aria-live={liveMode}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-[var(--wdr-radius-lg)] border p-4 shadow-[var(--wdr-shadow-lg)]',
        variantClasses[variant]
      )}
    >
      <span aria-hidden="true" className="mt-0.5 shrink-0">
        {variantIcons[variant]}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="text-sm font-semibold leading-snug">{item.title}</div>
        {item.description && (
          <p
            className={cn(
              'text-xs leading-relaxed',
              variant === 'destructive' ? 'text-destructive-foreground' : 'text-muted-foreground'
            )}
          >
            {item.description}
          </p>
        )}
        {item.action && (
          <div className="pt-1.5">
            <button
              type="button"
              onClick={item.action.onClick}
              className="text-xs font-semibold underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item.action.label}
            </button>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close notification"
        className={cn(
          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          variant === 'destructive'
            ? 'text-destructive-foreground hover:opacity-85'
            : 'opacity-70 hover:opacity-100'
        )}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
