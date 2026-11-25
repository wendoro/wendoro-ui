import * as React from 'react';
import { Clock, Command, Grid, Search, Star, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useKeyboardShortcuts } from '../../../hooks/use-keyboard-shortcuts';
import { Card } from '../card';

export type LauncherCategory = 'app' | 'product' | 'module' | 'workspace';

export interface LauncherEntry {
  id: string;
  name: string;
  description?: string;
  category: LauncherCategory;
  icon?: React.ReactNode;
  shortcut?: string;
  favorite?: boolean;
  recent?: boolean;
  badge?: string;
  onLaunch: () => void;
}

const CATEGORY_TABS: Array<{ id: 'all' | 'favorites' | 'recent' | LauncherCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'recent', label: 'Recent' },
  { id: 'app', label: 'Apps' },
  { id: 'product', label: 'Products' },
  { id: 'module', label: 'Modules' },
  { id: 'workspace', label: 'Workspaces' },
];

/* -------------------------------------------------------------------------- */
/* QuickLaunchPanel (Search-driven, Recent, Favorites, Category Grid)         */
/* -------------------------------------------------------------------------- */

export interface QuickLaunchPanelProps {
  entries: LauncherEntry[];
  onToggleFavorite?: (id: string) => void;
  title?: string;
  showCategories?: boolean;
  className?: string;
}

export function QuickLaunchPanel({
  entries,
  onToggleFavorite,
  title = 'Quick launcher',
  showCategories = true,
  className,
}: QuickLaunchPanelProps) {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState<'all' | 'favorites' | 'recent' | LauncherCategory>('all');

  const q = query.trim().toLowerCase();
  const filtered = entries.filter((item) => {
    if (tab === 'favorites' && !item.favorite) return false;
    if (tab === 'recent' && !item.recent) return false;
    if (tab !== 'all' && tab !== 'favorites' && tab !== 'recent' && item.category !== tab) return false;
    if (!q) return true;
    return `${item.name} ${item.description ?? ''} ${item.category}`.toLowerCase().includes(q);
  });

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps or modules…"
            aria-label="Search launcher entries"
            className="h-8 w-full rounded-[var(--wdr-radius-sm)] border border-input bg-surface pl-8 pr-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>

      {showCategories && (
        <div role="tablist" aria-label="Launcher categories" className="flex flex-wrap gap-1">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={tab === cat.id}
              onClick={() => setTab(cat.id)}
              className={cn(
                'rounded-[var(--wdr-radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors',
                tab === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group flex items-start justify-between gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface p-2.5 transition-colors hover:bg-muted/60"
          >
            <button
              type="button"
              onClick={item.onLaunch}
              className="flex min-w-0 flex-1 items-start gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] bg-primary-subtle text-primary-subtle-foreground font-bold text-xs">
                {item.icon ?? item.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-xs font-semibold text-foreground">{item.name}</span>
                  {item.recent && <Clock className="h-3 w-3 shrink-0 text-muted-foreground" aria-label="Recent" />}
                </div>
                {item.description && <div className="truncate text-[11px] text-muted-foreground">{item.description}</div>}
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] capitalize text-muted-foreground">
                    {item.category}
                  </span>
                  {item.badge && (
                    <span className="rounded bg-primary-subtle px-1.5 py-0.2 text-[10px] font-medium text-primary-subtle-foreground">
                      {item.badge}
                    </span>
                  )}
                  {item.shortcut && (
                    <kbd className="font-mono text-[10px] text-muted-foreground">{item.shortcut}</kbd>
                  )}
                </div>
              </div>
            </button>

            {onToggleFavorite && (
              <button
                type="button"
                aria-label={item.favorite ? `Unpin ${item.name}` : `Pin ${item.name} to favorites`}
                aria-pressed={Boolean(item.favorite)}
                onClick={() => onToggleFavorite(item.id)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Star
                  className={cn('h-3.5 w-3.5', item.favorite && 'fill-primary text-primary-active')}
                  aria-hidden="true"
                />
              </button>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-muted-foreground">
            No matching apps, products, or modules found.
          </div>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* AppLauncher (9-dot Switcher Popover / Dialog)                              */
/* -------------------------------------------------------------------------- */

export interface AppLauncherProps {
  entries: LauncherEntry[];
  onToggleFavorite?: (id: string) => void;
  label?: string;
  className?: string;
}

export function AppLauncher({
  entries,
  onToggleFavorite,
  label = 'App launcher',
  className,
}: AppLauncherProps) {
  const [open, setOpen] = React.useState(false);
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

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-2.5 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Grid className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{label}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,680px)] rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-2 shadow-[var(--wdr-shadow-lg)]"
        >
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-semibold text-muted-foreground">
              Switch apps, products & modules
            </span>
            <button
              type="button"
              aria-label="Close launcher"
              onClick={() => setOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <QuickLaunchPanel
            entries={entries.map((e) => ({
              ...e,
              onLaunch: () => {
                e.onLaunch();
                setOpen(false);
              },
            }))}
            onToggleFavorite={onToggleFavorite}
            title="Ecosystem Launcher"
            className="border-0 shadow-none p-2"
          />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CommandLauncher (Keyboard-Driven Global Launcher Modal)                    */
/* -------------------------------------------------------------------------- */

export function CommandLauncher({
  entries,
  onToggleFavorite,
  triggerLabel = 'Launch',
  shortcutKey = 'l',
  className,
}: {
  entries: LauncherEntry[];
  onToggleFavorite?: (id: string) => void;
  triggerLabel?: string;
  shortcutKey?: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  useKeyboardShortcuts([
    {
      key: shortcutKey,
      ctrlOrMeta: true,
      shift: true,
      handler: () => setOpen((o) => !o),
    },
    {
      key: 'Escape',
      allowInInputs: true,
      handler: () => {
        if (open) setOpen(false);
      },
    },
  ]);

  return (
    <div className={cn('inline-block', className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3 text-xs font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Command className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{triggerLabel}</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          Ctrl+Shift+{shortcutKey.toUpperCase()}
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
          <div aria-hidden="true" onClick={() => setOpen(false)} className="fixed inset-0 bg-black/55" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Command launcher"
            className="relative z-10 w-full max-w-2xl"
          >
            <QuickLaunchPanel
              title="Command & Module Launcher"
              entries={entries.map((e) => ({
                ...e,
                onLaunch: () => {
                  e.onLaunch();
                  setOpen(false);
                },
              }))}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </div>
      )}
    </div>
  );
}
