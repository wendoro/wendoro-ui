import * as React from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../button';
import { Spinner } from '../spinner';

/* -------------------------------------------------------------------------- */
/* ScrollArea (Native-compatible custom scrollbar, snap & scroll indicators)  */
/* -------------------------------------------------------------------------- */

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  scrollbarVariant?: 'default' | 'thin' | 'native';
  snap?: 'none' | 'x' | 'y' | 'both';
  showScrollShadows?: boolean;
  maxHeight?: number | string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      orientation = 'vertical',
      scrollbarVariant = 'default',
      snap = 'none',
      showScrollShadows = true,
      maxHeight,
      className,
      style,
      children,
      onScroll,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLDivElement | null>(null);
    const [canScrollTop, setCanScrollTop] = React.useState(false);
    const [canScrollBottom, setCanScrollBottom] = React.useState(false);

    const setMergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref]
    );

    const syncShadows = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !showScrollShadows) return;
      setCanScrollTop(el.scrollTop > 2);
      setCanScrollBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 2);
    }, [showScrollShadows]);

    React.useEffect(() => {
      syncShadows();
    }, [syncShadows, children]);

    const overflowClass =
      orientation === 'horizontal'
        ? 'overflow-x-auto overflow-y-hidden'
        : orientation === 'both'
          ? 'overflow-auto'
          : 'overflow-y-auto overflow-x-hidden';

    const snapClass =
      snap === 'x'
        ? 'snap-x snap-mandatory'
        : snap === 'y'
          ? 'snap-y snap-mandatory'
          : snap === 'both'
            ? 'snap-both snap-mandatory'
            : undefined;

    const scrollbarClass =
      scrollbarVariant === 'thin'
        ? 'wdr-scrollbar-thin'
        : scrollbarVariant === 'default'
          ? 'wdr-scrollbar'
          : undefined;

    return (
      <div className="relative">
        {showScrollShadows && canScrollTop && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-gradient-to-b from-background/80 to-transparent"
          />
        )}
        <div
          ref={setMergedRef}
          tabIndex={0}
          onScroll={(e) => {
            syncShadows();
            onScroll?.(e);
          }}
          style={{
            maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
            ...style,
          }}
          className={cn(
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            overflowClass,
            snapClass,
            scrollbarClass,
            className
          )}
          {...props}
        >
          {children}
        </div>
        {showScrollShadows && canScrollBottom && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-gradient-to-t from-background/80 to-transparent"
          />
        )}
      </div>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

/* -------------------------------------------------------------------------- */
/* ScrollProgressIndicator                                                    */
/* -------------------------------------------------------------------------- */

export interface ScrollProgressIndicatorProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  label?: string;
  className?: string;
}

export function ScrollProgressIndicator({
  targetRef,
  label = 'Reading scroll progress',
  className,
}: ScrollProgressIndicatorProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const el = targetRef?.current;

    const update = () => {
      if (el) {
        const scrollable = el.scrollHeight - el.clientHeight;
        setProgress(scrollable > 0 ? Math.min(100, Math.round((el.scrollTop / scrollable) * 100)) : 0);
      } else {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        setProgress(scrollable > 0 ? Math.min(100, Math.round((window.scrollY / scrollable) * 100)) : 0);
      }
    };

    update();
    const target: EventTarget = el ?? window;
    target.addEventListener('scroll', update, { passive: true });
    return () => target.removeEventListener('scroll', update);
  }, [targetRef]);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      className={cn('h-1 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div
        className="h-full bg-primary transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ScrollToTopButton                                                          */
/* -------------------------------------------------------------------------- */

export function ScrollToTopButton({
  targetRef,
  threshold = 180,
  alwaysVisible = false,
  label = 'Back to top',
  className,
}: {
  targetRef?: React.RefObject<HTMLElement | null>;
  threshold?: number;
  alwaysVisible?: boolean;
  label?: string;
  className?: string;
}) {
  const [visible, setVisible] = React.useState(alwaysVisible);

  React.useEffect(() => {
    if (alwaysVisible || typeof window === 'undefined') return undefined;
    const el = targetRef?.current;
    const check = () => {
      const top = el ? el.scrollTop : window.scrollY;
      setVisible(top >= threshold);
    };
    check();
    const target: EventTarget = el ?? window;
    target.addEventListener('scroll', check, { passive: true });
    return () => target.removeEventListener('scroll', check);
  }, [alwaysVisible, targetRef, threshold]);

  if (!visible) return null;

  const scrollTop = () => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const behavior: ScrollBehavior = prefersReduced ? 'auto' : 'smooth';
    if (targetRef?.current) {
      targetRef.current.scrollTo({ top: 0, behavior });
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={scrollTop}
      aria-label={label}
      leftIcon={<ArrowUp className="h-3.5 w-3.5" />}
      className={cn('shadow-[var(--wdr-shadow-md)]', className)}
    >
      {label}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* InfiniteScrollContainer                                                    */
/* -------------------------------------------------------------------------- */

export interface InfiniteScrollContainerProps {
  hasMore: boolean;
  loading?: boolean;
  onLoadMore: () => void;
  loadMoreLabel?: string;
  endMessage?: string;
  children: React.ReactNode;
  className?: string;
}

export function InfiniteScrollContainer({
  hasMore,
  loading = false,
  onLoadMore,
  loadMoreLabel = 'Load more items',
  endMessage = 'All records loaded.',
  children,
  className,
}: InfiniteScrollContainerProps) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hasMore || loading || typeof IntersectionObserver === 'undefined') return undefined;
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      { rootMargin: '120px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div className={cn('space-y-3', className)}>
      {children}
      <div ref={sentinelRef} className="flex flex-col items-center justify-center py-2">
        {loading ? (
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground" role="status">
            <Spinner size="xs" />
            <span>Loading more…</span>
          </div>
        ) : hasMore ? (
          <Button variant="outline" size="sm" onClick={onLoadMore}>
            {loadMoreLabel}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">{endMessage}</span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* VirtualizedList (Reusable Windowed List for Large Datasets)                */
/* -------------------------------------------------------------------------- */

export interface VirtualizedListProps<T> {
  items: T[];
  itemHeight?: number;
  viewportHeight?: number;
  overscan?: number;
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  'aria-label'?: string;
  className?: string;
}

export function VirtualizedList<T>({
  items,
  itemHeight = 48,
  viewportHeight = 320,
  overscan = 3,
  getKey,
  renderItem,
  'aria-label': ariaLabel = 'Virtualized list',
  className,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(viewportHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const topSpacer = startIndex * itemHeight;
  const bottomSpacer = Math.max(0, (items.length - endIndex) * itemHeight);
  const visibleSlice = items.slice(startIndex, endIndex);

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      tabIndex={0}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      style={{ height: `${viewportHeight}px` }}
      className={cn(
        'wdr-scrollbar overflow-y-auto rounded-[var(--wdr-radius-lg)] border border-border bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
    >
      <div style={{ paddingTop: `${topSpacer}px`, paddingBottom: `${bottomSpacer}px` }}>
        {visibleSlice.map((item, idx) => {
          const absoluteIdx = startIndex + idx;
          return (
            <div
              key={getKey(item, absoluteIdx)}
              role="listitem"
              style={{ minHeight: `${itemHeight}px` }}
              className="border-b border-border last:border-b-0"
            >
              {renderItem(item, absoluteIdx)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
