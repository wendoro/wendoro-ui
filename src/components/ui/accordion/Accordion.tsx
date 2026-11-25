import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

interface AccordionContextValue {
  openItems: string[];
  toggleItem: (value: string) => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
  panelId: string;
  triggerId: string;
} | null>(null);

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string[]) => void;
}

function normalizeValue(val?: string | string[]): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export function Accordion({
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = React.useState<string[]>(() => normalizeValue(defaultValue));
  const openItems = value !== undefined ? normalizeValue(value) : internalOpen;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const isCurrentlyOpen = openItems.includes(itemValue);
      let next: string[];
      if (type === 'single') {
        next = isCurrentlyOpen ? [] : [itemValue];
      } else {
        next = isCurrentlyOpen
          ? openItems.filter((v) => v !== itemValue)
          : [...openItems, itemValue];
      }
      if (value === undefined) {
        setInternalOpen(next);
      }
      onValueChange?.(next);
    },
    [onValueChange, openItems, type, value]
  );

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, rootRef }}>
      <div
        ref={rootRef}
        className={cn('divide-y divide-border rounded-[var(--wdr-radius-lg)] border border-border bg-surface', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used inside Accordion');

  const baseId = useStableId(undefined, 'wdr-acc');
  const isOpen = ctx.openItems.includes(value);

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        isOpen,
        triggerId: `${baseId}-trigger`,
        panelId: `${baseId}-panel`,
      }}
    >
      <div data-state={isOpen ? 'open' : 'closed'} className={cn('px-4', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  onClick,
  onKeyDown,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const acc = React.useContext(AccordionContext);
  const item = React.useContext(AccordionItemContext);
  if (!acc || !item) throw new Error('AccordionTrigger must be used inside AccordionItem');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !acc.rootRef.current) return;

    const triggers = Array.from(
      acc.rootRef.current.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger="true"]:not([disabled])')
    );
    if (triggers.length === 0) return;

    const currentIdx = triggers.indexOf(event.currentTarget);
    if (currentIdx < 0) return;

    let nextIdx = -1;
    if (event.key === 'ArrowDown') {
      nextIdx = (currentIdx + 1) % triggers.length;
    } else if (event.key === 'ArrowUp') {
      nextIdx = (currentIdx - 1 + triggers.length) % triggers.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = triggers.length - 1;
    }

    if (nextIdx >= 0) {
      event.preventDefault();
      triggers[nextIdx].focus();
    }
  };

  return (
    <button
      id={item.triggerId}
      type="button"
      data-accordion-trigger="true"
      aria-expanded={item.isOpen}
      aria-controls={item.panelId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          acc.toggleItem(item.value);
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-foreground/80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-small,4px)]',
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown
        aria-hidden="true"
        className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150', item.isOpen && 'rotate-180')}
      />
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const item = React.useContext(AccordionItemContext);
  if (!item) throw new Error('AccordionContent must be used inside AccordionItem');

  if (!item.isOpen) return null;

  return (
    <div
      id={item.panelId}
      role="region"
      aria-labelledby={item.triggerId}
      className={cn('pb-4 text-sm text-muted-foreground leading-relaxed', className)}
      {...props}
    >
      {children}
    </div>
  );
}
