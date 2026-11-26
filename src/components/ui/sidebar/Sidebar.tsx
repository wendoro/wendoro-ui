import * as React from 'react';
import { ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../../../utils/cn';

export type SidebarVariant = 'default' | 'mini' | 'icon';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  variant?: SidebarVariant;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  resizable?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

export function Sidebar({
  collapsed = false,
  variant = 'default',
  onCollapsedChange,
  collapsible = false,
  resizable = false,
  defaultWidth = 256,
  minWidth = 200,
  maxWidth = 380,
  header,
  footer,
  className,
  style,
  children,
  ...props
}: SidebarProps) {
  const effectiveCollapsed = collapsed || variant === 'mini' || variant === 'icon';
  const [width, setWidth] = React.useState(defaultWidth);
  const asideRef = React.useRef<HTMLElement>(null);

  const clampWidth = (val: number) => Math.max(minWidth, Math.min(maxWidth, val));

  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizable || effectiveCollapsed) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    const onMove = (moveEvt: PointerEvent) => {
      setWidth(clampWidth(Math.round(startWidth + (moveEvt.clientX - startX))));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <SidebarContext.Provider value={{ collapsed: effectiveCollapsed }}>
      <aside
        ref={asideRef}
        aria-label="Sidebar navigation"
        data-sidebar-variant={variant}
        style={
          !effectiveCollapsed && resizable
            ? { width: `${width}px`, ...style }
            : style
        }
        className={cn(
          'relative flex h-full flex-col border-r border-border bg-surface transition-[width] duration-200',
          effectiveCollapsed
            ? variant === 'icon'
              ? 'w-14'
              : 'w-16'
            : !resizable && 'w-64',
          className
        )}
        {...props}
      >
        {(header || collapsible) && (
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3.5">
            {!effectiveCollapsed && <div className="min-w-0 flex-1">{header}</div>}
            {collapsible && (
              <button
                type="button"
                onClick={() => onCollapsedChange?.(!effectiveCollapsed)}
                aria-expanded={!effectiveCollapsed}
                aria-label={effectiveCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {effectiveCollapsed ? (
                  <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        )}

        <nav className="wdr-scrollbar-thin flex-1 space-y-5 overflow-y-auto px-2.5 py-4">{children}</nav>

        {footer && <div className="border-t border-border p-3">{footer}</div>}

        {resizable && !effectiveCollapsed && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            aria-valuemin={minWidth}
            aria-valuemax={maxWidth}
            aria-valuenow={width}
            tabIndex={0}
            onPointerDown={startResize}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') {
                e.preventDefault();
                setWidth((w) => clampWidth(w + 16));
              } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setWidth((w) => clampWidth(w - 16));
              }
            }}
            className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize bg-transparent hover:bg-primary/40 focus-visible:bg-primary focus-visible:outline-none"
          />
        )}
      </aside>
    </SidebarContext.Provider>
  );
}

export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function SidebarSection({ title, className, children, ...props }: SidebarSectionProps) {
  const { collapsed } = React.useContext(SidebarContext);

  return (
    <div className={cn('space-y-1', className)} {...props}>
      {title && !collapsed && (
        <div className="px-2.5 pb-1 text-xs font-medium text-muted-foreground">{title}</div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export interface SidebarItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  badge?: React.ReactNode;
}

export function SidebarItem({
  icon,
  active = false,
  badge,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const { collapsed } = React.useContext(SidebarContext);

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      title={collapsed && typeof children === 'string' ? children : undefined}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-[var(--wdr-radius-md)] px-2.5 py-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        collapsed && 'justify-center px-0',
        className
      )}
      {...props}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex shrink-0 items-center">
          {icon}
        </span>
      )}
      {collapsed ? (
        <span className="sr-only">{children}</span>
      ) : (
        <span className="flex-1 truncate text-left">{children}</span>
      )}
      {!collapsed && badge && <span className="shrink-0">{badge}</span>}
    </button>
  );
}

export interface SidebarNestedGroupProps {
  label: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SidebarNestedGroup({
  label,
  icon,
  defaultOpen = false,
  children,
  className,
}: SidebarNestedGroupProps) {
  const { collapsed } = React.useContext(SidebarContext);
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className={cn('space-y-0.5', className)}>
      <button
        type="button"
        aria-expanded={open}
        title={collapsed ? label : undefined}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-[var(--wdr-radius-md)] px-2.5 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          collapsed && 'justify-center px-0'
        )}
      >
        {icon && <span aria-hidden="true" className="inline-flex shrink-0 items-center">{icon}</span>}
        {collapsed ? (
          <span className="sr-only">{label}</span>
        ) : (
          <>
            <span className="flex-1 truncate text-left">{label}</span>
            {open ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-4 space-y-0.5 border-l border-border pl-2.5">
          {children}
        </div>
      )}
    </div>
  );
}
