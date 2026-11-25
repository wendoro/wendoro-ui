import * as React from 'react';
import { GripVertical, Menu, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useBreakpoint } from '../../../hooks/use-breakpoint';
import { Breadcrumb, type BreadcrumbItem } from '../../ui/breadcrumb';
import { Button } from '../../ui/button';
import { Container, type ContainerProps } from '../../ui/container';
import { Drawer } from '../../ui/drawer';
import {
  BottomNavigation,
  BottomSheet,
  type BottomNavigationItem,
} from '../../ui/mobile/MobilePrimitives';
import { Sidebar, SidebarItem, SidebarSection, type SidebarProps } from '../../ui/sidebar';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  mobileNavOpen?: boolean;
  onMobileNavOpenChange?: (open: boolean) => void;
  mobileNavTitle?: string;
}

export function AppShell({
  sidebar,
  header,
  footer,
  mobileNavOpen = false,
  onMobileNavOpenChange,
  mobileNavTitle = 'Navigation',
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-screen w-full bg-background text-foreground', className)} {...props}>
      {sidebar && <div className="hidden lg:block shrink-0">{sidebar}</div>}

      {sidebar && onMobileNavOpenChange && (
        <Drawer
          open={mobileNavOpen}
          onOpenChange={onMobileNavOpenChange}
          placement="left"
          title={mobileNavTitle}
          className="p-0"
        >
          <div className="h-full overflow-y-auto">{sidebar}</div>
        </Drawer>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="min-w-0 flex-1">{children}</main>
        {footer}
      </div>
    </div>
  );
}

export function DashboardLayout(props: AppShellProps) {
  return <AppShell {...props} />;
}

export interface DashboardHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  onOpenMobileNav?: () => void;
  leftSlot?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DashboardHeader({
  title,
  breadcrumbs,
  onOpenMobileNav,
  leftSlot,
  actions,
  className,
  ...props
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-xs sm:px-6',
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {onOpenMobileNav && (
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              aria-label="Open navigation menu"
              onClick={onOpenMobileNav}
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          <div className="min-w-0 space-y-0.5">
            {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
            {title && <div className="truncate text-sm font-semibold text-foreground">{title}</div>}
          </div>
          {leftSlot}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </header>
  );
}

export function DashboardSidebar(props: SidebarProps) {
  return <Sidebar {...props} />;
}

export interface SidebarNavGroup {
  id: string;
  title?: string;
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    active?: boolean;
    badge?: React.ReactNode;
    disabled?: boolean;
    onSelect?: () => void;
  }>;
}

export function SidebarGroup({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SidebarSection title={title} className={className}>
      {children}
    </SidebarSection>
  );
}

export interface SidebarNavigationProps {
  groups: SidebarNavGroup[];
  className?: string;
}

export function SidebarNavigation({ groups, className }: SidebarNavigationProps) {
  return (
    <div className={cn('space-y-5', className)}>
      {groups.map((group) => (
        <SidebarGroup key={group.id} title={group.title}>
          {group.items.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              active={item.active}
              badge={item.badge}
              disabled={item.disabled}
              onClick={item.onSelect}
            >
              {item.label}
            </SidebarItem>
          ))}
        </SidebarGroup>
      ))}
    </div>
  );
}

export interface TopNavigationItem {
  id: string;
  label: string;
  active?: boolean;
  onSelect?: () => void;
}

export interface TopNavigationProps {
  brand?: React.ReactNode;
  items: TopNavigationItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function TopNavigation({ brand, items, actions, className }: TopNavigationProps) {
  return (
    <nav
      aria-label="Primary top navigation"
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-4 py-2.5 sm:px-6',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-6">
        {brand && <div className="shrink-0">{brand}</div>}
        <ul className="flex flex-wrap items-center gap-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.active ? 'page' : undefined}
                onClick={item.onSelect}
                className={cn(
                  'rounded-[var(--wdr-radius-md)] px-3 py-1.5 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  item.active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </nav>
  );
}

export function PageContainer({ size = 'xl', className, ...props }: ContainerProps) {
  return <Container size={size} className={cn('py-6 space-y-6', className)} {...props} />;
}

export interface PageToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function PageToolbar({ left, right, className, ...props }: PageToolbarProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3', className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2.5">{left}</div>
      {right && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{right}</div>}
    </div>
  );
}

export interface ContentSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ContentSection({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: ContentSectionProps) {
  return (
    <section className={cn('space-y-4', className)} {...props}>
      {(title || description || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            {title && <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftPercent?: number;
  minLeftPercent?: number;
  maxLeftPercent?: number;
  resizable?: boolean;
  collapseBelow?: 'md' | 'lg';
  collapsibleLeft?: boolean;
  defaultLeftCollapsed?: boolean;
  leftTitle?: string;
  className?: string;
}

export function SplitPanel({
  left,
  right,
  defaultLeftPercent = 40,
  minLeftPercent = 20,
  maxLeftPercent = 80,
  resizable = false,
  collapseBelow = 'lg',
  collapsibleLeft = false,
  defaultLeftCollapsed = false,
  leftTitle = 'Left pane',
  className,
}: SplitPanelProps) {
  const [ratio, setRatio] = React.useState(defaultLeftPercent);
  const [leftCollapsed, setLeftCollapsed] = React.useState(defaultLeftCollapsed);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const clamp = (val: number) => Math.max(minLeftPercent, Math.min(maxLeftPercent, val));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!resizable) return;
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const onMove = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) return;
      const pct = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      setRatio(clamp(Math.round(pct)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const rowBreakpointClass = collapseBelow === 'md' ? 'md:flex-row' : 'lg:flex-row';
  const dividerClass =
    collapseBelow === 'md'
      ? 'border-t md:border-t-0 md:border-l border-border'
      : 'border-t lg:border-t-0 lg:border-l border-border';
  const resizerDisplayClass = collapseBelow === 'md' ? 'hidden md:flex' : 'hidden lg:flex';

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col rounded-[var(--wdr-radius-lg)] border border-border bg-surface overflow-hidden',
        rowBreakpointClass,
        className
      )}
    >
      {!leftCollapsed && (
        <div className="min-w-0 p-4" style={{ flexBasis: `${ratio}%`, flexShrink: 0 }}>
          {collapsibleLeft && (
            <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
              <span className="text-xs font-semibold text-muted-foreground">{leftTitle}</span>
              <button
                type="button"
                aria-label={`Collapse ${leftTitle}`}
                onClick={() => setLeftCollapsed(true)}
                className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <PanelLeftClose className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
          {left}
        </div>
      )}

      {!leftCollapsed &&
        (resizable ? (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panel"
            aria-valuemin={minLeftPercent}
            aria-valuemax={maxLeftPercent}
            aria-valuenow={ratio}
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setRatio((r) => clamp(r - 4));
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setRatio((r) => clamp(r + 4));
              }
            }}
            className={cn(
              resizerDisplayClass,
              'w-3 cursor-col-resize items-center justify-center border-x border-border bg-muted/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </div>
        ) : (
          <div className={dividerClass} />
        ))}

      <div className="min-w-0 flex-1 p-4">
        {collapsibleLeft && leftCollapsed && (
          <div className="mb-3">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PanelLeftOpen className="h-3.5 w-3.5" />}
              onClick={() => setLeftCollapsed(false)}
            >
              Show {leftTitle}
            </Button>
          </div>
        )}
        {right}
      </div>
    </div>
  );
}

export function ResizablePanel(props: Omit<SplitPanelProps, 'resizable'>) {
  return <SplitPanel {...props} resizable />;
}

export interface ResponsiveNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
}

export function ResponsiveNavDrawer({
  open,
  onOpenChange,
  title = 'Navigation',
  children,
}: ResponsiveNavDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} placement="left" title={title} className="p-0">
      <div className="h-full overflow-y-auto">{children}</div>
    </Drawer>
  );
}

/* -------------------------------------------------------------------------- */
/* ContextualDetailPanel (Docked on tablet/desktop, BottomSheet on mobile)    */
/* -------------------------------------------------------------------------- */

export interface ContextualDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  mode?: 'auto' | 'panel' | 'sheet';
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContextualDetailPanel({
  open,
  onOpenChange,
  title,
  subtitle,
  mode = 'auto',
  footer,
  children,
  className,
}: ContextualDetailPanelProps) {
  const { isMobile } = useBreakpoint();
  const useSheet = mode === 'sheet' || (mode === 'auto' && isMobile);

  if (!open) return null;

  if (useSheet) {
    return (
      <BottomSheet
        open={open}
        onOpenChange={onOpenChange}
        title={title}
        description={subtitle}
        snap="half"
        footer={footer}
        className={className}
      >
        {children}
      </BottomSheet>
    );
  }

  return (
    <aside
      aria-label={typeof title === 'string' ? title : 'Detail panel'}
      className={cn(
        'flex w-full shrink-0 flex-col border-l border-border bg-surface md:w-80 lg:w-96',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          type="button"
          aria-label="Close detail panel"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border p-3.5">
          {footer}
        </div>
      )}
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* AdaptiveWorkspaceLayout (Mobile + Tablet + Desktop Unified Shell)          */
/* -------------------------------------------------------------------------- */

export interface AdaptiveWorkspaceLayoutProps {
  sidebar?: React.ReactNode;
  tabletRail?: React.ReactNode;
  header?: React.ReactNode;
  bottomNavItems?: BottomNavigationItem[];
  detailPanel?: React.ReactNode;
  floatingAction?: React.ReactNode;
  mobileNavOpen?: boolean;
  onMobileNavOpenChange?: (open: boolean) => void;
  mobileNavTitle?: string;
  className?: string;
  children: React.ReactNode;
}

export function AdaptiveWorkspaceLayout({
  sidebar,
  tabletRail,
  header,
  bottomNavItems,
  detailPanel,
  floatingAction,
  mobileNavOpen = false,
  onMobileNavOpenChange,
  mobileNavTitle = 'Workspace Navigation',
  className,
  children,
}: AdaptiveWorkspaceLayoutProps) {
  return (
    <div className={cn('relative flex min-h-screen w-full bg-background text-foreground', className)}>
      {/* Desktop full sidebar */}
      {sidebar && <div className="hidden lg:block shrink-0">{sidebar}</div>}

      {/* Tablet navigation rail */}
      {tabletRail && <div className="hidden md:block lg:hidden shrink-0">{tabletRail}</div>}

      {/* Mobile / Tablet drawer */}
      {sidebar && onMobileNavOpenChange && (
        <Drawer
          open={mobileNavOpen}
          onOpenChange={onMobileNavOpenChange}
          placement="left"
          title={mobileNavTitle}
          className="p-0"
        >
          <div className="h-full overflow-y-auto">{sidebar}</div>
        </Drawer>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <div className="flex min-w-0 flex-1">
          <main className={cn('min-w-0 flex-1', bottomNavItems && 'pb-20 md:pb-0')}>
            {children}
          </main>
          {detailPanel}
        </div>

        {bottomNavItems && bottomNavItems.length > 0 && (
          <div className="md:hidden">
            <BottomNavigation items={bottomNavItems} fixed />
          </div>
        )}
      </div>

      {floatingAction}
    </div>
  );
}
