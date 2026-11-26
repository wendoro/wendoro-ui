import * as React from 'react';
import {
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Menu,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { sanitizeUrl } from '../../../utils/url';
import { Card } from '../card';
import { BottomSheet } from '../mobile/MobilePrimitives';

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
  disabled?: boolean;
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
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuItemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const focusMenuItem = (idx: number) => {
    if (items.length === 0) return;
    const target = (idx + items.length) % items.length;
    menuItemRefs.current[target]?.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Context actions target"
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setCoords({
            x: Math.max(0, Math.min(rect.width - 140, e.clientX - rect.left)),
            y: Math.max(0, e.clientY - rect.top),
          });
        } else {
          setCoords(null);
        }
        setOpen(true);
      }}
      onKeyDown={(e) => {
        if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu') {
          e.preventDefault();
          setCoords(null);
          setOpen((o) => !o);
        } else if (e.key === 'Escape') {
          setOpen(false);
          containerRef.current?.focus();
        }
      }}
      className={cn('relative inline-block', className)}
    >
      {children}
      {open && (
        <div
          role="menu"
          style={coords ? { left: `${coords.x}px`, top: `${coords.y}px` } : undefined}
          className={cn(
            'absolute z-40 min-w-[190px] rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1 shadow-[var(--wdr-shadow-lg)]',
            !coords && 'right-0 top-full mt-1.5'
          )}
        >
          {items.map((item, idx) => (
            <button
              key={item.id}
              ref={(el) => {
                menuItemRefs.current[idx] = el;
              }}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  focusMenuItem(idx + 1);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  focusMenuItem(idx - 1);
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  focusMenuItem(0);
                } else if (e.key === 'End') {
                  e.preventDefault();
                  focusMenuItem(items.length - 1);
                }
              }}
              className={cn(
                'flex w-full items-center justify-between gap-4 rounded-[var(--wdr-radius-sm)] px-2.5 py-1.5 text-left text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-45',
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
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const enabledTabs = tabs.filter((t) => !t.disabled);

  const moveTabFocus = (currentId: string, delta: number) => {
    if (enabledTabs.length === 0) return;
    const idx = enabledTabs.findIndex((t) => t.id === currentId);
    const next = enabledTabs[(idx + delta + enabledTabs.length) % enabledTabs.length];
    if (!next) return;
    onTabChange(next.id);
    const domIdx = tabs.findIndex((t) => t.id === next.id);
    tabRefs.current[domIdx]?.focus();
  };

  return (
    <div role="tablist" aria-label="Page sections" className={cn('flex flex-wrap gap-1 border-b border-border', className)}>
      {tabs.map((t, idx) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            disabled={t.disabled}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onTabChange(t.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                moveTabFocus(t.id, 1);
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moveTabFocus(t.id, -1);
              } else if (e.key === 'Home' && enabledTabs[0]) {
                e.preventDefault();
                onTabChange(enabledTabs[0].id);
                tabRefs.current[tabs.findIndex((item) => item.id === enabledTabs[0].id)]?.focus();
              } else if (e.key === 'End' && enabledTabs[enabledTabs.length - 1]) {
                e.preventDefault();
                const last = enabledTabs[enabledTabs.length - 1];
                onTabChange(last.id);
                tabRefs.current[tabs.findIndex((item) => item.id === last.id)]?.focus();
              }
            }}
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

/* -------------------------------------------------------------------------- */
/* WorkspaceSwitcher (Multi-Tenant / Multi-Client / Multi-Store)              */
/* -------------------------------------------------------------------------- */

export interface WorkspaceOption {
  id: string;
  name: string;
  subtitle?: string;
  role?: string;
  badge?: string;
}

export interface WorkspaceSwitcherProps {
  workspaces: WorkspaceOption[];
  activeWorkspaceId: string;
  onSelectWorkspace: (id: string) => void;
  onCreateWorkspace?: () => void;
  createLabel?: string;
  label?: string;
  className?: string;
}

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
  createLabel = 'New workspace',
  label = 'Switch workspace',
  className,
}: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const filtered = workspaces.filter((w) =>
    `${w.name} ${w.subtitle ?? ''} ${w.role ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div ref={containerRef} className={cn('relative inline-block w-full max-w-xs', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[42px] w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 py-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] bg-primary text-xs font-bold text-primary-foreground">
            {active ? active.name.slice(0, 2).toUpperCase() : <Building2 className="h-3.5 w-3.5" />}
          </span>
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-foreground">{active?.name ?? 'Select workspace'}</div>
            {active?.subtitle && <div className="truncate text-[11px] text-muted-foreground">{active.subtitle}</div>}
          </div>
        </div>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-full z-40 mt-1.5 w-full min-w-[260px] rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-2 shadow-[var(--wdr-shadow-lg)]"
        >
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter workspaces…"
              aria-label="Filter workspaces"
              className="h-8 w-full rounded-[var(--wdr-radius-sm)] border border-input bg-surface pl-8 pr-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <ul role="listbox" aria-label="Available workspaces" className="max-h-56 space-y-0.5 overflow-y-auto">
            {filtered.map((ws) => {
              const selected = ws.id === activeWorkspaceId;
              return (
                <li key={ws.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onSelectWorkspace(ws.id);
                      setOpen(false);
                      setQuery('');
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2.5 py-2 text-left text-xs transition-colors hover:bg-muted',
                      selected && 'bg-primary-subtle text-primary-subtle-foreground font-semibold'
                    )}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">{ws.name}</div>
                      {(ws.subtitle || ws.role) && (
                        <div className="truncate text-[11px] text-muted-foreground">
                          {[ws.subtitle, ws.role].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {ws.badge && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {ws.badge}
                        </span>
                      )}
                      {selected && <Check className="h-3.5 w-3.5 text-foreground" aria-hidden="true" />}
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-2.5 py-3 text-center text-xs text-muted-foreground">No matching workspaces</li>
            )}
          </ul>

          {onCreateWorkspace && (
            <button
              type="button"
              onClick={() => {
                onCreateWorkspace();
                setOpen(false);
              }}
              className="mt-2 flex w-full items-center gap-2 rounded-[var(--wdr-radius-sm)] border-t border-border px-2.5 pt-2.5 pb-1 text-left text-xs font-semibold text-foreground hover:text-primary-active"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{createLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* QuickCreateMenu                                                            */
/* -------------------------------------------------------------------------- */

export interface QuickCreateItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string[];
  icon?: React.ReactNode;
  onSelect: () => void;
}

export function QuickCreateMenu({
  items,
  label = 'Create',
  className,
}: {
  items: QuickCreateItem[];
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const focusItem = (idx: number) => {
    if (items.length === 0) return;
    const target = (idx + items.length) % items.length;
    itemRefs.current[target]?.focus();
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
            window.setTimeout(() => focusItem(0), 0);
          }
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-[var(--wdr-radius-md)] bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-[var(--wdr-shadow-sm)] hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{label}</span>
        <ChevronDown className="h-3 w-3" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={`${label} options`}
          className="absolute right-0 top-full z-40 mt-1.5 w-64 rounded-[var(--wdr-radius-md)] border border-border bg-surface-elevated p-1.5 shadow-[var(--wdr-shadow-lg)]"
        >
          {items.map((item, idx) => (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              type="button"
              role="menuitem"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  focusItem(idx + 1);
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  focusItem(idx - 1);
                } else if (e.key === 'Home') {
                  e.preventDefault();
                  focusItem(0);
                } else if (e.key === 'End') {
                  e.preventDefault();
                  focusItem(items.length - 1);
                }
              }}
              className="flex w-full items-start justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2.5 py-2 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex min-w-0 items-start gap-2">
                {item.icon && <span className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true">{item.icon}</span>}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground">{item.label}</div>
                  {item.description && <div className="text-[11px] text-muted-foreground">{item.description}</div>}
                </div>
              </div>
              {item.shortcut && <KeyboardShortcutHint keys={item.shortcut} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* NestedMenu (Multi-level hierarchical navigation)                           */
/* -------------------------------------------------------------------------- */

export interface NestedMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  onSelect?: () => void;
  children?: NestedMenuItem[];
}

export function NestedMenu({
  items,
  defaultExpandedIds = [],
  'aria-label': ariaLabel = 'Multi-level menu',
  className,
}: {
  items: NestedMenuItem[];
  defaultExpandedIds?: string[];
  'aria-label'?: string;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(defaultExpandedIds));
  const navRef = React.useRef<HTMLElement>(null);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    node: NestedMenuItem,
    hasChildren: boolean,
    isExpanded: boolean
  ) => {
    if (e.key === 'ArrowRight' && hasChildren && !isExpanded) {
      e.preventDefault();
      toggle(node.id);
      return;
    }
    if (e.key === 'ArrowLeft' && hasChildren && isExpanded) {
      e.preventDefault();
      toggle(node.id);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const buttons = Array.from(navRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
    if (buttons.length === 0) return;
    e.preventDefault();
    const curIdx = buttons.indexOf(e.currentTarget);
    if (e.key === 'Home') buttons[0]?.focus();
    else if (e.key === 'End') buttons[buttons.length - 1]?.focus();
    else if (e.key === 'ArrowDown') buttons[(curIdx + 1) % buttons.length]?.focus();
    else if (e.key === 'ArrowUp') buttons[(curIdx - 1 + buttons.length) % buttons.length]?.focus();
  };

  const renderNodes = (nodes: NestedMenuItem[], depth = 0) => (
    <ul className="space-y-0.5" role={depth === 0 ? 'menu' : 'group'}>
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children && node.children.length > 0);
        const isExpanded = expanded.has(node.id);
        return (
          <li key={node.id} role="none">
            <div
              className={cn(
                'flex items-center justify-between gap-2 rounded-[var(--wdr-radius-sm)] px-2 py-1.5 text-xs transition-colors',
                node.active ? 'bg-primary text-primary-foreground font-semibold' : 'text-foreground hover:bg-muted'
              )}
              style={{ paddingLeft: `${8 + depth * 14}px` }}
            >
              <button
                type="button"
                role="menuitem"
                aria-expanded={hasChildren ? isExpanded : undefined}
                onClick={() => {
                  if (hasChildren) toggle(node.id);
                  node.onSelect?.();
                }}
                onKeyDown={(e) => handleItemKeyDown(e, node, hasChildren, isExpanded)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  )
                ) : (
                  node.icon && <span className="shrink-0" aria-hidden="true">{node.icon}</span>
                )}
                <span className="truncate">{node.label}</span>
              </button>
              {node.badge !== undefined && (
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                  {node.badge}
                </span>
              )}
            </div>
            {hasChildren && isExpanded && renderNodes(node.children!, depth + 1)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <nav ref={navRef} aria-label={ariaLabel} className={cn('rounded-[var(--wdr-radius-md)] border border-border bg-surface p-2', className)}>
      {renderNodes(items)}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* MobileCommandBar                                                           */
/* -------------------------------------------------------------------------- */

export interface MobileCommandEntry {
  id: string;
  label: string;
  group?: string;
  onSelect: () => void;
}

export function MobileCommandBar({
  items,
  placeholder = 'Search or run command…',
  triggerLabel = 'Search',
  className,
}: {
  items: MobileCommandEntry[];
  placeholder?: string;
  triggerLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const filtered = items.filter((item) =>
    `${item.label} ${item.group ?? ''}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-[44px] w-full items-center gap-2.5 rounded-[var(--wdr-radius-md)] border border-input bg-surface px-3.5 text-left text-sm text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="truncate flex-1">{triggerLabel}</span>
      </button>

      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Quick Search & Commands"
        snap="full"
      >
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              aria-label={placeholder}
              className="h-11 w-full rounded-[var(--wdr-radius-md)] border border-input bg-surface pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <ul className="space-y-1" role="listbox" aria-label="Command results">
            {filtered.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    item.onSelect();
                    setOpen(false);
                    setQuery('');
                  }}
                  className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-muted"
                >
                  <span className="truncate">{item.label}</span>
                  {item.group && <span className="text-xs text-muted-foreground">{item.group}</span>}
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-6 text-center text-xs text-muted-foreground">No commands found</li>
            )}
          </ul>
        </div>
      </BottomSheet>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FullscreenMobileMenu                                                       */
/* -------------------------------------------------------------------------- */

export interface FullscreenMobileMenuGroup {
  id: string;
  title: string;
  items: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    active?: boolean;
    onSelect: () => void;
  }>;
}

export function FullscreenMobileMenu({
  open,
  onOpenChange,
  title = 'Menu',
  groups,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  groups: FullscreenMobileMenuGroup[];
  footer?: React.ReactNode;
}) {
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filteredGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        `${it.label} ${it.description ?? ''}`.toLowerCase().includes(q)
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex flex-col bg-background text-foreground"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3.5">
        <span className="text-base font-bold">{title}</span>
        <button
          type="button"
          aria-label="Close fullscreen menu"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--wdr-radius-md)] border border-border bg-surface text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="border-b border-border bg-surface px-4 py-2.5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter navigation…"
            aria-label="Filter navigation"
            className="h-11 w-full rounded-[var(--wdr-radius-md)] border border-input bg-background pl-9 pr-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      <nav aria-label="Fullscreen mobile navigation" className="wdr-scrollbar flex-1 space-y-5 overflow-y-auto p-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </div>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-current={item.active ? 'page' : undefined}
                  onClick={() => {
                    item.onSelect();
                    onOpenChange(false);
                  }}
                  className={cn(
                    'flex min-h-[48px] w-full items-center gap-3 rounded-[var(--wdr-radius-md)] border px-3.5 py-2.5 text-left transition-colors',
                    item.active
                      ? 'border-foreground bg-primary text-primary-foreground font-semibold'
                      : 'border-border bg-surface text-foreground hover:bg-muted'
                  )}
                >
                  {item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{item.label}</div>
                    {item.description && (
                      <div className={cn('truncate text-xs', item.active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredGroups.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">No matching destinations.</div>
        )}
      </nav>

      {footer && <div className="border-t border-border bg-surface p-4">{footer}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HamburgerButton & OrganizationSwitcher                                     */
/* -------------------------------------------------------------------------- */

export interface HamburgerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
  label?: string;
}

export function HamburgerButton({
  open = false,
  label,
  className,
  ...props
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={label ?? (open ? 'Close navigation menu' : 'Open navigation menu')}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-[var(--wdr-radius-md)] border border-border bg-surface text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
    </button>
  );
}

export interface OrganizationSwitcherProps {
  organizations: WorkspaceOption[];
  activeOrganizationId: string;
  onSelectOrganization: (id: string) => void;
  onCreateOrganization?: () => void;
  createLabel?: string;
  label?: string;
  className?: string;
}

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
  onSelectOrganization,
  onCreateOrganization,
  createLabel = 'New organization',
  label = 'Switch organization',
  className,
}: OrganizationSwitcherProps) {
  return (
    <WorkspaceSwitcher
      workspaces={organizations}
      activeWorkspaceId={activeOrganizationId}
      onSelectWorkspace={onSelectOrganization}
      onCreateWorkspace={onCreateOrganization}
      createLabel={createLabel}
      label={label}
      className={className}
    />
  );
}

