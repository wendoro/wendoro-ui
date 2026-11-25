import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export type TabsVariant = 'line' | 'segment';

interface TabsContextValue {
  activeValue: string;
  onSelect: (value: string) => void;
  variant: TabsVariant;
  baseId: string;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
}

export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  variant = 'line',
  className,
  children,
  ...props
}: TabsProps) {
  const baseId = useStableId(undefined, 'wdr-tabs');
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;

  const onSelect = React.useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, value]
  );

  return (
    <TabsContext.Provider value={{ activeValue, onSelect, variant, baseId }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  const ctx = React.useContext(TabsContext);
  const listRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;
    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((t) => t === document.activeElement);
    let nextIndex = -1;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex >= 0) {
      event.preventDefault();
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    }
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex max-w-full items-center overflow-x-auto',
        ctx?.variant === 'segment'
          ? 'gap-1 rounded-[var(--wdr-radius-md)] bg-muted p-1'
          : 'w-full gap-6 border-b border-border',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  disabled = false,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsTrigger must be used inside Tabs');

  const isSelected = ctx.activeValue === value;
  const tabId = `${ctx.baseId}-tab-${value}`;
  const panelId = `${ctx.baseId}-panel-${value}`;

  return (
    <button
      id={tabId}
      type="button"
      role="tab"
      aria-selected={isSelected}
      aria-controls={panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.onSelect(value)}
      className={cn(
        'inline-flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-45',
        ctx.variant === 'segment'
          ? cn(
              'rounded-[var(--wdr-radius-small,4px)] px-3 py-1.5',
              isSelected
                ? 'bg-surface text-foreground shadow-[var(--wdr-shadow-sm)]'
                : 'text-muted-foreground hover:text-foreground'
            )
          : cn(
              '-mb-px border-b-2 pb-3 pt-1',
              isSelected
                ? 'border-primary text-foreground font-semibold'
                : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
            ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('TabsContent must be used inside Tabs');

  const isSelected = ctx.activeValue === value;
  if (!isSelected) return null;

  return (
    <div
      id={`${ctx.baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('pt-4 focus:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
