import * as React from 'react';
import {
  Eye,
  Maximize2,
  Minimize2,
  Move,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Presentation,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { BottomSheet } from '../../ui/mobile/MobilePrimitives';
import { useBreakpoint } from '../../../hooks/use-breakpoint';

/* -------------------------------------------------------------------------- */
/* WorkspaceModeContainer (Standard / Focus / Presentation / Fullscreen)      */
/* -------------------------------------------------------------------------- */

export type WorkspacePresentationMode = 'standard' | 'focus' | 'presentation' | 'fullscreen';

export interface WorkspaceModeContainerProps {
  mode?: WorkspacePresentationMode;
  onModeChange?: (mode: WorkspacePresentationMode) => void;
  title?: string;
  toolbarExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function WorkspaceModeContainer({
  mode: controlledMode,
  onModeChange,
  title = 'Workspace view',
  toolbarExtra,
  children,
  className,
}: WorkspaceModeContainerProps) {
  const [internalMode, setInternalMode] = React.useState<WorkspacePresentationMode>('standard');
  const mode = controlledMode ?? internalMode;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const setMode = React.useCallback(
    (next: WorkspacePresentationMode) => {
      if (controlledMode === undefined) setInternalMode(next);
      onModeChange?.(next);
      if (next === 'fullscreen' && typeof document !== 'undefined') {
        try {
          if (containerRef.current?.requestFullscreen && !document.fullscreenElement) {
            void containerRef.current.requestFullscreen().catch(() => {});
          }
        } catch {
          // Graceful CSS fixed-viewport fallback
        }
      } else if (typeof document !== 'undefined' && document.fullscreenElement) {
        try {
          void document.exitFullscreen().catch(() => {});
        } catch {
          // Ignore
        }
      }
    },
    [controlledMode, onModeChange]
  );

  React.useEffect(() => {
    if (mode === 'standard' || typeof document === 'undefined') return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMode('standard');
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mode, setMode]);

  const isElevatedViewport = mode === 'focus' || mode === 'presentation' || mode === 'fullscreen';

  return (
    <div
      ref={containerRef}
      data-workspace-mode={mode}
      className={cn(
        'flex flex-col rounded-[var(--wdr-radius-lg)] border border-border bg-surface transition-all',
        isElevatedViewport && 'fixed inset-0 z-50 rounded-none border-0 bg-background',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5',
          mode === 'presentation' && 'bg-surface/90'
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-xs font-semibold text-foreground">{title}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
            {mode}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {toolbarExtra}
          <Button
            size="sm"
            variant={mode === 'focus' ? 'primary' : 'outline'}
            onClick={() => setMode(mode === 'focus' ? 'standard' : 'focus')}
            leftIcon={<Eye className="h-3.5 w-3.5" />}
          >
            Focus
          </Button>
          <Button
            size="sm"
            variant={mode === 'presentation' ? 'primary' : 'outline'}
            onClick={() => setMode(mode === 'presentation' ? 'standard' : 'presentation')}
            leftIcon={<Presentation className="h-3.5 w-3.5" />}
          >
            Present
          </Button>
          <Button
            size="sm"
            variant={mode === 'fullscreen' ? 'primary' : 'outline'}
            onClick={() => setMode(mode === 'fullscreen' ? 'standard' : 'fullscreen')}
            leftIcon={mode === 'fullscreen' ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          >
            {mode === 'fullscreen' ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className={cn('wdr-scrollbar flex-1 overflow-auto p-4', mode === 'presentation' && 'p-8')}>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DockablePanel                                                              */
/* -------------------------------------------------------------------------- */

export type PanelDockPosition = 'left' | 'right' | 'bottom' | 'floating' | 'collapsed';

export interface DockablePanelProps {
  title: string;
  position?: PanelDockPosition;
  onPositionChange?: (pos: PanelDockPosition) => void;
  children: React.ReactNode;
  className?: string;
}

export function DockablePanel({
  title,
  position: controlledPos,
  onPositionChange,
  children,
  className,
}: DockablePanelProps) {
  const { isMobile } = useBreakpoint();
  const [internalPos, setInternalPos] = React.useState<PanelDockPosition>('right');
  const position = controlledPos ?? internalPos;

  const updatePos = (next: PanelDockPosition) => {
    if (controlledPos === undefined) setInternalPos(next);
    onPositionChange?.(next);
  };

  if (position === 'collapsed') {
    return (
      <div className="flex items-center justify-center rounded-[var(--wdr-radius-md)] border border-border bg-surface p-2">
        <Button size="sm" variant="outline" onClick={() => updatePos('right')}>
          Restore {title}
        </Button>
      </div>
    );
  }

  if (isMobile && position !== 'floating') {
    return (
      <div className={cn('rounded-[var(--wdr-radius-md)] border border-border bg-surface p-3', className)}>
        <div className="mb-2 flex items-center justify-between gap-2 border-b border-border pb-2">
          <span className="text-xs font-semibold text-foreground">{title}</span>
          <Button size="sm" variant="ghost" onClick={() => updatePos('collapsed')}>
            Collapse
          </Button>
        </div>
        {children}
      </div>
    );
  }

  if (position === 'floating') {
    return (
      <BottomSheet open onOpenChange={(o) => !o && updatePos('right')} title={title} snap="half">
        {children}
      </BottomSheet>
    );
  }

  return (
    <aside
      aria-label={`${title} (${position} dock)`}
      data-dock={position}
      className={cn(
        'flex flex-col rounded-[var(--wdr-radius-md)] border border-border bg-surface',
        position === 'bottom' ? 'w-full' : 'w-full lg:w-72 shrink-0',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="truncate text-xs font-semibold text-foreground">{title}</span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Dock left"
            onClick={() => updatePos('left')}
            className={cn('inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted', position === 'left' && 'bg-primary text-primary-foreground')}
          >
            <PanelLeft className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Dock right"
            onClick={() => updatePos('right')}
            className={cn('inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted', position === 'right' && 'bg-primary text-primary-foreground')}
          >
            <PanelRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Dock bottom"
            onClick={() => updatePos('bottom')}
            className={cn('inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted', position === 'bottom' && 'bg-primary text-primary-foreground')}
          >
            <PanelBottom className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={`Collapse ${title}`}
            onClick={() => updatePos('collapsed')}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="wdr-scrollbar-thin flex-1 overflow-auto p-3 text-xs">{children}</div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* FloatingWindow (Draggable & Keyboard-Movable Tool Window)                  */
/* -------------------------------------------------------------------------- */

export interface FloatingWindowProps {
  open: boolean;
  onClose?: () => void;
  title: string;
  initialPosition?: { x: number; y: number };
  width?: number;
  children: React.ReactNode;
  className?: string;
}

export function FloatingWindow({
  open,
  onClose,
  title,
  initialPosition = { x: 24, y: 24 },
  width = 320,
  children,
  className,
}: FloatingWindowProps) {
  const [pos, setPos] = React.useState(initialPosition);
  const [minimized, setMinimized] = React.useState(false);

  if (!open) return null;

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = pos;
    const onMove = (evt: PointerEvent) => {
      setPos({
        x: Math.max(0, origin.x + (evt.clientX - startX)),
        y: Math.max(0, origin.y + (evt.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      role="dialog"
      aria-label={title}
      style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `min(92vw, ${width}px)` }}
      className={cn(
        'absolute z-40 overflow-hidden rounded-[var(--wdr-radius-lg)] border border-border bg-surface-elevated shadow-[var(--wdr-shadow-lg)]',
        className
      )}
    >
      <div
        tabIndex={0}
        aria-label={`${title} drag handle (use arrow keys to move)`}
        onPointerDown={startDrag}
        onKeyDown={(e) => {
          const step = 16;
          if (e.key === 'ArrowRight') setPos((p) => ({ ...p, x: p.x + step }));
          else if (e.key === 'ArrowLeft') setPos((p) => ({ ...p, x: Math.max(0, p.x - step) }));
          else if (e.key === 'ArrowDown') setPos((p) => ({ ...p, y: p.y + step }));
          else if (e.key === 'ArrowUp') setPos((p) => ({ ...p, y: Math.max(0, p.y - step) }));
        }}
        className="flex cursor-move items-center justify-between gap-2 border-b border-border bg-muted/60 px-3 py-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Move className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate text-xs font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={minimized ? 'Expand floating window' : 'Minimize floating window'}
            onClick={(e) => {
              e.stopPropagation();
              setMinimized((m) => !m);
            }}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {minimized ? <Maximize2 className="h-3 w-3" aria-hidden="true" /> : <Minimize2 className="h-3 w-3" aria-hidden="true" />}
          </button>
          {onClose && (
            <button
              type="button"
              aria-label={`Close ${title}`}
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {!minimized && <div className="p-3 text-xs text-foreground">{children}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MultiPanelWorkspace                                                        */
/* -------------------------------------------------------------------------- */

export interface MultiPanelWorkspaceProps {
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  floatingSlot?: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function MultiPanelWorkspace({
  leftPanel,
  rightPanel,
  bottomPanel,
  floatingSlot,
  title = 'Multi-panel studio',
  children,
  className,
}: MultiPanelWorkspaceProps) {
  return (
    <WorkspaceModeContainer title={title} className={cn('relative min-h-[420px]', className)}>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row">
          {leftPanel && <div className="lg:w-64 shrink-0">{leftPanel}</div>}
          <div className="min-w-0 flex-1 rounded-[var(--wdr-radius-md)] border border-border bg-background p-4">
            {children}
          </div>
          {rightPanel && <div className="lg:w-72 shrink-0">{rightPanel}</div>}
        </div>
        {bottomPanel && <div>{bottomPanel}</div>}
      </div>
      {floatingSlot}
    </WorkspaceModeContainer>
  );
}
