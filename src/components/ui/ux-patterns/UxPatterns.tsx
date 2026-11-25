import * as React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Circle,
  Compass,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../button';
import { Card } from '../card';
import { Progress } from '../progress';

/* -------------------------------------------------------------------------- */
/* OnboardingChecklist                                                        */
/* -------------------------------------------------------------------------- */

export interface OnboardingStepItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export interface OnboardingChecklistProps {
  title?: string;
  subtitle?: string;
  steps: OnboardingStepItem[];
  onToggleStep?: (id: string, completed: boolean) => void;
  onDismiss?: () => void;
  className?: string;
}

export function OnboardingChecklist({
  title = 'Workspace setup checklist',
  subtitle = 'Complete these recommended steps to configure your environment.',
  steps,
  onToggleStep,
  onDismiss,
  className,
}: OnboardingChecklistProps) {
  const completedCount = steps.filter((s) => s.completed).length;
  const pct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-active" aria-hidden="true" />
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss onboarding checklist"
            onClick={onDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--wdr-radius-sm)] text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs tabular-nums">
          <span className="font-medium text-foreground">Setup progress</span>
          <span className="text-muted-foreground">
            {completedCount} / {steps.length} ({pct}%)
          </span>
        </div>
        <Progress value={pct} variant="primary" size="sm" />
      </div>

      <ul className="space-y-2">
        {steps.map((step) => (
          <li
            key={step.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3.5 py-2.5"
          >
            <div className="flex min-w-0 items-start gap-2.5">
              <button
                type="button"
                aria-label={`Mark ${step.title} as ${step.completed ? 'incomplete' : 'complete'}`}
                onClick={() => onToggleStep?.(step.id, !step.completed)}
                className="mt-0.5 shrink-0 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
              >
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </button>
              <div className="min-w-0">
                <div
                  className={cn(
                    'text-sm font-medium',
                    step.completed ? 'line-through text-muted-foreground' : 'text-foreground'
                  )}
                >
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">{step.description}</div>
                )}
              </div>
            </div>
            {step.onAction && !step.completed && (
              <Button variant="outline" size="sm" onClick={step.onAction}>
                {step.actionLabel ?? 'Start'}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* GuidedTour                                                                 */
/* -------------------------------------------------------------------------- */

export interface GuidedTourStep {
  id: string;
  title: string;
  description: string;
  targetLabel?: string;
}

export interface GuidedTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: GuidedTourStep[];
  currentStep?: number;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
  className?: string;
}

export function GuidedTour({
  open,
  onOpenChange,
  steps,
  currentStep: controlledStep,
  onStepChange,
  onComplete,
  className,
}: GuidedTourProps) {
  const [internalStep, setInternalStep] = React.useState(0);
  const stepIndex = controlledStep ?? internalStep;
  const setStep = (idx: number) => {
    if (controlledStep === undefined) setInternalStep(idx);
    onStepChange?.(idx);
  };

  React.useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onOpenChange]);

  if (!open || steps.length === 0) return null;
  const active = steps[Math.min(stepIndex, steps.length - 1)];

  return (
    <div
      role="dialog"
      aria-label={`Guided tour: ${active.title}`}
      className={cn(
        'fixed bottom-5 right-5 z-[65] w-[min(92vw,380px)] rounded-[var(--wdr-radius-lg)] border-2 border-foreground bg-surface-elevated p-5 shadow-[var(--wdr-shadow-lg)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-subtle-foreground">
          <Compass className="h-4 w-4 text-primary-active" aria-hidden="true" />
          <span className="tabular-nums">
            Step {stepIndex + 1} of {steps.length}
          </span>
          {active.targetLabel && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {active.targetLabel}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Close guided tour"
          onClick={() => onOpenChange(false)}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <h3 className="mt-2.5 text-base font-semibold text-foreground">{active.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{active.description}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          Skip tour
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={stepIndex <= 0}
            onClick={() => setStep(Math.max(0, stepIndex - 1))}
          >
            Back
          </Button>
          {stepIndex < steps.length - 1 ? (
            <Button variant="primary" size="sm" onClick={() => setStep(stepIndex + 1)}>
              Next
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onComplete?.();
                onOpenChange(false);
              }}
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SavedViewsBar                                                              */
/* -------------------------------------------------------------------------- */

export interface SavedViewSpec {
  id: string;
  label: string;
  count?: number;
  pinned?: boolean;
}

export interface SavedViewsBarProps {
  views: SavedViewSpec[];
  activeViewId: string;
  onSelectView: (id: string) => void;
  onSaveView?: (name: string) => void;
  onDeleteView?: (id: string) => void;
  className?: string;
}

export function SavedViewsBar({
  views,
  activeViewId,
  onSelectView,
  onSaveView,
  onDeleteView,
  className,
}: SavedViewsBarProps) {
  const [creating, setCreating] = React.useState(false);
  const [draftName, setDraftName] = React.useState('');

  return (
    <div
      role="region"
      aria-label="Saved views"
      className={cn('flex flex-wrap items-center justify-between gap-2', className)}
    >
      <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="View presets">
        {views.map((view) => {
          const active = view.id === activeViewId;
          return (
            <div key={view.id} className="inline-flex items-center">
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectView(view.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[var(--wdr-radius-md)] border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-surface text-foreground hover:bg-muted'
                )}
              >
                <Bookmark className="h-3 w-3" aria-hidden="true" />
                <span>{view.label}</span>
                {view.count !== undefined && (
                  <span className="opacity-75 tabular-nums">({view.count})</span>
                )}
              </button>
              {onDeleteView && !view.pinned && (
                <button
                  type="button"
                  aria-label={`Delete view ${view.label}`}
                  onClick={() => onDeleteView(view.id)}
                  className="ml-0.5 inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {onSaveView && (
        <div className="flex items-center gap-1.5">
          {creating ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (draftName.trim()) {
                  onSaveView(draftName.trim());
                  setDraftName('');
                  setCreating(false);
                }
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                aria-label="New view name"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="View name…"
                className="h-8 w-36 rounded-[var(--wdr-radius-sm)] border border-input bg-surface px-2.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="sm" variant="primary">
                Save
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setCreating(false)}>
                Cancel
              </Button>
            </form>
          ) : (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setCreating(true)}
            >
              Save view
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UndoBanner                                                                 */
/* -------------------------------------------------------------------------- */

export function UndoBanner({
  message,
  canUndo,
  onUndo,
  onDismiss,
  className,
}: {
  message: React.ReactNode;
  canUndo: boolean;
  onUndo: () => void;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-accent px-4 py-2.5 text-xs text-accent-foreground shadow-[var(--wdr-shadow-md)]',
        className
      )}
    >
      <span className="font-medium">{message}</span>
      <div className="flex items-center gap-2 shrink-0">
        {canUndo && (
          <button
            type="button"
            onClick={onUndo}
            className="inline-flex items-center gap-1 rounded-[var(--wdr-radius-sm)] bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Undo</span>
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
