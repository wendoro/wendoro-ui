import * as React from 'react';
import {
  Briefcase,
  Command,
  Layers,
  Monitor,
  Moon,
  Palette,
  Sliders,
  Sun,
} from 'lucide-react';
import { FoundationsSection } from './app/FoundationsSection';
import { CoreControlsSection } from './app/CoreControlsSection';
import { FeedbackAndNavSection } from './app/FeedbackAndNavSection';
import { BusinessShowcaseSection } from './app/BusinessShowcaseSection';
import { NotificationCenter, type NotificationCenterItem } from './components/business/notification-center';
import { Button } from './components/ui/button';
import { CommandPalette, type CommandItem } from './components/ui/command';
import { Container } from './components/ui/container';
import { Sidebar, SidebarItem, SidebarSection } from './components/ui/sidebar';
import { ToastProvider } from './components/ui/toast';
import { ThemeProvider, useTheme, type ThemeMode } from './hooks/use-theme';

type PreviewSectionId = 'foundations' | 'core' | 'feedback' | 'business';

const INITIAL_NOTIFICATIONS: NotificationCenterItem[] = [
  {
    id: 'n1',
    title: 'Design tokens synchronized',
    description: 'Light and dark semantic variables updated for @wendoro/ui.',
    timestamp: '5m ago',
    source: 'Wendoro Studio',
    tone: 'success',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Invoice approval pending',
    description: 'Kaveri Logistics order #INV-1042 awaiting dual sign-off.',
    timestamp: '22m ago',
    source: 'Wendoro Flow',
    tone: 'warning',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Weekly accessibility report',
    description: 'All 42 primitive and business components passed keyboard checks.',
    timestamp: '3h ago',
    source: 'Wendoro Platform',
    tone: 'neutral',
    unread: false,
  },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const options: Array<{ mode: ThemeMode; label: string; icon: React.ReactNode }> = [
    { mode: 'light', label: 'Light', icon: <Sun className="h-3.5 w-3.5" aria-hidden="true" /> },
    { mode: 'dark', label: 'Dark', icon: <Moon className="h-3.5 w-3.5" aria-hidden="true" /> },
    { mode: 'system', label: 'System', icon: <Monitor className="h-3.5 w-3.5" aria-hidden="true" /> },
  ];

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="inline-flex items-center gap-0.5 rounded-[var(--wdr-radius-md)] border border-border bg-muted p-0.5"
    >
      {options.map((opt) => {
        const active = theme === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            aria-pressed={active}
            onClick={() => setTheme(opt.mode)}
            className={`inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-small,4px)] px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active
                ? 'bg-surface text-foreground shadow-[var(--wdr-shadow-sm)]'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function DesignSystemWorkspace() {
  const [activeSection, setActiveSection] = React.useState<PreviewSectionId>('foundations');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<NotificationCenterItem[]>(INITIAL_NOTIFICATIONS);
  const { setTheme } = useTheme();

  const commandItems: CommandItem[] = React.useMemo(
    () => [
      {
        id: 'nav-foundations',
        label: 'View Foundations & Tokens',
        group: 'Navigation',
        icon: <Palette className="h-4 w-4" />,
        shortcut: '1',
        onSelect: () => setActiveSection('foundations'),
      },
      {
        id: 'nav-core',
        label: 'View Core & Form Controls',
        group: 'Navigation',
        icon: <Sliders className="h-4 w-4" />,
        shortcut: '2',
        onSelect: () => setActiveSection('core'),
      },
      {
        id: 'nav-feedback',
        label: 'View Feedback, Overlays & Navigation',
        group: 'Navigation',
        icon: <Layers className="h-4 w-4" />,
        shortcut: '3',
        onSelect: () => setActiveSection('feedback'),
      },
      {
        id: 'nav-business',
        label: 'View Business Application Patterns',
        group: 'Navigation',
        icon: <Briefcase className="h-4 w-4" />,
        shortcut: '4',
        onSelect: () => setActiveSection('business'),
      },
      {
        id: 'theme-light',
        label: 'Switch to Light Theme',
        group: 'Theme',
        icon: <Sun className="h-4 w-4" />,
        onSelect: () => setTheme('light'),
      },
      {
        id: 'theme-dark',
        label: 'Switch to Dark Theme',
        group: 'Theme',
        icon: <Moon className="h-4 w-4" />,
        onSelect: () => setTheme('dark'),
      },
    ],
    [setTheme]
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:block shrink-0">
        <Sidebar
          collapsible
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          className="sticky top-0 h-screen"
          header={
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--wdr-radius-small,4px)] bg-primary text-xs font-bold text-primary-foreground"
              >
                W
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold tracking-tight">Wendoro UI</div>
                <div className="truncate text-[11px] text-muted-foreground">Business, connected.</div>
              </div>
            </div>
          }
          footer={
            !sidebarCollapsed ? (
              <div className="text-xs text-muted-foreground">
                <div className="font-medium text-foreground">@wendoro/ui</div>
                <div>v0.1.0 · wendoro.in</div>
              </div>
            ) : undefined
          }
        >
          <SidebarSection title="Design System">
            <SidebarItem
              icon={<Palette className="h-4 w-4" />}
              active={activeSection === 'foundations'}
              onClick={() => setActiveSection('foundations')}
            >
              Foundations
            </SidebarItem>
            <SidebarItem
              icon={<Sliders className="h-4 w-4" />}
              active={activeSection === 'core'}
              onClick={() => setActiveSection('core')}
            >
              Core & Forms
            </SidebarItem>
            <SidebarItem
              icon={<Layers className="h-4 w-4" />}
              active={activeSection === 'feedback'}
              onClick={() => setActiveSection('feedback')}
            >
              Feedback & Nav
            </SidebarItem>
            <SidebarItem
              icon={<Briefcase className="h-4 w-4" />}
              active={activeSection === 'business'}
              onClick={() => setActiveSection('business')}
            >
              Business Patterns
            </SidebarItem>
          </SidebarSection>
        </Sidebar>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-xs">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <span className="text-base font-bold tracking-tight md:hidden">Wendoro UI</span>
              <span className="hidden text-sm font-medium text-muted-foreground md:inline">
                Shared Design System & Component Preview
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Command className="h-3.5 w-3.5" />}
                onClick={() => setCommandOpen(true)}
              >
                <span>Commands</span>
                <kbd className="ml-1 hidden rounded border border-border bg-muted px-1 font-mono text-[10px] text-muted-foreground sm:inline">
                  ⌘K
                </kbd>
              </Button>

              <NotificationCenter
                items={notifications}
                onMarkRead={(id) =>
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
                  )
                }
                onMarkAllRead={() =>
                  setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                }
                onDismiss={(id) =>
                  setNotifications((prev) => prev.filter((n) => n.id !== id))
                }
              />

              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
            {(
              [
                ['foundations', 'Foundations'],
                ['core', 'Core & Forms'],
                ['feedback', 'Feedback & Nav'],
                ['business', 'Business'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`rounded-[var(--wdr-radius-small,4px)] px-3 py-1.5 text-xs font-medium whitespace-nowrap ${
                  activeSection === id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 py-8">
          <Container size="xl">
            <div className="mb-8 rounded-[var(--wdr-radius-lg)] border border-border bg-surface p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-muted-foreground">
                    Wendoro Design System · Business, connected.
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Unified UI Architecture for the Wendoro Ecosystem
                  </h1>
                  <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
                    Production primitives, semantic CSS tokens, accessible interactions, and reusable business patterns built for Desk, Flow, Platform, Studio, Insights, Support, Commerce, and People.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  <Button variant="primary" onClick={() => setActiveSection('business')}>
                    Inspect Business Suite
                  </Button>
                  <Button variant="outline" onClick={() => setActiveSection('core')}>
                    Explore Primitives
                  </Button>
                </div>
              </div>
            </div>

            {activeSection === 'foundations' && <FoundationsSection />}
            {activeSection === 'core' && <CoreControlsSection />}
            {activeSection === 'feedback' && <FeedbackAndNavSection />}
            {activeSection === 'business' && <BusinessShowcaseSection />}
          </Container>
        </main>
      </div>

      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        items={commandItems}
        enableGlobalShortcut
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ToastProvider>
        <DesignSystemWorkspace />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
