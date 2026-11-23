import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../../utils/cn';

export interface NavigationMenuSubItem {
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

export interface NavigationMenuItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  items?: NavigationMenuSubItem[];
}

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  items: NavigationMenuItem[];
}

export function NavigationMenu({ items, className, ...props }: NavigationMenuProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const navRef = React.useRef<HTMLElement>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useEffect(() => {
    if (!openId) return;
    const handleOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const current = openId;
        setOpenId(null);
        triggerRefs.current[current]?.focus();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openId]);

  return (
    <nav
      ref={navRef}
      aria-label="Primary navigation"
      className={cn('relative flex items-center gap-1', className)}
      {...props}
    >
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const hasChildren = Boolean(item.items && item.items.length > 0);
          const isOpen = openId === item.id;

          return (
            <li key={item.id} className="relative">
              {hasChildren ? (
                <>
                  <button
                    ref={(el) => {
                      triggerRefs.current[item.id] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' && !isOpen) {
                        e.preventDefault();
                        setOpenId(item.id);
                      }
                    }}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-md)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      item.active || isOpen
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn('h-3.5 w-3.5 transition-transform duration-150', isOpen && 'rotate-180')}
                    />
                  </button>
                  {isOpen && item.items && (
                    <div className="absolute left-0 top-full z-50 mt-1.5 w-72 rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated p-2 shadow-[var(--wdr-shadow-md)]">
                      <ul className="space-y-1">
                        {item.items.map((sub) => (
                          <li key={sub.label}>
                            <a
                              href={sub.href ?? '#'}
                              onClick={(e) => {
                                if (!sub.href) e.preventDefault();
                                sub.onClick?.();
                                setOpenId(null);
                              }}
                              className="block rounded-[var(--wdr-radius-md)] px-3 py-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <div className="text-sm font-medium text-foreground">{sub.label}</div>
                              {sub.description && (
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                  {sub.description}
                                </div>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href ?? '#'}
                  aria-current={item.active ? 'page' : undefined}
                  onClick={(e) => {
                    if (!item.href) e.preventDefault();
                    item.onClick?.();
                  }}
                  className={cn(
                    'inline-flex items-center rounded-[var(--wdr-radius-md)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    item.active
                      ? 'text-foreground underline decoration-primary decoration-2 underline-offset-8'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
