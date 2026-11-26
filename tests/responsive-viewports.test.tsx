import { act, render, screen } from '@testing-library/react';
import { Home, Layers } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { DataTable, type DataTableColumn } from '@/components/business/data-table';
import {
  AdaptiveWorkspaceLayout,
  ContextualDetailPanel,
  DashboardHeader,
  DashboardSidebar,
} from '@/components/business/shell';
import { NavigationRail } from '@/components/ui/navigation-ext';
import { SidebarItem, SidebarSection } from '@/components/ui/sidebar';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { resolveDeviceCategory } from '@/tokens/breakpoints';

const originalInnerWidth = window.innerWidth;
const originalInnerHeight = window.innerHeight;

function setViewport(width: number, height = 800) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

function ViewportProbe() {
  const bp = useBreakpoint();
  return (
    <div
      data-testid="vp-probe"
      data-width={bp.width}
      data-device={bp.deviceCategory}
      data-mobile={String(bp.isMobile)}
      data-tablet={String(bp.isTablet)}
      data-desktop={String(bp.isDesktop)}
    />
  );
}

interface DemoRow {
  id: string;
  name: string;
  status: string;
}

const ROWS: DemoRow[] = [
  { id: '1', name: 'Sample Project Alpha', status: 'Active' },
  { id: '2', name: 'Sample Project Beta', status: 'Pending' },
];

const COLS: DataTableColumn<DemoRow>[] = [
  { key: 'name', header: 'Project', accessor: (r) => r.name, cell: (r) => r.name },
  { key: 'status', header: 'Status', accessor: (r) => r.status, cell: (r) => r.status },
];

import { HamburgerButton } from '@/components/ui/navigation-ext';
import { DirectionProvider } from '@/hooks/use-direction';

describe('Cross-Device Responsive Viewports (320px to 1920px)', () => {
  afterEach(() => {
    act(() => {
      setViewport(originalInnerWidth, originalInnerHeight);
    });
  });

  it('classifies all representative viewport widths deterministically (320px to 1920px)', () => {
    expect(resolveDeviceCategory(320)).toBe('mobile');
    expect(resolveDeviceCategory(360)).toBe('mobile');
    expect(resolveDeviceCategory(375)).toBe('mobile');
    expect(resolveDeviceCategory(390)).toBe('mobile');
    expect(resolveDeviceCategory(430)).toBe('mobile');
    expect(resolveDeviceCategory(768)).toBe('tablet');
    expect(resolveDeviceCategory(820)).toBe('tablet');
    expect(resolveDeviceCategory(1024)).toBe('desktop');
    expect(resolveDeviceCategory(1280)).toBe('desktop');
    expect(resolveDeviceCategory(1440)).toBe('desktop');
    expect(resolveDeviceCategory(1920)).toBe('desktop');

    act(() => {
      setViewport(320, 640);
    });
    render(<ViewportProbe />);
    const probe = screen.getByTestId('vp-probe');
    expect(probe).toHaveAttribute('data-device', 'mobile');
    expect(probe).toHaveAttribute('data-mobile', 'true');

    for (const [w, expected] of [
      [360, 'mobile'],
      [375, 'mobile'],
      [390, 'mobile'],
      [430, 'mobile'],
      [768, 'tablet'],
      [820, 'tablet'],
      [1024, 'desktop'],
      [1280, 'desktop'],
      [1440, 'desktop'],
      [1920, 'desktop'],
    ] as const) {
      act(() => {
        setViewport(w, 900);
      });
      expect(probe).toHaveAttribute('data-device', expected);
      expect(probe).toHaveAttribute('data-width', String(w));
    }
  });

  it('adapts AdaptiveWorkspaceLayout and ContextualDetailPanel between 375px mobile, 768px tablet, and 1280px desktop and supports RTL', () => {
    act(() => {
      setViewport(375, 812);
    });
    const navItems = [
      { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" />, active: true, onSelect: () => {} },
      { id: 'work', label: 'Work', icon: <Layers className="h-4 w-4" />, onSelect: () => {} },
    ];

    render(
      <DirectionProvider defaultLocale="ar-SA" scoped>
        <div data-testid="rtl-shell">
          <HamburgerButton open={false} />
          <AdaptiveWorkspaceLayout
            header={<DashboardHeader title="Responsive Shell" onOpenMobileNav={() => {}} />}
            sidebar={
              <DashboardSidebar variant="mini">
                <SidebarSection title="Nav">
                  <SidebarItem active>Home</SidebarItem>
                </SidebarSection>
              </DashboardSidebar>
            }
            tabletRail={<NavigationRail items={navItems} />}
            bottomNavItems={navItems}
            detailPanel={
              <ContextualDetailPanel open onOpenChange={() => {}} title="Record Inspector">
                <p>Inspector body</p>
              </ContextualDetailPanel>
            }
          >
            <div>Workspace Content</div>
          </AdaptiveWorkspaceLayout>
        </div>
      </DirectionProvider>
    );

    expect(screen.getByTestId('rtl-shell').parentElement).toHaveAttribute('dir', 'rtl');
    expect(screen.getByRole('navigation', { name: 'Mobile bottom navigation' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Open navigation menu' }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('dialog', { name: 'Record Inspector' })).toBeInTheDocument();

    act(() => {
      setViewport(768, 1024);
    });
    expect(screen.getByRole('complementary', { name: 'Record Inspector' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navigation rail' })).toBeInTheDocument();

    act(() => {
      setViewport(1280, 800);
    });
    expect(screen.getByRole('complementary', { name: 'Record Inspector' })).toBeInTheDocument();
  });

  it('switches DataTable between responsive mobile cards (375px) and data grid table (1280px)', () => {
    act(() => {
      setViewport(375, 812);
    });
    render(
      <DataTable
        aria-label="Responsive Table"
        data={ROWS}
        columns={COLS}
        getRowId={(r) => r.id}
        responsiveCardMode="auto"
      />
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('Sample Project Alpha')).toBeInTheDocument();

    act(() => {
      setViewport(1280, 800);
    });
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
