import * as React from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const SidebarContext = React.createContext<{ collapsed: boolean }>({ collapsed: false });

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  collapsible = false,
  header,
  footer,
  className,
  children,
  ...props
}: SidebarProps) {
  return (
    <SidebarContext.Provider value={{ collapsed }}>
      <aside
        aria-label="Sidebar navigation"
        className={cn(
          'flex h-full flex-col border-r border-border bg-surface transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        {...props}
      >
        {(header || collapsible) && (
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3.5">
            {!collapsed && <div className="min-w-0 flex-1">{header}</div>}
            {collapsible && (
              <button
                type="button"
                onClick={() => onCollapsedChange?.(!collapsed)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-md)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            )}
          </div>
        )}

        <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-4">{children}</nav>

        {footer && <div className="border-t border-border p-3">{footer}</div>}
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
