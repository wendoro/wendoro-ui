import * as React from 'react';
import { cn } from '@/utils/cn';
import { useStableId } from '@/hooks/use-id';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  separator?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownMenu({ trigger, items, align = 'end', className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuId = useStableId(undefined, 'wdr-menu');

  const selectableItems = React.useMemo(
    () => items.filter((item) => !item.separator && !item.disabled),
    [items]
  );

  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectableItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % selectableItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + selectableItems.length) % selectableItems.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = selectableItems[focusedIndex];
      if (target) {
        target.onSelect?.();
        setOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          setOpen((prev) => !prev);
          setFocusedIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
            setFocusedIndex(0);
          }
        }}
        className="inline-flex cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[var(--wdr-radius-md)]"
      >
        {trigger}
      </div>

      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={handleMenuKeyDown}
          className={cn(
            'absolute z-50 mt-1.5 min-w-[200px] rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-md)]',
            align === 'end' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => {
            if (item.separator) {
              return <div key={item.id} role="separator" className="my-1 h-px bg-border" />;
            }

            const selectableIdx = selectableItems.findIndex((s) => s.id === item.id);
            const isHighlighted = selectableIdx >= 0 && selectableIdx === focusedIndex;

            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onMouseEnter={() => {
                  if (selectableIdx >= 0) setFocusedIndex(selectableIdx);
                }}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-[var(--wdr-radius-small,4px)] px-2.5 py-2 text-left text-sm transition-colors',
                  'focus-visible:outline-none',
                  item.disabled && 'cursor-not-allowed opacity-45',
                  isHighlighted && 'bg-muted',
                  item.destructive
                    ? 'text-destructive hover:bg-destructive-subtle'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {item.icon && (
                    <span aria-hidden="true" className="inline-flex shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </span>
                {item.shortcut && (
                  <kbd className="font-mono text-[11px] text-muted-foreground">{item.shortcut}</kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
