import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useStableId } from '../../../hooks/use-id';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  enableGlobalShortcut?: boolean;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
    if (el.hasAttribute('disabled') || el.closest('[hidden]')) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = 'Search commands, pages, or actions…',
  emptyMessage = 'No matching commands found.',
  enableGlobalShortcut = false,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const listboxId = useStableId(undefined, 'wdr-cmd-list');

  React.useEffect(() => {
    if (!enableGlobalShortcut) return;
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, [enableGlobalShortcut, onOpenChange, open]);

  React.useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.clearTimeout(timer);
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const haystack = [item.label, item.description ?? '', item.group ?? '', ...(item.keywords ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const groupName = item.group ?? 'Actions';
      const list = map.get(groupName) ?? [];
      list.push(item);
      map.set(groupName, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  React.useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, filtered.length]);

  const activeItem = filtered[activeIndex];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filtered.length > 0) setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filtered.length > 0) setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Home') {
      if (filtered.length > 0) {
        e.preventDefault();
        setActiveIndex(0);
      }
    } else if (e.key === 'End') {
      if (filtered.length > 0) {
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filtered[activeIndex];
      if (target) {
        target.onSelect();
        onOpenChange(false);
      }
    } else if (e.key === 'Tab' && dialogRef.current) {
      const focusables = getFocusableElements(dialogRef.current);
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleKeyDown}
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated text-foreground shadow-[var(--wdr-shadow-lg)]"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeItem ? `${listboxId}-opt-${activeItem.id}` : undefined}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={placeholder}
            aria-label="Filter commands"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close command palette"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div id={listboxId} className="max-h-80 overflow-y-auto p-2" role="listbox" aria-label="Commands">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">{emptyMessage}</div>
          ) : (
            grouped.map(([groupName, groupItems]) => (
              <div key={groupName} className="mb-2 last:mb-0">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground">
                  {groupName}
                </div>
                <div className="space-y-0.5">
                  {groupItems.map((item) => {
                    const flatIdx = filtered.findIndex((f) => f.id === item.id);
                    const isActive = flatIdx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        id={`${listboxId}-opt-${item.id}`}
                        type="button"
                        role="option"
                        tabIndex={-1}
                        aria-selected={isActive}
                        onMouseEnter={() => setActiveIndex(flatIdx)}
                        onClick={() => {
                          item.onSelect();
                          onOpenChange(false);
                        }}
                        className={cn(
                          'flex w-full items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] px-3 py-2 text-left text-sm transition-colors',
                          isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          {item.icon && (
                            <span aria-hidden="true" className="inline-flex shrink-0">
                              {item.icon}
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="truncate font-medium">{item.label}</div>
                            {item.description && (
                              <div
                                className={cn(
                                  'truncate text-xs',
                                  isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                                )}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                        {item.shortcut && (
                          <kbd
                            className={cn(
                              'shrink-0 rounded px-1.5 py-0.5 font-mono text-[11px]',
                              isActive
                                ? 'bg-primary-foreground/15 text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {item.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
