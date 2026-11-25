import * as React from 'react';
import { Check, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  onStepSelect?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onStepSelect, className }: StepperProps) {
  return (
    <nav aria-label="Progress steps" className={cn('w-full', className)}>
      <ol className="flex flex-wrap items-center gap-3">
        {steps.map((step, idx) => {
          const completed = idx < currentStep;
          const active = idx === currentStep;
          return (
            <li key={step.id} className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={!onStepSelect}
                aria-current={active ? 'step' : undefined}
                onClick={() => onStepSelect?.(idx)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[var(--wdr-radius-md)] border px-3 py-1.5 text-left transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  completed
                    ? 'border-success/40 bg-success-subtle text-success-subtle-foreground'
                    : active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-surface text-muted-foreground'
                )}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold tabular-nums">
                  {completed ? <Check className="h-3 w-3" aria-hidden="true" /> : idx + 1}
                </span>
                <span className="text-xs font-semibold">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export interface WizardStep extends StepItem {
  content: React.ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  completeLabel?: string;
  className?: string;
}

export function Wizard({
  steps,
  currentStep: controlledStep,
  onStepChange,
  onComplete,
  completeLabel = 'Finish',
  className,
}: WizardProps) {
  const [internalStep, setInternalStep] = React.useState(0);
  const stepIndex = controlledStep ?? internalStep;
  const setStep = (idx: number) => {
    if (controlledStep === undefined) setInternalStep(idx);
    onStepChange?.(idx);
  };
  const current = steps[stepIndex];

  return (
    <Card className={cn('p-5 space-y-5', className)}>
      <Stepper steps={steps} currentStep={stepIndex} onStepSelect={setStep} />
      {current && (
        <div className="space-y-2 border-t border-border pt-4">
          <h3 className="text-base font-semibold text-foreground">{current.label}</h3>
          {current.description && <p className="text-xs text-muted-foreground">{current.description}</p>}
          <div className="pt-2">{current.content}</div>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
        <Button variant="outline" disabled={stepIndex <= 0} onClick={() => setStep(Math.max(0, stepIndex - 1))}>
          Previous
        </Button>
        {stepIndex < steps.length - 1 ? (
          <Button variant="primary" onClick={() => setStep(stepIndex + 1)}>
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={onComplete}>
            {completeLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}

export function WorkflowProgress({
  completedSteps,
  totalSteps,
  label = 'Workflow completion',
  className,
}: {
  completedSteps: number;
  totalSteps: number;
  label?: string;
  className?: string;
}) {
  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-xs tabular-nums">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {completedSteps} of {totalSteps} ({pct}%)
        </span>
      </div>
      <Progress value={pct} variant="success" size="sm" />
    </div>
  );
}

export interface TaskEntry {
  id: string;
  title: string;
  completed: boolean;
  assignee?: string;
  dueLabel?: string;
}

export function TaskItem({
  task,
  onToggle,
}: {
  task: TaskEntry;
  onToggle?: (id: string, checked: boolean) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-3.5 py-2.5">
      <div className="flex min-w-0 items-center gap-3">
        <Checkbox
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
          checked={task.completed}
          onCheckedChange={(checked) => onToggle?.(task.id, checked)}
        />
        <span className={cn('truncate text-sm', task.completed ? 'line-through text-muted-foreground' : 'font-medium text-foreground')}>
          {task.title}
        </span>
      </div>
      {(task.assignee || task.dueLabel) && (
        <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground tabular-nums">
          {task.assignee && <span>{task.assignee}</span>}
          {task.dueLabel && <span>{task.dueLabel}</span>}
        </div>
      )}
    </li>
  );
}

export function TaskList({
  title,
  tasks,
  onToggleTask,
  className,
}: {
  title?: string;
  tasks: TaskEntry[];
  onToggleTask?: (id: string, checked: boolean) => void;
  className?: string;
}) {
  const doneCount = tasks.filter((t) => t.completed).length;
  return (
    <Card className={cn('p-5 space-y-4', className)}>
      {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
      <WorkflowProgress completedSteps={doneCount} totalSteps={tasks.length} label="Tasks completed" />
      <ul className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggle={onToggleTask} />
        ))}
      </ul>
    </Card>
  );
}

export function Checklist(props: { title?: string; tasks: TaskEntry[]; onToggleTask?: (id: string, checked: boolean) => void; className?: string }) {
  return <TaskList {...props} />;
}

export interface ApprovalStep {
  id: string;
  role: string;
  approver: string;
  status: 'approved' | 'pending' | 'rejected';
  timestamp?: string;
}

export function ApprovalSteps({ steps, className }: { steps: ApprovalStep[]; className?: string }) {
  return (
    <ol aria-label="Approval workflow" className={cn('space-y-2.5', className)}>
      {steps.map((step) => (
        <li
          key={step.id}
          className="flex items-center justify-between gap-3 rounded-[var(--wdr-radius-md)] border border-border bg-surface px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            {step.status === 'approved' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            ) : step.status === 'rejected' ? (
              <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
            ) : (
              <Clock className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{step.role}</div>
              <div className="truncate text-xs text-muted-foreground">{step.approver}</div>
            </div>
          </div>
          <div className="text-right text-xs tabular-nums shrink-0">
            <div className="font-medium capitalize text-foreground">{step.status}</div>
            {step.timestamp && <div className="text-muted-foreground">{step.timestamp}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProgressTimeline(props: { steps: StepItem[]; currentStep: number; className?: string }) {
  return <Stepper {...props} />;
}
