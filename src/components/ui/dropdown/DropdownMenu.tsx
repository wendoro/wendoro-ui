import * as React from 'react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

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

export function DropdownMenu({ trigger, items, align = 'end', className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const menuId = useStableId(undefined, 'wdr-menu');

  const selectableItems = React.useMemo(
    () => items.filter((item) => !item.separator && !item.disabled),
    [items]
  );

  const closeMenu = React.useCallback((restoreFocus: boolean) => {
    setOpen(false);
    setFocusedIndex(-1);
    if (restoreFocus) {
      window.setTimeout(() => {
        if (triggerRef.current?.isConnected) {
          triggerRef.current.focus();
        }
      }, 0);
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeMenu(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [closeMenu, open]);

  React.useEffect(() => {
    if (open && focusedIndex >= 0) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, open]);

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectableItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % selectableItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + selectableItems.length) % selectableItems.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(selectableItems.length - 1);
    } else if (e.key === 'Tab') {
      closeMenu(false);
    }
  };

  const openAndFocus = (index: number) => {
    setOpen(true);
    setFocusedIndex(selectableItems.length > 0 ? Math.max(0, Math.min(index, selectableItems.length - 1)) : -1);
  };

  const renderTrigger = () => {
    if (React.isValidElement(trigger)) {
      const childProps = trigger.props as {
        onClick?: (e: React.MouseEvent<HTMLElement>) => void;
        onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
        ref?: React.Ref<HTMLElement>;
      };
      const existingRef = (trigger as unknown as { ref?: React.Ref<HTMLElement> }).ref;

      return React.cloneElement(trigger as React.ReactElement<Record<string, unknown>>, {
        ref: mergeRefs(existingRef, triggerRef),
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          childProps.onClick?.(e);
          if (open) {
            closeMenu(false);
          } else {
            openAndFocus(0);
          }
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          childProps.onKeyDown?.(e);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openAndFocus(0);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            openAndFocus(selectableItems.length - 1);
          }
        },
      });
    }

    return (
      <button
        ref={triggerRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => (open ? closeMenu(false) : openAndFocus(0))}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openAndFocus(0);
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            openAndFocus(selectableItems.length - 1);
          }
        }}
        className="inline-flex cursor-pointer items-center rounded-[var(--wdr-radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {trigger}
      </button>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {renderTrigger()}

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
                ref={(el) => {
                  if (selectableIdx >= 0) {
                    itemRefs.current[selectableIdx] = el;
                  }
                }}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onMouseEnter={() => {
                  if (selectableIdx >= 0) setFocusedIndex(selectableIdx);
                }}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  closeMenu(true);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-[var(--wdr-radius-sm)] px-2.5 py-2 text-left text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:bg-muted',
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
