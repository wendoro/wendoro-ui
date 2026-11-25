import * as React from 'react';
import { ChevronDown, Clock, Search, Star, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { Card } from '../card';

export function KeyboardShortcutHint({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        'inline-flex items-center gap-0.5 rounded-[var(--wdr-radius-sm)] border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground',
        className
      )}
    >
      {keys.join('+')}
    </kbd>
  );
}

export interface MegaMenuSection {
  id: string;
  label: string;
  groups: Array<{
    title: string;
    links: Array<{ id: string; label: string; description?: string; href?: string; onSelect?: () => void }>;
  }>;
}

export function MegaMenu({
  sections,
  className,
}: {
  sections: MegaMenuSection[];
  className?: string;
}) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const activeSection = sections.find((s) => s.id === openId);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <nav aria-label="Mega menu navigation" className="flex flex-wrap items-center gap-1">
        {sections.map((sec) => {
          const isOpen = openId === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : sec.id)}
              className={cn(
                'inline-flex items-center gap-1 rounded-[var(--wdr-radius-md)] px-3 py-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isOpen ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
              )}
            >
              <span>{sec.label}</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
            </button>
          );
        })}
      </nav>

      {activeSection && (
        <div
          role="region"
          aria-label={`${activeSection.label} panel`}
          className="absolute left-0 top-full z-40 mt-2 w-[min(90vw,560px)] rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-4 shadow-[var(--wdr-shadow-lg)]"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {activeSection.groups.map((grp) => (
              <div key={grp.title} className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">{grp.title}</div>
                <ul className="space-y-1">
                  {grp.links.map((lnk) => {
                    const safeHref = lnk.href ? sanitizeUrl(lnk.href) : undefined;
                    if (safeHref) {
                      return (
                        <li key={lnk.id}>
                          <a
                            href={safeHref}
                            onClick={() => {
                              lnk.onSelect?.();
                              setOpenId(null);
                            }}
                            className="block rounded-[var(--wdr-radius-sm)] p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <div className="text-sm font-medium text-foreground">{lnk.label}</div>
                            {lnk.description && <div className="text-xs text-muted-foreground">{lnk.description}</div>}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={lnk.id}>
                        <button
                          type="button"
                          onClick={() => {
                            lnk.onSelect?.();
                            setOpenId(null);
                          }}
                          className="block w-full rounded-[var(--wdr-radius-sm)] p-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <div className="text-sm font-medium text-foreground">{lnk.label}</div>
                          {lnk.description && <div className="text-xs text-muted-foreground">{lnk.description}</div>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export interface ContextMenuItem {
  id: string;
  label: string;
  shortcut?: string;
  destructive?: boolean;
  onSelect: () => void;
}

export function ContextMenu({
  items,
  children,
  className,
}: {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      tabIndex={0}
      aria-label="Context actions target"
      onContextMenu={(e) => {
        e.preventDefault();
        setOpen(true);
      }}
      onKeyDown={(e) => {
        if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
          e.preventDefault();
          setOpen((o) => !o);
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      }}
      className={cn('relative inline-block', className)}
    >
      {children}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-1.5 min-w-[180px] rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-lg)]"
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className={cn(
                'flex w-full items-center justify-between gap-4 rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs font-medium hover:bg-muted',
                item.destructive ? 'text-destructive' : 'text-foreground'
              )}
            >
              <span>{item.label}</span>
              {item.shortcut && <kbd className="font-mono text-[10px] text-muted-foreground">{item.shortcut}</kbd>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface NavigationRailItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onSelect?: () => void;
}

export function NavigationRail({
  items,
  className,
}: {
  items: NavigationRailItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Navigation rail"
      className={cn(
        'flex w-16 flex-col items-center gap-2 border-r border-border bg-surface py-3',
        className
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={item.active ? 'page' : undefined}
          aria-label={item.label}
          title={item.label}
          onClick={item.onSelect}
          className={cn(
            'flex h-11 w-11 flex-col items-center justify-center rounded-[var(--wdr-radius-md)] text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            item.active
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <span aria-hidden="true">{item.icon}</span>
        </button>
      ))}
    </nav>
  );
}

export interface PageTabItem {
  id: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
}

export function PageTabs({
  tabs,
  activeId,
  onTabChange,
  className,
}: {
  tabs: PageTabItem[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label="Page sections" className={cn('flex flex-wrap gap-1 border-b border-border', className)}>
      {tabs.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            disabled={t.disabled}
            aria-selected={active}
            onClick={() => onTabChange(t.id)}
            className={cn(
              'inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
              t.disabled && 'opacity-45 cursor-not-allowed'
            )}
          >
            <span>{t.label}</span>
            {t.badge !== undefined && (
              <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">
                {t.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  onClick: () => void;
}

export function QuickActions({
  actions,
  title = 'Quick actions',
  className,
}: {
  actions: QuickActionItem[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2.5', className)}>
      <div className="text-xs font-semibold text-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-2">
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={act.onClick}
            className="inline-flex items-center gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {act.icon && <span aria-hidden="true">{act.icon}</span>}
            <span>{act.label}</span>
            {act.shortcut && <KeyboardShortcutHint keys={act.shortcut} />}
          </button>
        ))}
      </div>
    </Card>
  );
}

export function GlobalSearch({
  value,
  onValueChange,
  onOpenCommand,
  placeholder = 'Search workspace…',
  shortcutHint = ['Ctrl', 'K'],
  className,
}: {
  value: string;
  onValueChange: (val: string) => void;
  onOpenCommand?: () => void;
  placeholder?: string;
  shortcutHint?: string[];
  className?: string;
}) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full min-w-[200px] rounded-[var(--wdr-radius-md)] border border-input bg-surface pl-9 pr-16 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="absolute right-2 flex items-center gap-1">
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onValueChange('')}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
        {onOpenCommand ? (
          <button type="button" onClick={onOpenCommand} aria-label="Open command search">
            <KeyboardShortcutHint keys={shortcutHint} />
          </button>
        ) : (
          <KeyboardShortcutHint keys={shortcutHint} />
        )}
      </div>
    </div>
  );
}

export interface SimpleNavEntry {
  id: string;
  label: string;
  category?: string;
  onSelect: () => void;
}

export function RecentItems({
  items,
  title = 'Recent',
  className,
}: {
  items: SimpleNavEntry[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.onSelect}
              className="flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{item.label}</span>
              {item.category && <span className="text-[11px] text-muted-foreground">{item.category}</span>}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function FavoritesList({
  items,
  title = 'Favorites',
  className,
}: {
  items: SimpleNavEntry[];
  title?: string;
  className?: string;
}) {
  return (
    <Card className={cn('p-4 space-y-2', className)}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Star className="h-3.5 w-3.5 text-primary-active" aria-hidden="true" />
        <span>{title}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={item.onSelect}
              className="flex w-full items-center justify-between rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="truncate">{item.label}</span>
              {item.category && <span className="text-[11px] text-muted-foreground">{item.category}</span>}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
