import * as React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { MultiStepProgress, type ProgressStepItem } from '../../ui/feedback';
import { Progress } from '../../ui/progress';
import { Spinner } from '../../ui/spinner';

/* -------------------------------------------------------------------------- */
/* DependencyCheckList                                                        */
/* -------------------------------------------------------------------------- */

export interface DependencyStatusItem {
  id: string;
  name: string;
  requiredVersion?: string;
  detectedVersion?: string;
  status: 'ready' | 'checking' | 'warning' | 'missing' | 'failed';
  note?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DependencyCheckList({
  items,
  title = 'Prerequisites & dependencies',
  onRecheckAll,
  rechecking = false,
  className,
}: {
  items: DependencyStatusItem[];
  title?: string;
  onRecheckAll?: () => void;
  rechecking?: boolean;
  className?: string;
}) {
  const readyCount = items.filter((i) => i.status === 'ready').length;

  return (
    <Card className={cn('p-4 space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground tabular-nums">
            {readyCount} of {items.length} prerequisites satisfied
          </p>
        </div>
        {onRecheckAll && (
          <Button
            size="sm"
            variant="outline"
            loading={rechecking}
            onClick={onRecheckAll}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Re-check
          </Button>
        )}
      </div>

      <ul className="divide-y divide-border rounded-[var(--wdr-radius-md)] border border-border">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-xs">
            <div className="flex min-w-0 items-start gap-2.5">
              <span className="mt-0.5 shrink-0">
                {item.status === 'ready' ? (
                  <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                ) : item.status === 'checking' ? (
                  <Spinner size="xs" />
                ) : item.status === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-foreground">{item.name}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">
                  {[
                    item.requiredVersion ? `Required: ${item.requiredVersion}` : null,
                    item.detectedVersion ? `Detected: ${item.detectedVersion}` : null,
                    item.note ?? null,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
            </div>
            {item.onAction && item.actionLabel && (
              <Button size="sm" variant="outline" onClick={item.onAction}>
                {item.actionLabel}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* InstallationProgressTracker                                                */
/* -------------------------------------------------------------------------- */

export interface InstallationProgressTrackerProps {
  title?: string;
  phase: 'idle' | 'downloading' | 'installing' | 'completed' | 'failed' | 'rolled_back';
  overallProgress: number;
  steps: ProgressStepItem[];
  statusMessage?: string;
  logs?: string[];
  onRetry?: () => void;
  onRollback?: () => void;
  onCompleteNext?: () => void;
  completeNextLabel?: string;
  className?: string;
}

export function InstallationProgressTracker({
  title = 'Installation progress',
  phase,
  overallProgress,
  steps,
  statusMessage,
  logs,
  onRetry,
  onRollback,
  onCompleteNext,
  completeNextLabel = 'Continue to workspace',
  className,
}: InstallationProgressTrackerProps) {
  const [showLogs, setShowLogs] = React.useState(false);

  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {statusMessage && <p className="mt-0.5 text-xs text-muted-foreground">{statusMessage}</p>}
        </div>
        <span
          className={cn(
            'rounded-[var(--wdr-radius-sm)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
            phase === 'completed'
              ? 'bg-success-subtle text-success-subtle-foreground'
              : phase === 'failed'
                ? 'bg-destructive-subtle text-destructive-subtle-foreground'
                : phase === 'rolled_back'
                  ? 'bg-warning-subtle text-warning-subtle-foreground'
                  : 'bg-primary-subtle text-primary-subtle-foreground'
          )}
        >
          {phase.replace('_', ' ')}
        </span>
      </div>

      <Progress
        value={overallProgress}
        showValue
        variant={
          phase === 'failed' ? 'destructive' : phase === 'completed' ? 'success' : 'primary'
        }
        label="Overall installation progress"
      />

      <MultiStepProgress title="Stage breakdown" steps={steps} className="border-0 p-0 shadow-none" />

      {logs && logs.length > 0 && (
        <div>
          <button
            type="button"
            aria-expanded={showLogs}
            onClick={() => setShowLogs((s) => !s)}
            className="text-xs font-medium text-foreground underline underline-offset-4 hover:text-primary-active"
          >
            {showLogs ? 'Hide activity log' : `Show activity log (${logs.length})`}
          </button>
          {showLogs && (
            <pre className="wdr-scrollbar mt-2 max-h-36 overflow-y-auto rounded-[var(--wdr-radius-md)] border border-border bg-muted/50 p-3 font-mono text-[11px] text-foreground">
              {logs.join('\n')}
            </pre>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
        {phase === 'failed' && onRollback && (
          <Button size="sm" variant="outline" onClick={onRollback} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            Rollback changes
          </Button>
        )}
        {phase === 'failed' && onRetry && (
          <Button size="sm" variant="primary" onClick={onRetry} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
            Retry step
          </Button>
        )}
        {phase === 'completed' && onCompleteNext && (
          <Button size="sm" variant="primary" onClick={onCompleteNext} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
            {completeNextLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* SetupWizard (First-Run & Guided Configuration UI)                          */
/* -------------------------------------------------------------------------- */

export interface SetupWizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validate?: () => string | null;
}

export function SetupWizard({
  title = 'First-run setup',
  subtitle = 'Complete configuration steps to prepare this interface.',
  steps,
  onComplete,
  completionTitle = 'Setup complete',
  completionDescription = 'All configuration parameters validated cleanly.',
  nextSteps,
  className,
}: {
  title?: string;
  subtitle?: string;
  steps: SetupWizardStep[];
  onComplete?: () => void;
  completionTitle?: string;
  completionDescription?: string;
  nextSteps?: Array<{ id: string; label: string; onSelect: () => void }>;
  className?: string;
}) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [finished, setFinished] = React.useState(false);

  const current = steps[stepIdx];

  const handleNext = () => {
    const validationErr = current?.validate?.() ?? null;
    if (validationErr) {
      setError(validationErr);
      return;
    }
    setError(null);
    if (stepIdx < steps.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setFinished(true);
      onComplete?.();
    }
  };

  if (finished) {
    return (
      <Card className={cn('p-6 space-y-4', className)}>
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success-subtle text-success-subtle-foreground">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">{completionTitle}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{completionDescription}</p>
          </div>
        </div>
        {nextSteps && nextSteps.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {nextSteps.map((ns) => (
              <Button key={ns.id} size="sm" variant="outline" onClick={ns.onSelect} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                {ns.label}
              </Button>
            ))}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="border-b border-border bg-muted/35 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            Step {stepIdx + 1} / {steps.length}
          </span>
        </div>

        <ol className="mt-3 flex flex-wrap gap-2" aria-label="Setup steps">
          {steps.map((s, idx) => (
            <li key={s.id}>
              <button
                type="button"
                disabled={idx > stepIdx}
                onClick={() => {
                  setError(null);
                  setStepIdx(idx);
                }}
                className={cn(
                  'rounded-[var(--wdr-radius-sm)] border px-2.5 py-1 text-xs font-medium transition-colors',
                  idx === stepIdx
                    ? 'border-foreground bg-primary text-primary-foreground'
                    : idx < stepIdx
                      ? 'border-border bg-surface text-foreground'
                      : 'border-border bg-muted/50 text-muted-foreground opacity-60'
                )}
              >
                {idx + 1}. {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="p-5 space-y-4">
        {current && (
          <>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{current.title}</h4>
              {current.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{current.description}</p>
              )}
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-[var(--wdr-radius-sm)] border border-destructive/40 bg-destructive-subtle px-3 py-2 text-xs font-medium text-destructive-subtle-foreground"
              >
                {error}
              </div>
            )}
            <div>{current.content}</div>
          </>
        )}

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={stepIdx === 0}
            onClick={() => {
              setError(null);
              setStepIdx((i) => Math.max(0, i - 1));
            }}
          >
            Back
          </Button>
          <Button size="sm" variant="primary" onClick={handleNext}>
            {stepIdx === steps.length - 1 ? 'Finish setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* UpdateManagerPanel (UI-Only Update Notification & Stage Presentation)      */
/* -------------------------------------------------------------------------- */

export interface UpdateManagerPanelProps {
  currentVersion: string;
  availableVersion?: string;
  status: 'up_to_date' | 'checking' | 'update_available' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress?: number;
  releaseNotes?: string[];
  onCheckUpdates?: () => void;
  onStartUpdate?: () => void;
  onRetry?: () => void;
  onRollback?: () => void;
  className?: string;
}

export function UpdateManagerPanel({
  currentVersion,
  availableVersion,
  status,
  progress = 0,
  releaseNotes,
  onCheckUpdates,
  onStartUpdate,
  onRetry,
  onRollback,
  className,
}: UpdateManagerPanelProps) {
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-foreground" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Application update manager</h3>
            <p className="text-xs text-muted-foreground tabular-nums">
              Current version: <span className="font-mono font-semibold text-foreground">{currentVersion}</span>
              {availableVersion && (
                <>
                  {' '}
                  → Available: <span className="font-mono font-semibold text-foreground">{availableVersion}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onCheckUpdates && (status === 'up_to_date' || status === 'completed') && (
            <Button size="sm" variant="outline" onClick={onCheckUpdates} leftIcon={<RefreshCw className="h-3.5 w-3.5" />}>
              Check for updates
            </Button>
          )}
          {status === 'update_available' && onStartUpdate && (
            <Button size="sm" variant="primary" onClick={onStartUpdate} leftIcon={<Download className="h-3.5 w-3.5" />}>
              Install update
            </Button>
          )}
          {status === 'failed' && onRollback && (
            <Button size="sm" variant="outline" onClick={onRollback} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
              Rollback
            </Button>
          )}
          {status === 'failed' && onRetry && (
            <Button size="sm" variant="primary" onClick={onRetry}>
              Retry
            </Button>
          )}
        </div>
      </div>

      {status === 'checking' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
          <Spinner size="xs" />
          <span>Checking release manifest…</span>
        </div>
      )}

      {(status === 'downloading' || status === 'installing') && (
        <Progress
          value={progress}
          showValue
          label={status === 'downloading' ? 'Downloading update bundle' : 'Applying configuration'}
        />
      )}

      {status === 'update_available' && releaseNotes && releaseNotes.length > 0 && (
        <div className="rounded-[var(--wdr-radius-md)] border border-border bg-muted/40 p-3 space-y-1.5">
          <div className="text-xs font-semibold text-foreground">Release highlights</div>
          <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground">
            {releaseNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {status === 'completed' && (
        <div role="status" className="rounded-[var(--wdr-radius-sm)] bg-success-subtle px-3 py-2 text-xs font-medium text-success-subtle-foreground">
          Update applied cleanly.
        </div>
      )}

      {status === 'failed' && (
        <div role="alert" className="rounded-[var(--wdr-radius-sm)] bg-destructive-subtle px-3 py-2 text-xs font-medium text-destructive-subtle-foreground">
          Update verification failed. Use Retry or Rollback to restore the previous state.
        </div>
      )}
    </Card>
  );
}
